import { create } from "zustand";

// Tiny UI-state bridge between the R3F scene (inside the Canvas)
// and DOM components (outside it).
export const useUI = create<{
  sceneReady: boolean;
  setSceneReady: (v: boolean) => void;
}>((set) => ({
  sceneReady: false,
  setSceneReady: (v) => set({ sceneReady: v }),
}));
