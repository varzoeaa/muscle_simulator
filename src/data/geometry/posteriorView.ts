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

/*
 * Elülső fűrészizom (mély réteg): a lapocka belső szélének elülső felszínétől a lapocka alatt
 * oldalra, a bordák oldalsó részéig. Hátulról a lapocka takarja; csak kiválasztva vagy
 * szerepkörrel jelölve látszik. A bordai eredések a bordák oldalsó végén (a mellkas kontúrján).
 */
const saSupInsertion = [W(250, 100), W(255, 134)];
const saSupOrigin = [W(199, 138), W(201, 164)];
const saIntInsertion = [W(256, 142), W(252, 194)];
const saIntOrigin = [W(201, 168), W(203, 192)];
const saInfInsertion = [W(250, 206), W(234, 290)];
const saInfOrigin = [W(203, 220), W(198, 250), W(194, 280), W(191, 310), W(192, 340)];

/*
 * Csuklyásizom (felületes): a pontok „elölnézeti” elrendezésben, a gerinc középvonala x = 300.
 * Tájékozódási szintek (sematikus): külső nyakszirti dudor y ≈ 10, C7 y ≈ 80, T1 y ≈ 100, majd
 * csigolyánként kb. 28 egység (T3 ≈ 156, T4 ≈ 184, T12 ≈ 408). A lapockatövis a (256, 142) és a
 * (150, 104) pont között fut, a vállcsúcs-kulcscsonti ízület (160, 100) körül van.
 */
const trDesOrigin = [W(280, 6), W(300, 10), W(300, 44), W(300, 78)];
const trDesInsertion = [W(210, 92), W(188, 95), W(166, 98)];
const trTraOrigin = [W(300, 82), W(300, 120), W(300, 156)];
const trTraInsertion = [W(162, 104), W(184, 116), W(214, 127), W(238, 135)];
const trAscOrigin = [W(300, 166), W(300, 290), W(300, 408)];
const trAscInsertion = [W(246, 139)];

const ribs: BoneShapeGeometry[] = Array.from({ length: 10 }, (_, i) => {
  const y = 112 + i * 27;
  return worldBone('bone-ribs', `M294,${y} Q240,${y - 10} ${198 + i * 2},${y + 26}`, 7);
});

export const posteriorView: ViewGeometry = {
  viewId: 'posterior',
  viewBox: [-120, -100, 840, 650],
  mirrorContext: true,
  orientation: { top: 'Kraniális (fej felé)', bottom: 'Kaudális (láb felé)', left: 'A test bal oldala (tükrözött)', right: 'A test jobb oldala' },
  frames: [
    { id: 'humerus', parent: 'world', pivot: { x: 2 * AXIS - 150, y: 140 }, angleKey: 'shoulderAbduction', angleScale: -1, scaleYKey: 'humerusScale' },
    { id: 'forearm', parent: 'humerus', pivot: { x: 0, y: 216 }, angleKey: 'elbowAngle', angleScale: -1, scaleYKey: 'forearmScale' }
  ],
  bones: [
    ...ribs,
    // Koponya hátulról (fél kontúr, a tükrözés egészíti ki) és a nyaki gerinc.
    worldBone('bone-skull', 'M300,-86 C274,-86 252,-66 252,-36 C252,-10 264,6 282,12 L300,14 Z'),
    worldBone('bone-vertebral-column', 'M294,14 L306,14 L306,470 L294,470 Z'),
    { structureId: 'ligament-nuchae', frame: 'world', d: mirrorPathX('M300,12 L300,80', AXIS), stroke: 4, variant: 'cartilage' },
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
      structureId: 'muscle-serratus-anterior-superior',
      layer: 'deep-muscles',
      z: 0,
      outline: [W(250, 98), W(256, 138), W(201, 164), W(199, 136), W(214, 118)],
      fibers: fan(saSupInsertion, saSupOrigin, 3)
    },
    {
      structureId: 'muscle-serratus-anterior-intermediate',
      layer: 'deep-muscles',
      z: 0,
      outline: [W(256, 138), W(252, 196), W(203, 194), W(201, 164)],
      fibers: fan(saIntInsertion, saIntOrigin, 3)
    },
    {
      structureId: 'muscle-serratus-anterior-inferior',
      layer: 'deep-muscles',
      z: 0,
      outline: [W(252, 196), W(246, 250), W(234, 292), W(218, 322), W(196, 352), W(190, 330), W(191, 300), W(196, 250), W(203, 218), W(203, 194)],
      fibers: fan(saInfInsertion, saInfOrigin, 6),
      label: { at: W(214, 300), text: 'Elülső fűrészizom' }
    },
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
      // A csuklyásizom alatt fekvő, mély izom (hátulról nagyrészt takart).
      structureId: 'muscle-levator-scapulae',
      layer: 'deep-muscles',
      z: 3,
      outline: [W(286, 14), W(276, 16), W(262, 44), W(248, 90), W(252, 132), W(258, 128), W(270, 70), W(288, 30)],
      fibers: fan([W(282, 20), W(284, 34)], [W(250, 96), W(254, 128)], 3),
      label: { at: W(270, 58), text: 'Lapockaemelő izom' }
    },
    {
      // A csuklyásizom alatt fekvő, mély izmok (kis és nagy rombuszizom egy kontúrként).
      structureId: 'muscle-rhomboids',
      layer: 'deep-muscles',
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
      // Felirat nélkül: hátulról a csuklyásizom takarja (kiválasztva vagy szerepkörrel jelölve kap feliratot).
      fibers: fan([W(248, 108), W(246, 128)], [H(-8, -22), H(-10, -21)], 3)
    },
    {
      structureId: 'muscle-trapezius-descending',
      layer: 'superficial-muscles',
      z: 8,
      outline: [W(300, 10), W(280, 6), W(276, 20), W(264, 44), W(244, 66), W(214, 84), W(186, 92), W(164, 96), W(160, 102), W(300, 80)],
      fibers: fan([W(299, 16), W(299, 46), W(299, 74)], [W(208, 93), W(188, 95), W(168, 99)], 6),
      label: { at: W(266, 44), text: 'Felső (leszálló) rész' }
    },
    {
      structureId: 'muscle-trapezius-transverse',
      layer: 'superficial-muscles',
      z: 8,
      outline: [W(300, 80), W(160, 102), W(158, 107), W(184, 117), W(214, 128), W(240, 137), W(300, 162)],
      fibers: fan([W(299, 88), W(299, 118), W(299, 146)], [W(166, 105), W(200, 121), W(236, 134)], 5),
      label: { at: W(262, 124), text: 'Középső (haránt) rész' }
    },
    {
      structureId: 'muscle-trapezius-ascending',
      layer: 'superficial-muscles',
      z: 8,
      outline: [W(300, 162), W(240, 137), W(252, 141), W(258, 156), W(262, 204), W(270, 270), W(286, 350), W(300, 410)],
      fibers: fan([W(299, 196), W(299, 300), W(299, 402)], [W(246, 140), W(248, 141), W(250, 142)], 6),
      label: { at: W(284, 262), text: 'Alsó (felszálló) rész' }
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
  attachments: [
    { structureId: 'muscle-trapezius-descending', type: 'origin', extent: 'line', points: trDesOrigin },
    { structureId: 'muscle-trapezius-descending', type: 'insertion', extent: 'line', points: trDesInsertion },
    { structureId: 'muscle-trapezius-transverse', type: 'origin', extent: 'line', points: trTraOrigin },
    { structureId: 'muscle-trapezius-transverse', type: 'insertion', extent: 'line', points: trTraInsertion },
    { structureId: 'muscle-trapezius-ascending', type: 'origin', extent: 'line', points: trAscOrigin },
    { structureId: 'muscle-trapezius-ascending', type: 'insertion', extent: 'point', points: trAscInsertion },
    { structureId: 'muscle-serratus-anterior-superior', type: 'origin', extent: 'line', points: saSupOrigin },
    { structureId: 'muscle-serratus-anterior-superior', type: 'insertion', extent: 'line', points: saSupInsertion },
    { structureId: 'muscle-serratus-anterior-intermediate', type: 'origin', extent: 'line', points: saIntOrigin },
    { structureId: 'muscle-serratus-anterior-intermediate', type: 'insertion', extent: 'line', points: saIntInsertion },
    { structureId: 'muscle-serratus-anterior-inferior', type: 'origin', extent: 'line', points: saInfOrigin },
    { structureId: 'muscle-serratus-anterior-inferior', type: 'insertion', extent: 'line', points: saInfInsertion }
  ],
  joints: [
    { structureId: 'joint-glenohumeral', at: H(0, 0) },
    { structureId: 'joint-acromioclavicular', at: W(160, 100) },
    { structureId: 'joint-elbow', at: H(0, 216) }
  ],
  landmarkLabels: [
    { at: W(352, -40), text: 'Tarkó (nyakszirt)', anchor: 'end' },
    { at: W(296, 10), text: 'Külső nyakszirti dudor', anchor: 'end' },
    { at: W(296, 80), text: 'C7', anchor: 'end' },
    { at: W(296, 408), text: 'T12 – a gerinc középvonala', anchor: 'end' },
    { at: W(232, 148), text: 'Lapockatövis', anchor: 'end' },
    { at: W(150, 92), text: 'Vállcsúcs', anchor: 'start' },
    { at: W(186, 88), text: 'Kulcscsont (látható része)', anchor: 'start' }
  ]
};

/** Hátulnézet zárt láncú húzódzkodáshoz: ugyanaz a rögzített rúd és törzseltolás, mint elölről. */
export const posteriorClosedChainView: ViewGeometry = {
  ...posteriorView,
  landmarkLabels: undefined,
  viewId: 'posterior-closed-chain',
  viewBox: [-120, -320, 840, 680],
  sceneOffsetYKey: 'trunkY',
  fixtures: [{ d: `M-60,${GRIP.y} L660,${GRIP.y}`, label: { x: 300, y: GRIP.y - 14, text: 'Rögzített rúd' } }]
};
