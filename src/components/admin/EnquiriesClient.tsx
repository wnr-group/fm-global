"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Mail,
  Phone,
  Building2,
  Globe2,
  Factory,
  BookOpen,
  MessageSquare,
  Calendar,
} from "lucide-react";
import type { Database } from "@/types/database";

type Enquiry = Database["public"]["Tables"]["enquiries"]["Row"];

interface EnquiriesClientProps {
  enquiries: Enquiry[];
  totalCount: number;
  unreadCount: number;
  contactCount: number;
  partnerCount: number;
  currentPage: number;
  pageSize: number;
  fetchError: string | null;
}

export default function EnquiriesClient({
  enquiries: initialEnquiries,
  totalCount,
  unreadCount,
  contactCount,
  partnerCount,
  currentPage,
  pageSize,
  fetchError,
}: EnquiriesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") ?? "";
  const urlType = searchParams.get("type") ?? "all";
  const urlFrom = searchParams.get("from") ?? "";
  const urlTo = searchParams.get("to") ?? "";
  const urlUnread = searchParams.get("unread") === "true";

  const [inputValue, setInputValue] = useState(urlSearch);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep local list in sync with server data
  useEffect(() => {
    setEnquiries(initialEnquiries);
  }, [initialEnquiries]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushParams({ search: inputValue, page: "1" });
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  function pushParams(updates: Record<string, string>) {
    const p = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) p.set(k, v); else p.delete(k);
    });
    router.push(`?${p.toString()}`);
  }

  async function handleRowClick(enquiry: Enquiry) {
    setSelected(enquiry);
    if (!enquiry.read) {
      // Optimistic update
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiry.id ? { ...e, read: true } : e))
      );
      await fetch(`/api/enquiries/${enquiry.id}/read`, { method: "PATCH" });
    }
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const stats = [
    { label: "Total", value: totalCount, color: "text-foreground", bg: "bg-secondary/50" },
    { label: "Unread", value: unreadCount, color: "text-red-600", bg: "bg-red-50" },
    { label: "Contact", value: contactCount, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Partner", value: partnerCount, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl text-foreground mb-1">Enquiries</h1>
        <p className="text-sm text-muted-foreground">
          All contact and partner form submissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="bg-background rounded-xl border border-border p-4 flex items-center gap-3"
          >
            <span className={`${bg} ${color} p-2 rounded-lg`}>
              <Inbox className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`font-display text-2xl ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-background rounded-xl border border-border p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search name, email, company…"
            className="w-full pl-9 pr-8 py-2 text-sm bg-secondary/40 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
          />
          {inputValue && (
            <button
              onClick={() => { setInputValue(""); pushParams({ search: "", page: "1" }); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Type toggle */}
        <div className="flex rounded-lg border border-border overflow-hidden text-sm">
          {(["all", "contact", "partner"] as const).map((t) => (
            <button
              key={t}
              onClick={() => pushParams({ type: t, page: "1" })}
              className={`px-4 py-2 capitalize transition-colors ${
                urlType === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground hover:bg-secondary/40"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Date from */}
        <div className="flex items-center gap-2 text-sm">
          <label className="text-muted-foreground text-xs">From</label>
          <input
            type="date"
            value={urlFrom}
            onChange={(e) => pushParams({ from: e.target.value, page: "1" })}
            className="py-2 px-3 text-sm bg-secondary/40 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Date to */}
        <div className="flex items-center gap-2 text-sm">
          <label className="text-muted-foreground text-xs">To</label>
          <input
            type="date"
            value={urlTo}
            onChange={(e) => pushParams({ to: e.target.value, page: "1" })}
            className="py-2 px-3 text-sm bg-secondary/40 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Unread only */}
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
          <input
            type="checkbox"
            checked={urlUnread}
            onChange={(e) => pushParams({ unread: e.target.checked ? "true" : "", page: "1" })}
            className="rounded border-border accent-primary"
          />
          Unread only
        </label>

        {/* Clear filters */}
        {(urlSearch || urlType !== "all" || urlFrom || urlTo || urlUnread) && (
          <button
            onClick={() => {
              setInputValue("");
              router.push("?");
            }}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-background rounded-xl border border-border overflow-hidden">
        {fetchError ? (
          <p className="px-6 py-8 text-sm text-red-600">Error: {fetchError}</p>
        ) : enquiries.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Inbox className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No enquiries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Company</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {enquiries.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    onClick={() => handleRowClick(enquiry)}
                    className={`cursor-pointer transition-colors hover:bg-secondary/20 ${
                      selected?.id === enquiry.id ? "bg-secondary/30" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        enquiry.type === "contact"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {enquiry.type}
                      </span>
                    </td>
                    <td className={`px-5 py-3.5 ${!enquiry.read ? "font-semibold text-foreground" : "text-foreground"}`}>
                      {enquiry.name}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">
                      {enquiry.company ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground hidden lg:table-cell max-w-[200px] truncate">
                      {enquiry.email}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                      {formatDate(enquiry.created_at)}
                    </td>
                    <td className="px-5 py-3.5">
                      {!enquiry.read ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          Unread
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                          Read
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages} — {totalCount} total
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => pushParams({ page: String(currentPage - 1) })}
                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => pushParams({ page: String(currentPage + 1) })}
                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail panel — slide-in drawer */}
      {selected && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSelected(null)}
          />
          {/* Panel */}
          <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-50 overflow-y-auto shadow-2xl animate-slide-in-right">
            <div className="p-6 space-y-6">
              {/* Panel header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mb-2 ${
                    selected.type === "contact"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {selected.type} enquiry
                  </span>
                  <h2 className="font-display text-xl text-foreground">{selected.name}</h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(selected.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="h-px bg-border" />

              {/* Contact info */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</h3>
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors group"
                >
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-4 h-4 text-primary" />
                  </span>
                  {selected.email}
                </a>
                {selected.phone && (
                  <a
                    href={`tel:${selected.phone}`}
                    className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Phone className="w-4 h-4 text-primary" />
                    </span>
                    {selected.phone}
                  </a>
                )}
              </div>

              {/* Partner-specific fields */}
              {selected.type === "partner" && (selected.company || selected.country || selected.sector) && (
                <>
                  <div className="h-px bg-border" />
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Organisation</h3>
                    {selected.company && (
                      <div className="flex items-center gap-3 text-sm text-foreground">
                        <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                        </span>
                        {selected.company}
                      </div>
                    )}
                    {selected.country && (
                      <div className="flex items-center gap-3 text-sm text-foreground">
                        <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <Globe2 className="w-4 h-4 text-muted-foreground" />
                        </span>
                        {selected.country}
                      </div>
                    )}
                    {selected.sector && (
                      <div className="flex items-center gap-3 text-sm text-foreground">
                        <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <Factory className="w-4 h-4 text-muted-foreground" />
                        </span>
                        {selected.sector}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Contact-specific: program */}
              {selected.type === "contact" && selected.program && (
                <>
                  <div className="h-px bg-border" />
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Interested In</h3>
                    <div className="flex items-center gap-3 text-sm text-foreground">
                      <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                      </span>
                      {selected.program}
                    </div>
                  </div>
                </>
              )}

              {/* Message */}
              {selected.message && (
                <>
                  <div className="h-px bg-border" />
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed bg-secondary/30 rounded-xl p-4 whitespace-pre-wrap">
                      {selected.message}
                    </p>
                  </div>
                </>
              )}

              {/* Reply CTA */}
              <div className="h-px bg-border" />
              <a
                href={`mailto:${selected.email}?subject=Re: Your enquiry`}
                className="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Reply via Email
              </a>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
