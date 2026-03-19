"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface ParallaxHeroProps {
  videoSrc?: string;
  imageSrc?: string;
  imageAlt?: string;
  children: React.ReactNode;
  className?: string;
  overlayOpacity?: number;
  parallaxSpeed?: number;
  scrollControlledVideo?: boolean;
}

export function ParallaxHero({
  videoSrc,
  imageSrc,
  imageAlt = "Background",
  children,
  className,
  overlayOpacity = 0.5,
  parallaxSpeed = 0.4,
  scrollControlledVideo = true,
}: ParallaxHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const currentTransform = useRef(0);
  const targetVideoTime = useRef(0);
  const videoDuration = useRef(0);
  const isSeekingRef = useRef(false);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Initialize video for scroll control
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !scrollControlledVideo) return;

    const initVideo = () => {
      if (video.duration && video.duration > 0 && !videoReady) {
        videoDuration.current = video.duration;
        video.pause();
        video.currentTime = 0;
        setVideoReady(true);
        setVideoError(false);
      }
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
    };

    const handleError = () => {
      setVideoError(true);
      setVideoReady(false);
    };

    const handleStalled = () => {
      // Video stalled - don't mark as error, just wait
      isSeekingRef.current = false;
    };

    video.addEventListener("loadedmetadata", initVideo);
    video.addEventListener("canplaythrough", initVideo);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("error", handleError);
    video.addEventListener("stalled", handleStalled);

    // If already loaded
    if (video.readyState >= 3 && video.duration > 0) {
      initVideo();
    }

    return () => {
      video.removeEventListener("loadedmetadata", initVideo);
      video.removeEventListener("canplaythrough", initVideo);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("error", handleError);
      video.removeEventListener("stalled", handleStalled);
    };
  }, [scrollControlledVideo, videoReady]);

  // Smooth parallax with requestAnimationFrame
  const updateParallax = useCallback(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const media = mediaRef.current;
    const video = videoRef.current;
    const overlay = overlayRef.current;
    const content = contentRef.current;

    if (!container || !media) {
      rafRef.current = requestAnimationFrame(updateParallax);
      return;
    }

    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate scroll progress (0 at top, 1 when scrolled past)
    const scrollProgress = Math.max(0, Math.min(1, -rect.top / rect.height));

    // Only apply when section is visible
    if (rect.bottom < 0 || rect.top > windowHeight) {
      rafRef.current = requestAnimationFrame(updateParallax);
      return;
    }

    // Smooth interpolation for parallax transform
    const targetTransform = rect.top * parallaxSpeed;
    currentTransform.current += (targetTransform - currentTransform.current) * 0.1;

    // Apply parallax transform - no scale on mobile for better view
    const isMobile = window.innerWidth < 640;
    const scale = isMobile ? 1 : 1.03;
    media.style.transform = `translate3d(0, ${currentTransform.current}px, 0) scale(${scale})`;

    // Scroll-controlled video playback
    if (video && videoReady && scrollControlledVideo && videoDuration.current > 0) {
      targetVideoTime.current = scrollProgress * videoDuration.current;

      // Only seek if not currently seeking and time difference is significant
      if (!isSeekingRef.current) {
        const timeDiff = Math.abs(video.currentTime - targetVideoTime.current);
        if (timeDiff > 0.05) {
          isSeekingRef.current = true;
          video.currentTime = Math.max(0, Math.min(videoDuration.current - 0.1, targetVideoTime.current));
        }
      }
    }

    // Overlay moves slightly faster than video
    if (overlay) {
      overlay.style.transform = `translate3d(0, ${currentTransform.current * 0.6}px, 0)`;
    }

    // Content fades and moves on scroll
    if (content) {
      const fadeStart = 0.1;
      const fadeEnd = 0.5;
      const opacity = Math.max(0, 1 - (scrollProgress - fadeStart) / (fadeEnd - fadeStart));
      const contentOffset = Math.max(0, rect.top * -0.15);

      content.style.opacity = String(Math.min(1, opacity));
      content.style.transform = `translate3d(0, ${contentOffset}px, 0)`;
    }

    rafRef.current = requestAnimationFrame(updateParallax);
  }, [parallaxSpeed, prefersReducedMotion, videoReady, scrollControlledVideo]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    rafRef.current = requestAnimationFrame(updateParallax);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateParallax, prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden",
        className
      )}
    >
      {/* Media layer - video or image */}
      <div
        ref={mediaRef}
        className="absolute inset-0 w-full h-[110%] sm:h-[110%] lg:h-[120%] -top-[5%] sm:-top-[5%] lg:-top-[10%] will-change-transform"
        style={{ transform: "translate3d(0, 0, 0) scale(1)" }}
      >
        {videoSrc && !videoError ? (
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            {imageSrc && (
              <img
                src={imageSrc}
                alt={imageAlt}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </video>
        ) : null}
        {/* Show image if no video, video errored, or as fallback */}
        {((!videoSrc || videoError) && imageSrc) && (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        )}
      </div>

      {/* Minimal overlay - just enough for contrast */}
      <div
        ref={overlayRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] will-change-transform pointer-events-none"
        style={{
          background: `linear-gradient(
            to bottom,
            oklch(0.10 0.02 240 / ${overlayOpacity * 0.3}) 0%,
            oklch(0.10 0.02 240 / ${overlayOpacity * 0.15}) 50%,
            oklch(0.10 0.02 240 / ${overlayOpacity * 0.4}) 100%
          )`,
          transform: "translate3d(0, 0, 0)",
        }}
      />

      {/* Content layer - scrolls normally with fade */}
      <div
        ref={contentRef}
        className="relative z-10 will-change-transform"
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        {children}
      </div>
    </section>
  );
}

// Optional: Parallax section for content below hero
interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxSection({
  children,
  className,
  speed = 0.1,
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const updatePosition = () => {
      const section = sectionRef.current;
      const content = contentRef.current;

      if (!section || !content) return;

      const rect = section.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const sectionCenter = rect.top + rect.height / 2;
      const distance = sectionCenter - viewportCenter;

      // Only apply when visible
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        content.style.transform = `translate3d(0, ${distance * speed}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(updatePosition);
    };

    rafRef.current = requestAnimationFrame(updatePosition);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [speed, prefersReducedMotion]);

  return (
    <div ref={sectionRef} className={cn("relative overflow-hidden", className)}>
      <div ref={contentRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
