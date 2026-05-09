import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Submission = {
  id: string;

  status: string | null;

  marks: number | null;

  assignments: {
    title: string;

    batches: {
      batch_name: string;

      years: {
        year_name: string;
      } | null;
    } | null;
  } | null;

  profiles: {
    name: string;
    email: string;
  } | null;
};

export default async function TeacherSubmissionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data,error } =
    await supabase
      .from("submissions")
      .select(`
        id,
        status,
        marks,

        assignments(
          title,

          batches(
            batch_name,

            years(
              year_name
            )
          )
        ),

        profiles!student_id(
          name,
          email
        )
      `)
      console.log("SUBMISSIONS ERROR:", error);
console.log("SUBMISSIONS DATA:", data);

  const submissions =
    (data || []) as Submission[];

  const totalSubmissions =
    submissions.length;

  const reviewedSubmissions =
    submissions.filter(
      (submission) =>
        submission.status ===
        "reviewed"
    ).length;

  const pendingSubmissions =
    submissions.filter(
      (submission) =>
        submission.status ===
        "pending"
    ).length;

  const lateSubmissions =
    submissions.filter(
      (submission) =>
        submission.status ===
        "late_submission"
    ).length;

  const stats = [
    {
      title: "Total",
      value: totalSubmissions,
      icon: FileText,
      color: "bg-blue-500",
    },

    {
      title: "Reviewed",
      value: reviewedSubmissions,
      icon: CheckCircle2,
      color: "bg-green-500",
    },

    {
      title: "Pending",
      value: pendingSubmissions,
      icon: Clock3,
      color: "bg-orange-500",
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
          Submissions
        </h1>

        <p className="mt-1 text-muted-foreground">
          Review submissions and track student progress.
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
{/* FILTERS */}
<div className="rounded-2xl border bg-white p-4 shadow-sm">
  <div className="grid gap-4 md:grid-cols-4">
    {/* SEARCH */}
    <Input placeholder="Search student..." />

    {/* YEAR */}
    <select className="rounded-xl border bg-background px-3 py-2 text-sm">
      <option>
        All Years
      </option>

      <option>
        First Year
      </option>

      <option>
        Second Year
      </option>

      <option>
        Third Year
      </option>
    </select>

    {/* BATCH */}
    <select className="rounded-xl border bg-background px-3 py-2 text-sm">
      <option>
        All Batches
      </option>

      <option>
        UI/UX Batch A
      </option>

      <option>
        Graphic Design Batch B
      </option>
    </select>

    {/* STATUS */}
    <select className="rounded-xl border bg-background px-3 py-2 text-sm">
      <option>
        All Status
      </option>

      <option>
        Pending
      </option>

      <option>
        Reviewed
      </option>

      <option>
        Late Submission
      </option>
    </select>
  </div>
</div>
      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Student
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Assignment
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Year
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Batch
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Marks
                </th>
              </tr>
            </thead>

            <tbody>
              {submissions.length ===
              0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    No submissions found
                  </td>
                </tr>
              ) : (
                submissions.map(
                  (submission) => (
                    <tr
                      key={submission.id}
                      className="border-b last:border-0"
                    >
                      {/* STUDENT */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">
                            {submission
                              .profiles
                              ?.name ||
                              "-"}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {submission
                              .profiles
                              ?.email ||
                              "-"}
                          </p>
                        </div>
                      </td>

                      {/* ASSIGNMENT */}
                      <td className="px-6 py-4">
                        {submission
                          .assignments
                          ?.title ||
                          "-"}
                      </td>

                      {/* YEAR */}
                      <td className="px-6 py-4 text-muted-foreground">
                        {submission
                          .assignments
                          ?.batches
                          ?.years
                          ?.year_name ||
                          "-"}
                      </td>

                      {/* BATCH */}
                      <td className="px-6 py-4">
                        {submission
                          .assignments
                          ?.batches
                          ?.batch_name ||
                          "-"}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
                          {submission.status?.replace(
                            "_",
                            " "
                          ) || "-"}
                        </span>
                      </td>

                     {/* MARKS */}
<td className="px-6 py-4">
  <div className="flex items-center gap-3">
    <span>
      {submission.marks ?? "-"}
    </span>

    <Link
      href={`/teacher/submissions/${submission.id}`}
      className="rounded-lg bg-black px-3 py-1 text-xs font-medium text-white hover:bg-black/90"
    >
      Review
    </Link>
  </div>
</td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}