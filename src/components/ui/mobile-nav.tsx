"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/training", label: "Training" },
  { href: "/placement", label: "Placement" },
  { href: "/verify", label: "Verify Certificate" },
  { href: "/contact", label: "Contact" },
];

interface MobileNavProps {
  variant?: "light" | "dark";
}

export function MobileNav({ variant = "dark" }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const iconColor = variant === "light" ? "text-foreground" : "text-white";
  const bgColor = variant === "light" ? "bg-primary/5" : "bg-white/10";
  const hoverBg = variant === "light" ? "hover:bg-primary/10" : "hover:bg-white/20";

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`md:hidden relative z-50 p-2.5 rounded-xl ${bgColor} ${hoverBg} transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <div className="w-5 h-4 flex flex-col justify-between">
          <span
            className={`block h-0.5 w-full ${iconColor} bg-current rounded-full transition-all duration-300 ease-out ${
              isOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-full ${iconColor} bg-current rounded-full transition-all duration-300 ease-out ${
              isOpen ? "opacity-0 scale-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-full ${iconColor} bg-current rounded-full transition-all duration-300 ease-out ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </div>
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-foreground/70 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Slide-out panel */}
      <nav
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
        className={`fixed top-0 right-0 h-full w-[min(85vw,320px)] bg-card border-l border-border z-50 md:hidden transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-fm-global.png"
                alt="FM Global Careers"
                width={56}
                height={56}
                className="w-14 h-14 object-contain"
              />
              <span className="font-display text-foreground">Menu</span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Links */}
          <ul className="flex flex-col gap-1 flex-1">
            {navLinks.map((link, index) => (
              <li
                key={link.href}
                className={isOpen ? "animate-slide-in-right" : ""}
                style={{
                  animationDelay: isOpen ? `${index * 50 + 100}ms` : "0ms",
                  animationFillMode: "forwards",
                  opacity: isOpen ? undefined : 0,
                }}
              >
                <Link
                  href={link.href}
                  onClick={handleClose}
                  className="block py-3 px-4 text-foreground font-medium rounded-xl hover:bg-primary/5 hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="pt-6 border-t border-border">
            <Link href="/contact" onClick={handleClose} className="block">
              <Button className="w-full btn-shine shadow-lg shadow-primary/20" size="lg">
                Enquire Now
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Global Careers Start Here
            </p>
          </div>
        </div>
      </nav>
    </>
  );
}
