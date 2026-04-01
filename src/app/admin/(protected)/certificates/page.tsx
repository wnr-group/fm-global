// certificates/page.tsx
// Server Component — reads URL search params, fetches paginated + filtered certificates
// from Supabase server-side, then passes data down to CertificatesClient.

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Certificate } from "@/types/database";
import CertificatesClient from "@/components/admin/CertificatesClient";

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: string;
  }>;
}

export default async function CertificatesPage({ searchParams }: PageProps) {
  const supabase = await createClient();

  // Auth guard (belt-and-suspenders alongside middleware)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // ── Resolve search params ──────────────────────────────────────────
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const statusFilter =
    params.status === "active" || params.status === "revoked"
      ? params.status
      : "";
  const dateFrom = params.dateFrom ?? "";
  const dateTo = params.dateTo ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // ── Build Supabase query ───────────────────────────────────────────
  let query = supabase
    .from("certificates")
    .select(
      "id, certificate_id, student_name, student_email, course_name, course_description, instructor_name, duration, lectures_count, issue_date, status, reference_number, created_at, updated_at",
      { count: "exact" }
    );

  if (search) {
    query = query.or(
      `certificate_id.ilike.%${search}%,student_name.ilike.%${search}%,course_name.ilike.%${search}%`
    );
  }

  if (statusFilter) {
    query = query.eq("status", statusFilter as "active" | "revoked");
  }

  if (dateFrom) {
    query = query.gte("issue_date", dateFrom);
  }

  if (dateTo) {
    query = query.lte("issue_date", dateTo);
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, count, error } = await query;

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
        Loading certificates…
      </div>
    }>
      <CertificatesClient
        certificates={(data ?? []) as Certificate[]}
        totalCount={count ?? 0}
        currentPage={page}
        pageSize={PAGE_SIZE}
        fetchError={error?.message ?? null}
      />
    </Suspense>
  );
}
