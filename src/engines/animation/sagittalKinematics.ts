import { applyMatrix, lerp, multiply, rotate, scaleY, translate, type Matrix } from '../../utils/geometry';
import { BENCH } from './benchKinematics';

/** Közös testméretek a törzsrendszerben (a fekvenyomás-modellel azonosak). */
export const FIGURE = {
  shoulderLocal: BENCH.shoulderLocal,
  chestTouchLocal: BENCH.chestTouchLocal,
  forearmLength: BENCH.forearmLength,
  humerusLength: BENCH.humerusLength,
  topReach: BENCH.topReach
};

/**
 * Oldalnézeti (szagittális) gyakorlatok egyszerűsített kinematikája.
 *
 * Nyomó mozgások (gépes mellnyomás, fekvőtámasz): a fekvenyomás-modell a törzshöz rögzítve –
 * az alkar merőleges a törzsre, a kéz a vállízület előtti felső helyzet és a mellkas között mozog
 * egyenes pályán; a felkar szagittális vetülete a könyök és a váll távolságából adódik.
 *  - Gépes mellnyomás: a törzs függőleges (ülő helyzet), a kéz vízszintesen mozog.
 *  - Fekvőtámasz: zárt lánc – a kéz és a lábujj a talajon rögzített, a test e két pont körül billen.
 *
 * Tolódzkodás: zárt lánc – a kéz a korláton rögzített, az alkar függőleges, a felkar a
 * könyök körül fordul előre (vállízületi hátrafeszítés), a törzs a mélységgel jobban előredől.
 * Oktatási közelítések (lásd: MODEL_LIMITATIONS.md).
 */
export type SagittalPreset = 'machine-press' | 'push-up' | 'dips';

export interface Point {
  x: number;
  y: number;
}

export interface SagittalSolution {
  transforms: Record<string, Matrix>;
  shoulder: Point;
  elbow: Point;
  hand: Point;
  hip: Point;
  /** A szaggatott vonallal jelölt pálya két végpontja (kéz vagy váll). */
  path: [Point, Point];
}

const deg = (r: number) => (r * 180) / Math.PI;
const rad = (d: number) => (d * Math.PI) / 180;

/** Nyomó mozgás a törzsrendszerben (a fekvenyomás-modell, 0° dőlésnél). */
export function pressLocal(depth: number) {
  const s = FIGURE.shoulderLocal;
  const top = { x: s.x, y: s.y - FIGURE.topReach };
  const bottom = { x: FIGURE.chestTouchLocal.x, y: FIGURE.chestTouchLocal.y - 10 };
  const hand = { x: lerp(top.x, bottom.x, depth), y: lerp(top.y, bottom.y, depth) };
  const elbow = { x: hand.x, y: hand.y + FIGURE.forearmLength };
  const dx = elbow.x - s.x;
  const dy = elbow.y - s.y;
  return { hand, elbow, top, bottom, angle: deg(Math.atan2(-dx, dy)), scale: Math.max(0.25, Math.hypot(dx, dy) / FIGURE.humerusLength) };
}

const humerusFrom = (torso: Matrix, angle: number, scale: number) =>
  multiply(torso, multiply(translate(FIGURE.shoulderLocal.x, FIGURE.shoulderLocal.y), multiply(rotate(angle), scaleY(scale))));

/** Ülő gépes mellnyomás: a törzs függőleges (arccal jobbra), a csípő rögzített. */
export const MACHINE = { hip: { x: 250, y: 420 }, torsoAngle: 90 };

/** Fekvőtámasz: a kéz rögzített pontja a talajon, és a lábujj helye a törzsrendszerben. */
export const PUSH_UP = { hand: { x: 520, y: 420 }, toeLocal: { x: 322, y: -44 } };

/** Tolódzkodás: a fogás helye a korláton. */
export const DIPS = { grip: { x: 330, y: 300 }, shoulderAngle: [6, 78] as [number, number], lean: [10, 30] as [number, number] };

export function solveSagittal(preset: SagittalPreset, depth: number): SagittalSolution {
  if (preset === 'dips') return solveDips(depth);
  const loc = pressLocal(depth);
  let torso: Matrix;
  if (preset === 'machine-press') {
    torso = multiply(translate(MACHINE.hip.x, MACHINE.hip.y), rotate(MACHINE.torsoAngle));
  } else {
    // A lábujj és a kéz is a talajon van: a törzs szöge olyan, hogy a kettőt összekötő szakasz vízszintes.
    const v = { x: PUSH_UP.toeLocal.x - loc.hand.x, y: PUSH_UP.toeLocal.y - loc.hand.y };
    const theta = deg(Math.atan2(-v.y, v.x)) + 180;
    const r = rotate(theta);
    const h = applyMatrix(r, loc.hand.x, loc.hand.y);
    torso = multiply(translate(PUSH_UP.hand.x - h.x, PUSH_UP.hand.y - h.y), r);
  }
  const transforms = { world: [1, 0, 0, 1, 0, 0] as Matrix, torso, humerus: humerusFrom(torso, loc.angle, loc.scale) };
  const s = applyMatrix(torso, FIGURE.shoulderLocal.x, FIGURE.shoulderLocal.y);
  const path: [Point, Point] =
    preset === 'push-up'
      ? [solvePushUpShoulder(0), solvePushUpShoulder(1)]
      : [applyMatrix(torso, loc.top.x, loc.top.y), applyMatrix(torso, loc.bottom.x, loc.bottom.y)];
  return {
    transforms,
    shoulder: s,
    elbow: applyMatrix(torso, loc.elbow.x, loc.elbow.y),
    hand: applyMatrix(torso, loc.hand.x, loc.hand.y),
    hip: applyMatrix(torso, 0, 0),
    path
  };
}

function solvePushUpShoulder(depth: number): Point {
  const loc = pressLocal(depth);
  const v = { x: PUSH_UP.toeLocal.x - loc.hand.x, y: PUSH_UP.toeLocal.y - loc.hand.y };
  const r = rotate(deg(Math.atan2(-v.y, v.x)) + 180);
  const h = applyMatrix(r, loc.hand.x, loc.hand.y);
  const s = applyMatrix(r, FIGURE.shoulderLocal.x, FIGURE.shoulderLocal.y);
  return { x: PUSH_UP.hand.x - h.x + s.x, y: PUSH_UP.hand.y - h.y + s.y };
}

function solveDips(depth: number): SagittalSolution {
  const g = DIPS.grip;
  const elbow = { x: g.x, y: g.y - FIGURE.forearmLength };
  const shoulderAt = (d: number) => {
    const phi = rad(lerp(DIPS.shoulderAngle[0], DIPS.shoulderAngle[1], d));
    return { x: elbow.x + FIGURE.humerusLength * Math.sin(phi), y: elbow.y - FIGURE.humerusLength * Math.cos(phi) };
  };
  const shoulder = shoulderAt(depth);
  const r = rotate(90 + lerp(DIPS.lean[0], DIPS.lean[1], depth));
  const sl = applyMatrix(r, FIGURE.shoulderLocal.x, FIGURE.shoulderLocal.y);
  const torso = multiply(translate(shoulder.x - sl.x, shoulder.y - sl.y), r);
  const dx = elbow.x - shoulder.x;
  const dy = elbow.y - shoulder.y;
  const humerus = multiply(translate(shoulder.x, shoulder.y), multiply(rotate(deg(Math.atan2(-dx, dy))), scaleY(Math.hypot(dx, dy) / FIGURE.humerusLength)));
  return {
    transforms: { world: [1, 0, 0, 1, 0, 0], torso, humerus },
    shoulder,
    elbow,
    hand: g,
    hip: applyMatrix(torso, 0, 0),
    path: [shoulderAt(0), shoulderAt(1)]
  };
}
