import { redirect } from "next/navigation";

import {
  Mail,
  Phone,
  User2,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import UpdateProfileForm from "@/components/students/profile/UpdateProfileForm";

export default async function StudentProfilePage() {
  const supabase =
    await createClient();

  // AUTH
  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // PROFILE
  const { data: profile } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          My Profile
        </h1>

        <p className="mt-1 text-muted-foreground">
          Manage your account
          settings and personal
          information.
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          {/* AVATAR */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-black text-3xl font-bold text-white">
            {profile?.name
              ?.charAt(0)
              ?.toUpperCase() ||
              "S"}
          </div>

          <h2 className="mt-4 text-2xl font-bold">
            {profile?.name ||
              "Student"}
          </h2>

          <p className="mt-1 text-muted-foreground">
            Student Account
          </p>
        </div>

        {/* INFO GRID */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* NAME */}
          <div className="rounded-2xl border p-5">
            <div className="flex items-center gap-2">
              <User2 className="h-5 w-5 text-muted-foreground" />

              <p className="text-sm text-muted-foreground">
                Full Name
              </p>
            </div>

            <h3 className="mt-3 text-lg font-semibold">
              {profile?.name ||
                "-"}
            </h3>
          </div>

          {/* EMAIL */}
          <div className="rounded-2xl border p-5">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />

              <p className="text-sm text-muted-foreground">
                Email Address
              </p>
            </div>

            <h3 className="mt-3 break-all text-lg font-semibold">
              {profile?.email ||
                user.email}
            </h3>
          </div>

          {/* PHONE */}
          <div className="rounded-2xl border p-5">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />

              <p className="text-sm text-muted-foreground">
                Phone Number
              </p>
            </div>

            <h3 className="mt-3 text-lg font-semibold">
              {profile?.phone ||
                "-"}
            </h3>
          </div>

          {/* ROLE */}
          <div className="rounded-2xl border p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />

              <p className="text-sm text-muted-foreground">
                Role
              </p>
            </div>

            <h3 className="mt-3 text-lg font-semibold capitalize">
              {profile?.role ||
                "student"}
            </h3>
          </div>
        </div>
      </div>

      {/* UPDATE FORM */}
      <UpdateProfileForm
        userId={user.id}
        initialName={
          profile?.name || ""
        }
        initialPhone={
          profile?.phone || ""
        }
      />
    </div>
  );
}