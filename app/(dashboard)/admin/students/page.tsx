import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";

import StudentStats from "@/components/admin/students/StudentStats";

import StudentTable from "@/components/admin/students/StudentTable";

import SearchInput from "@/components/shared/SearchInput";

import { createClient } from "@/lib/supabase/server";

type StudentsPageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function StudentsPage({
  searchParams,
}: StudentsPageProps) {
  const params = await searchParams;

  const search =
    params.search?.trim() || "";

  const supabase = await createClient();

  // STUDENTS
  const { data: students } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("role", "student")
      .ilike("name", `%${search}%`)
      .order("created_at", {
        ascending: false,
      });

  // BATCH COUNT
  const { count: batchesCount } =
    await supabase
      .from("batches")
      .select("*", {
        count: "exact",
        head: true,
      });

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <DashboardHeader
        title="Students"
        description="Monitor and view all students across batches."
      />

      {/* SEARCH */}
      <div className="flex items-center justify-between">
        <SearchInput placeholder="Search students..." />
      </div>

      {/* STATS */}
      <StudentStats
        totalStudents={
          students?.length || 0
        }
        totalBatches={
          batchesCount || 0
        }
      />

      {/* TABLE */}
      <StudentTable
        students={students || []}
      />
    </div>
  );
}