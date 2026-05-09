import { createClient } from "@/lib/supabase/server";

import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";

import CreateTeacherDialog from "@/components/admin/teachers/CreateTeacherDialog";

import TeacherStats from "@/components/admin/teachers/TeacherStats";

import TeacherTable from "@/components/admin/teachers/TeacherTable";
import SearchInput from "@/components/shared/SearchInput";

type TeachersPageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function TeachersPage({
  searchParams,
}: TeachersPageProps) {
  const supabase = await createClient();
  const params = await searchParams;

const search =
  params.search?.trim() || "";

  const { data: teachers, error } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("role", "teacher")
      .ilike("name", `%${search}%`)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-red-500">
          Failed to load teachers
        </h2>

        <p className="mt-2 text-muted-foreground">
          {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DashboardHeader
          title="Teachers"
          description="Manage teacher accounts and platform access."
        />

        <CreateTeacherDialog />
      </div>

      {/* STATS */}
      <TeacherStats
        totalTeachers={teachers?.length || 0}
      />
      <div className="flex items-center justify-between">
  <SearchInput placeholder="Search teachers..." />
</div>
      {/* TABLE */}
      <TeacherTable
        teachers={teachers || []}
      />
    </div>
  );
}