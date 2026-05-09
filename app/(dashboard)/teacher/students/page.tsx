import { GraduationCap, UserPlus, Users } from "lucide-react";
import { redirect } from "next/navigation";

import CreateStudentModal, {
  type StudentBatchOption,
} from "@/components/students/CreateStudentModal";
import StudentTable, {
  type StudentTableRow,
} from "@/components/students/StudentTable";
import StatCard from "@/components/dashboard/StatCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type StudentRow = Database["public"]["Tables"]["students"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type BatchRow = Database["public"]["Tables"]["batches"]["Row"];
type YearRow = Database["public"]["Tables"]["years"]["Row"];

type RawBatch = Pick<BatchRow, "id" | "batch_name"> & {
  years: Pick<YearRow, "year_name"> | null;
};

type RawStudent = Pick<StudentRow, "id" | "created_at"> & {
  profiles: Pick<ProfileRow, "id" | "name" | "email" | "phone"> | null;
  batches:
    | (Pick<BatchRow, "id" | "batch_name"> & {
        years: Pick<YearRow, "year_name"> | null;
      })
    | null;
};

export default async function TeacherStudentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: batches, error: batchesError }, { data: students, error }] =
    await Promise.all([
      supabase
        .from("batches")
        .select("id,batch_name,years(year_name)")
        .eq("teacher_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("students")
        .select(
          "id,created_at,profiles(id,name,email,phone),batches!inner(id,batch_name,teacher_id,years(year_name))"
        )
        .eq("batches.teacher_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

  const batchOptions: StudentBatchOption[] = ((batches ?? []) as RawBatch[]).map(
    (batch) => ({
      id: batch.id,
      batch_name: batch.batch_name,
      year_name: batch.years?.year_name ?? null,
    })
  );

  const studentRows: StudentTableRow[] = ((students ?? []) as RawStudent[]).map(
    (student) => ({
      id: student.id,
      created_at: student.created_at,
      profile: student.profiles,
      batch: student.batches
        ? {
            id: student.batches.id,
            batch_name: student.batches.batch_name,
            year_name: student.batches.years?.year_name ?? null,
          }
        : null,
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground">
            Create student accounts and assign them to your batches.
          </p>
        </div>
        <CreateStudentModal batches={batchOptions} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Students" value={studentRows.length} icon={Users} />
        <StatCard title="Batches" value={batchOptions.length} icon={GraduationCap} />
        <StatCard
          title="Ready to add"
          value={batchOptions.length ? "Yes" : "No"}
          icon={UserPlus}
          description={
            batchOptions.length
              ? "Student creation is available."
              : "Create a batch before adding students."
          }
        />
      </div>

      {batchesError || error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load students</AlertTitle>
          <AlertDescription>
            {batchesError?.message || error?.message}
          </AlertDescription>
        </Alert>
      ) : null}

      {!batchOptions.length ? (
        <Alert>
          <GraduationCap />
          <AlertTitle>Create a batch first</AlertTitle>
          <AlertDescription>
            Students need to be assigned to a batch. Add one from the batches page,
            then come back here.
          </AlertDescription>
        </Alert>
      ) : null}

      {studentRows.length ? (
        <StudentTable students={studentRows} />
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed bg-background px-4 text-center">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Users className="size-5" />
          </div>
          <h2 className="mt-4 text-base font-medium">No students yet</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Add students after creating at least one batch.
          </p>
          {batchOptions.length ? (
            <div className="mt-4">
              <CreateStudentModal batches={batchOptions} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
