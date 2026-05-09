"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function deleteTeacher(
  teacherId: string
) {
  try {
    // DELETE PROFILE
    await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", teacherId);

    // DELETE AUTH USER
    const { error } =
      await supabaseAdmin.auth.admin.deleteUser(
        teacherId
      );

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    revalidatePath("/admin/teachers");

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}