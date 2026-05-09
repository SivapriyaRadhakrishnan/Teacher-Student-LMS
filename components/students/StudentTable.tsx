import { Mail, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type StudentTableRow = {
  id: string;
  created_at: string | null;
  profile: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  batch: {
    id: string;
    batch_name: string;
    year_name: string | null;
  } | null;
};

type StudentTableProps = {
  students: StudentTableRow[];
};

function formatDate(value: string | null) {
  if (!value) return "Recently";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function StudentTable({ students }: StudentTableProps) {
  return (
    <div className="rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead className="text-right">Added</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <div className="font-medium">
                  {student.profile?.name || "Unnamed student"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {student.profile?.id}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="size-3.5 text-muted-foreground" />
                    {student.profile?.email || "No email"}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-3.5" />
                    {student.profile?.phone || "No phone"}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {student.batch ? (
                  <div className="space-y-1">
                    <Badge variant="secondary">{student.batch.batch_name}</Badge>
                    <div className="text-xs text-muted-foreground">
                      {student.batch.year_name || "No year"}
                    </div>
                  </div>
                ) : (
                  <Badge variant="outline">Unassigned</Badge>
                )}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatDate(student.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
