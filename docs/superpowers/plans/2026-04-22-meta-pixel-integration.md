# Meta Pixel Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate FM Institute and FM International Meta Pixels globally, tracking PageView, Lead, ViewContent, and Contact events.

**Architecture:** One combined pixel script in `layout.tsx` initialises both pixel IDs; `analytics.ts` gains typed helpers; existing tracker functions call Meta helpers inline; `AnalyticsProvider` fires PageView on every route change.

**Tech Stack:** Next.js `next/script`, Meta Pixel base code (`fbevents.js`), TypeScript global augmentation.

---

## File Map

| File | Change |
|---|---|
| `src/app/layout.tsx` | Add pixel constants, one `<Script>` block, two `<noscript>` img fallbacks |
| `src/lib/analytics.ts` | Add `fbq` Window type, `pixel()` helper, four exported helpers, wire into existing functions |
| `src/components/providers/analytics-provider.tsx` | Import `trackMetaPageView`, call on pathname change |

---

## Task 1: Add Meta Pixel scripts to `layout.tsx`

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add pixel ID constants after the GTM_ID constant**

In `src/app/layout.tsx`, after line `const GTM_ID = ...`, add:

```ts
const META_PIXEL_INSTITUTE = "1593939001722737";
const META_PIXEL_INTERNATIONAL = "937976509097069";
```

- [ ] **Step 2: Add the pixel `<Script>` block inside `<head>`**

After the closing `/>` of the GTM `<Script>` block (around line 131), add:

```tsx
<Script
  id="meta-pixel"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_INSTITUTE}');
fbq('init','${META_PIXEL_INTERNATIONAL}');
fbq('track','PageView');
    `,
  }}
/>
```

- [ ] **Step 3: Add `<noscript>` fallback img tags inside `<body>`**

After the existing GTM `<noscript>` iframe (around line 143), add:

```tsx
<noscript>
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img
    height="1"
    width="1"
    style={{ display: "none" }}
    src={`https://www.facebook.com/tr?id=${META_PIXEL_INSTITUTE}&ev=PageView&noscript=1`}
    alt=""
  />
</noscript>
<noscript>
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img
    height="1"
    width="1"
    style={{ display: "none" }}
    src={`https://www.facebook.com/tr?id=${META_PIXEL_INTERNATIONAL}&ev=PageView&noscript=1`}
    alt=""
  />
</noscript>
```

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: load Meta Pixel (FM Institute + FM International) in layout"
```

---

## Task 2: Add `fbq` type + helpers to `analytics.ts`

**Files:**
- Modify: `src/lib/analytics.ts`

- [ ] **Step 1: Add `fbq` to the global Window type**

Replace the existing `declare global` block at the bottom of `src/lib/analytics.ts`:

```ts
declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
    fbq: (type: string, event: string, data?: Record<string, unknown>) => void;
  }
}
```

- [ ] **Step 2: Add the internal `pixel()` helper and four exported helpers**

Add a new section after the `// PDF / File Downloads` section and before the `declare global` block:

```ts
// ---------------------------------------------------------------------------
// Meta Pixel
// ---------------------------------------------------------------------------

function pixel(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", event, data);
}

export function trackMetaPageView() {
  pixel("PageView");
}

export function trackMetaLead(formName: string) {
  pixel("Lead", { content_name: formName });
}

export function trackMetaViewContent(name: string, type: string) {
  pixel("ViewContent", { content_name: name, content_type: type });
}

export function trackMetaContact(method: string) {
  pixel("Contact", { contact_method: method });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/analytics.ts
git commit -m "feat: add Meta Pixel helpers to analytics.ts"
```

---

## Task 3: Wire Meta Pixel events into existing tracker functions

**Files:**
- Modify: `src/lib/analytics.ts`

- [ ] **Step 1: Wire `trackMetaLead` into `trackFormSuccess`**

Replace the existing `trackFormSuccess` function:

```ts
export function trackFormSuccess(formName: string) {
  push({ event: "form_success", form_name: formName });
  trackMetaLead(formName);
}
```

- [ ] **Step 2: Wire `trackMetaViewContent` into `trackJobView`**

Replace the existing `trackJobView` function:

```ts
export function trackJobView(jobId: string, jobTitle: string, company: string) {
  push({ event: "job_view", job_id: jobId, job_title: jobTitle, company });
  trackMetaViewContent(jobTitle, "job");
}
```

- [ ] **Step 3: Wire `trackMetaViewContent` into `trackCourseClick`**

Replace the existing `trackCourseClick` function:

```ts
export function trackCourseClick(courseId: string, courseTitle: string) {
  push({ event: "course_click", course_id: courseId, course_title: courseTitle });
  trackMetaViewContent(courseTitle, "course");
}
```

- [ ] **Step 4: Wire `trackMetaContact` into `trackContactClick`**

Replace the existing `trackContactClick` function (email is excluded — only phone and WhatsApp carry strong purchase-intent signals):

```ts
export function trackContactClick(
  type: "email" | "phone" | "whatsapp",
  value: string,
  page: string
) {
  push({ event: "contact_click", contact_type: type, contact_value: value, page });
  if (type !== "email") {
    trackMetaContact(type);
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics.ts
git commit -m "feat: wire Meta Pixel events into existing analytics functions"
```

---

## Task 4: Fire PageView on route change in `AnalyticsProvider`

**Files:**
- Modify: `src/components/providers/analytics-provider.tsx`

- [ ] **Step 1: Import `trackMetaPageView`**

Replace the existing import from `@/lib/analytics`:

```ts
import {
  trackScrollDepth,
  trackContactClick,
  trackSocialClick,
  trackFileDownload,
  trackMetaPageView,
} from "@/lib/analytics";
```

- [ ] **Step 2: Call `trackMetaPageView()` on pathname change**

Replace the existing pathname `useEffect`:

```ts
useEffect(() => {
  firedRef.current = new Set();
  trackMetaPageView();
}, [pathname]);
```

- [ ] **Step 3: Commit**

```bash
git add src/components/providers/analytics-provider.tsx
git commit -m "feat: fire Meta Pixel PageView on every route change"
```

---

## Task 5: Verify + push

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no new errors (pre-existing errors from `@react-pdf/renderer` and `papaparse` are unrelated and can be ignored).

- [ ] **Step 2: Start dev server and open browser console**

```bash
npm run dev
```

Open `http://localhost:3001` and in the browser console run:

```js
window.fbq
```

Expected: a function (not `undefined`). This confirms the pixel script loaded.

- [ ] **Step 3: Verify both pixels are initialised**

In the browser console run:

```js
window._fbq.getState().pixels.map(p => p.id)
```

Expected: `["1593939001722737", "937976509097069"]`

- [ ] **Step 4: Push branch**

```bash
git push -u origin feat/meta-pixel-integration
```
