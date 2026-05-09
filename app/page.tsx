import { redirect } from "next/navigation";

import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  BarChart3,
  BellRing,
  ClipboardList,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getDashboardPath } from "@/lib/utils";

export default async function HomePage() {
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

  const features = [
    {
      title:
        "Assignment Management",
      desc:
        "Create, manage and review assignments with submission tracking.",
      icon: ClipboardList,
    },
    {
      title:
        "Student Dashboard",
      desc:
        "Students can track assignments, submissions and feedback easily.",
      icon: GraduationCap,
    },
    {
      title:
        "Teacher Dashboard",
      desc:
        "Teachers can manage batches and evaluations efficiently.",
      icon: BookOpen,
    },
    {
      title:
        "Email Notifications",
      desc:
        "Automated notifications for assignments and feedback.",
      icon: BellRing,
    },
    {
      title:
        "Analytics",
      desc:
        "Track performance and classroom progress in real-time.",
      icon: BarChart3,
    },
    {
      title:
        "Secure Authentication",
      desc:
        "Protected login system with role-based access.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" />

      {/* GLOW EFFECTS */}
      <div className="absolute top-[-150px] left-[-150px] h-[350px] w-[350px] rounded-full bg-white/10 blur-3xl animate-pulse" />

      <div className="absolute bottom-[-150px] right-[-150px] h-[350px] w-[350px] rounded-full bg-gray-500/10 blur-3xl animate-pulse" />

      {/* GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            LMS Portal
          </h1>

          <nav className="hidden items-center gap-8 text-sm font-medium text-gray-300 md:flex">
            <a
              href="#home"
              className="transition hover:text-white"
            >
              Home
            </a>

            <a
              href="#features"
              className="transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#about"
              className="transition hover:text-white"
            >
              About
            </a>
          </nav>

          <a
            href="/login"
            className="group inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-xl transition-all duration-300 hover:scale-105"
          >
            Login
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative px-6 pb-32 pt-44"
      >
        <div className="mx-auto max-w-6xl text-center">
          {/* BADGE */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-gray-300 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4" />
            Smart Learning Management
            System
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
            Modern LMS Platform
            <span className="mt-3 block text-gray-400">
              Built for Smart Learning
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-gray-400 md:text-xl">
            Manage assignments,
            classroom activities,
            analytics and notifications
            with a modern and
            professional learning
            experience.
          </p>

          {/* BUTTONS */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
            <a
              href="/login"
              className="group inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-semibold text-black shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Get Started
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <a
              href="#features"
              className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/10"
            >
              Explore Features
            </a>
          </div>

          {/* STATS */}
          <div className="mt-24 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              {
                value: "120+",
                label: "Students",
              },
              {
                value: "25+",
                label: "Teachers",
              },
              {
                value: "350+",
                label: "Assignments",
              },
              {
                value: "98%",
                label: "Submission Rate",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl"
              >
                <h3 className="text-4xl font-bold text-white">
                  {item.value}
                </h3>

                <p className="mt-3 text-gray-400">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="relative px-6 py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="text-5xl font-bold tracking-tight text-white">
              Powerful Features
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
              Everything required for
              modern classroom management
              in one secure platform.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map(
              (feature, index) => {
                const Icon =
                  feature.icon;

                return (
                  <div
                    key={index}
                    className="group rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl"
                  >
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-8 w-8" />
                    </div>

                    <h3 className="mb-4 text-2xl font-semibold text-white">
                      {feature.title}
                    </h3>

                    <p className="leading-relaxed text-gray-400">
                      {feature.desc}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="relative px-6 py-28"
      >
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-5xl font-bold tracking-tight text-white">
            About Our LMS
          </h2>

          <p className="mt-8 text-lg leading-relaxed text-gray-400">
            This LMS platform helps
            educational institutions
            simplify academic workflows
            with assignment management,
            smart dashboards, analytics
            and secure role-based access.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 pb-28">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-14 text-center backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />

          <h2 className="relative text-4xl font-bold leading-tight text-white md:text-5xl">
            Start Managing Your LMS
          </h2>

          <p className="relative mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            Access dashboards,
            analytics and notifications
            in one integrated platform.
          </p>

          <a
            href="/login"
            className="group relative mt-10 inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-semibold text-black transition-all duration-300 hover:scale-105"
          >
            Login to Dashboard
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/30 px-6 py-8 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-gray-400 md:flex-row">
          <p>
            © 2026 LMS Portal. All rights
            reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#home"
              className="transition hover:text-white"
            >
              Home
            </a>

            <a
              href="#features"
              className="transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#about"
              className="transition hover:text-white"
            >
              About
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}