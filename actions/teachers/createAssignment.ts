"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { sendEmail } from "@/lib/email";

type CreateAssignmentData = {
  title: string;

  description: string;

  instructions: string;

  deadline: string;

  max_marks: string;

  batch_id: string;

  allowed_submission_types:
    string[];
};

export async function createAssignment(
  data: CreateAssignmentData
) {
  try {
    const supabase =
      await createClient();

    // AUTH USER
    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message:
          "Unauthorized user",
      };
    }

    // CREATE ASSIGNMENT
    const { error } =
      await supabase
        .from(
          "assignments" as any
        )
        .insert({
          title: data.title,

          description:
            data.description,

          instructions:
            data.instructions,

          deadline:
            data.deadline,

          max_marks: Number(
            data.max_marks
          ),

          batch_id:
            data.batch_id,

          teacher_id: user.id,

          allowed_types:
            data.allowed_submission_types,
        });

    // INSERT ERROR
    if (error) {
      return {
        success: false,
        message:
          error.message,
      };
    }

    // GET STUDENTS IN BATCH
    const { data: students } =
      await supabase
        .from("students")
        .select(`
          id,
          profiles (
            name,
            email
          )
        `)
        .eq(
          "batch_id",
          data.batch_id
        );

    // SEND EMAIL TO STUDENTS
    if (
      students &&
      students.length > 0
    ) {
      for (const student of students) {
        const profile =
          Array.isArray(
            student.profiles
          )
            ? student.profiles[0]
            : student.profiles;

        if (profile?.email) {
          try {
            await sendEmail({
              to: profile.email,

              subject:
                "New Assignment Assigned",

              html: `
                <div style="font-family:sans-serif">

                  <h2>
                    New Assignment
                  </h2>

                  <p>
                    Hello
                    ${profile.name},
                  </p>

                  <p>
                    A new assignment has been assigned to you.
                  </p>

                  <p>
                    <strong>
                      Title:
                    </strong>
                    ${data.title}
                  </p>

                  <p>
                    <strong>
                      Description:
                    </strong>
                    ${data.description}
                  </p>

                  <p>
                    <strong>
                      Instructions:
                    </strong>
                    ${data.instructions}
                  </p>

                  <p>
                    <strong>
                      Deadline:
                    </strong>
                    ${data.deadline}
                  </p>

                  <p>
                    Please submit before deadline.
                  </p>

                </div>
              `,
            });
          } catch (emailError) {
            console.log(
              "EMAIL ERROR:",
              emailError
            );
          }
        }
      }
    }

    // REFRESH PAGE
    revalidatePath(
      "/teacher/assignments"
    );

    return {
      success: true,
      message:
        "Assignment created successfully",
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