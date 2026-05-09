import { BookOpen, CalendarDays, GraduationCap, Users } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import BatchActions from "@/components/batches/BatchActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Database } from "@/lib/supabase/types";
import type { BatchYearOption } from "@/components/batches/CreateBatchModal";

type BatchRow = Database["public"]["Tables"]["batches"]["Row"];
type YearSummary = Pick<
  Database["public"]["Tables"]["years"]["Row"],
  "id" | "year_name"
>;

export type BatchCardData = Pick<
  BatchRow,
  "id" | "batch_name" | "created_at" | "year_id"
> & {
  year: YearSummary | null;
  studentCount: number;
  assignmentCount: number;
};

type BatchCardProps = {
  batch: BatchCardData;
  teacherId: string;
  years: BatchYearOption[];
};

function formatCreatedAt(value: string | null) {
  if (!value) return "Recently created";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function BatchCard({ batch, teacherId, years }: BatchCardProps) {
  return (
    <Card className="shadow-sm transition-colors hover:bg-muted/20">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-lg">{batch.batch_name}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1.5">
              <GraduationCap className="size-3.5" />
              {batch.year?.year_name || "No year assigned"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline">{batch.studentCount} students</Badge>
            <BatchActions batch={batch} teacherId={teacherId} years={years} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border bg-background px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="size-3.5" />
              Students
            </div>
            <div className="mt-1 text-xl font-semibold">{batch.studentCount}</div>
          </div>
          <div className="rounded-lg border bg-background px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BookOpen className="size-3.5" />
              Assignments
            </div>
            <div className="mt-1 text-xl font-semibold">
              {batch.assignmentCount}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {formatCreatedAt(batch.created_at)}
          </span>
          <Link href="/teacher/students" className="font-medium text-foreground">
            Manage
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
