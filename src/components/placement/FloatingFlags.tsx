"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const FLAGS = [
  { name: "UAE", flag: "/flags/ae.png", size: 56 },
  { name: "Croatia", flag: "/flags/hr.png", size: 48 },
  { name: "Greece", flag: "/flags/gr.png", size: 52 },
  { name: "Israel", flag: "/flags/il.png", size: 44 },
  { name: "Kuwait", flag: "/flags/kw.png", size: 50 },
  { name: "Saudi Arabia", flag: "/flags/sa.png", size: 46 },
  { name: "Slovenia", flag: "/flags/si.png", size: 42 },
  { name: "Albania", flag: "/flags/al.png", size: 48 },
  { name: "India", flag: "/flags/in.png", size: 54 },
  { name: "Russia", flag: "/flags/ru.png", size: 44 },
];

// Orbit positions — distributed around the globe center
const ORBITS = [
  { x: -40, y: -120, delay: 0 },
  { x: 130, y: -90, delay: 0.4 },
  { x: -110, y: -20, delay: 0.8 },
  { x: 150, y: 30, delay: 1.2 },
  { x: -60, y: 100, delay: 1.6 },
  { x: 120, y: 110, delay: 2.0 },
  { x: -130, y: 60, delay: 0.6 },
  { x: 80, y: -140, delay: 1.0 },
  { x: -20, y: 140, delay: 1.4 },
  { x: 160, y: -40, delay: 1.8 },
];

export function FloatingFlags() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const flagEls = container.querySelectorAll<HTMLElement>("[data-flag]");

    let frame: number;
    let t = 0;

    function animate() {
      t += 0.003;
      flagEls.forEach((el, i) => {
        const orbit = ORBITS[i];
        const phase = orbit.delay * Math.PI;
        // Gentle floating — each flag has its own rhythm
        const dx = Math.sin(t * 1.2 + phase) * 12;
        const dy = Math.cos(t * 0.8 + phase * 0.7) * 10;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      frame = requestAnimationFrame(animate);
    }

    // Check prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches) {
      animate();
    }

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Central globe */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-10 h-10 sm:w-12 sm:h-12 text-primary/40"
              stroke="currentColor"
              strokeWidth={1}
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M4.93 4.93l14.14 14.14" opacity="0.3" />
              <path d="M19.07 4.93L4.93 19.07" opacity="0.3" />
            </svg>
          </div>
        </div>

        {/* Orbit ring */}
        <div className="absolute inset-0 -m-20 sm:-m-24 rounded-full border border-dashed border-primary/10 animate-[spin_60s_linear_infinite]" />
        <div className="absolute inset-0 -m-36 sm:-m-40 rounded-full border border-dashed border-primary/[0.06] animate-[spin_90s_linear_infinite_reverse]" />
      </div>

      {/* Floating flag items */}
      {FLAGS.map((flag, i) => (
        <div
          key={flag.name}
          data-flag
          className="absolute top-1/2 left-1/2 opacity-0 animate-[flagIn_0.6s_ease-out_forwards]"
          style={{
            marginLeft: ORBITS[i].x,
            marginTop: ORBITS[i].y,
            animationDelay: `${600 + i * 120}ms`,
          }}
        >
          <div className="group relative cursor-default">
            {/* Flag with shadow and border */}
            <div
              className="rounded-lg overflow-hidden shadow-lg border border-white/80 bg-white transition-transform duration-300 hover:scale-110 hover:shadow-xl"
              style={{ width: flag.size, height: flag.size * 0.67 }}
            >
              <Image
                src={flag.flag}
                alt={`${flag.name} flag`}
                width={flag.size}
                height={Math.round(flag.size * 0.67)}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Tooltip */}
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-primary/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {flag.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
