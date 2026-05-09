"use client";

import { useState } from "react";

import {
  Loader2,
  Plus,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { createTeacher } from "@/actions/admin/createTeacher";

type FormData = {
  name: string;

  email: string;

  phone: string;
};

export default function CreateTeacherDialog() {
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>();

  const [loading, setLoading] =
    useState(false);

  async function onSubmit(
    values: FormData
  ) {
    try {
      setLoading(true);

      const response =
        await createTeacher({
          name: values.name,

          email:
            values.email,

          phone:
            values.phone,
        });

      if (!response.success) {
        toast.error(
          response.message
        );

        return;
      }

      toast.success(
        response.message ||
          "Teacher created successfully"
      );

      reset();

      setOpen(false);

      router.refresh();
    } catch {
      toast.error(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-2xl">
          <Plus className="h-4 w-4" />

          Add Teacher
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle>
            Create Teacher
          </DialogTitle>

          <DialogDescription>
            Add a new teacher to the LMS
            platform.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-5"
        >
          {/* NAME */}
          <div className="space-y-2">
            <Label>
              Teacher Name
            </Label>

            <Input
              placeholder="Enter teacher name"
              {...register("name", {
                required: true,
              })}
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              type="email"
              placeholder="Enter email"
              {...register("email", {
                required: true,
              })}
            />
          </div>

          {/* PHONE */}
          <div className="space-y-2">
            <Label>
              Phone Number
            </Label>

            <Input
              placeholder="Enter phone number"
              {...register("phone", {
                required: true,
              })}
            />
          </div>

          {/* BUTTON */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                Creating...
              </>
            ) : (
              "Create Teacher"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}