// CertificatesClient.tsx
// Client Component — handles all interactivity for the /admin/certificates page.
// Receives pre-fetched, paginated data from the server component as props.
// Manages: search (300ms debounce via URL params), status/date filters,
// bulk checkbox selection, CSV export of selected rows, and pagination.
// URL search params are the single source of truth for all filter state.

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  FileText,
} from "lucide-react";
import type { Certificate } from "@/types/database";

// ── Props ──────────────────────────────────────────────────────────────────────
interface CertificatesClientProps {
  certificates: Certificate[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  fetchError: string | null;
}

// ── CSV helpers ────────────────────────────────────────────────────────────────

function csvEscape(value: string | number | boolean | null | undefined): string {
  const str = value == null ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function exportToCSV(rows: Certificate[]): void {
  const headers: (keyof Certificate)[] = [
    "certificate_id",
    "student_name",
    "student_email",
    "course_name",
    "course_description",
    "instructor_name",
    "duration",
    "lectures_count",
    "issue_date",
    "status",
    "reference_number",
    "created_at",
    "updated_at",
    "id",
  ];

  const csvLines = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => csvEscape(row[h] as string | number | null)).join(",")
    ),
  ];

  const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const today = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `certificates-export-${today}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function CertificatesClient({
  certificates,
  totalCount,
  currentPage,
  pageSize,
  fetchError,
}: CertificatesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read current filter values from URL
  const urlSearch = searchParams.get("search") ?? "";
  const urlStatus = searchParams.get("status") ?? "";
  const urlDateFrom = searchParams.get("dateFrom") ?? "";
  const urlDateTo = searchParams.get("dateTo") ?? "";

  // Local controlled input value — synced from URL, debounced writes back to URL
  const [inputValue, setInputValue] = useState(urlSearch);
  useEffect(() => { setInputValue(urlSearch); }, [urlSearch]);

  // Bulk row selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Clear selection on filter/page change
  useEffect(() => {
    setSelectedIds(new Set());
  }, [currentPage, urlSearch, urlStatus, urlDateFrom, urlDateTo]);

  // ── Derived values ─────────────────────────────────────────────────
  const hasFilters = Boolean(urlSearch || urlStatus || urlDateFrom || urlDateTo);
  const totalPages = Math.ceil(totalCount / pageSize);
  const rangeStart = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalCount);
  const allVisibleIds = certificates.map((c) => c.id);
  const allSelected =
    allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.has(id));
  const someSelected = selectedIds.size > 0;

  // ── URL param helpers ──────────────────────────────────────────────
  function updateParams(updates: Record<string, string | null>) {
    const p = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === "") p.delete(k);
      else p.set(k, v);
    });
    router.push(`/admin/certificates?${p.toString()}`);
  }

  function clearFilters() {
    router.push("/admin/certificates");
  }

  // ── Debounced search ───────────────────────────────────────────────
  // onChange only updates local state. The useEffect below watches
  // inputValue and pushes to URL params after 300ms of no changes.
  // The cleanup clears the pending timeout on every re-run, so rapid
  // keystrokes never fire a navigation until the user pauses.

  function handleSearchChange(value: string) {
    setInputValue(value);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateParams({ search: inputValue || null, page: null });
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  // ── Checkbox helpers ───────────────────────────────────────────────
  function toggleAll() {
    setSelectedIds(allSelected ? new Set() : new Set(allVisibleIds));
  }

  function toggleRow(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Page heading */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Certificates</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and export issued certificates
          </p>
        </div>
        <Link
          href="/admin/certificates/new"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Issue New
        </Link>
      </div>

      {/* Filters bar */}
      <div className="bg-background rounded-xl border border-border p-4 flex flex-wrap gap-3 items-end">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by ID, name, course…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
          />
        </div>

        {/* Status filter */}
        <select
          value={urlStatus}
          onChange={(e) =>
            updateParams({ status: e.target.value || null, page: null })
          }
          className="h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="revoked">Revoked</option>
        </select>

        {/* Date from */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground whitespace-nowrap">From</label>
          <input
            type="date"
            value={urlDateFrom}
            onChange={(e) =>
              updateParams({ dateFrom: e.target.value || null, page: null })
            }
            className="h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
          />
        </div>

        {/* Date to */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground whitespace-nowrap">To</label>
          <input
            type="date"
            value={urlDateTo}
            onChange={(e) =>
              updateParams({ dateTo: e.target.value || null, page: null })
            }
            className="h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
          />
        </div>

        {/* Clear button */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Toolbar: count + export */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground">
          {totalCount === 0
            ? "No certificates"
            : `Showing ${rangeStart}–${rangeEnd} of ${totalCount} certificate${
                totalCount !== 1 ? "s" : ""
              }`}
          {someSelected && (
            <span className="ml-2 text-foreground font-medium">
              ({selectedIds.size} selected)
            </span>
          )}
        </p>

        <button
          onClick={() =>
            exportToCSV(certificates.filter((c) => selectedIds.has(c.id)))
          }
          disabled={!someSelected}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export Selected
        </button>
      </div>

      {/* Error state */}
      {fetchError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">
          Something went wrong while loading certificates: {fetchError}
        </div>
      )}

      {/* Empty states */}
      {!fetchError && certificates.length === 0 && (
        <div className="bg-background rounded-xl border border-border px-6 py-16 flex flex-col items-center text-center gap-4">
          <span className="w-12 h-12 rounded-full bg-secondary/60 flex items-center justify-center">
            <FileText className="w-6 h-6 text-muted-foreground" />
          </span>
          {hasFilters ? (
            <>
              <p className="font-display text-xl text-foreground">
                No certificates match your search
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting or clearing your filters.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear filters
              </button>
            </>
          ) : (
            <>
              <p className="font-display text-xl text-foreground">
                No certificates found
              </p>
              <p className="text-sm text-muted-foreground">
                Get started by issuing the first certificate.
              </p>
              <Link
                href="/admin/certificates/new"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Add Certificate
              </Link>
            </>
          )}
        </div>
      )}

      {/* Table */}
      {!fetchError && certificates.length > 0 && (
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      aria-label="Select all"
                      className="w-4 h-4 rounded border-border accent-primary"
                    />
                  </th>
                  {[
                    "Certificate ID",
                    "Student Name",
                    "Course Name",
                    "Issue Date",
                    "Status",
                  ].map((h) => (
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
                {certificates.map((cert) => (
                  <tr
                    key={cert.id}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(cert.id)}
                        onChange={() => toggleRow(cert.id)}
                        aria-label={`Select ${cert.certificate_id}`}
                        className="w-4 h-4 rounded border-border accent-primary"
                      />
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-foreground whitespace-nowrap">
                      {cert.certificate_id}
                    </td>
                    <td className="px-4 py-3.5 text-foreground">
                      {cert.student_name}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {cert.course_name}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                      {new Date(cert.issue_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={[
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                          cert.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700",
                        ].join(" ")}
                      >
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/admin/certificates/${cert.id}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        View
                      </Link>
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
            onClick={() =>
              updateParams({ page: String(currentPage - 1) })
            }
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
            onClick={() =>
              updateParams({ page: String(currentPage + 1) })
            }
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
