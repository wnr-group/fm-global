"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const testimonials = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1,
  src: `/testimonials/testimonial-${i + 1}.mp4`,
  poster: `/testimonials/poster-${i + 1}.jpg`,
}));

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const featuredRef = useRef<HTMLVideoElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const active = testimonials[activeIndex];

  /* ---------- Handlers ------------------------------------------- */

  const selectVideo = useCallback(
    (index: number) => {
      if (index === activeIndex && !playing) return;
      const video = featuredRef.current;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      setPlaying(false);
      setProgress(0);
      setActiveIndex(index);
    },
    [activeIndex, playing],
  );

  const togglePlay = useCallback(() => {
    const video = featuredRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = featuredRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  /* ---------- Progress bar via timeupdate ----------------------- */

  useEffect(() => {
    const video = featuredRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.duration && Number.isFinite(video.duration)) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [activeIndex]);

  /* ---------- Scroll active mobile thumbnail into view ---------- */

  useEffect(() => {
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const activeThumb = container.children[activeIndex] as HTMLElement | undefined;
    if (activeThumb) {
      const scrollLeft =
        activeThumb.offsetLeft -
        container.offsetWidth / 2 +
        activeThumb.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeIndex]);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative py-20 sm:py-24 lg:py-28 bg-foreground overflow-hidden"
    >
      {/* ---- Decorative background ---- */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Dot pattern — subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.99 0 240) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Soft azure radial — top-right corner warmth */}
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-primary/[0.06] blur-[120px]" />
        {/* Subtle glow — bottom-left */}
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-primary/[0.04] blur-[100px]" />
      </div>

      <div className="relative w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
        {/* ---- Header ---- */}
        <ScrollReveal>
          <header className="mb-12 lg:mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Success Stories
              </span>
              <div className="h-px w-12 bg-primary" />
            </div>
            <h2
              id="testimonials-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.1]"
              style={{ color: "oklch(0.96 0.005 240)" }}
            >
              Hear from our{" "}
              <span className="text-primary">placed candidates</span>
            </h2>
          </header>
        </ScrollReveal>

        {/* ---- Main layout: Featured + Thumbnails ---- */}
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-start">
          {/* ======== Featured Player ======== */}
          <ScrollReveal className="w-full lg:w-[58%] flex-none">
            <div
              className="relative w-full aspect-[9/16] max-h-[70vh] lg:aspect-auto lg:h-[600px] rounded-2xl overflow-hidden bg-foreground group cursor-pointer"
              onClick={togglePlay}
              role="button"
              tabIndex={0}
              aria-label={playing ? "Pause video" : "Play video"}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  togglePlay();
                }
              }}
            >
              {/* Video — key forces remount on switch */}
              <video
                key={active.src}
                ref={featuredRef}
                src={active.src}
                poster={active.poster}
                playsInline
                muted={muted}
                preload="none"
                className="absolute inset-0 w-full h-full object-cover"
                onEnded={() => {
                  setPlaying(false);
                  setProgress(100);
                }}
              />

              {/* Play / Pause center button */}
              <div
                className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 ${
                  playing
                    ? "opacity-0 group-hover:opacity-100"
                    : "opacity-100"
                }`}
              >
                <span
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center border border-white/20 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: "oklch(0.15 0.03 240 / 0.6)" }}
                >
                  {playing ? (
                    <Pause className="w-6 h-6 text-white fill-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  )}
                </span>
              </div>

              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-10" />

              {/* Bottom-left label */}
              <div className="absolute bottom-5 left-5 z-20 pointer-events-none">
                <p
                  className="font-display text-sm tracking-wide"
                  style={{ color: "oklch(0.96 0.005 240)" }}
                >
                  Placed Candidate
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "oklch(0.96 0.005 240 / 0.55)" }}
                >
                  FM International
                </p>
              </div>

              {/* Video counter — bottom-left, above label */}
              <div className="absolute top-4 left-5 z-20 pointer-events-none">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium tabular-nums px-2.5 py-1 rounded-md"
                  style={{
                    backgroundColor: "oklch(0.15 0.03 240 / 0.55)",
                    color: "oklch(0.96 0.005 240 / 0.8)",
                  }}
                >
                  {activeIndex + 1}
                  <span style={{ color: "oklch(0.96 0.005 240 / 0.35)" }}>
                    /
                  </span>
                  {testimonials.length}
                </span>
              </div>

              {/* Mute/unmute — bottom-right */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                aria-label={muted ? "Unmute" : "Mute"}
                className={`absolute bottom-5 right-5 z-20 w-9 h-9 rounded-full flex items-center justify-center border border-white/15 transition-all duration-300 ${
                  playing
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 pointer-events-none"
                }`}
                style={{ backgroundColor: "oklch(0.15 0.03 240 / 0.55)" }}
                tabIndex={playing ? 0 : -1}
              >
                {muted ? (
                  <VolumeX className="w-4 h-4 text-white/80" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white/80" />
                )}
              </button>

              {/* Progress bar — thin line at very bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[3px] z-30"
                style={{ backgroundColor: "oklch(0.96 0.005 240 / 0.1)" }}
              >
                <div
                  className="h-full bg-primary transition-[width] duration-150 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </ScrollReveal>

          {/* ======== Desktop Thumbnail Grid ======== */}
          <ScrollReveal
            delay={120}
            className="hidden lg:grid grid-cols-2 gap-3 flex-1 content-start"
          >
            {testimonials.map((t, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={t.id}
                  onClick={() => selectVideo(index)}
                  aria-label={`Watch testimonial ${index + 1} of ${testimonials.length}`}
                  aria-current={isActive ? "true" : undefined}
                  className="relative aspect-[9/16] rounded-xl overflow-hidden group/thumb focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  style={{
                    transitionProperty: "opacity, transform, box-shadow",
                    transitionDuration: "300ms",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    opacity: isActive ? 1 : 0.45,
                    transform: isActive ? "scale(1.02)" : "scale(1)",
                    boxShadow: isActive
                      ? "0 0 0 2px oklch(0.96 0.005 240), 0 8px 24px -4px oklch(0 0 0 / 0.3)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.opacity = "0.75";
                      e.currentTarget.style.transform = "scale(1.01)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.opacity = "0.45";
                      e.currentTarget.style.transform = "scale(1)";
                    }
                  }}
                >
                  {/* Poster image */}
                  <img
                    src={t.poster}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Darkened overlay for non-active */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                      backgroundColor: "oklch(0.12 0.03 240 / 0.4)",
                      opacity: isActive ? 0 : 1,
                    }}
                  />

                  {/* Play icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center border border-white/20 transition-transform duration-300 group-hover/thumb:scale-110"
                      style={{
                        backgroundColor: isActive
                          ? "oklch(0.32 0.08 240 / 0.7)"
                          : "oklch(0.15 0.03 240 / 0.5)",
                      }}
                    >
                      {isActive && playing ? (
                        <Pause className="w-3 h-3 text-white fill-white" />
                      ) : (
                        <Play className="w-3 h-3 text-white fill-white ml-px" />
                      )}
                    </span>
                  </div>

                  {/* Active indicator — small number badge */}
                  <div className="absolute top-2 right-2">
                    <span
                      className="text-[10px] font-medium tabular-nums leading-none px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: isActive
                          ? "oklch(0.32 0.08 240 / 0.8)"
                          : "oklch(0.15 0.03 240 / 0.5)",
                        color: "oklch(0.96 0.005 240 / 0.8)",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </button>
              );
            })}
          </ScrollReveal>

          {/* ======== Mobile Thumbnail Strip ======== */}
          <div
            ref={mobileScrollRef}
            className="flex lg:hidden gap-3 overflow-x-auto scrollbar-hide w-full pb-1 -mb-1"
          >
            {testimonials.map((t, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={t.id}
                  onClick={() => selectVideo(index)}
                  aria-label={`Watch testimonial ${index + 1}`}
                  aria-current={isActive ? "true" : undefined}
                  className="relative flex-none w-[72px] aspect-[9/16] rounded-lg overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  style={{
                    transitionProperty: "opacity, transform, box-shadow",
                    transitionDuration: "250ms",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    opacity: isActive ? 1 : 0.45,
                    transform: isActive ? "scale(1)" : "scale(0.97)",
                    boxShadow: isActive
                      ? "0 0 0 2px oklch(0.96 0.005 240)"
                      : "none",
                  }}
                >
                  <img
                    src={t.poster}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-200"
                    style={{
                      backgroundColor: "oklch(0.12 0.03 240 / 0.35)",
                      opacity: isActive ? 0 : 1,
                    }}
                  />

                  {/* Play icon — small */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: isActive
                          ? "oklch(0.32 0.08 240 / 0.7)"
                          : "oklch(0.15 0.03 240 / 0.5)",
                      }}
                    >
                      {isActive && playing ? (
                        <Pause className="w-2.5 h-2.5 text-white fill-white" />
                      ) : (
                        <Play className="w-2.5 h-2.5 text-white fill-white ml-px" />
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
