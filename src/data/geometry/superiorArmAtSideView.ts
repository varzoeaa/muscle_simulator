import type { FramedPoint, ViewGeometry } from '../../types';
import { fan } from '../../utils/geometry';
import { superiorView } from './superiorView';

/**
 * FELÜLNÉZET, KAR A TÖRZS MELLETT – a vállízületi befelé és kifelé forgatás nézete.
 * A felkar függőlegesen lóg, így felülről a hossztengelye mentén látjuk: a forgatás
 * a vízszintes síkban, torzítás nélkül látszik. A könyök 90°-ban hajlított, az alkar
 * előre mutat, és a forgatást „mutatóként” jelzi.
 *
 * A felkarcsont (H) rendszere: origó a felkarcsontfej középpontja, +y elölre (az alkar
 * iránya alaphelyzetben), −x laterálisan. A nagy gumó taraja (a nagy mellizom tapadása)
 * elöl-kívül, a kis gumó (a lapocka alatti izom tapadása) elöl-belül, a nagy gumó hátsó
 * része (a tövis alatti izom tapadása) hátul-kívül helyezkedik el.
 * Saját szerkesztésű, egyszerűsített oktatási ábra (lásd: MODEL_LIMITATIONS.md).
 */
const W = (x: number, y: number): FramedPoint => ({ frame: 'world', x, y });
const H = (x: number, y: number): FramedPoint => ({ frame: 'humerus', x, y });

const clavOrigin = [W(287, 362), W(258, 361), W(232, 351)];
const clavInsertion = [H(-6, 26), H(-13, 23)];
const sternoOrigin = [W(300, 383), W(268, 386), W(238, 375)];
const sternoInsertion = [H(-10, 25), H(-18, 19)];

const contextBones = superiorView.bones.filter((b) => ['bone-ribs', 'bone-vertebral-column', 'bone-sternum', 'bone-scapula', 'bone-clavicle'].includes(b.structureId));

export const superiorArmAtSideView: ViewGeometry = {
  viewId: 'superior-arm-at-side',
  viewBox: [-110, 80, 820, 450],
  focusViewBox: [-40, 100, 680, 400],
  mirrorContext: true,
  orientation: superiorView.orientation,
  frames: [
    { id: 'humerus', parent: 'world', pivot: { x: 112, y: 252 }, angleKey: 'shoulderInternalRotation', angleScale: -1 },
    { id: 'forearm', parent: 'humerus', pivot: { x: 0, y: 0 } }
  ],
  bones: [
    { structureId: 'bone-ulna', frame: 'forearm', d: 'M-17,6 L-12,206 L-2,208 L-5,8 Z' },
    { structureId: 'bone-radius', frame: 'forearm', d: 'M2,8 L1,226 L14,226 L18,6 Z' },
    ...contextBones,
    {
      structureId: 'bone-humerus',
      frame: 'humerus',
      d: 'M-26,0 A26,26 0 0,1 26,0 A26,26 0 0,1 5,25.5 L1.5,19 L-1.5,19 L-5,25.5 A26,26 0 0,1 -26,0 Z'
    }
  ],
  muscles: [
    {
      structureId: 'muscle-serratus-anterior',
      layer: 'superficial-muscles',
      z: 1,
      outline: [W(240, 177), W(186, 214), W(155, 262), W(158, 302), W(168, 300), W(168, 262), W(198, 222), W(246, 186)],
      fibers: fan([W(240, 180), W(200, 210)], [W(160, 300), W(158, 268)], 4)
    },
    {
      structureId: 'muscle-subscapularis',
      layer: 'superficial-muscles',
      z: 2,
      outline: [W(238, 178), W(192, 210), W(150, 246), H(8, 24), H(18, 18), W(146, 232), W(186, 202), W(236, 168)],
      fibers: fan([W(236, 174), W(190, 206), W(152, 240)], [H(13, 21), H(13, 21), H(13, 21)], 4),
      label: { at: W(206, 206), text: 'Lapocka alatti izom' }
    },
    {
      structureId: 'muscle-infraspinatus',
      layer: 'superficial-muscles',
      z: 3,
      outline: [W(236, 160), W(246, 168), W(160, 224), H(-24, -6), H(-16, -20), W(150, 212)],
      fibers: fan([W(238, 164), W(200, 188)], [H(-20, -13), H(-20, -13)], 4),
      label: { at: W(196, 176), text: 'Tövis alatti izom' }
    },
    {
      structureId: 'muscle-pectoralis-major-sternocostal',
      layer: 'superficial-muscles',
      z: 10,
      outline: [W(302, 391), W(266, 395), W(234, 385), W(186, 344), H(-2, 34), H(-12, 30), H(-20, 22), W(176, 326), W(230, 362), W(268, 374), W(300, 378)],
      fibers: fan(sternoOrigin, sternoInsertion, 7),
      label: { at: W(262, 400), text: 'Szegycsonti-bordai rész' }
    },
    {
      structureId: 'muscle-pectoralis-major-clavicular',
      layer: 'superficial-muscles',
      z: 11,
      outline: [W(289, 369), W(258, 369), W(226, 358), W(180, 318), H(0, 32), H(-8, 30), H(-16, 24), W(168, 300), W(214, 338), W(256, 352), W(288, 357)],
      fibers: fan(clavOrigin, clavInsertion, 6),
      label: { at: W(250, 360), text: 'Kulcscsonti rész' }
    }
  ],
  attachments: [
    { structureId: 'muscle-pectoralis-major-clavicular', type: 'origin', extent: 'line', points: clavOrigin },
    { structureId: 'muscle-pectoralis-major-sternocostal', type: 'origin', extent: 'line', points: sternoOrigin },
    { structureId: 'muscle-pectoralis-major', type: 'insertion', extent: 'line', points: [H(-5, 25.5), H(-17, 20)] }
  ],
  joints: [
    { structureId: 'joint-glenohumeral', at: H(0, 0) },
    { structureId: 'joint-sternoclavicular', at: W(288, 362) },
    { structureId: 'joint-acromioclavicular', at: W(150, 248) }
  ]
};
