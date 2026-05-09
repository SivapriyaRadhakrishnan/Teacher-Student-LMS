import { BookOpen, GraduationCap, Users } from "lucide-react";
import { redirect } from "next/navigation";

import BatchCard, { type BatchCardData } from "@/components/batches/BatchCard";
import CreateBatchModal, {
  type BatchYearOption,
} from "@/components/batches/CreateBatchModal";
import StatCard from "@/components/dashboard/StatCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type BatchRow = Database["public"]["Tables"]["batches"]["Row"];
type YearRow = Database["public"]["Tables"]["years"]["Row"];

type RawBatch = Pick<
  BatchRow,
  "id" | "batch_name" | "created_at" | "year_id"
> & {
  years: Pick<YearRow, "id" | "year_name"> | null;
};

function countByBatchId(rows: { batch_id: string }[]) {
  return rows.reduce<Record<string, number>>((counts, row) => {
    counts[row.batch_id] = (counts[row.batch_id] ?? 0) + 1;
    return counts;
  }, {});
}

export default async function TeacherBatchesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // GET TEACHER BATCH IDS
const {
  data: teacherBatches,
} = await supabase
  .from("batch_teachers")
  .select("batch_id")
  .eq("teacher_id", user.id);

const batchIds =
  teacherBatches?.map(
    (item: any) =>
      item.batch_id
  ) || [];

// GET YEARS
const {
  data: years,
} = await supabase
  .from("years")
  .select(`
    id,
    year_name
  `)
  .order("created_at", {
    ascending: false,
  });

// GET BATCHES
const {
  data: batches,
  error: batchesError,
} = await supabase
  .from("batches")
  .select(`
    id,
    batch_name,
    created_at,
    year_id,
    years (
      id,
      year_name
    )
  `)
  .in("id", batchIds)
  .order("created_at", {
    ascending: false,
  });

  const batchRows = (batches ?? []) as RawBatch[];

  const [{ data: studentRows }, { data: assignmentRows }] = batchIds.length
    ? await Promise.all([
        supabase.from("students").select("batch_id").in("batch_id", batchIds),
        supabase
          .from("assignments")
          .select("batch_id")
          .in("batch_id", batchIds),
      ])
    : [{ data: [] }, { data: [] }];

  const studentCounts = countByBatchId(studentRows ?? []);
  const assignmentCounts = countByBatchId(assignmentRows ?? []);
  const yearOptions = (years ?? []) as BatchYearOption[];

  const cards: BatchCardData[] = batchRows.map((batch) => ({
    id: batch.id,
    batch_name: batch.batch_name,
    created_at: batch.created_at,
    year_id: batch.year_id,
    year: batch.years,
    studentCount: studentCounts[batch.id] ?? 0,
    assignmentCount: assignmentCounts[batch.id] ?? 0,
  }));

  const totalStudents = cards.reduce(
    (total, batch) => total + batch.studentCount,
    0
  );
  const totalAssignments = cards.reduce(
    (total, batch) => total + batch.assignmentCount,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Batches</h1>
          <p className="text-sm text-muted-foreground">
            Organize students by academic year and batch.
          </p>
        </div>
        <CreateBatchModal teacherId={user.id} years={yearOptions} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Years" value={yearOptions.length} icon={GraduationCap} />
        <StatCard title="Batches" value={cards.length} icon={Users} />
        <StatCard title="Assignments" value={totalAssignments} icon={BookOpen} />
      </div>

      {batchesError ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load batches</AlertTitle>
          <AlertDescription>{batchesError.message}</AlertDescription>
        </Alert>
      ) : null}

      {cards.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              teacherId={user.id}
              years={yearOptions}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed bg-background px-4 text-center">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <GraduationCap className="size-5" />
          </div>
          <h2 className="mt-4 text-base font-medium">No batches yet</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Create your first academic year and batch to start adding students.
          </p>
          <div className="mt-4">
            <CreateBatchModal teacherId={user.id} years={yearOptions} />
          </div>
        </div>
      )}

      {cards.length ? (
        <p className="text-sm text-muted-foreground">
          Total students across batches: {totalStudents}
        </p>
      ) : null}
    </div>
  );
}
