import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const createStudentSchema = z.object({
  name: z.string().trim().min(2, "Student name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().optional(),
  password: z.string().min(6, "Password must be at least 6 characters."),
  batchId: z.string().uuid("Select a valid batch."),
});

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = createStudentSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid student details." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: teacherProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (teacherProfile?.role !== "teacher") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { data: batch } = await supabase
    .from("batches")
    .select("id")
    .eq("id", parsed.data.batchId)
    .eq("teacher_id", user.id)
    .single();

  if (!batch) {
    return NextResponse.json(
      { error: "Select one of your batches." },
      { status: 400 }
    );
  }

  let admin;

  try {
    admin = createAdminClient();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server is not configured." },
      { status: 500 }
    );
  }

  const { data: authData, error: authError } =
    await admin.auth.admin.createUser({
      email: parsed.data.email,
      password: parsed.data.password,
      email_confirm: true,
      user_metadata: {
        name: parsed.data.name,
        role: "student",
      },
    });

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: authError?.message || "Could not create auth user." },
      { status: 400 }
    );
  }

  const studentUserId = authData.user.id;

  const { error: profileError } = await admin.from("profiles").insert({
    id: studentUserId,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    role: "student",
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(studentUserId);
    return NextResponse.json(
      { error: profileError.message },
      { status: 400 }
    );
  }

  const { error: studentError } = await admin.from("students").insert({
    user_id: studentUserId,
    batch_id: parsed.data.batchId,
  });

  if (studentError) {
    await admin.from("profiles").delete().eq("id", studentUserId);
    await admin.auth.admin.deleteUser(studentUserId);
    return NextResponse.json(
      { error: studentError.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    student: {
      id: studentUserId,
      name: parsed.data.name,
      email: parsed.data.email,
      batchId: parsed.data.batchId,
    },
  });
}
