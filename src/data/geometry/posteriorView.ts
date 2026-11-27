import type { BoneShapeGeometry, FramedPoint, ViewGeometry } from '../../types';
import { fan, mirrorPathX } from '../../utils/geometry';
import { GRIP } from './anteriorVariants';

/**
 * HÁTULNÉZET – a test hátulról; a jobb oldal (részletes, interaktív) a néző JOBB oldalán,
 * a bal oldal tükrözött kontextusként. A hátsó vállövi izmok (széles hátizom, nagy és kis
 * görgetegizom, tövis feletti és alatti izom, rombuszizmok, deltaizom hátsó része,
 * háromfejű karizom hosszú feje) ebből a nézetből láthatók; a nagy mellizom nem.
 *
 * A pontokat „elölnézeti” elrendezésben (a vizsgált oldal balra, GH = (150, 140)) adjuk meg,
 * majd az x = 300 tengelyre tükrözzük; a csontok helyi x koordinátája is tükröződik, a frame-ek
 * forgásiránya ezért fordított (`angleScale: -1`). Saját szerkesztésű, egyszerűsített oktatási
 * ábra (lásd: MODEL_LIMITATIONS.md).
 */
const AXIS = 300;
const W = (x: number, y: number): FramedPoint => ({ frame: 'world', x: 2 * AXIS - x, y });
const H = (x: number, y: number): FramedPoint => ({ frame: 'humerus', x: -x, y });

const worldBone = (structureId: string, d: string, stroke?: number): BoneShapeGeometry => ({ structureId, frame: 'world', d: mirrorPathX(d, AXIS), stroke });
const localBone = (structureId: string, frame: string, d: string): BoneShapeGeometry => ({ structureId, frame, d: mirrorPathX(d, 0) });

const ribs: BoneShapeGeometry[] = Array.from({ length: 10 }, (_, i) => {
  const y = 112 + i * 27;
  return worldBone('bone-ribs', `M294,${y} Q240,${y - 10} ${198 + i * 2},${y + 26}`, 7);
});

export const posteriorView: ViewGeometry = {
  viewId: 'posterior',
  viewBox: [-120, 30, 840, 520],
  mirrorContext: true,
  orientation: { top: 'Kraniális (fej felé)', bottom: 'Kaudális (láb felé)', left: 'A test bal oldala (tükrözött)', right: 'A test jobb oldala' },
  frames: [
    { id: 'humerus', parent: 'world', pivot: { x: 2 * AXIS - 150, y: 140 }, angleKey: 'shoulderAbduction', angleScale: -1, scaleYKey: 'humerusScale' },
    { id: 'forearm', parent: 'humerus', pivot: { x: 0, y: 216 }, angleKey: 'elbowAngle', angleScale: -1, scaleYKey: 'forearmScale' }
  ],
  bones: [
    ...ribs,
    worldBone('bone-vertebral-column', 'M294,56 L306,56 L306,470 L294,470 Z'),
    worldBone('bone-scapula', 'M248,94 L258,140 L240,288 L226,292 L172,176 L160,146 L176,120 L210,104 Z'),
    worldBone('bone-scapula', 'M256,142 L196,120 L150,104', 9),
    worldBone('bone-clavicle', 'M290,92 C250,86 200,92 162,98', 9),
    localBone(
      'bone-humerus',
      'humerus',
      'M-2,-21 C20,-25 30,-6 26,10 C22,22 14,28 12,40 L10,190 C12,200 22,205 22,216 L-22,216 C-24,206 -14,198 -12,188 L-14,40 C-21,27 -27,12 -25,-2 C-23,-14 -14,-21 -2,-21 Z'
    ),
    localBone('bone-ulna', 'forearm', 'M-20,4 L-14,196 L-4,198 L-6,8 Z'),
    localBone('bone-radius', 'forearm', 'M2,8 L1,198 L12,198 L19,2 Z')
  ],
  muscles: [
    {
      structureId: 'muscle-latissimus-dorsi',
      layer: 'superficial-muscles',
      z: 2,
      outline: [W(300, 300), W(300, 466), W(228, 470), W(196, 380), W(204, 300), H(10, 80), H(8, 46), W(236, 292), W(270, 282)],
      fibers: fan([W(298, 460), W(298, 380), W(290, 304)], [H(9, 78), H(9, 62), H(9, 48)], 6),
      label: { at: W(250, 400), text: 'Széles hátizom' }
    },
    {
      structureId: 'muscle-teres-major',
      layer: 'superficial-muscles',
      z: 3,
      outline: [W(238, 290), W(224, 254), W(210, 246), H(6, 54), H(9, 84)],
      fibers: fan([W(236, 286), W(222, 256)], [H(8, 80), H(6, 58)], 3),
      label: { at: W(214, 290), text: 'Nagy görgetegizom' }
    },
    {
      structureId: 'muscle-rhomboids',
      layer: 'superficial-muscles',
      z: 4,
      outline: [W(298, 92), W(298, 252), W(242, 286), W(256, 140)],
      fibers: fan([W(296, 100), W(296, 246)], [W(254, 144), W(242, 282)], 6),
      label: { at: W(276, 200), text: 'Rombuszizmok' }
    },
    {
      structureId: 'muscle-infraspinatus',
      layer: 'superficial-muscles',
      z: 5,
      outline: [W(254, 148), W(242, 250), W(204, 232), W(180, 186), H(-22, 8), H(-22, -6), W(196, 128)],
      fibers: fan([W(250, 160), W(244, 236)], [H(-22, -2), H(-22, 6)], 5),
      label: { at: W(222, 190), text: 'Tövis alatti izom' }
    },
    {
      structureId: 'muscle-teres-minor',
      layer: 'superficial-muscles',
      z: 6,
      outline: [W(204, 236), W(184, 206), H(-24, 14), H(-20, 26)],
      fibers: fan([W(200, 230), W(188, 210)], [H(-22, 22), H(-23, 16)], 2),
      label: { at: W(178, 222), text: 'Kis görgetegizom' }
    },
    {
      structureId: 'muscle-supraspinatus',
      layer: 'superficial-muscles',
      z: 7,
      outline: [W(248, 100), W(254, 134), W(196, 116), H(-14, -20), H(-4, -24), W(204, 102)],
      fibers: fan([W(248, 108), W(246, 128)], [H(-8, -22), H(-10, -21)], 3),
      label: { at: W(222, 112), text: 'Tövis feletti izom' }
    },
    {
      structureId: 'muscle-trapezius',
      layer: 'superficial-muscles',
      z: 8,
      outline: [W(300, 36), W(300, 330), W(268, 250), W(256, 150), W(200, 124), W(156, 102), W(196, 86), W(268, 62)],
      fibers: fan([W(298, 50), W(298, 180), W(298, 320)], [W(162, 102), W(230, 136), W(262, 240)], 7),
      label: { at: W(278, 70), text: 'Csuklyásizom' }
    },
    {
      structureId: 'muscle-triceps-long-head',
      layer: 'superficial-muscles',
      z: 9,
      outline: [W(178, 168), W(168, 178), H(-12, 120), H(-10, 200), H(2, 214), H(6, 120)],
      fibers: fan([W(174, 172)], [H(-4, 206)], 1),
      label: { at: H(-4, 160), text: 'Háromfejű karizom hosszú feje' }
    },
    {
      structureId: 'muscle-deltoid-middle',
      layer: 'superficial-muscles',
      z: 10,
      outline: [W(166, 100), W(140, 104), H(-30, 4), H(-28, 50), H(-16, 118), H(-10, 118), H(-20, 40)],
      fibers: fan([W(160, 100), W(142, 104)], [H(-14, 116), H(-12, 116)], 3)
    },
    {
      structureId: 'muscle-deltoid-posterior',
      layer: 'superficial-muscles',
      z: 11,
      outline: [W(246, 142), W(200, 126), W(168, 108), H(-18, 8), H(-16, 60), H(-8, 118), H(-2, 118), H(4, 60), W(204, 146)],
      fibers: fan([W(240, 142), W(200, 128), W(172, 110)], [H(-4, 116), H(-6, 112)], 4),
      label: { at: W(196, 150), text: 'Deltaizom hátsó rész' }
    }
  ],
  attachments: [],
  joints: [
    { structureId: 'joint-glenohumeral', at: H(0, 0) },
    { structureId: 'joint-acromioclavicular', at: W(160, 100) },
    { structureId: 'joint-elbow', at: H(0, 216) }
  ]
};

/** Hátulnézet zárt láncú húzódzkodáshoz: ugyanaz a rögzített rúd és törzseltolás, mint elölről. */
export const posteriorClosedChainView: ViewGeometry = {
  ...posteriorView,
  viewId: 'posterior-closed-chain',
  viewBox: [-120, -320, 840, 680],
  sceneOffsetYKey: 'trunkY',
  fixtures: [{ d: `M-60,${GRIP.y} L660,${GRIP.y}`, label: { x: 300, y: GRIP.y - 14, text: 'Rögzített rúd' } }]
};
