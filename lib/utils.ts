import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { UserRole } from "@/lib/supabase/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDashboardPath(role?: UserRole | null) {
  const paths: Record<UserRole, string> = {
    admin: "/admin",
    teacher: "/teacher",
    student: "/student",
  };

  return role ? paths[role] : "/login";
}

export function getRoleFromPath(pathname: string): UserRole | null {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/teacher")) return "teacher";
  if (pathname.startsWith("/student")) return "student";
  return null;
}

export function isProtectedPath(pathname: string) {
  return ["/admin", "/teacher", "/student"].some((path) =>
    pathname.startsWith(path)
  );
}
