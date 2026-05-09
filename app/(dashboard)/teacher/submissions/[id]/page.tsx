import Link from "next/link";

import {
  ExternalLink,
} from "lucide-react";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { reviewSubmission } from "@/actions/teachers/review-submission";
export default async function ReviewSubmissionPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } =
    await params;

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

  // FETCH SUBMISSION
  const { data: submission } =
    await supabase
      .from("submissions")
      .select(`
        *,
        
        assignments(
          title,
          max_marks
        ),

        profiles!student_id(
          name,
          email
        )
      `)
      .eq("id", id)
      .single();

  if (!submission) {
    redirect(
      "/teacher/submissions"
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Review Submission
        </h1>

        <p className="mt-1 text-muted-foreground">
          Review student work and
          provide marks + feedback.
        </p>
      </div>

      {/* STUDENT INFO */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          {
            submission
              ?.profiles?.name
          }
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {
            submission
              ?.profiles?.email
          }
        </p>

        <div className="mt-6">
          <h3 className="font-medium">
            Assignment
          </h3>

          <p className="mt-1 text-muted-foreground">
            {
              submission
                ?.assignments
                ?.title
            }
          </p>
        </div>

        <div className="mt-4">
          <h3 className="font-medium">
            Max Marks
          </h3>

          <p className="mt-1 text-muted-foreground">
            {
              submission
                ?.assignments
                ?.max_marks
            }
          </p>
        </div>
      </div>

      {/* SUBMISSION */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Student Submission
        </h2>

        <div className="mt-6 flex flex-wrap gap-4">
          {submission.file_url && (
            <Link
              href={
                submission.file_url
              }
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Open Uploaded File
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}

          {submission.submission_link && (
            <Link
              href={
                submission.submission_link
              }
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Open Submission Link
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>

        {submission.notes && (
          <div className="mt-6 rounded-xl bg-muted p-4">
            <p className="text-sm">
              {submission.notes}
            </p>
          </div>
        )}
      </div>

      {/* REVIEW FORM */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Review & Feedback
        </h2>

        <form
  action={async (formData) => {
    "use server";

    await reviewSubmission({
      submissionId:
        submission.id,

      marks: Number(
        formData.get("marks")
      ),

      feedback: String(
        formData.get(
          "feedback"
        )
      ),
    });
  }}
  className="mt-6 space-y-6"
>
          {/* MARKS */}
          <div>
            <label className="text-sm font-medium">
              Marks
            </label>

            <input
              name="marks"
              type="number"
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none"
              placeholder="Enter marks"
            />
          </div>

          {/* FEEDBACK */}
          <div>
            <label className="text-sm font-medium">
              Feedback
            </label>

            <textarea
              name="feedback"
              rows={5}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none"
              placeholder="Write feedback for student..."
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:bg-black/90"
          >
            Save Review
          </button>
        </form>
      </div>
    </div>
  );
}