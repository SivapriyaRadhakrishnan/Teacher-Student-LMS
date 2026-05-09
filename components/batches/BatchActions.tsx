"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import type { BatchYearOption } from "@/components/batches/CreateBatchModal";

type BatchActionsProps = {
  batch: {
    id: string;
    batch_name: string;
    year_id: string;
    studentCount: number;
    assignmentCount: number;
  };
  teacherId: string;
  years: BatchYearOption[];
};

const batchSchema = z.object({
  batchName: z.string().trim().min(2, "Batch name is required."),
  yearId: z.string().uuid("Select a year."),
});

type BatchFormValues = z.infer<typeof batchSchema>;

export default function BatchActions({
  batch,
  teacherId,
  years,
}: BatchActionsProps) {
  const router = useRouter();
  const supabase = createClient();
  const [editOpen, setEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      batchName: batch.batch_name,
      yearId: batch.year_id,
    },
  });

  useEffect(() => {
    reset({
      batchName: batch.batch_name,
      yearId: batch.year_id,
    });
  }, [batch.batch_name, batch.year_id, reset]);

  async function updateBatch(values: BatchFormValues) {
    const { error } = await supabase
      .from("batches")
      .update({
        batch_name: values.batchName,
        year_id: values.yearId,
      })
      .eq("id", batch.id)
      .eq("teacher_id", teacherId);

    if (error) {
      toast.error("Could not update batch", { description: error.message });
      return;
    }

    toast.success("Batch updated");
    setEditOpen(false);
    router.refresh();
  }

  async function deleteBatch() {
    if (batch.studentCount > 0 || batch.assignmentCount > 0) {
      toast.error("Batch has linked records", {
        description: "Move students and assignments before deleting this batch.",
      });
      return;
    }

    setIsDeleting(true);

    const { error } = await supabase
      .from("batches")
      .delete()
      .eq("id", batch.id)
      .eq("teacher_id", teacherId);

    setIsDeleting(false);

    if (error) {
      toast.error("Could not delete batch", { description: error.message });
      return;
    }

    toast.success("Batch deleted");
    router.refresh();
  }

  const selectedYearId = useWatch({
    control,
    name: "yearId",
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal />
            <span className="sr-only">Open batch actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Edit />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            disabled={isDeleting}
            onSelect={deleteBatch}
          >
            {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit batch</DialogTitle>
            <DialogDescription>
              Update the batch name or move it to another academic year.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit(updateBatch)} noValidate>
            <div className="space-y-2">
              <Label htmlFor={`batch-name-${batch.id}`}>Batch name</Label>
              <Input
                id={`batch-name-${batch.id}`}
                aria-invalid={Boolean(errors.batchName)}
                {...register("batchName")}
              />
              {errors.batchName ? (
                <p className="text-sm text-destructive">
                  {errors.batchName.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Academic year</Label>
              <Select
                value={selectedYearId}
                onValueChange={(value) =>
                  setValue("yearId", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full" aria-invalid={Boolean(errors.yearId)}>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.year_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.yearId ? (
                <p className="text-sm text-destructive">{errors.yearId.message}</p>
              ) : null}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !years.length}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
