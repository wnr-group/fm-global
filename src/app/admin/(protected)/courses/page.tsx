import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Course } from "@/types/course";
import CoursesClient from "@/components/admin/CoursesClient";

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("courses")
    .select("id, name, code, description, created_at, updated_at", {
      count: "exact",
    });

  if (search) {
    query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%`);
  }

  query = query.order("name", { ascending: true }).range(from, to);

  const { data, count, error } = await query;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
          Loading courses…
        </div>
      }
    >
      <CoursesClient
        courses={(data ?? []) as Course[]}
        totalCount={count ?? 0}
        currentPage={page}
        pageSize={PAGE_SIZE}
        fetchError={error?.message ?? null}
      />
    </Suspense>
  );
}
