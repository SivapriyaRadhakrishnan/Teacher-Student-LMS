"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Loader2,
  LogIn,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { getDashboardPath } from "@/lib/utils";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email(
      "Enter a valid email address."
    ),

  password: z
    .string()
    .min(
      6,
      "Password must be at least 6 characters."
    ),
});

type LoginFormValues =
  z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();

  const supabase =
    createClient();

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormValues>({
    resolver:
      zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(
    values: LoginFormValues
  ) {
    const {
      data,
      error,
    } =
      await supabase.auth.signInWithPassword(
        {
          email: values.email,

          password:
            values.password,
        }
      );

    if (error) {
      toast.error(
        "Login failed",
        {
          description:
            error.message,
        }
      );

      return;
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (
      profileError ||
      !profile?.role
    ) {
      await supabase.auth.signOut();

      toast.error(
        "Profile not found",
        {
          description:
            "Your account exists, but no LMS role is assigned yet.",
        }
      );

      return;
    }

    toast.success(
      "Welcome back"
    );

    router.replace(
      getDashboardPath(
        profile.role
      )
    );

    router.refresh();
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">
          Sign in
        </CardTitle>

        <CardDescription>
          Use your LMS account to
          continue to your dashboard.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(
            onSubmit
          )}
          noValidate
        >
          {/* EMAIL */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>

            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              aria-invalid={Boolean(
                errors.email
              )}
              {...register("email")}
            />

            {errors.email ? (
              <p className="text-sm text-destructive">
                {
                  errors.email
                    .message
                }
              </p>
            ) : null}
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password
            </Label>

            <div className="relative">
              <Input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="current-password"
                className="pr-12"
                aria-invalid={Boolean(
                  errors.password
                )}
                {...register(
                  "password"
                )}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-black"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {errors.password ? (
              <p className="text-sm text-destructive">
                {
                  errors.password
                    .message
                }
              </p>
            ) : null}
          </div>

          {/* BUTTON */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={
              isSubmitting
            }
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <LogIn data-icon="inline-start" />
            )}

            {isSubmitting
              ? "Signing in"
              : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}