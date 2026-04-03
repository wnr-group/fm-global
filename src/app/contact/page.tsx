import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/ui/mobile-nav";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ArrowRight, Mail, Phone, MapPin, Clock } from "lucide-react";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact Us | FM Global Careers",
  description:
    "Get in touch with FM Global Careers. Reach out to FM Institute for training enquiries or FM International for job placement opportunities.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav — dark navy, "Contact" active */}
      <nav className="relative z-50 w-full py-4 bg-[#0f385a]" aria-label="Main navigation">
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
              <Link href="/about" className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors">
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
              <Link href="/contact" className="text-sm text-white bg-white/15 px-4 py-2 rounded-full transition-colors font-medium">
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

      {/* Hero */}
      <section className="bg-[#0f385a] relative overflow-hidden pt-16 pb-32 px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-white/40" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                Get In Touch
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[0.95] tracking-tight mb-6">
              Contact Us
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-lg leading-relaxed">
              Whether you have a training enquiry or a placement question, our team is ready
              to help you take the next step in your career.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Cards — overlapping hero */}
      <section className="relative z-10 -mt-16 pb-20 px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* FM Institute */}
          <ScrollReveal delay={0}>
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 h-full border border-border hover:shadow-2xl transition-shadow duration-300">
              <div className="w-12 h-1 bg-[#0f385a] mb-6" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3 block">
                Training Division
              </span>
              <h2 className="font-display text-2xl lg:text-3xl text-foreground mb-2">FM Institute</h2>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                Enquiries about Mechanical Technician, Permit Receiver, and other training programs.
              </p>

              <ul className="space-y-5">
                <li>
                  <a
                    href="mailto:fminstitute24@gmail.com"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#0f385a]/10 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-[#0f385a]">
                      <Mail className="w-4 h-4 text-[#0f385a] transition-colors group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                      <p className="text-foreground font-medium text-sm group-hover:text-[#0f385a] transition-colors">
                        fminstitute24@gmail.com
                      </p>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+918807026768"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#0f385a]/10 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-[#0f385a]">
                      <Phone className="w-4 h-4 text-[#0f385a] transition-colors group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                      <p className="text-foreground font-medium text-sm group-hover:text-[#0f385a] transition-colors">
                        +91 8807026768
                      </p>
                    </div>
                  </a>
                </li>
              </ul>

              <a
                href="mailto:fminstitute24@gmail.com"
                className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-[#0f385a] hover:gap-3 transition-all duration-200"
              >
                Send an enquiry
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </ScrollReveal>

          {/* FM International */}
          <ScrollReveal delay={100}>
            <div className="bg-[#0f385a] rounded-2xl shadow-xl p-8 lg:p-10 h-full hover:shadow-2xl transition-shadow duration-300">
              <div className="w-12 h-1 bg-white/40 mb-6" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-3 block">
                Placement Division
              </span>
              <h2 className="font-display text-2xl lg:text-3xl text-white mb-2">FM International</h2>
              <p className="text-white/70 text-sm mb-8 leading-relaxed">
                Enquiries about Gulf job placement, manpower solutions, and career opportunities.
              </p>

              <ul className="space-y-5">
                <li>
                  <a
                    href="mailto:fminternational.jobs@gmail.com"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-white">
                      <Mail className="w-4 h-4 text-white transition-colors group-hover:text-[#0f385a]" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-0.5">Email</p>
                      <p className="text-white font-medium text-sm group-hover:text-white/80 transition-colors">
                        fminternational.jobs@gmail.com
                      </p>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+917418912404"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-white">
                      <Phone className="w-4 h-4 text-white transition-colors group-hover:text-[#0f385a]" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-0.5">Phone</p>
                      <p className="text-white font-medium text-sm group-hover:text-white/80 transition-colors">
                        +91 7418912404
                      </p>
                    </div>
                  </a>
                </li>
              </ul>

              <a
                href="mailto:fminternational.jobs@gmail.com"
                className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-white hover:gap-3 transition-all duration-200"
              >
                Send an enquiry
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Office & Map */}
      <section className="bg-secondary/30 relative">
        <div className="grid lg:grid-cols-2">
          {/* Left — Office info */}
          <div className="py-20 lg:py-24 px-5 sm:px-8 lg:pl-[8%] lg:pr-12">
            <ScrollReveal direction="left">
              <div className="max-w-lg">
                <div className="flex items-center gap-4 mb-10">
                  <div className="h-px w-12 bg-primary" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Our Office
                  </span>
                </div>

                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground leading-[0.95] mb-10">
                  Visit us in<br />
                  <span className="text-primary">Thovalai</span>
                </h2>

                <ul className="space-y-8">
                  <li className="flex items-start gap-5">
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Address
                      </p>
                      <p className="text-foreground leading-relaxed">
                        2/17, Pannaivilai Street<br />
                        Thovalai 629301<br />
                        Tamil Nadu, India
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-5">
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Office Hours
                      </p>
                      <p className="text-foreground">Mon – Sat: 10 AM – 5 PM</p>
                      <p className="text-muted-foreground text-sm mt-1">Sunday: Closed</p>
                    </div>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>

          {/* Right — Map */}
          <div className="relative min-h-[400px] lg:min-h-full">
            <ScrollReveal direction="right" delay={100} className="h-full">
              <div className="absolute inset-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3948.726730546175!2d77.5056149!3d8.230211299999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04f5b5cf279349%3A0xdc18a12aea2f216f!2sFM%20Institute!5e0!3m2!1sen!2sin!4v1774579264206!5m2!1sen!2sin"
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="FM Institute Location"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#0f385a] py-16 px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
        <ScrollReveal className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-2">
              Ready to start?
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-white leading-tight">
              Take the first step towards your Gulf career.
            </h2>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <a href="mailto:fminstitute24@gmail.com">
              <Button className="rounded-full bg-white text-primary hover:bg-white/90 shadow-lg shadow-black/20 px-6 h-12 font-semibold gap-2">
                <Mail className="w-4 h-4" />
                Email FM Institute
              </Button>
            </a>
            <a href="mailto:fminternational.jobs@gmail.com">
              <Button className="rounded-full border-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/50 px-6 h-12 font-semibold gap-2">
                <Mail className="w-4 h-4" />
                Email FM International
              </Button>
            </a>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </main>
  );
}
