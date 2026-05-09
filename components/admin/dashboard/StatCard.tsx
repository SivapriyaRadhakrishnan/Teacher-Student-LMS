import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;

  value: number;

  icon: LucideIcon;

  color: string;
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <h3 className="mt-3 text-4xl font-bold tracking-tight">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg ${color}`}
        >
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}