# Enquiries Tracker — Design Spec
**Date:** 2026-04-10  
**Status:** Approved

---

## Overview

Track all form submissions from the public-facing Contact page and Partners page in a single Supabase table. Display them in the admin portal with search, filtering by type and date, and read/unread status.

---

## Database

### Table: `enquiries`

```sql
create table enquiries (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('contact', 'partner')),
  name        text not null,
  company     text,           -- partner only
  email       text not null,
  phone       text,
  country     text,           -- partner only
  sector      text,           -- partner only
  program     text,           -- contact only
  message     text,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);
```

### RLS policies

- **Public (anon) can INSERT** — form submissions from the website
- **Authenticated (admin) can SELECT, UPDATE** — read-marking and viewing

---

## Edge Functions

Both existing edge functions are updated to **insert into `enquiries` before sending email**. If the DB insert fails, return an error immediately (don't send email). If email fails after a successful insert, still return success — the enquiry is saved and visible in admin.

### `send-contact-email` changes
Insert row with `type = 'contact'`, mapping: `name`, `email`, `phone`, `program`, `message`.

### `send-partner-inquiry` changes
Insert row with `type = 'partner'`, mapping: `name = contact`, `company`, `email`, `phone`, `country`, `sector`, `message`.

Both functions use the **Supabase service role key** (already available as env var) to bypass RLS on insert.

---

## Admin Portal

### Sidebar

- New nav item: **"Enquiries"** with `Inbox` icon
- Shows a red badge with unread count (fetched server-side in the layout or sidebar)
- Inserted between "Job Listings" and the existing items

### Page: `/admin/enquiries`

**Server component** (`enquiries/page.tsx`) — fetches data with search/filter/date params from URL, passes to client component.

**Client component** (`EnquiriesClient.tsx`) — handles all interactivity.

#### Stats bar (top)
Four stat chips: Total, Unread, Contact enquiries, Partner enquiries.

#### Filters row
- **Search input** — searches `name`, `email`, `company` (ilike)
- **Type toggle** — All / Contact / Partner (URL param `type`)
- **Date range** — From / To date inputs (URL params `from`, `to`)
- **Unread only** — checkbox toggle (URL param `unread=true`)

All filters update URL search params (no separate submit button — debounced search, instant for toggles).

#### Table columns
| Column | Notes |
|---|---|
| Type | Badge: blue "Contact" or orange "Partner" |
| Name | Bold if unread |
| Company | Only shown for partner rows; dash for contact |
| Email | Truncated if long |
| Date | Formatted as "10 Apr 2026" |
| Status | Red dot + "Unread" or grey "Read" |

Rows are sorted by `created_at DESC` by default.

Pagination: 20 per page, same pattern as Students page.

#### Detail panel (slide-in from right)

Clicking any row opens a detail panel — a fixed right-side drawer, not a modal. Shows all fields for that enquiry. Opening the panel **immediately marks the enquiry as read** via a PATCH call to a new API route.

Panel sections:
- Header: type badge, name, date
- Contact info: email (mailto link), phone (tel link)
- Partner-specific: company, country, sector (only shown for partner type)
- Contact-specific: program (only shown for contact type)
- Message: full text in a readable block

Closing the panel returns focus to the table. The row in the table updates to "Read" state immediately (optimistic update).

### API Route: `PATCH /api/enquiries/[id]/read`

Simple server action or route handler that sets `read = true` for the given enquiry ID. Uses the Supabase service role client. Returns `{ success: true }`.

---

## File Structure

```
supabase/
  migrations/
    YYYYMMDDHHMMSS_create_enquiries_table.sql
  functions/
    send-contact-email/index.ts       (updated)
    send-partner-inquiry/index.ts     (updated)

src/
  app/
    admin/(protected)/
      enquiries/
        page.tsx                      (server component)
    api/
      enquiries/
        [id]/
          read/
            route.ts                  (PATCH handler)
  components/
    admin/
      EnquiriesClient.tsx             (table + filters + detail panel)
```

---

## Data Flow

```
User submits form
  → Edge function inserts into enquiries table
  → Edge function sends email via Mailgun
  → Returns { success: true } to frontend

Admin opens /admin/enquiries
  → Server component fetches rows with filters
  → Client renders table with unread badges

Admin clicks a row
  → Detail panel slides in (client-side, no navigation)
  → PATCH /api/enquiries/[id]/read called immediately
  → Row updates to "Read" state optimistically
```

---

## Out of Scope

- Replying to enquiries from admin (use email client via mailto)
- Bulk mark-as-read
- Archiving / deleting enquiries
- Notifications / push alerts
