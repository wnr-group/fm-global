"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface SplashScreenProps {
  /** Minimum time to show splash in ms (default: 1500) */
  minDuration?: number;
  /** Callback when splash is complete */
  onComplete?: () => void;
}

export function SplashScreen({ minDuration = 1500, onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      // Wait for exit animation to complete
      setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 500);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-primary transition-opacity duration-500 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Logo */}
      <div className="relative mb-8 animate-fade-in">
        <Image
          src="/logo-fm-global.png"
          alt="FM Global Careers"
          width={120}
          height={120}
          className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
          priority
        />
      </div>

      {/* Company name */}
      <h1
        className="font-display text-2xl sm:text-3xl text-white mb-8 animate-fade-in"
        style={{ animationDelay: "200ms" }}
      >
        FM Global Careers
      </h1>

      {/* Loading indicator */}
      <div
        className="flex items-center gap-2 animate-fade-in"
        style={{ animationDelay: "400ms" }}
      >
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>

      {/* Tagline */}
      <p
        className="absolute bottom-8 text-sm text-white/60 animate-fade-in"
        style={{ animationDelay: "600ms" }}
      >
        Global Careers Start Here
      </p>
    </div>
  );
}
