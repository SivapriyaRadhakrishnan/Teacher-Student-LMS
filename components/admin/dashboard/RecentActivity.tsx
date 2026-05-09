import {
  GraduationCap,
  Layers3,
  Users,
} from "lucide-react";

type ActivityItem = {
  id: string;

  title: string;

  created_at: string | null;
};

type RecentActivityProps = {
  teachers: ActivityItem[];

  students: ActivityItem[];

  batches: ActivityItem[];
};

export default function RecentActivity({
  teachers,
  students,
  batches,
}: RecentActivityProps) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">
            Recent Activity
          </h2>

          <p className="text-sm text-muted-foreground">
            Latest updates in your LMS platform
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {/* TEACHERS */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Users className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold">
                Recent Teachers
              </h3>

              <p className="text-xs text-muted-foreground">
                Newly added teachers
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between rounded-2xl border p-4 transition hover:bg-muted/40"
                >
                  <div>
                    <p className="font-medium">
                      {teacher.title}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Teacher ID:
                      {" "}
                      {teacher.id.slice(
                        0,
                        8
                      )}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {teacher.created_at
                      ? new Date(
                          teacher.created_at
                        ).toLocaleDateString()
                      : "No date"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No teachers found.
              </p>
            )}
          </div>
        </div>

        {/* STUDENTS */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold">
                Recent Students
              </h3>

              <p className="text-xs text-muted-foreground">
                Newly enrolled students
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {students.length > 0 ? (
              students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-2xl border p-4 transition hover:bg-muted/40"
                >
                  <div>
                    <p className="font-medium">
                      {student.title}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Student ID:
                      {" "}
                      {student.id.slice(
                        0,
                        8
                      )}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {student.created_at
                      ? new Date(
                          student.created_at
                        ).toLocaleDateString()
                      : "No date"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No students found.
              </p>
            )}
          </div>
        </div>

        {/* BATCHES */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Layers3 className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold">
                Recent Batches
              </h3>

              <p className="text-xs text-muted-foreground">
                Newly created batches
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {batches.length > 0 ? (
              batches.map((batch) => (
                <div
                  key={batch.id}
                  className="flex items-center justify-between rounded-2xl border p-4 transition hover:bg-muted/40"
                >
                  <div>
                    <p className="font-medium">
                      {batch.title}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Batch ID:
                      {" "}
                      {batch.id.slice(
                        0,
                        8
                      )}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {batch.created_at
                      ? new Date(
                          batch.created_at
                        ).toLocaleDateString()
                      : "No date"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No batches found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}