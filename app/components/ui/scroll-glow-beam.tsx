"use client";

import { useEffect, useRef } from "react";

/**
 * A single vertical glowing amber beam that travels down the left edge
 * of the page as the user scrolls. Pure CSS + one rAF listener — no
 * per-section hooks, no Framer Motion overhead.
 */
export function ScrollGlowBeam() {
  const beamRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;

      // Position the glowing dot along the full page height
      const pageH = document.documentElement.scrollHeight;
      const dotY = progress * pageH;

      if (beamRef.current) {
        beamRef.current.style.transform = `translateY(${dotY}px)`;
      }
      // The trail line grows from top to the dot position
      if (trailRef.current) {
        trailRef.current.style.height = `${dotY}px`;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // initial position

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Trail line — fades from transparent at top to amber at current scroll position */}
      <div
        ref={trailRef}
        style={{
          position: "absolute",
          top: 0,
          left: 28,
          width: 1.5,
          height: 0,
          background: "linear-gradient(to bottom, transparent 0%, #d4972a33 40%, #d4972a88 100%)",
          pointerEvents: "none",
          zIndex: 50,
        }}
      />

      {/* Glowing dot — the main beam point */}
      <div
        ref={beamRef}
        style={{
          position: "absolute",
          top: 0,
          left: 20,
          width: 18,
          height: 18,
          pointerEvents: "none",
          zIndex: 50,
          willChange: "transform",
        }}
      >
        {/* Core dot */}
        <div
          style={{
            position: "absolute",
            top: 4,
            left: 4,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#d4972a",
            boxShadow: "0 0 8px 2px #d4972a, 0 0 20px 6px #d4972a88, 0 0 40px 12px #d4972a44",
          }}
        />
        {/* Soft wide halo */}
        <div
          style={{
            position: "absolute",
            top: -20,
            left: -20,
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: "radial-gradient(circle, #d4972a33 0%, transparent 70%)",
          }}
        />
      </div>
    </>
  );
}
