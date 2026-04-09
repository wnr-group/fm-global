import { InteractiveGlobe } from "@/components/ui/interactive-globe";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/ui/mobile-nav";
import { ScrollReveal, AnimatedCounter } from "@/components/ui/scroll-reveal";
import { ScrollSequenceHero } from "@/components/ui/scroll-sequence-hero";
import { ArrowRight, ArrowUpRight, GraduationCap, Globe2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
        {/* Hero Section with Scroll-driven Animation */}
        <ScrollSequenceHero
          frameCount={120}
          framePath="/hero-frames/frame_"
          frameExtension="webp"
          overlayOpacity={0.35}
          preloadCount={30}
          className="min-h-[85vh] sm:min-h-screen"
        >
          {/* Navigation - on top of parallax */}
          <nav
            className="relative z-50 w-full py-4"
            aria-label="Main navigation"
          >
            <div className="w-full px-5 sm:px-8 lg:px-[4%] xl:px-[6%]">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <Link
                  href="/"
                  className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 rounded-sm group"
                >
                  <Image
                    src="/apple-touch-icon.png"
                    alt="FM Global Careers logo"
                    width={56}
                    height={56}
                    className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
                    priority
                  />
                  <div className="hidden sm:block">
                    <p className="font-display text-white text-sm tracking-tight">
                      FM Global Careers
                    </p>
                  </div>
                </Link>

                {/* Center pill nav */}
                <div className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-1.5">
                  <Link
                    href="/about"
                    className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                  >
                    About
                  </Link>
                  <Link
                    href="/training"
                    className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                  >
                    Training
                  </Link>
                  <Link
                    href="/placement"
                    className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                  >
                    Placement
                  </Link>
                  <Link
                    href="/verify"
                    className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                  >
                    Verify
                  </Link>
                  <Link
                    href="/contact"
                    className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                  >
                    Contact
                  </Link>
                </div>

                {/* Right side CTA */}
                <div className="hidden lg:flex items-center gap-4">
                  <Link href="/contact">
                    <Button className="rounded-full bg-white text-primary hover:bg-white/90 shadow-lg shadow-black/20 px-6 py-2.5 h-auto font-semibold">
                      Enquire Now
                    </Button>
                  </Link>
                </div>

                {/* Mobile nav */}
                <MobileNav variant="dark" />
              </div>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="relative w-full min-h-[calc(85vh-5rem)] sm:min-h-[calc(100vh-5rem)] px-4 sm:px-8 lg:px-[6%] xl:px-[8%] flex items-center">
            <div className="w-full max-w-7xl mx-auto py-6 sm:py-16 lg:py-0">
              {/* Content area */}
              <div className="max-w-2xl relative">
                {/* Darker background for text contrast - no blur */}
                <div className="absolute -inset-3 sm:-inset-8 lg:-inset-10 bg-gradient-to-br from-black/60 via-black/50 to-black/30 rounded-xl sm:rounded-3xl -z-10" />

                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-black/50 border border-white/40 px-2.5 py-1 sm:px-4 sm:py-2 text-[9px] sm:text-xs font-medium text-white mb-3 sm:mb-8 w-fit animate-fade-in-up">
                  <span className="size-1.5 sm:size-2 rounded-full bg-white animate-pulse-subtle" />
                  <span>Applications open for 2026 batch</span>
                </div>

                {/* Heading with text shadow for better readability */}
                <h1
                  id="hero-heading"
                  className="font-display text-2xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.1] mb-2 sm:mb-6 tracking-tight animate-fade-in-up drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] break-words hyphens-auto"
                  style={{ animationDelay: "100ms" }}
                >
                  Build your career in{" "}
                  <span className="text-white">Oil & Gas</span>
                </h1>

                <p
                  className="text-sm sm:text-xl text-white/90 max-w-lg leading-relaxed mb-4 sm:mb-10 animate-fade-in-up drop-shadow-[0_1px_5px_rgba(0,0,0,0.3)]"
                  style={{ animationDelay: "200ms" }}
                >
                  Industry-focused training with direct placement to leading companies
                  across India and the Gulf region.
                </p>

                {/* CTAs */}
                <div
                  className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 mb-0 sm:mb-14 animate-fade-in-up"
                  style={{ animationDelay: "300ms" }}
                >
                  <Link href="/contact" className="group">
                    <Button size="lg" className="w-full sm:w-auto gap-2 h-10 sm:h-14 px-5 sm:px-8 bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/30 font-semibold text-sm sm:text-base active:scale-[0.98] transition-all duration-200">
                      Enquire Now
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 arrow-animate" />
                    </Button>
                  </Link>
                  <Link href="/training">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto h-10 sm:h-14 px-5 sm:px-8 bg-white/10 border-2 border-white/50 text-white hover:bg-white/20 hover:border-white/70 font-semibold text-sm sm:text-base"
                    >
                      Explore Courses
                    </Button>
                  </Link>
                </div>

                {/* Stats - hidden on very small screens */}
                <dl
                  className="hidden sm:grid grid-cols-3 gap-6 sm:gap-12 animate-fade-in-up"
                  style={{ animationDelay: "400ms" }}
                >
                  <div>
                    <dd className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                      <AnimatedCounter value={500} suffix="+" />
                    </dd>
                    <dt className="text-xs sm:text-sm text-white/80 font-medium">
                      Students Placed
                    </dt>
                  </div>
                  <div>
                    <dd className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                      <AnimatedCounter value={15} suffix="+" />
                    </dd>
                    <dt className="text-xs sm:text-sm text-white/80 font-medium">
                      Partners
                    </dt>
                  </div>
                  <div>
                    <dd className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                      <AnimatedCounter value={98} suffix="%" />
                    </dd>
                    <dt className="text-xs sm:text-sm text-white/80 font-medium">
                      Placement Rate
                    </dt>
                  </div>
                </dl>
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
        </ScrollSequenceHero>

        {/* Global Network Section - Globe showcase */}
        <section className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
          <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 max-w-7xl mx-auto">
              {/* Left - Globe */}
              <div className="flex-1 flex items-center justify-center w-full">
                <ScrollReveal>
                  <div className="globe-container">
                    {/* Mobile globe */}
                    <div className="block sm:hidden">
                      <InteractiveGlobe size={300} />
                    </div>
                    {/* Tablet globe */}
                    <div className="hidden sm:block lg:hidden">
                      <InteractiveGlobe size={400} />
                    </div>
                    {/* Desktop globe */}
                    <div className="hidden lg:block">
                      <InteractiveGlobe size={480} />
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Right - Content */}
              <div className="flex-1 max-w-lg">
                <ScrollReveal delay={100}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-px w-12 bg-primary" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      Global Reach
                    </span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground leading-[1.1] mb-6 break-words">
                    Connecting talent with{" "}
                    <span className="text-primary">opportunities worldwide</span>
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    Our placement network spans across India and the Gulf region,
                    connecting trained professionals with leading employers in UAE,
                    Qatar, Saudi Arabia, Kuwait, Bahrain, and Oman.
                  </p>
                  <Link href="/placement" className="group">
                    <Button variant="outline" className="gap-2 h-12 px-6 hover:border-primary/50 active:scale-[0.98] transition-all duration-200">
                      View Placement Network
                      <ArrowRight className="w-4 h-4 arrow-animate" />
                    </Button>
                  </Link>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Divisions Section */}
        <section
          aria-labelledby="divisions-heading"
          className="py-16 sm:py-20 lg:py-24 bg-secondary/30 relative"
        >
          <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
            {/* Section header - editorial style, left-aligned */}
            <ScrollReveal>
              <header className="mb-10 lg:mb-14">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-12 bg-primary" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Our Divisions
                  </span>
                </div>
                <h2
                  id="divisions-heading"
                  className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground max-w-3xl leading-[1.1]"
                >
                  Two paths to your
                  <br />
                  <span className="text-primary">global career</span>
                </h2>
              </header>
            </ScrollReveal>

            {/* Bento-style layout */}
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-5">
              {/* FM Institute - Training Division */}
              <ScrollReveal delay={100}>
                <Link
                  href="/training"
                  className="group block relative h-full min-h-[400px] lg:min-h-[480px]"
                >
                  <article className="absolute inset-0 bg-secondary/60 rounded-3xl p-8 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:bg-secondary/80">
                    {/* Large background number */}
                    <span className="absolute -right-8 -top-8 text-[180px] lg:text-[240px] font-display font-bold text-primary/[0.04] leading-none select-none pointer-events-none">
                      01
                    </span>

                    <div className="relative">
                      <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-primary/70 mb-4">
                        Training Division
                      </span>
                      <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4 leading-[1.1]">
                        FM Institute
                      </h3>
                      <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-md">
                        Industry-focused programs in Oil & Gas, Piping Design, Safety Standards,
                        and Process Engineering.
                      </p>
                    </div>

                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">12+ Courses</span>
                      </div>

                      <span className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all duration-300">
                        View Courses
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </article>
                </Link>
              </ScrollReveal>

              {/* FM International - Placement Division */}
              <ScrollReveal delay={200}>
                <Link
                  href="/placement"
                  className="group block relative h-full min-h-[400px] lg:min-h-[480px]"
                >
                  <article className="absolute inset-0 bg-primary rounded-3xl p-8 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
                    {/* Large background number */}
                    <span className="absolute -right-8 -top-8 text-[180px] lg:text-[240px] font-display font-bold text-white/[0.06] leading-none select-none pointer-events-none">
                      02
                    </span>

                    <div className="relative">
                      <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground/60 mb-4">
                        Placement Division
                      </span>
                      <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-primary-foreground mb-4 leading-[1.1]">
                        FM International
                      </h3>
                      <p className="text-primary-foreground/75 text-base sm:text-lg leading-relaxed max-w-md">
                        Direct placement in Gulf countries and across India. Connecting trained
                        professionals with leading employers.
                      </p>
                    </div>

                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <Globe2 className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-sm text-primary-foreground/70">15+ Partners</span>
                      </div>

                      <span className="inline-flex items-center gap-2 text-primary-foreground font-medium text-sm group-hover:gap-3 transition-all duration-300">
                        Explore Jobs
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </article>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section
          aria-labelledby="features-heading"
          className="py-16 sm:py-20 lg:py-24 bg-secondary/30 relative overflow-hidden"
        >
          {/* Subtle background texture */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, oklch(0.32 0.08 240 / 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, oklch(0.32 0.08 240 / 0.02) 0%, transparent 40%)' }} />
          </div>

          <div className="relative w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
            {/* Section header */}
            <ScrollReveal>
              <header className="text-center mb-10 lg:mb-14">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px w-8 bg-primary/40" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Why Choose Us
                  </span>
                  <div className="h-px w-8 bg-primary/40" />
                </div>
                <h2
                  id="features-heading"
                  className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground max-w-3xl mx-auto leading-[1.1]"
                >
                  From training to placement,{" "}
                  <span className="text-primary">we&apos;ve got you covered</span>
                </h2>
              </header>
            </ScrollReveal>

            {/* Feature grid - clean, no cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 lg:gap-x-12 gap-y-12 lg:gap-y-16">
              {[
                {
                  number: "01",
                  title: "Industry Certified",
                  description: "Certifications recognized by employers across India and the Gulf region.",
                },
                {
                  number: "02",
                  title: "Global Network",
                  description: "Partnerships with companies in UAE, Qatar, Saudi Arabia, Kuwait, Bahrain, and Oman.",
                },
                {
                  number: "03",
                  title: "Expert Faculty",
                  description: "Learn from professionals with 10+ years of real industry experience.",
                },
                {
                  number: "04",
                  title: "QR-Verified",
                  description: "Every certificate comes with QR verification for authenticity.",
                },
              ].map((item, index) => (
                <ScrollReveal key={item.number} delay={index * 80}>
                  <article className="group">
                    {/* Large number */}
                    <span className="block font-display text-6xl lg:text-7xl text-primary/10 mb-4 leading-none transition-colors duration-300 group-hover:text-primary/20">
                      {item.number}
                    </span>
                    <h3 className="font-display text-xl lg:text-2xl text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                      {item.description}
                    </p>
                  </article>
                </ScrollReveal>
              ))}
            </div>

            {/* CTA */}
            <ScrollReveal delay={400}>
              <div className="mt-12 lg:mt-16 text-center">
                <Link href="/about" className="group">
                  <Button variant="outline" className="gap-2 h-12 px-8 hover:border-primary/50 active:scale-[0.98] transition-all duration-200">
                    Learn more about us
                    <ArrowRight className="w-4 h-4 arrow-animate" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA Section */}
        <section
          aria-labelledby="cta-heading"
          className="py-16 sm:py-20 lg:py-24 bg-primary text-primary-foreground relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-white/5 translate-y-1/2" />
          </div>

          <div className="relative w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
            <ScrollReveal className="max-w-3xl mx-auto text-center">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary-foreground/70 mb-4">
                Get Started
              </span>
              <h2
                id="cta-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl text-primary-foreground mb-6"
              >
                Ready to start your journey?
              </h2>
              <p className="text-lg sm:text-xl text-primary-foreground/80 mb-10 max-w-xl mx-auto">
                Take the first step towards an international career in Oil & Gas.
                Global careers start here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="group">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto gap-2 bg-white text-primary hover:bg-white/90 h-14 px-8 shadow-lg font-semibold active:scale-[0.98] transition-all duration-200"
                  >
                    Enquire Now
                    <ArrowRight className="w-5 h-5 arrow-animate" />
                  </Button>
                </Link>
                <Link href="/verify">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto border-2 border-white bg-transparent text-white hover:bg-white/10 h-14 px-8 font-semibold"
                  >
                    Verify Certificate
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
    </main>
  );
}
