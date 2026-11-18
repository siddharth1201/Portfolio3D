"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { NeuralCore } from "./neural-core";
import { pointer, clickRequest } from "./pointer-store";

export default function Scene({ variant = "home" }: { variant?: "home" | "article" }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Track the pointer globally so the scene reacts even when
    // DOM content (which covers the fixed canvas) receives the event.
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Click → shockwave request (skipped for reduced-motion users)
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onDown = (e: PointerEvent) => {
      clickRequest.ndcX = (e.clientX / window.innerWidth) * 2 - 1;
      clickRequest.ndcY = -((e.clientY / window.innerHeight) * 2 - 1);
      clickRequest.pending = true;
    };
    if (!reduceMotion) window.addEventListener("pointerdown", onDown, { passive: true });

    // Gyroscope tilt stands in for the mouse on touch devices.
    // (iOS fires these only after the user grants motion permission.)
    let onOrient: ((e: DeviceOrientationEvent) => void) | null = null;
    if (window.matchMedia("(pointer: coarse)").matches && !reduceMotion) {
      onOrient = (e) => {
        if (e.gamma == null || e.beta == null) return;
        pointer.x = Math.max(-1, Math.min(1, e.gamma / 25));
        pointer.y = Math.max(-1, Math.min(1, -(e.beta - 45) / 25));
      };
      window.addEventListener("deviceorientation", onOrient);
    }

    const mqMobile = window.matchMedia("(max-width: 767px)");
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      setIsMobile(mqMobile.matches);
      setIsDesktop(mqDesktop.matches);
    };
    update();
    mqMobile.addEventListener("change", update);
    mqDesktop.addEventListener("change", update);

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (!reduceMotion) window.removeEventListener("pointerdown", onDown);
      if (onOrient) window.removeEventListener("deviceorientation", onOrient);
      mqMobile.removeEventListener("change", update);
      mqDesktop.removeEventListener("change", update);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.6], fov: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <NeuralCore key={isMobile ? "m" : "d"} isMobile={isMobile} isDesktop={isDesktop} variant={variant} />
      </Canvas>
    </div>
  );
}
