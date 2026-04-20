# Testimonials Redesign — Design Spec
**Date:** 2026-04-21
**Status:** Approved

## Goal
Redesign the testimonials section with a Featured + Thumbnails layout (Option B) and add it to the homepage, while keeping it on the placement page. The redesigned component replaces the current horizontal scroll strip.

## Section Placement
- **Homepage (`src/app/page.tsx`):** Between the Features grid section and the Footer — "proof before close" position.
- **Placement page (`src/app/placement/page.tsx`):** Remains where it is (between For Employers and CTA).

## Visual Design
- **Background:** Dark navy (`bg-foreground`) — deliberate contrast break from surrounding light sections.
- **Text:** `text-background` (white/light) on the dark background.
- **Section label:** `SUCCESS STORIES` — small caps, `text-primary`-colored accent with flanking lines.
- **Heading:** "Hear from our placed candidates"

## Layout

### Desktop (lg+)
Two-column layout:

**Left column (60%) — Featured Player**
- Portrait video at 9:16 aspect ratio, `rounded-2xl`, `overflow-hidden`
- Poster image shown before play
- Centered play/pause button overlay (white circle with icon, `backdrop-blur-sm`)
- Mute/unmute toggle in bottom-right corner (visible while playing)
- Gradient overlay at bottom: dark-to-transparent, shows "Placed Candidate" + "FM International" label in white
- When thumbnail is selected: previous video pauses, new video loads (poster shown, not autoplay)

**Right column (40%) — Thumbnail Grid**
- `grid grid-cols-2 gap-3`
- Each thumbnail: poster image at 9:16 aspect, `rounded-xl`, small centered play icon overlay
- **Active state:** `ring-2 ring-white` border
- **Hover state:** `brightness-110` lift
- Clicking a thumbnail: sets it as the featured video, scrolls to top of featured player on mobile

### Mobile (< lg)
- Featured video: full width, 9:16 aspect
- Thumbnails: horizontal scroll strip below (`flex overflow-x-auto gap-3`), each `w-24` fixed width, active has white ring
- `scrollbar-hide` applied

## Component Architecture

**File:** `src/components/placement/TestimonialsSection.tsx` (replace existing)

**Structure:**
```
TestimonialsSection (Client Component)
├── state: activeIndex (number, default 0)
├── FeaturedPlayer
│   ├── <video> ref, poster, src
│   ├── PlayPauseOverlay
│   ├── MuteToggle
│   └── BottomLabel ("Placed Candidate · FM International")
└── ThumbnailGrid
    └── ThumbnailCard × 7 (poster, active ring, click handler)
```

**Data:** Same `testimonials` array — 7 items with `src` and `poster` paths. No names needed; generic label used.

**Behaviour:**
- Default: video 1 is active/featured, all videos paused (no autoplay)
- Clicking thumbnail: sets activeIndex, resets featured video to paused state (shows poster)
- Playing featured video pauses all others on page
- Switching thumbnail while video is playing: pauses current video, loads new one (does not autoplay)

## Shared Usage
The same component is imported on both:
- `src/app/page.tsx` (homepage)
- `src/app/placement/page.tsx` (placement page)

No props needed — fully self-contained.

## Out of Scope
- Candidate names or roles (generic label only)
- Autoplay on scroll
- Any backend/CMS changes
