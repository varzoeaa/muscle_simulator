import type { Flashcard, StudyQuestion } from '../../types';

/**
 * Az elülső fűrészizom tanulókártyái és feladatai. Minden feladat az alkalmazásban már
 * megjelenő, forrással ellátott tartalomra épül: az Anatómia modul adatlapjára (StatPearls,
 * OpenStax, Moore, Neumann), a Biomechanika modul mozgásaira és a Gyakorlatok modul gyakorlataira
 * (Decker 1999, Ekstrom 2003, Castelein 2016, Ludewig 2004 – csak minőségileg).
 */
const M = 'muscle-serratus-anterior';
const SP = 'statpearls-serratus';
const ANAT = [SP, 'statpearls-pectoral', 'openstax-ap2e', 'moore-coa'];
const KIN = ['neumann-kinesiology'];
const SUP = 'muscle-serratus-anterior-superior';
const INT = 'muscle-serratus-anterior-intermediate';
const INF = 'muscle-serratus-anterior-inferior';
const PARTS = [SUP, INT, INF];

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

const diagram = (
  id: string,
  topic: StudyQuestion['topic'],
  task: 'muscle' | 'origin' | 'insertion',
  viewId: 'anterior' | 'lateral' | 'superior',
  prompt: string,
  correctStructureIds: string[],
  selectableStructureIds: string[],
  explanation: string,
  sourceIds: string[],
  relatedPath: string
): StudyQuestion => ({ id, muscleId: M, topic, type: 'diagram-identify', task, viewId, prompt, correctStructureIds, selectableStructureIds, explanation, sourceIds, relatedPath });

/* ------------------------------------------------------------------ */
/* Tanulókártyák                                                       */
/* ------------------------------------------------------------------ */

export const saFlashcards: Flashcard[] = [
  { id: 'fc-sa-name', muscleId: M, topic: 'name', front: 'Elülső fűrészizom – angol és latin név? Mi a beceneve?', back: 'Serratus anterior – Musculus serratus anterior. „Bokszolóizom”, mert az ütés mozdulatában a lapockát előre vezeti.', sourceIds: ['fipat-ta2', SP] },
  { id: 'fc-sa-shape', muscleId: M, topic: 'regions', front: 'Milyen alakú, és hol fekszik az elülső fűrészizom?', back: 'Széles, legyezőszerű izom a mellkas oldalfalán; fő része a lapocka és a mellizmok mögött van. A nagy mellizom és a széles hátizom között tapintható.', sourceIds: [SP] },
  { id: 'fc-sa-origin', muscleId: M, topic: 'origin', front: 'Hol ered az elülső fűrészizom?', back: 'Az 1–8. (vagy 1–9.) borda külső, felső-oldalsó felszínén, fűrészfogszerű nyúlványokkal.', sourceIds: ANAT },
  { id: 'fc-sa-insertion', muscleId: M, topic: 'insertion', front: 'Hol tapad az elülső fűrészizom?', back: 'A lapocka felső szögén, belső szélén és alsó szögén – az elülső (bordai) felszínen.', sourceIds: ANAT },
  { id: 'fc-sa-parts', muscleId: M, topic: 'regions', front: 'Melyik három része van az elülső fűrészizomnak?', back: 'Felső rész: gyakran 1–2. borda (más kombinációk is előfordulnak) → a felső szöglet közelében. Középső rész: 2–3. borda → belső szél. Alsó rész: 4–9. borda → alsó szög.', sourceIds: [SP, 'smith-2003', 'webb-2018'] },
  { id: 'fc-sa-innervation', muscleId: M, topic: 'innervation', front: 'Mi idegzi be az elülső fűrészizmot?', back: 'A hosszú mellkasi ideg (n. thoracicus longus), jellemzően C5–C7. A felső résznek egy független C4–C6 ága, az alsónak egy bordaközi idegága is lehet.', sourceIds: [SP, 'moore-coa'] },
  { id: 'fc-sa-function', muscleId: M, topic: 'function', front: 'Melyek az elülső fűrészizom funkciói?', back: 'Protrakció (fő mozgató), felfelé rotáció a csuklyásizommal, a lapocka mellkasfalhoz szorítása; rögzített vállövnél a bordák emelése.', sourceIds: [SP, 'openstax-ap2e'] },
  { id: 'fc-sa-parts-function', muscleId: M, topic: 'regions', front: 'Mit végez az egyes részek közül a felső, a középső és az alsó?', back: 'Felső: a mozgás forgástengelyét adja. Középső: előre húzza a lapockát. Alsó: felfelé rotálja a lapockát.', sourceIds: [SP] },
  { id: 'fc-sa-joints', muscleId: M, topic: 'joints', front: 'Mely ízületeken hat az elülső fűrészizom?', back: 'A lapocka-mellkasi kapcsolaton (a lapocka mozgásain), és ezen keresztül a vállcsúcs-kulcscsonti és a szegycsont-kulcscsonti ízületen. A vállízületen nem fut át.', sourceIds: KIN },
  { id: 'fc-sa-winging', muscleId: M, topic: 'stabilization', front: 'Mi a szárnyas lapocka, és mi okozza?', back: 'A hosszú mellkasi ideg sérülésekor az elülső fűrészizom nem tartja a lapockát: a belső széle elemelkedik a mellkasfaltól (mediális szárnyaslapocka). A laterális forma oka a csuklyásizom vagy a rombuszizmok gyengesége.', sourceIds: [SP] },
  { id: 'fc-sa-roles-upward', muscleId: M, topic: 'roles', front: 'A lapocka felfelé rotációja: kik az agonisták és az antagonisták?', back: 'Agonisták: az elülső fűrészizom és a csuklyásizom (felső és alsó része). Antagonisták: a rombuszizmok, a lapockaemelő izom és a kis mellizom.', sourceIds: [SP, ...KIN] },
  { id: 'fc-sa-blood', muscleId: M, topic: 'stabilization', front: 'Honnan kapja a vérellátását az elülső fűrészizom?', back: 'Az oldalsó mellkasi artériából, a felső mellkasi artériából (főként a felső részt) és a mellkas-háti artériából (az alsó részt).', sourceIds: [SP] },
  { id: 'fc-sa-punch', muscleId: M, topic: 'exercise', front: 'Melyik protrakciós gyakorlat aktiválta leginkább az elülső fűrészizmot a kis mellizomhoz képest (Castelein 2016)?', back: 'A serratus punch: ennél volt a legnagyobb az elülső fűrészizom aktivitása, és egyértelműen nagyobb a kis mellizoménál.', sourceIds: ['castelein-2016'] },
  { id: 'fc-sa-inspiration', muscleId: M, topic: 'contraction', front: 'A bordák emelésekor (rögzített vállöv) melyik vége mozog az elülső fűrészizomnak?', back: 'Az eredés (bordák) mozog a rögzített tapadás (lapocka) felé: koncentrikus működés.', sourceIds: [SP, 'openstax-ap2e'] }
];

/* ------------------------------------------------------------------ */
/* Feladatok                                                           */
/* ------------------------------------------------------------------ */

const BONES_ANT = ['bone-ribs', 'bone-costal-cartilages', 'bone-clavicle', 'bone-sternum', 'bone-scapula', 'bone-humerus'];
const BONES_LAT = ['bone-ribs', 'bone-clavicle', 'bone-sternum', 'bone-scapula', 'bone-humerus', 'bone-vertebral-column'];

export const saQuestions: StudyQuestion[] = [
  /* --- Elnevezés --- */
  mc('q-sa-name-la', 'name', 'Mi az elülső fűrészizom latin neve?', ['Musculus serratus anterior', 'Musculus serratus posterior superior', 'Musculus subscapularis', 'Musculus scalenus anterior'], 0, 'A „serratus” fűrészes, fogazott – az izom fűrészfogszerű nyúlványokkal ered a bordákon.', ['fipat-ta2'], 'anatomia'),
  fill('q-sa-name-meaning', 'name', 'A „serratus” jelentése: ___, mert az izom fogszerű nyúlványokkal ered a bordákon.', ['fűrészes', 'lapos', 'háromfejű', 'kerek'], 'fűrészes', 'A bordákon eredő nyúlványok fűrészfogakra emlékeztetnek – innen a magyar és a latin név.', ['fipat-ta2', SP], 'anatomia'),
  mc('q-sa-name-boxer', 'name', 'Miért nevezik az elülső fűrészizmot „bokszolóizomnak”?', ['Mert az ütés mozdulatában a lapockát előre vezeti (protrakció)', 'Mert a könyököt nyújtja', 'Mert a csuklót rögzíti', 'Mert a fejet fordítja'], 0, 'A StatPearls szerint nagyrészt ez felel a lapocka protrakciójáért, amely ütéskor zajlik.', [SP], 'anatomia'),
  match('q-sa-name-matching', 'name', 'Párosítsd a magyar nevet a latin névvel!', [['Elülső fűrészizom', 'M. serratus anterior'], ['Kis mellizom', 'M. pectoralis minor'], ['Rombuszizmok', 'Mm. rhomboidei'], ['Lapockaemelő izom', 'M. levator scapulae']], 'A vállöv mozgatói közül ezek a lapocka helyzetét szabályozzák.', ['fipat-ta2'], 'anatomia'),

  /* --- Eredés --- */
  mc('q-sa-origin', 'origin', 'Honnan ered az elülső fűrészizom?', ['Az 1–8. (vagy 1–9.) borda külső felszínéről', 'A 3–5. borda elülső felszínéről', 'Az 1. bordáról és bordaporcáról', 'A szegycsontról'], 0, 'A mellkas oldalfalán, az 1–8. vagy 1–9. bordán ered. A 3–5. bordáról a kis mellizom, az 1. bordáról a kulcscsont alatti izom ered.', ANAT, 'anatomia'),
  fill('q-sa-origin-teeth', 'origin', 'A bordákon ___ nyúlványokkal ered.', ['fűrészfogszerű', 'ínhártyás', 'csontos', 'kétfejű'], 'fűrészfogszerű', 'A fűrészfogszerű nyúlványok (digitációk) adják az izom nevét.', [SP], 'anatomia'),
  mc('q-sa-origin-inferior', 'origin', 'Melyik bordákról ered az elülső fűrészizom alsó része?', ['A 4–9. bordáról', 'Az 1–2. bordáról', 'A 2–3. bordáról', 'A 10–12. bordáról'], 0, 'A StatPearls szerint a felső rész az 1–2., a középső a 2–3., az alsó a 4–9. bordáról ered.', [SP], 'anatomia'),
  diagram('q-sa-diagram-origin', 'origin', 'origin', 'anterior', 'Jelöld meg az ábrán azt a csontos képletet, amelyről az elülső fűrészizom ered!', ['bone-ribs'], BONES_ANT, 'A bordák külső felszínén ered, a mellkas oldalfalán – a bordaporcokon nem.', ANAT, 'anatomia'),

  /* --- Tapadás --- */
  mc('q-sa-insertion', 'insertion', 'Hol tapad az elülső fűrészizom?', ['A lapocka felső szögén, belső szélén és alsó szögén – az elülső (bordai) felszínen', 'A hollócsőrnyúlványon', 'A felkarcsont nagy gumójának tarajain', 'A kulcscsont alsó felszínén'], 0, 'A lapocka felső szögén, belső szélén és alsó szögén tapad – az elülső, bordák felé néző felszínen. A hollócsőrnyúlványon a kis mellizom tapad.', ANAT, 'anatomia'),
  fill('q-sa-insertion-surface', 'insertion', 'A tapadás a lapocka belső szélének ___ felszínén van.', ['elülső (bordai)', 'hátsó', 'felső', 'oldalsó'], 'elülső (bordai)', 'A lapocka és a mellkasfal között fut, ezért a lapocka bordák felé néző felszínén tapad.', ANAT, 'anatomia'),
  match('q-sa-insertion-parts', 'insertion', 'Párosítsd a részt a tapadási helyével!', [['Felső rész', 'A lapocka felső szöge'], ['Középső rész', 'A lapocka belső széle'], ['Alsó rész', 'A lapocka alsó szöge']], 'A StatPearls a részeket a tapadásuk szerint különíti el.', [SP], 'anatomia'),
  diagram('q-sa-diagram-insertion', 'insertion', 'insertion', 'lateral', 'Oldalnézet: jelöld meg azt a csontot, amelyen az elülső fűrészizom tapad!', ['bone-scapula'], BONES_LAT, 'A lapocka belső szélén és szögein tapad – a lapocka és a mellkasfal között fut.', ANAT, 'anatomia'),

  /* --- Beidegzés --- */
  mc('q-sa-innerv', 'innervation', 'Melyik ideg látja el az elülső fűrészizmot?', ['A hosszú mellkasi ideg (n. thoracicus longus)', 'A belső mellizomideg', 'A kulcscsont alatti ideg', 'A járulékos ideg'], 0, 'A hosszú mellkasi ideg; a mellizmokat a mellizomidegek, a kulcscsont alatti izmot a saját idege, a csuklyásizmot a járulékos ideg látja el.', [SP, 'moore-coa'], 'anatomia'),
  mc('q-sa-innerv-roots', 'innervation', 'Jellemzően mely gerincvelői idegekből áll a hosszú mellkasi ideg?', ['C5, C6, C7', 'C8, T1', 'C1, C2', 'T5–T7'], 0, 'C5–C7 (StatPearls). A belső mellizomideg C8–T1.', [SP, 'statpearls-pectoral'], 'anatomia'),
  mc('q-sa-innerv-vulnerable', 'innervation', 'Miért sérülékeny a hosszú mellkasi ideg?', ['Az izom külső felszínén fut, kis átmérőjű és kevés kötőszövet védi', 'Mert a csontban fut', 'Mert a gerincvelőben fut', 'Mert a felkarcsont mögött fut'], 0, 'Felszínes lefutása miatt pl. hónalji nyirokcsomó-eltávolításnál vagy emlőeltávolításnál megsérülhet.', [SP], 'anatomia'),
  match('q-sa-innerv-matching', 'innervation', 'Párosítsd az izmot a beidegző idegével!', [['Elülső fűrészizom', 'N. thoracicus longus'], ['Kis mellizom', 'N. pectoralis medialis'], ['Kulcscsont alatti izom', 'N. subclavius']], 'A mellkasfal vállöv-izmai különböző idegeket kapnak a karfonatból.', [SP, 'statpearls-pectoral', 'moore-coa'], 'anatomia'),
  fill('q-sa-innerv-dual', 'innervation', 'Az alsó rész a hosszú mellkasi ideg mellett egy ___ ideg ágát is kaphatja.', ['bordaközi', 'kulcscsont alatti', 'hónalj', 'orsó'], 'bordaközi', 'A StatPearls szerint az alsó résznek kettős beidegzése lehet: a hosszú mellkasi ideg és egy bordaközi ideg ága.', [SP], 'anatomia'),

  /* --- Funkció --- */
  mc('q-sa-func-main', 'function', 'Melyik mozgás fő mozgatója az elülső fűrészizom?', ['A lapocka protrakciójáé (előre vezetés)', 'A lapocka retrakciójáé', 'A vállízület hajlításáé', 'A könyök nyújtásáé'], 0, 'A lapockát a mellkas körül előre húzza – ez a protrakció; antagonistái a rombuszizmok és a csuklyásizom középső része.', [SP, ...KIN], 'biomechanika'),
  mc('q-sa-func-overhead', 'function', 'Miért nélkülözhetetlen az elülső fűrészizom a kar fej fölé emeléséhez?', ['Mert a csuklyásizommal együtt felfelé rotálja a lapockát', 'Mert a felkarcsontot emeli', 'Mert a kulcscsontot süllyeszti', 'Mert a könyököt nyújtja'], 0, 'A fej fölé emeléshez az ízületi ároknak felfelé kell fordulnia: ezt a felfelé rotálók (elülső fűrészizom, csuklyásizom) végzik.', [SP, ...KIN], 'biomechanika'),
  mc('q-sa-func-ribs', 'function', 'Mit tesz az elülső fűrészizom, ha a vállöv rögzített?', ['A bordákat emeli – segíti a belégzést', 'A lapockát süllyeszti', 'A gerincet hajlítja', 'A kulcscsontot emeli'], 0, 'Rögzített vállövnél mindhárom része a bordákat emeli.', [SP, 'openstax-ap2e'], 'biomechanika'),
  mc('q-sa-func-not', 'function', 'Melyik mozgást NEM végzi az elülső fűrészizom?', ['A lapocka lefelé rotációját', 'A lapocka protrakcióját', 'A lapocka felfelé rotációját', 'A bordák emelését rögzített vállövnél'], 0, 'A lefelé rotációt a rombuszizmok, a lapockaemelő izom és a kis mellizom végzi; ebben az elülső fűrészizom antagonista.', KIN, 'biomechanika'),
  match('q-sa-func-matching', 'function', 'Párosítsd a mozgást az elülső fűrészizom szerepével!', [['A lapocka protrakciója', 'Agonista'], ['A lapocka retrakciója', 'Antagonista'], ['Bordaemelés rögzített vállövnél', 'Agonista'], ['A lapocka lefelé rotációja', 'Antagonista']], 'Protrakcióban és felfelé rotációban fő mozgató; a retrakció és a lefelé rotáció ellentétes irányú.', [SP, ...KIN], 'biomechanika'),

  /* --- Érintett ízületek --- */
  mc('q-sa-joint-st', 'joints', 'Melyik kapcsolaton zajlanak a lapocka mozgásai, amelyeket az elülső fűrészizom végez?', ['A lapocka-mellkasi kapcsolaton (a lapocka a mellkasfalon csúszik)', 'A könyökízületen', 'A csípőízületen', 'A csigolyaközti ízületeken'], 0, 'A lapocka a mellkasfalon csúszik és fordul; ez nem valódi ízület, hanem funkcionális kapcsolat.', KIN, 'anatomia'),
  mc('q-sa-joint-gh', 'joints', 'Fut-e át az elülső fűrészizom a vállízületen?', ['Nem – a bordákról a lapockára fut', 'Igen, a felkarcsonton tapad', 'Igen, a könyökön is', 'Csak emelt karnál'], 0, 'Eredése és tapadása is a törzsön és a vállövön van; a vállízületet közvetlenül nem mozgatja, de a lapocka helyzetével a kar mozgását lehetővé teszi.', ANAT, 'anatomia'),
  mc('q-sa-joint-clav', 'joints', 'A lapocka mozgásán keresztül mely ízületekre hat még?', ['A vállcsúcs-kulcscsonti és a szegycsont-kulcscsonti ízületre', 'A könyök- és a csuklóízületre', 'Az állkapocsízületre', 'A térdízületre'], 0, 'A lapocka a kulcscsonton keresztül kapcsolódik a törzshöz, így mozgása mindkét kulcscsonti ízületet érinti.', KIN, 'anatomia'),
  fill('q-sa-joint-plane', 'joints', 'A felfelé rotáció a lapocka ___ síkú elfordulása: az alsó szög oldalra-előre, az ízületi árok felfelé mozdul.', ['frontális', 'szagittális', 'vízszintes', 'harántirányú'], 'frontális', 'A Biomechanika modul ezért hátulnézetben mutatja: így látszik, ahogy az alsó szög oldalra mozdul.', KIN, 'biomechanika'),

  /* --- Izomrészek --- */
  mc('q-sa-regions-count', 'regions', 'Hány részre osztják az elülső fűrészizmot a tapadása szerint?', ['Háromra (felső, középső, alsó)', 'Kettőre', 'Négyre', 'Nincsenek részei'], 0, 'A StatPearls szerint felső, középső és alsó részre.', [SP], 'anatomia'),
  mc('q-sa-regions-axis', 'regions', 'Melyik rész adja a lapocka mozgásainak fő forgástengelyét?', ['A felső rész', 'A középső rész', 'Az alsó rész', 'Egyik sem'], 0, 'A StatPearls leírása szerint a felső rész a felső szöglet közelében tapad, és a mozgás tengelyét adja; a középső előre húz, az alsó felfelé rotál.', [SP], 'anatomia'),
  mc('q-sa-regions-upward', 'regions', 'Melyik rész rotálja felfelé a lapockát?', ['Az alsó rész', 'A felső rész', 'A középső rész', 'Mindhárom egyformán'], 0, 'Az alsó rész az alsó szögön tapad, és azt húzza előre-oldalra. Egy EMG-vizsgálatban felfelé rotált lapockával végzett teszteknél is az alsó részen mértek nagyobb jelet, mint a felsőn.', [SP, 'ekstrom-2004'], 'anatomia'),
  mc('q-sa-regions-variant', 'regions', 'Melyik az elülső fűrészizom leírt változata?', ['Tapadhat a 10. bordán, és hiányozhat az 1. bordai nyúlványa', 'A felkarcsonton tapad', 'Két külön fejjel ered a lapockán', 'A koponyán ered'], 0, 'Rostjai összenőhetnek a lapockaemelő izommal, a külső bordaközi izmokkal vagy a külső ferde hasizommal is.', [SP, 'statpearls-pectoral'], 'anatomia'),
  diagram('q-sa-diagram-inferior', 'regions', 'muscle', 'anterior', 'Elölnézet: kattints az elülső fűrészizom alsó részére!', [INF], [...PARTS, 'muscle-latissimus-dorsi', 'muscle-external-oblique'], 'Az alsó rész a 4–9. bordán ered (az ábrán a legalsó fűrészfogak), és a lapocka alsó szögéhez fut.', [SP], 'anatomia'),

  /* --- Szerepek --- */
  mc('q-sa-roles-protr-syn', 'roles', 'A protrakcióban melyik izom az elülső fűrészizom szinergistája?', ['A kis mellizom', 'A rombuszizmok', 'A csuklyásizom középső része', 'A széles hátizom'], 0, 'A kis mellizom a hollócsőrnyúlványt előre-befelé húzva segíti; a rombuszizmok és a csuklyásizom középső része antagonisták.', KIN, 'biomechanika'),
  mc('q-sa-roles-protr-antag', 'roles', 'Melyik izmok a protrakció antagonistái?', ['A rombuszizmok és a csuklyásizom (középső része)', 'A kis mellizom és a nagy mellizom', 'A deltaizom és a tövis feletti izom', 'A kétfejű és a háromfejű karizom'], 0, 'Ők a retraktorok: a lapockát a gerinc felé húzzák.', [SP, ...KIN], 'biomechanika'),
  match('q-sa-roles-upward', 'roles', 'A lapocka felfelé rotációja: párosítsd az izmot a szerepével!', [['Elülső fűrészizom', 'Agonista'], ['Csuklyásizom', 'Agonista'], ['Rombuszizmok', 'Antagonista'], ['Kis mellizom', 'Antagonista']], 'Erőpár: az elülső fűrészizom és a csuklyásizom felső és alsó része rotál felfelé; a lefelé rotálók antagonisták.', [SP, ...KIN], 'biomechanika'),
  mc('q-sa-roles-rhomboid', 'roles', 'Milyen viszonyban van az elülső fűrészizom a rombuszizmokkal?', ['A protrakcióban ellentétesen dolgoznak, a lapocka mellkasfalhoz szorításában együtt', 'Mindig szinergisták', 'Mindig antagonisták', 'Nincs közös feladatuk'], 0, 'A StatPearls szerint együttes működésük a lapockát a mellkashoz szorítja – ez szinergista hatás.', [SP], 'biomechanika'),
  mc('q-sa-roles-tilt', 'roles', 'A lapocka hátrabillentésében melyik izom az elülső fűrészizom antagonistája?', ['A kis mellizom', 'A csuklyásizom alsó része', 'A rombuszizmok', 'A széles hátizom'], 0, 'A kis mellizom a lapockát előre billenti; a hátrabillentésben az elülső fűrészizom és a csuklyásizom alsó része vesz részt (oktatási modell).', KIN, 'biomechanika'),

  /* --- Stabilizáló működés --- */
  mc('q-sa-stab-wall', 'stabilization', 'Mi az elülső fűrészizom legfontosabb stabilizáló feladata?', ['A lapockát a mellkasfalon tartja', 'A könyököt rögzíti', 'A gerincet egyenesen tartja', 'A felkarcsontfejet húzza le'], 0, 'Ha kiesik, a lapocka belső széle és alsó szöge elemelkedik a mellkasfaltól.', [SP], 'anatomia'),
  mc('q-sa-stab-winging', 'stabilization', 'Milyen szárnyas lapocka alakul ki a hosszú mellkasi ideg sérülésekor?', ['Mediális – a lapocka belső széle emelkedik el', 'Laterális – a külső széle emelkedik el', 'Nem alakul ki szárnyas lapocka', 'A lapocka a mellkasfalba süllyed'], 0, 'A mediális szárnyaslapocka az elülső fűrészizom gyengeségére utal; a laterálist a csuklyásizom vagy a rombuszizmok gyengesége okozza.', [SP], 'anatomia'),
  mc('q-sa-stab-bursa', 'stabilization', 'Mi választja el az elülső fűrészizmot a bordáktól?', ['A lapocka-mellkasi nyálkatömlő (bursa infraserrata)', 'A kulcscsont-borda szalag', 'A rotátorköpeny', 'A mellizom-pólya'], 0, 'A lapocka alatti izomtól pedig a bursa supraserrata választja el.', [SP], 'anatomia'),
  mc('q-sa-stab-support', 'stabilization', 'Támaszhelyzetben (pl. fekvőtámasz) miért fontos az elülső fűrészizom?', ['A lapockát a mellkasfalon tartja, így a vállöv stabil alapot ad a karnak', 'Mert a könyököt nyújtja', 'Mert a csípőt emeli', 'Mert a fejet tartja'], 0, 'A lapocka rögzítése nélkül a kar ereje nem tud a törzsre átadódni.', KIN, 'gyakorlatok'),
  fill('q-sa-stab-isometric', 'stabilization', 'Ha a lapocka nem mozdul, de az izom tartja, az elülső fűrészizom ___ működik.', ['izometriásan', 'koncentrikusan', 'excentrikusan', 'passzívan'], 'izometriásan', 'Elmozdulás nélküli aktív feszülés: ez a stabilizálás leggyakoribb formája.', KIN, 'biomechanika'),

  /* --- Izomműködési típusok --- */
  mc('q-sa-contr-punch-up', 'contraction', 'Serratus-nyomásnál a súlyzó emelésekor (protrakció) hogyan dolgozik az elülső fűrészizom?', ['Koncentrikusan – rövidül', 'Excentrikusan – hosszabbodik', 'Izometriásan', 'Passzívan nyúlik'], 0, 'A lapocka belső széle (tapadás) a bordák (eredés) felé közeledik.', [SP, ...KIN], 'gyakorlatok'),
  mc('q-sa-contr-punch-down', 'contraction', 'Serratus-nyomásnál a súlyzó visszaengedésekor hogyan dolgozik az elülső fűrészizom?', ['Excentrikusan – fékezve hosszabbodik', 'Koncentrikusan', 'Nem aktív', 'Izometriásan, a hossza nem változik'], 0, 'A súlyzó tolja hátra a lapockát; az izom aktív marad és fékez.', KIN, 'gyakorlatok'),
  match('q-sa-contr-scaption', 'contraction', 'Karemelés fej fölé: párosítsd a szakaszt az elülső fűrészizom működésével!', [['Emelés fej fölé', 'Koncentrikus'], ['Megtartás', 'Izometriás'], ['Leengedés', 'Excentrikus']], 'A felfelé rotáció alatt rövidül, leengedéskor fékezve hosszabbodik.', [SP, ...KIN], 'gyakorlatok'),
  mc('q-sa-contr-ribs', 'contraction', 'A bordák emelésekor (rögzített vállöv) mi mozog?', ['Az eredés (bordák) mozog a rögzített tapadás (lapocka) felé', 'A tapadás mozog az eredés felé', 'Semmi sem mozog', 'A felkarcsont mozog'], 0, 'Fordított működés: a lapocka rögzített, az izom a bordákat húzza.', [SP, 'openstax-ap2e'], 'biomechanika'),

  /* --- Gyakorlatok --- */
  mc('q-sa-ex-plus', 'exercise', 'Mi történik a fekvőtámasz plusz „plusz” szakaszában?', ['Közel nyújtott könyökkel a lapockák a mellkasfal mentén előre mozognak (protrakció)', 'A könyök hajlik', 'A lapockák egymáshoz közelednek', 'A csípő emelkedik'], 0, 'A „plusz” a lapocka protrakciója (közben a lapocka forog és billen is); egyik fő mozgatója az elülső fűrészizom.', ['neumann-kinesiology'], 'gyakorlatok'),
  mc('q-sa-ex-plus-ludewig', 'exercise', 'Ludewig és mtsai (2004) négy fekvőtámasz plusz változata közül melyiknek a „plusz” szakaszában volt a legmagasabb a mért elülsőfűrészizom-EMG?', ['A hagyományos, talajon végzett változatnak', 'A falnál végzett változatnak', 'A térdelő változatnak', 'A könyökön végzett változatnak'], 0, 'A hagyományos, talajon végzett változat „plusz” szakaszában; ennél volt a legalacsonyabb a felső csuklyásizom / elülső fűrészizom EMG-arány is. Csak ezt a két izmot mérték, a felső fűrészizomkötegek külön aktivitását nem.', ['ludewig-2004'], 'gyakorlatok'),
  mc('q-sa-ex-punch', 'exercise', 'Melyik gyakorlatot javasolták, ha az elülső fűrészizmot a kis mellizom kisebb bevonásával akarjuk erősíteni (Castelein 2016)?', ['A serratus punch-ot', 'A falnál végzett fekvőtámasz pluszt', 'A térdelő fekvőtámasz pluszt', 'A vállvonogatást'], 0, 'A serratus punch adta a legnagyobb elülső fűrészizom-aktivitást, és ennél volt az egyértelműen nagyobb a kis mellizoménál.', ['castelein-2016'], 'gyakorlatok'),
  mc('q-sa-ex-ekstrom', 'exercise', 'Ekstrom és mtsai (2003) szerint milyen gyakorlatok aktiválták legjobban az elülső fűrészizmot?', ['Amelyek nagy lapockarotációt igényelnek – pl. karemelés a lapocka síkjában 120° fölé', 'A vállvonogatás', 'A vízszintes hátrahúzás', 'A fekvenyomás'], 0, 'A szerzők a lapocka síkjában 120° fölé emelt kart és egy átlós gyakorlatot találták a leghatékonyabbnak.', ['ekstrom-2003'], 'gyakorlatok'),
  mc('q-sa-ex-elbow', 'exercise', 'Serratus-nyomásnál mi a leggyakoribb hiba?', ['A könyök hajlítása – a gyakorlat mellnyomásba vált', 'A könyök nyújtva tartása', 'A váll elemelése a padtól', 'A lassú végrehajtás'], 0, 'A könyök végig nyújtott; csak a lapocka mozog. A váll elemelkedése a padtól épp a cél.', ['nsca-essentials', 'neumann-kinesiology'], 'gyakorlatok'),
  match('q-sa-ex-matching', 'exercise', 'Párosítsd a gyakorlatot a lapocka fő mozgásával!', [['Serratus punch', 'Protrakció'], ['Fekvőtámasz plusz', 'Protrakció'], ['Karemelés fej fölé (scaption)', 'Felfelé rotáció']], 'Az első kettő a protrakciót, a fej fölé emelés a felfelé rotációt terheli.', [SP, ...KIN], 'gyakorlatok'),

  /* --- Izomfelismerés az ábrán --- */
  diagram('q-sa-diagram-anterior', 'recognition', 'muscle', 'anterior', 'Elölnézet: kattints az elülső fűrészizomra (bármelyik részére)!', PARTS, [...PARTS, 'muscle-latissimus-dorsi', 'muscle-external-oblique', 'muscle-pectoralis-major-sternocostal', 'muscle-pectoralis-major-abdominal'], 'A mellkas oldalán, a nagy mellizom és a széles hátizom között látszanak a fűrészfogszerű nyúlványai.', [SP], 'anatomia'),
  diagram('q-sa-diagram-superior', 'recognition', 'muscle', 'superior', 'Felülnézet: kattints az elülső fűrészizomra!', [M], [M, 'muscle-pectoralis-minor', 'muscle-infraspinatus', 'muscle-pectoralis-major-sternocostal', 'muscle-teres-minor'], 'Felülről a lapocka belső szélétől a mellkasfal mentén előre, a bordákig fut.', ANAT, 'anatomia'),
  diagram('q-sa-diagram-protractor', 'recognition', 'muscle', 'superior', 'Felülnézet: kattints arra a mély izomra, amely a protrakcióban az elülső fűrészizom szinergistája!', ['muscle-pectoralis-minor'], [M, 'muscle-pectoralis-minor', 'muscle-infraspinatus', 'muscle-pectoralis-major-clavicular', 'muscle-teres-minor'], 'A kis mellizom a hollócsőrnyúlványt előre-befelé húzza, és így segíti a protrakciót.', KIN, 'biomechanika'),
  diagram('q-sa-diagram-antag', 'recognition', 'muscle', 'anterior', 'Elölnézet: kattints arra a mély izomra, amely a felfelé rotáció antagonistája!', ['muscle-pectoralis-minor'], [...PARTS, 'muscle-pectoralis-minor', 'muscle-subclavius', 'muscle-coracobrachialis'], 'A kis mellizom a lapocka lefelé rotálója – a felfelé rotáció antagonistája.', KIN, 'biomechanika')
];
