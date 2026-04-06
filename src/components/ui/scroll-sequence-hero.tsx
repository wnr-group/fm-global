"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollSequenceHeroProps {
  frameCount: number;
  framePath: string; // e.g., "/hero-frames/frame_" - will append 0001.webp, 0002.webp, etc.
  frameExtension?: string;
  children: React.ReactNode;
  className?: string;
  overlayOpacity?: number;
  preloadCount?: number; // Number of frames to preload initially
}

export function ScrollSequenceHero({
  frameCount,
  framePath,
  frameExtension = "webp",
  children,
  className,
  overlayOpacity = 0.35,
  preloadCount = 30,
}: ScrollSequenceHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef(0);
  const loadedFramesRef = useRef<Set<number>>(new Set());
  const isLoadingRef = useRef<Set<number>>(new Set());

  const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Generate frame URL
  const getFrameUrl = useCallback(
    (index: number) => {
      const frameNumber = String(index + 1).padStart(4, "0");
      return `${framePath}${frameNumber}.${frameExtension}`;
    },
    [framePath, frameExtension]
  );

  // Load a single frame
  const loadFrame = useCallback(
    (index: number): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        // Already loaded
        if (imagesRef.current[index]) {
          resolve(imagesRef.current[index]);
          return;
        }

        // Already loading
        if (isLoadingRef.current.has(index)) {
          // Wait for it to load
          const checkLoaded = setInterval(() => {
            if (imagesRef.current[index]) {
              clearInterval(checkLoaded);
              resolve(imagesRef.current[index]);
            }
          }, 50);
          return;
        }

        isLoadingRef.current.add(index);

        const img = new Image();
        img.onload = () => {
          imagesRef.current[index] = img;
          loadedFramesRef.current.add(index);
          isLoadingRef.current.delete(index);
          resolve(img);
        };
        img.onerror = () => {
          isLoadingRef.current.delete(index);
          resolve(null);
        };
        img.src = getFrameUrl(index);
      });
    },
    [getFrameUrl]
  );

  // Draw frame on canvas
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[frameIndex];

    if (!canvas || !ctx || !img) return;

    // Handle device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Set canvas size accounting for DPR
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    // Calculate cover dimensions (like object-fit: cover)
    const imgRatio = img.width / img.height;
    const canvasRatio = rect.width / rect.height;

    let drawWidth, drawHeight, drawX, drawY;

    if (imgRatio > canvasRatio) {
      // Image is wider - fit height, crop width
      drawHeight = rect.height;
      drawWidth = drawHeight * imgRatio;
      drawX = (rect.width - drawWidth) / 2;
      drawY = 0;
    } else {
      // Image is taller - fit width, crop height
      drawWidth = rect.width;
      drawHeight = drawWidth / imgRatio;
      drawX = 0;
      drawY = (rect.height - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Initialize images array and preload first batch
  useEffect(() => {
    imagesRef.current = new Array(frameCount).fill(null);

    // Load first frame immediately
    loadFrame(0).then((img) => {
      if (img) {
        setIsFirstFrameLoaded(true);
        drawFrame(0);
      }
    });

    // Preload initial batch
    const preloadInitial = async () => {
      const loadPromises = [];
      for (let i = 1; i < Math.min(preloadCount, frameCount); i++) {
        loadPromises.push(loadFrame(i));
      }
      await Promise.all(loadPromises);
    };

    preloadInitial();

    // Lazy load remaining frames in background
    const loadRemaining = async () => {
      for (let i = preloadCount; i < frameCount; i++) {
        // Small delay between loads to not overwhelm
        await new Promise((resolve) => setTimeout(resolve, 50));
        loadFrame(i);
      }
    };

    // Start loading remaining after initial batch
    const timer = setTimeout(loadRemaining, 1000);

    return () => clearTimeout(timer);
  }, [frameCount, preloadCount, loadFrame, drawFrame]);

  // Setup GSAP ScrollTrigger
  useEffect(() => {
    if (prefersReducedMotion || !isFirstFrameLoaded) return;

    const container = containerRef.current;
    const content = contentRef.current;
    if (!container) return;

    // Create scroll trigger for frame animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom top",
      scrub: 0.5, // Smooth scrubbing with slight delay
      onUpdate: (self) => {
        const progress = self.progress;
        const targetFrame = Math.min(
          Math.floor(progress * (frameCount - 1)),
          frameCount - 1
        );

        // Only redraw if frame changed
        if (targetFrame !== currentFrameRef.current) {
          currentFrameRef.current = targetFrame;

          // Ensure frame is loaded before drawing
          if (imagesRef.current[targetFrame]) {
            drawFrame(targetFrame);
          } else {
            // Load on demand if not ready
            loadFrame(targetFrame).then(() => {
              if (currentFrameRef.current === targetFrame) {
                drawFrame(targetFrame);
              }
            });
          }

          // Preload nearby frames
          const preloadRange = 5;
          for (let i = targetFrame - preloadRange; i <= targetFrame + preloadRange; i++) {
            if (i >= 0 && i < frameCount && !imagesRef.current[i]) {
              loadFrame(i);
            }
          }
        }
      },
    });

    // Fade content on scroll
    if (content) {
      gsap.to(content, {
        opacity: 0,
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "30% top",
          scrub: true,
        },
      });
    }

    return () => {
      scrollTrigger.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [frameCount, prefersReducedMotion, isFirstFrameLoaded, drawFrame, loadFrame]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (isFirstFrameLoaded) {
        drawFrame(currentFrameRef.current);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isFirstFrameLoaded, drawFrame]);

  return (
    <section
      ref={containerRef}
      className={cn("relative w-full overflow-hidden", className)}
    >
      {/* Canvas layer - renders frames */}
      <div className="absolute inset-0 w-full h-full">
        <canvas
          ref={canvasRef}
          className={cn(
            "w-full h-full transition-opacity duration-500",
            isFirstFrameLoaded ? "opacity-100" : "opacity-0"
          )}
          style={{ display: "block" }}
        />

        {/* Fallback/loading state - first frame as img */}
        {!isFirstFrameLoaded && (
          <div className="absolute inset-0 bg-primary/20 animate-pulse" />
        )}
      </div>

      {/* Overlay gradient */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: `linear-gradient(
            to bottom,
            oklch(0.10 0.02 240 / ${overlayOpacity * 0.3}) 0%,
            oklch(0.10 0.02 240 / ${overlayOpacity * 0.15}) 50%,
            oklch(0.10 0.02 240 / ${overlayOpacity * 0.4}) 100%
          )`,
        }}
      />

      {/* Content layer */}
      <div ref={contentRef} className="relative z-10">
        {children}
      </div>
    </section>
  );
}
