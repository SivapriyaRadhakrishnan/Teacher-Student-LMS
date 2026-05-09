"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  Edit,
  GraduationCap,
  Loader2,
  MoreHorizontal,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export type YearManagementItem = {
  id: string;
  year_name: string;
  created_at: string | null;
  batchCount: number;
  studentCount: number;
};

type YearManagementClientProps = {
  teacherId: string;
  years: YearManagementItem[];
};

const yearSchema = z.object({
  yearName: z.string().trim().min(2, "Year name is required."),
});

type YearFormValues = z.infer<typeof yearSchema>;

function formatDate(value: string | null) {
  if (!value) return "Recently created";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function YearManagementClient({
  teacherId,
  years,
}: YearManagementClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<YearManagementItem | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const createForm = useForm<YearFormValues>({
    resolver: zodResolver(yearSchema),
    defaultValues: { yearName: "" },
  });

  const editForm = useForm<YearFormValues>({
    resolver: zodResolver(yearSchema),
    defaultValues: { yearName: "" },
  });

  useEffect(() => {
    editForm.reset({ yearName: editingYear?.year_name ?? "" });
  }, [editForm, editingYear]);

  async function createYear(values: YearFormValues) {
    const { error } = await supabase.from("years").insert({
      year_name: values.yearName,
      teacher_id: teacherId,
    });

    if (error) {
      toast.error("Could not create year", { description: error.message });
      return;
    }

    toast.success("Year created");
    createForm.reset({ yearName: "" });
    setCreateOpen(false);
    router.refresh();
  }

  async function updateYear(values: YearFormValues) {
    if (!editingYear) return;

    const { error } = await supabase
      .from("years")
      .update({ year_name: values.yearName })
      .eq("id", editingYear.id)
      .eq("teacher_id", teacherId);

    if (error) {
      toast.error("Could not update year", { description: error.message });
      return;
    }

    toast.success("Year updated");
    setEditingYear(null);
    router.refresh();
  }

  async function deleteYear(year: YearManagementItem) {
    if (year.batchCount > 0) {
      toast.error("Move or delete batches first", {
        description: "Years with batches cannot be deleted.",
      });
      return;
    }

    setDeletingId(year.id);

    const { error } = await supabase
      .from("years")
      .delete()
      .eq("id", year.id)
      .eq("teacher_id", teacherId);

    setDeletingId(null);

    if (error) {
      toast.error("Could not delete year", { description: error.message });
      return;
    }

    toast.success("Year deleted");
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Years</h1>
          <p className="text-sm text-muted-foreground">
            Maintain academic years before organizing batches and students.
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus data-icon="inline-start" />
              New year
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create year</DialogTitle>
              <DialogDescription>
                Add an academic year such as First Year or 2026-2027.
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={createForm.handleSubmit(createYear)}
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="yearName">Year name</Label>
                <Input
                  id="yearName"
                  placeholder="First Year"
                  aria-invalid={Boolean(createForm.formState.errors.yearName)}
                  {...createForm.register("yearName")}
                />
                {createForm.formState.errors.yearName ? (
                  <p className="text-sm text-destructive">
                    {createForm.formState.errors.yearName.message}
                  </p>
                ) : null}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                  disabled={createForm.formState.isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createForm.formState.isSubmitting}>
                  {createForm.formState.isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : null}
                  Create year
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {years.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {years.map((year) => (
            <Card key={year.id} className="shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="truncate text-lg">
                      {year.year_name}
                    </CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" />
                      {formatDate(year.created_at)}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal />
                        <span className="sr-only">Open year actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => setEditingYear(year)}>
                        <Edit />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        disabled={deletingId === year.id}
                        onSelect={() => deleteYear(year)}
                      >
                        {deletingId === year.id ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Trash2 />
                        )}
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border bg-background px-3 py-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <GraduationCap className="size-3.5" />
                    Batches
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {year.batchCount}
                  </div>
                </div>
                <div className="rounded-lg border bg-background px-3 py-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="size-3.5" />
                    Students
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {year.studentCount}
                  </div>
                </div>
                <div className="col-span-2">
                  <Badge variant={year.batchCount ? "secondary" : "outline"}>
                    {year.batchCount ? "In use" : "Ready for batches"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed bg-background px-4 text-center">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <GraduationCap className="size-5" />
          </div>
          <h2 className="mt-4 text-base font-medium">No years yet</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Create an academic year, then add batches inside it.
          </p>
        </div>
      )}

      <Dialog open={Boolean(editingYear)} onOpenChange={() => setEditingYear(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit year</DialogTitle>
            <DialogDescription>
              Rename the academic year. Existing batches stay linked.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={editForm.handleSubmit(updateYear)}
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="editYearName">Year name</Label>
              <Input
                id="editYearName"
                aria-invalid={Boolean(editForm.formState.errors.yearName)}
                {...editForm.register("yearName")}
              />
              {editForm.formState.errors.yearName ? (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.yearName.message}
                </p>
              ) : null}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingYear(null)}
                disabled={editForm.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editForm.formState.isSubmitting}>
                {editForm.formState.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : null}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
