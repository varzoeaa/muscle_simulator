import type { FramedPoint, ViewGeometry } from '../../types';
import { fan } from '../../utils/geometry';

/**
 * FELÜLNÉZET – a vállöv vízszintes metszetszerű, felülről látott sémája.
 * A horizontális közelítés a vízszintes síkban zajlik, ezért ez a nézet mutatja
 * torzítás nélkül. Felül: hátulsó (dorzális) oldal; alul: elülső (ventrális) oldal.
 * Saját szerkesztésű, egyszerűsített oktatási ábra (lásd: MODEL_LIMITATIONS.md).
 *
 * A felkarcsont helyi +x iránya a csont elülső felszíne felé mutat: horizontális
 * közelítés közben a csont a függőleges tengely körül fordul, így a nagy mellizom
 * tapadása mindvégig az elülső felszínen marad.
 */
const W = (x: number, y: number): FramedPoint => ({ frame: 'world', x, y });
const H = (x: number, y: number): FramedPoint => ({ frame: 'humerus', x, y });
const F = (x: number, y: number): FramedPoint => ({ frame: 'forearm', x, y });

const clavOrigin = [W(287, 362), W(258, 361), W(232, 351)];
const clavInsertion = [H(13, 100), H(13, 66)];
const sternoOrigin = [W(300, 383), W(268, 386), W(238, 375)];
const sternoInsertion = [H(12, 86), H(12, 44)];

export const superiorView: ViewGeometry = {
  viewId: 'superior',
  viewBox: [-110, 80, 820, 450],
  focusViewBox: [-40, 100, 680, 400],
  mirrorContext: true,
  orientation: { top: 'Hátulsó (dorzális)', bottom: 'Elülső (ventrális)', left: 'A test jobb oldala (laterális)', right: 'Középvonal / bal oldal' },
  frames: [
    { id: 'humerus', parent: 'world', pivot: { x: 112, y: 252 }, angleKey: 'shoulderHorizontalAbduction' },
    { id: 'forearm', parent: 'humerus', pivot: { x: 0, y: 216 } }
  ],
  bones: [
    { structureId: 'bone-ribs', frame: 'world', stroke: 9, d: 'M150,265 C150,205 215,160 300,160' },
    { structureId: 'bone-ribs', frame: 'world', stroke: 9, d: 'M150,265 C150,325 215,370 288,371' },
    { structureId: 'bone-vertebral-column', frame: 'world', d: 'M282,182 a18,18 0 1,0 36,0 a18,18 0 1,0 -36,0 Z M296,164 L304,164 L302,132 L298,132 Z M282,170 L262,160 L264,154 L286,164 Z' },
    { structureId: 'bone-sternum', frame: 'world', d: 'M286,364 Q300,371 314,364 L314,380 Q300,386 286,380 Z' },
    { structureId: 'bone-scapula', frame: 'world', d: 'M124,240 L134,232 L240,164 L247,173 L138,258 Z M150,228 L232,172 L237,179 L156,238 Z M118,228 Q134,218 158,226 L158,241 Q136,244 118,237 Z M140,254 Q152,264 162,290 L153,294 Q141,270 132,260 Z' },
    { structureId: 'bone-clavicle', frame: 'world', stroke: 11, d: 'M288,362 C258,362 228,350 205,325 C186,302 166,270 150,248' },
    {
      structureId: 'bone-humerus',
      frame: 'humerus',
      d: 'M-2,-21 C20,-25 30,-6 26,10 C22,22 14,28 12,40 L10,190 C12,200 22,205 22,216 L-22,216 C-24,206 -14,198 -12,188 L-14,40 C-21,27 -27,12 -25,-2 C-23,-14 -14,-21 -2,-21 Z'
    },
    { structureId: 'bone-radius', frame: 'forearm', d: 'M2,8 L1,198 L12,198 L19,2 Z' },
    { structureId: 'bone-ulna', frame: 'forearm', d: 'M-20,4 L-14,196 L-4,198 L-6,8 Z' }
  ],
  muscles: [
    {
      structureId: 'muscle-serratus-anterior',
      layer: 'superficial-muscles',
      z: 1,
      outline: [W(240, 177), W(186, 214), W(155, 262), W(158, 302), W(168, 300), W(168, 262), W(198, 222), W(246, 186)],
      fibers: fan([W(240, 180), W(200, 210)], [W(160, 300), W(158, 268)], 4),
      label: { at: W(178, 250), text: 'Elülső fűrészizom' }
    },
    {
      structureId: 'muscle-infraspinatus',
      layer: 'superficial-muscles',
      z: 2,
      outline: [W(236, 160), W(246, 168), W(160, 222), H(-20, 4), H(-18, -12), W(150, 214)],
      fibers: fan([W(238, 164), W(200, 188)], [H(-19, -6), H(-19, 0)], 4)
    },
    {
      // Kis görgetegizom: a lapocka oldalsó szélétől a nagy gumó hátsó-alsó részéig, a tövis alatti izom mellett.
      structureId: 'muscle-teres-minor',
      layer: 'superficial-muscles',
      z: 2.5,
      outline: [W(150, 214), W(160, 222), H(-21, 18), H(-20, 4)],
      fibers: fan([W(152, 216)], [H(-20, 10)], 1),
      label: { at: W(128, 206), text: 'Kis görgetegizom' }
    },
    {
      structureId: 'muscle-coracobrachialis',
      layer: 'superficial-muscles',
      z: 3,
      outline: [W(158, 290), H(15, 120), H(8, 120), W(150, 284)],
      fibers: fan([W(155, 288)], [H(12, 118)], 1)
    },
    {
      structureId: 'muscle-biceps-brachii',
      layer: 'superficial-muscles',
      z: 4,
      outline: [W(158, 292), H(10, 34), H(19, 120), H(15, 204), F(6, 40), F(0, 40), H(6, 200), H(4, 70), H(2, 10)],
      fibers: fan([W(156, 292), H(4, 20)], [F(2, 36), F(4, 36)], 3),
      label: { at: H(12, 160), text: 'Kétfejű karizom' }
    },
    {
      structureId: 'muscle-pectoralis-major-sternocostal',
      layer: 'superficial-muscles',
      z: 10,
      outline: [W(302, 391), W(266, 395), W(234, 385), H(26, 90), H(8, 42), W(230, 362), W(268, 374), W(300, 378)],
      fibers: fan(sternoOrigin, sternoInsertion, 8),
      label: { at: W(262, 398), text: 'Szegycsonti-bordai rész' }
    },
    {
      structureId: 'muscle-pectoralis-major-clavicular',
      layer: 'superficial-muscles',
      z: 11,
      outline: [W(289, 369), W(258, 369), W(226, 358), H(22, 102), H(8, 64), W(220, 341), W(256, 352), W(288, 357)],
      fibers: fan(clavOrigin, clavInsertion, 6),
      label: { at: W(250, 360), text: 'Kulcscsonti rész' }
    },
    {
      structureId: 'muscle-deltoid-posterior',
      layer: 'superficial-muscles',
      z: 12,
      outline: [W(154, 230), W(206, 194), W(214, 204), H(-18, 40), H(-8, 118), H(-14, 118), H(-24, 28)],
      fibers: fan([W(160, 228), W(205, 198)], [H(-12, 116), H(-12, 112)], 4),
      label: { at: W(196, 214), text: 'Deltaizom hátsó rész' }
    },
    {
      structureId: 'muscle-deltoid-middle',
      layer: 'superficial-muscles',
      z: 13,
      outline: [W(156, 244), W(120, 236), H(-14, 10), H(-6, 118), H(2, 118), H(10, 10)],
      fibers: fan([W(150, 242), W(124, 236)], [H(-2, 116), H(0, 116)], 3)
    },
    {
      structureId: 'muscle-deltoid-anterior',
      layer: 'superficial-muscles',
      z: 14,
      outline: [W(212, 336), W(184, 300), W(160, 264), H(8, 18), H(4, 118), H(12, 118), H(20, 40)],
      fibers: fan([W(206, 330), W(180, 296), W(162, 266)], [H(8, 116), H(8, 112)], 4),
      label: { at: W(182, 316), text: 'Deltaizom elülső rész' }
    }
  ],
  attachments: [
    { structureId: 'muscle-pectoralis-major-clavicular', type: 'origin', extent: 'line', points: clavOrigin },
    { structureId: 'muscle-pectoralis-major-sternocostal', type: 'origin', extent: 'line', points: sternoOrigin },
    { structureId: 'muscle-pectoralis-major-clavicular', type: 'insertion', extent: 'line', points: [H(15, 70), H(15, 100)] },
    { structureId: 'muscle-pectoralis-major-sternocostal', type: 'insertion', extent: 'line', points: [H(11, 46), H(11, 84)] }
  ],
  joints: [
    { structureId: 'joint-glenohumeral', at: H(0, 0) },
    { structureId: 'joint-sternoclavicular', at: W(288, 362) },
    { structureId: 'joint-acromioclavicular', at: W(150, 248) },
    { structureId: 'joint-elbow', at: H(0, 216) }
  ]
};
