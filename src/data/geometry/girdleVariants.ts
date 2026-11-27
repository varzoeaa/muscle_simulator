import type { AnatomicalViewId, FrameDefinition, FramedPoint, MuscleShapeGeometry, ViewGeometry } from '../../types';
import { anteriorView } from './anteriorView';
import { superiorView } from './superiorView';
import { lateralView } from './lateralView';

/**
 * Mozgó vállöv – a nézetek olyan változatai, amelyekben a kulcscsont és a lapocka saját frame-en
 * mozog (a kis mellizom lapockamozgatásaihoz). A geometria azonos az eredeti nézetekével; a
 * lapockához és a kulcscsonthoz kötött pontok világkoordinátái változatlanok, csak a frame-jük
 * változik (`localOrigin`: alaphelyzetben a helyi és a világkoordináták egybeesnek).
 *
 * Egyszerűsítések (lásd: MODEL_LIMITATIONS.md):
 *  - elölnézet: a kulcscsont a szegycsont-kulcscsonti ízület, a lapocka a vállcsúcs-kulcscsonti
 *    ízület körül fordul (emelés–süllyesztés, felfelé–lefelé rotáció);
 *  - felülnézet: a kulcscsont a szegycsont-kulcscsonti ízület körül előre–hátra fordul, a lapocka
 *    vele együtt mozog (protrakció–retrakció);
 *  - oldalnézet: a lapocka a felső részén átmenő harántirányú tengely körül billen (előre–hátra
 *    billenés); a kulcscsont nem mozdul.
 */

/** Melyik frame-re kerüljön egy világkoordinátás pont (undefined: marad a világban). */
type Rule = (p: FramedPoint) => string | undefined;

interface Reframe {
  viewId: AnatomicalViewId;
  base: ViewGeometry;
  frames: FrameDefinition[];
  bones: Record<string, string>;
  muscles: Record<string, Rule>;
  attachments: Record<string, Rule>;
  joints?: Record<string, string>;
}

const all =
  (frame: string): Rule =>
  () =>
    frame;

const move = (p: FramedPoint, rule?: Rule): FramedPoint => {
  if (!rule || p.frame !== 'world') return p;
  const f = rule(p);
  return f ? { ...p, frame: f } : p;
};

function reframe({ viewId, base, frames, bones, muscles, attachments, joints = {} }: Reframe): ViewGeometry {
  const muscle = (m: MuscleShapeGeometry): MuscleShapeGeometry => {
    const rule = muscles[m.structureId];
    if (!rule) return m;
    return {
      ...m,
      outline: m.outline.map((p) => move(p, rule)),
      fibers: m.fibers.map(([a, b]) => [move(a, rule), move(b, rule)] as [FramedPoint, FramedPoint]),
      label: m.label ? { ...m.label, at: move(m.label.at, rule) } : undefined
    };
  };
  return {
    ...base,
    viewId,
    focusViewBox: undefined,
    frames,
    bones: base.bones.map((b) => (bones[b.structureId] && b.frame === 'world' ? { ...b, frame: bones[b.structureId]! } : b)),
    muscles: base.muscles.map(muscle),
    attachments: base.attachments.map((a) => {
      const rule = attachments[`${a.structureId}:${a.type}`];
      return rule ? { ...a, points: a.points.map((p) => move(p, rule)) } : a;
    }),
    joints: base.joints.map((j) => (joints[j.structureId] ? { ...j, at: move(j.at, all(joints[j.structureId]!)) } : j))
  };
}

/* ------------------------------------------------------------------ */
/* Elölnézet: süllyesztés és lefelé rotáció                            */
/* ------------------------------------------------------------------ */

const A_SC = { x: 287, y: 116 };
const A_AC = { x: 166, y: 99 };
const A_GH = { x: 150, y: 140 };
const humerusA = anteriorView.frames.find((f) => f.id === 'humerus')!;
const forearmA = anteriorView.frames.find((f) => f.id === 'forearm')!;

export const anteriorGirdleView: ViewGeometry = reframe({
  viewId: 'anterior-girdle',
  base: anteriorView,
  frames: [
    // Pozitív `clavicleElevation`: a kulcscsont laterális vége felfelé mozdul (emelés); negatív: süllyesztés.
    { id: 'clavicle', parent: 'world', pivot: A_SC, localOrigin: A_SC, angleKey: 'clavicleElevation' },
    // Pozitív `scapularUpwardRotation`: az alsó szög laterálisan, az ízületi árok felfelé fordul.
    { id: 'scapula', parent: 'clavicle', pivot: A_AC, localOrigin: A_AC, angleKey: 'scapularUpwardRotation' },
    { ...humerusA, parent: 'scapula', pivot: A_GH },
    forearmA
  ],
  bones: { 'bone-clavicle': 'clavicle', 'bone-scapula': 'scapula' },
  muscles: {
    // A kis mellizom hollócsőrnyúlványi vége a lapockával mozog, a bordai eredése nem.
    'muscle-pectoralis-minor': (p) => (p.x < 215 ? 'scapula' : undefined),
    'muscle-pectoralis-major-clavicular': (p) => (p.y <= 122 ? 'clavicle' : undefined),
    'muscle-subclavius': (p) => (p.x < 262 ? 'clavicle' : undefined),
    'muscle-deltoid-anterior': all('scapula'),
    'muscle-deltoid-middle': all('scapula'),
    'muscle-biceps-brachii': all('scapula'),
    'muscle-coracobrachialis': all('scapula'),
    'muscle-supraspinatus': all('scapula'),
    'muscle-teres-major': all('scapula'),
    'muscle-triceps-long-head': all('scapula')
  },
  attachments: {
    'muscle-pectoralis-minor:insertion': all('scapula'),
    'muscle-pectoralis-major-clavicular:origin': all('clavicle'),
    'muscle-subclavius:insertion': all('clavicle')
  },
  joints: { 'joint-acromioclavicular': 'clavicle' }
});

/* ------------------------------------------------------------------ */
/* Felülnézet: protrakció és retrakció                                 */
/* ------------------------------------------------------------------ */

const S_SC = { x: 288, y: 362 };
const S_AC = { x: 150, y: 248 };
const humerusS = superiorView.frames.find((f) => f.id === 'humerus')!;
const forearmS = superiorView.frames.find((f) => f.id === 'forearm')!;

export const superiorGirdleView: ViewGeometry = reframe({
  viewId: 'superior-girdle',
  base: superiorView,
  frames: [
    // Pozitív `scapularProtraction`: a kulcscsont laterális vége (és a lapocka) előre fordul.
    { id: 'clavicle', parent: 'world', pivot: S_SC, localOrigin: S_SC, angleKey: 'scapularProtraction', angleScale: -1 },
    { id: 'scapula', parent: 'clavicle', pivot: S_AC, localOrigin: S_AC },
    { ...humerusS, parent: 'scapula', pivot: humerusS.pivot },
    forearmS
  ],
  bones: { 'bone-clavicle': 'clavicle', 'bone-scapula': 'scapula' },
  muscles: {
    'muscle-pectoralis-minor': (p) => (p.x < 175 ? 'scapula' : undefined),
    'muscle-serratus-anterior': (p) => (p.y < 200 ? 'scapula' : undefined),
    'muscle-pectoralis-major-clavicular': (p) => (p.y < 372 && p.x < 292 && p.x > 170 ? 'clavicle' : undefined),
    'muscle-infraspinatus': all('scapula'),
    'muscle-teres-minor': all('scapula'),
    'muscle-deltoid-posterior': all('scapula'),
    'muscle-deltoid-middle': all('scapula'),
    'muscle-deltoid-anterior': all('clavicle'),
    'muscle-coracobrachialis': all('scapula'),
    'muscle-biceps-brachii': all('scapula')
  },
  attachments: {
    'muscle-pectoralis-minor:insertion': all('scapula'),
    'muscle-pectoralis-major-clavicular:origin': all('clavicle')
  },
  joints: { 'joint-acromioclavicular': 'clavicle' }
});

/* ------------------------------------------------------------------ */
/* Oldalnézet: előrebillenés                                           */
/* ------------------------------------------------------------------ */

/** A billenés tengelye a lapocka felső részén, az ízületi árok fölött. */
const L_TILT = { x: 284, y: 130 };

export const lateralGirdleView: ViewGeometry = reframe({
  viewId: 'lateral-girdle',
  base: lateralView,
  frames: [
    // Pozitív `scapularAnteriorTilt`: a lapocka felső része (hollócsőrnyúlvány) előre-lefelé, az alsó szög hátra mozdul.
    { id: 'scapula', parent: 'world', pivot: L_TILT, localOrigin: L_TILT, angleKey: 'scapularAnteriorTilt' },
    ...lateralView.frames
  ],
  bones: { 'bone-scapula': 'scapula' },
  muscles: {
    'muscle-pectoralis-minor': (p) => (p.x < 335 && p.y < 160 ? 'scapula' : undefined),
    'muscle-serratus-anterior': (p) => (p.x < 262 ? 'scapula' : undefined),
    'muscle-teres-major': (p) => (p.x < 250 ? 'scapula' : undefined),
    'muscle-triceps-long-head': all('scapula'),
    'muscle-coracobrachialis': all('scapula'),
    'muscle-biceps-brachii': all('scapula'),
    'muscle-deltoid-posterior': all('scapula'),
    'muscle-deltoid-middle': all('scapula')
  },
  attachments: {
    'muscle-pectoralis-minor:insertion': all('scapula')
  }
});
