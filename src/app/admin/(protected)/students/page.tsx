import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { StudentWithEnrollmentCount } from "@/types/student";
import StudentsClient from "@/components/admin/StudentsClient";

const VALID_PER_PAGE = [10, 25, 50] as const;
const DEFAULT_PER_PAGE = 10;

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string; sort?: string; perPage?: string }>;
}

export default async function StudentsPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const sort = params.sort === "created" ? "created" : "name";
  const perPageRaw = parseInt(params.perPage ?? String(DEFAULT_PER_PAGE), 10);
  const perPage = (VALID_PER_PAGE as readonly number[]).includes(perPageRaw)
    ? perPageRaw
    : DEFAULT_PER_PAGE;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  // Query 1: paginated students with optional search
  let studentsQuery = supabase
    .from("students")
    .select("id, name, email, phone, address, created_at, updated_at", {
      count: "exact",
    });

  if (search) {
    studentsQuery = studentsQuery.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
    );
  }

  studentsQuery = studentsQuery
    .order(sort === "created" ? "created_at" : "name", {
      ascending: sort !== "created",
    })
    .range(from, to);

  const { data: studentsData, count, error } = await studentsQuery;

  // Query 2: enrollment counts for the current page of students
  const studentIds = (studentsData ?? []).map((s) => s.id);
  const { data: enrollmentRows } =
    studentIds.length > 0
      ? await supabase
          .from("enrollments")
          .select("student_id")
          .in("student_id", studentIds)
      : { data: [] };

  const countMap: Record<string, number> = {};
  (enrollmentRows ?? []).forEach((e) => {
    countMap[e.student_id] = (countMap[e.student_id] ?? 0) + 1;
  });

  const students: StudentWithEnrollmentCount[] = (studentsData ?? []).map(
    (s) => ({ ...s, phone: s.phone ?? '', enrollment_count: countMap[s.id] ?? 0 })
  );

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
          Loading students…
        </div>
      }
    >
      <StudentsClient
        students={students}
        totalCount={count ?? 0}
        currentPage={page}
        pageSize={perPage}
        fetchError={error?.message ?? null}
      />
    </Suspense>
  );
}
