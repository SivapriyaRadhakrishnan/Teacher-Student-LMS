import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  GraduationCap,
  
} from "lucide-react";

import LoginForm from "@/components/auth/LoginForm";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Login | Student Teacher LMS",
};

export default async function LoginPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (user) {
    const { data: profile } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    redirect(
      getDashboardPath(
        profile?.role
      )
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" />

      {/* GLOW EFFECTS */}
      <div className="absolute top-[-120px] left-[-120px] h-[320px] w-[320px] rounded-full bg-white/10 blur-3xl animate-pulse" />

      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-gray-500/10 blur-3xl animate-pulse" />

      {/* GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* CONTENT */}
      <div className="relative z-10 w-full max-w-md">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-black shadow-2xl transition-transform duration-300 hover:scale-105">
            <GraduationCap className="h-10 w-10" />
          </div>

          

          <h1 className="text-4xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>

          <p className="mt-3 text-lg text-gray-400">
            Login to continue to your
            dashboard
          </p>
        </div>

        {/* LOGIN FORM */}
        <LoginForm />
      </div>
    </div>
  );
}