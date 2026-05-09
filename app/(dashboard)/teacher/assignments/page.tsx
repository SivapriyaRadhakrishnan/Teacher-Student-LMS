import { redirect } from "next/navigation";

import AssignmentStats from "@/components/assignments/AssignmentStats";
import AssignmentTable from "@/components/assignments/AssignmentTable";
import CreateAssignmentModal from "@/components/assignments/CreateAssignmentModal";
import SearchInput from "@/components/shared/SearchInput";

import { createClient } from "@/lib/supabase/server";

type PageProps = {
  searchParams: Promise<{
    search?: string;
    year?: string;
    batch?: string;
    status?: string;
  }>;
};

export default async function TeacherAssignmentsPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  const search =
    params.search?.trim() || "";

  const selectedYear =
    params.year || "";

  const selectedBatch =
    params.batch || "";

  const selectedStatus =
    params.status || "";

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // GET TEACHER BATCH IDS
const {
  data: teacherBatches,
} = await supabase
  .from("batch_teachers")
  .select(`
    batch_id,
    batches(
      id,
      batch_name,
      year_id
    )
  `)
  .eq(
    "teacher_id",
    user.id
  );

// EXTRACT BATCHES
const batches =
  teacherBatches?.map(
    (item: any) =>
      item.batches
  ) || [];

// GET YEAR IDS
const yearIds =
  batches.map(
    (batch: any) =>
      batch.year_id
  );

// GET YEARS
const { data: years } =
  await supabase
    .from("years")
    .select(`
      id,
      year_name
    `)
    .in("id", yearIds);
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
      .select(`
        assignment_id,
        status,
        marks
      `);

  // SUBMISSION COUNT
  const submissionCounts =
    (submissions || []).reduce<
      Record<string, number>
    >((acc, submission: any) => {
      acc[
        submission.assignment_id
      ] =
        (acc[
          submission.assignment_id
        ] || 0) + 1;

      return acc;
    }, {});

  // REVIEWED ASSIGNMENTS
  const reviewedAssignmentIds =
    new Set(
      (submissions || [])
        .filter(
          (submission: any) =>
            submission.status ===
            "reviewed"
        )
        .map(
          (submission: any) =>
            submission.assignment_id
        )
    );

  // MARKS MAP
  const marksMap =
    (submissions || []).reduce<
      Record<string, number>
    >((acc, submission: any) => {
      if (
        submission.status ===
        "reviewed"
      ) {
        acc[
          submission.assignment_id
        ] =
          submission.marks || 0;
      }

      return acc;
    }, {});

  // FORMATTED DATA
  let formattedAssignments =
    (assignments || []).map(
      (assignment: any) => ({
        ...assignment,

        submissionCount:
          submissionCounts[
            assignment.id
          ] || 0,

        marks:
          marksMap[
            assignment.id
          ] || 0,

        isCompleted:
          reviewedAssignmentIds.has(
            assignment.id
          ),
      })
    );

  // SEARCH FILTER
  if (search) {
    formattedAssignments =
      formattedAssignments.filter(
        (assignment: any) => {
          const title =
            assignment.title?.toLowerCase() ||
            "";

          const description =
            assignment.description?.toLowerCase() ||
            "";

          const batchName =
            assignment.batches?.batch_name?.toLowerCase() ||
            "";

          const yearName =
            assignment.batches?.years?.year_name?.toLowerCase() ||
            "";

          const searchValue =
            search.toLowerCase();

          return (
            title.includes(
              searchValue
            ) ||
            description.includes(
              searchValue
            ) ||
            batchName.includes(
              searchValue
            ) ||
            yearName.includes(
              searchValue
            )
          );
        }
      );
  }

  // YEAR FILTER
  if (selectedYear) {
    formattedAssignments =
      formattedAssignments.filter(
        (assignment: any) =>
          assignment.batches
            ?.years
            ?.year_name ===
          selectedYear
      );
  }

  // BATCH FILTER
  if (selectedBatch) {
    formattedAssignments =
      formattedAssignments.filter(
        (assignment: any) =>
          assignment.batches
            ?.batch_name ===
          selectedBatch
      );
  }

  // STATUS FILTER
  if (selectedStatus) {
    formattedAssignments =
      formattedAssignments.filter(
        (assignment: any) => {
          if (
            selectedStatus ===
            "completed"
          ) {
            return (
              assignment.isCompleted
            );
          }

          if (
            selectedStatus ===
            "pending"
          ) {
            return !assignment.isCompleted;
          }

          return true;
        }
      );
  }

  // STATS
  const completedAssignments =
    formattedAssignments.filter(
      (assignment: any) =>
        assignment.isCompleted
    ).length;

  const pendingAssignments =
    formattedAssignments.filter(
      (assignment: any) =>
        !assignment.isCompleted
    ).length;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Assignments
          </h1>

          <p className="mt-1 text-muted-foreground">
            Create and manage assignments
            batch-wise and year-wise.
          </p>
        </div>

        <CreateAssignmentModal
          years={years || []}
          batches={batches || []}
        />
      </div>

      {/* FILTERS */}
      <form>
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            {/* SEARCH */}
            <SearchInput placeholder="Search assignments..." />

            {/* YEAR */}
            <select
              name="year"
              defaultValue={
                selectedYear
              }
              className="h-11 rounded-xl border bg-background px-3 text-sm"
            >
              <option value="">
                All Years
              </option>

              {years?.map(
                (
                  year,
                  index
                ) => (
                  <option
                    key={`${year.id}-${index}`}
                    value={
                      year.year_name
                    }
                  >
                    {
                      year.year_name
                    }
                  </option>
                )
              )}
            </select>

            {/* BATCH */}
            <select
              name="batch"
              defaultValue={
                selectedBatch
              }
              className="h-11 rounded-xl border bg-background px-3 text-sm"
            >
              <option value="">
                All Batches
              </option>

              {batches?.map(
                (
                  batch,
                  index
                ) => (
                  <option
                    key={`${batch.id}-${index}`}
                    value={
                      batch.batch_name
                    }
                  >
                    {
                      batch.batch_name
                    }
                  </option>
                )
              )}
            </select>

            {/* STATUS */}
            <select
              name="status"
              defaultValue={
                selectedStatus
              }
              className="h-11 rounded-xl border bg-background px-3 text-sm"
            >
              <option value="">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="completed">
                Completed
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-5 rounded-xl bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-black/90"
          >
            Apply Filters
          </button>
        </div>
      </form>

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