import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/ui/mobile-nav";
import { ScrollReveal, AnimatedCounter } from "@/components/ui/scroll-reveal";
import {
  ArrowRight,
  GraduationCap,
  Clock,
  Award,
  Users,
  BookOpen,
  Wrench,
  Shield,
  Gauge,
  Cpu,
  Flame,
  PenTool,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Course data
const courses = [
  {
    id: "piping-design",
    title: "Piping Design Engineering",
    duration: "3 Months",
    description: "Master piping layouts, isometrics, and P&ID interpretation for Oil & Gas facilities.",
    icon: PenTool,
    topics: ["P&ID Reading", "Isometric Drawing", "Pipe Stress Analysis", "Material Selection"],
  },
  {
    id: "process-engineering",
    title: "Process Engineering",
    duration: "4 Months",
    description: "Learn process flow diagrams, heat & mass balance, and equipment sizing.",
    icon: Gauge,
    topics: ["PFD Development", "Equipment Sizing", "Process Simulation", "Safety Systems"],
  },
  {
    id: "oil-gas-safety",
    title: "Oil & Gas Safety (HSE)",
    duration: "2 Months",
    description: "NEBOSH & IOSH certified safety training for hazardous environments.",
    icon: Shield,
    topics: ["Risk Assessment", "Permit to Work", "Emergency Response", "NEBOSH Prep"],
  },
  {
    id: "qa-qc",
    title: "QA/QC Inspection",
    duration: "3 Months",
    description: "Quality assurance and control techniques for welding, piping, and fabrication.",
    icon: CheckCircle2,
    topics: ["Welding Inspection", "NDT Methods", "API Standards", "Documentation"],
  },
  {
    id: "instrumentation",
    title: "Instrumentation Engineering",
    duration: "3 Months",
    description: "Control systems, PLCs, and instrumentation for process industries.",
    icon: Cpu,
    topics: ["PLC Programming", "Control Loops", "Instrument Calibration", "DCS Systems"],
  },
  {
    id: "mechanical",
    title: "Mechanical Maintenance",
    duration: "3 Months",
    description: "Maintenance strategies for rotating equipment, pumps, and compressors.",
    icon: Wrench,
    topics: ["Pump Maintenance", "Compressor Systems", "Predictive Maintenance", "Troubleshooting"],
  },
  {
    id: "welding",
    title: "Welding Technology",
    duration: "2 Months",
    description: "Advanced welding techniques and certification preparation.",
    icon: Flame,
    topics: ["SMAW/GTAW/GMAW", "Welding Positions", "WPS/PQR", "Certification Prep"],
  },
  {
    id: "autocad",
    title: "AutoCAD & Plant Design",
    duration: "2 Months",
    description: "Industry-standard CAD software for plant layout and 3D modeling.",
    icon: BookOpen,
    topics: ["AutoCAD 2D/3D", "Plant 3D", "Navisworks", "Project Documentation"],
  },
];

// Process steps
const processSteps = [
  { number: "01", title: "Enquire", description: "Connect with our counselors" },
  { number: "02", title: "Enroll", description: "Complete registration" },
  { number: "03", title: "Learn", description: "Hands-on training" },
  { number: "04", title: "Certify", description: "Get QR-verified certificate" },
  { number: "05", title: "Get Placed", description: "Start your career" },
];

export default function TrainingPage() {
  return (
    <main className="min-h-screen">
        {/* Hero Section */}
        <section
          aria-labelledby="training-hero-heading"
          className="relative min-h-[70vh] bg-background overflow-hidden"
        >
          {/* Decorative background - green tinted */}
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
                    src="/logo-fm-institute.png"
                    alt="FM Institute"
                    width={56}
                    height={56}
                    className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
                    priority
                  />
                  <div className="hidden sm:block">
                    <p className="font-display text-foreground text-sm tracking-tight">
                      FM Institute
                    </p>
                  </div>
                </Link>

                <div className="hidden lg:flex items-center gap-1 bg-primary/5 border border-primary/10 rounded-full px-2 py-1.5">
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 px-4 py-2 rounded-full transition-colors">
                    About
                  </Link>
                  <Link href="/training" className="text-sm text-primary bg-primary/10 px-4 py-2 rounded-full transition-colors font-medium">
                    Training
                  </Link>
                  <Link href="/placement" className="text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 px-4 py-2 rounded-full transition-colors">
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
                    <GraduationCap className="w-4 h-4" />
                    <span>FM Institute - Training Division</span>
                  </div>

                  <h1
                    id="training-hero-heading"
                    className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.1] mb-6 tracking-tight"
                  >
                    Industry-Focused Training for{" "}
                    <span className="text-primary">Global Careers</span>
                  </h1>

                  <p className="text-lg text-muted-foreground max-w-lg leading-relaxed mb-10">
                    Build expertise in Oil & Gas, Piping Design, Safety Standards, and Process Engineering.
                    Get certified with skills that employers demand worldwide.
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-12">
                    <Link href="/contact">
                      <Button size="lg" className="w-full sm:w-auto gap-2 h-12 px-6 shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200">
                        Enquire Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </Link>
                    <Link href="#courses">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-6 hover:border-primary/50 hover:text-primary active:scale-[0.98] transition-all duration-200">
                        View Courses
                      </Button>
                    </Link>
                  </div>

                  {/* Stats */}
                  <dl className="grid grid-cols-3 gap-6 max-w-md">
                    <div>
                      <dd className="font-display text-2xl sm:text-3xl text-foreground mb-1">
                        <AnimatedCounter value={12} suffix="" />
                        <span className="text-primary">+</span>
                      </dd>
                      <dt className="text-xs text-muted-foreground uppercase tracking-wider">
                        Courses
                      </dt>
                    </div>
                    <div>
                      <dd className="font-display text-2xl sm:text-3xl text-foreground mb-1">
                        <AnimatedCounter value={500} suffix="" />
                        <span className="text-primary">+</span>
                      </dd>
                      <dt className="text-xs text-muted-foreground uppercase tracking-wider">
                        Trained
                      </dt>
                    </div>
                    <div>
                      <dd className="font-display text-2xl sm:text-3xl text-foreground mb-1">
                        <AnimatedCounter value={98} suffix="" />
                        <span className="text-primary">%</span>
                      </dd>
                      <dt className="text-xs text-muted-foreground uppercase tracking-wider">
                        Placement
                      </dt>
                    </div>
                  </dl>
                </div>

                {/* Right - Visual */}
                <div className="relative hidden lg:block">
                  <div className="relative aspect-square max-w-md mx-auto">
                    {/* Abstract decorative element */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-[3rem] transform rotate-3 animate-fade-in" />
                    <div className="absolute inset-4 bg-gradient-to-tl from-primary/10 via-transparent to-primary/5 rounded-[2.5rem] transform -rotate-2 animate-fade-in delay-100" />

                    {/* Icon grid */}
                    <div className="absolute inset-8 grid grid-cols-3 gap-4">
                      {[GraduationCap, Wrench, Shield, Gauge, Cpu, Flame].map((Icon, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-center bg-background/80 backdrop-blur rounded-2xl shadow-lg border border-primary/10 opacity-0 animate-scale-in hover:scale-105 hover:shadow-xl transition-all duration-300"
                          style={{ animationDelay: `${300 + i * 100}ms`, animationFillMode: 'forwards' }}
                        >
                          <Icon className="w-8 h-8 text-primary/70" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section
          id="courses"
          aria-labelledby="courses-heading"
          className="py-16 sm:py-20 lg:py-24 bg-secondary/30"
        >
          <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
            <ScrollReveal>
              <header className="mb-12 lg:mb-16">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-12 bg-primary" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Our Programs
                  </span>
                </div>
                <h2
                  id="courses-heading"
                  className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground max-w-3xl leading-[1.1]"
                >
                  Industry-certified courses for{" "}
                  <span className="text-primary">your success</span>
                </h2>
              </header>
            </ScrollReveal>

            {/* Course grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {courses.map((course, index) => (
                <ScrollReveal key={course.id} delay={index * 50}>
                  <article className="group h-full bg-background rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 ease-out">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 icon-container flex-shrink-0" aria-hidden="true">
                      <course.icon className="w-6 h-6 text-primary" />
                    </div>

                    {/* Duration badge */}
                    <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                      <span>{course.duration}</span>
                    </div>

                    <h3 className="font-display text-lg text-foreground mb-2 leading-tight line-clamp-2 min-h-[3.5rem]">
                      {course.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {course.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="text-[10px] px-2 py-1 rounded-full bg-secondary text-muted-foreground truncate max-w-[120px]"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
                      aria-label={`Learn more about ${course.title}`}
                    >
                      Learn More
                      <ArrowRight className="w-3.5 h-3.5 arrow-animate" aria-hidden="true" />
                    </Link>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section
          aria-labelledby="why-choose-heading"
          className="py-16 sm:py-20 lg:py-24 bg-background"
        >
          <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
            <ScrollReveal>
              <header className="text-center mb-12 lg:mb-16">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px w-8 bg-primary/40" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Why FM Institute
                  </span>
                  <div className="h-px w-8 bg-primary/40" />
                </div>
                <h2
                  id="why-choose-heading"
                  className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground max-w-3xl mx-auto leading-[1.1]"
                >
                  Training that leads to{" "}
                  <span className="text-primary">real careers</span>
                </h2>
              </header>
            </ScrollReveal>

            {/* Features */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 lg:gap-x-12 gap-y-12 lg:gap-y-16">
              {[
                {
                  number: "01",
                  title: "Industry Certified",
                  description: "Certifications recognized by employers across India and the Gulf region.",
                  icon: Award,
                },
                {
                  number: "02",
                  title: "Expert Faculty",
                  description: "Learn from professionals with 10+ years of real industry experience.",
                  icon: Users,
                },
                {
                  number: "03",
                  title: "Hands-on Training",
                  description: "Practical projects and real equipment training, not just theory.",
                  icon: Wrench,
                },
                {
                  number: "04",
                  title: "Placement Support",
                  description: "Direct pathway to jobs through FM International placement services.",
                  icon: GraduationCap,
                },
              ].map((item, index) => (
                <ScrollReveal key={item.number} delay={index * 80}>
                  <article className="group">
                    <span className="block font-display text-6xl lg:text-7xl text-primary/10 mb-4 leading-none transition-colors duration-300 group-hover:text-primary/20">
                      {item.number}
                    </span>
                    <div className="flex items-center gap-3 mb-3">
                      <item.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                      <h3 className="font-display text-xl lg:text-2xl text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                      {item.description}
                    </p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Process */}
        <section
          aria-labelledby="process-heading"
          className="py-16 sm:py-20 lg:py-24 bg-primary text-white overflow-hidden"
        >
          <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
            <ScrollReveal>
              <header className="text-center mb-12 lg:mb-16">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-white/70 mb-4">
                  Your Journey
                </span>
                <h2
                  id="process-heading"
                  className="font-display text-3xl sm:text-4xl lg:text-5xl text-white max-w-2xl mx-auto"
                >
                  From enquiry to employment
                </h2>
              </header>
            </ScrollReveal>

            {/* Process steps */}
            <div className="relative">
              {/* Connection line - desktop with gradient */}
              <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
                {processSteps.map((step, index) => (
                  <ScrollReveal key={step.number} delay={index * 100}>
                    <div className="relative text-center group">
                      {/* Number circle */}
                      <div className="relative z-10 w-12 h-12 mx-auto mb-4 rounded-full bg-white text-primary font-display text-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                        {step.number}
                      </div>
                      <h3 className="font-display text-lg text-white mb-1 group-hover:text-white/90 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-white/70">
                        {step.description}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          aria-labelledby="training-cta-heading"
          className="py-16 sm:py-20 lg:py-24 bg-background"
        >
          <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto text-center">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary mb-4">
                  Start Today
                </span>
                <h2
                  id="training-cta-heading"
                  className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6"
                >
                  Ready to build your career?
                </h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                  Join hundreds of successful professionals who started their global career journey with FM Institute.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto gap-2 h-14 px-8 shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] font-semibold transition-all duration-200"
                    >
                      Enquire Now
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/placement">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto h-14 px-8 font-semibold hover:border-primary/50 hover:text-primary active:scale-[0.98] transition-all duration-200"
                    >
                      View Placements
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-foreground text-background py-16 lg:py-20" role="contentinfo">
          <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
              <div className="sm:col-span-2 lg:col-span-1">
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 mb-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm group"
                >
                  <Image
                    src="/logo-fm-global.png"
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
                  Your trusted partner for specialized training in Oil & Gas and
                  international career placement.
                </p>
              </div>

              <nav aria-label="Footer navigation">
                <h3 className="font-display text-background text-sm mb-4">Quick Links</h3>
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
                        className="text-sm text-background/70 hover:text-background transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div>
                <h3 className="font-display text-background text-sm mb-4">Divisions</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/training"
                      className="text-sm text-background/70 hover:text-background transition-colors flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      FM Institute
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/placement"
                      className="text-sm text-background/70 hover:text-background transition-colors flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      FM International
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-display text-background text-sm mb-4">Contact</h3>
                <address className="not-italic space-y-3 text-sm text-background/70">
                  <p>Chennai, Tamil Nadu, India</p>
                  <p>
                    <a href="mailto:contact@fmglobalcareers.com" className="hover:text-background transition-colors">
                      contact@fmglobalcareers.com
                    </a>
                  </p>
                  <p>
                    <a href="tel:+919999999999" className="hover:text-background transition-colors">
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
              <p className="text-xs text-background/40">
                Building Global Oil & Gas Careers
              </p>
            </div>
          </div>
        </footer>
    </main>
  );
}
