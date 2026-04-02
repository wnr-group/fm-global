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
  ClipboardCheck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/Footer";

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
];

// Job categories
const jobCategories = [
  {
    title: "Engineers",
    roles: ["Piping Engineer", "Process Engineer", "Mechanical Engineer", "Electrical Engineer"],
    icon: Briefcase,
  },
  {
    title: "Technicians",
    roles: ["Instrument Technician", "Electrical Technician", "Mechanical Technician"],
    icon: Wrench,
  },
  {
    title: "Safety Officers",
    roles: ["HSE Officer", "Fire & Safety", "Environmental Officer"],
    icon: Shield,
  },
  {
    title: "QA/QC",
    roles: ["QC Inspector", "Welding Inspector", "NDT Technician"],
    icon: ClipboardCheck,
  },
  {
    title: "Supervisors",
    roles: ["Site Supervisor", "Foreman", "Project Coordinator"],
    icon: HardHat,
  },
  {
    title: "Skilled Workers",
    roles: ["Welder", "Fabricator", "Fitter", "Rigger"],
    icon: Users,
  },
];

// Process steps
const processSteps = [
  { number: "01", title: "Register", description: "Create your profile", icon: FileCheck },
  { number: "02", title: "Screen", description: "Document verification", icon: ClipboardCheck },
  { number: "03", title: "Prepare", description: "Interview coaching", icon: Users },
  { number: "04", title: "Match", description: "Connect with employers", icon: Building2 },
  { number: "05", title: "Process", description: "Visa & documentation", icon: FileCheck },
  { number: "06", title: "Deploy", description: "Start your career", icon: Plane },
];

export default function PlacementPage() {
  return (
    <main className="min-h-screen">
        {/* Hero Section */}
        <section
          aria-labelledby="placement-hero-heading"
          className="relative min-h-[70vh] bg-background overflow-hidden"
        >
          {/* Decorative background - orange/warm tinted */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/[0.06] to-transparent blur-3xl" />
            <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-primary/[0.03] to-transparent blur-3xl" />
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
                    src="/logo-fm-international.png"
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
                    <span className="text-primary">Gulf Careers</span>
                  </h1>

                  <p className="text-lg text-muted-foreground max-w-lg leading-relaxed mb-10">
                    Connecting skilled professionals with leading employers across the Gulf region.
                    Direct placement in UAE, Qatar, Saudi Arabia, Kuwait, Bahrain, and Oman.
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-12">
                    <Link href="/contact">
                      <Button size="lg" className="w-full sm:w-auto gap-2 h-12 px-6 shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200">
                        Register Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </Link>
                    <Link href="#regions">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-6 hover:border-primary/50 hover:text-primary active:scale-[0.98] transition-all duration-200">
                        View Locations
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
                        <AnimatedCounter value={6} suffix="" />
                        <span className="text-primary"></span>
                      </dd>
                      <dt className="text-xs text-muted-foreground uppercase tracking-wider">
                        Countries
                      </dt>
                    </div>
                    <div>
                      <dd className="font-display text-2xl sm:text-3xl text-foreground mb-1">
                        <AnimatedCounter value={500} suffix="" />
                        <span className="text-primary">+</span>
                      </dd>
                      <dt className="text-xs text-muted-foreground uppercase tracking-wider">
                        Placed
                      </dt>
                    </div>
                  </dl>
                </div>

                {/* Right - Visual map representation */}
                <div className="relative hidden lg:block">
                  <div className="relative aspect-square max-w-md mx-auto">
                    {/* Abstract map decoration */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-[3rem] animate-fade-in" />

                    {/* Country markers */}
                    <div className="absolute inset-0 p-8">
                      {regions.map((region, i) => (
                        <div
                          key={region.id}
                          className="absolute flex items-center gap-2 bg-background/90 backdrop-blur rounded-full px-3 py-1.5 shadow-lg border border-primary/10 opacity-0 animate-scale-in hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-default"
                          style={{
                            top: `${20 + (i % 3) * 25}%`,
                            left: `${10 + (i % 2) * 40 + (i * 5)}%`,
                            animationDelay: `${400 + i * 100}ms`,
                            animationFillMode: 'forwards',
                          }}
                        >
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-medium text-foreground">{region.shortName}</span>
                        </div>
                      ))}
                    </div>

                    {/* Center globe icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-fade-in delay-200">
                        <Globe2 className="w-12 h-12 text-primary/50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Placement Regions */}
        <section
          id="regions"
          aria-labelledby="regions-heading"
          className="py-16 sm:py-20 lg:py-24 bg-secondary/30"
        >
          <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
            <ScrollReveal>
              <header className="mb-12 lg:mb-16">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-12 bg-primary" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Where We Place
                  </span>
                </div>
                <h2
                  id="regions-heading"
                  className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground max-w-3xl leading-[1.1]"
                >
                  Opportunities across the{" "}
                  <span className="text-primary">Gulf region</span>
                </h2>
              </header>
            </ScrollReveal>

            {/* Regions grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {regions.map((region, index) => (
                <ScrollReveal key={region.id} delay={index * 50}>
                  <article className="group h-full bg-background rounded-2xl p-6 lg:p-8 border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 ease-out">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h3 className="font-display text-xl text-foreground mb-1 truncate">
                          {region.country}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                          {region.cities.slice(0, 2).join(", ")}
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {region.jobs} Jobs
                      </div>
                    </div>

                    {/* Industries */}
                    <div className="mb-5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Industries</p>
                      <div className="flex flex-wrap gap-1.5">
                        {region.industries.map((industry) => (
                          <span
                            key={industry}
                            className="text-xs px-2.5 py-1 rounded-full bg-secondary text-foreground"
                          >
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
                      aria-label={`View opportunities in ${region.country}`}
                    >
                      View Opportunities
                      <ArrowUpRight className="w-3.5 h-3.5 arrow-up-animate" aria-hidden="true" />
                    </Link>
                  </article>
                </ScrollReveal>
              ))}
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
              {jobCategories.map((category, index) => (
                <ScrollReveal key={category.title} delay={index * 50}>
                  <article className="group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center icon-container flex-shrink-0" aria-hidden="true">
                        <category.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-display text-xl text-foreground">
                        {category.title}
                      </h3>
                    </div>
                    <ul className="space-y-2 pl-16">
                      {category.roles.map((role) => (
                        <li key={role} className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary/50 flex-shrink-0" aria-hidden="true" />
                          <span className="truncate">{role}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

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
                    ].map((item, index) => (
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
