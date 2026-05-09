"use client";

import type { LucideIcon } from "lucide-react";

import {
  BookOpen,
  BarChart3,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Users,
  Sparkles,
} from "lucide-react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

import type { UserRole } from "@/lib/supabase/types";

type NavItem = {
  title: string;

  href: string;

  icon: LucideIcon;
};

type SidebarProps = {
  role: UserRole;

  className?: string;
};

const roleLabels: Record<
  UserRole,
  string
> = {
  admin: "Admin",

  teacher: "Teacher",

  student: "Student",
};

const navigation: Record<
  UserRole,
  NavItem[]
> = {
  admin: [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },

    {
      title: "Teachers",
      href: "/admin/teachers",
      icon: Users,
    },

    {
      title: "Students",
      href: "/admin/students",
      icon: GraduationCap,
    },

    {
      title: "Years & Batches",
      href: "/admin/batches",
      icon: BookOpen,
    },

    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },

    {
      title: "Settings",
      href: "/admin/settings",
      icon: FileText,
    },
  ],

  teacher: [
    {
      title: "Dashboard",
      href: "/teacher",
      icon: LayoutDashboard,
    },

    {
      title: "Years",
      href: "/teacher/years",
      icon: GraduationCap,
    },

    {
      title: "Batches",
      href: "/teacher/batches",
      icon: GraduationCap,
    },

    {
      title: "Students",
      href: "/teacher/students",
      icon: Users,
    },

    {
      title: "Assignments",
      href: "/teacher/assignments",
      icon: BookOpen,
    },

    {
      title: "Submissions",
      href: "/teacher/submissions",
      icon: ClipboardCheck,
    },

    {
      title: "Analytics",
      href: "/teacher/analytics",
      icon: BarChart3,
    },
  ],

  student: [
    {
      title: "Dashboard",
      href: "/student",
      icon: LayoutDashboard,
    },

    {
      title: "Assignments",
      href: "/student/assignments",
      icon: BookOpen,
    },

    {
      title: "Submissions",
      href: "/student/submissions",
      icon: ClipboardCheck,
    },

    {
      title: "Feedback",
      href: "/student/feedback",
      icon: FileText,
    },

    {
      title: "Profile",
      href: "/student/profile",
      icon: Users,
    },
  ],
};

export function DashboardNav({
  role,
  className,
}: SidebarProps) {
  const pathname =
    usePathname();

  const items =
    navigation[role];

  return (
    <nav
      className={cn(
        "space-y-2",
        className
      )}
      aria-label="Dashboard navigation"
    >
      {items.map((item, index) => {
        const Icon =
          item.icon;

        const isActive =
          pathname ===
            item.href ||
          (item.href !==
            `/${role}` &&
            pathname.startsWith(
              `${item.href}/`
            ));

        return (
          <motion.div
            key={item.href}
            initial={{
              opacity: 0,
              x: -10,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay:
                index * 0.05,
            }}
          >
            <Link
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300",

                isActive
                  ? "bg-black text-white shadow-lg"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              {/* ACTIVE GLOW */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-2xl bg-black"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}

              {/* ICON */}
              <div
                className={cn(
                  "relative z-10 flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300",

                  isActive
                    ? "bg-white/10"
                    : "bg-muted group-hover:bg-white"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>

              {/* TEXT */}
              <span className="relative z-10">
                {item.title}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}

export default function Sidebar({
  role,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "hidden min-h-screen w-72 shrink-0 border-r border-border/40 bg-white/80 backdrop-blur-xl lg:block",
        className
      )}
    >
      <div className="flex h-full flex-col px-5 py-6">
        {/* TOP LOGO */}
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-10"
        >
          <Link
            href={`/${role}`}
            className="flex items-center gap-4"
          >
            {/* LOGO */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white shadow-xl">
              <Sparkles className="h-6 w-6" />
            </div>

            {/* TITLE */}
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold tracking-tight">
                LMS Portal
              </h1>

              <p className="truncate text-sm text-muted-foreground">
                Smart Learning Platform
              </p>
            </div>
          </Link>
        </motion.div>

        {/* ROLE BADGE */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.1,
          }}
          className="mb-8"
        >
          <Badge className="rounded-full border-0 bg-muted px-4 py-2 text-xs font-semibold text-foreground shadow-sm">
            {roleLabels[role]}
            {" "}
            Dashboard
          </Badge>
        </motion.div>

        {/* NAVIGATION */}
        <div className="flex-1">
          <DashboardNav role={role} />
        </div>

      
      </div>
    </aside>
  );
}