import type { AnatomicalStructure, Muscle, Term } from '../../types';
import { pectoralisMajor } from './pectoralisMajor';
import { pectoralisMinor } from './pectoralisMinor';
import { subclavius } from './subclavius';
import { serratusAnterior } from './serratusAnterior';
import { trapezius } from './trapezius';
import { contextMuscles } from './contextMuscles';
import { bones } from '../bones/bones';
import { joints } from '../joints/joints';
import { nerves } from '../nerves/nerves';

/**
 * Tervezett (még nem elérhető) izmok. Csak a nevük szerepel – önálló oktatási
 * moduljuk a nagy mellizom prototípusa után készül el.
 */
export const planned = (id: string, name: Term, summary: string, extra: Partial<Muscle> = {}): Muscle => ({
  id,
  kind: 'muscle',
  status: 'planned',
  name,
  summary,
  regions: [],
  origin: [],
  insertion: [],
  innervation: [],
  nerveIds: [],
  functions: [],
  jointIds: [],
  roles: [],
  stabilization: [],
  notes: [],
  sourceIds: [],
  defaultViewId: 'anterior',
  motionIds: [],
  exerciseIds: [],
  ...extra
});

/** Felületes hátizmok, amelyek oktatási modulja még fejlesztés alatt áll (a nevük és az ábrán a helyük már szerepel). */
const levatorScapulae = planned(
  'muscle-levator-scapulae',
  { hu: 'Lapockaemelő izom', en: 'Levator scapulae', la: 'Musculus levator scapulae' },
  'A felső nyaki csigolyák harántnyúlványaitól a lapocka belső szélének felső részéig fut, a csuklyásizom alatt. Oktatási modulja később készül el.',
  { defaultViewId: 'posterior', sourceIds: ['grays-1918'] }
);
const rhomboids = planned(
  'muscle-rhomboids',
  { hu: 'Rombuszizmok', en: 'Rhomboids', la: 'Musculi rhomboidei' },
  'A kis és a nagy rombuszizom közös kártyája: az alsó nyaki és a felső háti tövisnyúlványoktól a lapocka belső széléig futnak, a csuklyásizom alatt. Oktatási moduljuk később készül el.',
  { defaultViewId: 'posterior', memberIds: ['muscle-rhomboid-minor', 'muscle-rhomboid-major'], sourceIds: ['grays-1918'] }
);
const latissimusDorsi = planned(
  'muscle-latissimus-dorsi',
  { hu: 'Széles hátizom', en: 'Latissimus dorsi', la: 'Musculus latissimus dorsi' },
  'Széles, lapos izom a hát alsó részén: a háti és ágyéki szakaszról a felkarcsontig fut. Oktatási modulja később készül el.',
  { defaultViewId: 'posterior', sourceIds: ['grays-1918'] }
);

export const muscles: Muscle[] = [
  pectoralisMajor,
  pectoralisMinor,
  subclavius,
  serratusAnterior,
  trapezius,
  levatorScapulae,
  rhomboids,
  latissimusDorsi
];

/**
 * A kezdőoldal szekciói. Új izomcsoport egy újabb elemmel vehető fel; a kártyák sorrendje a
 * `muscleIds` sorrendje.
 */
export interface MuscleSection {
  id: string;
  title: string;
  muscleIds: string[];
}

export const muscleSections: MuscleSection[] = [
  {
    id: 'superficial-chest',
    title: 'Felületes mellizmok',
    muscleIds: ['muscle-pectoralis-major', 'muscle-pectoralis-minor', 'muscle-subclavius', 'muscle-serratus-anterior']
  },
  {
    id: 'superficial-back',
    title: 'Felületes hátizmok',
    muscleIds: ['muscle-trapezius', 'muscle-levator-scapulae', 'muscle-rhomboids', 'muscle-latissimus-dorsi']
  }
];

export const muscleById = (id: string | undefined): Muscle | undefined => muscles.find((m) => m.id === id);

/** URL-barát rövid azonosítók. */
export const muscleSlugs: Record<string, string> = {
  'nagy-mellizom': 'muscle-pectoralis-major',
  'kis-mellizom': 'muscle-pectoralis-minor',
  'kulcscsont-alatti-izom': 'muscle-subclavius',
  'elulso-fureszizom': 'muscle-serratus-anterior',
  csuklyasizom: 'muscle-trapezius',
  'lapockaemelo-izom': 'muscle-levator-scapulae',
  rombuszizmok: 'muscle-rhomboids',
  'szeles-hatizom': 'muscle-latissimus-dorsi'
};
export const slugForMuscle = (id: string): string => Object.entries(muscleSlugs).find(([, v]) => v === id)?.[0] ?? id;
export const muscleBySlug = (slug: string | undefined): Muscle | undefined => (slug ? muscleById(muscleSlugs[slug]) : undefined);

/** Minden anatómiai struktúra egy közös névjegyzékben (feliratokhoz, szerepekhez). */
const registry: AnatomicalStructure[] = [
  ...muscles,
  ...muscles.flatMap((m) => m.regions),
  ...contextMuscles.filter((c) => !muscles.some((m) => m.id === c.id)),
  ...bones,
  ...bones.flatMap((b) => b.landmarks ?? []),
  ...joints,
  ...nerves
];

export const structureById = (id: string): AnatomicalStructure | undefined => registry.find((s) => s.id === id);
export const structureName = (id: string): Term => structureById(id)?.name ?? { hu: id, en: id };
export const allStructures = registry;

/**
 * Gyűjtő-azonosítók: a szerepkör-táblázatokban csoportként szereplő izmok, amelyek
 * az ábrán külön kontúrként jelennek meg (pl. a rotátorköpeny négy izma).
 */
export const structureGroups: Record<string, string[]> = {
  'muscle-rotator-cuff': ['muscle-supraspinatus', 'muscle-infraspinatus', 'muscle-teres-minor', 'muscle-subscapularis']
};
