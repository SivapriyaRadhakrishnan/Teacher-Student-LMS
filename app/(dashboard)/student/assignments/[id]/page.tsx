import {
  CalendarDays,
  FileText,
  Upload,
} from "lucide-react";
import SubmissionForm from "@/components/students/assignments/SubmissionForm";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type AssignmentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StudentAssignmentDetailsPage({
  params,
}: AssignmentPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  // AUTH
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
        batch_id
      `)
      .eq("id", user.id)
      .single();

  if (!student) {
    redirect("/login");
  }

  // ASSIGNMENT
  const { data: assignment } =
    await supabase
      .from("assignments")
      .select(`
        *,
        batches(
          batch_name
        )
      `)
      .eq("id", id)
      .single();

  if (!assignment) {
    redirect("/student/assignments");
  }

  // SUBMISSION
  const { data: submission } =
    await supabase
      .from("submissions")
      .select("*")
      .eq(
        "assignment_id",
        assignment.id
      )
      .eq(
        "student_id",
        user.id
      )
      .single();

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {assignment.title}
        </h1>

        <p className="mt-2 text-muted-foreground">
          {
            assignment.description
          }
        </p>
      </div>

      {/* INFO */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />

            <h2 className="font-semibold">
              Deadline
            </h2>
          </div>

          <p className="mt-4 text-lg font-bold">
            {assignment.deadline
              ? new Date(
                  assignment.deadline
                ).toLocaleDateString(
                  "en-CA"
                )
              : "-"}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />

            <h2 className="font-semibold">
              Max Marks
            </h2>
          </div>

          <p className="mt-4 text-lg font-bold">
            {assignment.max_marks ||
              100}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5" />

            <h2 className="font-semibold">
              Submission Status
            </h2>
          </div>

          <p className="mt-4">
            {submission ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                Submitted
              </span>
            ) : (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                Pending
              </span>
            )}
          </p>
        </div>
      </div>

      {/* INSTRUCTIONS */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Instructions
        </h2>

        <div className="mt-4 whitespace-pre-line text-sm text-muted-foreground">
          {assignment.instructions ||
            "No instructions provided."}
        </div>
      </div>

      {/* SUBMISSION SECTION */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Submission
        </h2>

       <div className="mt-6">
  {assignment.deadline &&
  new Date(assignment.deadline) <
    new Date() ? (
    <div className="rounded-xl border bg-red-50 p-4">
      <p className="font-medium text-red-700">
        Deadline expired.
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        Submission is closed.
      </p>
    </div>
  ) : (
    <div className="space-y-4">
      {submission && (
        <div className="rounded-xl border bg-green-50 p-4">
          <p className="font-medium text-green-700">
            Assignment already submitted.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            You can resubmit before deadline.
          </p>
        </div>
      )}

      <SubmissionForm
        assignmentId={assignment.id}
        studentId={user.id}
        allowedSubmissionTypes={
          assignment.allowed_types || []
        }
      />
    </div>
  )}
</div>
      </div>
    </div>
  );
}