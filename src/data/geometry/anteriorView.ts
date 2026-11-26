import type { BoneShapeGeometry, FramedPoint, ViewGeometry } from '../../types';
import { fan } from '../../utils/geometry';

/**
 * ELÜLSŐ NÉZET – a test jobb oldala (a néző bal oldalán), részletesen.
 * Saját szerkesztésű, egyszerűsített oktatási ábra. A tájékozódási pontok
 * (szegycsont, bordaporcok, kulcscsont, hollócsőrnyúlvány, nagy gumó taraja)
 * egymáshoz viszonyított helyzete tankönyvi ábrák alapján készült, de nem
 * szkennelt vagy mért geometria. Lásd: MODEL_LIMITATIONS.md.
 *
 * Koordináták: világ (W) – a mellkas rögzített rendszere; H – felkarcsont
 * rendszere (origó a vállízület forgáspontja, +y a csont tengelye disztálisan);
 * F – alkar rendszere (origó a könyök).
 */
const W = (x: number, y: number): FramedPoint => ({ frame: 'world', x, y });
const H = (x: number, y: number): FramedPoint => ({ frame: 'humerus', x, y });
const F = (x: number, y: number): FramedPoint => ({ frame: 'forearm', x, y });

const GH = { x: 150, y: 140 };

/* ---- Bordák: [szegycsonti vég, porc-csont határ, oldalsó ív, hátra forduló vég] ---- */
const ribData: [number, number, number, number, number, number, number, number][] = [
  [283, 124, 266, 130, 238, 122, 222, 110],
  [286, 146, 256, 152, 206, 142, 184, 158],
  [287, 170, 252, 178, 196, 172, 177, 192],
  [287, 193, 249, 202, 191, 202, 175, 224],
  [287, 216, 246, 228, 189, 234, 175, 257],
  [287, 241, 242, 258, 189, 266, 177, 290],
  [288, 268, 238, 292, 193, 298, 183, 322],
  [262, 286, 232, 314, 199, 324, 191, 344],
  [250, 304, 228, 332, 206, 344, 199, 360],
  [241, 320, 226, 348, 213, 358, 208, 372]
];

const ribs: BoneShapeGeometry[] = ribData.flatMap(([sx, sy, cx, cy, lx, ly, ex, ey], i) => [
  {
    structureId: 'bone-costal-cartilages',
    frame: 'world',
    variant: 'cartilage' as const,
    stroke: i < 7 ? 6 : 5,
    d: `M${sx},${sy} Q${(sx + cx) / 2},${(sy + cy) / 2 + 3} ${cx},${cy}`
  },
  {
    structureId: 'bone-ribs',
    frame: 'world',
    stroke: i === 0 ? 9 : 8,
    d: `M${cx},${cy} Q${lx + (cx - lx) * 0.25},${ly + (cy - ly) * 0.1 - 6} ${lx},${ly} T${ex},${ey}`
  }
]);

const pmClavOrigin = [W(284, 117), W(254, 113), W(224, 109)];
const pmClavInsertion = [H(-15, 98), H(-15, 68)];
const pmSternoOrigin = [W(289, 134), W(293, 175), W(293, 220), W(291, 258), W(268, 276)];
const pmSternoInsertion = [H(-10, 46), H(-10, 84)];
const pmAbdOrigin = [W(288, 292), W(270, 300), W(250, 309)];
const pmAbdInsertion = [H(-6, 34), H(-6, 54)];

export const anteriorView: ViewGeometry = {
  viewId: 'anterior',
  viewBox: [-120, 30, 840, 520],
  focusViewBox: [30, 60, 540, 420],
  mirrorContext: true,
  orientation: { top: 'Kraniális (fej felé)', bottom: 'Kaudális (láb felé)', left: 'A test jobb oldala (laterális)', right: 'Középvonal / bal oldal' },
  frames: [
    { id: 'humerus', parent: 'world', pivot: GH, angleKey: 'shoulderAbduction' },
    { id: 'forearm', parent: 'humerus', pivot: { x: 0, y: 216 } }
  ],
  bones: [
    {
      structureId: 'bone-scapula',
      frame: 'world',
      d: 'M168,96 L134,100 Q124,108 134,117 L156,116 Q166,124 166,136 Q172,150 166,162 Q178,232 204,302 Q220,292 234,252 Q246,192 240,132 Q216,118 196,121 Q190,112 176,108 Z M190,120 Q202,124 196,138 Q188,143 183,134 Q187,128 181,122 Z'
    },
    ...ribs,
    {
      structureId: 'bone-sternum',
      frame: 'world',
      d: 'M283,110 Q300,119 317,110 L322,128 Q318,150 313,160 L316,168 L314,290 Q300,300 286,290 L284,168 L287,160 Q282,150 278,128 Z M292,294 L308,294 L300,326 Z'
    },
    {
      structureId: 'bone-clavicle',
      frame: 'world',
      d: 'M285,108 C262,99 246,111 225,105 C205,98 186,91 165,94 L162,104 C185,103 205,108 225,115 C248,122 266,112 285,122 Q292,116 285,108 Z'
    },
    {
      structureId: 'bone-humerus',
      frame: 'humerus',
      d: 'M-2,-21 C20,-25 30,-6 26,10 C22,22 14,28 12,40 L10,190 C12,200 22,205 22,216 L-22,216 C-24,206 -14,198 -12,188 L-14,40 C-21,27 -27,12 -25,-2 C-23,-14 -14,-21 -2,-21 Z'
    },
    { structureId: 'bone-radius', frame: 'forearm', d: 'M-20,4 L-14,196 L-4,198 L-6,8 Z' },
    { structureId: 'bone-ulna', frame: 'forearm', d: 'M2,8 L1,198 L12,198 L19,2 Z' }
  ],
  muscles: [
    {
      structureId: 'muscle-external-oblique',
      layer: 'superficial-muscles',
      z: 1,
      outline: [W(293, 300), W(293, 440), W(225, 440), W(196, 360), W(206, 336), W(250, 316)],
      fibers: fan([W(205, 340), W(220, 330), W(250, 318)], [W(240, 440), W(270, 440), W(292, 420)], 6)
    },
    {
      structureId: 'muscle-serratus-anterior',
      layer: 'superficial-muscles',
      z: 2,
      outline: [W(200, 150), W(216, 176), W(208, 196), W(224, 212), W(214, 236), W(230, 256), W(220, 280), W(232, 302), W(218, 326), W(200, 340), W(186, 300), W(180, 230), W(186, 170)],
      fibers: fan([W(214, 178), W(220, 214), W(226, 256), W(228, 300)], [W(190, 160), W(184, 230), W(188, 300), W(196, 336)], 6),
      label: { at: W(200, 326), text: 'Elülső fűrészizom' }
    },
    {
      structureId: 'muscle-latissimus-dorsi',
      layer: 'superficial-muscles',
      z: 3,
      outline: [H(6, 42), H(8, 74), W(184, 262), W(178, 350), W(160, 356), W(166, 260)],
      fibers: fan([W(168, 350), W(176, 300)], [H(6, 46), H(7, 70)], 4)
    },
    {
      structureId: 'muscle-triceps-long-head',
      layer: 'superficial-muscles',
      z: 4,
      outline: [H(14, 50), H(26, 110), H(24, 190), H(14, 204), H(12, 120)],
      fibers: fan([H(16, 60), H(20, 70)], [H(18, 190), H(20, 196)], 3)
    },
    {
      structureId: 'muscle-coracobrachialis',
      layer: 'superficial-muscles',
      z: 5,
      outline: [W(190, 133), H(16, 62), H(16, 126), H(9, 124), H(6, 60), W(184, 140)],
      fibers: fan([W(188, 136)], [H(12, 124)], 1)
    },
    {
      structureId: 'muscle-biceps-brachii',
      layer: 'superficial-muscles',
      z: 6,
      outline: [W(190, 138), H(10, 60), H(13, 140), H(9, 200), F(4, 40), F(-6, 40), H(-13, 200), H(-15, 140), H(-10, 60), H(-6, -12), H(0, -18), H(4, 30)],
      fibers: fan([H(-4, 0), W(188, 140)], [F(-3, 36), F(0, 36)], 4),
      label: { at: H(0, 150), text: 'Kétfejű karizom' }
    },
    {
      structureId: 'muscle-pectoralis-minor',
      layer: 'deep-muscles',
      z: 7,
      outline: [W(186, 130), W(254, 170), W(253, 198), W(249, 228), W(238, 228), W(196, 144)],
      fibers: fan([W(186, 132), W(192, 140)], [W(252, 172), W(244, 226)], 5),
      label: { at: W(226, 186), text: 'Kis mellizom' }
    },
    {
      structureId: 'muscle-subclavius',
      layer: 'deep-muscles',
      z: 8,
      outline: [W(276, 124), W(250, 120), W(224, 114), W(222, 121), W(250, 127), W(274, 132)],
      fibers: fan([W(274, 128)], [W(224, 118)], 1)
    },
    {
      structureId: 'muscle-pectoralis-major-abdominal',
      layer: 'superficial-muscles',
      z: 10,
      outline: [W(290, 284), W(288, 296), W(250, 312), W(214, 270), H(-3, 54), H(-3, 32), W(212, 246), W(262, 282)],
      fibers: fan(pmAbdOrigin, pmAbdInsertion, 5),
      label: { at: W(266, 303), text: 'Hasi rész' }
    },
    {
      structureId: 'muscle-pectoralis-major-sternocostal',
      layer: 'superficial-muscles',
      z: 11,
      outline: [W(287, 132), W(250, 146), W(214, 160), H(-8, 44), H(-8, 86), W(206, 248), W(240, 270), W(270, 280), W(291, 262), W(294, 218), W(293, 172)],
      fibers: fan(pmSternoOrigin, pmSternoInsertion, 12),
      label: { at: W(250, 220), text: 'Szegycsonti-bordai rész' }
    },
    {
      structureId: 'muscle-pectoralis-major-clavicular',
      layer: 'superficial-muscles',
      z: 12,
      outline: [W(286, 120), W(255, 116), W(222, 112), H(-16, 66), H(-14, 100), H(-2, 98), W(214, 152), W(250, 142), W(283, 134)],
      fibers: fan(pmClavOrigin, pmClavInsertion, 7),
      label: { at: W(244, 128), text: 'Kulcscsonti rész' }
    },
    {
      structureId: 'muscle-deltoid-middle',
      layer: 'superficial-muscles',
      z: 13,
      outline: [W(172, 96), W(134, 99), H(-38, 6), H(-36, 50), H(-18, 118), H(-22, 40)],
      fibers: fan([W(160, 98), W(136, 101)], [H(-19, 114), H(-18, 116)], 4)
    },
    {
      structureId: 'muscle-deltoid-anterior',
      layer: 'superficial-muscles',
      z: 14,
      outline: [W(226, 108), W(198, 100), W(172, 96), H(-22, 14), H(-24, 60), H(-16, 118), H(-6, 96), H(0, 50), W(206, 120)],
      fibers: fan([W(222, 108), W(196, 101), W(174, 97)], [H(-10, 104), H(-16, 116)], 5),
      label: { at: H(-14, 45), text: 'Deltaizom' }
    }
  ],
  attachments: [
    { structureId: 'muscle-pectoralis-major-clavicular', type: 'origin', extent: 'line', points: pmClavOrigin },
    { structureId: 'muscle-pectoralis-major-sternocostal', type: 'origin', extent: 'area', points: [W(285, 130), W(297, 130), W(298, 262), W(266, 282), W(260, 272), W(287, 256)] },
    { structureId: 'muscle-pectoralis-major-abdominal', type: 'origin', extent: 'line', points: pmAbdOrigin },
    { structureId: 'muscle-pectoralis-major-clavicular', type: 'insertion', extent: 'line', points: [H(-14, 70), H(-14, 98)] },
    { structureId: 'muscle-pectoralis-major-sternocostal', type: 'insertion', extent: 'line', points: [H(-11, 46), H(-11, 84)] },
    { structureId: 'muscle-pectoralis-major-abdominal', type: 'insertion', extent: 'line', points: [H(-8, 34), H(-8, 54)] }
  ],
  joints: [
    { structureId: 'joint-glenohumeral', at: H(0, 0) },
    { structureId: 'joint-sternoclavicular', at: W(287, 116) },
    { structureId: 'joint-acromioclavicular', at: W(166, 99) },
    { structureId: 'joint-elbow', at: H(0, 216) }
  ]
};
