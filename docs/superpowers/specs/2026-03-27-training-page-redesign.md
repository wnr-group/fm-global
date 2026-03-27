# Training Page Redesign - Design Specification

**Date:** 2026-03-27
**Status:** Approved
**Aesthetic:** Industrial Editorial

---

## Overview

Redesign the FM Institute training page to showcase two courses (Mechanical Technician, Permit Receiver) with an Industrial/Technical editorial aesthetic. The page should create a "wow factor" through cinematic imagery, bold typography, and layered content reveal while maintaining readability for dense course content.

### Target Audience
- ITI (Mechanical / Fitter / Turner) graduates
- Diploma Mechanical holders
- Engineering students
- Freshers with no experience
- Gulf job seekers
- Arts students seeking career change

### Primary Goal
Drive enquiries for course enrollment through credibility-first messaging (stats, placement numbers, Gulf company names).

### Design Direction
**Industrial Editorial** - Magazine-style editorial layout meets industrial spec sheet. Dark cinematic sections alternating with light sections. Bold typography, generous whitespace, and premium technical manual feel.

---

## Images

Six generated images to be copied to `/public/training/`:

| Filename | Source | Use |
|----------|--------|-----|
| `hero-refinery-dusk.png` | `Gemini_Generated_Image_37euxa37euxa37eu.png` | Hero background |
| `course-mechanical-technician.png` | `Gemini_Generated_Image_vs6xedvs6xedvs6x.png` | Mechanical Technician section |
| `course-permit-receiver.png` | `Gemini_Generated_Image_m52or4m52or4m52o.png` | Permit Receiver section |
| `career-aerial-facility.png` | `Gemini_Generated_Image_z8gw8zz8gw8zz8gw.png` | CTA section background |
| `training-transformation.png` | `Gemini_Generated_Image_3oaun3oaun3oaun3.png` | Why Choose section |
| `gulf-skyline.png` | `Gemini_Generated_Image_2cs8xo2cs8xo2cs8.png` | Career Destinations section |

---

## Page Sections

### Section 1: Hero

**Layout:** Full-viewport height, refinery dusk image as background with dark gradient overlay (heavier at bottom). Content left-aligned, max-width constrained.

**Content:**
- Badge: "FM Institute - Training Division"
- H1: "Become Job-Ready for Gulf Shutdown Projects"
- Subhead: "Industry-focused training with direct placement to Kuwait, UAE, Qatar & Saudi Arabia"
- Stats row: 1500+ Trained | 3000+ Placements | 1 Month Duration
- CTA: "Enquire Now" button

**Visual Effects:**
- Subtle parallax on background image
- Stats animate/count up on page load
- Grain texture overlay for industrial feel
- Scroll indicator at bottom

---

### Section 2: Course Overview Cards

**Layout:** Light background with subtle texture. Two side-by-side cards. Clicking scrolls to detailed section.

**Content per card:**
- Course image (cropped to consistent aspect ratio)
- Course title
- Brief tagline
- Mini stats: Modules | Duration | Salary range
- "View Details" link

**Visual Effects:**
- Cards have hover lift effect
- Staggered reveal animation on scroll

---

### Section 3: Mechanical Technician (Full Detail)

**Layout:** Dark background (deep navy/charcoal). Image on RIGHT. Thin orange/amber accent line on left edge.

**Content:**

**Header:**
- Eyebrow: "COURSE 01"
- H2: "Mechanical Technician"
- Tagline: "Learn Heat Exchangers, Vessels, Tanks & Columns with Real Site Methods"

**Highlights (checkmarks):**
- 14 Modules – Complete Shutdown Training
- Online + Weekly Live Sessions
- Beginner to Advanced
- Gulf Standard (KNPC, ADNOC, Qatar Gas)
- Placement Support
- Duration: 1 Month

**Syllabus (14 modules in 2-column grid):**
1. Introduction to General Fitter
2. Gasket, Flange & Blind – Types & Usage
3. Types of Valves & Applications
4. Types of Static Equipment
5. Tools & Their Uses
6. Dismantling & Assembly Procedures
7. Alignment & Leveling Techniques
8. Heat Exchangers – Types & Maintenance
9. Vessels – Maintenance & Safety
10. Tanks – Cleaning & Repair
11. Columns – Tray & Packing Maintenance
12. Shutdown Job Roles & Daily Routine
13. Safety Rules, Do's & Don'ts
14. Real Site Examples & Revision

**What You'll Learn (skills tags):**
- Flange opening & closing
- Gasket fitting & torque method
- Heat exchanger tube bundle
- Vessel & tank entry procedures
- Column tray & packing handling
- Alignment & leveling
- Hydrotest & leak testing
- Real shutdown work sequence

**Career Opportunities:**
- Roles: General Fitter, Mechanical Helper → Fitter, Shutdown Maintenance Technician, Static Equipment Technician
- Salary: ₹30,000 – ₹90,000/month
- Countries: Kuwait, UAE, Qatar, Saudi Arabia (with flags)

**Who Can Join (tags):**
ITI | Diploma Mechanical | Engineering Students | Freshers Welcome | Arts Students

**CTA:** "Enquire Now" button

---

### Section 4: Permit Receiver (Full Detail)

**Layout:** Light background. Image on LEFT (alternating pattern). Green accent line (FM Institute color) on left edge.

**Content:**

**Header:**
- Eyebrow: "COURSE 02"
- H2: "Permit Receiver"
- Tagline: "Learn PTW System, Safety Procedures & Real Shutdown Site Practices"

**Highlights:**
- No Experience Required
- Gulf Standard (KNPC, ADNOC, Qatar Gas)
- 100% Online Training
- Gulf Shutdown Job Opportunities
- Duration: 1 Month

**Syllabus (10 modules in 2-column grid):**
1. PTW Fundamentals & Roles
2. Hazard Identification (JSA / TRA)
3. Permit Types (Hot, Cold, Confined Space, etc.)
4. Gas Testing & Monitoring
5. LOTO & Isolation
6. Confined Space Entry
7. Work at Height
8. SIMOPS & Permit Lifecycle
9. Communication & Logbook
10. Site Scenarios & Safety Case Studies

**Training Method (icon row):**
Video Lessons | Live Classes | Case Studies | Daily Assessments | Final Certificate

**Tools & Practical Exposure:**
- Real Permit Formats
- Gas Detector Basics
- LOTO Tag Understanding
- Toolbox Talk Practice
- Site Scenario Training

**Career Opportunities:**
- Roles: Permit Receiver, Safety Coordinator
- Industry: Oil & Gas / Refinery / Shutdown Projects
- Salary: ₹50,000 – ₹70,000/month (with OT)
- Countries: Kuwait, UAE, Qatar, Saudi Arabia

**Certification:**
- FM Institute Permit Receiver Certification
- Industry-Oriented Training Completion Certificate

**Interview Support (highlighted box):**
- Real Interview Questions
- Mock Interviews
- Resume Guidance
- Placement Assistance

**Who Can Join (tags):**
Diploma / Engineering | ITI Candidates | Freshers (0 Experience) | Gulf Job Seekers

**CTA:** "Enquire Now" button

---

### Section 5: Why Choose FM Institute

**Layout:** Dark background with transformation image (online → field) as contained background with overlay. Feature grid overlaid.

**Content:**

**Header:**
- Eyebrow: "WHY FM INSTITUTE"
- H2: "From Online Learning to Gulf Site Confidence"

**Features (2x3 grid with icons):**
- Real Site-Based Training
- Visual Learning (Photos & Diagrams)
- Tamil + English Explanation
- App Access (24×7 Learning)
- Weekly Tests + Trainer Support
- Certificate Provided

**Differentiators (horizontal strip):**
- Industry-standard shutdown training
- Designed for freshers (step-by-step)
- Focus on job-ready skills (not theory)
- Gulf interview preparation included

**Visual Effects:**
- Features reveal with staggered animation
- Industrial-style icons (not rounded colorful)

---

### Section 6: Career Destinations

**Layout:** Light background. Kuwait skyline image as contained element (not full-bleed). Stats bar cuts across as dark strip.

**Content:**

**Header:**
- Eyebrow: "CAREER DESTINATIONS"
- H2: "Your Gateway to Gulf Opportunities"

**Countries Grid (with flags):**
- Kuwait – KNPC Projects
- UAE – ADNOC, Dubai
- Qatar – Qatar Gas, RasGas
- Saudi Arabia – Aramco Projects

**Stats Bar (dark strip):**
- 1500+ Students Trained
- 3000+ Placements Supported
- Gulf Project Opportunities Available

**Visual Effects:**
- Skyline image has subtle parallax
- Stats animate on viewport entry

---

### Section 7: CTA Section

**Layout:** Full-width with aerial desert facility image as background. Dark overlay, centered content.

**Content:**
- Eyebrow: "START YOUR JOURNEY"
- H2: "Ready to Build Your Gulf Career?"
- Subtext: "Join 1500+ professionals who transformed their careers with FM Institute"
- CTA: Large "Enquire Now" button (white/light, prominent)
- Trust signals below button:
  - No experience required
  - Placement support included
  - Tamil + English training

**Visual Effects:**
- CTA button has subtle glow/shadow
- Grain texture overlay matching hero

---

### Section 8: Footer

Reuse existing site footer component. No changes needed.

---

## Technical Implementation Notes

### File Changes
- Replace content in `src/app/training/page.tsx`
- Add images to `public/training/` directory
- May need new CSS animations in `globals.css`

### Components to Reuse
- `ScrollReveal` and `AnimatedCounter` from existing codebase
- `Button` component
- `MobileNav` component
- Footer structure

### New Patterns Needed
- Alternating dark/light section backgrounds
- 2-column syllabus grid with numbered items
- Skills/tags display component
- Career opportunities card with roles/salary/countries
- Stats bar component

### Responsive Considerations
- Course overview cards: 2-col on desktop, stacked on mobile
- Syllabus grid: 2-col on desktop, 1-col on mobile
- Course detail sections: image + content side-by-side on desktop, stacked on mobile
- Stats row: horizontal on desktop, may need adjustment on mobile

### Animations
- Hero: parallax background, count-up stats, grain overlay
- Sections: staggered reveal on scroll entry
- Cards: hover lift effect
- Stats: count-up animation when in viewport

---

## Data Structure

```typescript
interface Course {
  id: string;
  number: string; // "01", "02"
  title: string;
  tagline: string;
  image: string;
  highlights: string[];
  syllabus: { number: string; title: string }[];
  skills: string[];
  careers: {
    roles: string[];
    salary: string;
    countries: { name: string; flag: string; companies: string }[];
  };
  whoCanJoin: string[];
  // Permit Receiver specific
  trainingMethod?: string[];
  tools?: string[];
  certification?: string[];
  interviewSupport?: string[];
}
```

---

## Success Criteria

1. Page creates immediate "wow" impression through cinematic hero
2. Users can quickly assess course fit via overview cards
3. Detailed course content is readable and well-organized
4. Clear conversion path to enquiry CTA
5. Credibility established through stats and Gulf company names
6. Works well on mobile devices
7. Maintains FM Institute brand consistency
