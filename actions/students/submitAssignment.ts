"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { sendEmail } from "@/lib/email";

type SubmitAssignmentData = {
  assignment_id: string;

  student_id: string;

  submission_link: string;

  submission_file: string;

  submission_type: string;

  notes: string;
};

export async function submitAssignment(
  data: SubmitAssignmentData
) {
  try {
    const supabase =
      await createClient();

    // CHECK EXISTING SUBMISSION
    const {
      data: existingSubmission,
    } = await supabase
      .from("submissions")
      .select("id")
      .eq(
        "assignment_id",
        data.assignment_id
      )
      .eq(
        "student_id",
        data.student_id
      )
      .single();

    // UPDATE EXISTING
    if (existingSubmission) {
      const { error } =
        await supabase
          .from("submissions" as any)
          .update({
            submission_link:
              data.submission_link,

            file_url:
              data.submission_file,

            submission_type:
              data.submission_type,

            notes:
              data.notes,

            status:
              "submitted",
          })
          .eq(
            "id",
            existingSubmission.id
          );

      if (error) {
        return {
          success: false,
          message:
            error.message,
        };
      }
    }

    // CREATE NEW
    else {
      const { error } =
        await supabase
          .from("submissions" as any)
          .insert({
            assignment_id:
              data.assignment_id,

            student_id:
              data.student_id,

            submission_link:
              data.submission_link,

            file_url:
              data.submission_file,

            submission_type:
              data.submission_type,

            notes:
              data.notes,

            status:
              "submitted",
          });

      if (error) {
        return {
          success: false,
          message:
            error.message,
        };
      }
    }

    // GET STUDENT DETAILS
    const { data: student } =
      await supabase
        .from("profiles")
        .select(
          "name, email"
        )
        .eq(
          "id",
          data.student_id
        )
        .single();

    //// GET ASSIGNMENT DETAILS
const { data: assignment } =
  await supabase
    .from("assignments")
    .select(`
      id,
      title,
      deadline,
      batch_id
    `)
    .eq(
      "id",
      data.assignment_id
    )
    .single();

// GET TEACHER RELATION
const {
  data: batchTeacher,
} = await supabase
  .from("batch_teachers")
  .select(`
    teacher_id
  `)
  .eq(
    "batch_id",
    assignment!.batch_id
  )
  .limit(1)
  .single();

// GET TEACHER DETAILS
const { data: teacher } =
  await supabase
    .from("profiles")
    .select(
      "name, email"
    )
    .eq(
      "id",
      (batchTeacher as any)?.teacher_id
    )
    .single();

    // EMAIL TO TEACHER
    if (teacher?.email) {
      try {
        await sendEmail({
          to: teacher.email,

          subject:
            "New Assignment Submission",

          html: `
            <div style="font-family:sans-serif">

              <h2>
                New Submission Received
              </h2>

              <p>
                Student
                <strong>
                  ${student?.name}
                </strong>
                submitted an assignment.
              </p>

              <p>
                <strong>
                  Assignment:
                </strong>
                ${assignment?.title}
              </p>

            </div>
          `,
        });
      } catch (emailError) {
        console.log(
          "TEACHER EMAIL ERROR:",
          emailError
        );
      }
    }

    // EMAIL TO STUDENT
    if (student?.email) {
      try {
        await sendEmail({
          to: student.email,

          subject:
            "Assignment Submitted Successfully",

          html: `
            <div style="font-family:sans-serif">

              <h2>
                Submission Successful
              </h2>

              <p>
                Hello
                ${student.name},
              </p>

              <p>
                Your assignment has been submitted successfully.
              </p>

              <p>
                <strong>
                  Assignment:
                </strong>
                ${assignment?.title}
              </p>

              <p>
                <strong>
                  Deadline:
                </strong>
                ${assignment?.deadline}
              </p>

            </div>
          `,
        });
      } catch (emailError) {
        console.log(
          "STUDENT EMAIL ERROR:",
          emailError
        );
      }
    }

    revalidatePath(
      `/student/assignments/${data.assignment_id}`
    );

    revalidatePath(
      "/student/submissions"
    );

    return {
      success: true,
      message:
        "Assignment submitted successfully",
    };
  } catch (error: any) {
    console.log(error);

    return {
      success: false,
      message:
        error?.message ||
        "Something went wrong",
    };
  }
}