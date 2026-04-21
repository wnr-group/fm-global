# Meta Pixel Integration — Design Spec
**Date:** 2026-04-22
**Branch:** feat/meta-pixel-integration (to be created from main)

---

## Overview

Integrate two Meta (Facebook) Pixel IDs into the FM Global Careers website. Both pixels fire on every page. Events tracked: PageView, Lead, ViewContent, Contact.

**Pixel IDs**
| Sub-brand | Pixel ID |
|---|---|
| FM Institute | 1593939001722737 |
| FM International | 937976509097069 |

---

## Approach

Option A — inline scripts in `layout.tsx` + extend `analytics.ts`. Consistent with existing GTM pattern. No new files or providers.

---

## Section 1 — Script loading (`src/app/layout.tsx`)

Two `<Script>` blocks added after the existing GTM script, both with `strategy="afterInteractive"`.

Each block runs the standard `fbq` base code, initialises its pixel ID, and fires the initial `PageView`. A `<noscript>` `<img>` tag is added to `<body>` for each pixel as a no-JS fallback.

```
layout.tsx <head>:
  GTM script          (existing)
  Meta Pixel FM Institute script     ← new
  Meta Pixel FM International script ← new

layout.tsx <body>:
  GTM noscript iframe  (existing)
  Meta Pixel FM Institute noscript img  ← new
  Meta Pixel FM International noscript img ← new
```

Pixel IDs stored as constants at the top of `layout.tsx`:
```ts
const META_PIXEL_INSTITUTE = "1593939001722737";
const META_PIXEL_INTERNATIONAL = "937976509097069";
```

---

## Section 2 — Helpers (`src/lib/analytics.ts`)

**Global type augmentation** — add `fbq` to the `Window` interface.

**`pixel()` internal helper** — fires an event to both pixel IDs:
```ts
function pixel(type: 'track' | 'trackCustom', event: string, data?: object) {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq(type, event, data);
}
```

Since `fbq` is initialised with both IDs in the script, a single `fbq('track', ...)` call fires to all initialised pixels simultaneously — no need to call per-ID.

**New exported helpers:**
```ts
trackMetaPageView()                           // fbq('track', 'PageView')
trackMetaLead(formName: string)               // fbq('track', 'Lead', { content_name })
trackMetaViewContent(name: string, type: string) // fbq('track', 'ViewContent', { content_name, content_type })
trackMetaContact(method: string)              // fbq('track', 'Contact', { contact_method })
```

All helpers are no-ops when `fbq` is not on `window` (SSR-safe).

---

## Section 3 — Event wiring (`src/lib/analytics.ts`)

Meta Pixel helpers called alongside existing `push()` calls inside the same functions:

| Function | Added call |
|---|---|
| `trackFormSuccess(formName)` | `trackMetaLead(formName)` |
| `trackJobView(jobId, jobTitle, company)` | `trackMetaViewContent(jobTitle, 'job')` |
| `trackCourseClick(courseId, courseTitle)` | `trackMetaViewContent(courseTitle, 'course')` |
| `trackContactClick(type, value, page)` | `trackMetaContact(type)` — only when `type === 'phone' \| 'whatsapp'` |

Email clicks (`type === 'email'`) are excluded — phone and WhatsApp carry stronger purchase-intent signals for Meta ad optimisation.

---

## Section 4 — PageView on route change (`src/components/providers/analytics-provider.tsx`)

The existing `useEffect` that resets scroll milestones on `pathname` change gets one extra line:

```ts
useEffect(() => {
  firedRef.current = new Set();
  trackMetaPageView(); // fires PageView on every client-side navigation
}, [pathname]);
```

`trackMetaPageView` is imported from `@/lib/analytics`.

---

## Files Changed

| File | Change |
|---|---|
| `src/app/layout.tsx` | Add two Meta Pixel `<Script>` blocks + noscript fallbacks |
| `src/lib/analytics.ts` | Add `fbq` type, `pixel()` helper, four exported helpers, wire into existing functions |
| `src/components/providers/analytics-provider.tsx` | Add `trackMetaPageView()` call on pathname change |

---

## Out of Scope

- GTM-based Meta Pixel tags
- Per-page pixel differentiation (both pixels fire globally)
- Environment gating (fires in all environments)
- Custom conversion events beyond the four standard ones above
