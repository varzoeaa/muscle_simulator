import type { AnatomicalView, AnatomicalViewId, Pose, ViewGeometry } from '../../types';
import { anteriorView } from './anteriorView';
import { superiorView } from './superiorView';
import { lateralView } from './lateralView';
import { superiorArmAtSideView } from './superiorArmAtSideView';
import { anteriorClosedChainView, anteriorRespirationView, solveClosedChain } from './anteriorVariants';

export const views: AnatomicalView[] = [
  { id: 'anterior', atlas: true, name: { hu: 'Elülső nézet', en: 'Anterior view', la: 'Facies anterior' }, description: 'A mellkas és a váll elölről, anatómiai alaphelyzetben.' },
  { id: 'superior', atlas: true, name: { hu: 'Felülnézet', en: 'Superior view', la: 'Facies superior' }, description: 'A vállöv felülről; a vízszintes síkú mozgások torzításmentes nézete.' },
  { id: 'lateral', atlas: true, name: { hu: 'Oldalnézet', en: 'Lateral view', la: 'Facies lateralis' }, description: 'A test jobb oldala oldalról; a szagittális síkú mozgások (hajlítás, feszítés) torzításmentes nézete.' },
  {
    id: 'superior-arm-at-side',
    name: { hu: 'Felülnézet, kar a törzs mellett', en: 'Superior view, arm at side' },
    description: 'A lógó felkart a hossztengelye mentén látjuk, így a forgatás a vízszintes síkban követhető.'
  },
  { id: 'anterior-closed-chain', name: { hu: 'Elülső nézet, rögzített kézzel', en: 'Anterior view, fixed hand' }, description: 'Zárt kinetikai lánc: a kéz rögzített, a törzs mozog.' },
  { id: 'anterior-respiration', name: { hu: 'Elülső nézet, rögzített felkarral', en: 'Anterior view, fixed arm' }, description: 'A mellkas mozgása rögzített felkar mellett.' },
  { id: 'lateral-bench', name: { hu: 'Oldalnézet (fekvenyomás)', en: 'Lateral view (bench press)' }, description: 'A gyakorlat szagittális síkú vetülete.' }
];

export const viewGeometries: Partial<Record<AnatomicalViewId, ViewGeometry>> = {
  anterior: anteriorView,
  superior: superiorView,
  lateral: lateralView,
  'superior-arm-at-side': superiorArmAtSideView,
  'anterior-closed-chain': anteriorClosedChainView,
  'anterior-respiration': anteriorRespirationView
};

/** Az egyes nézetek alaphelyzete (pl. Anatomy Lab statikus megjelenítéséhez). */
export const restPoses: Record<AnatomicalViewId, Pose> = {
  anterior: { shoulderAbduction: 12 },
  superior: { shoulderHorizontalAbduction: 60 },
  lateral: { shoulderFlexion: 0 },
  'superior-arm-at-side': { shoulderInternalRotation: 0 },
  'anterior-closed-chain': solveClosedChain({ lift: 0.4 }),
  'anterior-respiration': { shoulderAbduction: 30, ribLift: 0 },
  'lateral-bench': {}
};

export const viewById = (id: AnatomicalViewId) => views.find((v) => v.id === id);
