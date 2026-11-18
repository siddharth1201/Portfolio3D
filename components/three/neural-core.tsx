"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pointer, clickRequest } from "./pointer-store";
import { useUI } from "@/lib/store";

const CYAN = new THREE.Color("#22d3ee");
const VIOLET = new THREE.Color("#8b5cf6");
const WHITE = new THREE.Color("#eaf6ff");

// Deterministic PRNG so the core looks identical on every load
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Even distribution of points on a sphere (Fibonacci lattice) + slight jitter
function fibonacciSphere(count: number, radius: number, jitter: () => number) {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const j = 1 + (jitter() - 0.5) * 0.14; // organic imperfection
    positions[i * 3] = Math.cos(theta) * r * radius * j;
    positions[i * 3 + 1] = y * radius * j;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius * j;
  }
  return positions;
}

function sphereColors(count: number, rands: Float32Array) {
  const colors = new Float32Array(count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const t = rands[i];
    if (t > 0.94) c.lerpColors(CYAN, WHITE, 0.8); // rare bright sparks
    else c.lerpColors(CYAN, VIOLET, t);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  return colors;
}

// Connect each point to its 2 nearest neighbours (deduplicated)
// → a uniform "synapse" mesh of ~N segments
function buildLinks(positions: Float32Array, rands: Float32Array) {
  const count = positions.length / 3;
  const added = new Set<string>();
  const seg: number[] = [];
  const col: number[] = [];
  const rnd: number[] = [];
  const a = new THREE.Color();
  const b = new THREE.Color();

  for (let i = 0; i < count; i++) {
    let n1 = -1, n2 = -1, d1 = Infinity, d2 = Infinity;
    for (let j = 0; j < count; j++) {
      if (j === i) continue;
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      const d = dx * dx + dy * dy + dz * dz;
      if (d < d1) {
        d2 = d1; n2 = n1; d1 = d; n1 = j;
      } else if (d < d2) {
        d2 = d; n2 = j;
      }
    }
    for (const j of [n1, n2]) {
      if (j < 0) continue;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (added.has(key)) continue;
      added.add(key);
      seg.push(
        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2],
      );
      a.lerpColors(CYAN, VIOLET, i / (count - 1));
      b.lerpColors(CYAN, VIOLET, j / (count - 1));
      col.push(a.r, a.g, a.b, b.r, b.g, b.b);
      // Each line endpoint carries its point's random so the links
      // stay attached to their particles during the spread morph
      rnd.push(rands[i], rands[j]);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(seg), 3));
  geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(col), 3));
  geo.setAttribute("aRand", new THREE.BufferAttribute(new Float32Array(rnd), 1));
  return geo;
}

// Soft radial dot texture (generated once — no asset downloads)
function makeRadialTexture(size: number, stops: [number, string][]) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [at, color] of stops) grad.addColorStop(at, color);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ─────────────────────────────────────────────────────────────
// Scroll keyframes — one "pose" per page section.
// spread: GPU displacement along each point's radial direction
//         (0 = sphere, + = exploded nebula, − = condensed core)
// ─────────────────────────────────────────────────────────────
type CoreState = {
  x: number;
  y: number;
  scale: number;
  spread: number;
  camZ: number;
  rotSpeed: number;
};

const SECTION_IDS = ["home", "skills", "projects", "contact"] as const;

export function NeuralCore({
  isMobile,
  isDesktop,
  variant = "home",
}: {
  isMobile: boolean;
  isDesktop: boolean;
  variant?: "home" | "article";
}) {
  const outer = useRef<THREE.Group>(null);   // pointer tilt + scroll position
  const spinner = useRef<THREE.Group>(null); // constant rotation + breathing
  const dust = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const glowRef = useRef<THREE.SpriteMaterial>(null);

  const count = isMobile ? 900 : 2000;

  // Shared shader uniforms — updated once per frame, read by all materials.
  // shock: wavefront radius factor (<0 = inactive), shockOrigin: click point
  // in the spinner's local space.
  const uniforms = useMemo(
    () => ({
      spread: { value: 0 },
      time: { value: 0 },
      shock: { value: -1 },
      shockOrigin: { value: new THREE.Vector3() },
    }),
    [],
  );

  // One shader injector shared by points + lines (same program cache key
  // per material type). Injects: spread morph + click shockwave.
  const inject = useMemo(() => {
    const make =
      (isPoints: boolean) =>
      (shader: { vertexShader: string; uniforms: Record<string, { value: unknown }> }) => {
        shader.uniforms.uSpread = uniforms.spread;
        shader.uniforms.uTime = uniforms.time;
        shader.uniforms.uShock = uniforms.shock;
        shader.uniforms.uShockOrigin = uniforms.shockOrigin;
        shader.vertexShader =
          "attribute float aRand;\nuniform float uSpread;\nuniform float uTime;\nuniform float uShock;\nuniform vec3 uShockOrigin;\n" +
          shader.vertexShader.replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
            // spread morph: outward explode (+) / implosion (−), per-particle phase
            transformed += normalize(position) * uSpread
              * (0.4 + aRand * 1.2)
              * (0.82 + 0.18 * sin(uTime * (0.4 + aRand * 0.6) + aRand * 43.0));
            // click shockwave: expanding ring displaces + swells particles
            vec3 shockDir = position - uShockOrigin;
            float shockLen = max(length(shockDir), 0.001);
            shockDir /= shockLen;
            float shockRing = 1.0 - smoothstep(0.0, 0.5, abs(shockLen - uShock * 7.0));
            transformed += shockDir * shockRing * 0.28 * (0.5 + aRand * 0.8);`,
          );
        if (isPoints) {
          // swell particles inside the shock band (PointsMaterial only)
          shader.vertexShader = shader.vertexShader.replace(
            "gl_PointSize = size;",
            "gl_PointSize = size * (1.0 + shockRing * 1.6);",
          );
        }
      };
    return { points: make(true), lines: make(false) };
  }, [uniforms]);

  const { shellGeo, innerGeo, linksGeo, dustGeo, dotTex, glowTex } = useMemo(() => {
    const rand = mulberry32(1337);
    const positions = fibonacciSphere(count, 1.35, rand);

    // Per-particle randoms: color mixing + shader morph phase
    const rands = new Float32Array(count);
    for (let i = 0; i < count; i++) rands[i] = rand();

    const innerCount = Math.floor(count / 5);
    const innerPositions = fibonacciSphere(innerCount, 0.72, rand);
    const innerRands = new Float32Array(innerCount);
    for (let i = 0; i < innerCount; i++) innerRands[i] = rand();

    const links = buildLinks(positions, rands);

    // Far-away dust shell for parallax depth
    const dustCount = isMobile ? 300 : 700;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = 5 + rand() * 4;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      dustPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dustPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dustPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));

    const shellGeo = new THREE.BufferGeometry();
    shellGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    shellGeo.setAttribute("color", new THREE.BufferAttribute(sphereColors(count, rands), 3));
    shellGeo.setAttribute("aRand", new THREE.BufferAttribute(rands, 1));

    const innerGeo = new THREE.BufferGeometry();
    innerGeo.setAttribute("position", new THREE.BufferAttribute(innerPositions, 3));
    innerGeo.setAttribute("color", new THREE.BufferAttribute(sphereColors(innerCount, innerRands), 3));
    innerGeo.setAttribute("aRand", new THREE.BufferAttribute(innerRands, 1));

    const dotTex = makeRadialTexture(64, [
      [0, "rgba(255,255,255,1)"],
      [0.35, "rgba(255,255,255,0.55)"],
      [1, "rgba(255,255,255,0)"],
    ]);
    const glowTex = makeRadialTexture(256, [
      [0, "rgba(140, 210, 255, 0.9)"],
      [0.25, "rgba(90, 140, 255, 0.35)"],
      [0.6, "rgba(120, 80, 255, 0.12)"],
      [1, "rgba(0,0,0,0)"],
    ]);

    return { shellGeo, innerGeo, linksGeo: links, dustGeo, dotTex, glowTex };
  }, [count, isMobile]);

  // ── Scroll choreography ────────────────────────────────────
  const keyframes = useMemo<CoreState[]>(
    () => [
      // Hero — core right of the headline, calm
      { x: isDesktop ? 1.15 : 0, y: 0, scale: 1, spread: 0, camZ: 4.6, rotSpeed: 0.06 },
      // Skills — drifts left + recedes behind the glass panels
      { x: isDesktop ? -1.25 : 0, y: 0.35, scale: 0.8, spread: 0.14, camZ: 6.0, rotSpeed: 0.11 },
      // Projects — explodes into a wide nebula
      { x: isDesktop ? 1.25 : 0, y: -0.25, scale: 1.02, spread: 0.55, camZ: 5.2, rotSpeed: 0.15 },
      // Contact — recondenses tight & bright at center: the finale
      { x: 0, y: 0, scale: 1.18, spread: -0.22, camZ: 4.1, rotSpeed: 0.035 },
    ],
    [isDesktop],
  );

  const cur = useRef<CoreState>({ ...keyframes[0] });
  const tops = useRef<number[]>([0, 1, 2, 3]);

  useEffect(() => {
    const measure = () => {
      tops.current = SECTION_IDS.map(
        (id) => document.getElementById(id)?.offsetTop ?? 0,
      );
    };
    measure();
    // Section offsets shift as content/images load → re-measure
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    // Signal the intro veil that the scene is live
    useUI.getState().setSceneReady(true);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Consume click → unproject NDC to the plane through the core (z = 0)
    if (clickRequest.pending && spinner.current) {
      clickRequest.pending = false;
      const v = new THREE.Vector3(clickRequest.ndcX, clickRequest.ndcY, 0.5).unproject(state.camera);
      const dir = v.sub(state.camera.position).normalize();
      const tPlane = -state.camera.position.z / dir.z;
      if (Number.isFinite(tPlane)) {
        const world = state.camera.position.clone().addScaledVector(dir, tPlane);
        uniforms.shockOrigin.value.copy(spinner.current.worldToLocal(world));
        uniforms.shock.value = 0;
      }
    }
    // Advance the wavefront; park it far away when done
    if (uniforms.shock.value >= 0) {
      uniforms.shock.value += delta / 1.2;
      if (uniforms.shock.value > 1.6) uniforms.shock.value = -1;
    }

    // Viewport center → which two keyframes are we between?
    // Article pages skip the scroll choreography entirely and hold a
    // calm "reading pose" — small, dimmed, off to the left of the text.
    const c = cur.current;
    if (variant === "article") {
      const pose = { x: isDesktop ? -1.5 : 0, y: 0.1, scale: 0.62, spread: 0.26, camZ: 7.2, rotSpeed: 0.04 };
      c.x = THREE.MathUtils.damp(c.x, pose.x, 2, delta);
      c.y = THREE.MathUtils.damp(c.y, pose.y, 2, delta);
      c.scale = THREE.MathUtils.damp(c.scale, pose.scale, 2, delta);
      c.spread = THREE.MathUtils.damp(c.spread, pose.spread, 2, delta);
      c.camZ = THREE.MathUtils.damp(c.camZ, pose.camZ, 2, delta);
      c.rotSpeed = THREE.MathUtils.damp(c.rotSpeed, pose.rotSpeed, 2, delta);
    } else {
      const center = window.scrollY + window.innerHeight * 0.5;
      const t0 = tops.current;
      let i = 0;
      while (i < t0.length - 2 && center >= t0[i + 1]) i++;
      const span = Math.max(1, t0[i + 1] - t0[i]);
      // Hold each pose near its section, transition between them
      const blend = THREE.MathUtils.smoothstep(
        THREE.MathUtils.clamp((center - t0[i]) / span, 0, 1),
        0.3,
        0.7,
      );
      const a = keyframes[i];
      const b = keyframes[Math.min(i + 1, keyframes.length - 1)];

      // Damp every property toward the blended target — never snap
      const lerp = THREE.MathUtils.lerp;
      c.x = THREE.MathUtils.damp(c.x, lerp(a.x, b.x, blend), 3, delta);
      c.y = THREE.MathUtils.damp(c.y, lerp(a.y, b.y, blend), 3, delta);
      c.scale = THREE.MathUtils.damp(c.scale, lerp(a.scale, b.scale, blend), 3, delta);
      c.spread = THREE.MathUtils.damp(c.spread, lerp(a.spread, b.spread, blend), 2, delta);
      c.camZ = THREE.MathUtils.damp(c.camZ, lerp(a.camZ, b.camZ, blend), 2.5, delta);
      c.rotSpeed = THREE.MathUtils.damp(c.rotSpeed, lerp(a.rotSpeed, b.rotSpeed, blend), 3, delta);
    }

    // Apply pose
    if (outer.current) {
      outer.current.position.x = c.x;
      outer.current.position.y = c.y;
      outer.current.scale.setScalar(c.scale);
      // Pointer "chase" on top of the pose — the signature buttery feel
      outer.current.rotation.x = THREE.MathUtils.damp(outer.current.rotation.x, pointer.y * 0.3, 2.5, delta);
      outer.current.rotation.y = THREE.MathUtils.damp(outer.current.rotation.y, pointer.x * 0.45, 2.5, delta);
    }
    if (spinner.current) {
      spinner.current.rotation.y += delta * c.rotSpeed;
      spinner.current.scale.setScalar(1 + Math.sin(t * 0.7) * 0.035);
    }
    if (dust.current) dust.current.rotation.y -= delta * 0.01;
    state.camera.position.z = c.camZ;

    // Shader uniforms
    uniforms.spread.value = c.spread;
    uniforms.time.value = t;

    // Pulse particle size + core glow — "alive, thinking"
    // (dimmed further on article pages so text stays readable)
    if (matRef.current) matRef.current.size = 0.05 * (1 + Math.sin(t * 1.7) * 0.18);
    if (glowRef.current) {
      const base = variant === "article" ? 0.16 : 0.32;
      glowRef.current.opacity = base + Math.sin(t * 1.2) * 0.06;
    }
  });

  return (
    <group ref={outer}>
      <group ref={spinner}>
        {/* Outer neural shell */}
        <points geometry={shellGeo} frustumCulled={false}>
          <pointsMaterial
            ref={matRef}
            size={0.05}
            map={dotTex}
            vertexColors
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
            onBeforeCompile={inject.points}
          />
        </points>

        {/* Synapse links */}
        <lineSegments geometry={linksGeo} frustumCulled={false}>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.16}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            onBeforeCompile={inject.lines}
          />
        </lineSegments>

        {/* Inner denser core */}
        <points geometry={innerGeo} frustumCulled={false}>
          <pointsMaterial
            size={0.04}
            map={dotTex}
            vertexColors
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
            onBeforeCompile={inject.points}
          />
        </points>

        {/* Fake-bloom center glow */}
        <sprite scale={[3.4, 3.4, 1]}>
          <spriteMaterial
            ref={glowRef}
            map={glowTex}
            transparent
            opacity={0.32}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      </group>

      {/* Background dust (counter-rotating, outside the breathing group) */}
      <points ref={dust} geometry={dustGeo} frustumCulled={false}>
        <pointsMaterial
          size={0.02}
          map={dotTex}
          color="#5f7fb0"
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
