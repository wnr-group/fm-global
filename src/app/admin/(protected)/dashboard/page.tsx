// dashboard/page.tsx
// Server Component — FM Global Admin Dashboard
// Fetches stats and recent certificates from Supabase and renders the full dashboard UI.
// All interactive elements (sidebar, logout) live in AdminSidebar (client component).

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FileText,
  CalendarDays,
  CheckCircle2,
  XCircle,
  PlusCircle,
  ShieldCheck,
  List,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Certificate } from "@/types/database";

type CertificateRow = Pick<
  Certificate,
  "certificate_id" | "student_name" | "issue_date" | "status"
>;

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Auth guard (belt-and-suspenders alongside middleware)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // ── First day of current month for "this month" filter ──────────────
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // ── Parallel data fetches ────────────────────────────────────────────
  const [
    adminUserResult,
    totalResult,
    thisMonthResult,
    activeResult,
    revokedResult,
    recentResult,
  ] = await Promise.all([
    supabase
      .from("admin_users")
      .select("name")
      .eq("id", user.id)
      .single(),

    supabase
      .from("certificates")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("certificates")
      .select("*", { count: "exact", head: true })
      .gte("created_at", firstOfMonth),

    supabase
      .from("certificates")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),

    supabase
      .from("certificates")
      .select("*", { count: "exact", head: true })
      .eq("status", "revoked"),

    supabase
      .from("certificates")
      .select("certificate_id, student_name, issue_date, status")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  // ── Resolved values with safe fallbacks ─────────────────────────────
  const adminName = adminUserResult.data?.name ?? user.email ?? "Admin";
  const totalCount = totalResult.count ?? 0;
  const thisMonthCount = thisMonthResult.count ?? 0;
  const activeCount = activeResult.count ?? 0;
  const revokedCount = revokedResult.count ?? 0;
  const recentCerts: CertificateRow[] = recentResult.data ?? [];
  const fetchError = recentResult.error;

  // ── Stats card definitions ───────────────────────────────────────────
  const stats = [
    {
      label: "Total Certificates",
      value: totalCount,
      icon: FileText,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Issued This Month",
      value: thisMonthCount,
      icon: CalendarDays,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Certificates",
      value: activeCount,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Revoked Certificates",
      value: revokedCount,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* ── Welcome ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="font-display text-3xl text-foreground mb-1">
          Welcome back, {adminName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s an overview of your certificates.
        </p>
      </div>

      {/* ── Stats Cards ─────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-background rounded-xl border border-border p-5 flex items-start gap-4"
          >
            <span className={`${bg} ${color} p-2.5 rounded-lg shrink-0`}>
              <Icon className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground leading-tight">{label}</p>
              <p className="font-display text-3xl text-foreground mt-0.5">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent Certificates Table ────────────────────────────────── */}
      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-display text-lg text-foreground">
            Recent Certificates
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Last 5 certificates issued
          </p>
        </div>

        {fetchError ? (
          <p className="px-6 py-8 text-sm text-red-600">
            Could not load certificates — {fetchError.message}
          </p>
        ) : recentCerts.length === 0 ? (
          <p className="px-6 py-8 text-sm text-muted-foreground text-center">
            No certificates found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Certificate ID
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Recipient
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Issue Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentCerts.map((cert) => (
                  <tr
                    key={cert.certificate_id}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-6 py-3.5 font-mono text-xs text-foreground">
                      {cert.certificate_id}
                    </td>
                    <td className="px-6 py-3.5 text-foreground">
                      {cert.student_name}
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground">
                      {new Date(cert.issue_date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-3.5">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Quick Actions ────────────────────────────────────────────── */}
      <div>
        <h2 className="font-display text-lg text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/certificates/new"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Issue New Certificate
          </Link>
          <Link
            href="/admin/verify"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-border bg-background text-foreground text-sm font-medium hover:bg-secondary/40 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            Verify a Certificate
          </Link>
          <Link
            href="/admin/certificates"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-border bg-background text-foreground text-sm font-medium hover:bg-secondary/40 transition-colors"
          >
            <List className="w-4 h-4" />
            View All Certificates
          </Link>
        </div>
      </div>
    </div>
  );
}
