"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
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

export type StudentBatchOption = {
  id: string;
  batch_name: string;
  year_name: string | null;
};

type CreateStudentModalProps = {
  batches: StudentBatchOption[];
};

const studentSchema = z.object({
  name: z.string().trim().min(2, "Student name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().optional(),
  password: z.string().min(6, "Password must be at least 6 characters."),
  batchId: z.string().uuid("Select a batch."),
});

type StudentFormValues = z.infer<typeof studentSchema>;

export default function CreateStudentModal({ batches }: CreateStudentModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      batchId: batches[0]?.id ?? "",
    },
  });

  function closeAndReset() {
    reset({
      name: "",
      email: "",
      phone: "",
      password: "",
      batchId: batches[0]?.id ?? "",
    });
    setOpen(false);
  }

  async function onSubmit(values: StudentFormValues) {
    const response = await fetch("/api/teacher/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const result = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      toast.error("Could not create student", {
        description: result?.error || "Please try again.",
      });
      return;
    }

    toast.success("Student created");
    closeAndReset();
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!batches.length}>
          <UserPlus data-icon="inline-start" />
          New student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create student</DialogTitle>
          <DialogDescription>
            Create a login account and assign the student to a batch.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Student name"
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email ? (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="Optional"
                aria-invalid={Boolean(errors.phone)}
                {...register("phone")}
              />
              {errors.phone ? (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Batch</Label>
            <Select
              defaultValue={batches[0]?.id}
              onValueChange={(value) =>
                setValue("batchId", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="w-full" aria-invalid={Boolean(errors.batchId)}>
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.batch_name}
                    {batch.year_name ? ` - ${batch.year_name}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.batchId ? (
              <p className="text-sm text-destructive">{errors.batchId.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Temporary password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pr-10"
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
            {errors.password ? (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeAndReset}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !batches.length}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              Create student
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
