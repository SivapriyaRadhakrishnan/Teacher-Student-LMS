import {
  GraduationCap,
  Layers3,
} from "lucide-react";

type BatchStatsProps = {
  totalBatches: number;

  totalStudents: number;
};

export default function BatchStats({
  totalBatches,
  totalStudents,
}: BatchStatsProps) {
  const stats = [
    {
      title: "Total Batches",
      value: totalBatches,
      icon: Layers3,
      color:
        "bg-purple-500",
    },

    {
      title: "Total Students",
      value: totalStudents,
      icon: GraduationCap,
      color:
        "bg-green-500",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="group relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          {/* GLOW */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>

              <h3 className="mt-3 text-4xl font-bold tracking-tight">
                {stat.value}
              </h3>
            </div>

            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg ${stat.color}`}
            >
              <stat.icon className="h-7 w-7" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}