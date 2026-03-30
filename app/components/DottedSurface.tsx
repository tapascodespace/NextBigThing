"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

export function DottedSurface({
  style,
  className,
}: {
  style?: React.CSSProperties;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animIdRef = useRef(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const container = canvasRef.current?.parentElement;
    if (!canvasRef.current || !container) return;

    const getSize = () => ({
      width: container.clientWidth || window.innerWidth,
      height: container.clientHeight || window.innerHeight,
    });

    // On mobile: fewer particles, lower pixel ratio, throttled animation
    const SEPARATION = isMobile ? 180 : 120;
    const AMOUNTX = isMobile ? 25 : 50;
    const AMOUNTY = isMobile ? 25 : 50;
    const PIXEL_RATIO = isMobile ? 1 : window.devicePixelRatio;
    const ANIM_SPEED = isMobile ? 0.05 : 0.1;

    const scene = new THREE.Scene();
    const { width, height } = getSize();

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.set(0, 300, 1100);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: !isMobile,
      powerPreference: isMobile ? "low-power" : "default",
    });
    renderer.setPixelRatio(PIXEL_RATIO);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    // Particles
    const positions: number[] = [];
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions.push(
          ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
          0,
          iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
        );
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
      size: isMobile ? 8 : 10,
      color: 0xcccccc,
      transparent: true,
      opacity: isMobile ? 0.85 : 0.85,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let frameCount = 0;

    const animate = () => {
      animIdRef.current = requestAnimationFrame(animate);

      // On mobile, only render every 2nd frame (30fps cap)
      if (isMobile) {
        frameCount++;
        if (frameCount % 2 !== 0) return;
      }

      const posArr = geometry.attributes.position.array as Float32Array;
      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          posArr[i * 3 + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      count += ANIM_SPEED;
    };

    const handleResize = () => {
      const { width: w, height: h } = getSize();
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);
    requestAnimationFrame(() => {
      handleResize();
      animate();
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animIdRef.current);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        pointerEvents: "none",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        ...style,
      }}
    />
  );
}
