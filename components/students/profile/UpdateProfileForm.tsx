"use client";

import { useState } from "react";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

type Props = {
  userId: string;

  initialName: string;

  initialPhone: string;
};

export default function UpdateProfileForm({
  userId,
  initialName,
  initialPhone,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [name, setName] =
    useState(initialName);

  const [phone, setPhone] =
    useState(initialPhone);

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  async function handleUpdate() {
    try {
      setLoading(true);

      const supabase =
        createClient();

      // UPDATE PROFILE
      const {
        error: profileError,
      } = await supabase
        .from("profiles")
        .update({
          name,
          phone,
        })
        .eq("id", userId);

      if (profileError) {
        toast.error(
          profileError.message
        );

        setLoading(false);

        return;
      }

      // PASSWORD VALIDATION
      if (
        currentPassword ||
        newPassword ||
        confirmPassword
      ) {
        if (
          !currentPassword ||
          !newPassword ||
          !confirmPassword
        ) {
          toast.error(
            "Please fill all password fields"
          );

          setLoading(false);

          return;
        }

        if (
          newPassword !==
          confirmPassword
        ) {
          toast.error(
            "Passwords do not match"
          );

          setLoading(false);

          return;
        }

        if (
          newPassword.length < 6
        ) {
          toast.error(
            "Password must be at least 6 characters"
          );

          setLoading(false);

          return;
        }

        // UPDATE PASSWORD
        const {
          error: passwordError,
        } =
          await supabase.auth.updateUser(
            {
              password:
                newPassword,
            }
          );

        if (passwordError) {
          toast.error(
            passwordError.message
          );

          setLoading(false);

          return;
        }
      }

      toast.success(
        "Profile updated successfully"
      );

      // CLEAR PASSWORDS
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">
          Update Profile
        </h2>

        <p className="mt-1 text-muted-foreground">
          Edit your profile details
          and password.
        </p>
      </div>

      {/* FORM */}
      <div className="mt-8 space-y-6">
        {/* NAME */}
        <div>
          <label className="text-sm font-medium">
            Full Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-black"
            placeholder="Enter full name"
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="text-sm font-medium">
            Phone Number
          </label>

          <input
            type="text"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-black"
            placeholder="Enter phone number"
          />
        </div>

        {/* CURRENT PASSWORD */}
        <div>
          <label className="text-sm font-medium">
            Current Password
          </label>

          <div className="relative mt-2">
            <input
              type={
                showCurrentPassword
                  ? "text"
                  : "password"
              }
              value={
                currentPassword
              }
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border px-4 py-3 pr-12 outline-none transition focus:ring-2 focus:ring-black"
              placeholder="Enter current password"
            />

            <button
              type="button"
              onClick={() =>
                setShowCurrentPassword(
                  !showCurrentPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showCurrentPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* NEW PASSWORD */}
        <div>
          <label className="text-sm font-medium">
            New Password
          </label>

          <div className="relative mt-2">
            <input
              type={
                showNewPassword
                  ? "text"
                  : "password"
              }
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border px-4 py-3 pr-12 outline-none transition focus:ring-2 focus:ring-black"
              placeholder="Enter new password"
            />

            <button
              type="button"
              onClick={() =>
                setShowNewPassword(
                  !showNewPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="text-sm font-medium">
            Confirm Password
          </label>

          <div className="relative mt-2">
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={
                confirmPassword
              }
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border px-4 py-3 pr-12 outline-none transition focus:ring-2 focus:ring-black"
              placeholder="Confirm new password"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-black/90 disabled:opacity-50"
        >
          {loading
            ? "Updating..."
            : "Save Changes"}
        </button>
      </div>
    </div>
  );
}