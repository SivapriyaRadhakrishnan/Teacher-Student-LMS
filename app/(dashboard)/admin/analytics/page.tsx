import {
  BarChart3,
  BookOpen,
  GraduationCap,
  Users,
} from "lucide-react";

import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";

import StatCard from "@/components/admin/dashboard/StatCard";

import { createClient } from "@/lib/supabase/server";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  // TEACHERS
  const { count: teachersCount } =
    await supabase
      .from("profiles")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("role", "teacher");

  // STUDENTS
  const { count: studentsCount } =
    await supabase
      .from("profiles")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("role", "student");

  // ASSIGNMENTS
  const { count: assignmentsCount } =
    await supabase
      .from("assignments")
      .select("*", {
        count: "exact",
        head: true,
      });

  // SUBMISSIONS
  const { count: submissionsCount } =
    await supabase
      .from("submissions")
      .select("*", {
        count: "exact",
        head: true,
      });

  const stats = [
    {
      title: "Teachers",
      value: teachersCount || 0,
      icon: Users,
      color: "bg-blue-500",
    },

    {
      title: "Students",
      value: studentsCount || 0,
      icon: GraduationCap,
      color: "bg-green-500",
    },

    {
      title: "Assignments",
      value: assignmentsCount || 0,
      icon: BookOpen,
      color: "bg-orange-500",
    },

    {
      title: "Submissions",
      value: submissionsCount || 0,
      icon: BarChart3,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Analytics"
        description="Monitor LMS platform performance and activity."
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* INSIGHTS */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Platform Insights
        </h2>

        <div className="mt-6 space-y-4 text-sm text-muted-foreground">
          <p>
            • Total teachers actively
            managing students.
          </p>

          <p>
            • Student growth is tracked
            across batches.
          </p>

          <p>
            • Assignment submissions are
            monitored platform-wide.
          </p>

          <p>
            • Analytics update in real
            time from Supabase backend.
          </p>
        </div>
      </div>
    </div>
  );
}