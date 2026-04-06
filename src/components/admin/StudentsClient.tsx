"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { StudentWithEnrollmentCount } from "@/types/student";
import StudentModal from "@/components/admin/students/StudentModal";
import DeleteStudentDialog from "@/components/admin/students/DeleteStudentDialog";

interface StudentsClientProps {
  students: StudentWithEnrollmentCount[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  fetchError: string | null;
}

interface ToastState {
  type: "success" | "error";
  message: string;
}

export default function StudentsClient({
  students,
  totalCount,
  currentPage,
  pageSize,
  fetchError,
}: StudentsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  const urlSort = searchParams.get("sort") ?? "name";
  const urlPerPage = searchParams.get("perPage") ?? "10";

  const [inputValue, setInputValue] = useState(urlSearch);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editStudent, setEditStudent] =
    useState<StudentWithEnrollmentCount | null>(null);
  const [deleteStudent, setDeleteStudent] =
    useState<StudentWithEnrollmentCount | null>(null);

  useEffect(() => {
    setInputValue(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // 300ms debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      updateParams({ search: inputValue || null, page: null });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const totalPages = Math.ceil(totalCount / pageSize);
  const rangeStart = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalCount);
  const hasFilters = Boolean(urlSearch) || urlSort !== "name" || urlPerPage !== "10";

  function updateParams(updates: Record<string, string | null>) {
    const p = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === "") p.delete(k);
      else p.set(k, v);
    });
    router.push(`/admin/students?${p.toString()}`);
  }

  function handleSuccess(message: string) {
    setToast({ type: "success", message });
    router.refresh();
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div
          role="alert"
          className={[
            "fixed top-4 right-4 z-50 flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg",
            "text-sm font-medium text-white max-w-sm w-full",
            toast.type === "success" ? "bg-green-600" : "bg-red-600",
          ].join(" ")}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          )}
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            aria-label="Dismiss"
            className="shrink-0 hover:opacity-80 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      <StudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => handleSuccess("Student added successfully!")}
      />
      {editStudent && (
        <StudentModal
          student={editStudent}
          isOpen={Boolean(editStudent)}
          onClose={() => setEditStudent(null)}
          onSuccess={() => handleSuccess("Student updated successfully!")}
        />
      )}
      {deleteStudent && (
        <DeleteStudentDialog
          student={deleteStudent}
          isOpen={Boolean(deleteStudent)}
          onClose={() => setDeleteStudent(null)}
          onSuccess={() => handleSuccess("Student deleted.")}
        />
      )}

      {/* Page heading */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Students</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage student records and enrollments
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-background rounded-xl border border-border p-4 flex flex-wrap gap-3 items-end">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by name, email or phone…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
          />
        </div>
        <select
          value={urlSort}
          onChange={(e) => updateParams({ sort: e.target.value === "name" ? null : e.target.value, page: null })}
          className="h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
        >
          <option value="name">Name A–Z</option>
          <option value="created">Created Newest</option>
        </select>
        <select
          value={urlPerPage}
          onChange={(e) => updateParams({ perPage: e.target.value === "10" ? null : e.target.value, page: null })}
          className="h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
        >
          <option value="10">10 / page</option>
          <option value="25">25 / page</option>
          <option value="50">50 / page</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => router.push("/admin/students")}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Count */}
      <p className="text-sm text-muted-foreground">
        {totalCount === 0
          ? "No students"
          : `Showing ${rangeStart}–${rangeEnd} of ${totalCount} student${totalCount !== 1 ? "s" : ""}`}
      </p>

      {/* Fetch error */}
      {fetchError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">
          Something went wrong: {fetchError}
        </div>
      )}

      {/* Empty state */}
      {!fetchError && students.length === 0 && (
        <div className="bg-background rounded-xl border border-border px-6 py-16 flex flex-col items-center text-center gap-4">
          <span className="w-12 h-12 rounded-full bg-secondary/60 flex items-center justify-center">
            <Users className="w-6 h-6 text-muted-foreground" />
          </span>
          {hasFilters ? (
            <>
              <p className="font-display text-xl text-foreground">
                No students match your search
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting or clearing your search.
              </p>
              <button
                onClick={() => router.push("/admin/students")}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear search
              </button>
            </>
          ) : (
            <>
              <p className="font-display text-xl text-foreground">
                No students yet
              </p>
              <p className="text-sm text-muted-foreground">
                Add your first student to get started.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Add Student
              </button>
            </>
          )}
        </div>
      )}

      {/* Table */}
      {!fetchError && students.length > 0 && (
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  {["Name", "Email", "Phone", "Courses", "Added"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/admin/students/${student.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors hover:underline"
                      >
                        {student.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {student.email ?? (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {student.phone ?? (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {student.enrollment_count} course
                        {student.enrollment_count !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                      {new Date(student.created_at).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setEditStudent(student)}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Edit
                        </button>
                        <span className="text-border select-none">|</span>
                        <button
                          onClick={() => setDeleteStudent(student)}
                          className="text-xs font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => updateParams({ page: String(currentPage - 1) })}
            disabled={currentPage <= 1}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => updateParams({ page: String(currentPage + 1) })}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
