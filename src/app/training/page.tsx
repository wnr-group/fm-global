import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/ui/mobile-nav";
import { ScrollReveal, AnimatedCounter } from "@/components/ui/scroll-reveal";
import { TrackedCTA } from "@/components/ui/tracked-cta";
import {
  ArrowRight,
  GraduationCap,
  Clock,
  Banknote,
  BookOpen,
  CheckCircle2,
  Video,
  Radio,
  FileText,
  ClipboardCheck,
  Award,
  Factory,
  Eye,
  Languages,
  Smartphone,
  CalendarCheck,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/Footer";

// =============================================================================
// COURSE DATA
// =============================================================================

interface CourseModule {
  number: string;
  title: string;
}

interface Country {
  name: string;
  flag: string;
  companies: string;
}

interface Course {
  id: string;
  number: string;
  title: string;
  tagline: string;
  image: string;
  highlights: string[];
  moduleCount: number;
  duration: string;
  salaryRange: string;
  syllabus: CourseModule[];
  skills?: string[];
  trainingMethod?: { icon: React.ElementType; label: string }[];
  tools?: string[];
  careers: {
    roles: string[];
    industry?: string;
    salary: string;
    salaryNote?: string;
    countries: Country[];
  };
  certification?: string[];
  interviewSupport?: string[];
  whoCanJoin: string[];
}

const mechanicalTechnician: Course = {
  id: "mechanical-technician",
  number: "01",
  title: "Mechanical Technician",
  tagline: "Learn Heat Exchangers, Vessels, Tanks & Columns with Real Site Methods",
  image: "/training/course-mechanical-technician.webp",
  highlights: [
    "14 Modules – Complete Shutdown Training",
    "Online Learning + Weekly Live Sessions",
    "Beginner to Advanced (ITI / Diploma Friendly)",
    "Gulf Standard Training (KNPC, ADNOC, Qatar Gas)",
    "Placement Support Available",
    "Training Duration: 1 Month",
  ],
  moduleCount: 14,
  duration: "1 Month",
  salaryRange: "₹30K – ₹90K",
  syllabus: [
    { number: "01", title: "Introduction to General Fitter" },
    { number: "02", title: "Gasket, Flange & Blind – Types & Usage" },
    { number: "03", title: "Types of Valves & Applications" },
    { number: "04", title: "Types of Static Equipment" },
    { number: "05", title: "Tools & Their Uses" },
    { number: "06", title: "Dismantling & Assembly Procedures" },
    { number: "07", title: "Alignment & Leveling Techniques" },
    { number: "08", title: "Heat Exchangers – Types & Maintenance" },
    { number: "09", title: "Vessels – Maintenance & Safety" },
    { number: "10", title: "Tanks – Cleaning & Repair" },
    { number: "11", title: "Columns – Tray & Packing Maintenance" },
    { number: "12", title: "Shutdown Job Roles & Daily Routine" },
    { number: "13", title: "Safety Rules, Do's & Don'ts" },
    { number: "14", title: "Real Site Examples & Revision" },
  ],
  skills: [
    "Flange opening & closing",
    "Gasket fitting & torque method",
    "Heat exchanger tube bundle removal",
    "Vessel & tank entry procedures",
    "Column tray & packing handling",
    "Alignment & leveling techniques",
    "Hydrotest & leak testing",
    "Real shutdown work sequence",
  ],
  careers: {
    roles: [
      "General Fitter",
      "Mechanical Helper → Fitter",
      "Shutdown Maintenance Technician",
      "Static Equipment Technician",
    ],
    salary: "₹30,000 – ₹90,000/month",
    countries: [
      { name: "Kuwait", flag: "🇰🇼", companies: "KNPC Projects" },
      { name: "UAE", flag: "🇦🇪", companies: "ADNOC, Dubai" },
      { name: "Qatar", flag: "🇶🇦", companies: "Qatar Gas" },
      { name: "Saudi Arabia", flag: "🇸🇦", companies: "Aramco Projects" },
    ],
  },
  whoCanJoin: [
    "ITI (Mechanical / Fitter / Turner)",
    "Diploma Mechanical",
    "Engineering Students",
    "Freshers (No Experience Needed)",
    "Arts Students",
  ],
};

const permitReceiver: Course = {
  id: "permit-receiver",
  number: "02",
  title: "Permit Receiver",
  tagline: "Learn PTW System, Safety Procedures & Real Shutdown Site Practices",
  image: "/training/course-permit-receiver.webp",
  highlights: [
    "No Experience Required",
    "Gulf Standard Training (KNPC, ADNOC, Qatar Gas)",
    "100% Online Training",
    "Gulf Shutdown Job Opportunities",
    "Training Duration: 1 Month",
  ],
  moduleCount: 10,
  duration: "1 Month",
  salaryRange: "₹50K – ₹70K",
  syllabus: [
    { number: "01", title: "PTW Fundamentals & Roles" },
    { number: "02", title: "Hazard Identification (JSA / TRA)" },
    { number: "03", title: "Permit Types (Hot, Cold, Confined Space, etc.)" },
    { number: "04", title: "Gas Testing & Monitoring" },
    { number: "05", title: "LOTO & Isolation" },
    { number: "06", title: "Confined Space Entry" },
    { number: "07", title: "Work at Height" },
    { number: "08", title: "SIMOPS & Permit Lifecycle" },
    { number: "09", title: "Communication & Logbook" },
    { number: "10", title: "Site Scenarios & Safety Case Studies" },
  ],
  trainingMethod: [
    { icon: Video, label: "Video Lessons" },
    { icon: Radio, label: "Live Classes" },
    { icon: FileText, label: "Case Studies" },
    { icon: ClipboardCheck, label: "Daily Assessments" },
    { icon: Award, label: "Final Certificate" },
  ],
  tools: [
    "Real Permit Formats",
    "Gas Detector Basics",
    "LOTO Tag Understanding",
    "Toolbox Talk Practice",
    "Site Scenario Training",
  ],
  careers: {
    roles: ["Permit Receiver", "Safety Coordinator"],
    industry: "Oil & Gas / Refinery / Shutdown Projects",
    salary: "₹50,000 – ₹70,000/month",
    salaryNote: "with OT",
    countries: [
      { name: "Kuwait", flag: "🇰🇼", companies: "KNPC Projects" },
      { name: "UAE", flag: "🇦🇪", companies: "ADNOC, Dubai" },
      { name: "Qatar", flag: "🇶🇦", companies: "Qatar Gas, RasGas" },
      { name: "Saudi Arabia", flag: "🇸🇦", companies: "Aramco Projects" },
    ],
  },
  certification: [
    "FM Institute Permit Receiver Certification",
    "Industry-Oriented Training Completion Certificate",
  ],
  interviewSupport: [
    "Real Interview Questions",
    "Mock Interviews",
    "Resume Guidance",
    "Placement Assistance",
  ],
  whoCanJoin: [
    "Diploma / Engineering Graduates",
    "ITI Candidates",
    "Freshers (0 Experience)",
    "Gulf Job Seekers",
  ],
};

const courses = [mechanicalTechnician, permitReceiver];

const whyChooseFeatures = [
  { icon: Factory, title: "Real Site-Based Training" },
  { icon: Eye, title: "Visual Learning", subtitle: "Photos & Diagrams" },
  { icon: Languages, title: "Tamil + English Explanation" },
  { icon: Smartphone, title: "App Access", subtitle: "24×7 Learning" },
  { icon: CalendarCheck, title: "Weekly Tests + Trainer Support" },
  { icon: BadgeCheck, title: "Certificate Provided" },
];

const differentiators = [
  "Industry-standard shutdown training",
  "Designed for freshers (step-by-step)",
  "Focus on job-ready skills (not theory)",
  "Gulf interview preparation included",
];

const gulfCountries = [
  { name: "Kuwait", flag: "🇰🇼", companies: "KNPC Projects" },
  { name: "UAE", flag: "🇦🇪", companies: "ADNOC, Dubai" },
  { name: "Qatar", flag: "🇶🇦", companies: "Qatar Gas, RasGas" },
  { name: "Saudi Arabia", flag: "🇸🇦", companies: "Aramco Projects" },
];

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function TrainingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Course Overview Cards */}
      <CourseOverviewSection courses={courses} />

      {/* Mechanical Technician Full Detail */}
      <CourseDetailSection course={mechanicalTechnician} variant="dark" />

      {/* Permit Receiver Full Detail */}
      <CourseDetailSection course={permitReceiver} variant="light" />

      {/* Why Choose FM Institute */}
      <WhyChooseSection />

      {/* Career Destinations */}
      <CareerDestinationsSection />

      {/* Final CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  );
}

// =============================================================================
// HERO SECTION
// =============================================================================

function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/training/hero-refinery-dusk.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay - heavier at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80" />
        {/* Grain overlay */}
        <div className="absolute inset-0 grain-overlay" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 w-full py-4" aria-label="Main navigation">
        <div className="w-full px-5 sm:px-8 lg:px-[4%] xl:px-[6%]">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 rounded-sm group"
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
                <p className="font-display text-white text-sm tracking-tight">
                  FM Institute
                </p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-1.5">
              <Link href="/about" className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors">
                About
              </Link>
              <Link href="/training" className="text-sm text-white bg-white/15 px-4 py-2 rounded-full font-medium">
                Training
              </Link>
              <Link href="/placement" className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors">
                Placement
              </Link>
              <Link href="/partners" className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors">
                Partners
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

      {/* Hero Content */}
      <div className="relative z-10 w-full min-h-[calc(100vh-5rem)] px-5 sm:px-8 lg:px-[6%] xl:px-[8%] flex items-center">
        <div className="w-full max-w-7xl mx-auto py-16 lg:py-0">
          <div className="max-w-2xl">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-medium text-white mb-8 animate-fade-in-up"
            >
              <GraduationCap className="w-4 h-4" />
              <span>FM Institute - Training Division</span>
            </div>

            {/* Heading */}
            <h1
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.05] mb-6 tracking-tight animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              Become Job-Ready for{" "}
              <span className="text-white">Gulf Shutdown Projects</span>
            </h1>

            <p
              className="text-lg sm:text-xl text-white/85 max-w-lg leading-relaxed mb-10 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              Industry-focused training with direct placement to Kuwait, UAE, Qatar & Saudi Arabia.
            </p>

            {/* Stats */}
            <dl
              className="flex flex-wrap gap-8 sm:gap-12 mb-10 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <div>
                <dd className="font-display text-4xl sm:text-5xl text-white mb-1">
                  <AnimatedCounter value={500} suffix="+" />
                </dd>
                <dt className="text-sm text-white/70 font-medium">Trained</dt>
              </div>
              <div>
                <dd className="font-display text-4xl sm:text-5xl text-white mb-1">
                  <AnimatedCounter value={500} suffix="+" />
                </dd>
                <dt className="text-sm text-white/70 font-medium">Placements</dt>
              </div>
              <div>
                <dd className="font-display text-4xl sm:text-5xl text-white mb-1">
                  1
                </dd>
                <dt className="text-sm text-white/70 font-medium">Month Duration</dt>
              </div>
            </dl>

            {/* CTA */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "400ms" }}
            >
              <Link href="/contact">
                <Button
                  size="lg"
                  className="gap-2 h-14 px-8 bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/30 font-semibold text-base active:scale-[0.98] transition-all duration-200"
                >
                  Enquire Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-white/30 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white scroll-indicator" />
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// COURSE OVERVIEW SECTION
// =============================================================================

function CourseOverviewSection({ courses }: { courses: Course[] }) {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Our Programs
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.05] mb-12">
            Explore Our Courses
          </h2>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {courses.map((course, index) => (
            <ScrollReveal key={course.id} delay={index * 100}>
              <TrackedCTA label={course.title} page="training_courses">
              <Link
                href={`#${course.id}`}
                className="group block relative overflow-hidden rounded-2xl bg-secondary/50 hover:bg-secondary/70 transition-colors duration-300"
              >
                {/* Image */}
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Course number badge */}
                  <div className="absolute top-4 left-4 font-display text-sm text-white/80 bg-black/30 px-3 py-1 rounded-full">
                    Course {course.number}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8">
                  <h3 className="font-display text-2xl lg:text-3xl text-foreground mb-2">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {course.tagline}
                  </p>

                  {/* Mini stats */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span>{course.moduleCount} Modules</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Banknote className="w-4 h-4 text-primary" />
                      <span>{course.salaryRange}</span>
                    </div>
                  </div>

                  {/* View details link */}
                  <span className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all duration-300">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
              </TrackedCTA>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// COURSE DETAIL SECTION
// =============================================================================

function CourseDetailSection({
  course,
  variant
}: {
  course: Course;
  variant: "dark" | "light";
}) {
  const isDark = variant === "dark";

  return (
    <section
      id={course.id}
      className={`py-20 lg:py-28 ${isDark ? "bg-industrial-dark text-white" : "bg-background"} ${isDark ? "accent-line-industrial" : "accent-line-industrial accent-line-green"}`}
    >
      <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
        {/* Header */}
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16 ${!isDark ? "lg:flex-row-reverse" : ""}`}>
          <ScrollReveal className={!isDark ? "lg:order-2" : ""}>
            <div>
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? "text-white/50" : "text-primary"} mb-4 block`}>
                Course {course.number}
              </span>
              <h2 className={`font-display text-4xl sm:text-5xl lg:text-6xl ${isDark ? "text-white" : "text-foreground"} leading-[1.05] mb-4`}>
                {course.title}
              </h2>
              <p className={`text-lg ${isDark ? "text-white/70" : "text-muted-foreground"} mb-8 max-w-lg`}>
                {course.tagline}
              </p>

              {/* Highlights */}
              <ul className="space-y-3">
                {course.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? "text-amber-400" : "text-primary"}`} />
                    <span className={isDark ? "text-white/85" : "text-foreground"}>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100} className={!isDark ? "lg:order-1" : ""}>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Syllabus */}
        <ScrollReveal>
          <div className="mb-16">
            <h3 className={`font-display text-2xl ${isDark ? "text-white" : "text-foreground"} mb-8`}>
              Syllabus ({course.syllabus.length} Modules)
            </h3>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {course.syllabus.map((module) => (
                <div
                  key={module.number}
                  className={`flex items-baseline gap-4 py-3 border-b ${isDark ? "border-white/10" : "border-border"}`}
                >
                  <span className="syllabus-number text-lg">{module.number}</span>
                  <span className={isDark ? "text-white/85" : "text-foreground"}>{module.title}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Skills (Mechanical Technician only) */}
        {course.skills && (
          <ScrollReveal>
            <div className="mb-16">
              <h3 className={`font-display text-2xl ${isDark ? "text-white" : "text-foreground"} mb-6`}>
                What You&apos;ll Learn
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill, i) => (
                  <span
                    key={i}
                    className={isDark ? "tag-industrial" : "tag-industrial-light"}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Training Method (Permit Receiver only) */}
        {course.trainingMethod && (
          <ScrollReveal>
            <div className="mb-16">
              <h3 className={`font-display text-2xl ${isDark ? "text-white" : "text-foreground"} mb-6`}>
                Training Method
              </h3>
              <div className="flex flex-wrap gap-6">
                {course.trainingMethod.map((method, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <method.icon className={`w-5 h-5 ${isDark ? "text-amber-400" : "text-primary"}`} />
                    <span className={isDark ? "text-white/85" : "text-foreground"}>{method.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Tools (Permit Receiver only) */}
        {course.tools && (
          <ScrollReveal>
            <div className="mb-16">
              <h3 className={`font-display text-2xl ${isDark ? "text-white" : "text-foreground"} mb-6`}>
                Tools & Practical Exposure
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.tools.map((tool, i) => (
                  <span
                    key={i}
                    className={isDark ? "tag-industrial" : "tag-industrial-light"}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Career Opportunities */}
        <ScrollReveal>
          <div className={`p-8 rounded-2xl mb-16 ${isDark ? "bg-white/5" : "bg-secondary/50"}`}>
            <h3 className={`font-display text-2xl ${isDark ? "text-white" : "text-foreground"} mb-6`}>
              Career Opportunities
            </h3>

            <div className="grid sm:grid-cols-3 gap-8">
              {/* Roles */}
              <div>
                <h4 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-white/50" : "text-muted-foreground"} mb-3`}>
                  Roles
                </h4>
                <ul className="space-y-2">
                  {course.careers.roles.map((role, i) => (
                    <li key={i} className={isDark ? "text-white/85" : "text-foreground"}>{role}</li>
                  ))}
                </ul>
                {course.careers.industry && (
                  <p className={`mt-3 text-sm ${isDark ? "text-white/50" : "text-muted-foreground"}`}>
                    {course.careers.industry}
                  </p>
                )}
              </div>

              {/* Salary */}
              <div>
                <h4 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-white/50" : "text-muted-foreground"} mb-3`}>
                  Salary
                </h4>
                <p className={`font-display text-xl ${isDark ? "text-white" : "text-foreground"}`}>
                  {course.careers.salary}
                </p>
                {course.careers.salaryNote && (
                  <p className={`text-sm ${isDark ? "text-white/50" : "text-muted-foreground"}`}>
                    {course.careers.salaryNote}
                  </p>
                )}
              </div>

              {/* Countries */}
              <div>
                <h4 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-white/50" : "text-muted-foreground"} mb-3`}>
                  Countries
                </h4>
                <ul className="space-y-2">
                  {course.careers.countries.map((country, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="flag-emoji">{country.flag}</span>
                      <span className={isDark ? "text-white/85" : "text-foreground"}>{country.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Certification (Permit Receiver only) */}
        {course.certification && (
          <ScrollReveal>
            <div className="mb-16">
              <h3 className={`font-display text-2xl ${isDark ? "text-white" : "text-foreground"} mb-6`}>
                Certification
              </h3>
              <ul className="space-y-3">
                {course.certification.map((cert, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Award className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? "text-amber-400" : "text-primary"}`} />
                    <span className={isDark ? "text-white/85" : "text-foreground"}>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        )}

        {/* Interview Support (Permit Receiver only) */}
        {course.interviewSupport && (
          <ScrollReveal>
            <div className="highlight-box p-6 rounded-r-xl mb-16">
              <h3 className={`font-display text-xl ${isDark ? "text-white" : "text-foreground"} mb-4`}>
                Interview Support Included
              </h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {course.interviewSupport.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-fm-green flex-shrink-0" />
                    <span className={isDark ? "text-white/85" : "text-foreground"}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        )}

        {/* Who Can Join */}
        <ScrollReveal>
          <div className="mb-12">
            <h3 className={`font-display text-2xl ${isDark ? "text-white" : "text-foreground"} mb-6`}>
              Who Can Join
            </h3>
            <div className="flex flex-wrap gap-2">
              {course.whoCanJoin.map((item, i) => (
                <span
                  key={i}
                  className={isDark ? "tag-industrial" : "tag-industrial-light"}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal>
          <Link href="/contact">
            <Button
              size="lg"
              className={`gap-2 h-14 px-8 font-semibold ${isDark ? "bg-white text-primary hover:bg-white/90" : "bg-primary text-white hover:bg-primary/90"}`}
            >
              Enquire Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

// =============================================================================
// WHY CHOOSE SECTION
// =============================================================================

function WhyChooseSection() {
  return (
    <section className="py-20 lg:py-28 bg-industrial-darker text-white relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/training/training-transformation.webp"
          alt=""
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
      </div>

      <div className="relative z-10 w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
        <ScrollReveal>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 mb-4 block">
            Why FM Institute
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] mb-12 max-w-2xl">
            From Online Learning to Gulf Site Confidence
          </h2>
        </ScrollReveal>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {whyChooseFeatures.map((feature, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-white/80" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-white mb-1">{feature.title}</h3>
                  {feature.subtitle && (
                    <p className="text-sm text-white/60">{feature.subtitle}</p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Differentiators */}
        <ScrollReveal>
          <div className="border-l-2 border-white/20 pl-6">
            <ul className="space-y-3">
              {differentiators.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// =============================================================================
// CAREER DESTINATIONS SECTION
// =============================================================================

function CareerDestinationsSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <ScrollReveal>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/training/gulf-skyline.webp"
                alt="Gulf skyline with industrial facilities"
                fill
                className="object-cover"
              />
            </div>
          </ScrollReveal>

          {/* Content */}
          <ScrollReveal delay={100}>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">
                Career Destinations
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-foreground leading-[1.05] mb-8">
                Your Gateway to Gulf Opportunities
              </h2>

              {/* Countries */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {gulfCountries.map((country, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl">{country.flag}</span>
                      <span className="font-display text-lg text-foreground">{country.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-10">{country.companies}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Stats bar */}
        <ScrollReveal>
          <div className="mt-16 bg-stats-strip rounded-2xl p-8 lg:p-12">
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              <div>
                <dd className="font-display text-4xl lg:text-5xl text-white mb-2">
                  <AnimatedCounter value={500} suffix="+" />
                </dd>
                <dt className="text-sm text-white/70">Students Trained</dt>
              </div>
              <div>
                <dd className="font-display text-4xl lg:text-5xl text-white mb-2">
                  <AnimatedCounter value={500} suffix="+" />
                </dd>
                <dt className="text-sm text-white/70">Placements Supported</dt>
              </div>
              <div>
                <dd className="font-display text-4xl lg:text-5xl text-white mb-2">Gulf</dd>
                <dt className="text-sm text-white/70">Project Opportunities</dt>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// =============================================================================
// CTA SECTION
// =============================================================================

function CTASection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/training/career-aerial-facility.webp"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 grain-overlay" />
      </div>

      <div className="relative z-10 w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
        <ScrollReveal className="max-w-2xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-4 block">
            Start Your Journey
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] mb-6">
            Ready to Build Your Gulf Career?
          </h2>
          <p className="text-lg text-white/75 mb-10 max-w-lg mx-auto">
            Join 500+ professionals who transformed their careers with FM Institute.
          </p>

          <Link href="/contact">
            <Button
              size="lg"
              className="gap-2 h-14 px-10 bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/30 font-semibold text-base"
            >
              Enquire Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>

          {/* Trust signals */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              No experience required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Placement support included
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Tamil + English training
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}


