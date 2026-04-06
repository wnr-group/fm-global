import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { JobListing } from "@/types/jobs";
import JobsClient from "@/components/admin/JobsClient";

export default async function JobsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase
    .from("job_listings")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
          Loading jobs…
        </div>
      }
    >
      <JobsClient
        jobs={(data ?? []) as JobListing[]}
        fetchError={error?.message ?? null}
      />
    </Suspense>
  );
}
