"use client";

import { useEffect, useState } from "react";
import { useUI } from "@/lib/store";

// Staged-reveal loader: DOM paints instantly, the veil lifts as soon as
// the 3D scene signals ready (or after a hard timeout — never trap users).
export function IntroVeil() {
  const sceneReady = useUI((s) => s.sceneReady);
  const [gone, setGone] = useState(false);

  // Safety: force-remove the veil even if the scene never signals
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // Let the fade-out finish before unmounting
  useEffect(() => {
    if (!sceneReady) return;
    const t = setTimeout(() => setGone(true), 900);
    return () => clearTimeout(t);
  }, [sceneReady]);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#05060a] transition-opacity duration-700 ${
        sceneReady ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <span className="text-gradient animate-pulse text-3xl font-bold">SV.</span>
    </div>
  );
}
