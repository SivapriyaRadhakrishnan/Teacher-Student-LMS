import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
} from "lucide-react";

import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function StudentAssignmentsPage() {
  const supabase = await createClient();

  // AUTH USER
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // STUDENT
  const { data: student } =
    await supabase
      .from("students")
      .select(`
        id,
        batch_id,
        batches(
          batch_name,
          year_id
        )
      `)
      .eq("user_id", user.id)
      .single();

  if (!student) {
    redirect("/login");
  }

  // ASSIGNMENTS
  const { data: assignments } =
    await supabase
      .from("assignments")
      .select(`
        *,
        batches(
          batch_name
        )
      `)
      .eq(
        "batch_id",
        student.batch_id
      )
      .order("created_at", {
        ascending: false,
      });

  // SUBMISSIONS
  const { data: submissions } =
    await supabase
      .from("submissions")
      .select(`
        assignment_id
      `)
      .eq(
  "student_id",
  user.id
);

  const submittedIds =
    submissions?.map(
      (submission) =>
        submission.assignment_id
    ) || [];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Assignments
        </h1>

        <p className="mt-1 text-muted-foreground">
          View and submit your assignments.
        </p>
      </div>

      {/* ASSIGNMENTS */}
      <div className="grid gap-6 lg:grid-cols-2">
        {assignments?.length ===
        0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />

            <h2 className="mt-4 text-lg font-semibold">
              No Assignments
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              No assignments available yet.
            </p>
          </div>
        ) : (
          assignments?.map(
            (assignment) => {
              const submitted =
                submittedIds.includes(
                  assignment.id
                );

              const isExpired =
                assignment.deadline &&
                new Date(
                  assignment.deadline
                ) < new Date();

              return (
                <div
                  key={assignment.id}
                  className="rounded-2xl border bg-white p-6 shadow-sm"
                >
                  {/* TOP */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {
                          assignment.title
                        }
                      </h2>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {
                          assignment.description
                        }
                      </p>
                    </div>

                    {submitted ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Submitted
                      </span>
                    ) : isExpired ? (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                        Expired
                      </span>
                    ) : (
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />

                      Deadline:{" "}
                      {assignment.deadline
                        ? new Date(
                            assignment.deadline
                          ).toLocaleDateString(
                            "en-CA"
                          )
                        : "-"}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" />

                      Max Marks:{" "}
                      {assignment.max_marks ||
                        100}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock3 className="h-4 w-4" />

                      Batch:{" "}
                      {assignment
                        .batches
                        ?.batch_name ||
                        "-"}
                    </div>
                  </div>

                  {/* ACTION */}
                  <div className="mt-6">
                    <Link
                      href={`/student/assignments/${assignment.id}`}
                      className="inline-flex items-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      Open Assignment
                    </Link>
                  </div>
                </div>
              );
            }
          )
        )}
      </div>
    </div>
  );
}