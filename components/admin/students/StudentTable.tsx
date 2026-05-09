import {
  CalendarDays,
  GraduationCap,
} from "lucide-react";

type Student = {
  id: string;

  name: string | null;

  email: string | null;

  created_at?: string | null;
};

type StudentTableProps = {
  students: Student[];
};

export default function StudentTable({
  students,
}: StudentTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
      {/* HEADER */}
      <div className="border-b p-6">
        <h2 className="text-xl font-bold">
          All Students
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          View all registered students.
        </p>
      </div>

      {/* EMPTY */}
      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <GraduationCap className="h-8 w-8 text-muted-foreground" />
          </div>

          <h3 className="mt-6 text-xl font-semibold">
            No students found
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            No students available right now.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Student
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Joined Date
                </th>
              </tr>
            </thead>

            <tbody>
              {students.map(
                (student) => (
                  <tr
                    key={student.id}
                    className="border-t transition hover:bg-muted/30"
                  >
                    {/* STUDENT */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                          <GraduationCap className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-semibold">
                            {student.name ||
                              "Unknown Student"}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            ID:
                            {" "}
                            {student.id.slice(
                              0,
                              8
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="px-6 py-5 text-sm text-muted-foreground">
                      {student.email ||
                        "No email"}
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />

                        {student.created_at
                          ? new Date(
                              student.created_at
                            ).toLocaleDateString()
                          : "No date"}
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}