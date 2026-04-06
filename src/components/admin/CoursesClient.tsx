"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  BookOpen,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { Course } from "@/types/course";
import CourseModal from "@/components/admin/courses/CourseModal";
import DeleteCourseDialog from "@/components/admin/courses/DeleteCourseDialog";

interface CoursesClientProps {
  courses: Course[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  fetchError: string | null;
}

interface ToastState {
  type: "success" | "error";
  message: string;
}

export default function CoursesClient({
  courses,
  totalCount,
  currentPage,
  pageSize,
  fetchError,
}: CoursesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";

  const [inputValue, setInputValue] = useState(urlSearch);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [deleteCourse, setDeleteCourse] = useState<Course | null>(null);

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
  const hasFilters = Boolean(urlSearch);

  function updateParams(updates: Record<string, string | null>) {
    const p = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === "") p.delete(k);
      else p.set(k, v);
    });
    router.push(`/admin/courses?${p.toString()}`);
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
      <CourseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => handleSuccess("Course added successfully!")}
      />
      {editCourse && (
        <CourseModal
          course={editCourse}
          isOpen={Boolean(editCourse)}
          onClose={() => setEditCourse(null)}
          onSuccess={() => handleSuccess("Course updated successfully!")}
        />
      )}
      {deleteCourse && (
        <DeleteCourseDialog
          course={deleteCourse}
          isOpen={Boolean(deleteCourse)}
          onClose={() => setDeleteCourse(null)}
          onSuccess={() => handleSuccess("Course deleted.")}
        />
      )}

      {/* Page heading */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Courses</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage course catalog
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* Search bar */}
      <div className="bg-background rounded-xl border border-border p-4 flex flex-wrap gap-3 items-end">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by name or code…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
          />
        </div>
        {hasFilters && (
          <button
            onClick={() => router.push("/admin/courses")}
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
          ? "No courses"
          : `Showing ${rangeStart}–${rangeEnd} of ${totalCount} course${totalCount !== 1 ? "s" : ""}`}
      </p>

      {/* Fetch error */}
      {fetchError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">
          Something went wrong: {fetchError}
        </div>
      )}

      {/* Empty state */}
      {!fetchError && courses.length === 0 && (
        <div className="bg-background rounded-xl border border-border px-6 py-16 flex flex-col items-center text-center gap-4">
          <span className="w-12 h-12 rounded-full bg-secondary/60 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-muted-foreground" />
          </span>
          {hasFilters ? (
            <>
              <p className="font-display text-xl text-foreground">
                No courses match your search
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting or clearing your search.
              </p>
              <button
                onClick={() => router.push("/admin/courses")}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear search
              </button>
            </>
          ) : (
            <>
              <p className="font-display text-xl text-foreground">
                No courses yet
              </p>
              <p className="text-sm text-muted-foreground">
                Add your first course to get started.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Add Course
              </button>
            </>
          )}
        </div>
      )}

      {/* Table */}
      {!fetchError && courses.length > 0 && (
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  {["Name", "Code", "Description", "Created"].map((h) => (
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
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-4 py-3.5 text-foreground font-medium">
                      {course.name}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-foreground bg-secondary/10">
                      {course.code}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground max-w-xs">
                      {course.description ? (
                        course.description.length > 60 ? (
                          course.description.slice(0, 60) + "…"
                        ) : (
                          course.description
                        )
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                      {new Date(course.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setEditCourse(course)}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Edit
                        </button>
                        <span className="text-border select-none">|</span>
                        <button
                          onClick={() => setDeleteCourse(course)}
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
