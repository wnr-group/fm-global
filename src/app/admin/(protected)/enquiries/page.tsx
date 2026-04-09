import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EnquiriesClient from "@/components/admin/EnquiriesClient";

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: Promise<{
    search?: string;
    type?: string;
    from?: string;
    to?: string;
    unread?: string;
    page?: string;
  }>;
}

export default async function EnquiriesPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const type = params.type === "contact" || params.type === "partner" ? params.type : null;
  const from = params.from ?? "";
  const to = params.to ?? "";
  const unreadOnly = params.unread === "true";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const offset = (page - 1) * PAGE_SIZE;

  // Build filtered query
  let query = supabase
    .from("enquiries")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
  }
  if (type) {
    query = query.eq("type", type);
  }
  if (from) {
    query = query.gte("created_at", `${from}T00:00:00.000Z`);
  }
  if (to) {
    query = query.lte("created_at", `${to}T23:59:59.999Z`);
  }
  if (unreadOnly) {
    query = query.eq("read", false);
  }

  const { data, count, error } = await query;

  // Stat counts (unfiltered for the stats bar)
  const [unreadResult, contactResult, partnerResult] = await Promise.all([
    supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("read", false),
    supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("type", "contact"),
    supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("type", "partner"),
  ]);

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
        Loading enquiries…
      </div>
    }>
      <EnquiriesClient
        enquiries={data ?? []}
        totalCount={count ?? 0}
        unreadCount={unreadResult.count ?? 0}
        contactCount={contactResult.count ?? 0}
        partnerCount={partnerResult.count ?? 0}
        currentPage={page}
        pageSize={PAGE_SIZE}
        fetchError={error?.message ?? null}
      />
    </Suspense>
  );
}
