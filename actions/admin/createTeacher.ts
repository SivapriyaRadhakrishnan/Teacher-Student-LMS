"use server";

import { randomBytes } from "crypto";

import { revalidatePath } from "next/cache";

import { createClient } from "@supabase/supabase-js";

import { sendEmail } from "@/lib/email";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type CreateTeacherParams = {
  name: string;
  email: string;
  phone: string;
};

export async function createTeacher({
  name,
  email,
  phone,
}: CreateTeacherParams) {
  try {
    // GENERATE PASSWORD
    const password =
      randomBytes(4).toString("hex");

    // CREATE AUTH USER
    const {
      data: authData,
      error: authError,
    } =
      await supabaseAdmin.auth.admin.createUser(
        {
          email,
          password,
          email_confirm: true,
        }
      );

    if (authError) {
      return {
        success: false,
        message: authError.message,
      };
    }

    // INSERT PROFILE
    const {
      error: profileError,
    } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: authData.user.id,
        name,
        email,
        phone,
        role: "teacher",
      });

    if (profileError) {
      return {
        success: false,
        message: profileError.message,
      };
    }

    // SEND EMAIL
    await sendEmail({
      to: email,
      subject: "Your LMS Teacher Account",
      html: `
        <h2>Welcome to LMS</h2>

        <p>Hello ${name},</p>

        <p>Your teacher account has been created successfully.</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Password:</strong> ${password}</p>

        <p>Please login and change your password.</p>
      `,
    });

    revalidatePath("/admin/teachers");

    return {
      success: true,
      message:
        "Teacher created successfully",
      password,
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}