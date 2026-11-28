import type { DisplayRoleType, EvidenceLevel, Exercise, ExercisePhaseRole, LengthChange } from '../../types';

/**
 * A kis mellizom gyakorlatai: lapocka-süllyesztés támaszban, fekvőtámasz plusz („plusz”
 * szakasz), egykaros kis mellizom-nyújtás. Az ízületi működések és a szerepek Neumann (2017)
 * leírását követik; a fekvőtámasz plusz és a nyújtás kutatási eredményei az ellenőrzött
 * absztraktok alapján, minőségileg szerepelnek.
 */
const M = 'muscle-pectoralis-minor';
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
/* 1. Lapocka-süllyesztés támaszban                                    */
/* ------------------------------------------------------------------ */

/** @param c a süllyesztő izmok (köztük a kis mellizom) hosszváltozása */
const depressionRoles = (c: LengthChange): ExercisePhaseRole[] => {
  const brake = c === 'lengthening';
  return [
    role('agonist', brake ? 'Lapocka – az emelkedés fékezése' : 'Lapocka – süllyesztés', [M, 'muscle-trapezius', 'muscle-latissimus-dorsi'], c, brake ? 'educational-model' : 'anatomical-fact', KIN, brake ? 'Ugyanazok a süllyesztők dolgoznak: hosszabbodva fékezik, hogy a testsúly a vállakat a fül felé tolja.' : 'A csuklyásizomnak az alsó része süllyeszt; a széles hátizom a felkarcsonton keresztül húzza lefelé a vállövet.'),
    role('synergist', 'Kulcscsont – süllyesztés és rögzítés', ['muscle-subclavius'], c, 'educational-model', ['openstax-ap2e', 'neumann-kinesiology'], 'Közvetlenül a kulcscsontra hat (a kis mellizom a lapockára, a széles hátizom a felkarcsontra). Támaszban az aktivitását nem mérték: a hosszváltozás és a szerep a modell feltételezett terhelési helyzetén alapul.'),
    role('antagonist', 'Lapocka – emelők', ['muscle-levator-scapulae', 'muscle-rhomboids'], opposite(c), brake ? 'educational-model' : 'anatomical-fact', KIN, 'A csuklyásizom felső része is a lapocka emelője.'),
    role('stabilizer', 'Könyök és vállízület – a nyújtott kar megtartása', ['muscle-triceps-brachii', 'muscle-rotator-cuff'], 'constant', 'educational-model', KIN_TECH, 'A könyök végig nyújtott: a mozgás csak a vállövben történik.')
  ];
};

export const scapularDepressionDip: Exercise = {
  id: 'scapular-depression-dip',
  name: { hu: 'Lapocka-süllyesztés támaszban (korláton)', en: 'Scapular depression in dip support (dip shrug)' },
  muscleIds: [M],
  status: 'available',
  animation: {
    kind: 'girdle',
    viewId: 'anterior-girdle',
    startPose: { clavicleElevation: -8, scapularUpwardRotation: 0, shoulderAbduction: 8 },
    endPose: { clavicleElevation: 10, scapularUpwardRotation: 0, shoulderAbduction: 8 },
    bodyweight: true,
    viewNote:
      'Elölnézet, a vállöv a törzshöz viszonyítva. Támaszban a kéz rögzített, ezért a valóságban a törzs emelkedik és süllyed – az ábra ugyanezt a viszonylagos mozgást mutatja: a kulcscsont és a lapocka a törzshöz képest süllyed (felhúzáskor) és emelkedik (leengedéskor).'
  },
  romText: 'a vállak az út {rom}%-áig emelkednek',
  startPosition: [
    'Támasz a párhuzamos korláton nyújtott könyökkel, a törzs közel függőleges.',
    'A vállak lent (távol a fültől), a lapockák a mellkasfalon.'
  ],
  execution: [
    'Leengedés: a könyök nyújtott marad, a vállak kontrolláltan a fül felé emelkednek, a test kissé lejjebb kerül.',
    'Felhúzás: a vállak aktív lehúzásával a test megemelkedik – a mozgás csak a vállövben történik.',
    'A mozgástartomány kicsi; a könyök nem hajlik.'
  ],
  primaryMovers: [M, 'muscle-trapezius', 'muscle-latissimus-dorsi'],
  secondaryMovers: ['muscle-subclavius'],
  stabilizers: ['muscle-triceps-brachii', 'muscle-rotator-cuff'],
  commonMistakes: [
    'A könyök hajlítása – a gyakorlat tolódzkodásba vált át.',
    'Lendítés a lábbal vagy a törzzsel.',
    'A vállak a fül mellé „esnek” kontroll nélkül.',
    'Túl nagy, fájdalmas mozgástartomány a vállban.'
  ],
  phases: [
    { type: 'eccentric', name: 'Excentrikus szakasz – a vállak emelkednek', from: 0, to: 0.45, description: 'A testsúly a vállövet felfelé tolja; a süllyesztők (köztük a kis mellizom) hosszabbodva fékeznek.' },
    { type: 'isometric', name: 'Izometriás szakasz – megtartás', from: 0.45, to: 0.55, description: 'A vállak felső helyzetben; a süllyesztők aktívak, a helyzet közel változatlan.' },
    { type: 'concentric', name: 'Koncentrikus szakasz – a vállak lehúzása', from: 0.55, to: 1, description: 'A süllyesztők rövidülve lehúzzák a vállövet; támaszban ettől a test emelkedik.' }
  ],
  phaseRoles: {
    eccentric: depressionRoles('lengthening'),
    concentric: depressionRoles('shortening')
  },
  anatomyExplanation: [
    { text: 'A kis mellizom a lapockát lefelé és előre, a mellkasfalhoz húzza – a lapocka süllyesztője.', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral', 'neumann-kinesiology'] },
    { text: 'Zárt láncban (rögzített kéz) a süllyesztők a törzset emelik a vállövhöz képest: ugyanaz az izomműködés, csak a rögzített pont más.', evidence: 'educational-model', sourceIds: KIN },
    { text: 'A tolódzkodás kiinduló támaszában a vállak „lent tartása” ugyanezeket az izmokat igényli izometriásan.', evidence: 'educational-model', sourceIds: KIN_TECH }
  ],
  coachingNotes: [
    { text: 'Gondolj arra, hogy a vállakat „a zsebedbe teszed”, miközben a könyök végig nyújtott.', evidence: 'educational-model', sourceIds: TECH },
    { text: 'Kezdetben a lábat a talajon hagyva (padon vagy alacsony korláton) könnyíthetsz.', evidence: 'educational-model', sourceIds: TECH }
  ],
  parameters: { rangeOfMotion: { min: 0.3, max: 1, default: 1 } },
  cycleDurationMs: 3200,
  sourceIds: ['neumann-kinesiology', 'statpearls-pectoral', 'openstax-ap2e', 'nsca-essentials']
};

/* ------------------------------------------------------------------ */
/* 2. Fekvőtámasz plusz – a „plusz” szakasz                            */
/* ------------------------------------------------------------------ */

/** @param c a protraktorok (elülső fűrészizom, kis mellizom) hosszváltozása */
const protractionRoles = (c: LengthChange): ExercisePhaseRole[] => {
  const brake = c === 'lengthening';
  return [
    role('agonist', brake ? 'Lapocka – a retrakció fékezése (modell)' : 'Lapocka – protrakció', ['muscle-serratus-anterior'], c, 'educational-model', ['neumann-kinesiology'], 'A protrakció egyik fő mozgatója az elülső fűrészizom (tankönyvi tény). A hosszváltozás – koncentrikus, excentrikus, izometriás – a bemutatott mechanikai modell feltevése: Ludewigék EMG-vizsgálata az izomhosszt nem mérte.'),
    role('synergist', brake ? 'Lapocka – a retrakció fékezésének segítése (modell)' : 'Lapocka – a protrakció segítése', [M], c, 'educational-model', KIN),
    role('antagonist', 'Lapocka – retraktorok', ['muscle-rhomboids', 'muscle-trapezius'], opposite(c), brake ? 'educational-model' : 'anatomical-fact', KIN, brake ? 'A leengedést a testsúly hozza létre; a retraktorok rövidülnek, de nem ők mozgatnak.' : 'A csuklyásizomnak főként a középső része retraktor.'),
    role('stabilizer', 'Könyök és vállízület – a nyújtott kar megtartása', ['muscle-triceps-brachii', 'muscle-rotator-cuff'], 'constant', 'educational-model', KIN_TECH),
    role('stabilizer', 'Törzs – egyenes testtartás', ['muscle-rectus-abdominis', 'muscle-external-oblique'], 'constant', 'educational-model', TECH)
  ];
};

export const pushUpPlus: Exercise = {
  id: 'push-up-plus',
  name: { hu: 'Fekvőtámasz plusz – a „plusz” szakasz', en: 'Push-up plus – the “plus” phase' },
  muscleIds: [M],
  status: 'available',
  animation: {
    kind: 'girdle',
    viewId: 'superior-girdle',
    startPose: { scapularProtraction: 16, shoulderHorizontalAbduction: 12 },
    endPose: { scapularProtraction: -8, shoulderHorizontalAbduction: 12 },
    bodyweight: true,
    viewNote:
      'A törzs vízszintes metszete (a fej felől nézve): a karok a talaj felé mutatnak. A „plusz” szakaszban a könyök közel nyújtott. Az ábra a vállöv mozgásának egyik összetevőjét emeli ki: a lapocka a mellkasfal mentén előre (protrakció) mozog a test megemelésekor, és hátra (retrakció), amikor a mellkas a lapockák közé süllyed. A valóságban a lapocka közben forog és billen is, ezt az ábra nem mutatja.'
  },
  romText: 'a lapockák az út {rom}%-áig közelednek egymáshoz',
  startPosition: [
    'Fekvőtámasz felső helyzete nyújtott könyökkel; a test egyenes, a kéz a váll alatt.',
    'Kezdőknek térdelő változatban vagy falnál is végezhető.'
  ],
  execution: [
    'Leengedés: a könyök nyújtott marad, a mellkas kontrolláltan a lapockák közé süllyed (retrakció).',
    'A „plusz”: a talajt tovább tolva a lapockák a mellkasfal mentén előre mozognak (protrakció), a felső hát kissé domborodik.',
    'A könyök közel nyújtott marad, a mozgás fő része a vállövben történik; a törzs egyenes marad.'
  ],
  primaryMovers: ['muscle-serratus-anterior'],
  secondaryMovers: [M],
  stabilizers: ['muscle-triceps-brachii', 'muscle-rotator-cuff', 'muscle-rectus-abdominis', 'muscle-external-oblique'],
  commonMistakes: [
    'A könyök hajlítása – a mozgás hagyományos fekvőtámaszba vált.',
    'A medence leesik vagy megemelkedik.',
    'A vállak a fül felé húzódnak.',
    'A „plusz” kimarad: a lapocka nem csúszik előre.'
  ],
  phases: [
    { type: 'eccentric', name: 'Excentrikus szakasz – a mellkas a lapockák közé süllyed', from: 0, to: 0.45, description: 'A testsúly hátrafelé tolja a lapockákat. A modell feltevése szerint a protraktorok aktívak, és hosszabbodva fékeznek (az izomhosszt nem mérték).' },
    { type: 'isometric', name: 'Izometriás szakasz – megtartás', from: 0.45, to: 0.55, description: 'Retrahált lapockával a helyzet közel változatlan; a modell feltevése szerint a protraktorok aktívak.' },
    { type: 'concentric', name: 'Koncentrikus szakasz – „plusz”: protrakció', from: 0.55, to: 1, description: 'Az elülső fűrészizom (és segítőként a kis mellizom) a lapockát előre vezeti; a test megemelkedik. A rövidülés a modell feltevése.' }
  ],
  phaseRoles: {
    eccentric: protractionRoles('lengthening'),
    concentric: protractionRoles('shortening')
  },
  anatomyExplanation: [
    { text: 'A „plusz” szakasz a lapocka protrakciója: egyik fő mozgatója az elülső fűrészizom, a kis mellizom segíti.', evidence: 'anatomical-fact', sourceIds: KIN },
    {
      text: 'A vizsgált négy változat (hagyományos, könyökön, térden és falnál végzett fekvőtámasz plusz; 30 fő) közül a hagyományos, talajon végzett változat „plusz” szakaszában volt a legmagasabb a mért elülsőfűrészizom-EMG, és a legalacsonyabb a felső csuklyásizom / elülső fűrészizom EMG-aránya. A vizsgálat csak ezt a két izmot mérte: teljes izomaktivitási rangsor nem következik belőle, a felső fűrészizomkötegek külön aktivitásáról sem szól, és az izomhosszt sem mérte.',
      evidence: 'documented-observation',
      sourceIds: ['ludewig-2004']
    },
    {
      text: 'A mozgás térben összetett: egy külön vizsgálat a falnál végzett fekvőtámasz plusznál (12 fő, csontba rögzített szenzorok) a „plusz” helyzet felé a lapocka belső rotációjának növekedését és a felfelé rotáció csökkenését (lefelé rotációt) mérte. Ez a fali változatra vonatkozik; a talajon végzett változatra nem vihető át automatikusan.',
      evidence: 'documented-observation',
      sourceIds: ['lunden-2010']
    },
    { text: 'A kis mellizom a lapockát előre és lefelé is húzza, ezért a protrakcióban segítő, de nem fő mozgató.', evidence: 'educational-model', sourceIds: KIN },
    {
      text: 'A módosított fekvőtámasz plusz falnál és térden végezve az elülső fűrészizmot és a kis mellizmot hasonló mértékben aktiválta; a térdelő változat mindkettőt jobban, mint a fali.',
      evidence: 'documented-observation',
      sourceIds: ['castelein-2016']
    }
  ],
  coachingNotes: [
    { text: 'A „plusz” végén told el magad a talajtól, mintha a lapockáid közötti teret akarnád kitágítani.', evidence: 'educational-model', sourceIds: TECH },
    { text: 'Tartsd a vállakat lent; a nyak legyen laza.', evidence: 'educational-model', sourceIds: TECH }
  ],
  parameters: { rangeOfMotion: { min: 0.3, max: 1, default: 1 } },
  cycleDurationMs: 3200,
  sourceIds: ['neumann-kinesiology', 'ludewig-2004', 'lunden-2010', 'castelein-2016', 'nsca-essentials']
};

/* ------------------------------------------------------------------ */
/* 3. Kis mellizom-nyújtás (egykaros, ajtókeretben)                    */
/* ------------------------------------------------------------------ */

const minorStretchRoles = (c: LengthChange, note?: string): ExercisePhaseRole[] => [
  role('stretched', 'Lapocka – retrakció és hátrabillenés (passzívan)', [M], c, 'anatomical-fact', KIN, note),
  role('stretched', 'Vállízület – horizontális távolítás (passzívan)', ['muscle-pectoralis-major'], c, 'educational-model', KIN, 'A kar hátravitele a nagy mellizmot is nyújtja.'),
  role('stabilizer', 'Lapocka – a hátra-lent tartott helyzet megtartása', ['muscle-rhomboids', 'muscle-trapezius', 'muscle-rotator-cuff'], 'constant', 'educational-model', KIN)
];

export const pectoralisMinorStretch: Exercise = {
  id: 'pectoralis-minor-stretch',
  name: { hu: 'Kis mellizom-nyújtás (egykaros önnyújtás)', en: 'Pectoralis minor unilateral self-stretch' },
  muscleIds: [M],
  status: 'available',
  animation: {
    kind: 'girdle',
    viewId: 'superior-girdle',
    startPose: { scapularProtraction: 0, shoulderHorizontalAbduction: 88 },
    endPose: { scapularProtraction: -12, shoulderHorizontalAbduction: 118 },
    unilateral: true,
    viewNote:
      'Felülnézet: a kar vállmagasságban az ajtókereten, a törzs a karral ellentétes irányba fordul. A lapocka hátra mozdul (retrakció), a kar hátrakerül (horizontális távolítás); a hollócsőrnyúlvány távolodik a bordáktól.'
  },
  romText: 'a nyújtás a teljes tartomány {rom}%-áig tart',
  startPosition: [
    'Állás egy ajtókeret mellett; a kar kb. vállmagasságban vagy kissé fölötte, az alkar vagy a tenyér a kereten.',
    'A lapocka hátra- és enyhén lehúzva, a törzs egyenes.'
  ],
  execution: [
    'A törzs lassan elfordul a kartól, és/vagy egy kis lépés előre: a lapocka hátra mozdul, a váll eleje és a mellkas felső része nyúlik.',
    'A helyzetet nyugodt légzéssel megtartjuk; a nyújtás nem lehet fájdalmas.',
    'Lassú visszatérés, majd a másik oldal.'
  ],
  primaryMovers: [],
  secondaryMovers: [],
  stabilizers: ['muscle-rhomboids', 'muscle-trapezius', 'muscle-rotator-cuff'],
  commonMistakes: [
    'A váll előre és felfelé húzódik – a lapocka nem mozdul hátra, a nyújtás a vállízület elejére terhelődik.',
    'Rántásszerű mozdulat a nyújtott helyzetbe.',
    'Homorított derék a törzsfordítás helyett.',
    'Fájdalomig vitt nyújtás.'
  ],
  phases: [
    { type: 'passive-stretch', name: 'Nyújtás felvétele', from: 0, to: 0.25, description: 'A törzs elfordulása hátra viszi a lapockát; a kis mellizom passzívan hosszabbodik.' },
    { type: 'static-stretch', name: 'Statikus tartás', from: 0.25, to: 0.8, description: 'A nyújtott helyzet megtartása; a kis mellizom ideális esetben nem dolgozik aktívan.' },
    { type: 'release', name: 'Visszatérés', from: 0.8, to: 1, description: 'Lassú visszatérés; a kis mellizom passzívan visszarövidül.' }
  ],
  phaseRoles: {
    'passive-stretch': minorStretchRoles('lengthening', 'A nyújtást a testhelyzet hozza létre: a hollócsőrnyúlvány távolodik a 3–5. bordától.'),
    'static-stretch': minorStretchRoles('constant'),
    release: minorStretchRoles('shortening')
  },
  anatomyExplanation: [
    { text: 'A kis mellizom a hollócsőrnyúlványtól a 3–5. bordáig fut; nyújtásához a lapockának hátra (retrakció) és hátrabillenő irányba kell mozdulnia.', evidence: 'anatomical-fact', sourceIds: ['neumann-kinesiology', 'statpearls-pectoral'] },
    {
      text: 'Három nyújtást összehasonlítva (50 fő) az egykaros önnyújtás hosszabbította meg leginkább a kis mellizmot (átlagosan 2,24 cm), ezt a fekvő (1,69 cm) és az ülő kézi nyújtás (0,77 cm) követte.',
      evidence: 'documented-observation',
      sourceIds: ['borstad-2006']
    },
    {
      text: 'Elasztográfiás mérés szerint (18 férfi) a 90°-os és a 150°-os karemelés melletti horizontális távolítás nyújtotta leginkább a kis mellizmot; a lapocka-retrakció és a vállhajlítás kevésbé.',
      evidence: 'documented-observation',
      sourceIds: ['umehara-2017']
    },
    { text: 'A kis mellizom megrövidülését a vállbeszorulásnál (impingement) látott lapockamozgás-eltérésekhez hasonló változásokkal hozták összefüggésbe.', evidence: 'documented-observation', sourceIds: ['borstad-2006'] }
  ],
  coachingNotes: [
    { text: 'A nyújtás alatt tartsd a lapockát hátra-lent; ha a váll előreesik, a kis mellizom nem nyúlik.', evidence: 'educational-model', sourceIds: KIN },
    { text: 'A kar magasságát (vállmagasság vagy fölötte) úgy válaszd, hogy a nyújtást a mellkas felső részén, a váll előtt érezd, fájdalom nélkül.', evidence: 'educational-model', sourceIds: ['umehara-2017'] }
  ],
  parameters: { rangeOfMotion: { min: 0.3, max: 1, default: 1 } },
  cycleDurationMs: 9000,
  sourceIds: ['neumann-kinesiology', 'statpearls-pectoral', 'borstad-2006', 'umehara-2017', 'garber-2011', 'behm-2016']
};

export const pectoralisMinorExercises: Exercise[] = [scapularDepressionDip, pushUpPlus, pectoralisMinorStretch];
