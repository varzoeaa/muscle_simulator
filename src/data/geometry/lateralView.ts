import type { BoneShapeGeometry, FramedPoint, ViewGeometry } from '../../types';
import { fan } from '../../utils/geometry';

/**
 * OLDALNÉZET (szagittális) – a test jobb oldala oldalról; jobbra az elülső (ventrális) oldal.
 * A vállízületi hajlítás és feszítés a szagittális síkban zajlik, ezért ez a nézet
 * mutatja torzítás nélkül. Saját szerkesztésű, egyszerűsített oktatási ábra
 * (lásd: MODEL_LIMITATIONS.md); a mélyebb rétegek erősen sematikusak.
 *
 * A felkarcsont helyi +x iránya a csont elülső felszíne felé mutat; a frame
 * `angleScale: -1` miatt a pozitív `shoulderFlexion` előre emeli a kart.
 * A negatív z értékű izmok (mellkasfal, széles hátizom) a felkar mögött, medialisan
 * futnak; az előtérbe hozott (`front`) felkar- és alkarcsont eltakarja őket.
 */
const W = (x: number, y: number): FramedPoint => ({ frame: 'world', x, y });
const H = (x: number, y: number): FramedPoint => ({ frame: 'humerus', x, y });
const F = (x: number, y: number): FramedPoint => ({ frame: 'forearm', x, y });

const clavOrigin = [W(388, 114), W(366, 109), W(346, 106)];
const clavInsertion = [H(14, 100), H(14, 70)];
const sternoOrigin = [W(396, 140), W(400, 190), W(403, 240), W(405, 282)];
const sternoInsertion = [H(13, 44), H(13, 86)];
const abdOrigin = [W(406, 300), W(402, 326)];
const abdInsertion = [H(10, 34), H(10, 54)];
/** Kis mellizom: a hollócsőrnyúlványtól lefelé-előre a 3–5. bordáig, a nagy mellizom alatt. */
const pmiOrigin = [W(366, 228), W(368, 258), W(370, 288)];
const pmiInsertion = [W(314, 136), W(322, 142)];
/** Kulcscsont alatti izom: az 1. borda elülső végétől fel-hátra a kulcscsont alsó felszínéig. */
const subOrigin = [W(364, 162), W(372, 164)];
const subInsertion = [W(334, 108), W(352, 111)];

/** Bordák oldalnézetben: hátul magasabban erednek, előre-lefelé futnak. */
const ribs: BoneShapeGeometry[] = Array.from({ length: 9 }, (_, i) => {
  const y0 = 132 + i * 26;
  const y1 = 168 + i * 30;
  const front = 392 + Math.min(i, 6) * 2 - Math.max(0, i - 6) * 10;
  return [
    {
      structureId: 'bone-ribs',
      frame: 'world',
      stroke: 7,
      d: `M226,${y0} C270,${y0 + 4} 330,${y1 - 14} ${front - 26},${y1}`
    },
    {
      structureId: 'bone-costal-cartilages',
      frame: 'world',
      variant: 'cartilage' as const,
      stroke: 5,
      d: `M${front - 26},${y1} Q${front - 10},${y1 - 2} ${front},${y1 - 10}`
    }
  ];
}).flat();

export const lateralView: ViewGeometry = {
  viewId: 'lateral',
  viewBox: [130, -80, 620, 560],
  focusViewBox: [170, 60, 270, 390],
  mirrorContext: false,
  orientation: { top: 'Kraniális (fej felé)', bottom: 'Kaudális (láb felé)', left: 'Hátulsó (dorzális)', right: 'Elülső (ventrális)' },
  frames: [
    { id: 'humerus', parent: 'world', pivot: { x: 300, y: 150 }, angleKey: 'shoulderFlexion', angleScale: -1 },
    { id: 'forearm', parent: 'humerus', pivot: { x: 0, y: 216 } }
  ],
  bones: [
    { structureId: 'bone-vertebral-column', frame: 'world', d: 'M196,92 L210,92 L214,440 L200,440 Z' },
    ...ribs,
    { structureId: 'bone-sternum', frame: 'world', d: 'M386,118 L398,116 L410,296 L404,312 L396,298 Z' },
    {
      structureId: 'bone-scapula',
      frame: 'world',
      d: 'M302,98 L264,102 L246,112 L232,176 L234,288 L248,292 L262,190 L280,158 L296,140 L304,118 Z M290,138 Q300,150 296,164 L286,160 Q290,150 284,142 Z'
    },
    { structureId: 'bone-clavicle', frame: 'world', stroke: 11, d: 'M392,118 C368,110 330,102 294,102' },
    {
      structureId: 'bone-humerus',
      frame: 'humerus',
      front: true,
      d: 'M-2,-21 C20,-25 30,-6 26,10 C22,22 14,28 12,40 L10,190 C12,200 22,205 22,216 L-22,216 C-24,206 -14,198 -12,188 L-14,40 C-21,27 -27,12 -25,-2 C-23,-14 -14,-21 -2,-21 Z'
    },
    { structureId: 'bone-radius', frame: 'forearm', front: true, d: 'M2,8 L1,198 L12,198 L19,2 Z' },
    { structureId: 'bone-ulna', frame: 'forearm', front: true, d: 'M-20,4 L-14,196 L-4,198 L-6,8 Z' }
  ],
  muscles: [
    {
      structureId: 'muscle-serratus-anterior',
      layer: 'superficial-muscles',
      z: -3,
      outline: [W(250, 160), W(300, 186), W(352, 226), W(372, 270), W(362, 312), W(330, 322), W(272, 300), W(244, 250)],
      fibers: fan([W(252, 170), W(246, 250)], [W(340, 214), W(356, 306)], 5)
    },
    {
      structureId: 'muscle-latissimus-dorsi',
      layer: 'superficial-muscles',
      z: -2,
      outline: [W(230, 250), W(214, 330), W(220, 430), W(252, 420), W(282, 300), H(2, 84), H(4, 52), H(-12, 48), W(250, 232)],
      fibers: fan([W(222, 420), W(220, 320), W(234, 254)], [H(0, 80), H(0, 66), H(0, 52)], 5),
      label: { at: W(240, 380), text: 'Széles hátizom' }
    },
    {
      structureId: 'muscle-teres-major',
      layer: 'superficial-muscles',
      z: -1,
      outline: [W(236, 292), W(246, 256), H(-6, 54), H(0, 82)],
      fibers: fan([W(238, 284), W(244, 262)], [H(-2, 78), H(-4, 58)], 3)
    },
    {
      structureId: 'muscle-triceps-long-head',
      layer: 'superficial-muscles',
      z: 2,
      outline: [W(288, 166), W(278, 176), H(-26, 110), H(-24, 190), H(-12, 206), H(-14, 120)],
      fibers: fan([W(284, 170)], [H(-20, 196)], 1)
    },
    {
      structureId: 'muscle-coracobrachialis',
      layer: 'superficial-muscles',
      z: 3,
      outline: [W(322, 136), H(18, 62), H(16, 124), H(10, 122), H(8, 60), W(314, 144)],
      fibers: fan([W(318, 140)], [H(13, 122)], 1)
    },
    {
      structureId: 'muscle-biceps-brachii',
      layer: 'superficial-muscles',
      z: 4,
      outline: [W(320, 136), H(18, 40), H(26, 130), H(18, 200), F(12, 40), F(4, 40), H(6, 200), H(10, 60)],
      fibers: fan([W(318, 140), H(14, 40)], [F(8, 36), F(8, 36)], 3),
      label: { at: H(22, 170), text: 'Kétfejű karizom' }
    },
    {
      structureId: 'muscle-deltoid-posterior',
      layer: 'superficial-muscles',
      z: 6,
      outline: [W(292, 96), W(260, 102), W(250, 112), H(-22, 60), H(-10, 118), H(-4, 118), H(-24, 18)],
      fibers: fan([W(286, 98), W(256, 108)], [H(-8, 116), H(-10, 112)], 4)
    },
    {
      structureId: 'muscle-deltoid-middle',
      layer: 'superficial-muscles',
      z: 7,
      outline: [W(312, 94), W(288, 94), H(-26, -4), H(-22, 50), H(-4, 118), H(4, 118), H(22, 50), H(26, -6)],
      fibers: fan([W(306, 94), W(292, 94)], [H(-1, 116), H(1, 116)], 3),
      label: { at: H(0, 70), text: 'Deltaizom' }
    },
    {
      structureId: 'muscle-subclavius',
      layer: 'deep-muscles',
      z: 7,
      outline: [W(330, 106), W(356, 110), W(376, 160), W(368, 168), W(358, 164), W(338, 114)],
      fibers: fan(subInsertion, subOrigin, 3),
      label: { at: W(356, 136), text: 'Kulcscsont alatti izom' }
    },
    {
      structureId: 'muscle-pectoralis-minor',
      layer: 'deep-muscles',
      z: 8,
      outline: [W(312, 134), W(326, 138), W(372, 226), W(374, 292), W(360, 292), W(316, 150)],
      fibers: fan(pmiInsertion, pmiOrigin, 5),
      label: { at: W(350, 214), text: 'Kis mellizom' }
    },
    {
      structureId: 'muscle-pectoralis-major-abdominal',
      layer: 'superficial-muscles',
      z: 9,
      outline: [W(404, 294), W(408, 316), W(402, 332), H(14, 56), H(14, 44), H(12, 32)],
      fibers: fan(abdOrigin, abdInsertion, 4)
    },
    {
      structureId: 'muscle-pectoralis-major-sternocostal',
      layer: 'superficial-muscles',
      z: 10,
      outline: [W(395, 132), W(400, 180), W(404, 232), W(408, 288), W(382, 292), H(16, 88), H(17, 66), H(14, 42), W(372, 146)],
      fibers: fan(sternoOrigin, sternoInsertion, 10),
      label: { at: W(372, 228), text: 'Szegycsonti-bordai rész' }
    },
    {
      structureId: 'muscle-pectoralis-major-clavicular',
      layer: 'superficial-muscles',
      z: 11,
      outline: [W(393, 112), W(368, 106), W(342, 104), H(14, 66), H(19, 86), H(17, 104), W(392, 124)],
      fibers: fan(clavOrigin, clavInsertion, 6),
      label: { at: W(378, 130), text: 'Kulcscsonti rész' }
    },
    {
      structureId: 'muscle-deltoid-anterior',
      layer: 'superficial-muscles',
      z: 12,
      outline: [W(348, 102), W(322, 98), H(12, -22), H(26, 0), H(24, 60), H(14, 118), H(8, 118), H(14, 60), W(340, 112)],
      fibers: fan([W(344, 104), W(324, 100)], [H(11, 116), H(12, 112)], 4)
    }
  ],
  attachments: [
    { structureId: 'muscle-pectoralis-major-clavicular', type: 'origin', extent: 'line', points: clavOrigin },
    { structureId: 'muscle-pectoralis-major-sternocostal', type: 'origin', extent: 'line', points: sternoOrigin },
    { structureId: 'muscle-pectoralis-major-abdominal', type: 'origin', extent: 'line', points: abdOrigin },
    { structureId: 'muscle-pectoralis-major-clavicular', type: 'insertion', extent: 'line', points: [H(15, 70), H(15, 100)] },
    { structureId: 'muscle-pectoralis-major-sternocostal', type: 'insertion', extent: 'line', points: [H(13, 46), H(13, 84)] },
    { structureId: 'muscle-pectoralis-major-abdominal', type: 'insertion', extent: 'line', points: [H(11, 34), H(11, 54)] },
    { structureId: 'muscle-pectoralis-minor', type: 'origin', extent: 'line', points: pmiOrigin },
    { structureId: 'muscle-pectoralis-minor', type: 'insertion', extent: 'line', points: pmiInsertion },
    { structureId: 'muscle-subclavius', type: 'origin', extent: 'line', points: subOrigin },
    { structureId: 'muscle-subclavius', type: 'insertion', extent: 'line', points: subInsertion }
  ],
  joints: [
    { structureId: 'joint-glenohumeral', at: H(0, 0) },
    { structureId: 'joint-sternoclavicular', at: W(390, 117) },
    { structureId: 'joint-acromioclavicular', at: W(296, 102) },
    { structureId: 'joint-elbow', at: H(0, 216) }
  ]
};
