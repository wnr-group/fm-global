import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
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
            <h3 className="font-display text-background text-sm mb-4">Divisions</h3>
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
            <h3 className="font-display text-background text-sm mb-4">Contact</h3>
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
          <p className="text-xs text-background/40">
            Building Global Oil &amp; Gas Careers
          </p>
        </div>
      </div>
    </footer>
  );
}
