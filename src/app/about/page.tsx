"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/ui/mobile-nav";
import { ScrollReveal, AnimatedCounter } from "@/components/ui/scroll-reveal";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  const partners = [
    { name: "Arabienertech", country: "Kuwait", subtitle: "Energy Solutions" },
    { name: "Bader Almullah", country: "Kuwait", subtitle: "Industrial Services" },
    { name: "STALMOST", country: "Russia", subtitle: "Heavy Structures" },
  ];

  const pathwaySteps = [
    {
      number: "01",
      title: "Train",
      desc: "Expert-led technical certification and safety onboarding.",
    },
    {
      number: "02",
      title: "Guide",
      desc: "Personalized career coaching and mobilization planning.",
    },
    {
      number: "03",
      title: "Place",
      desc: "Deployment into high-impact global projects.",
    },
    {
      number: "04",
      title: "Grow",
      desc: "Continuous professional support and advancement.",
    },
  ];

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section - Full viewport, dramatic */}
      <section className="relative min-h-screen flex flex-col">
        {/* Background image with strong overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/About-Hero.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-primary" />

        {/* Industrial grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Navigation */}
        <nav className="relative z-50 w-full py-4" aria-label="Main navigation">
          <div className="w-full px-5 sm:px-8 lg:px-[4%] xl:px-[6%]">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 rounded-sm group"
              >
                <Image
                  src="/apple-touch-icon.png"
                  alt="FM Global Careers"
                  width={56}
                  height={56}
                  className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
                  priority
                />
                <div className="hidden sm:block">
                  <p className="font-display text-white text-sm tracking-tight">FM Global Careers</p>
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-1.5">
                <Link href="/about" className="text-sm text-white bg-white/15 px-4 py-2 rounded-full transition-colors font-medium">
                  About
                </Link>
                <Link href="/training" className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors">
                  Training
                </Link>
                <Link href="/placement" className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors">
                  Placement
                </Link>
                <Link href="/verify" className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors">
                  Verify
                </Link>
                <Link href="/contact" className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors">
                  Contact
                </Link>
              </div>

              <div className="hidden lg:flex items-center gap-4">
                <Link href="/contact">
                  <Button className="rounded-full bg-white text-primary hover:bg-white/90 shadow-lg shadow-black/20 px-6 py-2.5 h-auto font-semibold">
                    Enquire Now
                  </Button>
                </Link>
              </div>

              <MobileNav variant="dark" />
            </div>
          </div>
        </nav>

        {/* Hero Content - Dramatic typography */}
        <div className="relative flex-1 flex items-center w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
          <div className="max-w-7xl mx-auto w-full py-12 lg:py-0">
            {/* Oversized decorative text */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 hidden xl:block pointer-events-none select-none">
              <span className="text-[20rem] font-display font-bold text-white/[0.03] leading-none tracking-tighter">
                FM
              </span>
            </div>

            <div className="relative">
              {/* Badge with strong styling */}
              <div
                className="inline-flex items-center gap-3 mb-8 animate-fade-in-up"
              >
                <div className="h-px w-16 bg-white/50" />
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                  Global Reach
                </span>
              </div>

              {/* Massive headline */}
              <h1
                className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] text-white mb-8 max-w-5xl animate-fade-in-up tracking-tight"
                style={{ animationDelay: "100ms" }}
              >
                Empowering
                <br />
                <span className="text-white/60">Global</span>
                <br />
                Talent
              </h1>

              <p
                className="text-white/70 text-lg md:text-xl max-w-md mb-10 animate-fade-in-up font-light"
                style={{ animationDelay: "200ms" }}
              >
                We bridge the distance between expertise and international opportunity in Oil & Gas.
              </p>

              <div
                className="flex gap-4 flex-wrap animate-fade-in-up"
                style={{ animationDelay: "300ms" }}
              >
                <Link href="/placement" className="group">
                  <Button size="lg" className="gap-3 h-14 px-8 bg-white text-primary hover:bg-white/90 shadow-2xl font-semibold text-base">
                    Explore Opportunities
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="#our-story">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-transparent border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 font-semibold text-base"
                  >
                    Our Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats bar - industrial feel */}
        <div className="relative border-t border-white/10">
          <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
            <div className="max-w-7xl mx-auto">
              <dl className="grid grid-cols-3 divide-x divide-white/10">
                {[
                  { value: "500+", label: "Placed" },
                  { value: "15+", label: "Partners" },
                  { value: "95%", label: "Success" },
                ].map((stat) => (
                  <div key={stat.label} className="py-6 lg:py-8 text-center">
                    <dd className="font-display text-2xl sm:text-3xl lg:text-4xl text-white mb-1">{stat.value}</dd>
                    <dt className="text-xs uppercase tracking-wider text-white/50">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section - Asymmetric layout */}
      <section id="our-story" className="py-24 lg:py-32 bg-background relative">
        {/* Strong vertical accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 lg:w-2 bg-primary hidden lg:block" />

        <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
          <div className="max-w-7xl mx-auto">
            {/* Section label */}
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-16">
                <span className="font-display text-8xl lg:text-9xl text-primary/10 leading-none">01</span>
                <div>
                  <div className="h-px w-12 bg-primary mb-3" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Story</span>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
              {/* Left - Large headline spanning most of width */}
              <div className="lg:col-span-7">
                <ScrollReveal>
                  <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-foreground leading-[0.95] mb-8">
                    Building careers
                    <br />
                    <span className="text-primary">since day one</span>
                  </h2>
                </ScrollReveal>
              </div>

              {/* Right - Body text, offset down */}
              <div className="lg:col-span-5 lg:pt-24">
                <ScrollReveal delay={100}>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    FM Global Careers was founded on a singular vision: to create a seamless conduit between the world&apos;s most demanding industrial projects and the technical talent capable of executing them.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    We recognized a critical gap in the energy and heavy industry sectors — a need for not just labor, but for expertly trained, globally mobile professionals. Today, we serve as a strategic partner to global conglomerates.
                  </p>
                  <Link href="/training" className="group inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                    Learn about our training
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </ScrollReveal>
              </div>
            </div>

            {/* Large image breaking the grid */}
            <ScrollReveal delay={200}>
              <div className="mt-16 lg:mt-24 lg:-mr-[8%] xl:-mr-[12%]">
                <div className="relative aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
                  <Image
                    src="/employee.png"
                    alt="FM Global professional employee"
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  {/* Industrial corner accent */}
                  <div className="absolute top-0 left-0 w-24 h-24 border-l-4 border-t-4 border-primary" />
                  <div className="absolute bottom-0 right-0 w-24 h-24 border-r-4 border-b-4 border-primary" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Divisions Section - Bold contrast */}
      <section className="py-24 lg:py-32 bg-secondary/40 relative">
        <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-display text-8xl lg:text-9xl text-primary/10 leading-none">02</span>
                <div>
                  <div className="h-px w-12 bg-primary mb-3" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Specializations</span>
                </div>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[0.95] mb-16 max-w-3xl">
                Two paths to your
                <br />
                <span className="text-primary">global career</span>
              </h2>
            </ScrollReveal>

            {/* Division Cards - High contrast, bold */}
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
              {/* FM Institute - Light card with strong border */}
              <ScrollReveal delay={100}>
                <Link href="/training" className="group block h-full">
                  <article className="relative h-full min-h-[500px] lg:min-h-[560px] bg-background border-2 border-border p-8 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5">
                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 transition-all duration-300 group-hover:w-40 group-hover:h-40" />

                    {/* Large background number */}
                    <span className="absolute right-6 top-6 text-[120px] lg:text-[160px] font-display font-bold text-primary/[0.06] leading-none select-none pointer-events-none">
                      01
                    </span>

                    <div className="relative">
                      <div className="w-16 h-1 bg-primary mb-8" />
                      <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                        Training Division
                      </span>
                      <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6 leading-[0.95]">
                        FM Institute
                      </h3>
                      <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                        Industry-focused training arm equipping candidates with technical certifications and soft skills for international environments.
                      </p>
                    </div>

                    <div className="relative flex items-center justify-between pt-8 border-t border-border">
                      <span className="text-sm text-muted-foreground font-medium">12+ Courses Available</span>
                      <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                        Explore
                        <ArrowUpRight className="w-5 h-5" />
                      </span>
                    </div>
                  </article>
                </Link>
              </ScrollReveal>

              {/* FM International - Dark card, inverted */}
              <ScrollReveal delay={200}>
                <Link href="/placement" className="group block h-full">
                  <article className="relative h-full min-h-[500px] lg:min-h-[560px] bg-primary p-8 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30">
                    {/* Corner accent - inverted */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 transition-all duration-300 group-hover:w-40 group-hover:h-40" />

                    {/* Large background number */}
                    <span className="absolute right-6 top-6 text-[120px] lg:text-[160px] font-display font-bold text-white/[0.06] leading-none select-none pointer-events-none">
                      02
                    </span>

                    <div className="relative">
                      <div className="w-16 h-1 bg-white/40 mb-8" />
                      <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-4">
                        Placement Division
                      </span>
                      <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-6 leading-[0.95]">
                        FM International
                      </h3>
                      <p className="text-white/70 text-lg leading-relaxed max-w-md">
                        Comprehensive manpower solutions connecting skilled professionals with global energy, construction, and manufacturing firms.
                      </p>
                    </div>

                    <div className="relative flex items-center justify-between pt-8 border-t border-white/10">
                      <span className="text-sm text-white/60 font-medium">15+ Global Partners</span>
                      <span className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                        View Jobs
                        <ArrowUpRight className="w-5 h-5" />
                      </span>
                    </div>
                  </article>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission - Strong typography focus */}
      <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
        {/* Large decorative text */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-20 pointer-events-none select-none hidden lg:block">
          <span className="text-[300px] font-display font-bold text-primary/[0.02] leading-none tracking-tighter whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
            VISION
          </span>
        </div>

        <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-16">
                <span className="font-display text-8xl lg:text-9xl text-primary/10 leading-none">03</span>
                <div>
                  <div className="h-px w-12 bg-primary mb-3" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Purpose</span>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
              {/* Vision */}
              <ScrollReveal delay={100}>
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary" />
                  <div className="pl-8">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4 block">Our Vision</span>
                    <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground leading-[1.2]">
                      To be the most trusted global platform for industrial career development.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Mission */}
              <ScrollReveal delay={200}>
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-accent" />
                  <div className="pl-8">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4 block">Our Mission</span>
                    <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground leading-[1.2]">
                      Empowering individuals through rigorous training and transformative career placements.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Integrated Pathway Section - Industrial process feel */}
      <section className="py-24 lg:py-32 bg-primary text-white relative overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-display text-8xl lg:text-9xl text-white/10 leading-none">04</span>
                <div>
                  <div className="h-px w-12 bg-white/40 mb-3" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">The Process</span>
                </div>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[0.95] mb-20 max-w-4xl">
                Your integrated
                <br />
                pathway to success
              </h2>
            </ScrollReveal>

            {/* Pathway steps - Horizontal industrial layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
              {pathwaySteps.map((step, i) => (
                <ScrollReveal key={step.number} delay={100 + i * 100}>
                  <div className="bg-primary p-8 lg:p-10 h-full min-h-[280px] flex flex-col justify-between group hover:bg-white/5 transition-colors">
                    <div>
                      <span className="font-display text-6xl lg:text-7xl text-white/10 leading-none mb-6 block group-hover:text-white/20 transition-colors">
                        {step.number}
                      </span>
                      <h3 className="font-display text-2xl lg:text-3xl text-white mb-3">{step.title}</h3>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Stats row */}
            <ScrollReveal delay={500}>
              <div className="mt-20 pt-12 border-t border-white/10">
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
                  <div>
                    <dd className="font-display text-5xl lg:text-6xl text-white mb-2">
                      <AnimatedCounter value={500} suffix="+" />
                    </dd>
                    <dt className="text-sm uppercase tracking-wider text-white/50">Students Placed</dt>
                  </div>
                  <div>
                    <dd className="font-display text-5xl lg:text-6xl text-white mb-2">
                      <AnimatedCounter value={15} suffix="+" />
                    </dd>
                    <dt className="text-sm uppercase tracking-wider text-white/50">Partner Companies</dt>
                  </div>
                  <div>
                    <dd className="font-display text-5xl lg:text-6xl text-white mb-2">
                      <AnimatedCounter value={95} suffix="%" />
                    </dd>
                    <dt className="text-sm uppercase tracking-wider text-white/50">Placement Rate</dt>
                  </div>
                </dl>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Trusted Partners Section - Minimal, strong */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-display text-8xl lg:text-9xl text-primary/10 leading-none">05</span>
                <div>
                  <div className="h-px w-12 bg-primary mb-3" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Network</span>
                </div>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[0.95] mb-16 max-w-3xl">
                Trusted by industry
                <br />
                <span className="text-primary">leaders worldwide</span>
              </h2>
            </ScrollReveal>

            {/* Partners - Bold list style */}
            <div className="border-t border-border">
              {partners.map((partner, i) => (
                <ScrollReveal key={partner.name} delay={100 + i * 100}>
                  <div className="py-8 lg:py-10 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-secondary/30 transition-colors -mx-4 px-4 sm:-mx-6 sm:px-6">
                    <div className="flex items-baseline gap-6">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary w-16">{partner.country}</span>
                      <h3 className="font-display text-2xl lg:text-3xl text-foreground">{partner.name}</h3>
                    </div>
                    <span className="text-sm text-muted-foreground sm:text-right">{partner.subtitle}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - High contrast split */}
      <section className="relative">
        <div className="grid lg:grid-cols-2">
          {/* Left - Dark */}
          <div className="bg-primary text-white py-24 lg:py-32 px-5 sm:px-8 lg:pl-[12%] lg:pr-12">
            <ScrollReveal direction="left">
              <div className="max-w-lg">
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-display text-7xl lg:text-8xl text-white/10 leading-none">06</span>
                  <div>
                    <div className="h-px w-12 bg-white/40 mb-3" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Contact</span>
                  </div>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-[0.95] mb-12">
                  Get in touch
                </h2>

                <div className="space-y-10">
                  <div>
                    <h3 className="font-display text-lg text-white/80 mb-4">FM Institute</h3>
                    <p className="text-white/60 mb-1">fminstitute24@gmail.com</p>
                    <p className="text-white/60">+91 8807026768</p>
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-white/80 mb-4">FM International</h3>
                    <p className="text-white/60 mb-1">fminternational.jobs@gmail.com</p>
                    <p className="text-white/60">+91 7418912404</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right - Map */}
          <div className="bg-secondary/40 relative min-h-[400px] lg:min-h-full">
            <ScrollReveal direction="right" delay={100} className="h-full">
              <div className="absolute inset-0 flex flex-col">
                {/* Office info bar */}
                <div className="bg-background/80 backdrop-blur-sm px-6 py-4 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-display text-sm text-foreground">Our Office</h3>
                      <p className="text-xs text-muted-foreground">2/17, Pannaivilai Street, Thovalai 629301</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Mon – Sat: 10 AM – 5 PM</p>
                  </div>
                </div>
                {/* Map embed */}
                <div className="flex-1 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3948.726730546175!2d77.5056149!3d8.230211299999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04f5b5cf279349%3A0xdc18a12aea2f216f!2sFM%20Institute!5e0!3m2!1sen!2sin!4v1774579264206!5m2!1sen!2sin"
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="FM Institute Location"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
