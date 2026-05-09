import { notFound } from "next/navigation";

import {
  CalendarDays,
  GraduationCap,
  Layers3,
  Users,
} from "lucide-react";

import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";

import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BatchDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase =
    await createClient();

  // BATCH
  const {
    data: batch,
    error: batchError,
  } = await supabase
    .from("batches")
    .select(`
      id,
      batch_name,
      created_at,
      years (
        year_name
      )
    `)
    .eq("id", id)
    .single();

  if (
    batchError ||
    !batch
  ) {
    return notFound();
  }

  // STUDENTS
  const {
    data: students,
  } = await supabase
    .from("students")
    .select(`
      id,
      profiles (
        name,
        email
      )
    `)
    .eq("batch_id", id);

  // TEACHERS
  // TEACHERS
const {
  data: batchTeachers,
  error: teacherError,
} = await supabase
  .from("batch_teachers")
  .select(`
    teacher_id,
    profiles (
      id,
      name,
      email
    )
  `)
  .eq("batch_id", id);

console.log(
  "BATCH TEACHERS:",
  batchTeachers
);

const teachers =
  batchTeachers?.map(
    (item: any) => ({
      id:
        item.profiles?.id,
      name:
        item.profiles?.name,
      email:
        item.profiles?.email,
    })
  ) || [];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <DashboardHeader
        title={batch.batch_name}
        description={`${
          (
            batch.years as any
          )?.year_name || ""
        } Batch Details`}
      />

      {/* STATS */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* STUDENTS */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Students
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                {students?.length || 0}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500 text-white shadow-lg">
              <GraduationCap className="h-7 w-7" />
            </div>
          </div>
        </div>

        {/* TEACHERS */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Teachers
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                {teachers.length}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg">
              <Users className="h-7 w-7" />
            </div>
          </div>
        </div>

        {/* CREATED */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Created
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                {batch.created_at
                  ? new Date(
                      batch.created_at
                    ).toLocaleDateString()
                  : "-"}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg">
              <CalendarDays className="h-7 w-7" />
            </div>
          </div>
        </div>
      </div>

      {/* TEACHERS TABLE */}
      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold">
            Teachers
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Teachers assigned to this batch.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Teacher Name
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Email
                </th>
              </tr>
            </thead>

            <tbody>
              {teachers.length > 0 ? (
                teachers.map(
                  (
                    teacher: any
                  ) => (
                    <tr
                      key={
                        teacher.id
                      }
                      className="border-t"
                    >
                      <td className="px-6 py-5 font-medium">
                        {
                          teacher.name
                        }
                      </td>

                      <td className="px-6 py-5 text-muted-foreground">
                        {
                          teacher.email
                        }
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    No teachers assigned
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STUDENTS TABLE */}
      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold">
            Students
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Students assigned to this batch.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Student Name
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Email
                </th>
              </tr>
            </thead>

            <tbody>
              {students &&
              students.length >
                0 ? (
                students.map(
                  (
                    student: any
                  ) => {
                    const profile =
                      Array.isArray(
                        student.profiles
                      )
                        ? student
                            .profiles[0]
                        : student.profiles;

                    return (
                      <tr
                        key={
                          student.id
                        }
                        className="border-t"
                      >
                        <td className="px-6 py-5 font-medium">
                          {
                            profile?.name
                          }
                        </td>

                        <td className="px-6 py-5 text-muted-foreground">
                          {
                            profile?.email
                          }
                        </td>
                      </tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    No students assigned
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}