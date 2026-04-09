"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/ui/mobile-nav";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Footer } from "@/components/Footer";
import {
  ArrowRight,
  ArrowUpRight,
  Users,
  Globe2,
  BarChart3,
  Star,
  CheckCircle2,
  Building2,
  Handshake,
  Zap,
} from "lucide-react";

const partnerLogos = [
  { name: "ARAMCO", country: "Saudi Arabia" },
  { name: "ADNOC", country: "UAE" },
  { name: "Qatar Energy", country: "Qatar" },
  { name: "Kuwait Oil Co.", country: "Kuwait" },
  { name: "OXY Petroleum", country: "Oman" },
  { name: "BAPCO", country: "Bahrain" },
  { name: "Larsen & Toubro", country: "India" },
  { name: "Petrofac", country: "UAE" },
];

const benefits = [
  {
    icon: Users,
    title: "Pre-Screened Talent Pipeline",
    description:
      "Every candidate undergoes rigorous technical assessment, document verification, and skills testing before reaching you. No time wasted on unqualified applicants.",
    size: "large",
    accent: "border-l-4 border-primary",
  },
  {
    icon: Star,
    title: "Priority Matching",
    description:
      "Partners receive first-look access to each monthly cohort of graduates — before roles are published publicly.",
    size: "small",
    accent: "bg-primary text-primary-foreground",
  },
  {
    icon: BarChart3,
    title: "Placement Analytics",
    description:
      "Detailed retention data, performance tracking, and deployment reports for every FM International hire.",
    size: "small",
    accent: "",
  },
  {
    icon: Globe2,
    title: "Global Reach, Local Knowledge",
    description:
      "We handle visa processing, mobilization, document legalization, and onboarding logistics — from India to your project site anywhere in the Gulf.",
    size: "large",
    accent: "",
  },
];

const whyChoose = [
  { label: "End-to-end visa & mobilization support" },
  { label: "Industry-certified candidates" },
  { label: "Rapid deployment — 30-day average turnaround" },
  { label: "Dedicated account manager for every partner" },
  { label: "Replacement guarantee on all placements" },
  { label: "Compliance with all local labor laws" },
];

export default function PartnersPage() {
  const [formState, setFormState] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    country: "",
    sector: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setFormState((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const res = await fetch(
        `${supabaseUrl}/functions/v1/send-partner-inquiry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": supabaseAnonKey!,
            "Authorization": `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify(formState),
        }
      );

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again or email us directly.");
      }
    } catch {
      setError("Could not send your inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex flex-col overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-primary" />

        {/* Industrial grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
          }}
        />

        {/* Radial glow */}
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] rounded-full bg-white/[0.04] blur-[120px] pointer-events-none" />

        {/* Nav */}
        <nav className="relative z-50 w-full py-4" aria-label="Main navigation">
          <div className="w-full px-5 sm:px-8 lg:px-[4%] xl:px-[6%]">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 rounded-sm group"
              >
                <Image
                  src="/logo-fm-international.png"
                  alt="FM International"
                  width={56}
                  height={56}
                  className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
                  priority
                />
                <div className="hidden sm:block">
                  <p className="font-display text-white text-sm tracking-tight">
                    FM International
                  </p>
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-1.5">
                <Link
                  href="/about"
                  className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/training"
                  className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors"
                >
                  Training
                </Link>
                <Link
                  href="/placement"
                  className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors"
                >
                  Placement
                </Link>
                <Link
                  href="/partners"
                  className="text-sm text-white bg-white/15 px-4 py-2 rounded-full transition-colors font-medium"
                >
                  Partners
                </Link>
                <Link
                  href="/verify"
                  className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors"
                >
                  Verify
                </Link>
                <Link
                  href="/contact"
                  className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors"
                >
                  Contact
                </Link>
              </div>

              <div className="hidden lg:flex items-center gap-4">
                <Link href="#become-partner">
                  <Button className="rounded-full bg-white text-primary hover:bg-white/90 shadow-lg shadow-black/20 px-6 py-2.5 h-auto font-semibold">
                    Become a Partner
                  </Button>
                </Link>
              </div>

              <MobileNav variant="dark" />
            </div>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative flex-1 flex items-center w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
          <div className="max-w-7xl mx-auto w-full py-12 lg:py-0">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left */}
              <div>
                <div
                  className="inline-flex items-center gap-3 mb-8 animate-fade-in-up"
                  style={{ animationDelay: "0ms" }}
                >
                  <div className="h-px w-12 bg-white/40" />
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                    Partnership Program
                  </span>
                </div>

                <h1
                  className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[0.95] tracking-tight mb-8 animate-fade-in-up"
                  style={{ animationDelay: "80ms" }}
                >
                  Partner with
                  <br />
                  <span className="text-white/50">FM International</span>
                </h1>

                <p
                  className="text-white/70 text-lg md:text-xl max-w-md mb-10 leading-relaxed animate-fade-in-up"
                  style={{ animationDelay: "160ms" }}
                >
                  Access a verified pipeline of Oil & Gas professionals — engineers,
                  technicians, safety officers — ready to deploy to your projects
                  across the Gulf and beyond.
                </p>

                <div
                  className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
                  style={{ animationDelay: "240ms" }}
                >
                  <Link href="#become-partner">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto gap-2 h-13 px-8 bg-white text-primary hover:bg-white/90 shadow-2xl shadow-black/20 font-semibold text-base active:scale-[0.98] transition-all"
                    >
                      Start Partnership
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="#benefits">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto h-13 px-8 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold text-base"
                    >
                      View Benefits
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right — stats */}
              <div
                className="hidden lg:flex flex-col gap-6 animate-fade-in-up"
                style={{ animationDelay: "320ms" }}
              >
                {[
                  {
                    value: "15+",
                    label: "Active Partners",
                    sub: "Across Gulf & India",
                  },
                  {
                    value: "500+",
                    label: "Successful Placements",
                    sub: "Across all sectors",
                  },
                  {
                    value: "30",
                    label: "Day Avg. Turnaround",
                    sub: "From request to deployment",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-8 py-6 border-b border-white/10 last:border-0"
                  >
                    <span className="font-display text-5xl text-white leading-none w-28 shrink-0">
                      {stat.value}
                    </span>
                    <div>
                      <p className="font-display text-lg text-white leading-tight">
                        {stat.label}
                      </p>
                      <p className="text-sm text-white/50 mt-1">{stat.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trusted Partners Marquee ────────────────────────────── */}
      <section className="py-16 bg-secondary/30 border-y border-border overflow-hidden">
        <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%] mb-10">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
              Our Global Network
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <p className="text-center font-display text-2xl sm:text-3xl text-foreground mt-6">
            Trusted by industry leaders worldwide
          </p>
        </div>

        {/* Scrolling logo strip */}
        <div className="relative">
          <div
            className="flex gap-4"
            style={{
              animation: "marquee 24s linear infinite",
            }}
          >
            {[...partnerLogos, ...partnerLogos].map((p, i) => (
              <div
                key={i}
                className="flex-shrink-0 h-20 w-52 bg-background border border-border rounded-xl flex flex-col items-center justify-center px-6 hover:border-primary/30 hover:shadow-sm transition-all duration-300 group"
              >
                <span className="font-display text-base text-foreground/50 group-hover:text-foreground transition-colors tracking-tight">
                  {p.name}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
                  {p.country}
                </span>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ── Benefits Bento Grid ──────────────────────────────────── */}
      <section
        id="benefits"
        className="py-24 lg:py-32 bg-background relative overflow-hidden"
      >
        {/* Faint vertical accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary hidden lg:block" />

        <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-display text-8xl lg:text-9xl text-primary/10 leading-none">
                  01
                </span>
                <div>
                  <div className="h-px w-12 bg-primary mb-3" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Why Partner With Us
                  </span>
                </div>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[0.95] mb-16 max-w-3xl">
                Everything you need,
                <br />
                <span className="text-primary">handled end-to-end</span>
              </h2>
            </ScrollReveal>

            {/* Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Large left cell */}
              <ScrollReveal delay={80} className="md:col-span-2">
                <div className="relative bg-secondary/40 rounded-3xl p-10 lg:p-12 min-h-[380px] flex flex-col justify-between overflow-hidden border border-border hover:border-primary/20 transition-colors duration-300 group">
                  {/* Large decorative icon */}
                  <div className="absolute top-10 right-10 opacity-[0.06] group-hover:opacity-[0.10] transition-opacity">
                    <Users className="w-36 h-36 text-primary" />
                  </div>
                  {/* Number accent */}
                  <span className="absolute -right-6 -bottom-6 font-display text-[160px] font-bold text-primary/[0.05] leading-none select-none pointer-events-none">
                    01
                  </span>

                  <div className="relative">
                    <div className="w-12 h-1 bg-primary mb-8" />
                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground mb-5 leading-[1.1]">
                      Unmatched Talent Pipeline
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                      Every candidate undergoes rigorous technical assessment,
                      document verification, and skills testing before they reach
                      you. No time wasted on unqualified applicants.
                    </p>
                  </div>

                  <div className="relative flex flex-wrap gap-3 mt-8">
                    {[
                      "Technical Assessment",
                      "Document Verified",
                      "Skills Certified",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Small right cell — inverted */}
              <ScrollReveal delay={160}>
                <div className="bg-primary rounded-3xl p-10 lg:p-12 min-h-[380px] flex flex-col justify-between overflow-hidden relative group">
                  <div className="absolute top-8 right-8 opacity-[0.12]">
                    <Star className="w-20 h-20 text-white" />
                  </div>

                  <div className="relative">
                    <div className="w-12 h-1 bg-white/30 mb-8" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 block mb-4">
                      Exclusive Access
                    </span>
                    <h3 className="font-display text-2xl lg:text-3xl text-white leading-[1.1] mb-5">
                      Priority Matching
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      Partners get first-look access to each monthly cohort of
                      graduates — before openings go public.
                    </p>
                  </div>

                  <div className="relative pt-6 border-t border-white/10">
                    <span className="text-xs text-white/50 uppercase tracking-wider">
                      Available to all partners
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Small bottom-left */}
              <ScrollReveal delay={240}>
                <div className="bg-background border-2 border-border rounded-3xl p-10 min-h-[300px] flex flex-col justify-between hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                  <div>
                    <BarChart3 className="w-8 h-8 text-primary mb-8 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground block mb-3">
                      Performance
                    </span>
                    <h3 className="font-display text-xl lg:text-2xl text-foreground mb-4">
                      Placement Analytics
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Retention data, deployment reports, and performance metrics
                      for every FM International hire.
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all mt-6">
                    View sample report
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </ScrollReveal>

              {/* Wide bottom cell */}
              <ScrollReveal delay={320} className="md:col-span-2">
                <div className="bg-secondary/30 rounded-3xl p-10 lg:p-12 min-h-[300px] flex flex-col md:flex-row items-center gap-10 border border-border hover:border-primary/20 transition-colors duration-300">
                  <div className="flex-1">
                    <Globe2 className="w-8 h-8 text-primary mb-6" />
                    <h3 className="font-display text-2xl lg:text-3xl text-foreground mb-5 leading-[1.1]">
                      Global Reach, Local Expertise
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We handle visa processing, document legalization, medical
                      clearances, and mobilization logistics — from our base in Tamil
                      Nadu to your project site anywhere in the Gulf or beyond.
                    </p>
                  </div>

                  {/* Mini regional grid */}
                  <div className="grid grid-cols-3 gap-3 w-full md:w-52 shrink-0">
                    {[
                      { code: "🇦🇪", name: "UAE" },
                      { code: "🇶🇦", name: "Qatar" },
                      { code: "🇸🇦", name: "KSA" },
                      { code: "🇰🇼", name: "Kuwait" },
                      { code: "🇧🇭", name: "Bahrain" },
                      { code: "🇴🇲", name: "Oman" },
                    ].map((r) => (
                      <div
                        key={r.name}
                        className="text-center bg-background rounded-xl py-2.5 px-1 border border-border"
                      >
                        <span className="text-xl block mb-1">{r.code}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {r.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose – checklist strip ────────────────────────── */}
      <section className="py-20 lg:py-24 bg-primary text-white relative overflow-hidden">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left */}
              <ScrollReveal>
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-display text-7xl lg:text-8xl text-white/10 leading-none">
                    02
                  </span>
                  <div>
                    <div className="h-px w-12 bg-white/30 mb-3" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                      Partnership Value
                    </span>
                  </div>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl text-white leading-[0.95] mb-6">
                  What you get
                  <br />
                  as a partner
                </h2>
                <p className="text-white/60 text-lg leading-relaxed max-w-md">
                  More than a staffing agency — a strategic workforce partner
                  committed to your project's success.
                </p>
              </ScrollReveal>

              {/* Right — checklist */}
              <ScrollReveal delay={100}>
                <ul className="space-y-4">
                  {whyChoose.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-4 py-4 border-b border-white/10 last:border-0 group"
                    >
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mt-0.5 shrink-0 group-hover:bg-white/20 transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-white/80 group-hover:text-white transition-colors leading-relaxed">
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-background relative">
        <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-display text-8xl lg:text-9xl text-primary/10 leading-none">
                  03
                </span>
                <div>
                  <div className="h-px w-12 bg-primary mb-3" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    The Process
                  </span>
                </div>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[0.95] mb-20 max-w-3xl">
                Up and running
                <br />
                <span className="text-primary">in four steps</span>
              </h2>
            </ScrollReveal>

            {/* Steps — industrial grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
              {[
                {
                  number: "01",
                  icon: Handshake,
                  title: "Express Interest",
                  desc: "Submit the inquiry form. Our team contacts you within 24 hours.",
                },
                {
                  number: "02",
                  icon: Building2,
                  title: "Scope Discussion",
                  desc: "We understand your project requirements, timelines, and manpower needs.",
                },
                {
                  number: "03",
                  icon: Users,
                  title: "Candidate Matching",
                  desc: "We present pre-screened candidates that match your technical specifications.",
                },
                {
                  number: "04",
                  icon: Zap,
                  title: "Deploy & Support",
                  desc: "We handle deployment logistics. Your account manager stays with you throughout.",
                },
              ].map((step, i) => (
                <ScrollReveal key={step.number} delay={100 + i * 80}>
                  <div className="bg-background p-8 lg:p-10 min-h-[280px] flex flex-col justify-between group hover:bg-secondary/30 transition-colors duration-300">
                    <div>
                      <span className="font-display text-6xl text-primary/10 leading-none mb-6 block group-hover:text-primary/20 transition-colors">
                        {step.number}
                      </span>
                      <step.icon className="w-6 h-6 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="font-display text-xl text-foreground mb-3">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Partnership Inquiry Form ─────────────────────────────── */}
      <section
        id="become-partner"
        className="py-24 lg:py-32 bg-secondary/30 relative"
      >
        <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-display text-7xl lg:text-8xl text-primary/10 leading-none">
                  04
                </span>
                <div>
                  <div className="h-px w-12 bg-primary mb-3" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Get Started
                  </span>
                </div>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-foreground leading-[0.95] mb-6">
                Become a Partner
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mb-12">
                Fill in the form below and our institutional relations team will
                reach out within 24 hours to discuss your manpower requirements.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              {submitted ? (
                /* ── Success state ── */
                <div className="bg-background border-2 border-primary/20 rounded-3xl p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground mb-3">
                    Inquiry Received
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Thank you. Our team will contact you within 24 hours to
                    discuss your requirements.
                  </p>
                  <Button
                    className="mt-8"
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                  >
                    Submit another inquiry
                  </Button>
                </div>
              ) : (
                /* ── Form ── */
                <form
                  onSubmit={handleSubmit}
                  className="bg-background rounded-3xl p-8 sm:p-10 lg:p-12 border border-border"
                  noValidate
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                    {/* Company Name */}
                    <div className="space-y-2">
                      <label
                        htmlFor="company"
                        className="text-xs font-semibold uppercase tracking-[0.15em] text-primary block"
                      >
                        Company Name *
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        required
                        value={formState.company}
                        onChange={handleChange}
                        placeholder="e.g. ADNOC Group"
                        className="w-full bg-secondary/40 border border-border rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      />
                    </div>

                    {/* Contact Person */}
                    <div className="space-y-2">
                      <label
                        htmlFor="contact"
                        className="text-xs font-semibold uppercase tracking-[0.15em] text-primary block"
                      >
                        Contact Person *
                      </label>
                      <input
                        id="contact"
                        name="contact"
                        type="text"
                        required
                        value={formState.contact}
                        onChange={handleChange}
                        placeholder="Ahmed Al-Rashid"
                        className="w-full bg-secondary/40 border border-border rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-xs font-semibold uppercase tracking-[0.15em] text-primary block"
                      >
                        Email Address *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        placeholder="hr@yourcompany.com"
                        className="w-full bg-secondary/40 border border-border rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="text-xs font-semibold uppercase tracking-[0.15em] text-primary block"
                      >
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formState.phone}
                        onChange={handleChange}
                        placeholder="+971 50 000 0000"
                        className="w-full bg-secondary/40 border border-border rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      />
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <label
                        htmlFor="country"
                        className="text-xs font-semibold uppercase tracking-[0.15em] text-primary block"
                      >
                        Country of Operation *
                      </label>
                      <select
                        id="country"
                        name="country"
                        required
                        value={formState.country}
                        onChange={handleChange}
                        className="w-full bg-secondary/40 border border-border rounded-xl px-5 py-4 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          Select country
                        </option>
                        {[
                          "UAE",
                          "Qatar",
                          "Saudi Arabia",
                          "Kuwait",
                          "Bahrain",
                          "Oman",
                          "India",
                          "Other",
                        ].map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sector */}
                    <div className="space-y-2">
                      <label
                        htmlFor="sector"
                        className="text-xs font-semibold uppercase tracking-[0.15em] text-primary block"
                      >
                        Industry Sector
                      </label>
                      <select
                        id="sector"
                        name="sector"
                        value={formState.sector}
                        onChange={handleChange}
                        className="w-full bg-secondary/40 border border-border rounded-xl px-5 py-4 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select sector</option>
                        {[
                          "Oil & Gas",
                          "Petrochemical",
                          "Construction",
                          "Refinery",
                          "LNG",
                          "Infrastructure",
                          "Shutdown / Turnaround",
                          "Other",
                        ].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div className="sm:col-span-2 space-y-2">
                      <label
                        htmlFor="message"
                        className="text-xs font-semibold uppercase tracking-[0.15em] text-primary block"
                      >
                        Hiring Requirements
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Tell us about your current hiring needs — roles, volume, project timeline, and any specific certifications required."
                        className="w-full bg-secondary/40 border border-border rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                      />
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="sm:col-span-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-5 py-4">
                        {error}
                      </div>
                    )}

                    {/* Submit */}
                    <div className="sm:col-span-2 pt-2">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={loading}
                        className="w-full h-14 gap-2 font-semibold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? "Sending…" : "Submit Partnership Inquiry"}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-4">
                        We respond within 24 hours. Your information is kept
                        confidential.
                      </p>
                    </div>
                  </div>
                </form>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
