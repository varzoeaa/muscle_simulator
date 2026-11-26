import type { FramedPoint, MuscleShapeGeometry, Pose, ViewGeometry } from '../../types';
import { anteriorView } from './anteriorView';

/**
 * Az elülső nézet két mozgásspecifikus változata a „fordított” (zárt láncú) működéshez,
 * amikor a felkar rögzített, és az izom a mellkast mozgatja a kar felé.
 * A geometria azonos az elülső nézetével; csak a frame-ek és a rögzített elemek térnek el.
 */

/* ------------------------------------------------------------------ */
/* 1. Zárt lánc: húzódzkodás – a kéz a rúdon rögzített, a törzs mozog. */
/* ------------------------------------------------------------------ */

const GH = { x: 150, y: 140 };
const UPPER_ARM = 216;
/** A könyöktől a fogásig mért távolság az alkar rendszerében. */
const FOREARM = 200;
/** A fogás helye a rögzített (rúd) rendszerben. */
export const GRIP = { x: 42, y: -258 };
/** A törzs legnagyobb függőleges elmozdulása (a nézet egységeiben, felfelé negatív). */
export const MAX_LIFT = 330;

const deg = (rad: number) => (rad * 180) / Math.PI;
const normalize = (a: number) => ((((a + 180) % 360) + 360) % 360) - 180;

/**
 * Két szegmensű inverz kinematika: a fogás rögzített, a vállízület a törzzsel együtt
 * emelkedik (`lift` 0 → 1). Visszaadja a felkar távolítási szögét, a könyök szögét és
 * a törzs eltolását. A könyök mindig laterálisan helyezkedik el.
 */
export function solveClosedChain(pose: Pose): Pose {
  const lift = Math.min(1, Math.max(0, pose.lift ?? 0));
  const trunkY = -lift * MAX_LIFT;
  const S = { x: GH.x, y: GH.y + trunkY };
  const D = { x: GRIP.x - S.x, y: GRIP.y - S.y };
  const d = Math.min(UPPER_ARM + FOREARM - 0.001, Math.hypot(D.x, D.y));
  const ux = D.x / d;
  const uy = D.y / d;
  const a = (UPPER_ARM ** 2 - FOREARM ** 2 + d ** 2) / (2 * d);
  const h = Math.sqrt(Math.max(0, UPPER_ARM ** 2 - a ** 2));
  const base = { x: S.x + a * ux, y: S.y + a * uy };
  const c1 = { x: base.x - h * uy, y: base.y + h * ux };
  const c2 = { x: base.x + h * uy, y: base.y - h * ux };
  const E = c1.x < c2.x ? c1 : c2;
  // A frame-ek konvenciója: 0° = lefelé (+y), pozitív szög = laterálisan (−x) fordul.
  const theta = deg(Math.atan2(-(E.x - S.x), E.y - S.y));
  const psi = deg(Math.atan2(-(GRIP.x - E.x), GRIP.y - E.y));
  return { ...pose, shoulderAbduction: theta, elbowAngle: normalize(psi - theta), trunkY };
}

export const anteriorClosedChainView: ViewGeometry = {
  ...anteriorView,
  viewId: 'anterior-closed-chain',
  viewBox: [-120, -320, 840, 680],
  focusViewBox: undefined,
  frames: [
    { id: 'humerus', parent: 'world', pivot: GH, angleKey: 'shoulderAbduction' },
    { id: 'forearm', parent: 'humerus', pivot: { x: 0, y: UPPER_ARM }, angleKey: 'elbowAngle' }
  ],
  sceneOffsetYKey: 'trunkY',
  fixtures: [{ d: `M-60,${GRIP.y} L660,${GRIP.y}`, label: { x: 300, y: GRIP.y - 14, text: 'Rögzített rúd (a kéz nem mozdul)' } }]
};

/* ------------------------------------------------------------------ */
/* 2. Járulékos belégzés – a felkar rögzített, a mellkas emelkedik.    */
/* ------------------------------------------------------------------ */

const THORAX_BONES = new Set(['bone-ribs', 'bone-costal-cartilages', 'bone-sternum']);
/** Azok az izmok, amelyeknek a világrendszerbeli (mellkasi) pontjai a bordákkal együtt mozognak. */
const THORAX_MUSCLES: Record<string, (p: FramedPoint) => boolean> = {
  'muscle-pectoralis-major-sternocostal': () => true,
  'muscle-pectoralis-major-abdominal': () => true,
  'muscle-external-oblique': () => true,
  // A kis mellizom bordai eredése mozog, a hollócsőrnyúlványi tapadása nem.
  'muscle-pectoralis-minor': (p) => p.x > 230
};

const toThorax = (p: FramedPoint, when: (p: FramedPoint) => boolean = () => true): FramedPoint =>
  p.frame === 'world' && when(p) ? { ...p, frame: 'thorax' } : p;

const remapMuscle = (m: MuscleShapeGeometry): MuscleShapeGeometry => {
  const rule = THORAX_MUSCLES[m.structureId];
  if (!rule) return m;
  return {
    ...m,
    outline: m.outline.map((p) => toThorax(p, rule)),
    fibers: m.fibers.map(([a, b]) => [toThorax(a, rule), toThorax(b, rule)] as [FramedPoint, FramedPoint]),
    label: m.label ? { ...m.label, at: toThorax(m.label.at, rule) } : undefined
  };
};

export const anteriorRespirationView: ViewGeometry = {
  ...anteriorView,
  viewId: 'anterior-respiration',
  focusViewBox: undefined,
  frames: [
    ...anteriorView.frames,
    // A mellkas (bordák, bordaporcok, szegycsont) a világrendszerhez képest emelkedik.
    { id: 'thorax', parent: 'world', pivot: { x: 0, y: 0 }, translateYKey: 'ribLift' }
  ],
  bones: anteriorView.bones.map((b) => (THORAX_BONES.has(b.structureId) && b.frame === 'world' ? { ...b, frame: 'thorax' } : b)),
  muscles: anteriorView.muscles.map(remapMuscle),
  attachments: anteriorView.attachments.map((a) =>
    a.type === 'origin' && a.structureId !== 'muscle-pectoralis-major-clavicular' ? { ...a, points: a.points.map((p) => toThorax(p)) } : a
  )
};
