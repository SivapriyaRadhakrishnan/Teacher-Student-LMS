import { redirect } from "next/navigation";

import AssignmentStats from "@/components/assignments/AssignmentStats";

import AssignmentTable from "@/components/assignments/AssignmentTable";

import CreateAssignmentModal from "@/components/assignments/CreateAssignmentModal";

import SearchInput from "@/components/shared/SearchInput";

import { createClient } from "@/lib/supabase/server";

export default async function TeacherAssignmentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
// YEARS
const { data: years } =
  await supabase
    .from("years")
    .select("id, year_name")
    .eq("teacher_id", user.id);

// BATCHES
const { data: batches } =
  await supabase
    .from("batches")
    .select(
      "id, batch_name, year_id"
    )
    .eq("teacher_id", user.id);
  // ASSIGNMENTS
  const { data: assignments } =
    await supabase
      .from("assignments")
      .select(`
        *,
        batches(
          batch_name,
          years(year_name)
        )
      `)
      .eq("teacher_id", user.id)
      .order("created_at", {
        ascending: false,
      });

  // SUBMISSIONS
  const { data: submissions } =
    await supabase
      .from("submissions")
      .select("assignment_id");

  // SUBMISSION COUNT
  const submissionCounts =
    (submissions || []).reduce<
      Record<string, number>
    >((acc, submission) => {
      acc[submission.assignment_id] =
        (acc[
          submission.assignment_id
        ] || 0) + 1;

      return acc;
    }, {});

  // FORMATTED DATA
  const formattedAssignments =
    (assignments || []).map(
      (assignment) => ({
        ...assignment,

        submissionCount:
          submissionCounts[
            assignment.id
          ] || 0,
      })
    );

  const now = new Date();

  const completedAssignments =
    formattedAssignments.filter(
      (assignment) =>
        assignment.deadline &&
        new Date(
          assignment.deadline
        ) < now
    ).length;

  const pendingAssignments =
    formattedAssignments.length -
    completedAssignments;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Assignments
          </h1>

          <p className="mt-1 text-muted-foreground">
            Create and manage assignments batch-wise and year-wise.
          </p>
        </div>

       <CreateAssignmentModal
  years={years || []}
  batches={batches || []}
/>
      </div>

      {/* SEARCH */}
      <div className="flex items-center justify-between">
        <SearchInput placeholder="Search assignments..." />
      </div>

      {/* STATS */}
      <AssignmentStats
        totalAssignments={
          formattedAssignments.length
        }
        pendingAssignments={
          pendingAssignments
        }
        completedAssignments={
          completedAssignments
        }
      />

      {/* TABLE */}
      <AssignmentTable
        assignments={
          formattedAssignments
        }
      />
    </div>
  );
}