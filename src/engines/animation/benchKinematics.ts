import type { Pose } from '../../types';
import { applyMatrix, computeFrameTransforms, lerp } from '../../utils/geometry';
import type { FrameDefinition } from '../../types';

/**
 * Fekvenyomás – egyszerűsített 2D szagittális kinematika.
 * Modellfeltevések (lásd MODEL_LIMITATIONS.md):
 *  - a rúd függőleges pályán mozog a vállízület fölötti felső helyzet és a mellkas alsó része között,
 *  - az alkar mindvégig függőleges (gyakori technikai elv),
 *  - a felkar szagittális vetülete a könyök és a váll közötti távolságból adódik;
 *    a rövidülés a felkar oldalsó (síkból kifelé mutató) helyzetének vetületi következménye.
 */

export const BENCH = {
  hip: { x: 430, y: 330 },
  /** Váll forgáspontja a törzs koordináta-rendszerében (origó: csípő, -x: fej felé, -y: elülső oldal). */
  shoulderLocal: { x: -190, y: -14 },
  /** A rúd mellkasi érintési pontja (a szegycsont alsó részének magassága) a törzs rendszerében. */
  chestTouchLocal: { x: -152, y: -62 },
  forearmLength: 104,
  humerusLength: 118,
  topReach: 205
};

export const benchFrames: FrameDefinition[] = [
  { id: 'torso', parent: 'world', pivot: BENCH.hip, angleKey: 'incline' },
  { id: 'humerus', parent: 'torso', pivot: BENCH.shoulderLocal, angleKey: 'shoulderRel', scaleYKey: 'humerusScale' }
];

export interface BenchSolution {
  pose: Pose;
  shoulder: { x: number; y: number };
  elbow: { x: number; y: number };
  bar: { x: number; y: number };
  top: { x: number; y: number };
  bottom: { x: number; y: number };
}

/**
 * @param incline paddőlésszög fokban (negatív = negatív pad)
 * @param depth 0..1 – a rúd helyzete a felső és az alsó végpont között (ROM már alkalmazva)
 */
export function solveBench(incline: number, depth: number): BenchSolution {
  const torso = computeFrameTransforms(benchFrames.slice(0, 1), { incline }).torso!;
  const shoulder = applyMatrix(torso, BENCH.shoulderLocal.x, BENCH.shoulderLocal.y);
  // Ferde padon a rúd a mellkas felső, negatív padon az alsó részéhez érkezik.
  const chestX = BENCH.chestTouchLocal.x - (Math.max(-15, Math.min(60, incline)) / 60) * 33;
  const chest = applyMatrix(torso, chestX, BENCH.chestTouchLocal.y);
  const top = { x: shoulder.x, y: shoulder.y - BENCH.topReach };
  const bottom = { x: chest.x, y: chest.y - 10 };
  const bar = { x: lerp(top.x, bottom.x, depth), y: lerp(top.y, bottom.y, depth) };
  // Függőleges alkar: a könyök a fogás alatt van.
  const elbow = { x: bar.x, y: bar.y + BENCH.forearmLength };
  const dx = elbow.x - shoulder.x;
  const dy = elbow.y - shoulder.y;
  const projected = Math.hypot(dx, dy);
  // Világ-szög (a +y tengelytől mérve, SVG forgatási konvencióval), majd a törzshöz viszonyítva.
  const worldAngle = (Math.atan2(-dx, dy) * 180) / Math.PI;
  const pose: Pose = {
    incline,
    shoulderRel: worldAngle - incline,
    humerusScale: Math.max(0.25, projected / BENCH.humerusLength)
  };
  return { pose, shoulder, elbow, bar, top, bottom };
}

/** Tárcsák oldalanként (mohó algoritmus a szabványos súlytárcsákkal). */
export const PLATE_SIZES = [25, 20, 15, 10, 5, 2.5, 1.25];
export function platesPerSide(totalKg: number, barKg: number): number[] {
  let remaining = Math.max(0, (totalKg - barKg) / 2);
  const out: number[] = [];
  for (const p of PLATE_SIZES) {
    while (remaining + 1e-9 >= p) {
      out.push(p);
      remaining -= p;
    }
  }
  return out;
}
