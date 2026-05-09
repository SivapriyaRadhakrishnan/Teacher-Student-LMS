import { BookOpen, GraduationCap, Users } from "lucide-react";
import { redirect } from "next/navigation";

import StatCard from "@/components/dashboard/StatCard";
import YearManagementClient, {
  type YearManagementItem,
} from "@/components/years/YearManagementClient";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type YearRow = Database["public"]["Tables"]["years"]["Row"];
type BatchRow = Database["public"]["Tables"]["batches"]["Row"];

type RawYear = Pick<YearRow, "id" | "year_name" | "created_at">;
type RawBatch = Pick<BatchRow, "id" | "year_id">;

function countByYearId(rows: { year_id: string }[]) {
  return rows.reduce<Record<string, number>>((counts, row) => {
    counts[row.year_id] = (counts[row.year_id] ?? 0) + 1;
    return counts;
  }, {});
}

function countStudentsByYear(
  rows: { batches: { year_id: string } | null }[]
) {
  return rows.reduce<Record<string, number>>((counts, row) => {
    const yearId = row.batches?.year_id;

    if (yearId) {
      counts[yearId] = (counts[yearId] ?? 0) + 1;
    }

    return counts;
  }, {});
}

export default async function TeacherYearsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    { data: years, error: yearsError },
    { data: batches, error: batchesError },
    { data: students, error: studentsError },
  ] = await Promise.all([
    supabase
      .from("years")
      .select("id,year_name,created_at")
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("batches")
      .select("id,year_id")
      .eq("teacher_id", user.id),
    supabase
      .from("students")
      .select("batches!inner(year_id,teacher_id)")
      .eq("batches.teacher_id", user.id),
  ]);

  const yearRows = (years ?? []) as RawYear[];
  const batchCounts = countByYearId((batches ?? []) as RawBatch[]);
  const studentCounts = countStudentsByYear(
    (students ?? []) as { batches: { year_id: string } | null }[]
  );

  const yearItems: YearManagementItem[] = yearRows.map((year) => ({
    ...year,
    batchCount: batchCounts[year.id] ?? 0,
    studentCount: studentCounts[year.id] ?? 0,
  }));

  const totalBatches = yearItems.reduce(
    (total, year) => total + year.batchCount,
    0
  );
  const totalStudents = yearItems.reduce(
    (total, year) => total + year.studentCount,
    0
  );

  return (
    <div className="space-y-6">
      <YearManagementClient teacherId={user.id} years={yearItems} />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Years" value={yearItems.length} icon={GraduationCap} />
        <StatCard title="Batches" value={totalBatches} icon={BookOpen} />
        <StatCard title="Students" value={totalStudents} icon={Users} />
      </div>

      {yearsError || batchesError || studentsError ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load year details</AlertTitle>
          <AlertDescription>
            {yearsError?.message || batchesError?.message || studentsError?.message}
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
