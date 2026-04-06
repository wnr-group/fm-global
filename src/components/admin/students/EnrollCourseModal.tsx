"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Course } from "@/types/course";

interface Props {
  studentId: string;
  alreadyEnrolledCourseIds: string[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EnrollCourseModal({
  studentId,
  alreadyEnrolledCourseIds,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormError(null);
    setSelectedCourseId("");
    setIsSubmitting(false);

    const fetchCourses = async () => {
      setIsLoadingCourses(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("courses")
        .select("id, name, code, description, created_at, updated_at")
        .order("name", { ascending: true });
      setCourses((data as Course[]) ?? []);
      setIsLoadingCourses(false);
    };

    fetchCourses();
  }, [isOpen]);

  function handleClose() {
    setIsSubmitting(false);
    setFormError(null);
    onClose();
  }

  if (!isOpen) return null;

  const availableCourses = courses.filter(
    (c) => !alreadyEnrolledCourseIds.includes(c.id)
  );

  const handleEnroll = async () => {
    if (!selectedCourseId) {
      setFormError("Please select a course.");
      return;
    }
    setIsSubmitting(true);
    setFormError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("enrollments").insert({
        student_id: studentId,
        course_id: selectedCourseId,
        enrolled_at: new Date().toISOString(),
      });
      if (error) {
        setFormError(error.message);
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
      onSuccess();
      handleClose();
    } catch {
      setFormError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Enroll in course"
    >
      <div
        className="bg-background rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-display text-base font-semibold text-foreground">
            Enroll in Course
          </h3>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {formError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          {isLoadingCourses ? (
            <div className="flex items-center justify-center py-8 gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading courses…
            </div>
          ) : availableCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              This student is already enrolled in all available courses.
            </p>
          ) : (
            <div className="space-y-1.5">
              <label
                htmlFor="enroll-course"
                className="block text-sm font-medium text-foreground"
              >
                Select Course <span className="text-red-500">*</span>
              </label>
              <select
                id="enroll-course"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full h-10 rounded-lg border border-border px-3 text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              >
                <option value="">Choose a course…</option>
                {availableCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} — {course.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 pb-5">
          <button
            type="button"
            onClick={handleClose}
            className="h-10 px-5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors"
          >
            Cancel
          </button>
          {!isLoadingCourses && availableCourses.length > 0 && (
            <button
              onClick={handleEnroll}
              disabled={isSubmitting || !selectedCourseId}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enrolling…
                </>
              ) : (
                "Enroll"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
