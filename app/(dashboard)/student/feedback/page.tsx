import {
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function StudentFeedbackPage() {
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

  // FETCH FEEDBACKS
  const { data: feedbacks } =
    await supabase
      .from("submissions")
      .select(`
        id,
        marks,
        feedback,
        status,

        assignments(
          title,
          max_marks
        )
      `)
      .eq(
        "student_id",
        user.id
      )
      .eq(
        "status",
        "reviewed"
      )
      .order("updated_at", {
        ascending: false,
      });

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Feedback
        </h1>

        <p className="mt-1 text-muted-foreground">
          View teacher feedback and
          marks for your assignments.
        </p>
      </div>

      {/* EMPTY */}
      {!feedbacks ||
      feedbacks.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
          <MessageSquare className="mx-auto h-14 w-14 text-muted-foreground" />

          <h2 className="mt-4 text-xl font-semibold">
            No feedback yet
          </h2>

          <p className="mt-2 text-muted-foreground">
            Reviewed assignments
            will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {feedbacks.map(
            (feedback) => (
              <div
                key={feedback.id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                {/* TOP */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {
                        feedback
                          .assignments
                          ?.title
                      }
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Assignment
                      reviewed by
                      teacher
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                    <CheckCircle2 className="h-4 w-4" />

                    Reviewed
                  </div>
                </div>

                {/* MARKS */}
                <div className="mt-6 rounded-xl bg-muted p-5">
                  <p className="text-sm text-muted-foreground">
                    Marks Obtained
                  </p>

                  <h3 className="mt-2 text-3xl font-bold">
                    {feedback.marks}
                    <span className="ml-1 text-lg text-muted-foreground">
                      /
                      {
                        feedback
                          .assignments
                          ?.max_marks
                      }
                    </span>
                  </h3>
                </div>

                {/* FEEDBACK */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Teacher Feedback
                  </h3>

                  <div className="mt-3 rounded-xl border bg-muted/40 p-5">
                    <p className="whitespace-pre-line text-sm leading-7">
                      {feedback.feedback ||
                        "No feedback provided."}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}