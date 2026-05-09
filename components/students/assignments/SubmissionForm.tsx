"use client";

import { useState } from "react";

import { Upload } from "lucide-react";

import { toast } from "sonner";

import { submitAssignment } from "@/actions/students/submitAssignment";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { createClient } from "@/lib/supabase/client";

type SubmissionFormProps = {
  assignmentId: string;
  studentId: string;

  allowedSubmissionTypes?: string[];
};

export default function SubmissionForm({
  assignmentId,
  studentId,
  allowedSubmissionTypes = [],
}: SubmissionFormProps) {
  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      submission_link: "",
      submission_file: "",
      submission_type: "",
      notes: "",
    });

  // FILE ACCEPT TYPES
  const acceptTypes =
    allowedSubmissionTypes.length >
    0
      ? allowedSubmissionTypes
          .map(
            (type) => `.${type}`
          )
          .join(",")
      : ".pdf,.zip,.jpg,.jpeg,.png,.docx,.pptx";

  async function handleSubmit() {
    if (
      !formData.submission_file &&
      !formData.submission_link
    ) {
      toast.error(
        "Please upload a file or add a submission link"
      );

      return;
    }
if (
  !formData.submission_file &&
  !formData.submission_link
) {
  toast.error(
    "Please upload a file or add a submission link"
  );

  return;
}
    if (
  formData.submission_link &&
  !/^https?:\/\/.+/i.test(
    formData.submission_link
  )
) {
  toast.error(
    "Please enter a valid URL"
  );

  return;
}
    setLoading(true);

    const result =
      await submitAssignment({
        assignment_id:
          assignmentId,

        student_id:
          studentId,

        submission_link:
          formData.submission_link,

        submission_file:
          formData.submission_file,

        submission_type:
          formData.submission_type,

        notes: formData.notes,
      });

    if (!result.success) {
      toast.error(
        result.message
      );

      setLoading(false);

      return;
    }

    toast.success(
      "Assignment submitted successfully"
    );

    setLoading(false);

  }

  return (
    <div className="space-y-6">
      {/* FILE UPLOAD */}
      <div className="space-y-2">
        <Label>
          Upload File
        </Label>

        <Input
          type="file"
          accept={acceptTypes}
          onChange={async (e) => {
            const file =
              e.target.files?.[0];

            if (!file) return;

            const fileType =
              file.name
                .split(".")
                .pop()
                ?.toLowerCase() ||
              "";

            try {
              setLoading(true);

              const supabase =
                createClient();

              const filePath = `submissions/${studentId}/${Date.now()}-${
                file.name
              }`;

              const { error } =
                await supabase.storage
                  .from(
                    "assignment-submissions"
                  )
                  .upload(
                    filePath,
                    file
                  );

              if (error) {
                toast.error(
                  error.message
                );

                setLoading(false);

                return;
              }

              const { data } =
                supabase.storage
                  .from(
                    "assignment-submissions"
                  )
                  .getPublicUrl(
                    filePath
                  );

              setFormData({
                ...formData,

                submission_file:
                  data.publicUrl,

                submission_type:
                  fileType,
              });

              toast.success(
                "File uploaded successfully"
              );
            } catch {
              toast.error(
                "Upload failed"
              );
            } finally {
              setLoading(false);
            }
          }}
        />

        {allowedSubmissionTypes.length >
          0 && (
          <p className="text-xs text-muted-foreground">
            Allowed formats:{" "}
            {allowedSubmissionTypes
              .map((type) =>
                type.toUpperCase()
              )
              .join(", ")}
          </p>
        )}
      </div>

      {/* SUBMISSION LINK */}
      <div className="space-y-2">
        <Label>
          Submission Link
        </Label>

        <Input
          placeholder="Paste Figma / Drive / YouTube link"
          value={
            formData.submission_link
          }
          onChange={(e) =>
            setFormData({
              ...formData,

              submission_link:
                e.target.value,
            })
          }
        />
      </div>

      {/* NOTES */}
      <div className="space-y-2">
        <Label>
          Notes
        </Label>

        <Textarea
          placeholder="Add submission notes..."
          rows={5}
          value={formData.notes}
          onChange={(e) =>
            setFormData({
              ...formData,

              notes:
                e.target.value,
            })
          }
        />
      </div>

      {/* SUBMIT BUTTON */}
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full gap-2"
      >
        <Upload className="h-4 w-4" />

        {loading
          ? "Submitting..."
          : "Submit Assignment"}
      </Button>
    </div>
  );
}