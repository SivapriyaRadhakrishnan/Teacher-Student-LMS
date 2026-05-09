import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";

import BatchStats from "@/components/admin/batches/BatchStats";

import BatchTable from "@/components/admin/batches/BatchTable";

import SearchInput from "@/components/shared/SearchInput";

import { createClient } from "@/lib/supabase/server";

type BatchesPageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function BatchesPage({
  searchParams,
}: BatchesPageProps) {
  const params = await searchParams;

  const search =
    params.search?.trim() || "";

  const supabase = await createClient();

  // BATCHES
  const { data: batches } =
    await supabase
      .from("batches")
      .select("*")
      .ilike("name", `%${search}%`)
      .order("created_at", {
        ascending: false,
      });

  // STUDENT COUNT
  const { count: studentsCount } =
    await supabase
      .from("profiles")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("role", "student");

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Years & Batches"
        description="Monitor all batches and student distribution."
      />

      <div className="flex items-center justify-between">
        <SearchInput placeholder="Search batches..." />
      </div>

      <BatchStats
        totalBatches={
          batches?.length || 0
        }
        totalStudents={
          studentsCount || 0
        }
      />

      <BatchTable
        batches={batches || []}
      />
    </div>
  );
}