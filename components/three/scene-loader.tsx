"use client";

import dynamic from "next/dynamic";

// WebGL + window APIs must never run during SSR —
// this client-only loader is the boundary.
const Scene = dynamic(() => import("./scene"), {
  ssr: false,
  loading: () => null,
});

export function SceneLoader() {
  return <Scene />;
}
