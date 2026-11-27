import { applyMatrix, clamp, lerp, multiply, rotate, scaleY, translate, type Matrix } from '../../utils/geometry';
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

/**
 * Nyomó mozgás a törzsrendszerben, a fekvenyomás-modell `incline` paraméterével: az alkar a
 * támasz (rúd vagy talaj) felé mutató irányban áll, amely a törzshöz képest `incline` fokkal a fej
 * felé dől. 0° = az alkar merőleges a törzsre.
 */
export function pressLocalTilted(depth: number, incline: number) {
  const s = FIGURE.shoulderLocal;
  const i = rad(incline);
  const u = { x: -Math.sin(i), y: -Math.cos(i) };
  const top = { x: s.x + FIGURE.topReach * u.x, y: s.y + FIGURE.topReach * u.y };
  // Ferde helyzetben a mellkasi érintési pont a fej felé, negatívban a láb felé tolódik (mint a fekvenyomásnál).
  const chestX = FIGURE.chestTouchLocal.x - (clamp(incline, -15, 60) / 60) * 33;
  const bottom = { x: chestX + 10 * u.x, y: FIGURE.chestTouchLocal.y + 10 * u.y };
  const hand = { x: lerp(top.x, bottom.x, depth), y: lerp(top.y, bottom.y, depth) };
  const elbow = { x: hand.x - FIGURE.forearmLength * u.x, y: hand.y - FIGURE.forearmLength * u.y };
  const dx = elbow.x - s.x;
  const dy = elbow.y - s.y;
  return { hand, elbow, top, bottom, angle: deg(Math.atan2(-dx, dy)), scale: Math.max(0.25, Math.hypot(dx, dy) / FIGURE.humerusLength) };
}

/** Nyomó mozgás a törzsrendszerben (a fekvenyomás-modell, 0° dőlésnél). */
export const pressLocal = (depth: number) => pressLocalTilted(depth, 0);

const humerusFrom = (torso: Matrix, angle: number, scale: number) =>
  multiply(torso, multiply(translate(FIGURE.shoulderLocal.x, FIGURE.shoulderLocal.y), multiply(rotate(angle), scaleY(scale))));

/** Ülő gépes mellnyomás: a törzs függőleges (arccal jobbra), a csípő rögzített. */
export const MACHINE = { hip: { x: 250, y: 420 }, torsoAngle: 90 };

/** Fekvőtámasz: a kéz rögzített pontja a talajon, a lábujj és a térd talajjal érintkező pontja a törzsrendszerben. */
export const PUSH_UP = { hand: { x: 520, y: 420 }, toeLocal: { x: 322, y: -44 }, kneeLocal: { x: 160, y: -42 } };

/** Átváltás: a modell képpontjai és a valós centiméter (a felkar kb. 31 cm ≈ 118 képpont). */
export const PX_PER_CM = 3.8;

/** Fekvőtámasz-változat: a kéz és a láb alátámasztásának magassága (cm), térdelő változat. */
export interface PushUpOptions {
  handCm: number;
  feetCm: number;
  knees: boolean;
}
export const DEFAULT_PUSH_UP: PushUpOptions = { handCm: 0, feetCm: 0, knees: false };

/** Tolódzkodás: a fogás helye (korlát, gyűrű, pad). */
export const DIPS = { grip: { x: 330, y: 300 }, shoulderAngle: [6, 78] as [number, number], lean: [10, 30] as [number, number] };

export type DipVariant = 'bar' | 'ring' | 'bench';

/** Tolódzkodás-változat: eszköz és a törzs előredőlése az alsó helyzetben (fok). */
export interface DipOptions {
  variant: DipVariant;
  lean: number;
}

/**
 * Változatonkénti modellparaméterek. A felkar függőlegestől mért szöge (alsó helyzet) és az
 * alapértelmezett törzsdőlés a mért sorrendet követi (McKenzie és mtsai 2022: a vállfeszítés
 * padon > korláton > gyűrűn, a törzs előredőlése padon a legkisebb); az értékek szemléltetők,
 * nem mértek.
 */
export const DIP_VARIANTS: Record<DipVariant, { shoulderAngle: [number, number]; defaultLean: number }> = {
  bench: { shoulderAngle: [4, 96], defaultLean: 4 },
  bar: { shoulderAngle: [6, 78], defaultLean: 30 },
  ring: { shoulderAngle: [6, 66], defaultLean: 34 }
};

export const DEFAULT_DIPS: DipOptions = { variant: 'bar', lean: 30 };

/** Padon végzett tolódzkodás: a pad magassága (cm) – a kéz a pad szélén, a láb a talajon, elöl. */
export const BENCH_DIP_HEIGHT_CM = 45;

/**
 * A vállízület feszítése a törzshöz képest (fok): a felkar függőlegestől hátrafelé mért szöge
 * mínusz a törzs előredőlése. Minél jobban dől előre a törzs, annál kisebb a vállfeszítés.
 */
export const dipShoulderExtension = (o: DipOptions, depth = 1) => {
  const v = DIP_VARIANTS[o.variant];
  return lerp(v.shoulderAngle[0], v.shoulderAngle[1], depth) - leanAt(o, depth);
};
const leanAt = (o: DipOptions, depth: number) => lerp(o.lean * 0.35, o.lean, depth);

export function solveSagittal(preset: SagittalPreset, depth: number, pushUp: PushUpOptions = DEFAULT_PUSH_UP, dips: DipOptions = DEFAULT_DIPS): SagittalSolution {
  if (preset === 'dips') return solveDips(depth, dips);
  if (preset === 'push-up') return solvePushUp(depth, pushUp);
  const loc = pressLocal(depth);
  const torso = multiply(translate(MACHINE.hip.x, MACHINE.hip.y), rotate(MACHINE.torsoAngle));
  const transforms = { world: [1, 0, 0, 1, 0, 0] as Matrix, torso, humerus: humerusFrom(torso, loc.angle, loc.scale) };
  const s = applyMatrix(torso, FIGURE.shoulderLocal.x, FIGURE.shoulderLocal.y);
  const path: [Point, Point] = [applyMatrix(torso, loc.top.x, loc.top.y), applyMatrix(torso, loc.bottom.x, loc.bottom.y)];
  return {
    transforms,
    shoulder: s,
    elbow: applyMatrix(torso, loc.elbow.x, loc.elbow.y),
    hand: applyMatrix(torso, loc.hand.x, loc.hand.y),
    hip: applyMatrix(torso, 0, 0),
    path
  };
}

export interface PushUpSolution extends SagittalSolution {
  /** A test dőlése a vízszinteshez képest (fok; pozitív = a fej feljebb van). */
  tilt: number;
  /** A talajjal / dobozzal érintkező pont: lábujj vagy térd. */
  contact: Point;
  /** A kéz és a láb alátámasztásának felső síkja (világ-y). */
  handTop: number;
  feetTop: number;
}

/**
 * Fekvőtámasz – zárt lánc. A kéz és a lábujj (térdelő változatnál a térd) rögzített pontokon van;
 * a test e két pont között billen. Az alkar a talajra merőleges (függőleges), ezért a kéz helye a
 * törzshöz képest a test dőlésétől függ – ezt néhány lépéses iterációval oldjuk meg (a dőlés a kéz
 * helyétől, a kéz helye a dőléstől függ).
 */
export function solvePushUp(depth: number, opt: PushUpOptions = DEFAULT_PUSH_UP, withPath = true): PushUpSolution {
  const contactLocal = opt.knees ? PUSH_UP.kneeLocal : PUSH_UP.toeLocal;
  const handTop = PUSH_UP.hand.y - opt.handCm * PX_PER_CM;
  const feetTop = PUSH_UP.hand.y - (opt.knees ? 0 : opt.feetCm) * PX_PER_CM;
  // A kontaktpont és a kéz magasságkülönbsége a világban (y lefelé nő).
  const delta = feetTop - handTop;
  let tilt = 0;
  let theta = Math.PI;
  let loc = pressLocalTilted(depth, 0);
  for (let k = 0; k < 8; k++) {
    loc = pressLocalTilted(depth, -tilt);
    const v = { x: contactLocal.x - loc.hand.x, y: contactLocal.y - loc.hand.y };
    // A forgatás után a kéz → kontaktpont vektor függőleges összetevője = delta:  vx·sinθ + vy·cosθ = delta.
    const len = Math.hypot(v.x, v.y);
    const base = Math.asin(clamp(delta / len, -1, 1));
    const p0 = Math.atan2(v.y, v.x);
    const c1 = base - p0;
    const c2 = Math.PI - base - p0;
    // Hason fekvő helyzet: a test elülső oldala lefelé néz (cos θ < 0).
    theta = Math.cos(c1) < 0 ? c1 : c2;
    tilt = 180 - deg(theta);
    tilt = ((((tilt + 180) % 360) + 360) % 360) - 180;
  }
  const r = rotate(deg(theta));
  const h = applyMatrix(r, loc.hand.x, loc.hand.y);
  const torso = multiply(translate(PUSH_UP.hand.x - h.x, handTop - h.y), r);
  const shoulder = applyMatrix(torso, FIGURE.shoulderLocal.x, FIGURE.shoulderLocal.y);
  return {
    transforms: { world: [1, 0, 0, 1, 0, 0], torso, humerus: humerusFrom(torso, loc.angle, loc.scale) },
    shoulder,
    elbow: applyMatrix(torso, loc.elbow.x, loc.elbow.y),
    hand: applyMatrix(torso, loc.hand.x, loc.hand.y),
    hip: applyMatrix(torso, 0, 0),
    path: withPath ? [solvePushUp(0, opt, false).shoulder, solvePushUp(1, opt, false).shoulder] : [shoulder, shoulder],
    tilt,
    contact: applyMatrix(torso, contactLocal.x, contactLocal.y),
    handTop,
    feetTop
  };
}

/** A fekvőtámasz-ábra kiterjedése a teljes ismétlés alatt (a kivágáshoz). */
export function pushUpExtents(opt: PushUpOptions) {
  const pts = [0, 1].flatMap((d) => {
    const s = solvePushUp(d, opt, false);
    const t = s.transforms.torso!;
    return [applyMatrix(t, -270, -30), applyMatrix(t, -246, 18), applyMatrix(t, PUSH_UP.toeLocal.x + 20, 0), s.contact, s.hand, s.shoulder];
  });
  return { minX: Math.min(...pts.map((p) => p.x)), maxX: Math.max(...pts.map((p) => p.x)), minY: Math.min(...pts.map((p) => p.y)) };
}

export function solveDips(depth: number, opt: DipOptions = DEFAULT_DIPS): SagittalSolution {
  const g = DIPS.grip;
  const range = DIP_VARIANTS[opt.variant].shoulderAngle;
  const elbow = { x: g.x, y: g.y - FIGURE.forearmLength };
  const shoulderAt = (d: number) => {
    const phi = rad(lerp(range[0], range[1], d));
    return { x: elbow.x + FIGURE.humerusLength * Math.sin(phi), y: elbow.y - FIGURE.humerusLength * Math.cos(phi) };
  };
  const shoulder = shoulderAt(depth);
  const r = rotate(90 + leanAt(opt, depth));
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
