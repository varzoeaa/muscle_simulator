import type { AnatomicalView, AnatomicalViewId, Pose, ViewGeometry } from '../../types';
import { anteriorView } from './anteriorView';
import { superiorView } from './superiorView';

export const views: AnatomicalView[] = [
  { id: 'anterior', name: { hu: 'Elülső nézet', en: 'Anterior view', la: 'Facies anterior' }, description: 'A mellkas és a váll elölről, anatómiai alaphelyzetben.' },
  { id: 'superior', name: { hu: 'Felülnézet', en: 'Superior view', la: 'Facies superior' }, description: 'A vállöv felülről; a vízszintes síkú mozgások torzításmentes nézete.' },
  { id: 'lateral-bench', name: { hu: 'Oldalnézet (fekvenyomás)', en: 'Lateral view (bench press)' }, description: 'A gyakorlat szagittális síkú vetülete.' }
];

export const viewGeometries: Partial<Record<AnatomicalViewId, ViewGeometry>> = {
  anterior: anteriorView,
  superior: superiorView
};

/** Az egyes nézetek alaphelyzete (pl. Anatomy Lab statikus megjelenítéséhez). */
export const restPoses: Record<AnatomicalViewId, Pose> = {
  anterior: { shoulderAbduction: 12 },
  superior: { shoulderHorizontalAbduction: 60 },
  'lateral-bench': {}
};

export const viewById = (id: AnatomicalViewId) => views.find((v) => v.id === id);
