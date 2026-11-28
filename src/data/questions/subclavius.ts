import type { Flashcard, StudyQuestion } from '../../types';

/**
 * A kulcscsont alatti izom tanulókártyái és feladatai. Minden feladat az alkalmazásban már
 * megjelenő, forrással ellátott tartalomra épül: az Anatómia modul adatlapjára (StatPearls, OpenStax,
 * Moore, Neumann), a Biomechanika modul mozgásaira és a Gyakorlatok modul gyakorlataira.
 */
const M = 'muscle-subclavius';
const ANAT = ['statpearls-pectoral', 'openstax-ap2e', 'moore-coa'];
const KIN = ['neumann-kinesiology'];

const mc = (id: string, topic: StudyQuestion['topic'], prompt: string, options: string[], correct: number, explanation: string, sourceIds: string[], relatedPath: string): StudyQuestion => ({
  id,
  muscleId: M,
  topic,
  type: 'multiple-choice',
  prompt,
  options: options.map((text, i) => ({ id: String.fromCharCode(97 + i), text })),
  correctOptionId: String.fromCharCode(97 + correct),
  explanation,
  sourceIds,
  relatedPath
});

const fill = (id: string, topic: StudyQuestion['topic'], text: string, options: string[], answer: string, explanation: string, sourceIds: string[], relatedPath: string): StudyQuestion => ({
  id,
  muscleId: M,
  topic,
  type: 'fill-blank',
  prompt: 'Egészítsd ki a mondatot!',
  text,
  options,
  answer,
  explanation,
  sourceIds,
  relatedPath
});

const match = (id: string, topic: StudyQuestion['topic'], prompt: string, pairs: [string, string][], explanation: string, sourceIds: string[], relatedPath: string): StudyQuestion => ({
  id,
  muscleId: M,
  topic,
  type: 'matching',
  prompt,
  pairs: pairs.map(([left, right], i) => ({ id: `p${i + 1}`, left, right })),
  explanation,
  sourceIds,
  relatedPath
});

/* ------------------------------------------------------------------ */
/* Tanulókártyák                                                       */
/* ------------------------------------------------------------------ */

export const subFlashcards: Flashcard[] = [
  { id: 'fc-sub-name', muscleId: M, topic: 'name', front: 'Kulcscsont alatti izom – angol és latin név?', back: 'Subclavius – Musculus subclavius', sourceIds: ['fipat-ta2'] },
  { id: 'fc-sub-shape', muscleId: M, topic: 'regions', front: 'Milyen alakú, és hol fekszik a kulcscsont alatti izom?', back: 'Kicsi, háromszög alakú izom a kulcscsont alatt, a nagy mellizom mögött. Külön elnevezett részei nincsenek.', sourceIds: ['statpearls-pectoral', 'moore-coa'] },
  { id: 'fc-sub-origin', muscleId: M, topic: 'origin', front: 'Hol ered a kulcscsont alatti izom?', back: 'Az 1. bordán és bordaporcán, a kulcscsont-borda szalag (lig. costoclaviculare) előtt.', sourceIds: ANAT },
  { id: 'fc-sub-insertion', muscleId: M, topic: 'insertion', front: 'Hol tapad a kulcscsont alatti izom?', back: 'A kulcscsont alsó felszínének középső harmadán, a kulcscsont alatti izom barázdájában (sulcus musculi subclavii).', sourceIds: ANAT },
  { id: 'fc-sub-innervation', muscleId: M, topic: 'innervation', front: 'Mi idegzi be a kulcscsont alatti izmot?', back: 'A kulcscsont alatti ideg (n. subclavius); a karfonat felső törzséből ered, rostjai főként a C5–C6 szegmentumokból származnak.', sourceIds: ['statpearls-pectoral', 'moore-coa'] },
  { id: 'fc-sub-function', muscleId: M, topic: 'function', front: 'Melyek a kulcscsont alatti izom funkciói?', back: 'A kulcscsontot süllyeszti és rögzíti (mozgás közben stabilizálja); a vállövet süllyeszti; rögzített kulcscsontnál az 1. bordát emelheti.', sourceIds: ['openstax-ap2e', 'statpearls-pectoral', 'moore-coa'] },
  { id: 'fc-sub-joints', muscleId: M, topic: 'joints', front: 'Mely ízületeken hat a kulcscsont alatti izom?', back: 'Közvetlenül a kulcscsontra hat, így a szegycsont-kulcscsonti ízületnél; a vállcsúcs-kulcscsonti ízületet csak közvetve, a kulcscsont helyzetén keresztül érinti. A vállízületen nem fut át.', sourceIds: ['statpearls-sc-joint', 'ludewig-2009', 'neumann-kinesiology'] },
  { id: 'fc-sub-roles-depression', muscleId: M, topic: 'roles', front: 'A kulcscsont süllyesztése: mi a kulcscsont alatti izom szerepe, és kik az antagonisták?', back: 'Agonista. Antagonisták a vállöv emelői: a csuklyásizom (felső része) és a lapockaemelő izom.', sourceIds: KIN },
  { id: 'fc-sub-roles-girdle', muscleId: M, topic: 'roles', front: 'A vállöv süllyesztése: mi a kulcscsont alatti izom szerepe?', back: 'Szinergista. A fő mozgatók a kis mellizom, a csuklyásizom alsó része és a széles hátizom.', sourceIds: KIN },
  { id: 'fc-sub-protection', muscleId: M, topic: 'stabilization', front: 'Milyen védő szerepe lehet a kulcscsont alatti izomnak?', back: 'Lehetséges anatómiai védőréteg: a kulcscsont és az alatta futó karfonat, illetve a kulcscsont alatti erek között fekszik. Ez nem igazolt klinikai védelem – elmozdult törtdarab ép izom mellett is összenyomhatja az ereket és az idegeket.', sourceIds: ['statpearls-pectoral', 'gill-2013'] },
  { id: 'fc-sub-variants', muscleId: M, topic: 'regions', front: 'Milyen változatai vannak a kulcscsont alatti izomnak?', back: 'Külön kell választani: a hollócsőrnyúlvány felé futó rostos nyúlvány (egy boncolásos mintában 52-ből 49 esetben); a ritka, rendhagyó izmos tapadás a hollócsőrnyúlványon; a járulékos „subclavius posticus”, amely a lapocka felső szélén vagy a hollócsőrnyúlványon tapadhat. Az izom hiánya és a többszörös izomköteg is dokumentált.', sourceIds: ['statpearls-pectoral', 'crepaz-eger-2022', 'prommahom-2026'] },
  { id: 'fc-sub-shrug', muscleId: M, topic: 'exercise', front: 'Vállvonogatásnál mi a kulcscsont alatti izom szerepe?', back: 'Antagonista: a vállöv emelésekor az eredése (1. borda) és a tapadása (kulcscsont) távolodik, tehát a hossza nő; leengedéskor csökken. Hogy közben aktív-e, abból nem következik – a leengedést a súly is létrehozhatja.', sourceIds: ['neumann-kinesiology', 'statpearls-pectoral'] },
  { id: 'fc-sub-inspiration', muscleId: M, topic: 'contraction', front: 'Az 1. borda emelésekor melyik vége mozog a kulcscsont alatti izomnak?', back: 'Rögzített kulcscsontnál az eredés (1. borda) mozdulhat a tapadás (kulcscsont) felé. A modell ezt aktív rövidülésként (koncentrikusan) mutatja; a belégzés közbeni aktivitását nem mérték.', sourceIds: ['statpearls-pectoral'] }
];

/* ------------------------------------------------------------------ */
/* Feladatok                                                           */
/* ------------------------------------------------------------------ */

export const subQuestions: StudyQuestion[] = [
  /* --- Elnevezés --- */
  mc('q-sub-name-la', 'name', 'Mi a kulcscsont alatti izom latin neve?', ['Musculus subclavius', 'Musculus subscapularis', 'Musculus supraspinatus', 'Musculus pectoralis minor'], 0, 'A „sub” alatt, a „clavis/clavicula” kulcscsont – az izom a kulcscsont alatt fekszik. A musculus subscapularis a lapocka alatti izom.', ['fipat-ta2'], 'anatomia'),
  fill('q-sub-name-en', 'name', 'A kulcscsont alatti izom angol neve: ___.', ['subclavius', 'subscapularis', 'serratus', 'supraspinatus'], 'subclavius', 'Subclavius; a latin név is ugyanez (musculus subclavius).', ['fipat-ta2'], 'anatomia'),
  mc('q-sub-name-confuse', 'name', 'Melyik izmot keverik össze gyakran a kulcscsont alatti izommal a hasonló név miatt?', ['A lapocka alatti izmot (m. subscapularis)', 'A nagy mellizmot', 'A deltaizmot', 'A kétfejű karizmot'], 0, 'Subclavius (kulcscsont alatti) és subscapularis (lapocka alatti): mindkettő „sub-” előtagú, de egészen más helyen fekszenek és más a működésük.', ['fipat-ta2'], 'anatomia'),
  match('q-sub-name-matching', 'name', 'Párosítsd a magyar nevet a latin névvel!', [['Kulcscsont alatti izom', 'M. subclavius'], ['Lapocka alatti izom', 'M. subscapularis'], ['Kis mellizom', 'M. pectoralis minor'], ['Elülső fűrészizom', 'M. serratus anterior']], 'A „sub” előtag „alatt”-ot jelent: a subclavius a kulcscsont, a subscapularis a lapocka alatt (elülső felszínén) fekszik.', ['fipat-ta2'], 'anatomia'),

  /* --- Eredés --- */
  mc('q-sub-origin', 'origin', 'Honnan ered a kulcscsont alatti izom?', ['Az 1. bordáról és bordaporcáról', 'A 3–5. bordáról', 'A szegycsont markolatáról', 'A lapocka hollócsőrnyúlványáról'], 0, 'Az 1. borda és bordaporca, a kulcscsont-borda szalag előtt. A 3–5. bordáról a kis mellizom ered.', ANAT, 'anatomia'),
  fill('q-sub-origin-ligament', 'origin', 'Eredése az 1. bordán a kulcscsont-___ szalag előtt van.', ['borda', 'szegycsont', 'vállcsúcs', 'hollócsőr'], 'borda', 'A kulcscsont-borda szalag (lig. costoclaviculare) köti a kulcscsontot az 1. bordához; az izom eredése ez előtt van.', ['statpearls-pectoral'], 'anatomia'),
  mc('q-sub-origin-which-rib', 'origin', 'Hányadik bordán ered a kulcscsont alatti izom?', ['Az 1. bordán', 'A 2. bordán', 'A 3. bordán', 'A 12. bordán'], 0, 'A legfelső, 1. bordán, annak a bordaporccal való találkozásánál.', ANAT, 'anatomia'),
  {
    id: 'q-sub-diagram-origin',
    muscleId: M,
    topic: 'origin',
    type: 'diagram-identify',
    task: 'origin',
    viewId: 'anterior',
    prompt: 'Jelöld meg az ábrán azt a csontos képletet, amelyről a kulcscsont alatti izom ered!',
    correctStructureIds: ['bone-ribs', 'bone-costal-cartilages'],
    selectableStructureIds: ['bone-ribs', 'bone-costal-cartilages', 'bone-clavicle', 'bone-sternum', 'bone-scapula', 'bone-humerus'],
    explanation: 'Az 1. borda és bordaporca határán ered – a borda és a bordaporc is elfogadott válasz.',
    sourceIds: ANAT,
    relatedPath: 'anatomia'
  },

  /* --- Tapadás --- */
  mc('q-sub-insertion', 'insertion', 'Hol tapad a kulcscsont alatti izom?', ['A kulcscsont alsó felszínének középső harmadán', 'A kulcscsont felső felszínén', 'A hollócsőrnyúlványon', 'A felkarcsont nagy gumóján'], 0, 'A kulcscsont alsó felszínének középső harmadán, a kulcscsont alatti izom barázdájában. A hollócsőrnyúlványon a kis mellizom tapad.', ANAT, 'anatomia'),
  fill('q-sub-insertion-third', 'insertion', 'A tapadás a kulcscsont alsó felszínének ___ harmadán van.', ['középső', 'belső', 'külső', 'felső'], 'középső', 'A középső harmadon, a sulcus musculi subclavii nevű barázdában.', ['statpearls-pectoral', 'moore-coa'], 'anatomia'),
  mc('q-sub-insertion-variant', 'insertion', 'Milyen rendhagyó izmos tapadást írnak le?', ['Ritkán a hollócsőrnyúlványon, vagy a kulcscsonton és a hollócsőrnyúlványon is tapad', 'A felkarcsonton tapad', 'A szegycsonton tapad', 'A 2. bordán tapad'], 0, 'A StatPearls szerint ritkán a kulcscsont helyett (vagy mellett) a hollócsőrnyúlványon tapad. Ettől külön kell választani a hollócsőrnyúlvány felé futó rostos nyúlványt, amelyet egy boncolásos mintában 52-ből 49 esetben találtak.', ['statpearls-pectoral', 'crepaz-eger-2022'], 'anatomia'),
  {
    id: 'q-sub-diagram-insertion',
    muscleId: M,
    topic: 'insertion',
    type: 'diagram-identify',
    task: 'insertion',
    viewId: 'anterior',
    prompt: 'Jelöld meg az ábrán azt a csontot, amelyen a kulcscsont alatti izom tapad!',
    correctStructureIds: ['bone-clavicle'],
    selectableStructureIds: ['bone-ribs', 'bone-costal-cartilages', 'bone-clavicle', 'bone-sternum', 'bone-scapula', 'bone-humerus'],
    explanation: 'A kulcscsont alsó felszínén tapad – ezért a kulcscsontot mozgatja és rögzíti.',
    sourceIds: ANAT,
    relatedPath: 'anatomia'
  },

  /* --- Beidegzés --- */
  mc('q-sub-innerv', 'innervation', 'Melyik ideg látja el a kulcscsont alatti izmot?', ['A kulcscsont alatti ideg (n. subclavius)', 'A belső mellizomideg', 'A hosszú mellkasi ideg', 'A hónaljideg'], 0, 'A saját idege, a n. subclavius. A belső mellizomideg a kis és a nagy mellizmot, a hosszú mellkasi ideg az elülső fűrészizmot látja el.', ['statpearls-pectoral', 'moore-coa'], 'anatomia'),
  mc('q-sub-innerv-trunk', 'innervation', 'A karfonat melyik részéből ered a kulcscsont alatti ideg?', ['A felső törzsből (truncus superior)', 'A belső kötegből', 'A külső kötegből', 'A hátsó kötegből'], 0, 'A felső törzsből; a mellizomidegek viszont kötegekből erednek (külső és belső köteg).', ['moore-coa'], 'anatomia'),
  mc('q-sub-innerv-segments', 'innervation', 'Mely gerincvelői szegmentumokból kap rostokat a kulcscsont alatti ideg?', ['C5–C6', 'C8–T1', 'T2–T4', 'C1–C2'], 0, 'Főként C5–C6 (a Moore szerint). A belső mellizomideg C8–T1.', ['moore-coa'], 'anatomia'),
  match('q-sub-innerv-matching', 'innervation', 'Párosítsd az izmot a beidegző idegével!', [['Kulcscsont alatti izom', 'N. subclavius'], ['Kis mellizom', 'N. pectoralis medialis'], ['Elülső fűrészizom', 'N. thoracicus longus']], 'A mellkas elülső falának vállöv-izmai különböző idegeket kapnak a karfonatból.', ['statpearls-pectoral', 'moore-coa'], 'anatomia'),

  /* --- Funkció --- */
  mc('q-sub-func-main', 'function', 'Mi a kulcscsont alatti izom fő feladata?', ['A kulcscsontot süllyeszti és rögzíti – mozgás közben stabilizálja', 'A felkart befelé forgatja', 'A lapockát a gerinc felé húzza', 'A kart emeli'], 0, 'Az OpenStax szerint mozgás közben a kulcscsontot süllyesztve stabilizálja; a Moore „rögzíti és süllyeszti” megfogalmazást használ.', ['openstax-ap2e', 'moore-coa'], 'anatomia'),
  mc('q-sub-func-rib', 'function', 'Mit tehet a kulcscsont alatti izom, ha a kulcscsont rögzített?', ['Az 1. bordát emelheti', 'A kulcscsontot emeli', 'A felkart közelíti', 'A 3–5. bordát emeli'], 0, 'Rögzített kulcscsontnál az eredés (1. borda) mozdulhat a tapadás felé – az izom az 1. bordát emelheti (tankönyvi mechanizmus).', ['statpearls-pectoral'], 'biomechanika'),
  mc('q-sub-func-not', 'function', 'Melyik mozgást NEM végzi a kulcscsont alatti izom?', ['A vállöv emelését', 'A kulcscsont süllyesztését', 'A vállöv süllyesztését', 'Az 1. borda emelését (rögzített kulcscsontnál)'], 0, 'A vállöv emelése a csuklyásizom felső részének és a lapockaemelő izomnak a feladata; ebben a kulcscsont alatti izom antagonista.', KIN, 'biomechanika'),
  fill('q-sub-func-shoulder', 'function', 'A StatPearls szerint a kulcscsont alatti izom a vállat ___.', ['süllyeszti', 'emeli', 'kifelé forgatja', 'hátrahúzza'], 'süllyeszti', 'A vállat (vállövet) süllyeszti, és az 1. bordát emeli.', ['statpearls-pectoral'], 'anatomia'),
  match('q-sub-func-matching', 'function', 'Párosítsd a mozgást a kulcscsont alatti izom szerepével!', [['A kulcscsont süllyesztése', 'Agonista'], ['A vállöv süllyesztése', 'Szinergista'], ['A vállöv emelése (vállvonogatás)', 'Antagonista']], 'A kulcscsont süllyesztésében fő mozgató, a vállöv süllyesztésében segítő, a vállöv emelésével ellentétesen hat.', KIN, 'biomechanika'),

  /* --- Érintett ízületek --- */
  mc('q-sub-joint-sc', 'joints', 'Melyik ízületben mozdul el a kulcscsont, amikor a kulcscsont alatti izom süllyeszti?', ['A szegycsont-kulcscsonti ízületben', 'A vállízületben', 'A könyökízületben', 'A csigolyaközti ízületekben'], 0, 'A kulcscsont belső vége a szegycsonttal ízesül; a süllyesztés ebben az ízületben jön létre.', KIN, 'anatomia'),
  mc('q-sub-joint-gh', 'joints', 'Fut-e át a kulcscsont alatti izom a vállízületen?', ['Nem – az 1. bordától a kulcscsontig fut', 'Igen, a felkarcsonton tapad', 'Igen, a lapockán át', 'Csak emelt karnál'], 0, 'Eredése és tapadása is a törzsön/vállövön van, a felkarcsonthoz nem tapad, így a vállízületet közvetlenül nem mozgatja.', ANAT, 'anatomia'),
  mc('q-sub-joint-ac', 'joints', 'A szegycsont-kulcscsonti ízületen kívül melyik ízületet érinti közvetve, a kulcscsont helyzetén keresztül?', ['A vállcsúcs-kulcscsonti ízületet', 'A könyökízületet', 'A csuklóízületet', 'A csípőízületet'], 0, 'Az izom közvetlenül a kulcscsontra hat, a lapockáig nem ér el. A kulcscsont külső vége a lapocka vállcsúcsával ízesül, ezért a kulcscsont helyzete ezt az ízületet közvetve érinti.', ['ludewig-2009', 'neumann-kinesiology'], 'anatomia'),
  fill('q-sub-joint-stab', 'joints', 'A kulcscsont alatti izom a szegycsont-kulcscsonti ízület ___ segíti.', ['stabilitását', 'hajlítását', 'forgatását', 'feszítését'], 'stabilitását', 'A kulcscsontot az 1. borda felé húzva rögzíti – ez a szegycsont-kulcscsonti ízület stabilitását segíti. Egy 12 fős EMG-vizsgálat ezt a stabilizáló szerepet támogatja.', ['statpearls-sc-joint', 'reis-1979'], 'anatomia'),

  /* --- Izomrészek, helyzet --- */
  mc('q-sub-regions-parts', 'regions', 'Hány külön elnevezett része van a kulcscsont alatti izomnak?', ['Nincsenek külön elnevezett részei', 'Kettő', 'Három', 'Négy'], 0, 'Kicsi, egységes izom; a nagy mellizommal ellentétben nincsenek elnevezett részei.', ['fipat-ta2'], 'anatomia'),
  mc('q-sub-regions-shape', 'regions', 'Milyen alakú a kulcscsont alatti izom a StatPearls szerint?', ['Kicsi, háromszög alakú', 'Nagy, legyező alakú', 'Hosszú, kétfejű', 'Rombusz alakú'], 0, 'A StatPearls „apró, háromszög alakú” izomként írja le.', ['statpearls-pectoral'], 'anatomia'),
  mc('q-sub-regions-hidden', 'regions', 'Miért látszik elölnézetből csak kis része az ábrán?', ['Mert a kulcscsont alatt, a kulcscsont mögé bújva fekszik, és a nagy mellizom is takarja', 'Mert a hát felszínén van', 'Mert a felkar takarja', 'Mert csak gyermekkorban van meg'], 0, 'A kulcscsont alsó felszínén tapad, ezért nagy része a csont mögé esik; előtte a nagy mellizom kulcscsonti része fekszik.', ['statpearls-pectoral', 'moore-coa'], 'anatomia'),
  mc('q-sub-regions-absent', 'regions', 'Előfordulhat-e, hogy a kulcscsont alatti izom hiányzik?', ['Igen, a hiánya dokumentált változat', 'Nem, mindig mindkét oldalon megvan', 'Csak a felkarcsont hiányakor', 'Csak idős korban'], 0, 'Az izom hiánya dokumentált változat; többszörös izomköteg is előfordul.', ['statpearls-pectoral', 'crepaz-eger-2022'], 'anatomia'),
  mc('q-sub-regions-posticus', 'regions', 'Mi a „subclavius posticus” változat?', ['Járulékos izom az 1. borda környékétől a lapocka felső széléig vagy a hollócsőrnyúlványig', 'A kulcscsont felső felszínén futó izom', 'A nagy mellizom egyik része', 'A kis mellizom második feje'], 0, 'Járulékos izom: a kulcscsont alatt halad, és a lapocka felső szélén vagy a hollócsőrnyúlványon tapadhat. Nem azonos a tipikus izom hollócsőrnyúlvány felé futó rostos nyúlványával.', ['statpearls-pectoral', 'crepaz-eger-2022', 'prommahom-2026'], 'anatomia'),

  /* --- Szerepek --- */
  mc('q-sub-roles-clav-ag', 'roles', 'A kulcscsont süllyesztésében mi a kulcscsont alatti izom szerepe?', ['Agonista', 'Antagonista', 'Stabilizáló', 'Nem vesz részt'], 0, 'A kulcscsont süllyesztésének fő mozgatója.', ['openstax-ap2e', 'moore-coa'], 'biomechanika'),
  mc('q-sub-roles-girdle', 'roles', 'A vállöv süllyesztésében mi a kulcscsont alatti izom szerepe?', ['Szinergista (segítő)', 'Fő mozgató', 'Antagonista', 'Nem vesz részt'], 0, 'A fő mozgatók a kis mellizom, a csuklyásizom alsó része és a széles hátizom; a kulcscsont alatti izom a kulcscsont süllyesztésével segít.', KIN, 'biomechanika'),
  mc('q-sub-roles-antag', 'roles', 'Melyik izom a kulcscsont süllyesztésének antagonistája?', ['A lapockaemelő izom', 'A kis mellizom', 'A széles hátizom', 'A kulcscsont alatti izom'], 0, 'A vállöv emelői (csuklyásizom felső része, lapockaemelő izom) a süllyesztéssel ellentétesen hatnak.', KIN, 'biomechanika'),
  match('q-sub-roles-matching', 'roles', 'A kulcscsont süllyesztése: párosítsd az izmot a szerepével!', [['Kulcscsont alatti izom', 'Agonista'], ['Kis mellizom', 'Szinergista'], ['Lapockaemelő izom', 'Antagonista']], 'A szemléltetett helyzetben a kulcscsont alatti izom közvetlenül a kulcscsontra hat (agonista); a kis mellizom a lapockára, a széles hátizom a felkarcsontra hat, és a kulcscsontot csak közvetve viszik lefelé (szinergisták); az emelők ellentétesen hatnak.', KIN, 'biomechanika'),
  mc('q-sub-roles-inspiration', 'roles', 'Az 1. borda emelésénél (rögzített kulcscsont) miért kell a vállövet rögzíteni?', ['Hogy az izom a bordát húzza, ne a kulcscsontot', 'Hogy a vállízület ne mozduljon', 'Hogy a nagy mellizom ellazuljon', 'Nem kell rögzíteni'], 0, 'Ha a vállöv rögzített, a kulcscsont alatti izom „fordítva” működhet: a bordát emelheti. A rögzítő izmok (pl. csuklyásizom, lapockaemelő izom) részvétele a modell feltétele, nem mért adat.', KIN, 'biomechanika'),
  mc('q-sub-roles-shrug', 'roles', 'Vállvonogatásnál (a vállak emelése) mi a kulcscsont alatti izom szerepe?', ['Antagonista – a hossza nő', 'Agonista – rövidül', 'Szinergista – rövidül', 'Nyújtott izom'], 0, 'A vállöv emelésének agonistái a csuklyásizom felső része és a lapockaemelő izom; a süllyesztők (köztük a kulcscsont alatti izom) antagonisták, a hosszuk nő. Hogy közben aktívak-e, a mozdulatból nem következik.', KIN, 'gyakorlatok'),

  /* --- Stabilizáló működés --- */
  mc('q-sub-stab-how', 'stabilization', 'Hogyan stabilizálja a kulcscsontot a kulcscsont alatti izom?', ['Az 1. borda felé húzza és ott rögzíti', 'A fej felé emeli', 'A szegycsonttól eltolja', 'A lapocka felé forgatja'], 0, 'A kulcscsontot lefelé, az 1. borda felé húzza – így mozgás közben rögzíti.', ['openstax-ap2e', 'moore-coa'], 'anatomia'),
  mc('q-sub-stab-fracture', 'stabilization', 'Kulcscsonttörésnél milyen védő szerepe lehet?', ['Lehetséges anatómiai védőréteg a karfonat és a kulcscsont alatti erek előtt', 'Megakadályozza a csont gyógyulását', 'Biztosan megakadályozza az ér- és idegsérülést', 'Nincs szerepe'], 0, 'Az izom a kulcscsont és a karfonat, illetve az erek között fekszik, ezért védőréteg lehet. Ez nem igazolt klinikai védelem: egy esetismertetésben az elmozdult törtdarab ép izom mellett is összenyomta a karfonatot és az artériát.', ['statpearls-pectoral', 'gill-2013'], 'anatomia'),
  mc('q-sub-stab-isometric', 'stabilization', 'Ha az izom aktív, de a kulcscsont nem mozdul és az izom hossza közel változatlan, milyen működésről beszélünk?', ['Izometriásról', 'Koncentrikusról', 'Excentrikusról', 'Passzív nyújtásról'], 0, 'Elmozdulás nélküli, aktív feszülés – izometriás működés. Ez a stabilizálás lehetséges formája; hogy milyen gyakori, arra nincs közvetlen mérés.', KIN, 'biomechanika'),
  mc('q-sub-stab-blood', 'stabilization', 'Honnan kapja a vérellátását a kulcscsont alatti izom?', ['A mellkas-vállcsúcsi artéria (a. thoracoacromialis) kulcscsonti ágából', 'A hónaljartéria harmadik szakaszából közvetlenül', 'A belső emlőartériából', 'A lapocka alatti artériából'], 0, 'A StatPearls szerint a mellkas-vállcsúcsi artéria kulcscsonti ága látja el.', ['statpearls-pectoral'], 'anatomia'),

  /* --- Izomműködési típusok --- */
  mc('q-sub-contr-rib', 'contraction', 'A modellben az 1. borda emelésekor (rögzített kulcscsont) milyen működést mutat az izom?', ['Koncentrikus – az eredés közeledik a tapadáshoz', 'Excentrikus', 'Izometriás', 'Passzív nyújtás'], 0, 'Az 1. borda (eredés) emelkedik a kulcscsont (tapadás) felé: rövidülés, tehát koncentrikus működés. Ez a modell feltétele; a belégzés közbeni aktivitást nem mérték.', ['statpearls-pectoral'], 'biomechanika'),
  mc('q-sub-contr-shrug-up', 'contraction', 'Vállvonogatás emelő szakaszában hogyan változik a kulcscsont alatti izom hossza?', ['Hosszabbodik', 'Rövidül', 'Nem változik', 'Felváltva rövidül és hosszabbodik'], 0, 'A kulcscsont emelkedik, az eredés (1. borda) és a tapadás (kulcscsont) távolodik – a hossza nő. Hogy közben aktív-e, abból nem következik.', ['neumann-kinesiology', 'statpearls-pectoral'], 'gyakorlatok'),
  fill('q-sub-contr-pulldown', 'contraction', 'A modell feltevése szerint lapocka-lehúzáskor (a vállak lehúzása a kábel ellenében) a kulcscsont alatti izom ___ működik, szinergistaként.', ['koncentrikusan', 'excentrikusan', 'passzívan', 'nem'], 'koncentrikusan', 'A kulcscsont lefelé mozdul, az izom rövidül – ha a modell szerint aktív, ez koncentrikus működés. Az aktivitását ebben a gyakorlatban nem mérték.', ['neumann-kinesiology', 'statpearls-pectoral'], 'gyakorlatok'),
  match('q-sub-contr-matching', 'contraction', 'Lapocka-lehúzás csigán: párosítsd a szakaszt a kulcscsont alatti izom működésével!', [['A vállak lehúzása', 'Koncentrikus'], ['Megtartás lent', 'Izometriás'], ['Visszaengedés', 'Excentrikus']], 'Mindhárom szakaszban aktív lehet; csak a hosszváltozás iránya más.', KIN, 'gyakorlatok'),

  /* --- Gyakorlatok --- */
  mc('q-sub-ex-specific', 'exercise', 'Van-e kifejezetten a kulcscsont alatti izomra épülő edzőtermi gyakorlat?', ['Nincs – azokban a gyakorlatokban dolgozik, amelyek a vállövet süllyesztik', 'Igen, a fekvenyomás', 'Igen, a bicepszhajlítás', 'Igen, a guggolás'], 0, 'Kicsi, mély izom; a vállöv süllyesztésében (pl. lapocka-lehúzás, támasz) szinergistaként dolgozik. Aktivitását gyakorlatokban nem mérték.', ['neumann-kinesiology', 'statpearls-pectoral'], 'gyakorlatok'),
  mc('q-sub-ex-pulldown-elbow', 'exercise', 'Lapocka-lehúzásnál csigán mi a helyes könyökhelyzet?', ['Végig nyújtott – csak a vállöv mozog', 'A könyök hajlik', 'A könyök 90°-ban hajlított', 'Mindegy'], 0, 'Ha a könyök hajlik, a gyakorlat hagyományos lehúzásba vált.', ['nsca-essentials', 'neumann-kinesiology'], 'gyakorlatok'),
  mc('q-sub-ex-shrug-movers', 'exercise', 'Vállvonogatásnál melyik izmok a fő mozgatók?', ['A csuklyásizom felső része és a lapockaemelő izom', 'A kulcscsont alatti izom és a kis mellizom', 'A nagy mellizom és a deltaizom', 'A kétfejű és a háromfejű karizom'], 0, 'Ők emelik a vállövet; a süllyesztők (kulcscsont alatti izom, kis mellizom) antagonisták.', KIN, 'gyakorlatok'),
  mc('q-sub-ex-dip', 'exercise', 'Lapocka-süllyesztés támaszban: mi mozdul el valójában a vállak lehúzásakor?', ['A törzs emelkedik – a kéz rögzített (zárt lánc)', 'A kéz emelkedik', 'A korlát mozdul', 'Semmi'], 0, 'Zárt láncban a süllyesztők a törzset emelik a vállövhöz képest.', KIN, 'gyakorlatok'),
  mc('q-sub-ex-chain', 'exercise', 'Melyik gyakorlat nyitott láncú?', ['A lapocka-lehúzás csigán', 'A lapocka-süllyesztés támaszban', 'A fekvőtámasz plusz', 'A tolódzkodás'], 0, 'A csigán végzett lehúzásnál a törzs rögzített, a vállöv mozog a kábel ellenállásával szemben; a többi zárt láncú (a kéz rögzített).', KIN, 'gyakorlatok'),

  /* --- Izomfelismerés az ábrán --- */
  {
    id: 'q-sub-diagram-anterior',
    muscleId: M,
    topic: 'recognition',
    type: 'diagram-identify',
    task: 'muscle',
    viewId: 'anterior',
    prompt: 'Elölnézet (a felületes izmok áttetszők): kattints a kulcscsont alatti izomra!',
    correctStructureIds: ['muscle-subclavius'],
    selectableStructureIds: ['muscle-subclavius', 'muscle-pectoralis-minor', 'muscle-pectoralis-major-clavicular', 'muscle-deltoid-anterior', 'muscle-coracobrachialis'],
    explanation: 'A kulcscsont alsó széle alatt, az 1. borda és a kulcscsont között látszik – kis része kilóg a kulcscsont alól.',
    sourceIds: ANAT,
    relatedPath: 'anatomia'
  },
  {
    id: 'q-sub-diagram-lateral',
    muscleId: M,
    topic: 'recognition',
    type: 'diagram-identify',
    task: 'muscle',
    viewId: 'lateral',
    prompt: 'Oldalnézet: kattints a kulcscsont alatti izomra!',
    correctStructureIds: ['muscle-subclavius'],
    selectableStructureIds: ['muscle-subclavius', 'muscle-pectoralis-minor', 'muscle-pectoralis-major-clavicular', 'muscle-deltoid-anterior', 'muscle-coracobrachialis'],
    explanation: 'Oldalról az 1. borda elejétől fel-hátra fut a kulcscsont alsó felszínéig, a kis mellizom fölött.',
    sourceIds: ANAT,
    relatedPath: 'anatomia'
  },
  {
    id: 'q-sub-diagram-synergist',
    muscleId: M,
    topic: 'recognition',
    type: 'diagram-identify',
    task: 'muscle',
    viewId: 'anterior',
    prompt: 'Elölnézet: kattints arra a mély izomra, amely a vállöv süllyesztésének fő mozgatója (a kulcscsont alatti izom ebben csak segít)!',
    correctStructureIds: ['muscle-pectoralis-minor'],
    selectableStructureIds: ['muscle-subclavius', 'muscle-pectoralis-minor', 'muscle-serratus-anterior', 'muscle-coracobrachialis', 'muscle-pectoralis-major-sternocostal'],
    explanation: 'A kis mellizom a 3–5. bordától a hollócsőrnyúlványig fut, és a lapockát lefelé és előre húzza.',
    sourceIds: ['neumann-kinesiology', 'statpearls-pectoral'],
    relatedPath: 'biomechanika'
  },
  {
    id: 'q-sub-diagram-lat',
    muscleId: M,
    topic: 'recognition',
    type: 'diagram-identify',
    task: 'muscle',
    viewId: 'anterior',
    prompt: 'Elölnézet: kattints arra az izomra, amely a felkarcsonton keresztül süllyeszti a vállövet!',
    correctStructureIds: ['muscle-latissimus-dorsi'],
    selectableStructureIds: ['muscle-subclavius', 'muscle-pectoralis-minor', 'muscle-latissimus-dorsi', 'muscle-serratus-anterior', 'muscle-deltoid-anterior'],
    explanation: 'A széles hátizom a felkarcsonton tapad, és azon keresztül húzza lefelé a vállövet – a süllyesztés egyik fő mozgatója.',
    sourceIds: KIN,
    relatedPath: 'biomechanika'
  }
];
