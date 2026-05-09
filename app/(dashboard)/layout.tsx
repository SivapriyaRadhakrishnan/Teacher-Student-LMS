import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

import { createClient } from "@/lib/supabase/server";

import type { UserRole } from "@/lib/supabase/types";

type DashboardLayoutProps = {
  children: ReactNode;
};

type DashboardProfile = {
  name: string | null;
  email: string | null;
  role: UserRole;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const supabase = await createClient();

  // AUTH USER
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // NOT LOGGED IN
  if (!user) {
    redirect("/login");
  }

  // PROFILE
  const { data: profile } =
    await supabase
      .from("profiles")
      .select(`
        name,
        email,
        role
      `)
      .eq("id", user.id)
      .single();

  // INVALID PROFILE
  if (!profile?.role) {
    redirect("/login");
  }

  // PROFILE OBJECT
  const dashboardProfile: DashboardProfile =
    {
      name: profile.name,
      email:
        profile.email ||
        user.email ||
        null,
      role: profile.role,
    };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* SIDEBAR */}
      <Sidebar
        role={
          dashboardProfile.role
        }
      />

      {/* MAIN CONTENT */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* HEADER */}
        <Header
          profile={
            dashboardProfile
          }
        />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}