"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Course } from "@/types/course";

const courseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

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

interface Props {
  course?: Course;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CourseModal({ course, isOpen, onClose, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const isEditing = Boolean(course);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: { name: "", code: "", description: "" },
  });

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormError(null);
      reset({
        name: course?.name ?? "",
        code: course?.code ?? "",
        description: course?.description ?? "",
      });
    }
  }, [isOpen, course, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const supabase = createClient();
      const payload = {
        name: data.name.trim(),
        code: data.code.trim().toUpperCase(),
        description: data.description?.trim() || null,
      };
      const { error } =
        isEditing && course
          ? await supabase.from("courses").update(payload).eq("id", course.id)
          : await supabase.from("courses").insert(payload);
      if (error) {
        setFormError(error.message);
        setIsSubmitting(false);
        return;
      }
      onSuccess();
      onClose();
    } catch {
      setFormError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? "Edit course" : "Add course"}
    >
      <div
        className="bg-background rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-display text-base font-semibold text-foreground">
            {isEditing ? "Edit Course" : "Add Course"}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="px-6 py-5 space-y-4">
            {formError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            {/* Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="course-name"
                className="block text-sm font-medium text-foreground"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="course-name"
                type="text"
                {...register("name")}
                placeholder="e.g. Mechanical Technician Training"
                className={inputClass(!!errors.name)}
              />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Code */}
            <div className="space-y-1.5">
              <label
                htmlFor="course-code"
                className="block text-sm font-medium text-foreground"
              >
                Code <span className="text-red-500">*</span>{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  (auto-uppercased)
                </span>
              </label>
              <input
                id="course-code"
                type="text"
                {...register("code")}
                placeholder="e.g. MECH-101"
                className={inputClass(!!errors.code)}
              />
              {errors.code && (
                <p className="text-xs text-red-600">{errors.code.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label
                htmlFor="course-desc"
                className="block text-sm font-medium text-foreground"
              >
                Description{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <textarea
                id="course-desc"
                rows={3}
                {...register("description")}
                placeholder="Brief description…"
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-foreground bg-background resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/40 transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 px-6 pb-5">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Add Course"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
