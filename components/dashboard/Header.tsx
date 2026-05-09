"use client";

import { LogOut, Menu, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

function getInitials(name: string | null, email: string | null) {
  const source = name || email || "User";
  const parts = source.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function Header({ profile }: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();
  const displayName = profile.name || profile.email || "User";

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Could not sign out", {
        description: error.message,
      });
      return;
    }

    toast.success("Signed out");
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu />
            <span className="sr-only">Open navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72" showCloseButton>
          <SheetHeader>
            <SheetTitle>LMS Portal</SheetTitle>
          </SheetHeader>
          <div className="px-4">
            <DashboardNav role={profile.role} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{displayName}</p>
        <p className="truncate text-xs capitalize text-muted-foreground">
          {profile.role} dashboard
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 gap-2 px-2">
            <Avatar size="sm">
              <AvatarFallback>{getInitials(profile.name, profile.email)}</AvatarFallback>
            </Avatar>
            <span className="hidden max-w-32 truncate text-sm sm:inline">
              {displayName}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="truncate text-sm font-medium">{displayName}</div>
            <div className="truncate text-xs font-normal text-muted-foreground">
              {profile.email}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <UserCircle />
            <span className="capitalize">{profile.role}</span>
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
