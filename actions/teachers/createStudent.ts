"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@supabase/supabase-js";

import { sendEmail } from "@/lib/email";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type CreateStudentData = {
  name: string;
  email: string;
  phone: string;
  batch_id: string;
};

export async function createStudent(
  data: CreateStudentData
) {
  try {
    // TEMP PASSWORD
    const tempPassword =
      `${data.name
        .split(" ")[0]
        .toLowerCase()}@123`;

    // CREATE AUTH USER
    const {
      data: authData,
      error: authError,
    } =
      await supabaseAdmin.auth.admin.createUser(
        {
          email: data.email,
          password:
            tempPassword,
          email_confirm: true,
        }
      );

    // AUTH ERROR
    if (
      authError ||
      !authData.user
    ) {
      return {
        success: false,
        message:
          authError?.message ||
          "Failed to create auth user",
      };
    }

    const userId =
      authData.user.id;

    // INSERT PROFILE
    const {
      error: profileError,
    } =
      await supabaseAdmin
        .from("profiles")
        .insert({
          id: userId,
          name: data.name,
          email: data.email,
          role: "student",
        });

    // PROFILE ERROR
    if (profileError) {
      return {
        success: false,
        message:
          profileError.message,
      };
    }

    // INSERT STUDENT
const {
  error: studentError,
} =
  await supabaseAdmin
    .from("students")
    .insert({
      id: userId,
      batch_id:
        data.batch_id,
      phone: data.phone,
    });

    // STUDENT ERROR
    if (studentError) {
      return {
        success: false,
        message:
          studentError.message,
      };
    }

    // SEND EMAIL
    const emailResponse =
      await sendEmail({
        to: data.email,

        subject:
          "Your LMS Student Account",

        html: `
          <div style="font-family:sans-serif">

            <h2>
              Welcome to LMS
            </h2>

            <p>
              Hello ${data.name},
            </p>

            <p>
              Your student account has been created successfully.
            </p>

            <p>
              <strong>
                Email:
              </strong>
              ${data.email}
            </p>

            <p>
              <strong>
                Password:
              </strong>
              ${tempPassword}
            </p>

            <p>
              Please login and change your password after first login.
            </p>

          </div>
        `,
      });

    revalidatePath(
      "/teacher/students"
    );

    return {
      success: true,
      message:
        "Student created successfully",
      password:
        tempPassword,
      emailResponse,
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