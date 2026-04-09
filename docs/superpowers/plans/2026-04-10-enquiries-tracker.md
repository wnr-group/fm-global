# Enquiries Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full enquiries tracking system — DB table, edge function saves, admin list page with search/filter/date range, and a slide-in detail panel that marks rows read on open.

**Architecture:** Single `enquiries` Supabase table stores both contact and partner form submissions. Edge functions insert before emailing. Admin page is a server component (fetches + filters via URL params) rendering an `EnquiriesClient` client component (table, filters, detail drawer, optimistic read-marking via PATCH route).

**Tech Stack:** Next.js 15 App Router, Supabase (postgres + RLS + service role), Tailwind CSS, Lucide icons, existing admin patterns (same as Students page).

---

## File Map

| Action | File |
|---|---|
| Create | `supabase/migrations/20260410000000_recreate_enquiries_table.sql` |
| Modify | `src/types/database.ts` — replace `enquiries` type |
| Modify | `supabase/functions/send-contact-email/index.ts` — insert before email |
| Modify | `supabase/functions/send-partner-inquiry/index.ts` — insert before email |
| Create | `src/app/api/enquiries/[id]/read/route.ts` — PATCH mark-read |
| Create | `src/app/admin/(protected)/enquiries/page.tsx` — server component |
| Create | `src/components/admin/EnquiriesClient.tsx` — full client UI |
| Modify | `src/components/admin/AdminSidebar.tsx` — add Enquiries nav item |

---

## Task 1: DB Migration — recreate enquiries table

**Files:**
- Create: `supabase/migrations/20260410000000_recreate_enquiries_table.sql`

- [ ] **Step 1: Create the migration file**

```sql
-- supabase/migrations/20260410000000_recreate_enquiries_table.sql

-- Drop old enquiries table (old schema: source, status columns — not what we need)
drop table if exists enquiries cascade;

-- Create new enquiries table
create table enquiries (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('contact', 'partner')),
  name        text not null,
  company     text,
  email       text not null,
  phone       text,
  country     text,
  sector      text,
  program     text,
  message     text,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Index for common query patterns
create index enquiries_created_at_idx on enquiries (created_at desc);
create index enquiries_read_idx on enquiries (read);
create index enquiries_type_idx on enquiries (type);

-- RLS
alter table enquiries enable row level security;

-- Public (anon) can insert — form submissions
create policy "Public can insert enquiries"
  on enquiries for insert
  to anon
  with check (true);

-- Authenticated admins can read and update (mark read)
create policy "Authenticated can select enquiries"
  on enquiries for select
  to authenticated
  using (true);

create policy "Authenticated can update enquiries"
  on enquiries for update
  to authenticated
  using (true)
  with check (true);
```

- [ ] **Step 2: Push migration to Supabase**

```bash
cd "/Users/dineshlearning/Documents/make money/fm-global/website"
supabase db push
```

Expected output: migration applied successfully, no errors.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260410000000_recreate_enquiries_table.sql
git commit -m "feat(db): recreate enquiries table with type/read/company fields"
```

---

## Task 2: Update TypeScript database types

**Files:**
- Modify: `src/types/database.ts` — replace the `enquiries` table definition (lines ~125–157)

- [ ] **Step 1: Replace the enquiries type block**

Find the existing `enquiries` block in `src/types/database.ts` (starts at `// ✅ UNCHANGED — keep as is`) and replace the entire block with:

```typescript
      enquiries: {
        Row: {
          id: string
          type: 'contact' | 'partner'
          name: string
          company: string | null
          email: string
          phone: string | null
          country: string | null
          sector: string | null
          program: string | null
          message: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          type: 'contact' | 'partner'
          name: string
          company?: string | null
          email: string
          phone?: string | null
          country?: string | null
          sector?: string | null
          program?: string | null
          message?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'contact' | 'partner'
          name?: string
          company?: string | null
          email?: string
          phone?: string | null
          country?: string | null
          sector?: string | null
          program?: string | null
          message?: string | null
          read?: boolean
          created_at?: string
        }
        Relationships: []
      }
```

- [ ] **Step 2: Type-check**

```bash
cd "/Users/dineshlearning/Documents/make money/fm-global/website"
npx tsc --noEmit --skipLibCheck 2>&1 | grep -v "papaparse\|react-pdf"
```

Expected: no errors related to enquiries.

- [ ] **Step 3: Commit**

```bash
git add src/types/database.ts
git commit -m "feat(types): update enquiries DB type to new schema"
```

---

## Task 3: Update send-contact-email edge function

**Files:**
- Modify: `supabase/functions/send-contact-email/index.ts`

- [ ] **Step 1: Replace the function body**

Replace `supabase/functions/send-contact-email/index.ts` with:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    const { name, email, phone, program, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // ── Insert into enquiries table first ──────────────────────────────
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: dbError } = await supabase.from("enquiries").insert({
      type: "contact",
      name,
      email,
      phone: phone || null,
      program: program || null,
      message,
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to save enquiry" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // ── Send email via Mailgun ─────────────────────────────────────────
    const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY");
    const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN");
    const CONTACT_EMAIL = Deno.env.get("CONTACT_EMAIL");

    const response = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`api:${MAILGUN_API_KEY}`),
        },
        body: new URLSearchParams({
          from: `Contact Form <mailgun@${MAILGUN_DOMAIN}>`,
          to: CONTACT_EMAIL!,
          "h:Reply-To": email,
          subject: `New Contact Enquiry: ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nProgram: ${program || "Not specified"}\n\nMessage:\n${message}`,
        }),
      }
    );

    if (!response.ok) {
      // Email failed but DB saved — still return success
      console.error("Mailgun error:", await response.text());
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
```

- [ ] **Step 2: Deploy the updated function**

```bash
cd "/Users/dineshlearning/Documents/make money/fm-global/website"
supabase functions deploy send-contact-email
```

Expected: `Deployed Functions on project ...: send-contact-email`

- [ ] **Step 3: Commit**

```bash
git add supabase/functions/send-contact-email/index.ts
git commit -m "feat(edge): save contact enquiry to DB before sending email"
```

---

## Task 4: Update send-partner-inquiry edge function

**Files:**
- Modify: `supabase/functions/send-partner-inquiry/index.ts`

- [ ] **Step 1: Replace the function body**

Replace `supabase/functions/send-partner-inquiry/index.ts` with:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    const { company, contact, email, phone, country, sector, message } = await req.json();

    if (!company || !contact || !email || !country) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // ── Insert into enquiries table first ──────────────────────────────
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: dbError } = await supabase.from("enquiries").insert({
      type: "partner",
      name: contact,
      company,
      email,
      phone: phone || null,
      country,
      sector: sector || null,
      message: message || null,
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to save enquiry" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // ── Send email via Mailgun ─────────────────────────────────────────
    const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY");
    const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN");
    const CONTACT_EMAIL = Deno.env.get("CONTACT_EMAIL");

    const emailBody = `
New Partner Inquiry — FM International
=======================================

Company Name:       ${company}
Contact Person:     ${contact}
Email:              ${email}
Phone:              ${phone || "Not provided"}
Country:            ${country}
Industry Sector:    ${sector || "Not specified"}

Hiring Requirements:
${message || "No message provided"}

---
Submitted via fmglobalcareers.com/partners
    `.trim();

    const response = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`api:${MAILGUN_API_KEY}`),
        },
        body: new URLSearchParams({
          from: `FM Partners Form <mailgun@${MAILGUN_DOMAIN}>`,
          to: CONTACT_EMAIL!,
          "h:Reply-To": email,
          subject: `Partner Inquiry: ${company} (${country})`,
          text: emailBody,
        }),
      }
    );

    if (!response.ok) {
      // Email failed but DB saved — still return success
      console.error("Mailgun error:", await response.text());
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
```

- [ ] **Step 2: Deploy the updated function**

```bash
cd "/Users/dineshlearning/Documents/make money/fm-global/website"
supabase functions deploy send-partner-inquiry
```

Expected: `Deployed Functions on project ...: send-partner-inquiry`

- [ ] **Step 3: Commit**

```bash
git add supabase/functions/send-partner-inquiry/index.ts
git commit -m "feat(edge): save partner enquiry to DB before sending email"
```

---

## Task 5: PATCH API route — mark enquiry as read

**Files:**
- Create: `src/app/api/enquiries/[id]/read/route.ts`

- [ ] **Step 1: Create the route file**

```typescript
// src/app/api/enquiries/[id]/read/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("enquiries")
    .update({ read: true })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 2: Type-check**

```bash
cd "/Users/dineshlearning/Documents/make money/fm-global/website"
npx tsc --noEmit --skipLibCheck 2>&1 | grep -v "papaparse\|react-pdf"
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/enquiries/[id]/read/route.ts
git commit -m "feat(api): add PATCH /api/enquiries/[id]/read route"
```

---

## Task 6: EnquiriesClient component

**Files:**
- Create: `src/components/admin/EnquiriesClient.tsx`

- [ ] **Step 1: Create the client component**

```typescript
// src/components/admin/EnquiriesClient.tsx
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
```

- [ ] **Step 2: Type-check**

```bash
cd "/Users/dineshlearning/Documents/make money/fm-global/website"
npx tsc --noEmit --skipLibCheck 2>&1 | grep -v "papaparse\|react-pdf"
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/EnquiriesClient.tsx
git commit -m "feat(admin): add EnquiriesClient table+filters+detail panel"
```

---

## Task 7: Admin enquiries server page

**Files:**
- Create: `src/app/admin/(protected)/enquiries/page.tsx`

- [ ] **Step 1: Create the server page**

```typescript
// src/app/admin/(protected)/enquiries/page.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EnquiriesClient from "@/components/admin/EnquiriesClient";

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: Promise<{
    search?: string;
    type?: string;
    from?: string;
    to?: string;
    unread?: string;
    page?: string;
  }>;
}

export default async function EnquiriesPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const type = params.type === "contact" || params.type === "partner" ? params.type : null;
  const from = params.from ?? "";
  const to = params.to ?? "";
  const unreadOnly = params.unread === "true";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const offset = (page - 1) * PAGE_SIZE;

  // Build filtered query
  let query = supabase
    .from("enquiries")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
  }
  if (type) {
    query = query.eq("type", type);
  }
  if (from) {
    query = query.gte("created_at", `${from}T00:00:00.000Z`);
  }
  if (to) {
    query = query.lte("created_at", `${to}T23:59:59.999Z`);
  }
  if (unreadOnly) {
    query = query.eq("read", false);
  }

  const { data, count, error } = await query;

  // Stat counts (unfiltered for the stats bar)
  const [unreadResult, contactResult, partnerResult] = await Promise.all([
    supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("read", false),
    supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("type", "contact"),
    supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("type", "partner"),
  ]);

  // Total unfiltered count for stats
  const { count: totalAllCount } = await supabase
    .from("enquiries")
    .select("*", { count: "exact", head: true });

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
        Loading enquiries…
      </div>
    }>
      <EnquiriesClient
        enquiries={data ?? []}
        totalCount={count ?? 0}
        unreadCount={unreadResult.count ?? 0}
        contactCount={contactResult.count ?? 0}
        partnerCount={partnerResult.count ?? 0}
        currentPage={page}
        pageSize={PAGE_SIZE}
        fetchError={error?.message ?? null}
      />
    </Suspense>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
cd "/Users/dineshlearning/Documents/make money/fm-global/website"
npx tsc --noEmit --skipLibCheck 2>&1 | grep -v "papaparse\|react-pdf"
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/(protected)/enquiries/page.tsx
git commit -m "feat(admin): add enquiries server page with search/filter/date"
```

---

## Task 8: Add Enquiries to AdminSidebar with unread badge

**Files:**
- Modify: `src/components/admin/AdminSidebar.tsx`

- [ ] **Step 1: Convert sidebar to async server component for unread count**

The current `AdminSidebar` is a client component — it can't fetch data directly. The unread badge count is best handled by making the **layout** pass it as a prop, OR by fetching it in a small server component wrapper. The simplest approach that matches existing patterns: add a `Server` wrapper component in the sidebar file that fetches the count and passes to the client sidebar.

Replace `src/components/admin/AdminSidebar.tsx` with:

```typescript
// src/components/admin/AdminSidebar.tsx
import AdminSidebarClient from "./AdminSidebarClient";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSidebar() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("enquiries")
    .select("*", { count: "exact", head: true })
    .eq("read", false);

  return <AdminSidebarClient unreadEnquiries={count ?? 0} />;
}
```

- [ ] **Step 2: Create AdminSidebarClient.tsx**

Create `src/components/admin/AdminSidebarClient.tsx` with the full sidebar UI, accepting `unreadEnquiries` prop. This is the existing `AdminSidebar.tsx` client code, plus the Enquiries nav item with badge:

```typescript
// src/components/admin/AdminSidebarClient.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  BookOpen,
  Users,
  Briefcase,
  Inbox,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AdminSidebarClientProps {
  unreadEnquiries: number;
}

export default function AdminSidebarClient({ unreadEnquiries }: AdminSidebarClientProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const NAV_LINKS = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Certificates", href: "/admin/certificates", icon: FileText },
    { label: "Verify Certificate", href: "/admin/verify", icon: ShieldCheck },
    { label: "Courses", href: "/admin/courses", icon: BookOpen },
    { label: "Students", href: "/admin/students", icon: Users },
    { label: "Job Listings", href: "/admin/jobs", icon: Briefcase },
    { label: "Enquiries", href: "/admin/enquiries", icon: Inbox, badge: unreadEnquiries > 0 ? unreadEnquiries : undefined },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-background border-b border-border flex items-center px-4 gap-3">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open sidebar"
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-display text-base font-semibold text-foreground">
          FM Global Admin
        </span>
        {unreadEnquiries > 0 && (
          <Link href="/admin/enquiries" className="ml-auto">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
              {unreadEnquiries > 99 ? "99+" : unreadEnquiries}
            </span>
          </Link>
        )}
      </header>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed top-0 left-0 z-50 h-full w-64 bg-background border-r border-border",
          "flex flex-col",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
          <Link href="/admin/dashboard" onClick={() => setOpen(false)}>
            <Image
              src="/logo-fm-global.png"
              alt="FM Global"
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_LINKS.map(({ label, href, icon: Icon, badge }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary/60 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
                ].join(" ")}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {badge !== undefined && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="shrink-0 px-3 py-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
```

- [ ] **Step 3: Type-check**

```bash
cd "/Users/dineshlearning/Documents/make money/fm-global/website"
npx tsc --noEmit --skipLibCheck 2>&1 | grep -v "papaparse\|react-pdf"
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/AdminSidebar.tsx src/components/admin/AdminSidebarClient.tsx
git commit -m "feat(admin): add Enquiries nav item with unread badge to sidebar"
```

---

## Task 9: Deploy edge functions & push migration

- [ ] **Step 1: Push DB migration**

```bash
cd "/Users/dineshlearning/Documents/make money/fm-global/website"
supabase db push
```

Expected: migration `20260410000000_recreate_enquiries_table` applied.

- [ ] **Step 2: Deploy both edge functions**

```bash
supabase functions deploy send-contact-email
supabase functions deploy send-partner-inquiry
```

Expected: both deploy successfully.

- [ ] **Step 3: Final type-check**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | grep -v "papaparse\|react-pdf"
```

Expected: no errors.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: enquiries tracker — DB, edge functions, admin page complete"
```
