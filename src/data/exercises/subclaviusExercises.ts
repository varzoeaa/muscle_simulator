import type { DisplayRoleType, EvidenceLevel, Exercise, ExercisePhaseRole, LengthChange } from '../../types';

/**
 * A kulcscsont alatti izmot érintő gyakorlatok. Kifejezetten erre az izomra épülő edzőtermi
 * gyakorlat nincs; ezekben a gyakorlatokban a szerepe a forrásokban leírt működéséből
 * (a kulcscsont és a vállöv süllyesztése, a kulcscsont rögzítése – StatPearls, OpenStax, Moore)
 * és a vállöv-mozgások szerepeiből (Neumann 2017) következik. A lapocka-süllyesztés támaszban
 * gyakorlat a kis mellizommal közös (lásd: pectoralisMinorExercises).
 */
const S = 'muscle-subclavius';
const KIN = ['neumann-kinesiology'];
const KIN_TECH = ['neumann-kinesiology', 'nsca-essentials'];
const TECH = ['nsca-essentials'];
const SUB = ['statpearls-pectoral', 'openstax-ap2e', 'moore-coa'];
/** A vállöv környéke elölnézetben, mindkét oldalon. */
const BOX_GIRDLE: [number, number, number, number] = [70, 20, 460, 300];

const role = (r: DisplayRoleType, joint: string, structureIds: string[], lengthChange: LengthChange, evidence: EvidenceLevel, sourceIds: string[], note?: string): ExercisePhaseRole => ({
  role: r,
  joint,
  structureIds,
  lengthChange,
  evidence,
  sourceIds,
  ...(note ? { note } : {})
});
const opposite = (c: LengthChange): LengthChange => (c === 'shortening' ? 'lengthening' : c === 'lengthening' ? 'shortening' : 'constant');

/* ------------------------------------------------------------------ */
/* 1. Lapocka-lehúzás csigán, nyújtott karral                          */
/* ------------------------------------------------------------------ */

/** @param c a süllyesztők hosszváltozása */
const pulldownRoles = (c: LengthChange): ExercisePhaseRole[] => {
  const brake = c === 'lengthening';
  return [
    role('agonist', brake ? 'Vállöv – az emelkedés fékezése' : 'Vállöv – süllyesztés', ['muscle-pectoralis-minor', 'muscle-trapezius', 'muscle-latissimus-dorsi'], c, brake ? 'educational-model' : 'anatomical-fact', KIN, 'A csuklyásizomnak az alsó része süllyeszt; a széles hátizom a felkarcsonton keresztül húzza lefelé a vállövet.'),
    role('synergist', 'Kulcscsont – süllyesztés és rögzítés', [S], c, 'anatomical-fact', [...SUB, 'neumann-kinesiology'], 'A kulcscsontot az 1. borda felé húzza, így a vállöv süllyesztését segíti.'),
    role('antagonist', 'Vállöv – emelők', ['muscle-levator-scapulae', 'muscle-rhomboids'], opposite(c), brake ? 'educational-model' : 'anatomical-fact', KIN, brake ? 'Az emelkedést a kábel húzása hozza létre, nem ezek az izmok.' : 'A csuklyásizom felső része is a vállöv emelője.'),
    role('stabilizer', 'Könyök és vállízület – a nyújtott, fej fölé emelt kar megtartása', ['muscle-triceps-brachii', 'muscle-rotator-cuff'], 'constant', 'educational-model', KIN_TECH, 'A könyök nyújtott, a vállízület szöge nem változik: a mozgás csak a vállövben történik.')
  ];
};

export const scapularPulldown: Exercise = {
  id: 'scapular-pulldown',
  name: { hu: 'Lapocka-lehúzás csigán, nyújtott karral', en: 'Straight-arm scapular pulldown (scap pulldown)' },
  muscleIds: [S],
  status: 'available',
  animation: {
    kind: 'girdle',
    viewId: 'anterior-girdle',
    startPose: { clavicleElevation: -6, scapularUpwardRotation: 20, shoulderAbduction: 140 },
    endPose: { clavicleElevation: 16, scapularUpwardRotation: 28, shoulderAbduction: 140 },
    viewBox: [-120, -260, 700, 560],
    viewNote:
      'Elölnézet: a karok a fej fölött, a rudat a felső csiga húzza. A könyök és a vállízület szöge nem változik; a vállöv emelkedik (a kábel húzza fel), majd a süllyesztők lehúzzák – a kar a vállövvel együtt mozog.'
  },
  romText: 'a vállak az út {rom}%-áig emelkednek vissza',
  startPosition: [
    'Ülés a lehúzógépnél vagy térdelés a felső csiga alatt; a rúd vállszélesnél szélesebb fogással a kézben, a karok nyújtva a fej fölött.',
    'A vállöv kiinduláskor felhúzott helyzetben (a kábel felfelé húzza).'
  ],
  execution: [
    'Lehúzás: a könyök nyújtott marad, csak a vállak lehúzásával a rúd néhány centimétert ereszkedik.',
    'Rövid megtartás lent, „a vállak a zsebben”.',
    'Visszaengedés: a vállak kontrolláltan emelkednek vissza, amíg a kábel a felső helyzetbe húzza őket.'
  ],
  primaryMovers: ['muscle-pectoralis-minor', 'muscle-trapezius', 'muscle-latissimus-dorsi'],
  secondaryMovers: [S],
  stabilizers: ['muscle-triceps-brachii', 'muscle-rotator-cuff'],
  commonMistakes: [
    'A könyök hajlítása – a gyakorlat lehúzásba vált át.',
    'Hátradőlés és lendítés a törzzsel.',
    'A vállak kontroll nélkül „ugranak” vissza a fül mellé.',
    'Túl nagy súly, amellyel a vállöv nem tud lefelé mozdulni.'
  ],
  phases: [
    { type: 'concentric', name: 'Koncentrikus szakasz – a vállak lehúzása', from: 0, to: 0.4, description: 'A süllyesztők rövidülve lehúzzák a vállövet; a kulcscsont alatti izom a kulcscsontot süllyeszti.' },
    { type: 'isometric', name: 'Izometriás szakasz – megtartás lent', from: 0.4, to: 0.55, description: 'A vállöv lent; a süllyesztők aktívak, a helyzet közel változatlan.' },
    { type: 'eccentric', name: 'Excentrikus szakasz – visszaengedés', from: 0.55, to: 1, description: 'A kábel felfelé húzza a vállövet; a süllyesztők hosszabbodva fékeznek.' }
  ],
  phaseRoles: {
    concentric: pulldownRoles('shortening'),
    eccentric: pulldownRoles('lengthening')
  },
  anatomyExplanation: [
    { text: 'A kulcscsont alatti izom a kulcscsontot és a vállövet süllyeszti, és a kulcscsontot rögzíti.', evidence: 'anatomical-fact', sourceIds: SUB },
    { text: 'A vállöv süllyesztésének fő mozgatói a kis mellizom, a csuklyásizom alsó része és a széles hátizom; a kulcscsont alatti izom szinergista.', evidence: 'anatomical-fact', sourceIds: KIN },
    { text: 'Nyitott láncú gyakorlat: a törzs rögzített, a vállöv mozog a kábel ellenállásával szemben.', evidence: 'educational-model', sourceIds: KIN }
  ],
  coachingNotes: [
    { text: 'Képzeld el, hogy a vállaidat „a zsebedbe teszed”, miközben a karod nyújtva marad.', evidence: 'educational-model', sourceIds: TECH },
    { text: 'Kis súllyal kezdd; a mozgástartomány csak néhány centiméter.', evidence: 'educational-model', sourceIds: TECH }
  ],
  parameters: {
    rangeOfMotion: { min: 0.3, max: 1, default: 1 },
    load: { min: 5, max: 80, default: 20, step: 5, mode: 'stack', implementKg: 0, implementName: 'súlyoszlop' }
  },
  cycleDurationMs: 3200,
  sourceIds: ['statpearls-pectoral', 'openstax-ap2e', 'moore-coa', 'neumann-kinesiology', 'nsca-essentials']
};

/* ------------------------------------------------------------------ */
/* 2. Vállvonogatás (a kulcscsont alatti izom antagonistaként)         */
/* ------------------------------------------------------------------ */

/** @param c az emelők hosszváltozása */
const shrugRoles = (c: LengthChange): ExercisePhaseRole[] => {
  const brake = c === 'lengthening';
  return [
    role('agonist', brake ? 'Vállöv – a süllyedés fékezése' : 'Vállöv – emelés', ['muscle-trapezius', 'muscle-levator-scapulae'], c, brake ? 'educational-model' : 'anatomical-fact', KIN, brake ? 'Leengedéskor ugyanazok az emelők dolgoznak, hosszabbodva fékezik a súlyt.' : 'A csuklyásizomnak a felső része emel.'),
    role('synergist', 'Lapocka – az emelés segítése', ['muscle-rhomboids'], c, 'educational-model', KIN),
    role('antagonist', 'Vállöv és kulcscsont – süllyesztők', [S, 'muscle-pectoralis-minor'], opposite(c), brake ? 'educational-model' : 'anatomical-fact', [...KIN, 'statpearls-pectoral'], brake ? 'A süllyedést a súly hozza létre, nem a süllyesztők: hosszuk csökken, de nem ők mozgatnak.' : 'A kulcscsont emelkedésekor a kulcscsont alatti izom eredése (1. borda) és tapadása (kulcscsont) távolodik: hosszabbodik.'),
    role('stabilizer', 'Vállízület és könyök – a lógó kar megtartása', ['muscle-rotator-cuff'], 'constant', 'educational-model', KIN_TECH, 'A súly a kart lefelé húzza; a rotátorköpeny a felkarcsontfejet az ízületi árokban tartja.')
  ];
};

export const shoulderShrug: Exercise = {
  id: 'shoulder-shrug',
  name: { hu: 'Vállvonogatás kézisúlyzóval', en: 'Dumbbell shoulder shrug' },
  muscleIds: [S],
  status: 'available',
  animation: {
    kind: 'girdle',
    viewId: 'anterior-girdle',
    // A 0. mélység a felhúzott váll (az emelők legrövidebb helyzete), az 1. az alaphelyzet.
    startPose: { clavicleElevation: 18, scapularUpwardRotation: 0, shoulderAbduction: 6 },
    endPose: { clavicleElevation: 0, scapularUpwardRotation: 0, shoulderAbduction: 6 },
    viewBox: BOX_GIRDLE,
    viewNote:
      'Elölnézet: a karok lógnak, a súlyzó a kézben. A vállöv a fül felé emelkedik, majd kontrolláltan visszasüllyed. Az emelők a csuklyásizom felső része és a lapockaemelő izom; a kulcscsont alatti izom antagonista, emeléskor hosszabbodik.'
  },
  romText: 'a vállak az út {rom}%-áig süllyednek vissza',
  startPosition: ['Állás, a súlyzók a test mellett, nyújtott karral; a fej és a nyak egyenes.', 'A vállak laza, alaphelyzetben.'],
  execution: [
    'Emelés: a vállak egyenesen a fül felé emelkednek; a könyök nyújtott marad, a kar nem hajlik.',
    'Rövid megtartás felül.',
    'Leengedés: a vállak kontrolláltan visszasüllyednek az alaphelyzetbe.'
  ],
  primaryMovers: ['muscle-trapezius', 'muscle-levator-scapulae'],
  secondaryMovers: ['muscle-rhomboids'],
  stabilizers: ['muscle-rotator-cuff'],
  commonMistakes: ['A vállak körkörös forgatása emelés közben.', 'A könyök hajlítása – a karok húzzák a súlyt.', 'A fej előrebillentése.', 'A súly „leejtése” leengedéskor.'],
  phases: [
    { type: 'concentric', name: 'Koncentrikus szakasz – a vállak emelése', from: 0, to: 0.4, description: 'Az emelők rövidülnek; a kulcscsont alatti izom (antagonista) hosszabbodik.' },
    { type: 'isometric', name: 'Izometriás szakasz – megtartás felül', from: 0.4, to: 0.55, description: 'A vállak felül; az emelők aktívak, a helyzet közel változatlan.' },
    { type: 'eccentric', name: 'Excentrikus szakasz – leengedés', from: 0.55, to: 1, description: 'A súly lefelé húzza a vállövet; az emelők hosszabbodva fékeznek, a kulcscsont alatti izom rövidül.' }
  ],
  phaseRoles: {
    concentric: shrugRoles('shortening'),
    eccentric: shrugRoles('lengthening')
  },
  anatomyExplanation: [
    { text: 'A vállöv emelői a csuklyásizom felső része és a lapockaemelő izom; a süllyesztők – köztük a kulcscsont alatti izom – ebben a mozgásban antagonisták.', evidence: 'anatomical-fact', sourceIds: KIN },
    { text: 'A kulcscsont alatti izom az 1. bordától a kulcscsontig fut, ezért a kulcscsont emelkedésekor hosszabbodik, süllyesztésekor rövidül.', evidence: 'anatomical-fact', sourceIds: SUB },
    { text: 'A gyakorlat azt mutatja be, hogy ugyanaz az izom egy másik mozgásban antagonista lehet: a szerep mindig a mozgáshoz kötött.', evidence: 'educational-model', sourceIds: KIN }
  ],
  coachingNotes: [
    { text: 'Emeld a vállakat egyenesen felfelé, ne körözz velük.', evidence: 'educational-model', sourceIds: TECH },
    { text: 'A leengedés legyen lassabb, mint az emelés.', evidence: 'educational-model', sourceIds: TECH }
  ],
  parameters: {
    rangeOfMotion: { min: 0.3, max: 1, default: 1 },
    load: { min: 4, max: 50, default: 16, step: 2, mode: 'per-hand', implementKg: 0, implementName: 'kézisúlyzó' }
  },
  cycleDurationMs: 3200,
  sourceIds: ['neumann-kinesiology', 'statpearls-pectoral', 'openstax-ap2e', 'moore-coa', 'nsca-essentials']
};

export const subclaviusExercises: Exercise[] = [scapularPulldown, shoulderShrug];
