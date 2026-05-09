type Assignment = {
  id: string;
  title: string;
  deadline: string | null;
  max_marks: number | null;
  created_at: string | null;

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
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
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
            </tr>
          </thead>

          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-muted-foreground"
                >
                  No assignments found
                </td>
              </tr>
            ) : (
              assignments.map((assignment) => (
                <tr
                  key={assignment.id}
                  className="border-b last:border-0"
                >
                  {/* TITLE */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">
                        {assignment.title}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Created{" "}
                        {assignment.created_at
                          ? new Date(
                              assignment.created_at
                            )
                              .toISOString()
                              .split("T")[0]
                          : "-"}
                      </p>
                    </div>
                  </td>

                  {/* YEAR */}
                  <td className="px-6 py-4 text-muted-foreground">
                    {assignment.batches
                      ?.years?.year_name ||
                      "-"}
                  </td>

                  {/* BATCH */}
                  <td className="px-6 py-4">
                    {assignment.batches
                      ?.batch_name || "-"}
                  </td>

                  {/* DEADLINE */}
                  <td className="px-6 py-4 text-muted-foreground">
                    {assignment.deadline
                      ? new Date(
                          assignment.deadline
                        )
                          .toISOString()
                          .split("T")[0]
                      : "-"}
                  </td>

                  {/* MARKS */}
                  <td className="px-6 py-4">
                    {assignment.max_marks ||
                      0}
                  </td>

                  {/* SUBMISSIONS */}
                  <td className="px-6 py-4">
                    {assignment.submissionCount ||
                      0}
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