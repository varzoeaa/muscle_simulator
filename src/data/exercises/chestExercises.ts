import type { DisplayRoleType, EvidenceLevel, Exercise, ExercisePhase, ExercisePhaseRole, LengthChange } from '../../types';

/**
 * A nagy mellizom további gyakorlatai. Az izomszerepek ízületenként, szakaszonként szerepelnek;
 * az ízületi működések tankönyvi tények (Neumann 2017), a gyakorlatspecifikus szerepek
 * (szinergisták, stabilizálók) és a technikai elvek oktatási modell szintűek (NSCA). EMG- vagy
 * aktivációs értéket ezek a gyakorlatok nem tartalmaznak.
 */
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

const SAME_MUSCLES = 'Ugyanazok az izmok dolgoznak mindkét irányban: felfelé rövidülve mozgatnak, lefelé hosszabbodva fékeznek – az agonista szerep nem cserélődik meg.';
const BICEPS_NOTE = 'A kétfejű karizom a vállízületen segít, a könyökízületen viszont a háromfejű karizom antagonistája.';
const CUFF_NOTE = 'A rotátorköpeny a felkarcsontfejet az ízületi árokban tartja; a lapockaizmok a lapocka helyzetét rögzítik.';

/**
 * Nyomó mozgás (vállízületi horizontális közelítés + hajlítás, könyökfeszítés) szerepei.
 * @param c a nagy mellizom hosszváltozása az adott szakaszban
 */
function pressRoles(c: LengthChange, stabilizers: ExercisePhaseRole[], extra: ExercisePhaseRole[] = []): ExercisePhaseRole[] {
  const brake = c === 'lengthening';
  return [
    role('agonist', brake ? 'Vállízület – a leengedés fékezése' : 'Vállízület – horizontális közelítés és hajlítás', ['muscle-pectoralis-major', 'muscle-deltoid-anterior'], c, brake ? 'educational-model' : 'anatomical-fact', KIN_TECH, brake ? SAME_MUSCLES : undefined),
    role('agonist', brake ? 'Könyökízület – a hajlítás fékezése' : 'Könyökízület – feszítés', ['muscle-triceps-brachii'], c, brake ? 'educational-model' : 'anatomical-fact', KIN_TECH),
    role('synergist', 'Vállízület – a közelítés és hajlítás segítése', ['muscle-coracobrachialis', 'muscle-biceps-brachii'], c, 'educational-model', KIN, BICEPS_NOTE),
    role('antagonist', 'Vállízület – horizontális távolítók', ['muscle-deltoid-posterior', 'muscle-infraspinatus', 'muscle-teres-minor'], opposite(c), brake ? 'educational-model' : 'anatomical-fact', KIN, brake ? 'A mozgást itt a terhelés hozza létre, nem ezek az izmok: hosszuk csökken, de nem ők a fő mozgatók.' : undefined),
    role('antagonist', 'Könyökízület – hajlítók', ['muscle-biceps-brachii'], opposite(c), brake ? 'educational-model' : 'anatomical-fact', KIN),
    ...stabilizers,
    ...extra
  ];
}

/** Tárogató mozgás (vállízületi horizontális közelítés, közel állandó könyökszög) szerepei. */
function flyRoles(c: LengthChange, stabilizers: ExercisePhaseRole[]): ExercisePhaseRole[] {
  const brake = c === 'lengthening';
  return [
    role('agonist', brake ? 'Vállízület – a horizontális távolítás fékezése' : 'Vállízület – horizontális közelítés', ['muscle-pectoralis-major', 'muscle-deltoid-anterior'], c, brake ? 'educational-model' : 'anatomical-fact', KIN_TECH, brake ? SAME_MUSCLES.replace('felfelé', 'zárva').replace('lefelé', 'nyitva') : undefined),
    role('synergist', 'Vállízület – a közelítés segítése', ['muscle-coracobrachialis', 'muscle-biceps-brachii'], c, 'educational-model', KIN),
    role('antagonist', 'Vállízület – horizontális távolítók', ['muscle-deltoid-posterior', 'muscle-infraspinatus', 'muscle-teres-minor'], opposite(c), brake ? 'educational-model' : 'anatomical-fact', KIN, brake ? 'A nyitást a terhelés hozza létre, nem ezek az izmok.' : undefined),
    ...stabilizers
  ];
}

const shoulderStabilizers = (c: LengthChange = 'constant') => [
  role('stabilizer', 'Vállízület és lapocka – helyzet megtartása', ['muscle-rotator-cuff', 'muscle-rhomboids', 'muscle-trapezius', 'muscle-serratus-anterior'], c, 'educational-model', KIN_TECH, CUFF_NOTE)
];

const pushUpStabilizers = [
  ...shoulderStabilizers(),
  role('stabilizer', 'Törzs – egyenes testtartás (a medence nem süllyed)', ['muscle-rectus-abdominis', 'muscle-external-oblique'], 'constant', 'educational-model', TECH, 'A hasfal izmai tartják egy vonalban a vállat, a csípőt és a bokát.')
];

/** Szokásos szakaszbeosztás: leengedés → rövid tartás → felnyomás. */
const lowerHoldPress = (ecc: string, iso: string, con: string, eccD: string, isoD: string, conD: string): ExercisePhase[] => [
  { type: 'eccentric', name: ecc, from: 0, to: 0.45, description: eccD },
  { type: 'isometric', name: iso, from: 0.45, to: 0.55, description: isoD },
  { type: 'concentric', name: con, from: 0.55, to: 1, description: conD }
];

/** Gépes és kábeles gyakorlatok: a kiinduló helyzet a nyújtott helyzet, ezért a koncentrikus szakasz az első. */
const pressHoldReturn = (con: string, iso: string, ecc: string, conD: string, isoD: string, eccD: string): ExercisePhase[] => [
  { type: 'concentric', name: con, from: 0, to: 0.4, description: conD },
  { type: 'isometric', name: iso, from: 0.4, to: 0.55, description: isoD },
  { type: 'eccentric', name: ecc, from: 0.55, to: 1, description: eccD }
];

/* ------------------------------------------------------------------ */

export const dumbbellBenchPress: Exercise = {
  id: 'dumbbell-bench-press',
  name: { hu: 'Kézisúlyzós fekvenyomás', en: 'Dumbbell bench press' },
  muscleIds: ['muscle-pectoralis-major'],
  status: 'available',
  animation: { kind: 'bench', implement: 'dumbbell' },
  romText: 'a súlyzók az út {rom}%-áig ereszkednek',
  startPosition: [
    'Hanyattfekvés a padon: fej, felső hát és medence a padon, talp a talajon.',
    'A lapockák hátra- és enyhén lehúzva.',
    'A súlyzók kinyújtott könyökkel a vállízület fölött, a tenyér a láb felé néz (pronált fogás).'
  ],
  execution: [
    'Leengedés: a súlyzók kontrolláltan, közel függőleges pályán ereszkednek a mellkas mellé.',
    'Az alkar megközelítőleg függőleges marad, a könyök a törzshöz képest kb. 45–75°-os szögben.',
    'Felnyomás: a súlyzók visszatérnek a vállízület fölé; a két kéz egyszerre, azonos pályán mozog.'
  ],
  primaryMovers: ['muscle-pectoralis-major', 'muscle-deltoid-anterior', 'muscle-triceps-brachii'],
  secondaryMovers: ['muscle-coracobrachialis', 'muscle-biceps-brachii'],
  stabilizers: ['muscle-rotator-cuff', 'muscle-serratus-anterior', 'muscle-rhomboids', 'muscle-trapezius'],
  commonMistakes: [
    'A súlyzók túl mélyre engedése a vállízület kontrollálatlan helyzetébe.',
    'A két kar eltérő sebességgel vagy pályán mozog.',
    'A könyök teljesen oldalra (90°-ra) nyílik.',
    'A lapockák elvesztik a hátra-lehúzott helyzetet.',
    'A súlyzók összeütése a felső helyzetben – a kontroll elvész.'
  ],
  phases: lowerHoldPress(
    'Excentrikus szakasz – leengedés',
    'Izometriás szakasz – rövid megtartás alul',
    'Koncentrikus szakasz – felnyomás',
    'A nagy mellizom, a deltaizom elülső része és a háromfejű karizom aktívan fékezi a súlyzók ereszkedését, miközben hosszuk nő.',
    'Rövid megállásnál az izmok aktívak, az ízületi szögek közel változatlanok.',
    'A nagy mellizom horizontális közelítést és hajlítást végez a vállízületben, a háromfejű karizom feszíti a könyököt.'
  ),
  phaseRoles: {
    eccentric: pressRoles('lengthening', shoulderStabilizers()),
    concentric: pressRoles('shortening', shoulderStabilizers())
  },
  anatomyExplanation: [
    { text: 'Az ízületi mozgások a rúddal végzett fekvenyomáséval azonosak: a vállízületben horizontális közelítés és hajlítás, a könyökben feszítés.', evidence: 'anatomical-fact', sourceIds: KIN_TECH },
    { text: 'A két kar egymástól függetlenül mozog, ezért a vállízület stabilizálása (rotátorköpeny, lapockaizmok) nagyobb kontrollt igényel, mint a rúddal.', evidence: 'educational-model', sourceIds: TECH }
  ],
  coachingNotes: [
    { text: 'Kezdetben könnyebb súllyal gyakorold a két kar egyszerre, azonos pályán történő mozgatását.', evidence: 'educational-model', sourceIds: TECH },
    { text: 'A mozgástartományt az egyéni vállmobilitáshoz igazítsd; a súlyzók ne ereszkedjenek fájdalmas helyzetbe.', evidence: 'educational-model', sourceIds: TECH }
  ],
  parameters: {
    rangeOfMotion: { min: 0.25, max: 1, default: 1 },
    benchAngle: { min: -15, max: 60, default: 0, step: 5 },
    load: { min: 2, max: 50, default: 16, step: 1, mode: 'per-hand', implementKg: 0, implementName: 'kézisúlyzó' }
  },
  cycleDurationMs: 4000,
  sourceIds: ['nsca-essentials', 'neumann-kinesiology', 'saeterbakken-2011', 'rodriguez-ridao-2020', 'lauver-2016']
};

export const dumbbellFly: Exercise = {
  id: 'dumbbell-fly',
  name: { hu: 'Kézisúlyzós tárogatás', en: 'Dumbbell fly' },
  muscleIds: ['muscle-pectoralis-major'],
  status: 'available',
  animation: {
    kind: 'transverse',
    implement: 'dumbbell',
    range: [14, 96],
    viewNote: 'A mozgás síkja a test vízszintes (transzverzális) síkja; a hanyatt fekvő testet a fej felől nézzük, a kar a vállmagasságban nyílik és zár.'
  },
  romText: 'a karok az út {rom}%-áig nyílnak',
  startPosition: [
    'Hanyattfekvés a padon, talp a talajon, lapockák hátra- és enyhén lehúzva.',
    'A súlyzók a mellkas fölött, a tenyerek egymás felé néznek, a könyök enyhén hajlított.'
  ],
  execution: [
    'Nyitás: a karok ívben, vállmagasságban oldalra ereszkednek; a könyökszög a mozgás alatt közel állandó.',
    'A nyitás addig tart, amíg a vállízület kontrollált helyzetben marad (általában a felkar a törzs síkjáig).',
    'Zárás: a karok ugyanazon az íven visszatérnek a mellkas fölé – „ölelő” mozdulat.'
  ],
  primaryMovers: ['muscle-pectoralis-major', 'muscle-deltoid-anterior'],
  secondaryMovers: ['muscle-coracobrachialis', 'muscle-biceps-brachii'],
  stabilizers: ['muscle-rotator-cuff', 'muscle-serratus-anterior', 'muscle-rhomboids', 'muscle-trapezius'],
  commonMistakes: [
    'A könyök hajlítása és nyújtása a mozgás közben – a gyakorlat nyomásba vált át.',
    'Túl mély nyitás, a felkar a törzs síkja mögé kerül.',
    'Túl nagy súly, amellyel a nyitás nem kontrollálható.',
    'A lapockák elvesztik a hátra-lehúzott helyzetet.'
  ],
  phases: lowerHoldPress(
    'Excentrikus szakasz – nyitás',
    'Izometriás szakasz – rövid megtartás nyitott karral',
    'Koncentrikus szakasz – zárás',
    'A nagy mellizom és a deltaizom elülső része hosszabbodva fékezi a karok oldalra-lefelé ereszkedését.',
    'Nyitott helyzetben a mellizom aktív, a vállízületi szög közel változatlan.',
    'A nagy mellizom horizontális közelítéssel a mellkas fölé hozza a karokat.'
  ),
  phaseRoles: {
    eccentric: flyRoles('lengthening', shoulderStabilizers()),
    concentric: flyRoles('shortening', shoulderStabilizers())
  },
  anatomyExplanation: [
    { text: 'A tárogatás egyízületi mozgás a vállízületben: horizontális közelítés és távolítás, közel állandó könyökszöggel. A háromfejű karizom ezért nem fő mozgató.', evidence: 'anatomical-fact', sourceIds: KIN },
    { text: 'A nagy mellizom rostjai a mellkas elülső falától a felkarcsont elülső felszínéig futnak, ezért horizontális távolításkor hosszabbodnak, közelítéskor rövidülnek.', evidence: 'anatomical-fact', sourceIds: KIN }
  ],
  coachingNotes: [
    { text: 'Képzeld el, hogy egy nagy hordót ölelsz át: a könyökszög ne változzon.', evidence: 'educational-model', sourceIds: TECH },
    { text: 'Válassz kisebb súlyt, mint a nyomó gyakorlatoknál; a nyitás mélységét a kontroll határozza meg.', evidence: 'educational-model', sourceIds: TECH }
  ],
  parameters: {
    rangeOfMotion: { min: 0.3, max: 1, default: 1 },
    benchAngle: { min: -15, max: 45, default: 0, step: 5 },
    load: { min: 2, max: 30, default: 8, step: 1, mode: 'per-hand', implementKg: 0, implementName: 'kézisúlyzó' }
  },
  cycleDurationMs: 4400,
  sourceIds: ['nsca-essentials', 'neumann-kinesiology']
};

export const machineChestPress: Exercise = {
  id: 'machine-chest-press',
  name: { hu: 'Gépes mellnyomás', en: 'Machine chest press' },
  muscleIds: ['muscle-pectoralis-major'],
  status: 'available',
  animation: { kind: 'sagittal', preset: 'machine-press' },
  romText: 'a fogantyúk az út {rom}%-áig jönnek vissza',
  startPosition: [
    'Ülés a gépen: a hát a háttámlán, a talp a talajon; az ülésmagasság úgy beállítva, hogy a fogantyúk a mellkas közepének magasságában legyenek.',
    'A lapockák hátra- és enyhén lehúzva, a fogantyúk a mellkas mellett.'
  ],
  execution: [
    'Nyomás: a fogantyúk előre mozognak a könyök majdnem teljes nyújtásáig; a hát a támlán marad.',
    'Rövid megtartás elöl, majd kontrollált visszaengedés, amíg a fogantyúk a mellkas mellé érnek.',
    'A súlyoszlop a mozgás végén ne üljön le teljesen – a terhelés folyamatos marad.'
  ],
  primaryMovers: ['muscle-pectoralis-major', 'muscle-deltoid-anterior', 'muscle-triceps-brachii'],
  secondaryMovers: ['muscle-coracobrachialis', 'muscle-biceps-brachii'],
  stabilizers: ['muscle-rotator-cuff', 'muscle-serratus-anterior', 'muscle-rhomboids', 'muscle-trapezius'],
  commonMistakes: [
    'Rosszul beállított ülésmagasság – a fogantyúk a váll fölött vagy a has előtt vannak.',
    'A hát elválik a háttámlától, a vállak előrebillennek.',
    'A könyök „bezárása” lendülettel a mozgás végén.',
    'A súly visszaejtése a gyors, kontrollálatlan visszaengedéssel.'
  ],
  phases: pressHoldReturn(
    'Koncentrikus szakasz – nyomás előre',
    'Izometriás szakasz – rövid megtartás elöl',
    'Excentrikus szakasz – visszaengedés',
    'A nagy mellizom és a deltaizom elülső része a vállízületben, a háromfejű karizom a könyökben rövidülve mozgat.',
    'Elöl, majdnem nyújtott könyökkel az izmok tartják a súlyt, a szögek közel változatlanok.',
    'Ugyanazok az izmok hosszabbodva fékezik a fogantyúk visszatérését.'
  ),
  phaseRoles: {
    concentric: pressRoles('shortening', shoulderStabilizers()),
    eccentric: pressRoles('lengthening', shoulderStabilizers())
  },
  anatomyExplanation: [
    { text: 'A vállízületben horizontális közelítés és hajlítás, a könyökben feszítés történik – a fekvenyomással azonos ízületi mozgások, ülő testhelyzetben.', evidence: 'anatomical-fact', sourceIds: KIN_TECH },
    { text: 'A gép megszabja a mozgáspályát, ezért a stabilizáló izmok kevésbé terheltek, mint a szabad súlyos változatnál.', evidence: 'educational-model', sourceIds: TECH }
  ],
  coachingNotes: [
    { text: 'Az ülésmagasságot a gyakorlat előtt állítsd be: a fogantyúk a mellkas közepének magasságában legyenek.', evidence: 'educational-model', sourceIds: TECH },
    { text: 'A visszaengedés legyen lassabb, mint a nyomás.', evidence: 'educational-model', sourceIds: TECH }
  ],
  parameters: {
    rangeOfMotion: { min: 0.3, max: 1, default: 1 },
    load: { min: 5, max: 120, default: 40, step: 5, mode: 'stack', implementKg: 0, implementName: 'súlyoszlop' }
  },
  cycleDurationMs: 4000,
  sourceIds: ['nsca-essentials', 'neumann-kinesiology']
};

export const pecDeck: Exercise = {
  id: 'pec-deck',
  name: { hu: 'Pec deck (gépes tárogatás)', en: 'Pec deck (machine fly)' },
  muscleIds: ['muscle-pectoralis-major'],
  status: 'available',
  animation: {
    kind: 'transverse',
    implement: 'pec-deck',
    range: [16, 92],
    viewNote: 'Felülnézet: az ülő test vízszintes (transzverzális) síkja. A gép karjai a vállízület körül fordulnak, a kar vállmagasságban zár és nyit.'
  },
  romText: 'a karok az út {rom}%-áig nyílnak vissza',
  startPosition: [
    'Ülés a gépen, a hát a háttámlán; az ülésmagasság úgy beállítva, hogy a felkar a vállmagasságban legyen.',
    'Kiinduló helyzet nyitott karral; a gép forgáspontja közel a vállízület magasságában van.'
  ],
  execution: [
    'Zárás: a gép karjai ívben előre mozognak, amíg a kezek a mellkas előtt találkoznak.',
    'Rövid megtartás zárt helyzetben.',
    'Kontrollált visszaengedés a kiinduló nyitott helyzetig.'
  ],
  primaryMovers: ['muscle-pectoralis-major', 'muscle-deltoid-anterior'],
  secondaryMovers: ['muscle-coracobrachialis', 'muscle-biceps-brachii'],
  stabilizers: ['muscle-rotator-cuff', 'muscle-serratus-anterior', 'muscle-rhomboids', 'muscle-trapezius'],
  commonMistakes: [
    'Túl alacsony vagy magas ülés – a vállak megemelkednek.',
    'A hát elválik a háttámlától, a törzs előredől.',
    'Túl mély nyitás, a felkar a törzs síkja mögé kerül.',
    'A karok visszacsapódása gyors visszaengedéskor.'
  ],
  phases: pressHoldReturn(
    'Koncentrikus szakasz – zárás',
    'Izometriás szakasz – megtartás zárt helyzetben',
    'Excentrikus szakasz – visszaengedés',
    'A nagy mellizom horizontális közelítéssel a test elé hozza a karokat.',
    'Zárt helyzetben a mellizom aktív, a szögek közel változatlanok.',
    'A nagy mellizom hosszabbodva fékezi a karok visszanyílását.'
  ),
  phaseRoles: {
    concentric: flyRoles('shortening', shoulderStabilizers()),
    eccentric: flyRoles('lengthening', shoulderStabilizers())
  },
  anatomyExplanation: [
    { text: 'Egyízületi mozgás: horizontális közelítés a vállízületben, a könyök helyzete a gép miatt közel állandó.', evidence: 'anatomical-fact', sourceIds: KIN },
    { text: 'A gép vezeti a mozgáspályát, ezért a tárogatás ellenőrzöttebb, mint kézisúlyzóval.', evidence: 'educational-model', sourceIds: TECH }
  ],
  coachingNotes: [
    { text: 'A vállak maradjanak lent és hátul a teljes ismétlés alatt.', evidence: 'educational-model', sourceIds: TECH },
    { text: 'A nyitás mélységét a vállmobilitás határozza meg, nem a gép ütközője.', evidence: 'educational-model', sourceIds: TECH }
  ],
  parameters: {
    rangeOfMotion: { min: 0.3, max: 1, default: 1 },
    armElevation: { min: -20, max: 20, default: 0, step: 5 },
    load: { min: 5, max: 100, default: 30, step: 5, mode: 'stack', implementKg: 0, implementName: 'súlyoszlop' }
  },
  cycleDurationMs: 4000,
  sourceIds: ['nsca-essentials', 'neumann-kinesiology']
};

export const cableCrossover: Exercise = {
  id: 'cable-crossover',
  name: { hu: 'Csigás kereszthúzás', en: 'Cable crossover' },
  muscleIds: ['muscle-pectoralis-major'],
  status: 'available',
  animation: {
    kind: 'transverse',
    implement: 'cable',
    range: [2, 94],
    viewNote: 'Felülnézet: a mozgás vízszintes összetevője. Felülről lefelé húzott változatnál a kar közelítése (lefelé mozgás) is társul hozzá, ezt az ábra nem mutatja.'
  },
  romText: 'a karok az út {rom}%-áig nyílnak vissza',
  startPosition: [
    'Állás a két csigaoszlop között, enyhe terpeszben vagy kis lépőállásban; a törzs enyhén előredől.',
    'A fogantyúk a kézben, a karok oldalt, a könyök enyhén hajlított.'
  ],
  execution: [
    'Húzás: a kezek ívben, előre-befelé mozognak, amíg a test előtt találkoznak (vagy kissé keresztezik egymást).',
    'A könyökszög a mozgás alatt közel állandó; a törzs nem lendül.',
    'Kontrollált visszaengedés oldalra a kiinduló helyzetig.'
  ],
  primaryMovers: ['muscle-pectoralis-major', 'muscle-deltoid-anterior'],
  secondaryMovers: ['muscle-coracobrachialis', 'muscle-biceps-brachii'],
  stabilizers: ['muscle-rotator-cuff', 'muscle-serratus-anterior', 'muscle-rhomboids', 'muscle-trapezius', 'muscle-rectus-abdominis'],
  commonMistakes: [
    'A törzs lendítése a kezek összehúzásához.',
    'A könyök hajlítása és nyújtása – a mozgás nyomásba vált.',
    'A vállak előre- és felfelé húzódnak a mozgás végén.',
    'A kábelek visszarántják a kart – nincs kontrollált visszaengedés.'
  ],
  phases: pressHoldReturn(
    'Koncentrikus szakasz – összehúzás',
    'Izometriás szakasz – megtartás a test előtt',
    'Excentrikus szakasz – visszaengedés',
    'A nagy mellizom horizontális közelítéssel a test elé hozza a karokat.',
    'A kezek a test előtt; a mellizom aktív, a szögek közel változatlanok.',
    'A nagy mellizom hosszabbodva fékezi a kábelek húzását.'
  ),
  phaseRoles: {
    concentric: flyRoles('shortening', [
      ...shoulderStabilizers(),
      role('stabilizer', 'Törzs – a lendítés megakadályozása', ['muscle-rectus-abdominis', 'muscle-external-oblique'], 'constant', 'educational-model', TECH)
    ]),
    eccentric: flyRoles('lengthening', [
      ...shoulderStabilizers(),
      role('stabilizer', 'Törzs – a lendítés megakadályozása', ['muscle-rectus-abdominis', 'muscle-external-oblique'], 'constant', 'educational-model', TECH)
    ])
  },
  anatomyExplanation: [
    { text: 'A vízszintes síkban horizontális közelítés történik. A csigák magasságától függően a kar közelítése (felülről lefelé húzás) vagy hajlítása (alulról felfelé húzás) is társul hozzá.', evidence: 'anatomical-fact', sourceIds: KIN },
    { text: 'A kábel az egész mozgás alatt a kar oldalra húzása felé hat, ezért a mellizom a zárt helyzetben is terhelt marad – ez oktatási közelítés, erőmérést a modell nem végez.', evidence: 'educational-model', sourceIds: TECH }
  ],
  coachingNotes: [
    { text: 'Stabil állás és enyhén előredőlt, mozdulatlan törzs – csak a vállízület mozogjon.', evidence: 'educational-model', sourceIds: TECH },
    { text: 'A fogantyúkat ne a kézzel, hanem a felkarral „vezesd” a test elé.', evidence: 'educational-model', sourceIds: TECH }
  ],
  parameters: {
    rangeOfMotion: { min: 0.3, max: 1, default: 1 },
    pulleyAngle: { min: -30, max: 30, default: 0, step: 5 },
    load: { min: 2.5, max: 40, default: 10, step: 2.5, mode: 'per-hand', implementKg: 0, implementName: 'kábelenként' }
  },
  cycleDurationMs: 4000,
  sourceIds: ['nsca-essentials', 'neumann-kinesiology']
};

export const pushUp: Exercise = {
  id: 'push-up',
  name: { hu: 'Fekvőtámasz', en: 'Push-up' },
  muscleIds: ['muscle-pectoralis-major'],
  status: 'available',
  animation: { kind: 'sagittal', preset: 'push-up' },
  romText: 'a mellkas az út {rom}%-áig ereszkedik',
  startPosition: [
    'Mellső fekvőtámasz: a tenyér a talajon, vállszélességnél kissé szélesebben, a kéz a váll alatt.',
    'A test a vállaktól a bokáig egyenes vonalat alkot; a hasizmok és a farizmok feszesek.'
  ],
  execution: [
    'Leengedés: a könyök hajlik, a test egy egységként ereszkedik, amíg a mellkas közel ér a talajhoz.',
    'A könyök a törzshöz képest kb. 45°-os szögben marad, nem nyílik teljesen oldalra.',
    'Feltolás: a test egyenes tartással visszaemelkedik a kiinduló helyzetbe.'
  ],
  primaryMovers: ['muscle-pectoralis-major', 'muscle-deltoid-anterior', 'muscle-triceps-brachii'],
  secondaryMovers: ['muscle-coracobrachialis', 'muscle-biceps-brachii', 'muscle-serratus-anterior'],
  stabilizers: ['muscle-rotator-cuff', 'muscle-rhomboids', 'muscle-trapezius', 'muscle-rectus-abdominis', 'muscle-external-oblique'],
  commonMistakes: [
    'A medence leesik vagy megemelkedik – a test nem marad egyenes.',
    'A könyök teljesen oldalra nyílik.',
    'Részleges mozgástartomány: a mellkas nem ereszkedik le.',
    'A fej előre-lefelé lóg.'
  ],
  phases: lowerHoldPress(
    'Excentrikus szakasz – leengedés',
    'Izometriás szakasz – rövid megtartás alul',
    'Koncentrikus szakasz – feltolás',
    'Zárt kinetikai lánc: a kéz rögzített, a test ereszkedik; a nagy mellizom, a deltaizom elülső része és a háromfejű karizom hosszabbodva fékez.',
    'Alul az izmok tartják a testet, a szögek közel változatlanok.',
    'A vállízületben horizontális közelítés és hajlítás, a könyökben feszítés emeli a testet.'
  ),
  phaseRoles: {
    eccentric: pressRoles('lengthening', pushUpStabilizers),
    concentric: pressRoles('shortening', pushUpStabilizers)
  },
  anatomyExplanation: [
    { text: 'A fekvőtámasz zárt kinetikai láncú nyomó mozgás: a kéz rögzített, a törzs mozog a kéz felé, illetve attól el. Az ízületi mozgások a fekvenyomáséval azonos irányúak.', evidence: 'anatomical-fact', sourceIds: KIN },
    { text: 'Az elülső fűrészizom a lapockát a mellkasfalhoz rögzíti és előre vezeti; a felső helyzetben ez a szerepe különösen fontos.', evidence: 'anatomical-fact', sourceIds: KIN },
    { text: 'A test egyenes tartását a hasfal izmai biztosítják, ezért a fekvőtámasz a törzs stabilizációját is igényli.', evidence: 'educational-model', sourceIds: TECH }
  ],
  coachingNotes: [
    { text: 'Ha a teljes mozgástartomány még nem megy egyenes testtel, emelt kéztámasszal (pad, korlát) könnyíts, ne a tartáson.', evidence: 'educational-model', sourceIds: TECH },
    { text: 'A fej, a váll, a csípő és a boka egy vonalban maradjon.', evidence: 'educational-model', sourceIds: TECH }
  ],
  parameters: {
    rangeOfMotion: { min: 0.3, max: 1, default: 1 },
    handSupport: { min: 0, max: 60, default: 0, step: 10 },
    feetSupport: { min: 0, max: 60, default: 0, step: 10 }
  },
  cycleDurationMs: 3600,
  sourceIds: ['nsca-essentials', 'neumann-kinesiology', 'ebben-2011', 'suprak-2011', 'cogley-2005', 'ludewig-2004']
};

export const dips: Exercise = {
  id: 'dips',
  name: { hu: 'Tolódzkodás párhuzamos korláton', en: 'Parallel bar dips' },
  muscleIds: ['muscle-pectoralis-major'],
  status: 'available',
  animation: { kind: 'sagittal', preset: 'dips' },
  romText: 'a test az út {rom}%-áig ereszkedik',
  startPosition: [
    'Támasz a párhuzamos korláton nyújtott könyökkel, a vállak lent (nem húzódnak a fül felé).',
    'A törzs enyhén előredől, a térd hajlított, a láb nem ér a talajhoz.'
  ],
  execution: [
    'Leengedés: a könyök hajlik és hátrafelé mozdul, a test kontrolláltan ereszkedik, amíg a felkar körülbelül a vízszintesig ér.',
    'Az alkar megközelítőleg függőleges marad.',
    'Feltolás: a könyök nyújtásával a test visszaemelkedik a kiinduló támaszba.'
  ],
  primaryMovers: ['muscle-pectoralis-major', 'muscle-deltoid-anterior', 'muscle-triceps-brachii'],
  secondaryMovers: ['muscle-coracobrachialis'],
  stabilizers: ['muscle-rotator-cuff', 'muscle-trapezius', 'muscle-serratus-anterior', 'muscle-latissimus-dorsi'],
  commonMistakes: [
    'Túl mély leengedés, a vállízület erőltetett hátrafeszített helyzetbe kerül.',
    'A vállak felhúzódnak a fül felé.',
    'Lendítés a lábbal vagy a törzzsel.',
    'A könyök oldalra nyílik.'
  ],
  phases: lowerHoldPress(
    'Excentrikus szakasz – leengedés',
    'Izometriás szakasz – rövid megtartás alul',
    'Koncentrikus szakasz – feltolás',
    'Zárt kinetikai lánc: a kéz a korláton rögzített; a vállízület hátrafeszül, a könyök hajlik, a mozgatóizmok hosszabbodva fékeznek.',
    'Alul az izmok tartják a testet, a szögek közel változatlanok.',
    'A vállízület a hátrafeszített helyzetből előre (hajlítás irányába) mozog, a könyök feszül, a test emelkedik.'
  ),
  phaseRoles: {
    eccentric: [
      role('agonist', 'Vállízület – a hátrafeszítés fékezése', ['muscle-pectoralis-major', 'muscle-deltoid-anterior'], 'lengthening', 'educational-model', KIN_TECH, SAME_MUSCLES),
      role('agonist', 'Könyökízület – a hajlítás fékezése', ['muscle-triceps-brachii'], 'lengthening', 'educational-model', KIN_TECH),
      role('synergist', 'Vállízület – segítés', ['muscle-coracobrachialis'], 'lengthening', 'educational-model', KIN),
      role('antagonist', 'Vállízület – feszítők', ['muscle-latissimus-dorsi', 'muscle-teres-major', 'muscle-deltoid-posterior'], 'shortening', 'educational-model', KIN, 'A leengedést a testsúly hozza létre; hosszuk csökken, de nem ők a fő mozgatók.'),
      role('antagonist', 'Könyökízület – hajlítók', ['muscle-biceps-brachii'], 'shortening', 'educational-model', KIN),
      role('stabilizer', 'Vállöv – a váll lent tartása, a felkarcsontfej rögzítése', ['muscle-rotator-cuff', 'muscle-trapezius', 'muscle-serratus-anterior'], 'constant', 'educational-model', KIN_TECH, CUFF_NOTE)
    ],
    concentric: [
      role('agonist', 'Vállízület – hajlítás a hátrafeszített helyzetből', ['muscle-pectoralis-major', 'muscle-deltoid-anterior'], 'shortening', 'educational-model', KIN_TECH, 'A szegycsonti-bordai rész szerepe a vállízület helyzetétől függ; a modell ezt nem részletezi.'),
      role('agonist', 'Könyökízület – feszítés', ['muscle-triceps-brachii'], 'shortening', 'anatomical-fact', KIN_TECH),
      role('synergist', 'Vállízület – segítés', ['muscle-coracobrachialis'], 'shortening', 'educational-model', KIN),
      role('antagonist', 'Vállízület – feszítők', ['muscle-latissimus-dorsi', 'muscle-teres-major', 'muscle-deltoid-posterior'], 'lengthening', 'anatomical-fact', KIN),
      role('antagonist', 'Könyökízület – hajlítók', ['muscle-biceps-brachii'], 'lengthening', 'anatomical-fact', KIN),
      role('stabilizer', 'Vállöv – a váll lent tartása, a felkarcsontfej rögzítése', ['muscle-rotator-cuff', 'muscle-trapezius', 'muscle-serratus-anterior'], 'constant', 'educational-model', KIN_TECH, CUFF_NOTE)
    ]
  },
  anatomyExplanation: [
    { text: 'Zárt kinetikai láncú mozgás: a kéz rögzített, a test mozog. Leengedéskor a vállízület hátrafeszül, a könyök hajlik; feltoláskor fordítva.', evidence: 'anatomical-fact', sourceIds: KIN },
    { text: 'A széles hátizom a vállízület feszítője, ezért a mozgás szempontjából antagonista; a vállöv lent tartásában viszont stabilizáló szerepe is lehet.', evidence: 'educational-model', sourceIds: KIN },
    { text: 'A mély leengedés a vállízületet nagy hátrafeszítésbe viszi, ezért a mozgástartományt az egyéni vállmobilitáshoz kell igazítani.', evidence: 'educational-model', sourceIds: TECH }
  ],
  coachingNotes: [
    { text: 'Ereszkedj addig, amíg a felkar közel vízszintes, és a vállak lent maradnak.', evidence: 'educational-model', sourceIds: TECH },
    { text: 'Könnyítéshez gumiszalagos vagy gépi segítséget használj.', evidence: 'educational-model', sourceIds: TECH }
  ],
  parameters: {
    rangeOfMotion: { min: 0.3, max: 1, default: 1 },
    dipLean: { min: 0, max: 40, default: 30, step: 5 }
  },
  cycleDurationMs: 3800,
  sourceIds: ['nsca-essentials', 'neumann-kinesiology', 'mckenzie-2022-variants', 'mckenzie-2022-fatigue']
};

const stretchedRoles = (c: LengthChange, note?: string): ExercisePhaseRole[] => [
  role('stretched', 'Vállízület – horizontális távolítás (passzívan)', ['muscle-pectoralis-major', 'muscle-deltoid-anterior'], c, 'anatomical-fact', KIN, note),
  role('stretched', 'Vállízület – a kar elülső izmai', ['muscle-coracobrachialis', 'muscle-biceps-brachii'], c, 'educational-model', KIN, 'Nyújtott könyöknél a kétfejű karizom is nyúlhat.'),
  role('stabilizer', 'Lapocka – a helyzet megtartása (a váll nem húzódik előre és fel)', ['muscle-rhomboids', 'muscle-trapezius', 'muscle-rotator-cuff'], 'constant', 'educational-model', KIN_TECH)
];

export const pectoralStretch: Exercise = {
  id: 'pectoral-stretch',
  name: { hu: 'Mellizomnyújtás falnál (egykaros)', en: 'Single-arm wall pectoral stretch' },
  muscleIds: ['muscle-pectoralis-major'],
  status: 'available',
  animation: {
    kind: 'transverse',
    implement: 'stretch',
    range: [92, 122],
    unilateral: true,
    viewNote: 'Felülnézet: a kéz a falon vállmagasságban, a törzs a faltól elfordul. A vállízületben ez horizontális távolítás; az ábra a törzshöz viszonyított karhelyzetet mutatja.'
  },
  romText: 'a nyújtás a teljes tartomány {rom}%-áig tart',
  startPosition: [
    'Oldalállás a fal (vagy ajtókeret) mellett; a nyújtott kar tenyere a falon, vállmagasságban, kissé a test mögött.',
    'A lapocka hátra- és enyhén lehúzva, a törzs egyenes.'
  ],
  execution: [
    'A törzs lassan elfordul a faltól, amíg a mellkas elülső részén és a váll elején enyhe-közepes húzás érezhető.',
    'A helyzetet nyugodt légzéssel megtartjuk; a nyújtás nem lehet fájdalmas.',
    'Lassú visszatérés a kiinduló helyzetbe, majd a másik oldal.'
  ],
  primaryMovers: [],
  secondaryMovers: [],
  stabilizers: ['muscle-rhomboids', 'muscle-trapezius', 'muscle-rotator-cuff'],
  commonMistakes: [
    'Rántásszerű, gyors mozdulat a nyújtott helyzetbe.',
    'A váll előre- és felhúzódik – a nyújtás a vállízület elülső tokjára terhelődik.',
    'Fájdalomig vitt nyújtás.',
    'Visszatartott légzés.'
  ],
  phases: [
    { type: 'passive-stretch', name: 'Nyújtás felvétele', from: 0, to: 0.25, description: 'A törzs elfordulása horizontális távolításba viszi a vállízületet; a nagy mellizom passzívan hosszabbodik.' },
    { type: 'static-stretch', name: 'Statikus tartás', from: 0.25, to: 0.8, description: 'A nyújtott helyzet megtartása; a mellizom ideális esetben nem dolgozik aktívan, a hossza közel állandó.' },
    { type: 'release', name: 'Visszatérés', from: 0.8, to: 1, description: 'Lassú visszatérés; a mellizom passzívan visszarövidül.' }
  ],
  phaseRoles: {
    'passive-stretch': stretchedRoles('lengthening', 'A nyújtást a testhelyzet hozza létre, nem izomösszehúzódás: a nyújtott izom ideálisan ellazult.'),
    'static-stretch': stretchedRoles('constant'),
    release: stretchedRoles('shortening')
  },
  anatomyExplanation: [
    { text: 'A nagy mellizom a vállízület horizontális közelítője, hajlítója és befelé forgatója; az ellentétes irányú mozgás – horizontális távolítás – nyújtja.', evidence: 'anatomical-fact', sourceIds: KIN },
    { text: 'A kar magassága módosíthatja, melyik izomrész nyúlik jobban; a modell egyetlen, vállmagasságú karhelyzetet mutat.', evidence: 'educational-model', sourceIds: KIN }
  ],
  coachingNotes: [
    { text: 'A nyújtás legyen kontrollált és fájdalommentes; a tartás alatt lélegezz egyenletesen.', evidence: 'educational-model', sourceIds: TECH },
    { text: 'Tartsd a lapockát hátra-lent, hogy a váll ne húzódjon előre.', evidence: 'educational-model', sourceIds: TECH }
  ],
  parameters: {
    rangeOfMotion: { min: 0.3, max: 1, default: 1 }
  },
  cycleDurationMs: 9000,
  sourceIds: ['nsca-essentials', 'neumann-kinesiology', 'umehara-2021', 'garber-2011', 'behm-2016']
};

export const supinePectoralStretch: Exercise = {
  id: 'supine-pectoral-stretch',
  name: { hu: 'Fekvő mellizomnyújtás hengeren (kétkaros)', en: 'Supine pectoral stretch on a foam roller' },
  muscleIds: ['muscle-pectoralis-major'],
  status: 'available',
  animation: {
    kind: 'transverse',
    implement: 'stretch',
    range: [88, 112],
    viewNote:
      'Felülnézet: hanyatt fekvés a gerinc alatt hosszában fekvő hengeren; a kinyújtott karok oldalt, a gravitáció húzza őket a test síkja alá. A vállízületben ez mindkét oldalon horizontális távolítás.'
  },
  romText: 'a karok a teljes tartomány {rom}%-áig ereszkednek',
  startPosition: [
    'Hanyattfekvés a hengeren úgy, hogy a fej és a medence is rajta legyen; a talp a talajon, a térd hajlított.',
    'A karok oldalt, a választott magasságban (pl. vállmagasság alatt, vállmagasságban vagy fölötte), a tenyér felfelé néz.'
  ],
  execution: [
    'A karok ellazulnak, és a saját súlyuk viszi őket a talaj felé, amíg a mellkas elején enyhe-közepes húzás érezhető.',
    'A helyzetet nyugodt légzéssel megtartjuk; a derék nem homorít, a bordák nem emelkednek meg.',
    'Lassú visszatérés: a karok a test fölé emelkednek, majd pihenés.'
  ],
  primaryMovers: [],
  secondaryMovers: [],
  stabilizers: ['muscle-rectus-abdominis', 'muscle-external-oblique'],
  commonMistakes: [
    'A derék homorítása és a bordák megemelése – a nyújtás a törzs mozgásába „szökik”.',
    'Túl nagy tartomány erőltetése, a vállízület elején kellemetlen érzés.',
    'A fej leesik a hengerről.',
    'Visszatartott légzés.'
  ],
  phases: [
    { type: 'passive-stretch', name: 'Nyújtás felvétele', from: 0, to: 0.25, description: 'A karok a gravitáció hatására ereszkednek; a vállízület horizontális távolításba kerül, a nagy mellizom passzívan hosszabbodik.' },
    { type: 'static-stretch', name: 'Statikus tartás', from: 0.25, to: 0.8, description: 'A nyújtott helyzet megtartása ellazult karral; a mellizom hossza közel állandó.' },
    { type: 'release', name: 'Visszatérés', from: 0.8, to: 1, description: 'A karok lassan a test fölé emelkednek; a mellizom passzívan visszarövidül.' }
  ],
  phaseRoles: {
    'passive-stretch': [
      ...stretchedRoles('lengthening', 'A nyújtást a karok súlya hozza létre: a nyújtott izom ideálisan ellazult.').filter((r) => r.role === 'stretched'),
      role('stabilizer', 'Törzs – a derék és a bordák helyzetének megtartása', ['muscle-rectus-abdominis', 'muscle-external-oblique'], 'constant', 'educational-model', TECH)
    ],
    'static-stretch': [
      ...stretchedRoles('constant').filter((r) => r.role === 'stretched'),
      role('stabilizer', 'Törzs – a derék és a bordák helyzetének megtartása', ['muscle-rectus-abdominis', 'muscle-external-oblique'], 'constant', 'educational-model', TECH)
    ],
    release: [
      ...stretchedRoles('shortening').filter((r) => r.role === 'stretched'),
      role('stabilizer', 'Törzs – a derék és a bordák helyzetének megtartása', ['muscle-rectus-abdominis', 'muscle-external-oblique'], 'constant', 'educational-model', TECH)
    ]
  },
  anatomyExplanation: [
    { text: 'A karok oldalra-lefelé ereszkedése a vállízületben horizontális távolítás – a nagy mellizom közelítő működésével ellentétes irány, ezért nyújtja.', evidence: 'anatomical-fact', sourceIds: KIN },
    { text: 'A henger miatt a lapockák szabadon mozoghatnak hátrafelé; a nyújtás nagyságát a karok súlya és a karhelyzet határozza meg, nem aktív erőkifejtés.', evidence: 'educational-model', sourceIds: KIN }
  ],
  coachingNotes: [
    { text: 'Engedd el a karokat, ne nyomd őket lefelé; a nyújtás legyen fájdalommentes.', evidence: 'educational-model', sourceIds: TECH },
    { text: 'Ha a vállad eleje kellemetlen, vidd a karokat lejjebb, a törzs mellé, vagy támaszd alá a könyököt.', evidence: 'educational-model', sourceIds: TECH }
  ],
  parameters: {
    rangeOfMotion: { min: 0.3, max: 1, default: 1 }
  },
  cycleDurationMs: 9000,
  sourceIds: ['nsca-essentials', 'neumann-kinesiology', 'umehara-2021', 'garber-2011', 'behm-2016']
};

export const chestExercises: Exercise[] = [dumbbellBenchPress, dumbbellFly, machineChestPress, pecDeck, cableCrossover, pushUp, dips, pectoralStretch, supinePectoralStretch];
