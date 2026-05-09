import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Users,
} from "lucide-react";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
type TopPerformer = {
  marks: number | null;

  students:
    | {
        name: string | null;
      }
    | null;

  assignments:
    | {
        batches:
          | {
              batch_name: string | null;
            }
          | null;
      }
    | null;
};

export default async function TeacherAnalyticsPage() {
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
  .eq(
    "teacher_id",
    user.id
  );

const batchIds =
  teacherBatches?.map(
    (item: any) =>
      item.batch_id
  ) || [];

// STUDENTS COUNT
const {
  count: studentsCount,
} = await supabase
  .from("students")
  .select("*", {
    count: "exact",
    head: true,
  })
  .in("batch_id", batchIds);

  // ASSIGNMENTS
  const { count: assignmentsCount } =
    await supabase
      .from("assignments")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("teacher_id", user.id);

  // SUBMISSIONS
  const { data: submissions } =
    await supabase
      .from("submissions")
      .select("status, marks");

  const totalSubmissions =
    submissions?.length || 0;


// BATCH PERFORMANCE
const {
  data: batchPerformance,
} = await supabase
  .from("batches")
  .select(`
    id,
    batch_name,

    years(
      year_name
    ),

    students(
      id
    )
  `)
  .in("id", batchIds);

// TOP PERFORMERS
const { data: performerData } =
  await supabase
    .from("submissions")
    .select(`
      marks,

      students(
        name
      ),

      assignments(
        batches(
          batch_name
        )
      )
    `)
    .not("marks", "is", null)
    .order("marks", {
      ascending: false,
    })
    .limit(5);

const topPerformers: TopPerformer[] =
  performerData || [];
  const reviewedSubmissions =
    submissions?.filter(
      (submission) =>
        submission.status ===
        "reviewed"
    ).length || 0;
    const pendingSubmissions =
  submissions?.filter(
    (submission) =>
      submission.status ===
      "pending"
  ).length || 0;

  const lateSubmissions =
    submissions?.filter(
      (submission) =>
        submission.status ===
        "late_submission"
    ).length || 0;

  const averageMarks =
    submissions &&
    submissions.length > 0
      ? Math.round(
          submissions.reduce(
            (
              total,
              submission
            ) =>
              total +
              (submission.marks ||
                0),
            0
          ) /
            submissions.length
        )
      : 0;

  const stats = [
    {
      title: "Students",
      value: studentsCount || 0,
      icon: Users,
      color: "bg-blue-500",
    },

    {
      title: "Assignments",
      value:
        assignmentsCount || 0,
      icon: BarChart3,
      color: "bg-purple-500",
    },

    {
      title: "Reviewed",
      value:
        reviewedSubmissions,
      icon: CheckCircle2,
      color: "bg-green-500",
    },

    {
      title: "Late",
      value: lateSubmissions,
      icon: AlertTriangle,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Analytics
        </h1>

        <p className="mt-1 text-muted-foreground">
          Monitor assignment performance and student progress.
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {stat.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-bold">
                    {stat.value}
                  </h2>
                </div>

                <div
                  className={`rounded-2xl p-4 text-white ${stat.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    {/* ANALYTICS REPORTS */}
<div className="grid gap-6 lg:grid-cols-2">
  
 {/* BATCH PERFORMANCE */}
<div className="rounded-2xl border bg-white p-6 shadow-sm">
  <div className="flex items-center gap-2">
    <BarChart3 className="h-5 w-5" />

    <h2 className="text-lg font-semibold">
      Batch Performance
    </h2>
  </div>

  <div className="mt-6 space-y-4">
    {batchPerformance?.length ===
    0 ? (
      <p className="text-sm text-muted-foreground">
        No batch data found.
      </p>
    ) : (
      batchPerformance?.map(
        (batch) => (
          <div
            key={batch.id}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <div>
              <p className="font-medium">
                {
                  batch.batch_name
                }
              </p>

              <p className="text-sm text-muted-foreground">
                {
                  batch.years
                    ?.year_name
                }
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                {
                  batch.students
                    ?.length
                }
              </p>

              <p className="text-xs text-muted-foreground">
                Students
              </p>
            </div>
          </div>
        )
      )
    )}
  </div>
</div>

 {/* STUDENT PROGRESS */}
<div className="rounded-2xl border bg-white p-6 shadow-sm">
  <div className="flex items-center gap-2">
    <Users className="h-5 w-5" />

    <h2 className="text-lg font-semibold">
      Student Progress
    </h2>
  </div>

  <div className="mt-6 space-y-5">
    {/* ASSIGNMENT COMPLETION */}
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">
        Assignment Completion
      </span>

      <span className="font-semibold">
        {totalSubmissions > 0
          ? `${Math.round(
              (reviewedSubmissions /
                totalSubmissions) *
                100
            )}%`
          : "0%"}
      </span>
    </div>

    {/* PENDING */}
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">
        Pending Submissions
      </span>

      <span className="font-semibold text-orange-500">
        {pendingSubmissions}
      </span>
    </div>

    {/* REVIEWED */}
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">
        Reviewed Submissions
      </span>

      <span className="font-semibold text-green-600">
        {reviewedSubmissions}
      </span>
    </div>

    {/* LATE */}
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">
        Late Submissions
      </span>

      <span className="font-semibold text-red-500">
        {lateSubmissions}
      </span>
    </div>

    {/* AVERAGE MARKS */}
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">
        Average Marks
      </span>

      <span className="font-semibold text-blue-600">
        {averageMarks}%
      </span>
    </div>
  </div>
</div>
</div>

{/* TOP PERFORMERS */}
<div className="rounded-2xl border bg-white p-6 shadow-sm">
  <div className="flex items-center gap-2">
    <CheckCircle2 className="h-5 w-5" />

    <h2 className="text-lg font-semibold">
      Top Performers
    </h2>
  </div>

  <div className="mt-6 overflow-x-auto">
    <table className="w-full">
      <thead className="border-b">
        <tr>
          <th className="px-4 py-3 text-left text-sm font-semibold">
            Student
          </th>

          <th className="px-4 py-3 text-left text-sm font-semibold">
            Batch
          </th>

          <th className="px-4 py-3 text-left text-sm font-semibold">
            Average Score
          </th>

          <th className="px-4 py-3 text-left text-sm font-semibold">
            Performance
          </th>
        </tr>
      </thead>

     <tbody>
  {topPerformers.length ===
  0 ? (
    <tr>
      <td
        colSpan={4}
        className="px-4 py-8 text-center text-muted-foreground"
      >
        No performance data found
      </td>
    </tr>
  ) : (
    topPerformers.map(
      (performer, index) => {
        const marks =
          performer.marks || 0;

        let performance =
          "Average";

        let badgeStyle =
          "bg-gray-100 text-gray-700";

        if (marks >= 90) {
          performance =
            "Excellent";

          badgeStyle =
            "bg-green-100 text-green-700";
        } else if (
          marks >= 75
        ) {
          performance =
            "Great";

          badgeStyle =
            "bg-blue-100 text-blue-700";
        } else if (
          marks >= 50
        ) {
          performance =
            "Good";

          badgeStyle =
            "bg-yellow-100 text-yellow-700";
        }

        return (
          <tr
            key={index}
            className="border-b last:border-0"
          >
            {/* STUDENT */}
            <td className="px-4 py-4">
              {performer.students
                ?.name || "-"}
            </td>

            {/* BATCH */}
            <td className="px-4 py-4">
              {performer
                .assignments
                ?.batches
                ?.batch_name ||
                "-"}
            </td>

            {/* SCORE */}
            <td className="px-4 py-4 font-medium">
              {marks}%
            </td>

            {/* PERFORMANCE */}
            <td className="px-4 py-4">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${badgeStyle}`}
              >
                {performance}
              </span>
            </td>
          </tr>
        );
      }
    )
  )}
</tbody>
    </table>
  </div>
</div>
    </div>
  );
}