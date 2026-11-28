import type { DisplayRoleType, EvidenceLevel, Exercise, ExercisePhaseRole, LengthChange } from '../../types';

/**
 * Az elülső fűrészizom gyakorlatai: fekvő serratus-nyomás (protrakció kézisúlyzóval) és
 * karemelés a lapocka síkjában fej fölé (felfelé rotáció). A fekvőtámasz plusz a kis
 * mellizommal közös (pectoralisMinorExercises). Az ízületi működések és a szerepek Neumann
 * (2017) és a StatPearls leírását követik; az EMG-eredmények (Decker 1999, Ekstrom 2003,
 * Castelein 2016) az ellenőrzött absztraktok alapján, csak minőségileg szerepelnek.
 */
const SA = 'muscle-serratus-anterior';
const KIN = ['neumann-kinesiology'];
const KIN_TECH = ['neumann-kinesiology', 'nsca-essentials'];
const TECH = ['nsca-essentials'];

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
/* 1. Fekvő serratus-nyomás (serratus punch) kézisúlyzóval             */
/* ------------------------------------------------------------------ */

/** @param c a protraktorok (elülső fűrészizom, kis mellizom) hosszváltozása */
const punchRoles = (c: LengthChange): ExercisePhaseRole[] => {
  const brake = c === 'lengthening';
  return [
    role('agonist', brake ? 'Lapocka – a retrakció fékezése' : 'Lapocka – protrakció', [SA], c, brake ? 'educational-model' : 'anatomical-fact', ['statpearls-serratus', ...KIN], 'A protrakció fő mozgatója.'),
    role('synergist', brake ? 'Lapocka – a retrakció fékezésének segítése' : 'Lapocka – a protrakció segítése', ['muscle-pectoralis-minor'], c, 'anatomical-fact', KIN),
    role('antagonist', 'Lapocka – retraktorok', ['muscle-rhomboids', 'muscle-trapezius'], opposite(c), brake ? 'educational-model' : 'anatomical-fact', KIN, brake ? 'A leengedést a súlyzó hozza létre; a retraktorok rövidülnek, de nem ők mozgatnak.' : 'A csuklyásizomnak főként a középső része retraktor.'),
    role('stabilizer', 'Könyök és vállízület – a függőleges, nyújtott kar megtartása', ['muscle-triceps-brachii', 'muscle-rotator-cuff', 'muscle-deltoid-anterior'], 'constant', 'educational-model', KIN_TECH, 'A könyök nyújtott, a kar függőleges: a mozgás csak a vállövben történik.')
  ];
};

export const serratusPunch: Exercise = {
  id: 'serratus-punch',
  name: { hu: 'Fekvő serratus-nyomás kézisúlyzóval (serratus punch)', en: 'Supine serratus punch with dumbbells' },
  muscleIds: [SA],
  status: 'available',
  animation: {
    kind: 'girdle',
    viewId: 'superior-girdle',
    startPose: { scapularProtraction: 16, shoulderHorizontalAbduction: 12 },
    endPose: { scapularProtraction: -8, shoulderHorizontalAbduction: 12 },
    viewNote:
      'Fekvő helyzet, a törzs vízszintes metszete (a fej felől nézve): a nyújtott karok a mennyezet felé mutatnak. Csak a lapocka mozog: a súlyzó emelésekor előre csúszik a mellkasfalon (protrakció), leengedéskor hátra, a pad felé (retrakció).'
  },
  romText: 'a lapockák az út {rom}%-áig engednek vissza a pad felé',
  startPosition: [
    'Hanyattfekvés padon vagy a talajon; kézisúlyzó mindkét kézben, a karok nyújtva, függőlegesen a váll fölött.',
    'A könyök végig nyújtott; a vállak lent, a nyak laza.'
  ],
  execution: [
    'Leengedés: a könyök nyújtott marad, a súlyzó néhány centimétert ereszkedik, ahogy a lapockák hátracsúsznak a pad felé.',
    'Nyomás („ütés”): a súlyzót egyenesen a mennyezet felé toljuk úgy, hogy a lapocka előrecsúszik a mellkasfalon – a váll elemelkedik a padtól.',
    'A mozgástartomány kicsi; a könyök nem hajlik, a vállak nem húzódnak a fül felé.'
  ],
  primaryMovers: [SA],
  secondaryMovers: ['muscle-pectoralis-minor'],
  stabilizers: ['muscle-triceps-brachii', 'muscle-rotator-cuff', 'muscle-deltoid-anterior'],
  commonMistakes: [
    'A könyök hajlítása és nyújtása – a gyakorlat mellnyomásba vált.',
    'A súlyzó lendítése a mozgástartomány végén.',
    'A vállak a fül felé húzódnak (emelés a protrakció helyett).',
    'Túl nagy súly, amellyel a lapocka nem mozdul, csak a kar billeg.'
  ],
  phases: [
    { type: 'eccentric', name: 'Excentrikus szakasz – a lapocka visszaenged', from: 0, to: 0.45, description: 'A súlyzó a lapockát hátra, a pad felé tolja; az elülső fűrészizom hosszabbodva fékez.' },
    { type: 'isometric', name: 'Izometriás szakasz – megtartás', from: 0.45, to: 0.55, description: 'A lapocka hátul; a protraktorok aktívak, a helyzet közel változatlan.' },
    { type: 'concentric', name: 'Koncentrikus szakasz – nyomás (protrakció)', from: 0.55, to: 1, description: 'Az elülső fűrészizom rövidülve előre vezeti a lapockát; a súlyzó a mennyezet felé emelkedik.' }
  ],
  phaseRoles: {
    eccentric: punchRoles('lengthening'),
    concentric: punchRoles('shortening')
  },
  anatomyExplanation: [
    { text: 'A nyomás a lapocka protrakciója: fő mozgatója az elülső fűrészizom, a kis mellizom segíti.', evidence: 'anatomical-fact', sourceIds: ['statpearls-serratus', ...KIN] },
    {
      text: 'Egészséges résztvevőknél (26 fő) a vizsgált protrakciós gyakorlatok közül (fekvőtámasz plusz falnál és térden, serratus punch) a serratus punch adta az elülső fűrészizom legnagyobb aktivitását, és ennél volt az elülső fűrészizom aktivitása egyértelműen nagyobb a kis mellizoménál. A szerzők ezért ezt javasolták, ha az elülső fűrészizmot a kis mellizom kisebb bevonásával akarjuk erősíteni.',
      evidence: 'documented-observation',
      sourceIds: ['castelein-2016']
    },
    {
      text: 'Vállmagasság alatt végzett gyakorlatokat összehasonlítva (20 fő) a serratus punch az elülső fűrészizom jelentős aktivitását váltotta ki; a legnagyobbat azok a gyakorlatok adták, amelyek felfelé rotált lapockával hangsúlyozták a protrakciót (fekvőtámasz plusz, „dynamic hug”).',
      evidence: 'documented-observation',
      sourceIds: ['decker-1999']
    }
  ],
  coachingNotes: [
    { text: 'Képzeld el, hogy a súlyzóval a mennyezetet akarod megérinteni – a váll emelkedjen el a padtól, a könyök maradjon nyújtva.', evidence: 'educational-model', sourceIds: TECH },
    { text: 'Kezdetben kis súllyal, lassan dolgozz: a cél a lapocka mozgása, nem a súly.', evidence: 'educational-model', sourceIds: TECH }
  ],
  parameters: {
    rangeOfMotion: { min: 0.3, max: 1, default: 1 },
    load: { min: 1, max: 20, default: 5, step: 1, mode: 'per-hand', implementKg: 0, implementName: 'kézisúlyzó' }
  },
  cycleDurationMs: 3200,
  sourceIds: ['statpearls-serratus', 'neumann-kinesiology', 'castelein-2016', 'decker-1999', 'nsca-essentials']
};

/* ------------------------------------------------------------------ */
/* 2. Karemelés a lapocka síkjában fej fölé (scaption)                  */
/* ------------------------------------------------------------------ */

/** @param c a felfelé rotálók és a karemelők hosszváltozása */
const scaptionRoles = (c: LengthChange): ExercisePhaseRole[] => {
  const brake = c === 'lengthening';
  const ev: EvidenceLevel = brake ? 'educational-model' : 'anatomical-fact';
  return [
    role('agonist', brake ? 'Lapocka – a lefelé rotáció fékezése' : 'Lapocka – felfelé rotáció', [SA, 'muscle-trapezius'], c, ev, ['statpearls-serratus', ...KIN, 'ekstrom-2003'], 'Erőpár: az elülső fűrészizom (főként az alsó része) és a csuklyásizom felső és alsó része.'),
    role('agonist', brake ? 'Vállízület – a karemelés fékezése' : 'Vállízület – emelés a lapocka síkjában', ['muscle-deltoid', 'muscle-supraspinatus'], c, ev, KIN),
    role('antagonist', 'Lapocka – lefelé rotálók', ['muscle-rhomboids', 'muscle-levator-scapulae', 'muscle-pectoralis-minor'], opposite(c), ev, KIN, brake ? 'A leengedést a kar és a súlyzó súlya hozza létre; ezek az izmok rövidülnek, de nem ők mozgatnak.' : undefined),
    role('antagonist', 'Vállízület – közelítők', ['muscle-latissimus-dorsi', 'muscle-teres-major'], opposite(c), ev, KIN),
    role('stabilizer', 'Vállízület – a felkarcsontfej központosítása', ['muscle-infraspinatus', 'muscle-teres-minor', 'muscle-subscapularis'], 'constant', 'educational-model', KIN, 'A rotátorköpeny többi izma a karemelés közben a felkarcsontfejet az ízületi árokban tartja.')
  ];
};

export const scaptionOverhead: Exercise = {
  id: 'scaption-overhead',
  name: { hu: 'Karemelés a lapocka síkjában fej fölé (scaption)', en: 'Overhead scaption (elevation in the scapular plane)' },
  muscleIds: [SA],
  status: 'available',
  animation: {
    kind: 'girdle',
    viewId: 'posterior-girdle',
    startPose: { scapularUpwardRotation: 10, shoulderAbduction: 150 },
    endPose: { scapularUpwardRotation: 0, shoulderAbduction: 12 },
    viewBox: [20, -330, 860, 820],
    viewNote:
      'Hátulnézet: a kar a fej fölé emelkedik, a lapocka közben felfelé rotál (az alsó szög oldalra-előre mozdul). Az elülső fűrészizom a lapocka mögött fekszik, ezért mély rétegként látszik. A lapocka elfordulása (10°) szemléltető: a valóságban a teljes karemelés során ennél jóval nagyobb.'
  },
  romText: 'a kar az út {rom}%-áig ereszkedik',
  startPosition: [
    'Állás, kézisúlyzó a kézben, a kar a test mellett; a hüvelykujj felfelé mutat (kifelé forgatott kar).',
    'A kar a lapocka síkjában mozog: kb. 30°-kal a test síkja előtt, a test oldala és a test eleje között.'
  ],
  execution: [
    'Emelés: a nyújtott kart a lapocka síkjában a fej fölé emeljük; a lapocka közben felfelé rotál.',
    'A felső helyzetben a kar 120° fölé, a fül mellé kerül – ez a szakasz igényli a legnagyobb lapockarotációt.',
    'Leengedés: lassan, kontrolláltan vissza a test mellé.'
  ],
  primaryMovers: [SA, 'muscle-trapezius', 'muscle-deltoid', 'muscle-supraspinatus'],
  secondaryMovers: [],
  stabilizers: ['muscle-infraspinatus', 'muscle-teres-minor', 'muscle-subscapularis'],
  commonMistakes: [
    'A vállak a fül felé húzódnak – a csuklyásizom felső része veszi át a mozgást.',
    'Homorított derék a karemelés végén.',
    'Lendítés a törzzsel.',
    'Túl nagy súly, amellyel a kar csak vállmagasságig emelhető.'
  ],
  phases: [
    { type: 'eccentric', name: 'Excentrikus szakasz – a kar leengedése', from: 0, to: 0.45, description: 'A kar és a súlyzó súlya lefelé viszi a kart; a felfelé rotálók és a karemelők hosszabbodva fékeznek.' },
    { type: 'isometric', name: 'Izometriás szakasz – megtartás', from: 0.45, to: 0.55, description: 'A kar a test mellett; rövid megállás.' },
    { type: 'concentric', name: 'Koncentrikus szakasz – emelés fej fölé', from: 0.55, to: 1, description: 'A deltaizom és a tövis feletti izom emeli a kart, az elülső fűrészizom és a csuklyásizom felfelé rotálja a lapockát.' }
  ],
  phaseRoles: {
    eccentric: scaptionRoles('lengthening'),
    concentric: scaptionRoles('shortening')
  },
  anatomyExplanation: [
    { text: 'A lapocka felfelé rotációját az elülső fűrészizom és a csuklyásizom felső és alsó része végzi; ez teszi lehetővé a kar fej fölé emelését.', evidence: 'anatomical-fact', sourceIds: ['statpearls-serratus', ...KIN] },
    {
      text: 'Egészséges résztvevőknél (30 fő) az elülső fűrészizom azoknál a gyakorlatoknál volt a legaktívabb, amelyek nagy lapockarotációt igényelnek: a lapocka síkjában 120° fölé emelt karnál és egy átlós (hajlítás + horizontális közelítés + kifelé forgatás) gyakorlatnál.',
      evidence: 'documented-observation',
      sourceIds: ['ekstrom-2003']
    },
    {
      text: 'Vállmagasság alatt végezve is (kifelé forgatott karral) az elülső fűrészizom jelentős aktivitását váltotta ki.',
      evidence: 'documented-observation',
      sourceIds: ['decker-1999']
    },
    {
      text: 'Ha az elülső fűrészizom működése kiesik (pl. a hosszú mellkasi ideg sérülésekor), a kar fej fölé emelése korlátozott, és a lapocka belső széle elemelkedik (szárnyas lapocka).',
      evidence: 'anatomical-fact',
      sourceIds: ['statpearls-serratus']
    }
  ],
  coachingNotes: [
    { text: 'A hüvelykujj mutasson felfelé, a vállak maradjanak lent – a nyak legyen laza.', evidence: 'educational-model', sourceIds: TECH },
    { text: 'Kis súllyal kezdj: a fej fölötti szakasz a nehezebb, és ott a legfontosabb a lapocka mozgása.', evidence: 'educational-model', sourceIds: ['ekstrom-2003', ...TECH] }
  ],
  parameters: {
    rangeOfMotion: { min: 0.3, max: 1, default: 1 },
    load: { min: 1, max: 12, default: 3, step: 1, mode: 'per-hand', implementKg: 0, implementName: 'kézisúlyzó' }
  },
  cycleDurationMs: 4000,
  sourceIds: ['statpearls-serratus', 'neumann-kinesiology', 'ekstrom-2003', 'decker-1999', 'nsca-essentials']
};

export const serratusAnteriorExercises: Exercise[] = [serratusPunch, scaptionOverhead];
