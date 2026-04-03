// CertificateEditForm.tsx
// Client Component — full detail/edit page for a single FM Global certificate.
// Provides: editable form (react-hook-form + zod), read-only system info,
// status management card (revoke / reactivate) with confirmation modal,
// quick actions (view public page, copy URL, download PDF placeholder),
// and inline toast notifications — matching the exact pattern of CreateCertificateForm.tsx.

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
  Copy,
  Check,
  ExternalLink,
  Lock,
  ShieldOff,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";

const CertificatePDFDownload = dynamic(
  () => import("@/components/CertificatePDFDownload"),
  { ssr: false }
);
import type { Certificate } from "@/types/database";

// ── Zod Schema ────────────────────────────────────────────────────────────────
// Status is intentionally excluded — it has its own dedicated update flow.

const editCertificateSchema = z.object({
  student_name: z
    .string()
    .min(2, "Student name must be at least 2 characters"),
  student_email: z.string().email("Please enter a valid email address"),
  course_name: z.string().min(2, "Course name must be at least 2 characters"),
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
});

type EditFormData = z.infer<typeof editCertificateSchema>;

// ── Types ─────────────────────────────────────────────────────────────────────

interface ToastState {
  type: "success" | "error";
  message: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

/** "01 Jan 2026" */
function formatDisplayDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** "31 Mar 2026, 10:30 AM" */
function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const datePart = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timePart = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart}, ${timePart}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  certificate: Certificate;
}

export default function CertificateEditForm({ certificate }: Props) {
  const router = useRouter();

  // ── State ─────────────────────────────────────────────────────────
  // currentCert is updated from the Supabase response after a successful
  // save, so updated_at refreshes without a page reload.
  const [currentCert, setCurrentCert] = useState<Certificate>(certificate);
  // status is managed separately for instant optimistic UI on revoke/reactivate
  const [status, setStatus] = useState<"active" | "revoked">(certificate.status);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStatusChanging, setIsStatusChanging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Auto-dismiss toast after 4 seconds — exact same pattern as CreateCertificateForm
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // ── Form setup ────────────────────────────────────────────────────

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFormData>({
    resolver: zodResolver(editCertificateSchema),
    defaultValues: {
      student_name: certificate.student_name,
      student_email: certificate.student_email ?? "",
      course_name: certificate.course_name,
      course_description: certificate.course_description ?? "",
      instructor_name: certificate.instructor_name,
      duration: certificate.duration,
      lectures_count: certificate.lectures_count ?? undefined,
      issue_date: certificate.issue_date,
      reference_number: certificate.reference_number ?? "",
    },
  });

  // ── Save Changes ──────────────────────────────────────────────────

  const onSubmit = async (data: EditFormData) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { data: updated, error } = await supabase
        .from("certificates")
        .update({
          student_name: data.student_name,
          student_email: data.student_email || null,
          course_name: data.course_name,
          course_description: data.course_description || null,
          instructor_name: data.instructor_name,
          duration: data.duration,
          lectures_count: data.lectures_count ?? null,
          issue_date: data.issue_date,
          reference_number: data.reference_number || null,
          // NOT updated: id, certificate_id, created_at, status
          // updated_at is auto-updated by the DB trigger
        })
        .eq("id", currentCert.id)
        .select()
        .single();

      if (error || !updated) {
        setToast({
          type: "error",
          message: "Failed to update certificate. Please try again.",
        });
        setIsSubmitting(false);
        return;
      }

      // Update state so updated_at refreshes on the page without reload
      setCurrentCert(updated);
      setToast({ type: "success", message: "Certificate updated successfully!" });
    } catch {
      setToast({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Status Change (revoke / reactivate) ───────────────────────────

  const handleStatusConfirm = async () => {
    const newStatus = status === "active" ? "revoked" : "active";
    const prevStatus = status;

    setIsStatusChanging(true);
    setShowModal(false);
    setStatus(newStatus); // optimistic update

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("certificates")
        .update({ status: newStatus })
        .eq("id", currentCert.id);

      if (error) {
        setStatus(prevStatus); // revert
        setToast({
          type: "error",
          message: `Failed to ${newStatus === "revoked" ? "revoke" : "reactivate"} certificate. Please try again.`,
        });
        return;
      }

      // Keep currentCert.status in sync
      setCurrentCert((prev) => ({ ...prev, status: newStatus }));
      setToast({
        type: "success",
        message:
          newStatus === "revoked"
            ? "Certificate revoked successfully."
            : "Certificate reactivated successfully.",
      });
    } catch {
      setStatus(prevStatus);
      setToast({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsStatusChanging(false);
    }
  };

  // ── Copy Verification URL ─────────────────────────────────────────

  const handleCopyUrl = async () => {
    try {
      const url = `${window.location.origin}/verify/${currentCert.certificate_id}`;
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setToast({ type: "error", message: "Failed to copy URL. Please try again." });
    }
  };

  // ── Render ────────────────────────────────────────────────────────

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

      {/* ── Confirmation Modal ───────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label={
            status === "active"
              ? "Revoke certificate confirmation"
              : "Reactivate certificate confirmation"
          }
        >
          <div
            className="bg-background rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-display text-base font-semibold text-foreground">
                {status === "active"
                  ? "Revoke Certificate?"
                  : "Reactivate Certificate?"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {status === "active" ? (
                  <>
                    Are you sure you want to revoke certificate{" "}
                    <span className="font-mono font-medium text-foreground">
                      {currentCert.certificate_id}
                    </span>{" "}
                    for{" "}
                    <span className="font-medium text-foreground">
                      {currentCert.student_name}
                    </span>
                    ? This will mark it as invalid. You can reactivate it later.
                  </>
                ) : (
                  <>
                    Are you sure you want to reactivate certificate{" "}
                    <span className="font-mono font-medium text-foreground">
                      {currentCert.certificate_id}
                    </span>{" "}
                    for{" "}
                    <span className="font-medium text-foreground">
                      {currentCert.student_name}
                    </span>
                    ? This will mark it as active again.
                  </>
                )}
              </p>
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-end gap-3 px-6 pb-5">
              <button
                onClick={() => setShowModal(false)}
                className="h-10 px-5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusConfirm}
                disabled={isStatusChanging}
                className={[
                  "inline-flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-semibold text-white transition-colors",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                  status === "active"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700",
                ].join(" ")}
              >
                {isStatusChanging ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing…
                  </>
                ) : status === "active" ? (
                  "Yes, Revoke"
                ) : (
                  "Yes, Reactivate"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page content ─────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto">
        {/* ── Page header ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          {/* Left: back link + title + cert ID + status badge */}
          <div>
            <Link
              href="/admin/certificates"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Certificates
            </Link>
            <h1 className="font-display text-3xl text-foreground">
              Certificate Details
            </h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <p className="text-sm text-muted-foreground font-mono">
                {currentCert.certificate_id}
              </p>
              <span
                className={[
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                  status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700",
                ].join(" ")}
              >
                {status}
              </span>
            </div>
          </div>

          {/* Right: quick actions */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <Link
              href={`/verify/${currentCert.certificate_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-secondary/40 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Public Page
            </Link>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-secondary/40 transition-colors"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy URL
                </>
              )}
            </button>
            <CertificatePDFDownload
              certificate={currentCert}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-secondary/40 transition-colors"
              iconClassName="w-3.5 h-3.5"
            />
          </div>
        </div>

        {/* ── Two-column grid ─────────────────────────────────────────── */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-4 lg:space-y-0">
          {/* ── LEFT COLUMN (edit form + read-only info + action bar) ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* The form wraps only the editable card sections */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate id="edit-form">
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
                      {...register("course_description")}
                      className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-foreground bg-background resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/40 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="bg-background rounded-xl border border-border overflow-hidden">
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
                      {...register("reference_number")}
                      className={inputClass(!!errors.reference_number)}
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Read-only system info — outside <form> to avoid accidental submission */}
            <div className="bg-background rounded-xl border border-border overflow-hidden">
              <div className="px-6 py-3.5 border-b border-border bg-secondary/20">
                <h2 className="text-sm font-semibold text-foreground">
                  System Information
                </h2>
              </div>
              <div className="p-6 grid sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Certificate ID (read-only)
                  </p>
                  <p className="text-sm font-mono text-foreground">
                    {currentCert.certificate_id}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Status (managed separately)
                  </p>
                  <span
                    className={[
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                      status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700",
                    ].join(" ")}
                  >
                    {status}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Created At</p>
                  <p className="text-sm text-foreground">
                    {formatDateTime(currentCert.created_at)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-sm text-foreground">
                    {formatDateTime(currentCert.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Action bar — submit button linked to form via `form` attribute */}
            <div className="flex items-center justify-end gap-3 pb-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center h-10 px-5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-form"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Certificate Info card */}
            <div className="bg-background rounded-xl border border-border overflow-hidden">
              <div className="px-6 py-3.5 border-b border-border bg-secondary/20">
                <h2 className="text-sm font-semibold text-foreground">
                  Certificate Info
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Certificate ID</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono text-foreground flex-1 break-all">
                      {currentCert.certificate_id}
                    </p>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            currentCert.certificate_id
                          );
                          setToast({
                            type: "success",
                            message: "Certificate ID copied!",
                          });
                        } catch {
                          setToast({
                            type: "error",
                            message: "Failed to copy. Please try again.",
                          });
                        }
                      }}
                      aria-label="Copy certificate ID"
                      className="shrink-0 p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Issued</p>
                  <p className="text-sm text-foreground">
                    {formatDisplayDate(currentCert.issue_date)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm text-foreground">
                    {formatDateTime(currentCert.created_at)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-sm text-foreground">
                    {formatDateTime(currentCert.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Management card */}
            <div className="bg-background rounded-xl border border-border overflow-hidden">
              <div className="px-6 py-3.5 border-b border-border bg-secondary/20">
                <h2 className="text-sm font-semibold text-foreground">
                  Status Management
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Current Status</p>
                  <span
                    className={[
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold capitalize",
                      status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700",
                    ].join(" ")}
                  >
                    {status === "active" ? (
                      <ShieldCheck className="w-4 h-4" />
                    ) : (
                      <ShieldOff className="w-4 h-4" />
                    )}
                    {status}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {status === "active"
                    ? "This certificate is currently valid and publicly verifiable."
                    : "This certificate has been revoked and will show as invalid when verified."}
                </p>

                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  disabled={isStatusChanging}
                  className={[
                    "w-full h-10 rounded-lg text-sm font-semibold transition-colors border",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                    status === "active"
                      ? "bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                      : "bg-green-50 text-green-700 hover:bg-green-100 border-green-200",
                  ].join(" ")}
                >
                  {isStatusChanging ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating…
                    </span>
                  ) : status === "active" ? (
                    "Revoke Certificate"
                  ) : (
                    "Reactivate Certificate"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
