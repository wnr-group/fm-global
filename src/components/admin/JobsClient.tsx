"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { JobListing } from "@/types/jobs";

const PAGE_SIZE = 10;

interface JobsClientProps {
  jobs: JobListing[];
  fetchError: string | null;
}

interface ToastState {
  type: "success" | "error";
  message: string;
}

type FilterValue = "all" | "active" | "inactive";
type SortValue = "created_desc" | "title_asc" | "company_asc";

export default function JobsClient({ jobs, fetchError }: JobsClientProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterValue>("all");
  const [sort, setSort] = useState<SortValue>("created_desc");
  const [page, setPage] = useState(1);
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<ToastState | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  function setLoading(id: string, val: boolean) {
    setLoadingIds((prev) => ({ ...prev, [id]: val }));
  }

  const filteredJobs = jobs
    .filter((j) => {
      if (filter === "active") return j.is_active;
      if (filter === "inactive") return !j.is_active;
      return true;
    })
    .sort((a, b) => {
      if (sort === "title_asc") return a.title.localeCompare(b.title);
      if (sort === "company_asc") return a.company.localeCompare(b.company);
      // created_desc (default)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(1, totalPages));
  const pagedJobs = filteredJobs.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );
  const rangeStart = filteredJobs.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, filteredJobs.length);

  function handleFilterChange(val: FilterValue) {
    setFilter(val);
    setPage(1);
  }

  function handleSortChange(val: SortValue) {
    setSort(val);
    setPage(1);
  }

  async function handleToggle(job: JobListing) {
    setLoading(job.id, true);
    const supabase = createClient();
    const { error } = await supabase
      .from("job_listings")
      .update({ is_active: !job.is_active })
      .eq("id", job.id);
    setLoading(job.id, false);
    if (error) {
      showToast("error", `Failed to update status: ${error.message}`);
    } else {
      showToast("success", `Job marked as ${!job.is_active ? "active" : "inactive"}.`);
      router.refresh();
    }
  }

  async function handleDelete(job: JobListing) {
    const confirmed = window.confirm(
      `Delete "${job.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setLoading(job.id, true);
    const supabase = createClient();

    // Delete PDF from storage if present
    if (job.pdf_url) {
      const parts = job.pdf_url.split("/job-pdfs/");
      if (parts.length === 2) {
        const storagePath = parts[1].split("?")[0]; // strip query params if any
        await supabase.storage.from("job-pdfs").remove([storagePath]);
      }
    }

    const { error } = await supabase
      .from("job_listings")
      .delete()
      .eq("id", job.id);

    setLoading(job.id, false);
    if (error) {
      showToast("error", `Failed to delete: ${error.message}`);
    } else {
      showToast("success", "Job deleted successfully.");
      router.refresh();
    }
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

      {/* Page heading */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Job Listings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage job postings and applications
          </p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Add Job
        </Link>
      </div>

      {/* Filters bar */}
      <div className="bg-background rounded-xl border border-border p-4 flex flex-wrap gap-3 items-end">
        <select
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value as FilterValue)}
          className="h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
        >
          <option value="all">All Jobs</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value as SortValue)}
          className="h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
        >
          <option value="created_desc">Created: Newest</option>
          <option value="title_asc">Title A–Z</option>
          <option value="company_asc">Company A–Z</option>
        </select>
      </div>

      {/* Count */}
      <p className="text-sm text-muted-foreground">
        {filteredJobs.length === 0
          ? "No job listings"
          : `Showing ${rangeStart}–${rangeEnd} of ${filteredJobs.length} job${filteredJobs.length !== 1 ? "s" : ""}`}
      </p>

      {/* Fetch error */}
      {fetchError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">
          Something went wrong: {fetchError}
        </div>
      )}

      {/* Empty state */}
      {!fetchError && filteredJobs.length === 0 && (
        <div className="bg-background rounded-xl border border-border px-6 py-16 flex flex-col items-center text-center gap-4">
          <span className="w-12 h-12 rounded-full bg-secondary/60 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-muted-foreground" />
          </span>
          {filter !== "all" ? (
            <>
              <p className="font-display text-xl text-foreground">
                No {filter} job listings
              </p>
              <p className="text-sm text-muted-foreground">
                Try changing the filter above.
              </p>
              <button
                onClick={() => handleFilterChange("all")}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors"
              >
                <X className="w-4 h-4" />
                Show all
              </button>
            </>
          ) : (
            <>
              <p className="font-display text-xl text-foreground">
                No job listings found
              </p>
              <p className="text-sm text-muted-foreground">
                Create your first job to get started.
              </p>
              <Link
                href="/admin/jobs/new"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Add Job
              </Link>
            </>
          )}
        </div>
      )}

      {/* Table */}
      {!fetchError && pagedJobs.length > 0 && (
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  {["Title", "Company", "Location", "PDF", "Status", "Created"].map((h) => (
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
                {pagedJobs.map((job) => {
                  const isBusy = loadingIds[job.id] === true;
                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-secondary/20 transition-colors"
                    >
                      <td className="px-4 py-3.5 font-medium text-foreground max-w-[200px] truncate">
                        {job.title}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                        {job.company}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                        {job.location}
                      </td>
                      <td className="px-4 py-3.5">
                        {job.pdf_url ? (
                          <span
                            title={job.pdf_filename ?? "PDF attached"}
                            className="inline-flex items-center gap-1 text-green-700"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">PDF</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={[
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            job.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600",
                          ].join(" ")}
                        >
                          {job.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                        {new Date(job.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/admin/jobs/${job.id}/edit`}
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            Edit
                          </Link>
                          <span className="text-border select-none">|</span>
                          <button
                            onClick={() => handleToggle(job)}
                            disabled={isBusy}
                            className="text-xs font-medium text-foreground hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {job.is_active ? "Deactivate" : "Activate"}
                          </button>
                          <span className="text-border select-none">|</span>
                          <button
                            onClick={() => handleDelete(job)}
                            disabled={isBusy}
                            className="text-xs font-medium text-red-600 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {safePage} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
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
