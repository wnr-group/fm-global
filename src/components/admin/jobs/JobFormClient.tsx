"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CloudUpload, FileText, Loader2, Eye } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { JobListing } from "@/types/jobs";

// ── Zod schema ─────────────────────────────────────────────────────────────────
const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  company: z.string().min(2, "Company must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or fewer")
    .optional()
    .or(z.literal("")),
  requirements: z
    .string()
    .max(1000, "Requirements must be 1000 characters or fewer")
    .optional()
    .or(z.literal("")),
  salary_range: z.string().optional().or(z.literal("")),
  contact_type: z.enum(["email", "whatsapp", "phone"] as const),
  contact_value: z.string().min(1, "Contact value is required"),
  is_active: z.boolean(),
});

type JobFormData = z.infer<typeof jobSchema>;

// ── Input class helper ─────────────────────────────────────────────────────────
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

function textareaClass(hasError: boolean): string {
  return [
    "w-full rounded-lg border px-3 py-2.5 text-sm text-foreground bg-background resize-none",
    "placeholder:text-muted-foreground transition-colors",
    "focus:outline-none focus:ring-2 focus:border-primary",
    hasError
      ? "border-red-400 focus:ring-red-400/40"
      : "border-border focus:ring-primary/40",
  ].join(" ");
}

// ── Props ──────────────────────────────────────────────────────────────────────
interface Props {
  mode: "create" | "edit";
  initialJob?: JobListing;
}

type PdfState =
  | { status: "none" }
  | { status: "existing"; url: string; filename: string }
  | { status: "selected"; file: File; previewUrl: string }
  | { status: "uploading" }
  | { status: "done"; url: string; filename: string; path: string };

export default function JobFormClient({ mode, initialJob }: Props) {
  const router = useRouter();

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialPdfState: PdfState =
    mode === "edit" && initialJob?.pdf_url && initialJob?.pdf_filename
      ? {
          status: "existing",
          url: initialJob.pdf_url,
          filename: initialJob.pdf_filename,
        }
      : { status: "none" };

  const [pdfState, setPdfState] = useState<PdfState>(initialPdfState);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: initialJob?.title ?? "",
      company: initialJob?.company ?? "",
      location: initialJob?.location ?? "",
      description: initialJob?.description ?? "",
      requirements: initialJob?.requirements ?? "",
      salary_range: initialJob?.salary_range ?? "",
      contact_type: initialJob?.contact_type ?? "email",
      contact_value: initialJob?.contact_value ?? "",
      is_active: initialJob?.is_active ?? true,
    },
  });

  const descriptionValue = watch("description") ?? "";
  const requirementsValue = watch("requirements") ?? "";
  const contactType = watch("contact_type");

  const contactPlaceholder =
    contactType === "email" ? "name@company.com" : "+91XXXXXXXXXX";

  // ── PDF handling ─────────────────────────────────────────────────────────────
  function validateAndSetFile(file: File) {
    setPdfError(null);
    if (file.type !== "application/pdf") {
      setPdfError("Only PDF files are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPdfError("PDF must be 10 MB or smaller.");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setPdfState({ status: "selected", file, previewUrl });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
    // Reset input so the same file can be re-selected after removal
    e.target.value = "";
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  }, []);

  function removePdf() {
    if (pdfState.status === "selected") {
      URL.revokeObjectURL(pdfState.previewUrl);
    }
    setPdfState({ status: "none" });
    setPdfError(null);
  }

  async function removeExistingPdf() {
    if (pdfState.status !== "existing" || !initialJob) return;
    const supabase = createClient();
    const parts = pdfState.url.split("/job-pdfs/");
    if (parts.length === 2) {
      const storagePath = parts[1].split("?")[0];
      await supabase.storage.from("job-pdfs").remove([storagePath]);
    }
    await supabase
      .from("job_listings")
      .update({ pdf_url: null, pdf_filename: null })
      .eq("id", initialJob.id);
    setPdfState({ status: "none" });
  }

  // ── Submit ────────────────────────────────────────────────────────────────────
  const onSubmit = async (data: JobFormData, activeStatus?: boolean) => {
    setIsSubmitting(true);
    setFormError(null);
    const supabase = createClient();

    try {
      let finalPdfUrl: string | null = null;
      let finalPdfFilename: string | null = null;
      let uploadedPath: string | null = null;

      // Upload new PDF if selected
      if (pdfState.status === "selected") {
        setPdfState({ status: "uploading" });
        const jobId = mode === "create" ? crypto.randomUUID() : initialJob!.id;
        const safeName = pdfState.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${jobId}/${Date.now()}_${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("job-pdfs")
          .upload(path, pdfState.file, { contentType: "application/pdf" });

        if (uploadError) {
          setFormError(`PDF upload failed: ${uploadError.message}`);
          setPdfState({
            status: "selected",
            file: pdfState.file,
            previewUrl: URL.createObjectURL(pdfState.file),
          });
          setIsSubmitting(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("job-pdfs")
          .getPublicUrl(path);

        finalPdfUrl = publicUrlData.publicUrl;
        finalPdfFilename = pdfState.file.name;
        uploadedPath = path;

        setPdfState({
          status: "done",
          url: finalPdfUrl,
          filename: finalPdfFilename,
          path,
        });
      } else if (pdfState.status === "existing") {
        finalPdfUrl = pdfState.url;
        finalPdfFilename = pdfState.filename;
      }
      // status "none" or "done" leaves pdf null (or already set above)

      const isActive =
        activeStatus !== undefined ? activeStatus : data.is_active;

      const payload = {
        title: data.title.trim(),
        company: data.company.trim(),
        location: data.location.trim(),
        description: data.description?.trim() || null,
        requirements: data.requirements?.trim() || null,
        salary_range: data.salary_range?.trim() || null,
        pdf_url: finalPdfUrl,
        pdf_filename: finalPdfFilename,
        contact_type: data.contact_type,
        contact_value: data.contact_value.trim(),
        is_active: isActive,
      };

      if (mode === "create") {
        const newId = uploadedPath
          ? uploadedPath.split("/")[0]
          : crypto.randomUUID();

        // If we uploaded a PDF, the jobId was already used for the path — delete
        // and re-insert with the same id isn't needed; just insert with id.
        const { error: insertError } = await supabase
          .from("job_listings")
          .insert({ ...payload, id: newId });

        if (insertError) {
          setFormError(insertError.message);
          setIsSubmitting(false);
          return;
        }
      } else {
        // Edit mode: if we uploaded a new PDF, delete the old one first
        if (uploadedPath && initialJob?.pdf_url) {
          const parts = initialJob.pdf_url.split("/job-pdfs/");
          if (parts.length === 2) {
            const oldPath = parts[1].split("?")[0];
            await supabase.storage.from("job-pdfs").remove([oldPath]);
          }
        }

        const { error: updateError } = await supabase
          .from("job_listings")
          .update(payload)
          .eq("id", initialJob!.id);

        if (updateError) {
          setFormError(updateError.message);
          setIsSubmitting(false);
          return;
        }
      }

      router.push("/admin/jobs");
    } catch {
      setFormError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="font-display text-3xl text-foreground">
          {mode === "create" ? "Add Job Listing" : "Edit Job Listing"}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {mode === "create"
            ? "Create a new job posting"
            : "Update the job posting details"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit((data) =>
          // eslint-disable-next-line react-hooks/incompatible-library
          onSubmit(data, watch("is_active"))
        )}
        noValidate
      >
        <div className="bg-background rounded-xl border border-border p-6 space-y-6">
          {formError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          {/* 2-column grid on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
            <div className="space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label
                  htmlFor="job-title"
                  className="block text-sm font-medium text-foreground"
                >
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="job-title"
                  type="text"
                  {...register("title")}
                  placeholder="e.g. Frontend Developer"
                  className={inputClass(!!errors.title)}
                />
                {errors.title && (
                  <p className="text-xs text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Company */}
              <div className="space-y-1.5">
                <label
                  htmlFor="job-company"
                  className="block text-sm font-medium text-foreground"
                >
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  id="job-company"
                  type="text"
                  {...register("company")}
                  placeholder="e.g. FM Global Technologies"
                  className={inputClass(!!errors.company)}
                />
                {errors.company && (
                  <p className="text-xs text-red-600">
                    {errors.company.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label
                  htmlFor="job-location"
                  className="block text-sm font-medium text-foreground"
                >
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="job-location"
                  type="text"
                  {...register("location")}
                  placeholder="e.g. Hyderabad, India"
                  className={inputClass(!!errors.location)}
                />
                {errors.location && (
                  <p className="text-xs text-red-600">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="job-description"
                    className="block text-sm font-medium text-foreground"
                  >
                    Description{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </label>
                  <span className="text-xs text-muted-foreground">
                    {descriptionValue.length}/500
                  </span>
                </div>
                <textarea
                  id="job-description"
                  rows={3}
                  {...register("description")}
                  placeholder="Brief job description…"
                  className={textareaClass(!!errors.description)}
                />
                {errors.description && (
                  <p className="text-xs text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Requirements */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="job-requirements"
                    className="block text-sm font-medium text-foreground"
                  >
                    Requirements{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </label>
                  <span className="text-xs text-muted-foreground">
                    {requirementsValue.length}/1000
                  </span>
                </div>
                <textarea
                  id="job-requirements"
                  rows={4}
                  {...register("requirements")}
                  placeholder="Skills, experience, qualifications…"
                  className={textareaClass(!!errors.requirements)}
                />
                {errors.requirements && (
                  <p className="text-xs text-red-600">
                    {errors.requirements.message}
                  </p>
                )}
              </div>

              {/* Salary Range */}
              <div className="space-y-1.5">
                <label
                  htmlFor="job-salary"
                  className="block text-sm font-medium text-foreground"
                >
                  Salary Range{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (optional)
                  </span>
                </label>
                <input
                  id="job-salary"
                  type="text"
                  {...register("salary_range")}
                  placeholder="e.g. ₹4–6 LPA"
                  className={inputClass(false)}
                />
              </div>
            </div>

            {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
            <div className="space-y-5">
              {/* Contact Type */}
              <div className="space-y-1.5">
                <label
                  htmlFor="job-contact-type"
                  className="block text-sm font-medium text-foreground"
                >
                  Contact Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="job-contact-type"
                  {...register("contact_type")}
                  className={inputClass(!!errors.contact_type)}
                >
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="phone">Phone</option>
                </select>
                {errors.contact_type && (
                  <p className="text-xs text-red-600">
                    {errors.contact_type.message}
                  </p>
                )}
              </div>

              {/* Contact Value */}
              <div className="space-y-1.5">
                <label
                  htmlFor="job-contact-value"
                  className="block text-sm font-medium text-foreground"
                >
                  Contact Value <span className="text-red-500">*</span>
                </label>
                <input
                  id="job-contact-value"
                  type="text"
                  {...register("contact_value")}
                  placeholder={contactPlaceholder}
                  className={inputClass(!!errors.contact_value)}
                />
                {errors.contact_value && (
                  <p className="text-xs text-red-600">
                    {errors.contact_value.message}
                  </p>
                )}
              </div>

              {/* PDF Upload */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">
                  Job PDF{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (optional, max 10 MB)
                  </span>
                </label>

                {/* Existing PDF chip */}
                {pdfState.status === "existing" && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/40 border border-border">
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground flex-1 truncate">
                      {pdfState.filename}
                    </span>
                    <a
                      href={pdfState.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-primary hover:underline shrink-0"
                    >
                      Preview
                    </a>
                    <button
                      type="button"
                      onClick={removeExistingPdf}
                      className="text-xs font-medium text-red-600 hover:underline shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Selected PDF chip */}
                {pdfState.status === "selected" && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/40 border border-border">
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">
                        {pdfState.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(pdfState.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.open(pdfState.previewUrl, "_blank")}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline shrink-0"
                    >
                      <Eye className="w-3 h-3" />
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={removePdf}
                      className="text-xs font-medium text-red-600 hover:underline shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Uploading state */}
                {pdfState.status === "uploading" && (
                  <div className="p-3 rounded-lg bg-secondary/40 border border-border space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading PDF…
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                      <div className="h-full bg-primary rounded-full animate-pulse w-3/4" />
                    </div>
                  </div>
                )}

                {/* Drop zone — show when no PDF selected/existing/uploading */}
                {(pdfState.status === "none" || pdfState.status === "done") && (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={[
                      "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 cursor-pointer transition-colors",
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/60 hover:bg-secondary/20",
                    ].join(" ")}
                  >
                    <CloudUpload className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground text-center">
                      <span className="font-medium text-foreground">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF only, max 10 MB
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {pdfError && (
                  <p className="text-xs text-red-600">{pdfError}</p>
                )}
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3">
                <input
                  id="job-active"
                  type="checkbox"
                  {...register("is_active")}
                  className="w-4 h-4 rounded border-border accent-primary"
                />
                <label
                  htmlFor="job-active"
                  className="text-sm font-medium text-foreground"
                >
                  Active (visible in listings)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Form actions */}
        <div className="flex items-center justify-end gap-3 mt-6 flex-wrap">
          <button
            type="button"
            onClick={() => router.push("/admin/jobs")}
            disabled={isSubmitting}
            className="h-10 px-5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          {mode === "create" ? (
            <>
              <button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, false))}
                disabled={isSubmitting}
                className="h-10 px-5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving…
                  </span>
                ) : (
                  "Save as Draft"
                )}
              </button>
              <button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, true))}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing…
                  </>
                ) : (
                  "Publish Job"
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleSubmit((data) => onSubmit(data))}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          )}
        </div>
      </form>
    </div>
  );
}
