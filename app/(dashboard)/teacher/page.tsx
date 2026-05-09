import {
  AlertCircle,
  BarChart3,
  BookOpenCheck,
  Clock,
  GraduationCap,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/server";

function getAverageScore(
  submissions: { marks: number | null; assignments: { max_marks: number | null } | null }[]
) {
  const graded = submissions.filter(
    (submission) =>
      typeof submission.marks === "number" &&
      typeof submission.assignments?.max_marks === "number" &&
      submission.assignments.max_marks > 0
  );

  if (!graded.length) return 0;

  const totalPercent = graded.reduce((total, submission) => {
    const maxMarks = submission.assignments?.max_marks ?? 0;
    return total + ((submission.marks ?? 0) / maxMarks) * 100;
  }, 0);

  return Math.round(totalPercent / graded.length);
}

export default async function TeacherDashboardPage() {
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
    (item: any) => item.batch_id
  ) || [];

const [
  { data: students },
  { data: assignments },
  { data: submissions },
  { data: batches },
] = await Promise.all([
  // STUDENTS
  supabase
    .from("students")
    .select("id")
    .in("batch_id", batchIds),

  // ASSIGNMENTS
  supabase
    .from("assignments")
    .select(`
      id,
      title,
      deadline,
      max_marks,
      created_at,
      batch_id
    `)
    .in("batch_id", batchIds)
    .order("created_at", {
      ascending: false,
    }),

  // SUBMISSIONS
  supabase
    .from("submissions")
    .select(`
      id,
      status,
      submitted_at,
      marks,

      assignments!inner(
        deadline,
        max_marks,
        batch_id
      )
    `)
    .in(
      "assignments.batch_id",
      batchIds
    ),

  // BATCHES
  supabase
    .from("batches")
    .select(`
      id,
      batch_name,

      years(
        year_name
      )
    `)
    .in("id", batchIds)
    .order("created_at", {
      ascending: false,
    })
    .limit(4),
]);

  const now = new Date();
  const assignmentRows = assignments ?? [];
  const submissionRows = (submissions ?? []) as {
    id: string;
    status: string;
    submitted_at: string | null;
    marks: number | null;
    assignments: { deadline: string | null; max_marks: number | null } | null;
  }[];

  const reviewedStatuses = new Set([
    "reviewed",
    "approved",
    "needs_improvement",
    "rejected",
  ]);
  const pendingSubmissions = submissionRows.filter(
    (submission) => !reviewedStatuses.has(submission.status)
  ).length;
  const lateSubmissions = submissionRows.filter((submission) => {
    const deadline = submission.assignments?.deadline;
    const submittedAt = submission.submitted_at;

    return (
      submission.status === "late_submission" ||
      Boolean(deadline && submittedAt && new Date(submittedAt) > new Date(deadline))
    );
  }).length;
  const completedAssignments = assignmentRows.filter((assignment) => {
    if (!assignment.deadline) return false;
    return new Date(assignment.deadline) < now;
  }).length;
  const averageScore = getAverageScore(submissionRows);
  const upcomingAssignments = assignmentRows
    .filter((assignment) => assignment.deadline)
    .sort(
      (a, b) =>
        new Date(a.deadline ?? 0).getTime() -
        new Date(b.deadline ?? 0).getTime()
    )
    .slice(0, 4);

  return (
    <div className="space-y-8">
     <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
  <div>
    <h1 className="text-3xl font-bold tracking-tight">
      Teacher Dashboard
    </h1>

    <p className="mt-1 text-muted-foreground">
      Monitor your batches, submissions, and assignment progress.
    </p>
  </div>

  <Button asChild className="h-11 rounded-xl px-6">
    <Link href="/teacher/batches">
      Manage batches
    </Link>
  </Button>
</div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
  {/* STUDENTS */}
  <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm font-medium text-blue-100">
          Students
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {students?.length ?? 0}
        </h2>

        <p className="mt-2 text-xs text-blue-100">
          Active learners
        </p>
      </div>

      <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
        <Users className="h-8 w-8" />
      </div>
    </CardContent>
  </Card>

  {/* PENDING */}
  <Card className="overflow-hidden border-0 bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg">
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm font-medium text-orange-100">
          Pending Review
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {pendingSubmissions}
        </h2>

        <p className="mt-2 text-xs text-orange-100">
          Waiting for evaluation
        </p>
      </div>

      <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
        <Clock className="h-8 w-8" />
      </div>
    </CardContent>
  </Card>

  {/* COMPLETED */}
  <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg">
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm font-medium text-green-100">
          Completed
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {completedAssignments}
        </h2>

        <p className="mt-2 text-xs text-green-100">
          Finished assignments
        </p>
      </div>

      <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
        <BookOpenCheck className="h-8 w-8" />
      </div>
    </CardContent>
  </Card>

  {/* AVG SCORE */}
  <Card className="overflow-hidden border-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg">
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm font-medium text-violet-100">
          Average Score
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {averageScore}%
        </h2>

        <p className="mt-2 text-xs text-violet-100">
          Overall performance
        </p>
      </div>

      <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
        <BarChart3 className="h-8 w-8" />
      </div>
    </CardContent>
  </Card>

  {/* LATE */}
  <Card className="overflow-hidden border-0 bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg">
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm font-medium text-rose-100">
          Late
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {lateSubmissions}
        </h2>

        <p className="mt-2 text-xs text-rose-100">
          Missed deadlines
        </p>
      </div>

      <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
        <AlertCircle className="h-8 w-8" />
      </div>
    </CardContent>
  </Card>
</div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>Assignment pipeline</CardTitle>
            <CardDescription>
              Upcoming deadlines and review workload across your batches.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAssignments.length ? (
              upcomingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex flex-col gap-2 rounded-lg border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {assignment.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Due{" "}
                      {assignment.deadline
                        ? new Intl.DateTimeFormat("en", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }).format(new Date(assignment.deadline))
                        : "without deadline"}
                    </div>
                  </div>
                  <Badge variant="outline">{assignment.max_marks ?? 0} marks</Badge>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No assignment deadlines yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Batch coverage</CardTitle>
            <CardDescription>Active batch setup at a glance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Average score</span>
                <span className="font-medium">{averageScore}%</span>
              </div>
              <Progress value={averageScore} />
            </div>
            <div className="space-y-2">
              {(batches ?? []).length ? (
                (batches ?? []).map((batch) => (
                  <div
                    key={batch.id}
                    className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm"
                  >
                    <span className="min-w-0 truncate">{batch.batch_name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {batch.years?.year_name ?? "No year"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                  <GraduationCap className="mb-2 size-5" />
                  Create your first batch to begin.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
