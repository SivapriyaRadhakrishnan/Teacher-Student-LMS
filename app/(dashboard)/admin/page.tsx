import {
  BarChart3,
  GraduationCap,
  Layers3,
  Users,
} from "lucide-react";

import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import Link from "next/link";
import RecentActivity from "@/components/admin/dashboard/RecentActivity";

import StatCard from "@/components/admin/dashboard/StatCard";

import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const { count: teachersCount } =
    await supabase
      .from("profiles")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("role", "teacher");

  const { count: studentsCount } =
    await supabase
      .from("profiles")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("role", "student");

  const { count: batchesCount } =
    await supabase
      .from("batches")
      .select("*", {
        count: "exact",
        head: true,
      });

  const { count: assignmentsCount } =
    await supabase
      .from("assignments")
      .select("*", {
        count: "exact",
        head: true,
      });
// RECENT TEACHERS
const { data: recentTeachers } =
  await supabase
    .from("profiles")
    .select("id, name, created_at")
    .eq("role", "teacher")
    .order("created_at", {
      ascending: false,
    })
    .limit(3);

// RECENT STUDENTS
const { data: recentStudents } =
  await supabase
    .from("profiles")
    .select("id, name, created_at")
    .eq("role", "student")
    .order("created_at", {
      ascending: false,
    })
    .limit(3);

// RECENT BATCHES
const { data: recentBatches } =
  await supabase
    .from("batches")
    .select(
      "id, batch_name, created_at"
    )
    .order("created_at", {
      ascending: false,
    })
    .limit(3);
  const stats = [
    {
      title: "Total Teachers",
      value: teachersCount || 0,
      icon: Users,
      color: "bg-blue-500",
    },

    {
      title: "Total Students",
      value: studentsCount || 0,
      icon: GraduationCap,
      color: "bg-green-500",
    },

    {
      title: "Total Batches",
      value: batchesCount || 0,
      icon: Layers3,
      color: "bg-purple-500",
    },

    {
      title: "Assignments",
      value: assignmentsCount || 0,
      icon: BarChart3,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Admin Dashboard"
        description="Manage your LMS platform from here."
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity
  teachers={
    recentTeachers?.map(
      (teacher) => ({
        id: teacher.id,
        title:
          teacher.name ||
          "Unknown Teacher",
        created_at:
          teacher.created_at,
      })
    ) || []
  }
  students={
    recentStudents?.map(
      (student) => ({
        id: student.id,
        title:
          student.name ||
          "Unknown Student",
        created_at:
          student.created_at,
      })
    ) || []
  }
  batches={
    recentBatches?.map(
      (batch) => ({
        id: batch.id,
        title: batch.batch_name,
        created_at:
          batch.created_at,
      })
    ) || []
  }
/>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            Quick Actions
          </h2>

        <div className="mt-6 space-y-3">
  <Link
    href="/admin/teachers"
    className="block w-full rounded-xl bg-black px-4 py-3 text-center text-white transition hover:opacity-90"
  >
    + Manage Teachers
  </Link>

  <Link
    href="/admin/students"
    className="block w-full rounded-xl border px-4 py-3 text-center transition hover:bg-muted"
  >
    View Students
  </Link>

  <Link
    href="/admin/batches"
    className="block w-full rounded-xl border px-4 py-3 text-center transition hover:bg-muted"
  >
    Manage Batches
  </Link>
</div>
        </div>
      </div>
    </div>
  );
}