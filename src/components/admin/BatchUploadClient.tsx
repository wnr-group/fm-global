// BatchUploadClient.tsx
// Client Component — full CSV batch upload flow for FM Global certificates.
// Features:
//   • CSV template download (no backend)
//   • Drag-and-drop + file picker upload (accepts .csv only)
//   • papaparse CSV parsing with header normalisation and whitespace trimming
//   • Per-row validation (required fields, email format, date format, lectures_count)
//   • Preview table with inline validation status
//   • Summary bar (total rows, error count)
//   • Batch Supabase insert with loading state
//   • Success toast → redirect, or partial-failure summary + error CSV download
// Matches exact toast, card, table, modal styles of all other admin components.

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Papa from "papaparse";
import {
  ArrowLeft,
  Upload,
  FileText,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  TriangleAlert,
  FileDown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ParsedRow {
  student_name: string;
  student_email: string;
  course_name: string;
  course_description: string;
  instructor_name: string;
  duration: string;
  lectures_count: string;
  issue_date: string;
  reference_number: string;
}

interface ValidatedRow extends ParsedRow {
  rowIndex: number;
  errors: string[];
}

interface ImportFailure {
  row: ValidatedRow;
  error: string;
}

interface ImportResult {
  succeeded: number;
  failed: ImportFailure[];
}

/** Per-row DB insert result tracked after the import loop completes. */
type RowImportStatus = { ok: true } | { ok: false; error: string };

interface ToastState {
  type: "success" | "error";
  message: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CSV_HEADERS = [
  "student_name",
  "student_email",
  "course_name",
  "course_description",
  "instructor_name",
  "duration",
  "lectures_count",
  "issue_date",
  "reference_number",
] as const;

const CSV_TEMPLATE_CONTENT =
  CSV_HEADERS.join(",") +
  "\n" +
  "Rahul Sharma,rahul@example.com,Safety & Compliance Training,Introduction to workplace safety,Dr. Arjun Mehta,40 hours,12,2026-01-15,REF-2026-001\n";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// ── CSV helpers ───────────────────────────────────────────────────────────────

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadBlob(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Convert raw Supabase error messages into readable user-facing strings. */
function parseSupabaseError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("duplicate") || lower.includes("unique")) {
    if (lower.includes("reference_number")) return "Duplicate reference number";
    if (lower.includes("certificate_id")) return "Duplicate certificate ID";
    return "Duplicate value — row already exists";
  }
  if (lower.includes("violates")) return "Database constraint violation";
  if (lower.includes("not-null") || lower.includes("null value"))
    return "A required field is missing";
  return message || "Failed to insert row";
}

// ── Validation ────────────────────────────────────────────────────────────────

function validateRow(raw: Record<string, string>, rowIndex: number): ValidatedRow {
  // Normalise keys: trim + lowercase so headers like " Student_Name " still map
  const get = (key: string): string => {
    const found = Object.keys(raw).find(
      (k) => k.trim().toLowerCase().replace(/\s+/g, "_") === key
    );
    return found !== undefined ? (raw[found] ?? "").trim() : "";
  };

  const row: ParsedRow = {
    student_name: get("student_name"),
    student_email: get("student_email"),
    course_name: get("course_name"),
    course_description: get("course_description"),
    instructor_name: get("instructor_name"),
    duration: get("duration"),
    lectures_count: get("lectures_count"),
    issue_date: get("issue_date"),
    reference_number: get("reference_number"),
  };

  const errors: string[] = [];

  if (!row.student_name) {
    errors.push("student_name is required");
  } else if (row.student_name.length < 2) {
    errors.push("student_name must be at least 2 characters");
  }

  if (row.student_email && !EMAIL_REGEX.test(row.student_email)) {
    errors.push("student_email is not a valid email address");
  }

  if (!row.course_name) {
    errors.push("course_name is required");
  } else if (row.course_name.length < 2) {
    errors.push("course_name must be at least 2 characters");
  }

  if (!row.instructor_name) {
    errors.push("instructor_name is required");
  } else if (row.instructor_name.length < 2) {
    errors.push("instructor_name must be at least 2 characters");
  }

  if (!row.duration) {
    errors.push("duration is required");
  }

  if (!row.issue_date) {
    errors.push("issue_date is required");
  } else if (!DATE_REGEX.test(row.issue_date)) {
    errors.push("issue_date must be in YYYY-MM-DD format");
  } else if (isNaN(Date.parse(row.issue_date))) {
    errors.push("issue_date is not a valid date");
  }

  if (row.lectures_count !== "") {
    const n = Number(row.lectures_count);
    if (!Number.isInteger(n) || n <= 0) {
      errors.push("lectures_count must be a positive whole number if provided");
    }
  }

  return { ...row, rowIndex, errors };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BatchUploadClient() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rows, setRows] = useState<ValidatedRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  // Per-row DB result — populated after import; drives status badges in the table
  const [rowImportStatus, setRowImportStatus] = useState<Map<number, RowImportStatus>>(new Map());

  // Auto-dismiss toast after 4 seconds — same pattern as all admin components
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const errorCount = rows.filter((r) => r.errors.length > 0).length;
  const overLimit = rows.length > 100;
  const canImport =
    rows.length > 0 && errorCount === 0 && !overLimit && !isImporting;

  // ── File processing ───────────────────────────────────────────────

  const processFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setToast({ type: "error", message: "Only .csv files are accepted." });
      return;
    }

    setFileName(file.name);
    setRows([]);
    setParseError(null);
    setImportResult(null);
    setRowImportStatus(new Map());

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        if (results.errors.length > 0 && results.data.length === 0) {
          setParseError(
            `CSV parse error: ${results.errors[0]?.message ?? "Unknown error"}`
          );
          return;
        }
        if (results.data.length === 0) {
          setParseError("The CSV file is empty — no data rows found.");
          return;
        }
        if (results.data.length > 100) {
          setParseError(
            `CSV contains ${results.data.length} rows — maximum allowed is 100. Split the file and re-upload.`
          );
          return;
        }
        const validated = results.data.map((raw, i) =>
          validateRow(raw, i + 1)
        );
        setRows(validated);
      },
      error(err) {
        setParseError(`Failed to parse file: ${err.message}`);
      },
    });
  }, []);

  // ── Drag & Drop ───────────────────────────────────────────────────

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset so the same file can be re-selected
    e.target.value = "";
  };

  // ── Template download ─────────────────────────────────────────────

  const handleTemplateDownload = () => {
    downloadBlob(
      CSV_TEMPLATE_CONTENT,
      "fm-global-certificates-template.csv",
      "text/csv;charset=utf-8;"
    );
  };

  // ── Import ────────────────────────────────────────────────────────
  // Single atomic batch insert. Supabase does not return per-row errors
  // for a standard batch — on failure the entire batch is rolled back
  // and all rows are attributed as failed.

  const handleImport = async () => {
    if (!canImport) return;

    setIsImporting(true);
    setImportResult(null);
    setRowImportStatus(new Map());

    const supabase = createClient();
    const insertRows = rows.map((row) => ({
      student_name: row.student_name,
      student_email: row.student_email || null,
      course_name: row.course_name,
      course_description: row.course_description || null,
      instructor_name: row.instructor_name,
      duration: row.duration,
      lectures_count:
        row.lectures_count !== "" ? parseInt(row.lectures_count, 10) : null,
      issue_date: row.issue_date,
      reference_number: row.reference_number || null,
      status: "active" as const,
    }));

    try {
      const { error } = await supabase.from("certificates").insert(insertRows);

      if (!error) {
        // All rows inserted successfully
        const statusMap = new Map<number, RowImportStatus>();
        rows.forEach((r) => statusMap.set(r.rowIndex, { ok: true }));
        setRowImportStatus(statusMap);
        setToast({
          type: "success",
          message: `${rows.length} certificate${
            rows.length === 1 ? "" : "s"
          } imported successfully!`,
        });
        setTimeout(() => router.push("/admin/certificates"), 1200);
        return;
      }

      // Batch failed — all rows rolled back
      const msg = parseSupabaseError(error.message);
      const statusMap = new Map<number, RowImportStatus>();
      rows.forEach((r) => statusMap.set(r.rowIndex, { ok: false, error: msg }));
      setRowImportStatus(statusMap);
      const failures: ImportFailure[] = rows.map((r) => ({ row: r, error: msg }));
      setImportResult({ succeeded: 0, failed: failures });
      setToast({
        type: "error",
        message: `Import failed — ${failures.length} row${
          failures.length === 1 ? "" : "s"
        } could not be inserted.`,
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      const statusMap = new Map<number, RowImportStatus>();
      rows.forEach((r) => statusMap.set(r.rowIndex, { ok: false, error: msg }));
      setRowImportStatus(statusMap);
      const failures: ImportFailure[] = rows.map((r) => ({ row: r, error: msg }));
      setImportResult({ succeeded: 0, failed: failures });
      setToast({ type: "error", message: msg });
    } finally {
      setIsImporting(false);
    }
  };

  // ── Error report download ─────────────────────────────────────────

  const handleErrorReportDownload = () => {
    if (!importResult || importResult.failed.length === 0) return;
    const headers = [...CSV_HEADERS, "error_message"];
    const lines = [
      headers.join(","),
      ...importResult.failed.map((f) =>
        [
          ...CSV_HEADERS.map((h) => csvEscape(f.row[h])),
          csvEscape(f.error),
        ].join(",")
      ),
    ];
    downloadBlob(
      lines.join("\n"),
      "import-errors.csv",
      "text/csv;charset=utf-8;"
    );
  };

  // ── Render ────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Toast ────────────────────────────────────────────────────── */}
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

      {/* ── Page content ─────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <Link
              href="/admin/certificates"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Certificates
            </Link>
            <h1 className="font-display text-3xl text-foreground">
              Batch Upload
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Import multiple certificates at once via a CSV file.
            </p>
          </div>

          {/* Template download */}
          <button
            type="button"
            onClick={handleTemplateDownload}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            Download CSV Template
          </button>
        </div>

        {/* ── Upload zone ───────────────────────────────────────────── */}
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          <div className="px-6 py-3.5 border-b border-border bg-secondary/20">
            <h2 className="text-sm font-semibold text-foreground">
              Upload CSV File
            </h2>
          </div>
          <div className="p-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={[
                "flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-secondary/10",
              ].join(" ")}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              aria-label="Upload CSV file"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <div className="p-3 rounded-full bg-secondary/40">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              {fileName ? (
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FileText className="w-4 h-4 text-primary" />
                  {fileName}
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-foreground">
                    Drag &amp; drop your CSV here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    or click to browse — .csv files only
                  </p>
                </>
              )}
              {fileName && (
                <p className="text-xs text-muted-foreground">
                  Click to replace file
                </p>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
              aria-label="CSV file input"
            />

            {/* Parse error */}
            {parseError && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {parseError}
              </div>
            )}
          </div>
        </div>

        {/* ── Preview table (shown after successful parse) ───────────── */}
        {rows.length > 0 && (
          <div className="bg-background rounded-xl border border-border overflow-hidden">
            {/* Card header: summary bar */}
            <div className="px-6 py-3.5 border-b border-border bg-secondary/20 flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-sm font-semibold text-foreground">
                Preview
              </h2>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">
                  {rows.length} row{rows.length === 1 ? "" : "s"} total
                </span>
                {errorCount > 0 ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                    <TriangleAlert className="w-3 h-3" />
                    {errorCount} error{errorCount === 1 ? "" : "s"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    All rows valid
                  </span>
                )}
              </div>
            </div>

            {/* Validation error banner (pre-import only) */}
            {errorCount > 0 && rowImportStatus.size === 0 && (
              <div className="px-6 py-3 bg-red-50 border-b border-red-200 flex items-center gap-2 text-sm text-red-700">
                <TriangleAlert className="w-4 h-4 shrink-0" />
                Fix the errors below before importing.
              </div>
            )}

            {/* Scrollable table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border bg-secondary/10">
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">
                      #
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">
                      Student Name
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">
                      Student Email
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">
                      Course Name
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">
                      Instructor
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">
                      Lectures
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">
                      Issue Date
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">
                      Ref #
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row) => {
                    const isInvalid = row.errors.length > 0;
                    const dbStatus = rowImportStatus.get(row.rowIndex);

                    // Row background: DB result takes precedence over validation colour
                    const rowBg = dbStatus
                      ? dbStatus.ok
                        ? "bg-green-50/60"
                        : "bg-red-50/60"
                      : isInvalid
                      ? "bg-red-50/60"
                      : undefined;

                    return (
                      <tr key={row.rowIndex} className={rowBg}>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {row.rowIndex}
                        </td>
                        <RowCell value={row.student_name} invalid={!dbStatus && isInvalid && !row.student_name} />
                        <RowCell value={row.student_email} invalid={!dbStatus && isInvalid && !!row.student_email && !EMAIL_REGEX.test(row.student_email)} />
                        <RowCell value={row.course_name} invalid={!dbStatus && isInvalid && !row.course_name} />
                        <RowCell value={row.instructor_name} invalid={!dbStatus && isInvalid && !row.instructor_name} />
                        <RowCell value={row.duration} invalid={!dbStatus && isInvalid && !row.duration} />
                        <RowCell value={row.lectures_count || "—"} />
                        <RowCell
                          value={row.issue_date}
                          invalid={
                            !dbStatus &&
                            isInvalid &&
                            (!row.issue_date ||
                              !DATE_REGEX.test(row.issue_date) ||
                              isNaN(Date.parse(row.issue_date)))
                          }
                        />
                        <RowCell value={row.reference_number || "—"} />
                        {/* Status column — shows DB result after import, validation badge before */}
                        <td className="px-4 py-3 whitespace-nowrap align-top">
                          {dbStatus ? (
                            dbStatus.ok ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                <CheckCircle2 className="w-3 h-3" />
                                Imported
                              </span>
                            ) : (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                                  <AlertCircle className="w-3 h-3" />
                                  DB Error
                                </span>
                                <p className="text-xs text-red-600 max-w-[200px] whitespace-normal">
                                  {dbStatus.error}
                                </p>
                              </div>
                            )
                          ) : isInvalid ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                                <AlertCircle className="w-3 h-3" />
                                Invalid
                              </span>
                              <ul className="mt-1 space-y-0.5">
                                {row.errors.map((e, i) => (
                                  <li key={i} className="text-xs text-red-600">
                                    {e}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              Valid
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Import result summary (partial / full failure) ─────────── */}
        {importResult && (
          <div
            className={[
              "bg-background rounded-xl overflow-hidden border",
              importResult.succeeded > 0
                ? "border-amber-200"
                : "border-red-200",
            ].join(" ")}
          >
            <div
              className={[
                "px-6 py-3.5 border-b flex items-center justify-between gap-4 flex-wrap",
                importResult.succeeded > 0
                  ? "bg-amber-50 border-amber-200"
                  : "bg-red-50 border-red-200",
              ].join(" ")}
            >
              <div
                className={[
                  "flex items-center gap-2 text-sm font-semibold",
                  importResult.succeeded > 0 ? "text-amber-700" : "text-red-700",
                ].join(" ")}
              >
                <TriangleAlert className="w-4 h-4" />
                {importResult.succeeded > 0
                  ? "Import partially completed"
                  : "Import failed"}
              </div>
              <button
                type="button"
                onClick={handleErrorReportDownload}
                className={[
                  "inline-flex items-center gap-2 h-8 px-4 rounded-lg border text-xs font-medium transition-colors",
                  importResult.succeeded > 0
                    ? "border-amber-300 text-amber-700 hover:bg-amber-100"
                    : "border-red-300 text-red-700 hover:bg-red-100",
                ].join(" ")}
              >
                <FileDown className="w-3.5 h-3.5" />
                Download Error Report
              </button>
            </div>
            <div className="px-6 py-4 text-sm text-muted-foreground space-y-1">
              {importResult.succeeded > 0 && (
                <p>
                  <span className="font-medium text-green-700">
                    {importResult.succeeded} certificate{importResult.succeeded === 1 ? "" : "s"} imported successfully.
                  </span>
                </p>
              )}
              <p>
                <span className="font-medium text-red-700">
                  {importResult.failed.length} row{importResult.failed.length === 1 ? "" : "s"} failed
                </span>
                {" — download the error report to review and fix them."}
              </p>
            </div>
          </div>
        )}

        {/* ── Bottom action bar ──────────────────────────────────────── */}
        {rows.length > 0 && (
          <div className="flex items-center justify-between gap-3 flex-wrap pb-6">
            <button
              type="button"
              onClick={() => {
                setRows([]);
                setFileName(null);
                setParseError(null);
                setImportResult(null);
                setRowImportStatus(new Map());
              }}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear &amp; Start Over
            </button>

            <div className="flex items-center gap-3">
              {errorCount > 0 && (
                <p className="text-xs text-red-600 font-medium">
                  Fix {errorCount} error{errorCount === 1 ? "" : "s"} before importing
                </p>
              )}
              <button
                type="button"
                onClick={handleImport}
                disabled={!canImport}
                className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Importing…
                  </>
                ) : (
                  `Import ${rows.length} Certificate${rows.length === 1 ? "" : "s"}`
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Small helper sub-component ────────────────────────────────────────────────

function RowCell({
  value,
  invalid = false,
}: {
  value: string;
  invalid?: boolean;
}) {
  return (
    <td
      className={[
        "px-4 py-3 text-sm whitespace-nowrap max-w-[160px] truncate align-top",
        invalid ? "text-red-700 font-medium" : "text-foreground",
      ].join(" ")}
      title={value}
    >
      {value}
    </td>
  );
}
