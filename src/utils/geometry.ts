import type { FrameDefinition, FramedPoint, Pose } from '../types';

/** 2D affin mátrix: [a, b, c, d, e, f] – az SVG matrix() sorrendjében. */
export type Matrix = [number, number, number, number, number, number];

export const IDENTITY: Matrix = [1, 0, 0, 1, 0, 0];

export const multiply = (m: Matrix, n: Matrix): Matrix => [
  m[0] * n[0] + m[2] * n[1],
  m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4],
  m[1] * n[4] + m[3] * n[5] + m[5]
];

export const translate = (x: number, y: number): Matrix => [1, 0, 0, 1, x, y];
export const rotate = (deg: number): Matrix => {
  const r = (deg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [c, s, -s, c, 0, 0];
};
export const scaleY = (sy: number): Matrix => [1, 0, 0, sy, 0, 0];

export const applyMatrix = (m: Matrix, x: number, y: number): { x: number; y: number } => ({
  x: m[0] * x + m[2] * y + m[4],
  y: m[1] * x + m[3] * y + m[5]
});

export const matrixToSvg = (m: Matrix): string => `matrix(${m.map((v) => +v.toFixed(4)).join(' ')})`;

/**
 * Kiszámítja minden frame világ-transzformációját az adott pózból.
 * A frame-ek sorrendje tetszőleges; a szülőket rekurzívan oldjuk fel.
 */
export function computeFrameTransforms(frames: FrameDefinition[], pose: Pose): Record<string, Matrix> {
  const out: Record<string, Matrix> = { world: IDENTITY };
  const byId = new Map(frames.map((f) => [f.id, f]));
  const resolve = (id: string, depth = 0): Matrix => {
    const cached = out[id];
    if (cached) return cached;
    const f = byId.get(id);
    if (!f || depth > 20) return IDENTITY;
    const parent = resolve(f.parent, depth + 1);
    const angle = (f.baseAngle ?? 0) + (f.angleKey ? (pose[f.angleKey] ?? 0) * (f.angleScale ?? 1) : 0);
    const ty = f.translateYKey ? (pose[f.translateYKey] ?? 0) : 0;
    let m = multiply(parent, multiply(translate(f.pivot.x, f.pivot.y + ty), rotate(angle)));
    if (f.scaleYKey) m = multiply(m, scaleY(pose[f.scaleYKey] ?? 1));
    if (f.localOrigin) m = multiply(m, translate(-f.localOrigin.x, -f.localOrigin.y));
    out[id] = m;
    return m;
  };
  frames.forEach((f) => resolve(f.id));
  return out;
}

export const toWorld = (p: FramedPoint, transforms: Record<string, Matrix>) =>
  applyMatrix(transforms[p.frame] ?? IDENTITY, p.x, p.y);

/** Zárt, simított görbe (Catmull–Rom → köbös Bézier) a megadott pontokon keresztül. */
export function smoothClosedPath(points: { x: number; y: number }[], tension = 0.5): string {
  const n = points.length;
  if (n < 3) return '';
  const p = (i: number) => points[(i + n) % n]!;
  const k = tension / 3;
  let d = `M${p(0).x.toFixed(1)},${p(0).y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = p(i - 1);
    const p1 = p(i);
    const p2 = p(i + 1);
    const p3 = p(i + 2);
    const c1x = p1.x + (p2.x - p0.x) * k;
    const c1y = p1.y + (p2.y - p0.y) * k;
    const c2x = p2.x - (p3.x - p1.x) * k;
    const c2y = p2.y - (p3.y - p1.y) * k;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d + ' Z';
}

/** Nyitott, simított görbe. */
export function smoothOpenPath(points: { x: number; y: number }[], tension = 0.5): string {
  const n = points.length;
  if (n === 0) return '';
  if (n === 1) return `M${points[0]!.x},${points[0]!.y}`;
  const p = (i: number) => points[Math.max(0, Math.min(n - 1, i))]!;
  const k = tension / 3;
  let d = `M${p(0).x.toFixed(1)},${p(0).y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = p(i - 1);
    const p1 = p(i);
    const p2 = p(i + 1);
    const p3 = p(i + 2);
    d += ` C${(p1.x + (p2.x - p0.x) * k).toFixed(1)},${(p1.y + (p2.y - p0.y) * k).toFixed(1)} ${(p2.x - (p3.x - p1.x) * k).toFixed(1)},${(p2.y - (p3.y - p1.y) * k).toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export const lerpPose = (a: Pose, b: Pose, t: number): Pose => {
  const out: Pose = {};
  new Set([...Object.keys(a), ...Object.keys(b)]).forEach((k) => {
    out[k] = lerp(a[k] ?? 0, b[k] ?? 0, t);
  });
  return out;
};

/** Mintavételezés egy töröttvonal mentén egyenletes paraméterrel (pontszámban). */
export function samplePolyline(points: FramedPoint[], n: number): FramedPoint[] {
  if (points.length === 0) return [];
  if (points.length === 1 || n <= 1) return [points[0]!];
  const out: FramedPoint[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * (points.length - 1);
    const idx = Math.min(points.length - 2, Math.floor(t));
    const f = t - idx;
    const a = points[idx]!;
    const b = points[idx + 1]!;
    // Csak azonos frame-ben interpolálunk; eltérő frame esetén a közelebbi pontot vesszük.
    out.push(a.frame === b.frame ? { frame: a.frame, x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f) } : f < 0.5 ? a : b);
  }
  return out;
}

/** Rostirány-jelzések generálása eredési és tapadási vonalak között (legyezőszerű elrendezés). */
export function fan(origin: FramedPoint[], insertion: FramedPoint[], n: number): [FramedPoint, FramedPoint][] {
  const o = samplePolyline(origin, n);
  const i = samplePolyline(insertion, n);
  return o.map((p, k) => [p, i[k]!] as [FramedPoint, FramedPoint]);
}

/**
 * Egy abszolút parancsokból (M, L, C, Q, Z) álló SVG path tükrözése a függőleges
 * x = cx tengelyre. Hátulnézet rajzolásához: a test jobb oldala a néző jobb oldalára kerül.
 */
export function mirrorPathX(d: string, cx: number): string {
  const tokens = d.match(/[MLCQZ]|-?\d*\.?\d+/gi) ?? [];
  let n = 0;
  return tokens
    .map((t) => {
      if (/^[MLCQZ]$/i.test(t)) {
        n = 0;
        return t;
      }
      const v = Number(t);
      const out = n % 2 === 0 ? 2 * cx - v : v;
      n++;
      return String(+out.toFixed(2));
    })
    .join(' ');
}

/** Előjeles minimum-abszolútérték (pl. vetületi rövidülésnél ne essen pontosan nullára a skála). */
export const signedAtLeast = (v: number, min: number) => (Math.abs(v) < min ? (v < 0 ? -min : min) : v);
