"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { toast } from "sonner";

import { createAssignment } from "@/actions/teachers/createAssignment";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

type Year = {
  id: string;
  year_name: string;
};

type Batch = {
  id: string;
  batch_name: string;
  year_id: string;
};

type CreateAssignmentModalProps = {
  years: Year[];
  batches: Batch[];
};

export default function CreateAssignmentModal({
  years,
  batches,
}: CreateAssignmentModalProps) {
  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [selectedYear, setSelectedYear] =
    useState("");

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      instructions: "",
      deadline: "",
      max_marks: "",
      batch_id: "",

      allowed_submission_types:
        [] as string[],
    });

  // FILTER BATCHES
  const filteredBatches =
    batches.filter(
      (batch) =>
        batch.year_id ===
        selectedYear
    );

  // CREATE ASSIGNMENT
  async function handleCreateAssignment() {
    if (
      !selectedYear ||
      !formData.batch_id ||
      !formData.title
    ) {
      toast.error(
        "Please fill required fields"
      );

      return;
    }

    setLoading(true);

    const result =
      await createAssignment(
        formData
      );

    if (!result.success) {
      toast.error(
        result.message
      );

      setLoading(false);

      return;
    }

    toast.success(
      "Assignment created successfully"
    );

    // RESET
    setFormData({
      title: "",
      description: "",
      instructions: "",
      deadline: "",
      max_marks: "",
      batch_id: "",

      allowed_submission_types:
        [],
    });

    setSelectedYear("");

    setOpen(false);

    setLoading(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" />

          Create Assignment
        </Button>
      </DialogTrigger>

     <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Create Assignment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* YEAR */}
          <div className="space-y-2">
            <Label>
              Academic Year
            </Label>

            <select
              className="w-full rounded-xl border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(
                  e.target.value
                );

                setFormData({
                  ...formData,
                  batch_id: "",
                });
              }}
            >
              <option value="">
                Select Year
              </option>

              {years.map((year) => (
                <option
                  key={year.id}
                  value={year.id}
                >
                  {year.year_name}
                </option>
              ))}
            </select>
          </div>

          {/* BATCH */}
          <div className="space-y-2">
            <Label>
              Batch
            </Label>

            <select
              className="w-full rounded-xl border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
              value={formData.batch_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  batch_id:
                    e.target.value,
                })
              }
              disabled={!selectedYear}
            >
              <option value="">
                {selectedYear
                  ? "Select Batch"
                  : "Select year first"}
              </option>

              {filteredBatches.map(
                (batch) => (
                  <option
                    key={batch.id}
                    value={batch.id}
                  >
                    {
                      batch.batch_name
                    }
                  </option>
                )
              )}
            </select>
          </div>

          {/* TITLE */}
          <div className="space-y-2">
            <Label>
              Assignment Title
            </Label>

            <Input
              placeholder="Dashboard Design Challenge"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title:
                    e.target.value,
                })
              }
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label>
              Description
            </Label>

            <Textarea
              placeholder="Enter assignment description"
              value={
                formData.description
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description:
                    e.target.value,
                })
              }
            />
          </div>

          {/* INSTRUCTIONS */}
          <div className="space-y-2">
            <Label>
              Instructions
            </Label>

            <Textarea
              rows={5}
              placeholder="Responsive layout, dark mode support, charts..."
              value={
                formData.instructions
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  instructions:
                    e.target.value,
                })
              }
            />
          </div>

          {/* DEADLINE */}
          <div className="space-y-2">
            <Label>
              Deadline
            </Label>

            <Input
              type="date"
              value={
                formData.deadline
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deadline:
                    e.target.value,
                })
              }
            />
          </div>

          {/* MAX MARKS */}
          <div className="space-y-2">
            <Label>
              Maximum Marks
            </Label>

            <Input
              type="number"
              placeholder="100"
              value={
                formData.max_marks
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  max_marks:
                    e.target.value,
                })
              }
            />
          </div>

          {/* ALLOWED FILE TYPES */}
          <div className="space-y-3">
            <Label>
              Allowed Submission Types
            </Label>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {[
                "pdf",
                "zip",
                "docx",
                "pptx",
                "jpg",
                "png",
              ].map((type) => {
                const selected =
                  formData.allowed_submission_types.includes(
                    type
                  );

                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => {
                      if (
                        selected
                      ) {
                        setFormData({
                          ...formData,

                          allowed_submission_types:
                            formData.allowed_submission_types.filter(
                              (
                                item
                              ) =>
                                item !==
                                type
                            ),
                        });
                      } else {
                        setFormData({
                          ...formData,

                          allowed_submission_types:
                            [
                              ...formData.allowed_submission_types,
                              type,
                            ],
                        });
                      }
                    }}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      selected
                        ? "border-black bg-black text-white"
                        : "bg-white hover:bg-muted"
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <Button
            className="w-full rounded-xl"
            onClick={
              handleCreateAssignment
            }
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Assignment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}