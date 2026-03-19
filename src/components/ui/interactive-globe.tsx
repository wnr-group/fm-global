"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useCallback, useState } from "react";

interface GlobeProps {
  className?: string;
  size?: number;
  dotColor?: string;
  arcColor?: string;
  markerColor?: string;
  autoRotateSpeed?: number;
  connections?: { from: [number, number]; to: [number, number] }[];
  markers?: { lat: number; lng: number; label?: string }[];
}

// FM Global placement locations - Global spread for visual coverage
const FM_MARKERS = [
  // India (training hub)
  { lat: 13.08, lng: 80.27, label: "Chennai" },
  { lat: 19.08, lng: 72.88, label: "Mumbai" },
  { lat: 17.39, lng: 78.49, label: "Hyderabad" },
  { lat: 12.97, lng: 77.59, label: "Bangalore" },
  // Gulf region
  { lat: 25.28, lng: 51.52, label: "Qatar" },
  { lat: 24.47, lng: 54.37, label: "UAE" },
  { lat: 26.07, lng: 50.55, label: "Bahrain" },
  { lat: 29.38, lng: 47.99, label: "Kuwait" },
  { lat: 23.58, lng: 58.38, label: "Oman" },
  { lat: 24.71, lng: 46.68, label: "Saudi Arabia" },
  // Europe
  { lat: 51.51, lng: -0.13, label: "London" },
  { lat: 52.52, lng: 13.40, label: "Berlin" },
  { lat: 48.86, lng: 2.35, label: "Paris" },
  { lat: 55.75, lng: 37.62, label: "Moscow" },
  // Americas
  { lat: 40.71, lng: -74.01, label: "New York" },
  { lat: 29.76, lng: -95.37, label: "Houston" },
  { lat: 25.76, lng: -80.19, label: "Miami" },
  { lat: -23.55, lng: -46.63, label: "São Paulo" },
  // Asia Pacific
  { lat: 1.35, lng: 103.82, label: "Singapore" },
  { lat: 35.68, lng: 139.69, label: "Tokyo" },
  { lat: 22.32, lng: 114.17, label: "Hong Kong" },
  { lat: -33.87, lng: 151.21, label: "Sydney" },
  // Africa
  { lat: -26.20, lng: 28.04, label: "Johannesburg" },
  { lat: 30.04, lng: 31.24, label: "Cairo" },
  { lat: 6.52, lng: 3.38, label: "Lagos" },
];

// Connections spread globally - ensures arcs visible from all angles
const FM_CONNECTIONS: { from: [number, number]; to: [number, number] }[] = [
  // Chennai (hub) to Gulf
  { from: [13.08, 80.27], to: [25.28, 51.52] }, // Chennai → Qatar
  { from: [13.08, 80.27], to: [24.47, 54.37] }, // Chennai → UAE
  { from: [13.08, 80.27], to: [24.71, 46.68] }, // Chennai → Saudi
  // India internal
  { from: [13.08, 80.27], to: [19.08, 72.88] }, // Chennai → Mumbai
  { from: [19.08, 72.88], to: [24.47, 54.37] }, // Mumbai → UAE
  // Gulf interconnections
  { from: [25.28, 51.52], to: [26.07, 50.55] }, // Qatar → Bahrain
  { from: [24.47, 54.37], to: [23.58, 58.38] }, // UAE → Oman
  // Europe connections
  { from: [51.51, -0.13], to: [52.52, 13.40] }, // London → Berlin
  { from: [51.51, -0.13], to: [48.86, 2.35] },  // London → Paris
  { from: [52.52, 13.40], to: [55.75, 37.62] }, // Berlin → Moscow
  { from: [51.51, -0.13], to: [40.71, -74.01] }, // London → New York
  // Americas
  { from: [40.71, -74.01], to: [29.76, -95.37] }, // New York → Houston
  { from: [29.76, -95.37], to: [25.76, -80.19] }, // Houston → Miami
  { from: [25.76, -80.19], to: [-23.55, -46.63] }, // Miami → São Paulo
  // Asia Pacific
  { from: [1.35, 103.82], to: [13.08, 80.27] },  // Singapore → Chennai
  { from: [1.35, 103.82], to: [22.32, 114.17] }, // Singapore → Hong Kong
  { from: [22.32, 114.17], to: [35.68, 139.69] }, // Hong Kong → Tokyo
  { from: [1.35, 103.82], to: [-33.87, 151.21] }, // Singapore → Sydney
  // Africa
  { from: [30.04, 31.24], to: [24.47, 54.37] },  // Cairo → UAE
  { from: [30.04, 31.24], to: [-26.20, 28.04] }, // Cairo → Johannesburg
  { from: [6.52, 3.38], to: [51.51, -0.13] },    // Lagos → London
  // Cross-continental
  { from: [24.47, 54.37], to: [1.35, 103.82] },  // UAE → Singapore
  { from: [55.75, 37.62], to: [35.68, 139.69] }, // Moscow → Tokyo
  { from: [-23.55, -46.63], to: [6.52, 3.38] },  // São Paulo → Lagos
];

function latLngToXYZ(
  lat: number,
  lng: number,
  radius: number
): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function rotateY(
  x: number,
  y: number,
  z: number,
  angle: number
): [number, number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos + z * sin, y, -x * sin + z * cos];
}

function rotateX(
  x: number,
  y: number,
  z: number,
  angle: number
): [number, number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x, y * cos - z * sin, y * sin + z * cos];
}

function project(
  x: number,
  y: number,
  z: number,
  cx: number,
  cy: number,
  fov: number
): [number, number, number] {
  const scale = fov / (fov + z);
  return [x * scale + cx, y * scale + cy, z];
}

export function InteractiveGlobe({
  className,
  size = 600,
  // FM Global Careers brand: dark azure for all elements
  dotColor = "oklch(0.32 0.08 240 / ALPHA)",
  arcColor = "oklch(0.45 0.10 240 / 0.5)",
  markerColor = "oklch(0.32 0.08 240 / 1)",
  autoRotateSpeed = 0.002,
  connections = FM_CONNECTIONS,
  markers = FM_MARKERS,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSupported, setCanvasSupported] = useState(true);
  // Initial rotation to center on Gulf/Saudi region (longitude ~50°, latitude ~25°)
  const rotYRef = useRef(-0.9);
  const rotXRef = useRef(-0.45);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    startRotY: number;
    startRotX: number;
  }>({ active: false, startX: 0, startY: 0, startRotY: 0, startRotX: 0 });
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const dotsRef = useRef<[number, number, number][]>([]);

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const dots: [number, number, number][] = [];
    const numDots = 1200;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < numDots; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / numDots);
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.cos(phi);
      const z = Math.sin(theta) * Math.sin(phi);
      dots.push([x, y, z]);
    }
    dotsRef.current = dots;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setCanvasSupported(false);
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.34;
    const fov = 600;

    // Only auto-rotate if not dragging and reduced motion is not preferred
    if (!dragRef.current.active && !prefersReducedMotion) {
      rotYRef.current -= autoRotateSpeed;
    }

    // Only animate time if reduced motion is not preferred
    if (!prefersReducedMotion) {
      timeRef.current += 0.015;
    }
    const time = timeRef.current;

    ctx.clearRect(0, 0, w, h);

    // Outer glow - brand azure tint, fades well before canvas edge
    const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.6, cx, cy, radius * 1.35);
    glowGrad.addColorStop(0, "oklch(0.32 0.08 240 / 0.06)");
    glowGrad.addColorStop(0.7, "oklch(0.32 0.08 240 / 0.03)");
    glowGrad.addColorStop(1, "oklch(0.32 0.08 240 / 0)");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);

    // Globe outline
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "oklch(0.32 0.08 240 / 0.2)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const ry = rotYRef.current;
    const rx = rotXRef.current;

    // Draw dots
    const dots = dotsRef.current;
    for (let i = 0; i < dots.length; i++) {
      let [x, y, z] = dots[i];
      x *= radius;
      y *= radius;
      z *= radius;

      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);

      if (z > 0) continue;

      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const depthAlpha = Math.max(0.15, 1 - (z + radius) / (2 * radius));
      const dotSize = 1.2 + depthAlpha * 0.6;

      ctx.beginPath();
      ctx.arc(sx, sy, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = dotColor.replace("ALPHA", depthAlpha.toFixed(2));
      ctx.fill();
    }

    // Draw connections as arcs
    for (const conn of connections) {
      const [lat1, lng1] = conn.from;
      const [lat2, lng2] = conn.to;

      let [x1, y1, z1] = latLngToXYZ(lat1, lng1, radius);
      let [x2, y2, z2] = latLngToXYZ(lat2, lng2, radius);

      [x1, y1, z1] = rotateX(x1, y1, z1, rx);
      [x1, y1, z1] = rotateY(x1, y1, z1, ry);
      [x2, y2, z2] = rotateX(x2, y2, z2, rx);
      [x2, y2, z2] = rotateY(x2, y2, z2, ry);

      if (z1 > radius * 0.3 && z2 > radius * 0.3) continue;

      const [sx1, sy1] = project(x1, y1, z1, cx, cy, fov);
      const [sx2, sy2] = project(x2, y2, z2, cx, cy, fov);

      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const midZ = (z1 + z2) / 2;
      const midLen = Math.sqrt(midX * midX + midY * midY + midZ * midZ);
      const arcHeight = radius * 1.25;
      const elevX = (midX / midLen) * arcHeight;
      const elevY = (midY / midLen) * arcHeight;
      const elevZ = (midZ / midLen) * arcHeight;
      const [scx, scy] = project(elevX, elevY, elevZ, cx, cy, fov);

      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.quadraticCurveTo(scx, scy, sx2, sy2);
      ctx.strokeStyle = arcColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Traveling dot - only if motion is allowed
      if (!prefersReducedMotion) {
        const t = (Math.sin(time * 1.2 + lat1 * 0.1) + 1) / 2;
        const tx = (1 - t) * (1 - t) * sx1 + 2 * (1 - t) * t * scx + t * t * sx2;
        const ty = (1 - t) * (1 - t) * sy1 + 2 * (1 - t) * t * scy + t * t * sy2;

        ctx.beginPath();
        ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = markerColor;
        ctx.fill();
      }
    }

    // Draw markers
    for (const marker of markers) {
      let [x, y, z] = latLngToXYZ(marker.lat, marker.lng, radius);
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);

      if (z > radius * 0.1) continue;

      const [sx, sy] = project(x, y, z, cx, cy, fov);

      // Pulse ring - only if motion is allowed
      if (!prefersReducedMotion) {
        const pulse = Math.sin(time * 2 + marker.lat) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(sx, sy, 5 + pulse * 4, 0, Math.PI * 2);
        ctx.strokeStyle = `oklch(0.32 0.08 240 / ${0.2 + pulse * 0.15})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        // Static ring for reduced motion
        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.strokeStyle = "oklch(0.32 0.08 240 / 0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Core dot
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fillStyle = markerColor;
      ctx.fill();

      // Label
      if (marker.label) {
        ctx.font = "500 11px system-ui, sans-serif";
        ctx.fillStyle = "oklch(0.32 0.08 240 / 0.8)";
        ctx.fillText(marker.label, sx + 10, sy + 4);
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, [dotColor, arcColor, markerColor, autoRotateSpeed, connections, markers, prefersReducedMotion]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  // Pause animation when not visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          cancelAnimationFrame(animRef.current);
        } else {
          animRef.current = requestAnimationFrame(draw);
        }
      },
      { threshold: 0.1 }
    );

    const canvas = canvasRef.current;
    if (canvas) observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startRotY: rotYRef.current,
      startRotX: rotXRef.current,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    e.preventDefault();
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    // Drag right → rotate globe right, drag up → rotate globe up
    rotYRef.current = dragRef.current.startRotY - dx * 0.005;
    rotXRef.current = Math.max(
      -1,
      Math.min(1, dragRef.current.startRotX + dy * 0.005)
    );
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    dragRef.current.active = false;
  }, []);

  // Generate accessible description
  const locationList = markers.map(m => m.label).filter(Boolean).join(", ");

  // Fallback if canvas not supported
  if (!canvasSupported) {
    return <GlobeStatic className={className} />;
  }

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        style={{ width: size, height: size }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="img"
        aria-label={`Interactive globe showing FM Global placement network connecting ${locationList}`}
      />
      {/* Screen reader description */}
      <div className="sr-only" aria-live="polite">
        Interactive globe visualization showing placement locations: {locationList}.
        Drag to rotate the globe.
      </div>
    </div>
  );
}

// Static fallback for mobile/reduced motion
export function GlobeStatic({ className }: { className?: string }) {
  const locations = FM_MARKERS.map(m => m.label).filter(Boolean);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        className
      )}
      role="img"
      aria-label={`FM Global placement network: ${locations.join(", ")}`}
    >
      <div className="relative w-64 h-64 sm:w-80 sm:h-80">
        {/* Circle background */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 bg-primary/5" />

        {/* Location dots */}
        <div className="absolute inset-4 flex flex-wrap items-center justify-center gap-2 p-4">
          {locations.map((location, i) => (
            <span
              key={location}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {location}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
