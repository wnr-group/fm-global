"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  trackScrollDepth,
  trackContactClick,
  trackSocialClick,
  trackFileDownload,
} from "@/lib/analytics";

const MILESTONES = [25, 50, 75, 100];

const SOCIAL_DOMAINS: Record<string, string> = {
  "instagram.com": "instagram",
  "facebook.com": "facebook",
  "linkedin.com": "linkedin",
  "youtube.com": "youtube",
  "twitter.com": "twitter",
  "x.com": "twitter",
};

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const firedRef = useRef<Set<number>>(new Set());

  // Reset milestones on route change
  useEffect(() => {
    firedRef.current = new Set();
  }, [pathname]);

  // Scroll depth tracking
  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const percent = Math.round((scrollTop / docHeight) * 100);

      for (const milestone of MILESTONES) {
        if (percent >= milestone && !firedRef.current.has(milestone)) {
          firedRef.current.add(milestone);
          trackScrollDepth(milestone, pathname);
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Delegated click tracking for links (mailto, tel, social, downloads)
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";

      // mailto: links
      if (href.startsWith("mailto:")) {
        const email = href.replace("mailto:", "").split("?")[0];
        trackContactClick("email", email, pathname);
        return;
      }

      // tel: links
      if (href.startsWith("tel:")) {
        const phone = href.replace("tel:", "");
        trackContactClick("phone", phone, pathname);
        return;
      }

      // WhatsApp links
      if (href.includes("wa.me/") || href.includes("whatsapp.com")) {
        trackContactClick("whatsapp", href, pathname);
        return;
      }

      // File downloads (PDF, CSV, etc.)
      if (/\.(pdf|csv|xlsx|docx|zip)(\?|$)/i.test(href)) {
        const fileName = href.split("/").pop()?.split("?")[0] || href;
        const ext = fileName.split(".").pop() || "unknown";
        trackFileDownload(fileName, ext);
        return;
      }

      // Social media / external links
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) {
          const host = url.hostname.replace("www.", "");
          for (const [domain, platform] of Object.entries(SOCIAL_DOMAINS)) {
            if (host.includes(domain)) {
              trackSocialClick(platform, href);
              return;
            }
          }
        }
      } catch {
        // not a valid URL, skip
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  return <>{children}</>;
}
