import type { AnatomicalStructure, Muscle, Term } from '../../types';
import { pectoralisMajor } from './pectoralisMajor';
import { pectoralisMinor } from './pectoralisMinor';
import { subclavius } from './subclavius';
import { contextMuscles } from './contextMuscles';
import { bones } from '../bones/bones';
import { joints } from '../joints/joints';
import { nerves } from '../nerves/nerves';

/**
 * Tervezett (még nem elérhető) izmok. Csak a nevük szerepel – önálló oktatási
 * moduljuk a nagy mellizom prototípusa után készül el.
 */
const planned = (id: string, name: Term, summary: string): Muscle => ({
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
  exerciseIds: []
});

export const muscles: Muscle[] = [
  pectoralisMajor,
  pectoralisMinor,
  subclavius,
  planned('muscle-serratus-anterior', { hu: 'Elülső fűrészizom', en: 'Serratus anterior', la: 'Musculus serratus anterior' }, 'A mellkas oldalfalán fekvő, fűrészfogszerű eredésű izom; a lapocka belső széléhez tapad.')
];

export const muscleById = (id: string | undefined): Muscle | undefined => muscles.find((m) => m.id === id);

/** URL-barát rövid azonosítók. */
export const muscleSlugs: Record<string, string> = {
  'nagy-mellizom': 'muscle-pectoralis-major',
  'kis-mellizom': 'muscle-pectoralis-minor',
  'kulcscsont-alatti-izom': 'muscle-subclavius',
  'elulso-fureszizom': 'muscle-serratus-anterior'
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
