import { UserCheck, Users } from "lucide-react";

type TeacherStatsProps = {
  totalTeachers: number;
};

export default function TeacherStats({
  totalTeachers,
}: TeacherStatsProps) {
  const stats = [
    {
      title: "Total Teachers",
      value: totalTeachers,
      icon: Users,
      color: "bg-blue-500",
    },

    {
      title: "Active Teachers",
      value: totalTeachers,
      icon: UserCheck,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2">
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

            <p className="mt-4 text-sm text-green-600">
              Live teacher data
            </p>
          </div>
        );
      })}
    </div>
  );
}