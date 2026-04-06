// CreateCertificateForm.tsx
// Client Component — full form for issuing a new FM Global certificate.
// Uses react-hook-form + zod for validation, Supabase browser client for insertion.
// Includes: inline toast notifications, preview modal, and redirect on success.

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ── Zod Schema ────────────────────────────────────────────────────────────────

const certificateSchema = z.object({
  student_name: z
    .string()
    .min(2, "Student name must be at least 2 characters")
    .max(100, "Student name must be less than 100 characters"),
  student_email: z.string().email("Please enter a valid email address"),
  course_name: z
    .string()
    .min(2, "Course name must be at least 2 characters")
    .max(200, "Course name must be less than 200 characters"),
  course_description: z.string().optional(),
  instructor_name: z
    .string()
    .min(2, "Instructor name must be at least 2 characters"),
  duration: z.string().min(1, "Duration is required"),
  lectures_count: z
    .number()
    .int("Must be a whole number")
    .positive("Must be greater than 0")
    .optional(),
  issue_date: z.string().min(1, "Issue date is required"),
  reference_number: z.string().optional(),
  status: z.enum(["active", "revoked"]),
});

type CertificateFormData = z.infer<typeof certificateSchema>;

// ── Helpers ───────────────────────────────────────────────────────────────────

interface ToastState {
  type: "success" | "error";
  message: string;
}

function inputClass(hasError: boolean): string {
  return [
    "w-full h-10 rounded-lg border px-3 text-sm text-foreground bg-background",
    "placeholder:text-muted-foreground transition-colors",
    "focus:outline-none focus:ring-2 focus:border-primary",
    hasError
      ? "border-red-400 focus:ring-red-400/40"
      : "border-border focus:ring-primary/40",
  ].join(" ");
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CreateCertificateForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      student_name: "",
      student_email: "",
      course_name: "",
      course_description: "",
      instructor_name: "",
      duration: "",
      issue_date: new Date().toISOString().split("T")[0],
      reference_number: "",
      status: "active",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watched = watch();

  const canPreview =
    (watched.student_name?.length ?? 0) >= 1 &&
    (watched.course_name?.length ?? 0) >= 1;

  const previewDate = watched.issue_date
    ? new Date(watched.issue_date + "T00:00:00").toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  // ── Submit ─────────────────────────────────────────────────────────────────

  const onSubmit = async (data: CertificateFormData) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { data: newCert, error } = await supabase
        .from("certificates")
        .insert([
          {
            student_name: data.student_name,
            student_email: data.student_email,
            course_name: data.course_name,
            course_description: data.course_description || null,
            instructor_name: data.instructor_name,
            duration: data.duration,
            lectures_count: data.lectures_count ?? null,
            issue_date: data.issue_date,
            reference_number: data.reference_number || null,
            status: data.status,
          },
        ])
        .select()
        .single();

      if (error) {
        setToast({ type: "error", message: error.message });
        setIsSubmitting(false);
        return;
      }

      if (!newCert) {
        setToast({
          type: "error",
          message: "Certificate was created but could not be retrieved.",
        });
        setIsSubmitting(false);
        return;
      }

      setToast({
        type: "success",
        message: `Certificate created! ID: ${newCert.certificate_id}`,
      });

      // Brief delay so the user sees the success toast before redirect
      setTimeout(() => {
        router.push(`/admin/certificates/${newCert.id}`);
      }, 1200);
    } catch {
      setToast({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Toast notification ──────────────────────────────────────── */}
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
            aria-label="Dismiss notification"
            className="shrink-0 hover:opacity-80 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Preview modal ────────────────────────────────────────────── */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowPreview(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Certificate preview"
        >
          <div
            className="bg-background rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-display text-base font-semibold text-foreground">
                Certificate Preview
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                aria-label="Close preview"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Certificate card */}
            <div className="p-6">
              <div className="border-2 border-primary/20 rounded-xl p-6 bg-gradient-to-br from-primary/[0.04] to-transparent text-center space-y-2">
                <p className="text-xs font-semibold text-primary/70 uppercase tracking-widest">
                  FM Global
                </p>
                <h4 className="font-display text-xl text-foreground">
                  Certificate of Completion
                </h4>
                <p className="text-xs text-muted-foreground pt-1">
                  This is to certify that
                </p>
                <p className="font-display text-2xl text-primary">
                  {watched.student_name || "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  has successfully completed
                </p>
                <p className="font-display text-lg text-foreground font-semibold">
                  {watched.course_name || "—"}
                </p>
                <div className="pt-2 space-y-1 text-xs text-muted-foreground">
                  {watched.instructor_name && (
                    <p>
                      Instructor:{" "}
                      <span className="text-foreground">
                        {watched.instructor_name}
                      </span>
                    </p>
                  )}
                  {watched.duration && (
                    <p>
                      Duration:{" "}
                      <span className="text-foreground">{watched.duration}</span>
                    </p>
                  )}
                  <p>
                    Issue Date:{" "}
                    <span className="text-foreground">{previewDate}</span>
                  </p>
                  <p>
                    Certificate ID:{" "}
                    <span className="italic text-muted-foreground/70">
                      Pending — auto-generated
                    </span>
                  </p>
                </div>
                <div className="pt-2">
                  <span
                    className={[
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                      watched.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700",
                    ].join(" ")}
                  >
                    {watched.status}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Preview only. Certificate ID is auto-generated after submission.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Page content ─────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page header */}
        <div>
          <Link
            href="/admin/certificates"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Certificates
          </Link>
          <h1 className="font-display text-3xl text-foreground">
            Issue New Certificate
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the details to issue a new certificate
          </p>
        </div>

        {/* ── Form ───────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Student Information */}
          <div className="bg-background rounded-xl border border-border overflow-hidden mb-4">
            <div className="px-6 py-3.5 border-b border-border bg-secondary/20">
              <h2 className="text-sm font-semibold text-foreground">
                Student Information
              </h2>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="student_name"
                  className="block text-sm font-medium text-foreground"
                >
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="student_name"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  {...register("student_name")}
                  className={inputClass(!!errors.student_name)}
                />
                {errors.student_name && (
                  <p className="text-xs text-red-600">
                    {errors.student_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="student_email"
                  className="block text-sm font-medium text-foreground"
                >
                  Student Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="student_email"
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  {...register("student_email")}
                  className={inputClass(!!errors.student_email)}
                />
                {errors.student_email && (
                  <p className="text-xs text-red-600">
                    {errors.student_email.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Course Information */}
          <div className="bg-background rounded-xl border border-border overflow-hidden mb-4">
            <div className="px-6 py-3.5 border-b border-border bg-secondary/20">
              <h2 className="text-sm font-semibold text-foreground">
                Course Information
              </h2>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="course_name"
                  className="block text-sm font-medium text-foreground"
                >
                  Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="course_name"
                  type="text"
                  placeholder="e.g. Safety & Compliance Training"
                  {...register("course_name")}
                  className={inputClass(!!errors.course_name)}
                />
                {errors.course_name && (
                  <p className="text-xs text-red-600">
                    {errors.course_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="instructor_name"
                  className="block text-sm font-medium text-foreground"
                >
                  Instructor Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="instructor_name"
                  type="text"
                  placeholder="e.g. Dr. Arjun Mehta"
                  {...register("instructor_name")}
                  className={inputClass(!!errors.instructor_name)}
                />
                {errors.instructor_name && (
                  <p className="text-xs text-red-600">
                    {errors.instructor_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-foreground"
                >
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  id="duration"
                  type="text"
                  placeholder="e.g. 40 hours"
                  {...register("duration")}
                  className={inputClass(!!errors.duration)}
                />
                {errors.duration && (
                  <p className="text-xs text-red-600">
                    {errors.duration.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="lectures_count"
                  className="block text-sm font-medium text-foreground"
                >
                  Number of Lectures{" "}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <input
                  id="lectures_count"
                  type="number"
                  min={1}
                  step={1}
                  placeholder="e.g. 12"
                  {...register("lectures_count", {
                    setValueAs: (v) =>
                      v === "" || v === undefined || v === null
                        ? undefined
                        : parseInt(String(v), 10),
                  })}
                  className={inputClass(!!errors.lectures_count)}
                />
                {errors.lectures_count && (
                  <p className="text-xs text-red-600">
                    {errors.lectures_count.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label
                  htmlFor="course_description"
                  className="block text-sm font-medium text-foreground"
                >
                  Course Description{" "}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="course_description"
                  rows={3}
                  placeholder="Brief description of the course content…"
                  {...register("course_description")}
                  className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-foreground bg-background resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/40 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="bg-background rounded-xl border border-border overflow-hidden mb-6">
            <div className="px-6 py-3.5 border-b border-border bg-secondary/20">
              <h2 className="text-sm font-semibold text-foreground">
                Certificate Details
              </h2>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="issue_date"
                  className="block text-sm font-medium text-foreground"
                >
                  Issue Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="issue_date"
                  type="date"
                  {...register("issue_date")}
                  className={inputClass(!!errors.issue_date)}
                />
                {errors.issue_date && (
                  <p className="text-xs text-red-600">
                    {errors.issue_date.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-foreground"
                >
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  {...register("status")}
                  className={inputClass(!!errors.status)}
                >
                  <option value="active">Active</option>
                  <option value="revoked">Revoked</option>
                </select>
                {errors.status && (
                  <p className="text-xs text-red-600">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label
                  htmlFor="reference_number"
                  className="block text-sm font-medium text-foreground"
                >
                  Reference Number{" "}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <input
                  id="reference_number"
                  type="text"
                  placeholder="e.g. REF-2026-001"
                  {...register("reference_number")}
                  className={inputClass(!!errors.reference_number)}
                />
              </div>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap pb-6">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              disabled={!canPreview}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Eye className="w-4 h-4" />
              Preview Certificate
            </button>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/certificates"
                className="inline-flex items-center h-10 px-5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Issuing…
                  </>
                ) : (
                  "Issue Certificate"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
