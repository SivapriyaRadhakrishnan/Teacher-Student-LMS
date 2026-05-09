"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
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
import type { Database } from "@/lib/supabase/types";

type YearRow = Database["public"]["Tables"]["years"]["Row"];

export type BatchYearOption = Pick<YearRow, "id" | "year_name">;

type CreateBatchModalProps = {
  teacherId: string;
  years: BatchYearOption[];
};

const NEW_YEAR_VALUE = "__new_year__";

const batchSchema = z
  .object({
    batchName: z.string().trim().min(2, "Batch name is required."),
    yearId: z.string().trim().min(1, "Select a year."),
    newYearName: z.string().trim().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.yearId === NEW_YEAR_VALUE && !values.newYearName) {
      ctx.addIssue({
        code: "custom",
        path: ["newYearName"],
        message: "Year name is required.",
      });
    }
  });

type BatchFormValues = z.infer<typeof batchSchema>;

export default function CreateBatchModal({
  teacherId,
  years,
}: CreateBatchModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  const defaultYearId = useMemo(
    () => years[0]?.id ?? NEW_YEAR_VALUE,
    [years]
  );

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
      batchName: "",
      yearId: defaultYearId,
      newYearName: "",
    },
  });

  const selectedYearId = useWatch({
    control,
    name: "yearId",
  });
  const isCreatingYear = selectedYearId === NEW_YEAR_VALUE;

  function closeAndReset() {
    reset({
      batchName: "",
      yearId: defaultYearId,
      newYearName: "",
    });
    setOpen(false);
  }

  async function onSubmit(values: BatchFormValues) {
    let yearId = values.yearId;

    if (values.yearId === NEW_YEAR_VALUE) {
      const { data: createdYear, error: yearError } = await supabase
        .from("years")
        .insert({
          year_name: values.newYearName || "",
          teacher_id: teacherId,
        })
        .select("id")
        .single();

      if (yearError || !createdYear) {
        toast.error("Could not create year", {
          description: yearError?.message,
        });
        return;
      }

      yearId = createdYear.id;
    }

    const { error: batchError } = await supabase.from("batches").insert({
      batch_name: values.batchName,
      year_id: yearId,
      teacher_id: teacherId,
    });

    if (batchError) {
      toast.error("Could not create batch", {
        description: batchError.message,
      });
      return;
    }

    toast.success("Batch created");
    closeAndReset();
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus data-icon="inline-start" />
          New batch
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create batch</DialogTitle>
          <DialogDescription>
            Add a batch and place it under an academic year.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="batchName">Batch name</Label>
            <Input
              id="batchName"
              placeholder="Batch A"
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
                <SelectItem value={NEW_YEAR_VALUE}>Create new year</SelectItem>
              </SelectContent>
            </Select>
            {errors.yearId ? (
              <p className="text-sm text-destructive">{errors.yearId.message}</p>
            ) : null}
          </div>

          {isCreatingYear ? (
            <div className="space-y-2">
              <Label htmlFor="newYearName">New year name</Label>
              <Input
                id="newYearName"
                placeholder="2026-2027"
                aria-invalid={Boolean(errors.newYearName)}
                {...register("newYearName")}
              />
              {errors.newYearName ? (
                <p className="text-sm text-destructive">
                  {errors.newYearName.message}
                </p>
              ) : null}
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeAndReset}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              Create batch
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
