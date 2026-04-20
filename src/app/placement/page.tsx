import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/ui/mobile-nav";
import { ScrollReveal, AnimatedCounter } from "@/components/ui/scroll-reveal";
import {
  ArrowRight,
  ArrowUpRight,
  Globe2,
  MapPin,
  Briefcase,
  Building2,
  Users,
  FileCheck,
  Plane,
  CheckCircle2,
  Shield,
  Wrench,
  HardHat,
  ClipboardCheck,
  RollerCoaster,
  UsersRound
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { CurrentOpenings } from "@/components/placement/CurrentOpenings";
import { FloatingFlags } from "@/components/placement/FloatingFlags";
import { TestimonialsSection } from "@/components/placement/TestimonialsSection";
import { getActiveJobListings } from "./actions";
import * as LucideIcons from "lucide-react";
import { getPlacementCategories } from "./actions";

// Placement regions data
const regions = [
  {
    id: "uae",
    country: "United Arab Emirates",
    shortName: "UAE",
    cities: ["Dubai", "Abu Dhabi", "Sharjah"],
    industries: ["Oil & Gas", "Construction", "Petrochemical"],
    jobs: "200+",
  },
  {
    id: "qatar",
    country: "Qatar",
    shortName: "Qatar",
    cities: ["Doha", "Al Wakrah", "Al Khor"],
    industries: ["LNG", "Oil & Gas", "Infrastructure"],
    jobs: "150+",
  },
  {
    id: "saudi",
    country: "Saudi Arabia",
    shortName: "KSA",
    cities: ["Riyadh", "Dammam", "Jubail"],
    industries: ["Oil & Gas", "Refinery", "Petrochemical"],
    jobs: "180+",
  },
  {
    id: "kuwait",
    country: "Kuwait",
    shortName: "Kuwait",
    cities: ["Kuwait City", "Ahmadi"],
    industries: ["Oil & Gas", "Refinery"],
    jobs: "80+",
  },
  {
    id: "bahrain",
    country: "Bahrain",
    shortName: "Bahrain",
    cities: ["Manama", "Riffa"],
    industries: ["Oil & Gas", "Aluminium"],
    jobs: "50+",
  },
  {
    id: "oman",
    country: "Oman",
    shortName: "Oman",
    cities: ["Muscat", "Sohar", "Sur"],
    industries: ["Oil & Gas", "Petrochemical"],
    jobs: "70+",
  },
  {
    id: "europe",
    country: "Europe",
    shortName: "Europe",
    cities: ["Germany", "Croatia", "Greece"],
    industries: ["Oil & Gas", "Petrochemical", "Industrial"],
    jobs: "100+",
  },
  {
    id: "israel",
    country: "Israel",
    shortName: "Israel",
    cities: ["Tel Aviv", "Haifa"],
    industries: ["Oil & Gas", "Petrochemical"],
    jobs: "40+",
  },
  {
    id: "africa",
    country: "Africa",
    shortName: "Africa",
    cities: ["Lagos", "Johannesburg", "Cairo"],
    industries: ["Oil & Gas", "Mining", "Refinery"],
    jobs: "60+",
  },
  {
    id: "russia",
    country: "Russia",
    shortName: "Russia",
    cities: ["Moscow", "St. Petersburg"],
    industries: ["Oil & Gas", "Petrochemical"],
    jobs: "50+",
  },
];

// Process steps
const processSteps = [
  { number: "01", title: "Register", description: "Create your profile", icon: FileCheck },
  { number: "02", title: "Screen", description: "Document verification", icon: ClipboardCheck },
  { number: "03", title: "Prepare", description: "Interview coaching", icon: Users },
  { number: "04", title: "Match", description: "Connect with employers", icon: Building2 },
  { number: "05", title: "Deploy", description: "Start your career", icon: Plane },
];

export default async function PlacementPage() {
  // const { data: jobs, error: jobsError } = await getActiveJobListings();

  const [
    { data: jobs, error: jobsError },
    categories
  ] = await Promise.all([
    getActiveJobListings(),
    getPlacementCategories()
  ]);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section
        aria-labelledby="placement-hero-heading"
        className="relative min-h-[70vh] bg-background overflow-hidden"
      >
        {/* Decorative background — bold, visible */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Base tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.05]" />

          {/* Gradient blobs — strong */}
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-primary/[0.07] blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/[0.06] blur-[80px]" />
          <div className="absolute top-1/4 left-1/2 w-[400px] h-[400px] rounded-full bg-primary/[0.04] blur-[60px]" />

          {/* Dot grid pattern — clearly visible */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, oklch(0.32 0.08 240 / 0.12) 1.2px, transparent 1.2px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* SVG flight paths — bold strokes + animated dots */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Curved flight routes */}
            <path d="M100 650 Q 450 150, 950 350" stroke="oklch(0.32 0.08 240 / 0.15)" strokeWidth="1.5" strokeDasharray="8 6" />
            <path d="M50 400 Q 400 50, 850 250" stroke="oklch(0.32 0.08 240 / 0.12)" strokeWidth="1.5" strokeDasharray="6 8" />
            <path d="M250 750 Q 700 250, 1200 400" stroke="oklch(0.32 0.08 240 / 0.13)" strokeWidth="1.5" strokeDasharray="8 6" />
            <path d="M-50 300 Q 300 -50, 750 180" stroke="oklch(0.32 0.08 240 / 0.10)" strokeWidth="1" strokeDasharray="4 6" />
            <path d="M400 750 Q 800 400, 1300 500" stroke="oklch(0.32 0.08 240 / 0.10)" strokeWidth="1" strokeDasharray="5 7" />

            {/* Animated flight icons along paths */}
            {/* Plane icon (Lucide Plane shape, pointing right) used as a reusable def */}
            <defs>
              <g id="plane-icon" transform="scale(-1,1)">
                <path d="M-8 0 L-3 -4 L6 -1 L10 -4 L12 -3 L9 0 L12 3 L10 4 L6 1 L-3 4 Z" />
              </g>
            </defs>

            {/* Plane 1 — main route */}
            <g fill="oklch(0.32 0.08 240 / 0.40)">
              <g>
                <animateMotion dur="8s" repeatCount="indefinite" rotate="auto" path="M100 650 Q 450 150, 950 350" />
                <use href="#plane-icon" transform="scale(1.4)" />
              </g>
              {/* Vapor trail */}
              <circle r="3" opacity="0.4">
                <animateMotion dur="8s" repeatCount="indefinite" path="M100 650 Q 450 150, 950 350" begin="-0.25s" />
              </circle>
              <circle r="2" opacity="0.2">
                <animateMotion dur="8s" repeatCount="indefinite" path="M100 650 Q 450 150, 950 350" begin="-0.5s" />
              </circle>
              <circle r="1.2" opacity="0.1">
                <animateMotion dur="8s" repeatCount="indefinite" path="M100 650 Q 450 150, 950 350" begin="-0.75s" />
              </circle>
            </g>

            {/* Plane 2 */}
            <g fill="oklch(0.32 0.08 240 / 0.30)">
              <g>
                <animateMotion dur="11s" repeatCount="indefinite" rotate="auto" path="M50 400 Q 400 50, 850 250" />
                <use href="#plane-icon" transform="scale(1.1)" />
              </g>
              <circle r="2.5" opacity="0.3">
                <animateMotion dur="11s" repeatCount="indefinite" path="M50 400 Q 400 50, 850 250" begin="-0.3s" />
              </circle>
              <circle r="1.5" opacity="0.15">
                <animateMotion dur="11s" repeatCount="indefinite" path="M50 400 Q 400 50, 850 250" begin="-0.6s" />
              </circle>
            </g>

            {/* Plane 3 */}
            <g fill="oklch(0.32 0.08 240 / 0.35)">
              <g>
                <animateMotion dur="13s" repeatCount="indefinite" rotate="auto" path="M250 750 Q 700 250, 1200 400" />
                <use href="#plane-icon" transform="scale(1.3)" />
              </g>
              <circle r="3" opacity="0.35">
                <animateMotion dur="13s" repeatCount="indefinite" path="M250 750 Q 700 250, 1200 400" begin="-0.3s" />
              </circle>
              <circle r="1.8" opacity="0.18">
                <animateMotion dur="13s" repeatCount="indefinite" path="M250 750 Q 700 250, 1200 400" begin="-0.6s" />
              </circle>
            </g>

            {/* Static destination dots */}
            <circle cx="140" cy="220" r="5" fill="oklch(0.32 0.08 240 / 0.12)" />
            <circle cx="380" cy="520" r="4" fill="oklch(0.32 0.08 240 / 0.10)" />
            <circle cx="680" cy="140" r="5" fill="oklch(0.32 0.08 240 / 0.12)" />
            <circle cx="1220" cy="320" r="4" fill="oklch(0.32 0.08 240 / 0.10)" />
            <circle cx="1100" cy="620" r="5" fill="oklch(0.32 0.08 240 / 0.12)" />
            <circle cx="520" cy="680" r="4" fill="oklch(0.32 0.08 240 / 0.10)" />
            <circle cx="900" cy="100" r="3.5" fill="oklch(0.32 0.08 240 / 0.08)" />
            <circle cx="200" cy="450" r="3.5" fill="oklch(0.32 0.08 240 / 0.08)" />

            {/* Small crosshair markers */}
            <g stroke="oklch(0.32 0.08 240 / 0.15)" strokeWidth="1">
              <line x1="135" y1="220" x2="145" y2="220" /><line x1="140" y1="215" x2="140" y2="225" />
              <line x1="675" y1="140" x2="685" y2="140" /><line x1="680" y1="135" x2="680" y2="145" />
              <line x1="1095" y1="620" x2="1105" y2="620" /><line x1="1100" y1="615" x2="1100" y2="625" />
            </g>
          </svg>

          {/* Corner accents — visible */}
          <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-primary/15 rounded-tl-sm" />
          <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-primary/15 rounded-br-sm" />

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Navigation */}
        <nav className="relative z-50 w-full py-4" aria-label="Main navigation">
          <div className="w-full px-5 sm:px-8 lg:px-[4%] xl:px-[6%]">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm group"
              >
                <Image
                  src="/logo-fm-international-v1.png"
                  alt="FM International"
                  width={56}
                  height={56}
                  className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
                  priority
                />
                <div className="hidden sm:block">
                  <p className="font-display text-foreground text-sm tracking-tight">
                    FM International
                  </p>
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-1 bg-primary/5 border border-primary/10 rounded-full px-2 py-1.5">
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 px-4 py-2 rounded-full transition-colors">
                  About
                </Link>
                <Link href="/training" className="text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 px-4 py-2 rounded-full transition-colors">
                  Training
                </Link>
                <Link href="/placement" className="text-sm text-primary bg-primary/10 px-4 py-2 rounded-full transition-colors font-medium">
                  Placement
                </Link>
                <Link href="/partners" className="text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 px-4 py-2 rounded-full transition-colors">
                  Partners
                </Link>
                <Link href="/verify" className="text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 px-4 py-2 rounded-full transition-colors">
                  Verify
                </Link>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 px-4 py-2 rounded-full transition-colors">
                  Contact
                </Link>
              </div>

              <div className="hidden lg:flex items-center gap-4">
                <Link href="/contact">
                  <Button className="rounded-full shadow-md shadow-primary/20 px-6 py-2.5 h-auto">
                    Enquire Now
                  </Button>
                </Link>
              </div>

              <MobileNav variant="light" />
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%] py-16 lg:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left content */}
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-medium text-primary mb-8">
                  <Globe2 className="w-4 h-4" />
                  <span>FM International - Placement Division</span>
                </div>

                <h1
                  id="placement-hero-heading"
                  className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.1] mb-6 tracking-tight"
                >
                  Your Gateway to{" "}
                  <span className="text-primary">Global Careers</span>
                </h1>

                <p className="text-lg text-muted-foreground max-w-lg leading-relaxed mb-10">
                  Connecting skilled professionals with leading employers worldwide.
                  Direct placement across the Middle East, Europe, Israel, Russia, and India.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 mb-12">
                  <Link href="/contact">
                    <Button size="lg" className="w-full sm:w-auto gap-2 h-12 px-6 shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200">
                      Register Now
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="#current-openings">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 h-12 px-6 hover:border-primary/50 hover:text-primary active:scale-[0.98] transition-all duration-200">
                      <Briefcase className="w-4 h-4" />
                      Live Opportunities
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <dl className="grid grid-cols-3 gap-6 max-w-md">
                  <div>
                    <dd className="font-display text-2xl sm:text-3xl text-foreground mb-1">
                      <AnimatedCounter value={15} suffix="" />
                      <span className="text-primary">+</span>
                    </dd>
                    <dt className="text-xs text-muted-foreground uppercase tracking-wider">
                      Partners
                    </dt>
                  </div>
                  <div>
                    <dd className="font-display text-2xl sm:text-3xl text-foreground mb-1">
                      <AnimatedCounter value={48} suffix="" />
                      <span className="text-primary">+</span>
                    </dd>
                    <dt className="text-xs text-muted-foreground uppercase tracking-wider">
                      Countries
                    </dt>
                  </div>
                  <div>
                    <dd className="font-display text-2xl sm:text-3xl text-foreground mb-1">
                      <AnimatedCounter value={3000} suffix="" />
                      <span className="text-primary">+</span>
                    </dd>
                    <dt className="text-xs text-muted-foreground uppercase tracking-wider">
                      Placed
                    </dt>
                  </div>
                </dl>
              </div>

              {/* Right - Floating flags around globe */}
              <div className="relative hidden lg:block">
                <div className="relative aspect-square max-w-lg mx-auto">
                  <FloatingFlags />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section
        aria-labelledby="categories-heading"
        className="py-16 sm:py-20 lg:py-24 bg-background"
      >
        <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
          <ScrollReveal>
            <header className="text-center mb-12 lg:mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px w-8 bg-primary/40" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Roles We Place
                </span>
                <div className="h-px w-8 bg-primary/40" />
              </div>
              <h2
                id="categories-heading"
                className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground max-w-3xl mx-auto leading-[1.1]"
              >
                Find your perfect{" "}
                <span className="text-primary">role</span>
              </h2>
            </header>
          </ScrollReveal>

          {/* Categories grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category: any, index: number) => {
              // 3. Dynamically resolve the icon
              const IconComponent = (LucideIcons as any)[category.icon_name] || LucideIcons.Briefcase;

              return (
                <ScrollReveal key={category.id} delay={index * 50}>
                  <article className="group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-display text-xl text-foreground">
                        {category.title}
                      </h3>
                    </div>
                    <ul className="space-y-2 pl-16">
                      {category.roles.map((role: string) => (
                        <li key={role} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <LucideIcons.CheckCircle2 className="w-3.5 h-3.5 text-primary/50" />
                          <span>{role}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <CurrentOpenings initialJobs={jobs} initialError={jobsError} />

      {/* How It Works */}
      <section
        aria-labelledby="how-it-works-heading"
        className="py-16 sm:py-20 lg:py-24 bg-primary text-white overflow-hidden"
      >
        <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
          <ScrollReveal>
            <header className="text-center mb-12 lg:mb-16">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-white/70 mb-4">
                Your Journey
              </span>
              <h2
                id="how-it-works-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl text-white max-w-2xl mx-auto"
              >
                From registration to deployment
              </h2>
            </header>
          </ScrollReveal>

          {/* Process steps */}
          <div className="relative">
            {/* Connection line - desktop with gradient */}
            <div className="hidden lg:block absolute top-16 left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4">
              {processSteps.map((step, index) => (
                <ScrollReveal key={step.number} delay={index * 80}>
                  <div className="relative text-center group">
                    {/* Number circle */}
                    <div className="relative z-10 w-12 h-12 mx-auto mb-4 rounded-full bg-white text-primary font-display text-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                      {step.number}
                    </div>
                    <h3 className="font-display text-base text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-white/70">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Employers */}
      <section
        aria-labelledby="employers-heading"
        className="py-16 sm:py-20 lg:py-24 bg-secondary/30"
      >
        <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <ScrollReveal>
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-px w-12 bg-primary" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      For Employers
                    </span>
                  </div>
                  <h2
                    id="employers-heading"
                    className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6 leading-[1.1]"
                  >
                    Looking for skilled{" "}
                    <span className="text-primary">manpower?</span>
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    Partner with FM International for reliable workforce solutions.
                    We provide pre-screened, industry-ready candidates for your projects.
                  </p>
                  <Link href="/contact">
                    <Button size="lg" className="gap-2 h-12 px-6">
                      Partner With Us
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: "Pre-screened Candidates", description: "Verified skills and credentials" },
                    { title: "Industry Ready", description: "Trained for immediate deployment" },
                    { title: "Visa Support", description: "End-to-end documentation" },
                    { title: "Quick Turnaround", description: "Efficient recruitment process" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="p-5 bg-background rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                    >
                      <h3 className="font-display text-base text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section
        aria-labelledby="placement-cta-heading"
        className="py-16 sm:py-20 lg:py-24 bg-background"
      >
        <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary mb-4">
                Start Today
              </span>
              <h2
                id="placement-cta-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6"
              >
                Ready to work abroad?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                Take the first step towards your international career. Register with FM International today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto gap-2 h-14 px-8 shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] font-semibold transition-all duration-200"
                  >
                    Register Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/training">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-14 px-8 font-semibold hover:border-primary/50 hover:text-primary active:scale-[0.98] transition-all duration-200"
                  >
                    View Training
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
