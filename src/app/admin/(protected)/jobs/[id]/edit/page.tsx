import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { JobListing } from "@/types/jobs";
import JobFormClient from "@/components/admin/jobs/JobFormClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: PageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;

  const { data, error } = await supabase
    .from("job_listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  return <JobFormClient mode="edit" initialJob={data as JobListing} />;
}
