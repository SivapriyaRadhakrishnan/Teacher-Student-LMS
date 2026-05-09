import {
    CheckCircle2,
    Clock3,
    ExternalLink,
    FileText,
} from "lucide-react";

import Link from "next/link";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function StudentSubmissionsPage() {
    const supabase =
        await createClient();

    // AUTH
    const {
        data: { user },
    } =
        await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }
    // FETCH SUBMISSIONS
    const { data: submissions,error } =
        await supabase
            .from("submissions")
            .select(`
      id,
      status,
      marks,
      feedback,
      file_url,
      submission_link,
     

      assignments:assignment_id (
        id,
        title,
        deadline,
        max_marks
      )
    `)
            .eq(
                "student_id",
                user.id
            )
          
console.log("USER ID:", user.id);
console.log("SUBMISSIONS:", submissions);
console.log("ERROR:", error);
    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    My Submissions
                </h1>

                <p className="mt-1 text-muted-foreground">
                    Track assignment
                    submissions, marks,
                    and teacher feedback.
                </p>
            </div>

            {/* EMPTY */}
            {!submissions ||
                submissions.length === 0 ? (
                <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />

                    <h2 className="mt-4 text-xl font-semibold">
                        No submissions yet
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Submitted assignments
                        will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {submissions.map(
                        (submission: any) => {
                            const assignment =
                                submission.assignments;

                            return (
                                <div
                                    key={submission.id}
                                    className="rounded-2xl border bg-white p-6 shadow-sm"
                                >
                                    {/* TOP */}
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold">
                                                {
                                                    assignment?.title
                                                }
                                            </h2>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Deadline:{" "}
                                                {assignment?.deadline
                                                    ? new Date(
                                                        assignment.deadline
                                                    ).toLocaleDateString(
                                                        "en-CA"
                                                    )
                                                    : "-"}
                                            </p>
                                        </div>

                                        {/* STATUS */}
                                        <div>
                                            {submission.status ===
                                                "reviewed" ? (
                                                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Reviewed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
                                                    <Clock3 className="h-4 w-4" />
                                                    Pending Review
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* DETAILS */}
                                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        {/* MARKS */}
                                        <div className="rounded-xl border p-4">
                                            <p className="text-sm text-muted-foreground">
                                                Marks
                                            </p>

                                            <h3 className="mt-2 text-2xl font-bold">
                                                {submission.marks ??
                                                    "-"}
                                                {submission.marks &&
                                                    ` / ${assignment?.max_marks || 100}`}
                                            </h3>
                                        </div>

                                        {/* FILE */}
                                        <div className="rounded-xl border p-4">
                                            <p className="text-sm text-muted-foreground">
                                                Uploaded File
                                            </p>

                                            {submission.file_url ? (
                                                <Link
                                                    href={
                                                        submission.file_url
                                                    }
                                                    target="_blank"
                                                    className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                                                >
                                                    Open File
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                            ) : (
                                                <p className="mt-2 text-sm">
                                                    -
                                                </p>
                                            )}
                                        </div>

                                        {/* LINK */}
                                        <div className="rounded-xl border p-4">
                                            <p className="text-sm text-muted-foreground">
                                                Submission Link
                                            </p>

                                            {submission.submission_link ? (
                                                <Link
                                                    href={
                                                        submission.submission_link
                                                    }
                                                    target="_blank"
                                                    className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                                                >
                                                    Open Link
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                            ) : (
                                                <p className="mt-2 text-sm">
                                                    -
                                                </p>
                                            )}
                                        </div>

                                       
                                    </div>

                                    {/* FEEDBACK */}
                                    <div className="mt-6 rounded-xl border bg-muted/30 p-4">
                                        <h3 className="font-semibold">
                                            Teacher Feedback
                                        </h3>

                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {submission.feedback ||
                                                "No feedback yet."}
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            )}
        </div>
    );
}