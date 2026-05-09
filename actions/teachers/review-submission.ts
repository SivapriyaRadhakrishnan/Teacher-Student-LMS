"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";

type ReviewSubmissionData = {
  submissionId: string;

  marks: number;

  feedback: string;
};

export async function reviewSubmission(
  data: ReviewSubmissionData
) {
  try {
    const supabase =
      await createClient();

    // UPDATE SUBMISSION
    const { error } =
      await supabase
        .from("submissions")
        .update({
          marks: data.marks,

          feedback:
            data.feedback,

          status:
            "reviewed",
        })
        .eq(
          "id",
          data.submissionId
        );

    if (error) {
      return {
        success: false,
        message:
          error.message,
      };
    }

    // GET SUBMISSION DETAILS
    const { data: submission } =
      await supabase
        .from("submissions")
        .select(`
          student_id,
          assignment_id
        `)
        .eq(
          "id",
          data.submissionId
        )
        .single();

    // GET STUDENT DETAILS
    const { data: student } =
      await supabase
        .from("profiles")
        .select(`
          name,
          email
        `)
        .eq(
          "id",
          submission!.student_id
        )
        .single();

    // GET ASSIGNMENT DETAILS
    const { data: assignment } =
      await supabase
        .from("assignments")
        .select(`
          title
        `)
        .eq(
          "id",
          submission!.assignment_id
        )
        .single();

    // SEND EMAIL TO STUDENT
    if (student?.email) {
      await sendEmail({
        to: student.email!,

        subject:
          "Assignment Reviewed",

        html: `
          <div style="font-family:sans-serif">

            <h2>
              Assignment Feedback Received
            </h2>

            <p>
              Hello
              ${student.name},
            </p>

            <p>
              Your assignment has been reviewed by your teacher.
            </p>

            <p>
              <strong>
                Assignment:
              </strong>
              ${assignment?.title}
            </p>

            <p>
              <strong>
                Marks:
              </strong>
              ${data.marks}
            </p>

            <p>
              <strong>
                Feedback:
              </strong>
            </p>

            <p>
              ${data.feedback}
            </p>

          </div>
        `,
      });
    }

    revalidatePath(
      "/teacher/submissions"
    );

    return {
      success: true,
      message:
        "Review saved successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message:
        "Something went wrong",
    };
  }
}