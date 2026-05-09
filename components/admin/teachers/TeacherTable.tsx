"use client";

import { Trash2 } from "lucide-react";

import { toast } from "sonner";

import { deleteTeacher } from "@/actions/admin/deleteTeacher";

import { Button } from "@/components/ui/button";

type Teacher = {
  id: string;
  name: string | null;
  email: string | null;
  phone?: string | null;
  created_at: string | null;
};

type TeacherTableProps = {
  teachers: Teacher[];
};

export default function TeacherTable({
  teachers,
}: TeacherTableProps) {
  async function handleDeleteTeacher(
    teacherId: string
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmed) return;

    const result =
      await deleteTeacher(teacherId);

    if (!result.success) {
      toast.error(result.message);

      return;
    }

    toast.success(
      "Teacher deleted successfully"
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Name
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Email
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Phone
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Joined
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-muted-foreground"
                >
                  No teachers found
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="border-b last:border-0"
                >
                  <td className="px-6 py-4 font-medium">
                    {teacher.name ||
                      "No Name"}
                  </td>

                  <td className="px-6 py-4 text-muted-foreground">
                    {teacher.email ||
                      "No Email"}
                  </td>

                  <td className="px-6 py-4">
                    {teacher.phone || "-"}
                  </td>

                  <td className="px-6 py-4 text-muted-foreground">
                   {teacher.created_at
                    ? new Date(
                    teacher.created_at
                    ).toISOString()
                    .split("T")[0]
  : "-"}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() =>
                        handleDeleteTeacher(
                          teacher.id
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}