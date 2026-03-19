"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollGlowBorderProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  as?: "section" | "div";
  glowColor?: string;
  glowSize?: number;
  borderRadius?: number;
}

export function ScrollGlowBorder({
  children,
  className,
  style,
  id,
  as = "section",
  glowColor = "#d4972a",
  glowSize = 120,
  borderRadius = 0,
}: ScrollGlowBorderProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    // start: when top of element hits bottom of viewport
    // end: when bottom of element leaves top of viewport
    offset: ["start end", "end start"],
  });

  // Map scroll progress (0→1) to angle (0→720) — two full rotations as the section scrolls through
  const angle = useTransform(scrollYProgress, [0, 1], [0, 720]);

  const Tag = as === "section" ? motion.section : motion.div;

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      style={{
        position: "relative",
        ...style,
      }}
    >
      {/* Glow border overlay */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius,
          pointerEvents: "none",
          zIndex: 1,
          // Use a conic gradient that rotates based on scroll
          background: useTransform(angle, (a) =>
            `conic-gradient(from ${a}deg at 50% 50%, transparent 0deg, transparent 300deg, ${glowColor}66 340deg, ${glowColor} 360deg)`
          ),
          // Mask to only show the border (not the fill)
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: 1.5,
        }}
      />
      {/* Blurred glow behind for soft light effect */}
      <motion.div
        style={{
          position: "absolute",
          inset: -2,
          borderRadius,
          pointerEvents: "none",
          zIndex: 0,
          filter: `blur(${glowSize / 3}px)`,
          opacity: 0.3,
          background: useTransform(angle, (a) =>
            `conic-gradient(from ${a}deg at 50% 50%, transparent 0deg, transparent 280deg, ${glowColor}44 330deg, ${glowColor}88 360deg)`
          ),
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: 3,
        }}
      />
      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </Tag>
  );
}
