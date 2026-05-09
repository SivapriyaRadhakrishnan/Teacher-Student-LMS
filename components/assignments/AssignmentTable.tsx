"use client";

import { Trash2 } from "lucide-react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { deleteAssignment } from "@/actions/teachers/delete-assignment";

type Assignment = {
  id: string;

  title: string;

  deadline: string | null;

  max_marks: number | null;

  created_at: string | null;

  marks?: number;

  batches:
    | {
        batch_name: string;

        years:
          | {
              year_name: string;
            }
          | null;
      }
    | null;

  submissionCount?: number;
};

type AssignmentTableProps = {
  assignments: Assignment[];
};

export default function AssignmentTable({
  assignments,
}: AssignmentTableProps) {
  const router = useRouter();

  async function handleDelete(
    id: string
  ) {
    const confirmDelete =
      window.confirm(
        "Delete this assignment?"
      );

    if (!confirmDelete) {
      return;
    }

    const result =
      await deleteAssignment(id);

    if (!result.success) {
      toast.error(
        result.message
      );

      return;
    }

    toast.success(
      "Assignment deleted successfully"
    );

    router.refresh();
  }

  return (
    <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Assignment
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Year
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Batch
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Deadline
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Marks
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Submissions
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {assignments.length ===
            0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-muted-foreground"
                >
                  No assignments found
                </td>
              </tr>
            ) : (
              assignments.map(
                (assignment) => (
                  <tr
                    key={
                      assignment.id
                    }
                    className="border-b transition hover:bg-muted/20 last:border-0"
                  >
                    {/* TITLE */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {
                            assignment.title
                          }
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Created{" "}
                          {assignment.created_at
                            ? new Date(
                                assignment.created_at
                              )
                                .toISOString()
                                .split(
                                  "T"
                                )[0]
                            : "-"}
                        </p>
                      </div>
                    </td>

                    {/* YEAR */}
                    <td className="px-6 py-4 text-muted-foreground">
                      {assignment
                        .batches
                        ?.years
                        ?.year_name ||
                        "-"}
                    </td>

                    {/* BATCH */}
                    <td className="px-6 py-4">
                      {assignment
                        .batches
                        ?.batch_name ||
                        "-"}
                    </td>

                    {/* DEADLINE */}
                    <td className="px-6 py-4 text-muted-foreground">
                      {assignment.deadline
                        ? new Date(
                            assignment.deadline
                          )
                            .toISOString()
                            .split(
                              "T"
                            )[0]
                        : "-"}
                    </td>

                    {/* MARKS */}
                    <td className="px-6 py-4 font-medium">
                      {assignment.marks ||
                        0}
                    </td>

                    {/* SUBMISSIONS */}
                    <td className="px-6 py-4">
                      {assignment.submissionCount ||
                        0}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            handleDelete(
                              assignment.id
                            )
                          }
                          className="flex items-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4" />

                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}