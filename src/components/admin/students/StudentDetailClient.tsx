"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  BookOpen,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Student, EnrollmentWithCourse } from "@/types/student";
import StudentModal from "@/components/admin/students/StudentModal";
import EnrollCourseModal from "@/components/admin/students/EnrollCourseModal";

interface Props {
  student: Student;
  enrollments: EnrollmentWithCourse[];
}

interface ToastState {
  type: "success" | "error";
  message: string;
}

export default function StudentDetailClient({ student, enrollments }: Props) {
  const router = useRouter();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [removeEnrollment, setRemoveEnrollment] =
    useState<EnrollmentWithCourse | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  function handleSuccess(message: string) {
    setToast({ type: "success", message });
    router.refresh();
  }

  const handleRemoveEnrollment = async () => {
    if (!removeEnrollment) return;
    setIsRemoving(true);
    setRemoveError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("enrollments")
        .delete()
        .eq("id", removeEnrollment.id);
      if (error) {
        setRemoveError(error.message);
        setIsRemoving(false);
        return;
      }
      setRemoveEnrollment(null);
      handleSuccess("Enrollment removed.");
    } catch {
      setRemoveError("An unexpected error occurred.");
      setIsRemoving(false);
    }
  };

  const alreadyEnrolledIds = enrollments.map((e) => e.course_id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
        student={student}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => handleSuccess("Student updated successfully!")}
      />
      <EnrollCourseModal
        studentId={student.id}
        alreadyEnrolledCourseIds={alreadyEnrolledIds}
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        onSuccess={() => handleSuccess("Enrollment added successfully!")}
      />

      {/* Remove enrollment confirmation modal */}
      {removeEnrollment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setRemoveEnrollment(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Remove enrollment confirmation"
        >
          <div
            className="bg-background rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-display text-base font-semibold text-foreground">
                Remove Enrollment?
              </h3>
              <button
                onClick={() => setRemoveEnrollment(null)}
                aria-label="Close"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5">
              {removeError && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {removeError}
                </div>
              )}
              <p className="text-sm text-muted-foreground leading-relaxed">
                Remove{" "}
                <span className="font-medium text-foreground">
                  {student.name}
                </span>{" "}
                from{" "}
                <span className="font-medium text-foreground">
                  {removeEnrollment.courses.name}
                </span>
                ? This cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 pb-5">
              <button
                type="button"
                onClick={() => setRemoveEnrollment(null)}
                className="h-10 px-5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveEnrollment}
                disabled={isRemoving}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700"
              >
                {isRemoving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Removing…
                  </>
                ) : (
                  "Yes, Remove"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page header */}
      <div>
        <Link
          href="/admin/students"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </Link>
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-3xl text-foreground">
            {student.name}
          </h1>
          <button
            onClick={() => setShowEditModal(true)}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors shrink-0"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Student info card */}
      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-3.5 border-b border-border bg-secondary/20">
          <h2 className="text-sm font-semibold text-foreground">
            Student Information
          </h2>
        </div>
        <dl className="divide-y divide-border">
          {[
            { label: "Name", value: student.name },
            {
              label: "Email",
              value: student.email ?? (
                <span className="text-muted-foreground/50">Not provided</span>
              ),
            },
            {
              label: "Phone",
              value: student.phone ?? (
                <span className="text-muted-foreground/50">Not provided</span>
              ),
            },
            {
              label: "Address",
              value: student.address ?? (
                <span className="text-muted-foreground/50">Not provided</span>
              ),
            },
            {
              label: "Added",
              value: new Date(student.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }),
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="grid grid-cols-3 gap-4 px-6 py-3.5 text-sm"
            >
              <dt className="text-muted-foreground font-medium">{label}</dt>
              <dd className="col-span-2 text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Enrolled courses card */}
      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-3.5 border-b border-border bg-secondary/20 flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-foreground">
            Enrolled Courses{" "}
            <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {enrollments.length}
            </span>
          </h2>
          <button
            onClick={() => setShowEnrollModal(true)}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Enroll in Course
          </button>
        </div>

        {enrollments.length === 0 ? (
          <div className="px-6 py-12 flex flex-col items-center text-center gap-3">
            <span className="w-10 h-10 rounded-full bg-secondary/60 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
            </span>
            <p className="text-sm text-muted-foreground">
              Not enrolled in any courses yet.
            </p>
            <button
              onClick={() => setShowEnrollModal(true)}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-secondary/40 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Enroll in Course
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/10">
                  {["Code", "Course Name", "Enrolled On"].map((h) => (
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
                {enrollments.map((enrollment) => (
                  <tr
                    key={enrollment.id}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-mono text-xs text-foreground bg-secondary/10">
                      {enrollment.courses.code}
                    </td>
                    <td className="px-4 py-3.5 text-foreground font-medium">
                      {enrollment.courses.name}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                      {new Date(enrollment.enrolled_at).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setRemoveError(null);
                          setRemoveEnrollment(enrollment);
                        }}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
