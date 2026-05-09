import {
  BookOpen,
  CheckCircle2,
  Clock3,
  TrendingUp,
  GraduationCap,
} from "lucide-react";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function StudentDashboardPage() {
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

          years(
            year_name
          )
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
      .select("*")
      .eq(
        "batch_id",
        student.batch_id
      );

  // SUBMISSIONS
  const { data: submissions } =
    await supabase
      .from("submissions")
      .select("*")
      .eq(
        "student_id",
        user.id
      )
      

  // PENDING
  const pendingAssignments =
    (assignments?.length || 0) -
    (submissions?.length || 0);

  // SUBMITTED
  const submittedTasks =
    submissions?.length || 0;

  // AVERAGE MARKS
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

  // UPCOMING DEADLINES
  const upcomingDeadlines =
    assignments?.filter(
      (assignment) =>
        assignment.deadline &&
        new Date(
          assignment.deadline
        ) > new Date()
    ).length || 0;

  // STATS
  const stats = [
    {
      title:
        "Pending Assignments",
      value: pendingAssignments,
      icon: Clock3,
      color: "bg-orange-500",
    },

    {
      title: "Submitted Tasks",
      value: submittedTasks,
      icon: CheckCircle2,
      color: "bg-green-500",
    },

    {
      title: "Average Marks",
      value: `${averageMarks}%`,
      icon: TrendingUp,
      color: "bg-blue-500",
    },

    {
      title:
        "Upcoming Deadlines",
      value: upcomingDeadlines,
      icon: BookOpen,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Student Dashboard
        </h1>

        <p className="mt-1 text-muted-foreground">
          Track assignments,
          submissions, and feedback.
        </p>

        {/* STUDENT INFO */}
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            Batch:{" "}
            {student?.batches
              ?.batch_name || "-"}
          </div>

          <div className="rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
            Year:{" "}
            {student?.batches
              ?.years
              ?.year_name || "-"}
          </div>

          <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
            Active Student
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
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

      {/* RECENT ACTIVITY */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />

          <h2 className="text-lg font-semibold">
            Recent Activity
          </h2>
        </div>

        <div className="mt-6 space-y-4">
          {submissions?.length ===
          0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No submissions yet.
              </p>
            </div>
          ) : (
            submissions
              ?.slice(0, 5)
              .map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between rounded-xl border p-4"
                >
                  <div>
                    <p className="font-medium">
                      Assignment Submission
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Status:{" "}
                      {
                        submission.status
                      }
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      {submission.marks ??
                        "-"}
                      /100
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Marks
                    </p>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}