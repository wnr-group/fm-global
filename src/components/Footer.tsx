import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-foreground text-background pt-16 pb-4 lg:pt-20 pb-4" role="contentinfo">
      <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm group"
            >
              <Image
                src="/Brand-Logo.webp"
                alt="FM Global Careers logo"
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
                { label: "Partner With Us", href: "/partners" },
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
              <p className="leading-relaxed">
                2/17, Pannaivilai Street<br />
                Thovalai 629301<br />
                Tamil Nadu, India
              </p>
              <p>
                <a
                  href="mailto:fminstitute24@gmail.com"
                  className="hover:text-background transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
                >
                  fminstitute24@gmail.com
                </a>
              </p>
              <p>
                <a
                  href="mailto:fminternational.jobs@gmail.com"
                  className="hover:text-background transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
                >
                  fminternational.jobs@gmail.com
                </a>
              </p>
            </address>
          </div>

          {/* Social Media */}
          <div>
  <h3 className="font-display text-background text-sm mb-4">Follow Us</h3>
  
  {/* FM Institute */}
  <h4 className="text-background font-semibold mt-2">FM Institute</h4>
  <div className="space-y-3 text-sm text-background/70">
    <a href="https://www.instagram.com/fminstitute_india/" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex items-center gap-2 hover:text-background transition-colors">
      <span className="text-background font-medium w-20 shrink-0">Instagram</span>
      <span className="text-background/40">·</span>
      <span>@fminstitute_india</span>
    </a>
    <a href="https://www.facebook.com/profile.php?id=61581995215764" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex items-center gap-2 hover:text-background transition-colors">
      <span className="text-background font-medium w-20 shrink-0">Facebook</span>
      <span className="text-background/40">·</span>
      <span>FM Institute</span>
    </a>
    <a href="https://www.linkedin.com/company/fm-institute-%E2%80%93-oil-gas-training-centre/" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex items-center gap-2 hover:text-background transition-colors">
      <span className="text-background font-medium w-20 shrink-0">LinkedIn</span>
      <span className="text-background/40">·</span>
      <span>FM Institute</span>
    </a>
    <a href="https://www.youtube.com/@fmglobalcareers" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex items-center gap-2 hover:text-background transition-colors">
      <span className="text-background font-medium w-20 shrink-0">YouTube</span>
      <span className="text-background/40">·</span>
      <span>FM Global Career</span>
    </a>
  </div>

  {/* FM International Placement Services */}
  <h4 className="text-background font-semibold mt-4">FM International Placement Services</h4>
  <div className="space-y-3 text-sm text-background/70">
    <a href="https://www.instagram.com/fminternational_/" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex items-center gap-2 hover:text-background transition-colors">
      <span className="text-background font-medium w-20 shrink-0">Instagram</span>
      <span className="text-background/40">·</span>
      <span>@fminternational_</span>
    </a>
    <a href="https://www.facebook.com/profile.php?id=61579676398980" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex items-center gap-2 hover:text-background transition-colors">
      <span className="text-background font-medium w-20 shrink-0">Facebook</span>
      <span className="text-background/40">·</span>
      <span>FM International Placement Services</span>
    </a>
    <a href="https://www.linkedin.com/company/fm-international-placement-services/" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex items-center gap-2 hover:text-background transition-colors">
      <span className="text-background font-medium w-20 shrink-0">LinkedIn</span>
      <span className="text-background/40">·</span>
      <span>FM International Placement Services</span>
    </a>
  </div>
</div>


        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/60">
            &copy; {new Date().getFullYear()} FM Global Careers. All rights reserved.
          </p>
        </div>
      </div>

<div className="mt-6 pt-4 border-t border-white/10 text-center">
  <p className="text-xs text-gray-400">
    Powered by{' '}
    <a
      href="https://www.wnradvisory.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline hover:text-gray-300 transition-colors"
    >
      WnR Group
    </a>
  </p>
</div>
    </footer>
  );
}
