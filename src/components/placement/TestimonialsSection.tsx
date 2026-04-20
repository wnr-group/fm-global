"use client";

import { useRef, useState } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const testimonials = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1,
  src: `/testimonials/testimonial-${i + 1}.mp4`,
  poster: `/testimonials/poster-${i + 1}.jpg`,
}));

function VideoCard({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    // Pause all other videos on the page
    document.querySelectorAll<HTMLVideoElement>("video").forEach((v) => {
      if (v !== video && !v.paused) {
        v.pause();
      }
    });

    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  return (
    <div className="relative flex-none w-[160px] sm:w-[180px] lg:w-[200px] rounded-2xl overflow-hidden bg-foreground/5 border border-border group cursor-pointer shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
      {/* 9:16 aspect */}
      <div className="aspect-[9/16]">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          preload="none"
          className="w-full h-full object-cover"
          onEnded={() => setPlaying(false)}
          onClick={togglePlay}
        />
      </div>

      {/* Play / pause overlay */}
      <button
        onClick={togglePlay}
        aria-label={playing ? "Pause" : "Play"}
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
        }`}
      >
        <span className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
          {playing ? (
            <Pause className="w-5 h-5 text-white fill-white" />
          ) : (
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          )}
        </span>
      </button>

      {/* Mute toggle — only visible while playing */}
      {playing && (
        <button
          onClick={(e) => { e.stopPropagation(); toggleMute(); }}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:bg-black/70 transition-colors"
        >
          {muted ? (
            <VolumeX className="w-3.5 h-3.5 text-white" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-white" />
          )}
        </button>
      )}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="py-16 sm:py-20 lg:py-24 bg-background overflow-hidden"
    >
      <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
        <ScrollReveal>
          <header className="mb-10 lg:mb-14">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Success Stories
              </span>
            </div>
            <h2
              id="testimonials-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground leading-[1.1]"
            >
              Hear from our{" "}
              <span className="text-primary">placed candidates</span>
            </h2>
          </header>
        </ScrollReveal>
      </div>

      {/* Horizontal scroll strip — bleeds to edges */}
      <div className="w-full">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-5 sm:px-8 lg:px-[6%] xl:px-[8%] pb-4">
          {testimonials.map((t, index) => (
            <ScrollReveal key={t.id} delay={index * 60}>
              <VideoCard src={t.src} poster={t.poster} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
