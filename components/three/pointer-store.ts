// Module-level input state, updated by window listeners.
// This way the 3D scene stays reactive even when DOM sections
// (which cover the canvas) receive the pointer events.
export const pointer = { x: 0, y: 0 }; // normalized: -1..1

// One-shot click request, consumed inside the scene's useFrame:
// NDC coords are unprojected into world space there (camera lives in the Canvas).
export const clickRequest = { ndcX: 0, ndcY: 0, pending: false };
