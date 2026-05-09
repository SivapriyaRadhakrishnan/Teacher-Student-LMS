"use client";

import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  BarChart3,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/supabase/types";

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

type SidebarProps = {
  role: UserRole;
  className?: string;
};

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  teacher: "Teacher",
  student: "Student",
};

const navigation: Record<UserRole, NavItem[]> = {
  admin: [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },

    {
      title: "Teachers",
      href: "/admin/teachers",
      icon: Users,
    },

    {
      title: "Students",
      href: "/admin/students",
      icon: GraduationCap,
    },

    {
      title: "Years & Batches",
      href: "/admin/batches",
      icon: BookOpen,
    },

    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },

    {
      title: "Settings",
      href: "/admin/settings",
      icon: FileText,
    },
  ],

  teacher: [
    { title: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { title: "Years", href: "/teacher/years", icon: GraduationCap },
    { title: "Batches", href: "/teacher/batches", icon: GraduationCap },
    { title: "Students", href: "/teacher/students", icon: Users },
    { title: "Assignments", href: "/teacher/assignments", icon: BookOpen },
    { title: "Submissions", href: "/teacher/submissions", icon: ClipboardCheck },
    { title: "Analytics", href: "/teacher/analytics", icon: BarChart3 },
  ],
  student: [
  {
    title: "Dashboard",
    href: "/student",
    icon: LayoutDashboard,
  },

  {
    title: "Assignments",
    href: "/student/assignments",
    icon: BookOpen,
  },

  {
    title: "Submissions",
    href: "/student/submissions",
    icon: ClipboardCheck,
  },

  {
    title: "Feedback",
    href: "/student/feedback",
    icon: FileText,
  },

  {
    title: "Profile",
    href: "/student/profile",
    icon: Users,
  },
],
};

export function DashboardNav({ role, className }: SidebarProps) {
  const pathname = usePathname();
  const items = navigation[role];

  return (
    <nav className={cn("space-y-1", className)} aria-label="Dashboard navigation">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== `/${role}` && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              isActive && "bg-muted text-foreground"
            )}
          >
            <Icon className="size-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar({ role, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "hidden min-h-screen w-64 shrink-0 border-r bg-background px-4 py-4 lg:block",
        className
      )}
    >
      <div className="flex h-full flex-col">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link href={`/${role}`} className="min-w-0">
            <div className="truncate text-base font-semibold">LMS Portal</div>
            <div className="truncate text-xs text-muted-foreground">
              Student Teacher
            </div>
          </Link>
          <Badge variant="secondary">{roleLabels[role]}</Badge>
        </div>

        <DashboardNav role={role} />
      </div>
    </aside>
  );
}
