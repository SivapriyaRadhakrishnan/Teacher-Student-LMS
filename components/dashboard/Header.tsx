"use client";

import {
  Bell,
  LogOut,
  Menu,
  Search,
  UserCircle2,
} from "lucide-react";

import { motion } from "framer-motion";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { DashboardNav } from "@/components/dashboard/Sidebar";

import { createClient } from "@/lib/supabase/client";

import type { UserRole } from "@/lib/supabase/types";

type HeaderProfile = {
  name: string | null;

  email: string | null;

  role: UserRole;
};

type HeaderProps = {
  profile: HeaderProfile;
};

function getInitials(
  name: string | null,
  email: string | null
) {
  const source =
    name || email || "User";

  const parts =
    source.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function Header({
  profile,
}: HeaderProps) {
  const router =
    useRouter();

  const supabase =
    createClient();

  const displayName =
    profile.name ||
    profile.email ||
    "User";

  async function handleSignOut() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      toast.error(
        "Could not sign out",
        {
          description:
            error.message,
        }
      );

      return;
    }

    toast.success(
      "Signed out successfully"
    );

    router.replace("/");

    router.refresh();
  }

  return (
    <motion.header
      initial={{
        opacity: 0,
        y: -10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="sticky top-0 z-40 border-b border-border/40 bg-white/80 backdrop-blur-xl"
    >
      <div className="flex h-20 items-center gap-4 px-6">
        {/* MOBILE MENU */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-2xl lg:hidden"
            >
              <Menu className="h-5 w-5" />

              <span className="sr-only">
                Open navigation
              </span>
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-80 border-r bg-white/95 backdrop-blur-xl"
          >
            <SheetHeader>
              <SheetTitle className="text-left text-xl font-bold">
                LMS Portal
              </SheetTitle>
            </SheetHeader>

            <div className="mt-8">
              <DashboardNav
                role={
                  profile.role
                }
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* LEFT */}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold tracking-tight">
            Welcome back,
            {" "}
            {displayName}
          </h1>

          <p className="truncate text-sm capitalize text-muted-foreground">
            {profile.role}
            {" "}
            dashboard workspace
          </p>
        </div>

        {/* PROFILE */}
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
          >
            <Button
              variant="ghost"
              className="h-14 gap-3 rounded-2xl border bg-white px-3 shadow-sm transition-all hover:scale-[1.02] hover:bg-muted/40"
            >
              <Avatar className="h-10 w-10 border">
                <AvatarFallback className="bg-black text-sm font-semibold text-white">
                  {getInitials(
                    profile.name,
                    profile.email
                  )}
                </AvatarFallback>
              </Avatar>

              <div className="hidden text-left lg:block">
                <p className="max-w-32 truncate text-sm font-semibold">
                  {displayName}
                </p>

                <p className="text-xs capitalize text-muted-foreground">
                  {profile.role}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 rounded-2xl border bg-white/95 p-2 shadow-2xl backdrop-blur-xl"
          >
            <DropdownMenuLabel>
              <div className="space-y-1">
                <p className="truncate text-sm font-semibold">
                  {displayName}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {
                    profile.email
                  }
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer rounded-xl">
              <UserCircle2 className="mr-2 h-4 w-4" />

              <span className="capitalize">
                {profile.role}
                {" "}
                Account
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={
                handleSignOut
              }
              className="cursor-pointer rounded-xl text-red-500 focus:bg-red-50 focus:text-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />

              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}