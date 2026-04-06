import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Student, EnrollmentWithCourse } from "@/types/student";
import StudentDetailClient from "@/components/admin/students/StudentDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({ params }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;

  const [{ data: student, error: studentError }, { data: enrollments }] =
    await Promise.all([
      supabase.from("students").select("*").eq("id", id).single(),
      supabase
        .from("enrollments")
        .select("id, student_id, course_id, enrolled_at, created_at, courses(id, name, code)")
        .eq("student_id", id)
        .order("enrolled_at", { ascending: false }),
    ]);

  if (studentError || !student) {
    notFound();
  }

  return (
    <StudentDetailClient
      student={student as Student}
      enrollments={(enrollments ?? []) as unknown as EnrollmentWithCourse[]}
    />
  );
}
