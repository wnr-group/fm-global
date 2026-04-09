"use client";

import { trackCTAClick } from "@/lib/analytics";

interface TrackedCTAProps {
  label: string;
  page: string;
  children: React.ReactNode;
  className?: string;
}

export function TrackedCTA({ label, page, children, className }: TrackedCTAProps) {
  return (
    <span onClick={() => trackCTAClick(label, page)} className={className}>
      {children}
    </span>
  );
}
