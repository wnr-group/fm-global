"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Student } from "@/types/student";

const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || z.string().email().safeParse(val).success,
      { message: "Please enter a valid email address" }
    ),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

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
  student?: Student;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudentModal({
  student,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const isEditing = Boolean(student);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: { name: "", email: "", phone: "", address: "" },
  });

  useEffect(() => {
    if (isOpen) {
      setFormError(null);
      setIsSubmitting(false);
      reset({
        name: student?.name ?? "",
        email: student?.email ?? "",
        phone: student?.phone ?? "",
        address: student?.address ?? "",
      });
    }
  }, [isOpen, student, reset]);
  
  if (!isOpen) return null;

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const supabase = createClient();
      const payload = {
        name: data.name.trim(),
        email: data.email?.trim() || null,
        phone: data.phone.trim(),
        address: data.address?.trim() || null,
      };
      const { error } =
        isEditing && student
          ? await supabase
              .from("students")
              .update(payload)
              .eq("id", student.id)
          : await supabase.from("students").insert(payload);

      if (error) {
        setFormError(error.message);
        return;
      }
      onSuccess();
      onClose();
    } catch {
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? "Edit student" : "Add student"}
    >
      <div
        className="bg-background rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-display text-base font-semibold text-foreground">
            {isEditing ? "Edit Student" : "Add Student"}
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
                htmlFor="student-name"
                className="block text-sm font-medium text-foreground"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="student-name"
                type="text"
                {...register("name")}
                placeholder="e.g. Ahmed Al-Rashidi"
                className={inputClass(!!errors.name)}
              />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="student-email"
                className="block text-sm font-medium text-foreground"
              >
                Email{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <input
                id="student-email"
                type="email"
                {...register("email")}
                placeholder="student@example.com"
                className={inputClass(!!errors.email)}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label
                htmlFor="student-phone"
                className="block text-sm font-medium text-foreground"
              >
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                id="student-phone"
                type="tel"
                {...register("phone")}
                placeholder="+91 98765 43210"
                className={inputClass(!!errors.phone)}
              />
              {errors.phone && (
                <p className="text-xs text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label
                htmlFor="student-address"
                className="block text-sm font-medium text-foreground"
              >
                Address{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <textarea
                id="student-address"
                rows={2}
                {...register("address")}
                placeholder="Street, City, State…"
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
                "Add Student"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
