import type { Flashcard, StudyQuestion } from '../../types';

/**
 * A kis mellizom tanulókártyái és feladatai. Minden feladat az alkalmazásban már megjelenő,
 * forrással ellátott tartalomra épül: az Anatómia modul adatlapjára (StatPearls, OpenStax, Moore,
 * Gray's, Neumann), a Biomechanika modul mozgásaira és a Gyakorlatok modul gyakorlataira (Ludewig
 * 2004, Borstad és Ludewig 2006, Umehara és mtsai 2017).
 */
const M = 'muscle-pectoralis-minor';
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

export const pmiFlashcards: Flashcard[] = [
  { id: 'fc-pmi-name', muscleId: M, topic: 'name', front: 'Kis mellizom – angol és latin név?', back: 'Pectoralis minor – Musculus pectoralis minor', sourceIds: ['fipat-ta2'] },
  { id: 'fc-pmi-shape', muscleId: M, topic: 'regions', front: 'Milyen alakú, és hol fekszik a kis mellizom?', back: 'Vékony, háromszög alakú izom a nagy mellizom alatt (mélyebben), a mellkas elülső falán. Külön elnevezett részei nincsenek.', sourceIds: ['statpearls-pectoral', 'fipat-ta2'] },
  { id: 'fc-pmi-origin', muscleId: M, topic: 'origin', front: 'Hol ered a kis mellizom?', back: 'A 3–5. borda elülső felszínén és szélén, a borda-bordaporc határ közelében. (Egyes tankönyvek a 2–4. bordát adják meg; változatként a 2. bordáról is eredhet.)', sourceIds: ANAT },
  { id: 'fc-pmi-insertion', muscleId: M, topic: 'insertion', front: 'Hol tapad a kis mellizom?', back: 'A lapocka hollócsőrnyúlványának belső szélén és felső felszínén. Ritkán az ín a hollócsőrnyúlványon túl a felkarcsont nagy gumójáig fut.', sourceIds: ANAT },
  { id: 'fc-pmi-innervation', muscleId: M, topic: 'innervation', front: 'Mi idegzi be a kis mellizmot?', back: 'A belső mellizomideg (n. pectoralis medialis, C8–T1); a StatPearls a külső mellizomideget (C5–C7) is megnevezi.', sourceIds: ['moore-coa', 'statpearls-pectoral'] },
  { id: 'fc-pmi-function', muscleId: M, topic: 'function', front: 'Melyek a kis mellizom fő funkciói?', back: 'A lapockát lefelé és előre, a mellkasfalhoz húzza (stabilizálás); süllyeszt, segíti a protrakciót, lefelé rotál és előre billent. Rögzített lapockánál a 3–5. bordát emeli (járulékos belégzés).', sourceIds: ['statpearls-pectoral', 'openstax-ap2e', 'neumann-kinesiology'] },
  { id: 'fc-pmi-joints', muscleId: M, topic: 'joints', front: 'Mely ízületeken (kapcsolatokon) hat a kis mellizom?', back: 'A lapocka-mellkasi kapcsolaton (funkcionális ízület), és a lapocka mozgásán keresztül a vállcsúcs-kulcscsonti és a szegycsont-kulcscsonti ízületen. A vállízületen nem fut át.', sourceIds: KIN },
  { id: 'fc-pmi-depression', muscleId: M, topic: 'roles', front: 'Lapockasüllyesztés: agonisták és antagonisták?', back: 'Agonisták: kis mellizom, csuklyásizom (alsó része), széles hátizom. Antagonisták: lapockaemelő izom, rombuszizmok (és a csuklyásizom felső része).', sourceIds: KIN },
  { id: 'fc-pmi-protraction', muscleId: M, topic: 'roles', front: 'Protrakció: mi a kis mellizom szerepe?', back: 'Szinergista: egyik fő mozgató az elülső fűrészizom. Antagonisták a retraktorok: rombuszizmok, csuklyásizom (középső része).', sourceIds: KIN },
  { id: 'fc-pmi-downward', muscleId: M, topic: 'roles', front: 'A lapocka lefelé rotációja: agonisták és antagonisták?', back: 'Agonisták: rombuszizmok, lapockaemelő izom, kis mellizom. Antagonisták (felfelé rotáló nyomatékot kifejtők): elülső fűrészizom, csuklyásizom – a címke a nyomaték irányát jelöli, nem azt, hogy ereszkedő mozgásban aktívak-e.', sourceIds: KIN },
  { id: 'fc-pmi-stabilization', muscleId: M, topic: 'stabilization', front: 'Milyen stabilizáló szerepe van a kis mellizomnak?', back: 'A lapockát lefelé és előre húzva a mellkasfal közelében tartja; az elülső fűrészizommal együtt – mozgás közben is – stabil alapot ad a karmozgásokhoz és a támaszhelyzetekhez.', sourceIds: ['statpearls-pectoral', 'neumann-kinesiology'] },
  { id: 'fc-pmi-clinical', muscleId: M, topic: 'regions', front: 'Mi fut a kis mellizom alatt, és miért fontos ez?', back: 'A karfonat (plexus brachialis) és a hónaljartéria a hollócsőrnyúlvány alatti térben. Fokozott feszessége szűkítheti ezt a teret (mellkasi kimeneti szindróma). A hónaljartériát a kis mellizomhoz viszonyítva három szakaszra osztják.', sourceIds: ['statpearls-pectoral', 'moore-coa'] },
  { id: 'fc-pmi-inspiration', muscleId: M, topic: 'contraction', front: 'Járulékos belégzésnél melyik vége mozog a kis mellizomnak?', back: 'Rögzített lapockánál az eredés (3–5. borda) mozog a tapadás (hollócsőrnyúlvány) felé: az izom koncentrikusan rövidül, és a bordákat emeli.', sourceIds: ['openstax-ap2e', 'moore-coa'] },
  { id: 'fc-pmi-stretch-best', muscleId: M, topic: 'exercise', front: 'Melyik nyújtás hosszabbította leginkább a kis mellizmot?', back: 'Három nyújtás közül az egykaros önnyújtás (átlagosan 2,24 cm), majd a fekvő (1,69 cm) és az ülő kézi nyújtás (0,77 cm). Elasztográfiával a 90°-os és 150°-os karemelés melletti horizontális távolítás nyújtott a legjobban.', sourceIds: ['borstad-2006', 'umehara-2017'] },
  { id: 'fc-pmi-pushup-plus', muscleId: M, topic: 'exercise', front: 'Fekvőtámasz plusz: mi történik a „plusz” szakaszban?', back: 'Közel nyújtott könyökkel a lapocka a mellkasfal mentén előre mozog (protrakció), közben forog és billen is. Egyik fő mozgatója az elülső fűrészizom, a kis mellizom segít.', sourceIds: ['neumann-kinesiology', 'ludewig-2004'] }
];

/* ------------------------------------------------------------------ */
/* Feladatok                                                           */
/* ------------------------------------------------------------------ */

export const pmiQuestions: StudyQuestion[] = [
  /* --- Elnevezés --- */
  mc('q-pmi-name-la', 'name', 'Mi a kis mellizom latin neve?', ['Musculus pectoralis minor', 'Musculus pectoralis major', 'Musculus subclavius', 'Musculus serratus anterior'], 0, 'A „minor” (kisebb) a nagy mellizomhoz (major) viszonyít; a „pectus” mellkast jelent.', ['fipat-ta2'], 'anatomia'),
  fill('q-pmi-name-en', 'name', 'A kis mellizom angol neve: pectoralis ___.', ['minor', 'major', 'medius', 'longus'], 'minor', 'Pectoralis minor; a nagy mellizom a pectoralis major.', ['fipat-ta2'], 'anatomia'),
  match('q-pmi-name-matching', 'name', 'Párosítsd a magyar nevet a latin névvel!', [['Kis mellizom', 'M. pectoralis minor'], ['Kulcscsont alatti izom', 'M. subclavius'], ['Elülső fűrészizom', 'M. serratus anterior'], ['Lapockaemelő izom', 'M. levator scapulae']], 'A mellkas elülső falának izmai (kis mellizom, kulcscsont alatti izom, elülső fűrészizom) mind a vállövet mozgatják.', ['fipat-ta2', 'openstax-ap2e'], 'anatomia'),
  mc('q-pmi-name-group', 'name', 'Az OpenStax melyik izomcsoportba sorolja a kis mellizmot?', ['A vállövet helyzetbe hozó (pozícionáló) mellkasi izmok közé', 'A felkart mozgató izmok közé', 'A hasfal izmai közé', 'A rotátorköpeny izmai közé'], 0, 'A vállövet pozícionáló elülső mellkasi izmok: kulcscsont alatti izom, kis mellizom, elülső fűrészizom.', ['openstax-ap2e'], 'anatomia'),
  mc('q-pmi-name-meaning', 'name', 'Mire utal a „minor” szó a kis mellizom nevében?', ['A nagy mellizomhoz képest kisebb méretére', 'Arra, hogy csak gyermekkorban működik', 'A beidegző ideg nevére', 'Arra, hogy egy részből áll'], 0, 'A „minor” kisebbet jelent: a kis mellizom vékonyabb és kisebb, mint a felette fekvő nagy mellizom.', ['fipat-ta2', 'statpearls-pectoral'], 'anatomia'),

  /* --- Eredés --- */
  mc('q-pmi-origin-ribs', 'origin', 'Melyik bordákról ered a kis mellizom (a leggyakoribb leírás szerint)?', ['A 3–5. bordáról', 'Az 1–2. bordáról', 'A 6–8. bordáról', 'A 9–12. bordáról'], 0, 'A 3–5. borda elülső felszínéről és széléről, a borda-bordaporc határ közelében ered; egyes tankönyvek a 2–4. bordát adják meg.', ANAT, 'anatomia'),
  fill('q-pmi-origin-junction', 'origin', 'A kis mellizom a 3–5. borda elülső felszínéről ered, a borda-___ határ közelében.', ['bordaporc', 'csigolya', 'szegycsont', 'kulcscsont'], 'bordaporc', 'Az eredés a borda és a bordaporc találkozásánál (costochondralis határ) van.', ['statpearls-pectoral'], 'anatomia'),
  mc('q-pmi-origin-variant', 'origin', 'Melyik eredési változatot írják le a kis mellizomnál?', ['A 2. bordáról is eredhet', 'A kulcscsontról is eredhet', 'A szegycsontról is eredhet', 'A csípőcsontról is eredhet'], 0, 'A StatPearls szerint esetenként a 2. bordáról is ered; az OpenStax „2–4. vagy 3–5. bordát” ír.', ['statpearls-pectoral', 'openstax-ap2e'], 'anatomia'),
  {
    id: 'q-pmi-diagram-origin',
    muscleId: M,
    topic: 'origin',
    type: 'diagram-identify',
    task: 'origin',
    viewId: 'anterior',
    prompt: 'Jelöld meg az ábrán azt a csontot, amelyről a kis mellizom ered!',
    correctStructureIds: ['bone-ribs'],
    selectableStructureIds: ['bone-ribs', 'bone-sternum', 'bone-clavicle', 'bone-scapula', 'bone-humerus', 'bone-costal-cartilages'],
    explanation: 'A kis mellizom a 3–5. borda csontos részéről ered, a bordaporc-határ közelében – nem a bordaporcról és nem a szegycsontról.',
    sourceIds: ANAT,
    relatedPath: 'anatomia'
  },

  /* --- Tapadás --- */
  mc('q-pmi-insertion', 'insertion', 'Hol tapad a kis mellizom?', ['A lapocka hollócsőrnyúlványán', 'A felkarcsont nagy gumójának taraján', 'A kulcscsont alsó felszínén', 'A vállcsúcson'], 0, 'A hollócsőrnyúlvány belső szélén és felső felszínén. A nagy gumó taraján a nagy mellizom, a kulcscsont alsó felszínén a kulcscsont alatti izom tapad.', ANAT, 'anatomia'),
  mc('q-pmi-insertion-shared', 'insertion', 'Melyik izmok erednek ugyanarról a csontnyúlványról, ahol a kis mellizom tapad?', ['A hollócsőr-karizom és a kétfejű karizom rövid feje', 'A deltaizom és a csuklyásizom', 'A tövis feletti és a tövis alatti izom', 'A rombuszizmok'], 0, 'A hollócsőrnyúlványon tapad a kis mellizom, és innen ered a hollócsőr-karizom és a kétfejű karizom rövid feje.', ['moore-coa', 'grays-anatomy'], 'anatomia'),
  mc('q-pmi-insertion-variant', 'insertion', 'Milyen tapadási változatot írnak le?', ['Az ín a hollócsőrnyúlványon túl a felkarcsont nagy gumójáig fut', 'Az ín a kulcscsonton tapad', 'Az ín a szegycsonton tapad', 'Két külön ín tapad a lapockatövisen'], 0, 'A StatPearls szerint ritkán az ín a hollócsőrnyúlványon túl a nagy gumóig fut.', ['statpearls-pectoral'], 'anatomia'),
  {
    id: 'q-pmi-diagram-insertion',
    muscleId: M,
    topic: 'insertion',
    type: 'diagram-identify',
    task: 'insertion',
    viewId: 'anterior',
    prompt: 'Jelöld meg az ábrán azt a csontot, amelyen a kis mellizom tapad!',
    correctStructureIds: ['bone-scapula'],
    selectableStructureIds: ['bone-ribs', 'bone-sternum', 'bone-clavicle', 'bone-scapula', 'bone-humerus'],
    explanation: 'A tapadás a lapocka hollócsőrnyúlványán van – ezért a kis mellizom a lapockát mozgatja, nem a felkart.',
    sourceIds: ANAT,
    relatedPath: 'anatomia'
  },

  /* --- Beidegzés --- */
  mc('q-pmi-innerv-main', 'innervation', 'Melyik ideg a kis mellizom fő idege a Moore szerint?', ['A belső mellizomideg (n. pectoralis medialis)', 'A hosszú mellkasi ideg (n. thoracicus longus)', 'A hónaljideg (n. axillaris)', 'A lapockaháti ideg (n. dorsalis scapulae)'], 0, 'A belső mellizomideg (C8–T1). A StatPearls a külső mellizomideget is megnevezi. A n. thoracicus longus az elülső fűrészizom idege.', ['moore-coa', 'statpearls-pectoral'], 'anatomia'),
  mc('q-pmi-innerv-segments', 'innervation', 'Mely gerincvelői szegmentumokból kap rostokat a belső mellizomideg?', ['C8–T1', 'C5–C7', 'C3–C5', 'T4–T6'], 0, 'Belső mellizomideg: C8–T1; külső mellizomideg: C5–C7.', ['moore-coa'], 'anatomia'),
  mc('q-pmi-innerv-both', 'innervation', 'Mit ír a StatPearls a kis mellizom beidegzéséről?', ['A külső és a belső mellizomideg is ellátja', 'Csak a hosszú mellkasi ideg látja el', 'Csak a kulcscsont alatti ideg látja el', 'A hónaljideg látja el'], 0, 'A StatPearls szerint a kis mellizmot a külső és a belső mellizomideg is ellátja; a Moore főként a belsőt említi. Az alkalmazás mindkettőt jelzi.', ['statpearls-pectoral', 'moore-coa'], 'anatomia'),
  match('q-pmi-innerv-matching', 'innervation', 'Párosítsd az izmot a beidegző idegével!', [['Kis mellizom', 'N. pectoralis medialis'], ['Elülső fűrészizom', 'N. thoracicus longus'], ['Kulcscsont alatti izom', 'N. subclavius']], 'A mellkas elülső falának vállöv-izmai különböző idegeket kapnak a karfonatból.', ['statpearls-pectoral', 'moore-coa'], 'anatomia'),

  /* --- Funkció --- */
  mc('q-pmi-func-main', 'function', 'Mi a kis mellizom fő feladata?', ['A lapockát lefelé és előre, a mellkasfalhoz húzza', 'A felkart befelé forgatja', 'A könyököt hajlítja', 'A lapockát a gerinc felé húzza'], 0, 'A StatPearls szerint a lapocka stabilizálásában kulcsfontosságú: lefelé és előre, a mellkasfalhoz húzza.', ['statpearls-pectoral', 'moore-coa'], 'anatomia'),
  mc('q-pmi-func-not', 'function', 'Melyik mozgást NEM végzi a kis mellizom?', ['A lapocka retrakcióját (a gerinc felé húzását)', 'A lapocka süllyesztését', 'A lapocka lefelé rotációját', 'A lapocka előrebillentését'], 0, 'A retrakció a rombuszizmok és a csuklyásizom feladata; a kis mellizom a protrakciót segíti, tehát a retrakció antagonistája.', KIN, 'biomechanika'),
  mc('q-pmi-func-inspiration', 'function', 'Mikor segítheti a kis mellizom a belégzést?', ['Ha a lapocka rögzített – ekkor a bordákat emeli', 'Mindig, nyugodt légzésnél is', 'Csak kilégzéskor', 'Ha a felkar szabadon lóg'], 0, 'Rögzített lapocka mellett a 3–5. bordát emeli – járulékos belégzőizom.', ['openstax-ap2e', 'moore-coa'], 'biomechanika'),
  fill('q-pmi-func-tilt', 'function', 'A kis mellizom a lapocka felső részét előre-lefelé húzza: a lapockát előre ___.', ['billenti', 'forgatja kifelé', 'emeli', 'húzza hátra'], 'billenti', 'A hollócsőrnyúlványt a bordák felé húzva a lapockát előre billenti (anterior tilt).', KIN, 'biomechanika'),
  mc('q-pmi-func-shoulder', 'function', 'Az OpenStax szerint mozgásokban mit tesz a kis mellizom a vállal?', ['Előre fordítja (pl. dobó mozdulatban)', 'Hátrafelé húzza', 'Felemeli a fül felé', 'Kifelé forgatja a felkart'], 0, 'Az OpenStax: „a vállat előre fordítja (dobó mozdulat)”, és segíti a belégzést.', ['openstax-ap2e'], 'biomechanika'),
  match('q-pmi-func-matching', 'function', 'Párosítsd a mozgást a kis mellizom szerepével!', [['Lapockasüllyesztés', 'Agonista'], ['Protrakció', 'Szinergista'], ['Retrakció', 'Antagonista'], ['Járulékos belégzés (rögzített lapocka)', 'Agonista – a bordákat emeli']], 'A süllyesztésben és a lefelé rotációban fő mozgató, a protrakcióban segítő, a retrakcióval ellentétesen hat.', KIN, 'biomechanika'),

  /* --- Érintett ízületek --- */
  mc('q-pmi-joint-main', 'joints', 'Melyik „ízületen” mozgat elsősorban a kis mellizom?', ['A lapocka-mellkasi kapcsolaton', 'A vállízületen (glenohumeralis)', 'A könyökízületen', 'A csigolyaközti ízületeken'], 0, 'A lapocka-mellkasi kapcsolat funkcionális ízület: itt csúszik a lapocka a mellkasfalon. A kis mellizom a lapockát mozgatja, a felkarcsonthoz nem tapad.', KIN, 'anatomia'),
  mc('q-pmi-joint-gh', 'joints', 'Fut-e át a kis mellizom a vállízületen?', ['Nem – a bordákról a lapockához fut, a felkarcsonthoz (ritka változatoktól eltekintve) nem tapad', 'Igen, a felkarcsonton tapad', 'Igen, a könyökön is', 'Csak emelt karnál'], 0, 'A kis mellizom eredése és tapadása is a törzsön/vállövön van (borda → hollócsőrnyúlvány), ezért a vállízületet közvetlenül nem mozgatja. Ritka változatként az ín a nagy gumóig futhat.', ANAT, 'anatomia'),
  mc('q-pmi-joint-sc', 'joints', 'A lapocka mozgatásakor mely valódi ízületek mozdulnak el?', ['A vállcsúcs-kulcscsonti és a szegycsont-kulcscsonti ízület', 'A vállízület és a könyökízület', 'A csuklóízület', 'Csak a gerinc ízületei'], 0, 'A lapocka a kulcscsonthoz kapcsolódik: mozgása a vállcsúcs-kulcscsonti és a szegycsont-kulcscsonti ízületben jön létre.', KIN, 'anatomia'),
  fill('q-pmi-joint-functional', 'joints', 'A lapocka-mellkasi kapcsolat nem valódi, hanem ___ ízület.', ['funkcionális', 'csontos', 'porcos', 'rostos'], 'funkcionális', 'A lapocka és a mellkasfal között nincs ízületi tok; a lapocka izmokon „csúszik” – ezért funkcionális ízületnek nevezik.', KIN, 'anatomia'),

  /* --- Izomrészek, helyzet --- */
  mc('q-pmi-regions-parts', 'regions', 'Hány külön elnevezett része van a kis mellizomnak?', ['Nincsenek külön elnevezett részei', 'Három (mint a nagy mellizomnak)', 'Kettő', 'Négy'], 0, 'A nagy mellizommal ellentétben a kis mellizomnak nincsenek külön elnevezett részei.', ['fipat-ta2'], 'anatomia'),
  mc('q-pmi-regions-layer', 'regions', 'Hol fekszik a kis mellizom a nagy mellizomhoz képest?', ['Alatta, mélyebben', 'Fölötte, felületesen', 'Mellette, oldalt', 'Mögötte, a lapocka hátsó felszínén'], 0, 'A kis mellizom vékonyabb, háromszög alakú, és a nagy mellizom alatt fekszik.', ['statpearls-pectoral'], 'anatomia'),
  mc('q-pmi-regions-shape', 'regions', 'Milyen alakú a kis mellizom?', ['Vékony, háromszög alakú', 'Vastag, legyező alakú', 'Hengeres, kétfejű', 'Rombusz alakú'], 0, 'A StatPearls szerint a nagy mellizomnál sokkal vékonyabb és háromszög alakú.', ['statpearls-pectoral'], 'anatomia'),
  mc('q-pmi-regions-axilla', 'regions', 'Melyik testtáj falát alkotja a kis mellizom a nagy mellizommal együtt?', ['A hónalj elülső falát', 'A hónalj hátsó falát', 'A has elülső falát', 'A nyak oldalsó falát'], 0, 'A nagy és a kis mellizom a hónalj (axilla) elülső falát alkotja.', ['moore-coa'], 'anatomia'),
  mc('q-pmi-regions-artery', 'regions', 'Hány szakaszra osztják a hónaljartériát a kis mellizomhoz viszonyítva?', ['Háromra', 'Kettőre', 'Négyre', 'Nem osztják szakaszokra'], 0, 'A hónaljartériát három szakaszra osztják: a kis mellizomtól mediálisan, a kis mellizom mögött és attól laterálisan fekvő szakaszra.', ['moore-coa'], 'anatomia'),

  /* --- Szerepek --- */
  mc('q-pmi-roles-protraction', 'roles', 'A lapocka protrakciójában mi a kis mellizom szerepe?', ['Szinergista (segítő)', 'Fő mozgató (agonista)', 'Antagonista', 'Nem vesz részt'], 0, 'A protrakció egyik fő mozgatója az elülső fűrészizom; a kis mellizom segíti.', KIN, 'biomechanika'),
  mc('q-pmi-roles-depression-antag', 'roles', 'Melyik izom a lapockasüllyesztés antagonistája?', ['A lapockaemelő izom', 'A széles hátizom', 'A kulcscsont alatti izom', 'A kis mellizom'], 0, 'A lapockaemelő izom (és a rombuszizmok, a csuklyásizom felső része) a lapockát emeli – a süllyesztéssel ellentétesen.', KIN, 'biomechanika'),
  mc('q-pmi-roles-downward', 'roles', 'Melyik izom NEM agonista a lapocka lefelé rotációjában?', ['Az elülső fűrészizom', 'A rombuszizmok', 'A lapockaemelő izom', 'A kis mellizom'], 0, 'Az elülső fűrészizom felfelé rotáló nyomatékot fejt ki, ezért a lefelé rotáció antagonistájaként jelöljük. A címke a nyomaték irányát jelöli; hogy egy ereszkedő mozgásban aktív-e, abból nem következik.', KIN, 'biomechanika'),
  match('q-pmi-roles-matching', 'roles', 'Lapockasüllyesztés: párosítsd az izmot a szerepével!', [['Kis mellizom', 'Agonista'], ['Kulcscsont alatti izom', 'Szinergista'], ['Lapockaemelő izom', 'Antagonista']], 'A szemléltetett helyzetben az agonisták a kis mellizom (a lapockára hat), a csuklyásizom alsó része és a széles hátizom (a felkarcsontra hat); a kulcscsont alatti izom közvetlenül a kulcscsontra hat – süllyeszti és rögzíti –, ezért itt szinergista.', ['neumann-kinesiology', 'openstax-ap2e'], 'biomechanika'),
  mc('q-pmi-roles-inspiration-stab', 'roles', 'Járulékos belégzésnél miért kell a lapockát rögzíteni?', ['Hogy a kis mellizom a bordákat húzza, ne a lapockát', 'Hogy a vállízület ne mozduljon', 'Hogy a nagy mellizom ellazuljon', 'Nem kell rögzíteni'], 0, 'Ha a lapocka rögzített (rombuszizmok, csuklyásizom, lapockaemelő izom), a kis mellizom „fordítva” működik: a bordákat emeli.', KIN, 'biomechanika'),
  mc('q-pmi-roles-tilt-antag', 'roles', 'A lapocka előrebillentésének antagonistái között melyik izom szerepel az alkalmazásban?', ['Az elülső fűrészizom', 'A kis mellizom', 'A kulcscsont alatti izom', 'A hollócsőr-karizom'], 0, 'A karemelés közben bemutatott hátrabillentéshez az elülső fűrészizom és a csuklyásizom alsó része hozzájárulhat (oktatási modell szintű besorolás).', KIN, 'biomechanika'),

  /* --- Stabilizáló működés --- */
  mc('q-pmi-stab-wall', 'stabilization', 'Hogyan stabilizálja a kis mellizom a lapockát?', ['Lefelé és előre, a mellkasfalhoz húzza', 'A gerinc felé húzza', 'Felfelé emeli', 'Kifelé forgatja'], 0, 'A lapockát a mellkasfalhoz rögzíti azáltal, hogy lefelé és előre húzza.', ['statpearls-pectoral', 'moore-coa'], 'anatomia'),
  mc('q-pmi-stab-partner', 'stabilization', 'Melyik izommal együtt tartja a kis mellizom a lapockát a mellkasfalon?', ['Az elülső fűrészizommal', 'A deltaizommal', 'A kétfejű karizommal', 'A tövis alatti izommal'], 0, 'Az elülső fűrészizommal együtt a lapockát a mellkasfalon tartja – stabil alapot adva a karmozgásokhoz.', KIN, 'anatomia'),
  mc('q-pmi-stab-dip', 'stabilization', 'Tolódzkodás kiinduló támaszában milyen működéssel tartják a süllyesztők (köztük a kis mellizom) a vállakat lent?', ['Izometriással', 'Csak koncentrikussal', 'Passzívan, aktivitás nélkül', 'Excentrikussal'], 0, 'A vállak lent tartása mozgás nélküli, aktív feszülés – izometriás működés.', ['neumann-kinesiology', 'nsca-essentials'], 'gyakorlatok'),
  mc('q-pmi-stab-tension', 'stabilization', 'Mit okozhat a kis mellizom fokozott feszessége?', ['A lapocka kedvezőtlen helyzetét és a vállmozgás zavarát', 'A könyök hajlíthatatlanságát', 'A csípő mozgásának beszűkülését', 'Semmilyen változást'], 0, 'A StatPearls szerint kóros feszessége kedvezőtlenül befolyásolja a lapocka helyzetét és a váll mozgását; mellkasi kimeneti szindrómát is okozhat.', ['statpearls-pectoral'], 'anatomia'),

  /* --- Izomműködési típusok --- */
  mc('q-pmi-contr-dip-up', 'contraction', 'Lapocka-süllyesztés támaszban: amikor a vállak a fül felé emelkednek (a test lejjebb kerül), milyen működést végez a kis mellizom?', ['Excentrikus', 'Koncentrikus', 'Passzív', 'Nem aktív'], 0, 'A testsúly felfelé tolja a vállövet, a süllyesztők hosszabbodva fékeznek – excentrikus működés.', ['neumann-kinesiology'], 'gyakorlatok'),
  mc('q-pmi-contr-plus', 'contraction', 'A bemutatott mechanikai modell szerint a fekvőtámasz plusz „plusz” szakaszában (protrakció) a kis mellizom hossza…', ['…rövidül (koncentrikus, szinergistaként)', '…hosszabbodik (excentrikus)', '…változatlan (izometriás)', '…nem változik, mert nem aktív'], 0, 'A modellben a protrakcióban a kis mellizom szinergista, és rövidülve segíti az elülső fűrészizmot. A hosszváltozás a modell feltevése; a fekvőtámasz plusz EMG-vizsgálatai az izomhosszt nem mérték.', KIN, 'gyakorlatok'),
  fill('q-pmi-contr-inspiration', 'contraction', 'Járulékos belégzésnél a kis mellizom ___ működik: a bordák a rögzített hollócsőrnyúlvány felé emelkednek.', ['koncentrikusan', 'excentrikusan', 'passzívan', 'izometriásan'], 'koncentrikusan', 'Az eredés közeledik a tapadáshoz – rövidülés, tehát koncentrikus működés.', ['openstax-ap2e', 'moore-coa'], 'biomechanika'),
  match('q-pmi-contr-matching', 'contraction', 'Lapocka-süllyesztés támaszban: párosítsd a szakaszt a kis mellizom működésével!', [['A vállak emelkednek', 'Excentrikus'], ['Megtartás felül', 'Izometriás'], ['A vállak lehúzása', 'Koncentrikus']], 'Ugyanaz az izom dolgozik mindhárom szakaszban; csak a hosszváltozás iránya más.', ['neumann-kinesiology'], 'gyakorlatok'),

  /* --- Gyakorlatok --- */
  mc('q-pmi-ex-stretch-best', 'exercise', 'Három kis mellizom-nyújtást összehasonlítva melyik hosszabbította leginkább az izmot?', ['Az egykaros önnyújtás', 'A fekvő kézi nyújtás', 'Az ülő kézi nyújtás', 'Mindhárom azonos volt'], 0, 'Borstad és Ludewig (2006): egykaros önnyújtás 2,24 cm, fekvő kézi nyújtás 1,69 cm, ülő kézi nyújtás 0,77 cm.', ['borstad-2006'], 'gyakorlatok'),
  mc('q-pmi-ex-stretch-position', 'exercise', 'Egy elasztográfiás vizsgálat szerint melyik nyújtási helyzet volt a leghatékonyabb a kis mellizomra?', ['Horizontális távolítás 90°-os vagy 150°-os karemelésnél', 'Vállhajlítás 30°-nál', 'Lapocka-retrakció 150°-nál', 'Leengedett kar, semleges helyzet'], 0, 'Umehara és mtsai (2017): a 90°-os és a 150°-os karemelés melletti horizontális távolítás nyújtott a legjobban; a retrakció és a hajlítás kevésbé.', ['umehara-2017'], 'gyakorlatok'),
  mc('q-pmi-ex-stretch-mechanism', 'exercise', 'Miért kell a lapockának hátra mozdulnia a kis mellizom nyújtásakor?', ['Mert az izom a lapocka hollócsőrnyúlványán tapad – csak a lapocka mozgása távolítja a tapadást a bordáktól', 'Mert az izom a felkarcsonton tapad', 'Mert a könyököt is nyújtani kell', 'Nem kell; elég a kart mozgatni'], 0, 'A kis mellizom borda → hollócsőrnyúlvány között fut; hosszát a lapocka helyzete (retrakció, hátrabillenés) változtatja.', ['neumann-kinesiology', 'statpearls-pectoral'], 'gyakorlatok'),
  mc('q-pmi-ex-plus-main', 'exercise', 'Fekvőtámasz plusz „plusz” szakaszában melyik izom a fő mozgató?', ['Az elülső fűrészizom', 'A kis mellizom', 'A nagy mellizom', 'A háromfejű karizom'], 0, 'A protrakció egyik fő mozgatója az elülső fűrészizom; a kis mellizom segít, a háromfejű karizom a közel nyújtott könyököt tartja.', ['neumann-kinesiology'], 'gyakorlatok'),
  mc('q-pmi-ex-plus-study', 'exercise', 'Ludewig és mtsai négy fekvőtámasz plusz változatot vizsgáltak. Melyik változat „plusz” szakaszában volt a legmagasabb a mért elülsőfűrészizom-EMG?', ['A hagyományos, talajon végzett változatéban', 'A falnál végzett változatéban', 'Nem volt különbség a változatok között', 'A kis mellizom EMG-je volt a legmagasabb'], 0, 'A hagyományos, talajon végzett változat „plusz” szakaszában volt a legmagasabb a mért elülsőfűrészizom-EMG és a legalacsonyabb a felső csuklyásizom / elülső fűrészizom arány. A vizsgálat csak ezt a két izmot mérte (a kis mellizmot nem), így teljes izomaktivitási rangsor nem következik belőle.', ['ludewig-2004'], 'gyakorlatok'),
  mc('q-pmi-ex-dip-elbow', 'exercise', 'Lapocka-süllyesztésnél támaszban mi a helyes könyökhelyzet?', ['Végig nyújtott – a mozgás csak a vállövben történik', 'A könyök hajlik és nyúlik', 'A könyök 90°-ban hajlított', 'Mindegy'], 0, 'Ha a könyök hajlik, a gyakorlat tolódzkodásba vált át; a süllyesztésnél csak a vállöv mozog.', ['nsca-essentials', 'neumann-kinesiology'], 'gyakorlatok'),
  mc('q-pmi-ex-chain', 'exercise', 'Támaszban a vállak lehúzásakor mi mozdul el a valóságban?', ['A törzs emelkedik – a kéz rögzített (zárt lánc)', 'A kéz emelkedik', 'A korlát mozdul', 'Semmi'], 0, 'Zárt láncban a süllyesztők a törzset emelik a vállövhöz képest: ugyanaz az izomműködés, csak a rögzített pont más.', ['neumann-kinesiology'], 'gyakorlatok'),

  /* --- Izomfelismerés az ábrán --- */
  {
    id: 'q-pmi-diagram-anterior',
    muscleId: M,
    topic: 'recognition',
    type: 'diagram-identify',
    task: 'muscle',
    viewId: 'anterior',
    prompt: 'Elölnézet (a felületes izmok áttetszők): kattints a kis mellizomra!',
    correctStructureIds: ['muscle-pectoralis-minor'],
    selectableStructureIds: ['muscle-pectoralis-minor', 'muscle-subclavius', 'muscle-serratus-anterior', 'muscle-coracobrachialis', 'muscle-biceps-brachii', 'muscle-pectoralis-major-sternocostal'],
    explanation: 'A kis mellizom háromszög alakban fut a 3–5. bordától a hollócsőrnyúlványig, a nagy mellizom alatt.',
    sourceIds: ANAT,
    relatedPath: 'anatomia'
  },
  {
    id: 'q-pmi-diagram-subclavius',
    muscleId: M,
    topic: 'recognition',
    type: 'diagram-identify',
    task: 'muscle',
    viewId: 'anterior',
    prompt: 'Elölnézet: kattints arra a mély izomra, amely a lapockasüllyesztésben a kis mellizom szinergistája (a kulcscsontot süllyeszti)!',
    correctStructureIds: ['muscle-subclavius'],
    selectableStructureIds: ['muscle-pectoralis-minor', 'muscle-subclavius', 'muscle-serratus-anterior', 'muscle-coracobrachialis', 'muscle-pectoralis-major-clavicular'],
    explanation: 'A kulcscsont alatti izom az első bordától a kulcscsont alsó felszínéig fut; a kulcscsontot süllyeszti és rögzíti.',
    sourceIds: ['openstax-ap2e', 'neumann-kinesiology'],
    relatedPath: 'anatomia'
  },
  {
    id: 'q-pmi-diagram-lateral',
    muscleId: M,
    topic: 'recognition',
    type: 'diagram-identify',
    task: 'muscle',
    viewId: 'lateral',
    prompt: 'Oldalnézet: kattints a kis mellizomra!',
    correctStructureIds: ['muscle-pectoralis-minor'],
    selectableStructureIds: ['muscle-pectoralis-minor', 'muscle-serratus-anterior', 'muscle-coracobrachialis', 'muscle-pectoralis-major-sternocostal', 'muscle-deltoid-anterior'],
    explanation: 'Oldalról a kis mellizom a hollócsőrnyúlványtól lefelé-előre fut a 3–5. bordáig, a nagy mellizom mögött.',
    sourceIds: ANAT,
    relatedPath: 'anatomia'
  },
  {
    id: 'q-pmi-diagram-serratus',
    muscleId: M,
    topic: 'recognition',
    type: 'diagram-identify',
    task: 'muscle',
    viewId: 'anterior',
    prompt: 'Elölnézet: kattints a protrakció fő mozgatójára (a kis mellizom ebben csak segít)!',
    correctStructureIds: ['muscle-serratus-anterior'],
    selectableStructureIds: ['muscle-pectoralis-minor', 'muscle-subclavius', 'muscle-serratus-anterior', 'muscle-coracobrachialis', 'muscle-latissimus-dorsi'],
    explanation: 'Az elülső fűrészizom a mellkas oldalfalán, fűrészfogszerű eredéssel látszik; a lapocka protrakciójának fő mozgatója.',
    sourceIds: KIN,
    relatedPath: 'biomechanika'
  }
];
