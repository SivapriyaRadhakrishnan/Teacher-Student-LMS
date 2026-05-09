import {
  BookOpen,
  Clock,
  FileCheck,
} from "lucide-react";

type AssignmentStatsProps = {
  totalAssignments: number;
  pendingAssignments: number;
  completedAssignments: number;
};

export default function AssignmentStats({
  totalAssignments,
  pendingAssignments,
  completedAssignments,
}: AssignmentStatsProps) {
  const stats = [
    {
      title: "Assignments",
      value: totalAssignments,
      icon: BookOpen,
      color: "bg-blue-500",
    },

    {
      title: "Pending",
      value: pendingAssignments,
      icon: Clock,
      color: "bg-orange-500",
    },

    {
      title: "Completed",
      value: completedAssignments,
      icon: FileCheck,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  {stat.value}
                </h2>
              </div>

              <div
                className={`rounded-2xl p-4 text-white ${stat.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}