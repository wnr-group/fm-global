"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/ui/mobile-nav";

export default function AboutPage() {

  const [counted, setCounted] = useState(false);
  const pathwayRef = useRef<HTMLDivElement>(null);

  function useCounter(target: number, active: boolean): number {
    const [count, setCount] = useState(0);
    useEffect(() => {
      if (!active) return;
      let current = 0;
      const increment = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, 40);
      return () => clearInterval(timer);
    }, [active, target]);
    return count;
  }


  const statStudents = useCounter(500, counted);
  const statPartners = useCounter(15, counted);
  const statRate = useCounter(95, counted);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setCounted(true);
      },
      { threshold: 0.3 }
    );
    if (pathwayRef.current) observer.observe(pathwayRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  const partners = [
    { name: "Arabienertech", country: "Kuwait", subtitle: "Energy Solutions" },
    { name: "Bader Almullah", country: "Kuwait", subtitle: "Industrial Services" },
    { name: "STALMOST", country: "Russia", subtitle: "Heavy Structures" },
  ];

  const pathwaySteps = [
    {
      title: "Train",
      desc: "Expert-led technical certification and safety onboarding.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
        </svg>
      ),
    },
    {
      title: "Guide",
      desc: "Personalized career coaching and mobilization planning.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
        </svg>
      ),
    },
    {
      title: "Place",
      desc: "Deployment into high-impact global projects.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
    },
    {
      title: "Grow",
      desc: "Continuous professional support and advancement.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
        </svg>
      ),
    },
  ];

  return (
    <main className="bg-[#feffff] font-inter overflow-x-hidden">

      {/* ════════════════════════════════════════════════════════════════
          SECTION 1 — HERO BANNER
      ════════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[520px] md:min-h-[600px] flex flex-col"
        style={{
          backgroundImage: "url('/About-Hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-[#0f385a]/70 pointer-events-none" aria-hidden="true" />
        {/* ── NAVBAR ── */}
        <nav className="relative z-50 w-full py-4" aria-label="Main navigation">
          <div className="w-full px-5 sm:px-8 lg:px-[4%] xl:px-[6%]">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 rounded-sm group"
              >
                <Image
                  src="/Brand-Logo.png"
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
                <Link href="/training" className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50">
                  Training
                </Link>
                <Link href="/placement" className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50">
                  Placement
                </Link>
                <Link href="/verify" className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50">
                  Verify
                </Link>
                <Link href="/contact" className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50">
                  Contact
                </Link>
              </div>
              <div className="hidden lg:flex items-center gap-4">
                <Link href="/contact">
                  <Button className="rounded-full bg-white text-primary hover:bg-white/90 shadow-lg shadow-black/20 px-6 py-2.5 h-auto font-poppins font-semibold">
                    Enquire Now
                  </Button>
                </Link>
              </div>
              <MobileNav variant="dark" />
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 md:px-16 pb-16 mt-auto w-full">
          <span className="inline-flex bg-[#f5c518] text-[#0f385a] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
            GLOBAL REACH
          </span>
          <h1 className="reveal font-poppins font-bold text-4xl md:text-5xl lg:text-6xl leading-tight text-white mb-4">
            Empowering Talent for
            <br />
            International
            <br />
            Careers
          </h1>
          <p className="reveal text-[#d7dad7] text-base md:text-lg max-w-md mb-8">
            Global Careers Start Here. We bridge the distance between expertise and international opportunity.
          </p>
          <div className="reveal flex gap-4 flex-wrap">
            <Link
              href="/placement"
              className="bg-[#f5c518] text-[#0f385a] font-poppins font-semibold px-6 py-3 rounded-md hover:bg-[#f5c518]/80 transition-colors"
            >
              Explore Opportunities
            </Link>
            <Link
              href="/about#our-story"
              className="border border-white text-white font-poppins font-semibold px-6 py-3 rounded-md hover:bg-white hover:text-[#0f385a] transition-colors"
            >
              Watch Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 2 — OUR STORY
      ════════════════════════════════════════════════════════════════ */}
      <section id="our-story" className="bg-[#feffff] py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <div className="reveal-left">
            <p className="text-sm font-semibold text-[#0f385a] uppercase tracking-widest mb-3">
              Our Story
            </p>
            <h2 className="font-poppins font-bold text-3xl md:text-4xl text-[#0f385a] mb-6">
              FM Global Careers
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              FM Global Careers was founded on a singular vision: to create a seamless conduit between the world&apos;s most demanding industrial projects and the technical talent capable of executing them. We recognized a critical gap in the energy and heavy industry sectors — a need for not just labor, but for expertly trained, globally mobile professionals.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, we serve as a strategic partner to global conglomerates, providing an end-to-end ecosystem that identifies, cultivates, and deploys high-caliber individuals into environments where they can truly excel.
            </p>
          </div>
          {/* Right — employee image card */}
          <div className="reveal-right relative rounded-2xl overflow-hidden shadow-xl h-80 md:h-96">
            <Image
              src="/employee.png"
              alt="FM Global professional employee"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 3 — OUR DIVISIONS
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#feffff] py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Top row */}
          <div className="reveal flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs font-bold tracking-widest text-[#0f385a] opacity-60 uppercase mb-2">
                SPECIALIZATIONS
              </p>
              <h2 className="font-poppins font-bold text-3xl md:text-4xl text-[#0f385a]">
                Our Divisions
              </h2>
            </div>
            <p className="text-sm text-gray-500 max-w-xs md:text-right">
              Structured excellence through dedicated arms for education and international manpower deployment.
            </p>
          </div>
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 — FM Institute (light) */}
            <div className="reveal bg-[#feffff] rounded-2xl p-8 shadow-sm border border-[#d7dad7]">
              <div className="w-12 h-12 rounded-xl bg-[#0f385a] flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 className="font-poppins font-bold text-xl text-[#0f385a] mb-3">FM Institute</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Our industry-focused training arm. We equip candidates with the precise technical certifications and soft skills required to thrive in international industrial environments, ensuring they are job-ready from day one.
              </p>
              <ul className="space-y-2 mb-6">
                {["Technical Certification Programs", "Safety & Compliance Training", "Cross-Cultural Orientation"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#f5c518] flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/training" className="inline-flex items-center gap-2 text-[#0f385a] font-poppins font-semibold text-sm hover:gap-3 transition-all">
                Learn More <span>→</span>
              </Link>
            </div>
            {/* Card 2 — FM International (dark featured) */}
            <div className="reveal reveal-delay-1 bg-[#0f385a] rounded-2xl p-8 text-white">
              <div className="w-12 h-12 rounded-xl bg-[#f5c518] flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#0f385a]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h3 className="font-poppins font-bold text-xl text-white mb-3">FM International Placement Services</h3>
              <p className="text-[#d7dad7] text-sm leading-relaxed mb-6">
                A comprehensive manpower solution provider. We connect skilled professionals with major global energy, construction, and manufacturing firms, managing the entire placement lifecycle with precision.
              </p>
              <ul className="space-y-2 mb-6">
                {["Global Recruitment Network", "Visa & Mobilization Support", "Contractual Management"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#f5c518] flex-shrink-0" />
                    <span className="text-sm text-[#d7dad7]">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/placement" className="inline-flex items-center gap-2 text-[#f5c518] font-poppins font-semibold text-sm hover:gap-3 transition-all">
                Placement Portal <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 4 — VISION & MISSION
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#feffff] py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left — dark gradient card */}
          <div
            className="reveal-left rounded-2xl overflow-hidden relative flex items-end p-8 min-h-[320px] md:min-h-[400px]"
            style={{ background: "linear-gradient(to bottom right, #0a2840, #0f385a, #1a5276)" }}
          >
            <div className="relative z-10">
              <p className="text-[#f5c518] text-xs font-bold uppercase tracking-widest mb-2">
                TECHNICAL TRAINING
              </p>
              <h3 className="text-white font-poppins font-bold text-2xl leading-tight">
                Technical Training in Industrial Placement
              </h3>
            </div>
          </div>
          {/* Right — two stacked cards */}
          <div className="space-y-6">
            <div className="reveal bg-[#feffff] rounded-2xl p-8 border-l-4 border-[#f5c518]">
              <h3 className="font-poppins font-bold text-xl text-[#0f385a] mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                To be the most trusted global platform for industrial career development, where every individual has access to world-class training and every company finds their perfect professional match.
              </p>
            </div>
            <div className="reveal reveal-delay-1 bg-[#feffff] rounded-2xl p-8 border-l-4 border-[#0f385a]">
              <h3 className="font-poppins font-bold text-xl text-[#0f385a] mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                To empower individuals by providing rigorous, industry-aligned training and securing transformative career placements that foster both personal growth and industrial excellence worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 5 — THE INTEGRATED PATHWAY (animated stats + cards)
      ════════════════════════════════════════════════════════════════ */}
      <section ref={pathwayRef} className="bg-[#0f385a] py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="reveal text-center mb-16">
            <h2 className="font-poppins font-bold text-3xl md:text-4xl text-white mb-4">
              The Integrated Pathway
            </h2>
            <p className="text-[#d7dad7] max-w-xl mx-auto">
              We don&apos;t just offer courses or jobs — we build complete career pathways for aspiring candidates in the oil &amp; gas industry.
            </p>
          </div>
          {/* Animated stats row */}
          <div className="reveal grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 max-w-2xl mx-auto text-center">
            <div>
              <p className="font-poppins font-bold text-4xl text-white">{statStudents}+</p>
              <p className="text-[#d7dad7] text-sm mt-1">Students Placed</p>
            </div>
            <div>
              <p className="font-poppins font-bold text-4xl text-white">{statPartners}+</p>
              <p className="text-[#d7dad7] text-sm mt-1">Partner Companies</p>
            </div>
            <div>
              <p className="font-poppins font-bold text-4xl text-white">{statRate}%</p>
              <p className="text-[#d7dad7] text-sm mt-1">Placement Rate</p>
            </div>
          </div>
          {/* Pathway cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {pathwaySteps.map((step, i) => (
              <div
                key={step.title}
                className={`${i === 0 ? 'reveal' : i === 1 ? 'reveal reveal-delay-1' : i === 2 ? 'reveal reveal-delay-2' : 'reveal reveal-delay-3'} bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-colors`}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#f5c518] flex items-center justify-center text-[#0f385a]">
                  {step.icon}
                </div>
                <h3 className="font-poppins font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-[#d7dad7] text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 6 — OUR TRUSTED PARTNERS
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#feffff] py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="reveal text-xs font-bold uppercase tracking-widest text-[#0f385a] opacity-60 mb-3">
            STRATEGIC NETWORK
          </p>
          <h2 className="reveal font-poppins font-bold text-3xl md:text-4xl text-[#0f385a] mb-16">
            Our Trusted Partners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {partners.map((partner, i) => (
              <div
                key={partner.name}
                className={`${i === 0 ? 'reveal' : i === 1 ? 'reveal reveal-delay-1' : 'reveal reveal-delay-2'} border border-[#d7dad7] rounded-2xl p-8 hover:shadow-md hover:border-[#0f385a] transition-all text-center`}
              >
                <span className="text-xs font-bold uppercase tracking-widest text-[#f5c518] mb-2 block">
                  {partner.country}
                </span>
                <p className="font-poppins font-bold text-xl text-[#0f385a] mb-1">{partner.name}</p>
                <p className="text-sm text-gray-500">{partner.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 7 — CONTACT & OFFICE
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0f385a] text-white py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left — two entity contact blocks */}
          <div className="reveal-left space-y-10">
            {/* FM Institute */}
            <div>
              <h3 className="font-poppins font-bold text-xl mb-4">FM Institute</h3>
              <div className="flex items-center gap-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#f5c518] flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <span className="text-[#d7dad7]">fminstitute24@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#f5c518] flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                <span className="text-[#d7dad7]">+91 8807026768</span>
              </div>
            </div>
            {/* FM International */}
            <div>
              <h3 className="font-poppins font-bold text-xl mb-4">FM International Placement Services</h3>
              <div className="flex items-center gap-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#f5c518] flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <span className="text-[#d7dad7] break-all">fminternational.jobs@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#f5c518] flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                <span className="text-[#d7dad7]">+91 7418912404</span>
              </div>
            </div>
          </div>
          {/* Right — office details */}
          <div className="reveal-right">
            <h3 className="font-poppins font-bold text-xl mb-6">Our Office</h3>
            <div className="flex items-start gap-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#f5c518] mt-1 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <div>
                <p className="text-[#d7dad7]">2/17, Pannaivilai Street</p>
                <p className="text-[#d7dad7]">Thovalai, India 629301</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#f5c518] flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <p className="text-[#d7dad7]">Mon – Sat: 10:00 AM – 5:00 PM</p>
            </div>
            <a
              href="https://maps.app.goo.gl/jF64Wv9SnuxLdmyH9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#f5c518] text-[#0f385a] font-poppins font-semibold px-6 py-3 rounded-md hover:bg-[#f5c518]/80 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              View on Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16 lg:py-20" role="contentinfo">
        <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link
                href="/"
                className="inline-flex items-center gap-3 mb-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm group"
              >
                <Image
                  src="/Brand-Logo.png"
                  alt="FM Global Careers"
                  width={56}
                  height={56}
                  className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
                />
                <div>
                  <p className="font-display text-background text-sm">FM Global Careers</p>
                  <p className="text-xs text-background/60">Global Careers Start Here</p>
                </div>
              </Link>
              <p className="text-background/70 text-sm max-w-xs leading-relaxed">
                Your trusted partner for specialized training in Oil &amp; Gas and
                international career placement.
              </p>
            </div>

            {/* Quick Links */}
            <nav aria-label="Footer navigation">
              <h3 className="font-display font-semibold text-background text-sm mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Training Programs", href: "/training" },
                  { label: "Job Placement", href: "/placement" },
                  { label: "Verify Certificate", href: "/verify" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/70 hover:text-background transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Divisions */}
            <div>
              <h3 className="font-display font-semibold text-background text-sm mb-4">Divisions</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/training"
                    className="text-sm text-background/70 hover:text-background transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-background/50" />
                    FM Institute
                  </Link>
                </li>
                <li>
                  <Link
                    href="/placement"
                    className="text-sm text-background/70 hover:text-background transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-background/50" />
                    FM International
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-display font-semibold text-background text-sm mb-4">Contact</h3>
              <address className="not-italic space-y-3 text-sm text-background/70">
                <p>Chennai, Tamil Nadu, India</p>
                <p>
                  <a
                    href="mailto:contact@fmglobalcareers.com"
                    className="hover:text-background transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
                  >
                    contact@fmglobalcareers.com
                  </a>
                </p>
                <p>
                  <a
                    href="tel:+919999999999"
                    className="hover:text-background transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
                  >
                    +91 99999 99999
                  </a>
                </p>
              </address>
            </div>
          </div>

          <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/60">
              &copy; {new Date().getFullYear()} FM Global Careers. All rights reserved.
            </p>
            <p className="text-xs text-background/40">Building Global Oil &amp; Gas Careers</p>
          </div>
        </div>
      </footer>

    </main>
  );
}

