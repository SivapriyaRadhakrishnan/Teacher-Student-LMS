"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function deleteAssignment(
  assignmentId: string
) {
  try {
    const supabase =
      await createClient();

    // DELETE SUBMISSIONS FIRST
    await supabase
      .from("submissions")
      .delete()
      .eq(
        "assignment_id",
        assignmentId
      );

    // DELETE ASSIGNMENT
    const { error } =
      await supabase
        .from("assignments")
        .delete()
        .eq("id", assignmentId);

    if (error) {
      return {
        success: false,
        message:
          error.message,
      };
    }

    revalidatePath(
      "/teacher/assignments"
    );

    return {
      success: true,
      message:
        "Assignment deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.message ||
        "Something went wrong",
    };
  }
}