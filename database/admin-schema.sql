-- Admin database design for the Student & Teacher LMS.
-- Run this in Supabase SQL editor after the existing LMS tables are present.
-- The app currently uses `profiles` for application users and Supabase Auth
-- for login accounts.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin', 'teacher', 'student');
  end if;

  if not exists (select 1 from pg_type where typname = 'account_status') then
    create type public.account_status as enum ('active', 'inactive', 'suspended');
  end if;

  if not exists (select 1 from pg_type where typname = 'audit_action') then
    create type public.audit_action as enum (
      'create',
      'update',
      'delete',
      'activate',
      'deactivate',
      'login',
      'role_change'
    );
  end if;
end $$;

alter table public.profiles
  add column if not exists status public.account_status not null default 'active',
  add column if not exists created_by uuid references public.profiles(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.institutes (
  id uuid primary key default gen_random_uuid(),
  institute_name text not null,
  email text,
  phone text,
  address text,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teacher_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  institute_id uuid references public.institutes(id) on delete set null,
  designation text,
  department text,
  bio text,
  joined_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role public.user_role not null,
  invited_by uuid not null references public.profiles(id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(32), 'hex'),
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  constraint admin_invites_role_check check (role in ('admin', 'teacher'))
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action public.audit_action not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_status_idx on public.profiles(status);
create index if not exists profiles_created_by_idx on public.profiles(created_by);
create index if not exists teacher_profiles_user_id_idx on public.teacher_profiles(user_id);
create index if not exists teacher_profiles_institute_id_idx on public.teacher_profiles(institute_id);
create index if not exists admin_invites_email_idx on public.admin_invites(email);
create index if not exists audit_logs_actor_id_idx on public.audit_logs(actor_id);
create index if not exists audit_logs_entity_idx on public.audit_logs(entity_type, entity_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists institutes_set_updated_at on public.institutes;
create trigger institutes_set_updated_at
before update on public.institutes
for each row execute function public.set_updated_at();

drop trigger if exists teacher_profiles_set_updated_at on public.teacher_profiles;
create trigger teacher_profiles_set_updated_at
before update on public.teacher_profiles
for each row execute function public.set_updated_at();

create or replace function public.current_user_role()
returns public.user_role
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

alter table public.institutes enable row level security;
alter table public.teacher_profiles enable row level security;
alter table public.admin_invites enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "Admins can manage institutes" on public.institutes;
create policy "Admins can manage institutes"
on public.institutes
for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "Admins can manage teacher profiles" on public.teacher_profiles;
create policy "Admins can manage teacher profiles"
on public.teacher_profiles
for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "Teachers can view own teacher profile" on public.teacher_profiles;
create policy "Teachers can view own teacher profile"
on public.teacher_profiles
for select
using (user_id = auth.uid());

drop policy if exists "Admins can manage admin invites" on public.admin_invites;
create policy "Admins can manage admin invites"
on public.admin_invites
for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "Admins can view audit logs" on public.audit_logs;
create policy "Admins can view audit logs"
on public.audit_logs
for select
using (public.current_user_role() = 'admin');

drop policy if exists "Admins can create audit logs" on public.audit_logs;
create policy "Admins can create audit logs"
on public.audit_logs
for insert
with check (public.current_user_role() = 'admin');

-- Optional bootstrap after creating an auth user in Supabase Authentication.
-- Replace values, then run once:
--
-- insert into public.profiles (id, name, email, role, status)
-- values ('AUTH_USER_ID', 'Admin Name', 'admin@example.com', 'admin', 'active')
-- on conflict (id) do update
-- set role = 'admin',
--     status = 'active',
--     updated_at = now();
