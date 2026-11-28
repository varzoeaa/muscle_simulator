import type { Muscle } from '../../types';

/**
 * Elülső fűrészizom (musculus serratus anterior). Az anatómiai adatok (eredés, tapadás, három
 * rész, beidegzés, működés, vérellátás, nyálkatömlők, változatok, klinikai vonatkozások) a
 * StatPearls külön „Serratus Anterior Muscles” fejezete (utolsó frissítés: 2024-09-10), a
 * StatPearls „Pectoral Muscles” fejezete és az OpenStax Anatomy and Physiology 11.5 alfejezete
 * alapján (online ellenőrizve: 2026-11-27), valamint standard tankönyvek (Moore, Gray's) alapján
 * szerepelnek. A felső rostcsoport anatómiája és a regionális EMG boncolásos és EMG-vizsgálatokból
 * (Smith 2003, Nasu 2012, Webb 2018, Ekstrom 2004) származik; ezeket a konkrét vizsgálat
 * eredményeként jelöljük. A lapockamozgásokban betöltött szerepek Neumann (2017) leírását követik.
 */
const SP = 'statpearls-serratus';
const ANAT = [SP, 'statpearls-pectoral', 'openstax-ap2e', 'moore-coa'];
const KIN = ['neumann-kinesiology', 'moore-coa'];

export const serratusAnterior: Muscle = {
  id: 'muscle-serratus-anterior',
  kind: 'muscle',
  status: 'available',
  name: { hu: 'Elülső fűrészizom', en: 'Serratus anterior', la: 'Musculus serratus anterior' },
  summary:
    'Széles, legyezőszerű izom a mellkas oldalfalán. Fűrészfogszerű nyúlványokkal tipikusan az 1–8. (vagy 1–9.) bordán ered, a lapocka alatt hátrafelé fut, és a lapocka belső szélének elülső (bordai) felszínéhez tapad, a felső és az alsó szöglet környékéig. Beidegzése a hosszú mellkasi ideg. A protrakció egyik fő mozgatója („bokszolóizom”), a csuklyásizommal együtt részt vesz a felfelé rotációban, és mozgás közben a lapockát a mellkasfal közelében tartja. Rögzített vállövnél a bordákat emelheti.',
  defaultViewId: 'lateral',
  regions: [
    {
      id: 'muscle-serratus-anterior-superior',
      kind: 'muscle-region',
      muscleId: 'muscle-serratus-anterior',
      name: { hu: 'Felső rész', en: 'Superior part', la: 'Pars superior' },
      origin: {
        type: 'origin',
        description: {
          hu: 'Gyakran az 1. és a 2. borda; boncolásos mintákban csak az 1., csak a 2., illetve a 2–3. bordai eredés is előfordult',
          en: 'Commonly the first and second ribs; in dissected samples origins from the first rib only, the second rib only or ribs 2–3 also occurred',
          la: 'Costae I–II'
        },
        structureIds: ['bone-ribs'],
        extent: 'line',
        sourceIds: [SP, 'smith-2003', 'webb-2018']
      },
      insertion: {
        type: 'insertion',
        description: {
          hu: 'A lapocka felső szöge (angulus superior) közelében, az elülső felszínen',
          en: 'Near the superior angle of the scapula, costal surface',
          la: 'Angulus superior scapulae'
        },
        structureIds: ['bone-scapula-superior-angle'],
        extent: 'line',
        sourceIds: [SP]
      },
      innervation: {
        text: 'Hosszú mellkasi ideg (n. thoracicus longus) ágai; emellett egy független ág is leírt, amely egy boncolásos vizsgálatban a lapockaemelő izom ágából vált le (StatPearls: C4–C6 eredetű).',
        evidence: 'anatomical-fact',
        sourceIds: [SP, 'smith-2003', 'nasu-2012']
      },
      functions: [
        { text: 'A leírás szerint a lapocka mozgásainak forgástengelyét adja: a felső szöglet környékén a lapockát a mellkasfal közelében tartja.', evidence: 'anatomical-fact', sourceIds: [SP] },
        { text: 'Boncolásos vizsgálatokban a felső köteg megjelenése és bordai eredése változatos volt, a lapockai tapadás a felső szöglet közelében volt, a lapockaemelő izom tapadásával összeolvadva. Kis mintákon alapuló eredmény; általános gyakoriság nem következik belőle.', evidence: 'documented-observation', sourceIds: ['smith-2003', 'webb-2018'] },
        { text: 'Beidegzése alapján a lapockaemelő izommal szoros kapcsolatban állhat.', evidence: 'documented-observation', sourceIds: [SP] }
      ]
    },
    {
      id: 'muscle-serratus-anterior-intermediate',
      kind: 'muscle-region',
      muscleId: 'muscle-serratus-anterior',
      name: { hu: 'Középső rész', en: 'Intermediate part', la: 'Pars intermedia' },
      origin: {
        type: 'origin',
        description: { hu: 'A 2. és a 3. borda', en: 'Second and third ribs', la: 'Costae II–III' },
        structureIds: ['bone-ribs'],
        extent: 'line',
        sourceIds: [SP]
      },
      insertion: {
        type: 'insertion',
        description: {
          hu: 'A lapocka belső (gerinc felőli) szélének elülső felszíne',
          en: 'Costal surface of the medial border of the scapula',
          la: 'Margo medialis scapulae'
        },
        structureIds: ['bone-scapula-medial-border'],
        extent: 'line',
        sourceIds: [SP]
      },
      innervation: {
        text: 'Hosszú mellkasi ideg (n. thoracicus longus); az ideg a középső rész elülső felszínén, az eredés és a tapadás közötti szakasz elülső harmadán halad lefelé.',
        evidence: 'anatomical-fact',
        sourceIds: [SP]
      },
      functions: [{ text: 'A lapockát előre húzza a mellkasfalon (protrakció).', evidence: 'anatomical-fact', sourceIds: [SP] }]
    },
    {
      id: 'muscle-serratus-anterior-inferior',
      kind: 'muscle-region',
      muscleId: 'muscle-serratus-anterior',
      name: { hu: 'Alsó rész', en: 'Inferior part', la: 'Pars inferior' },
      origin: {
        type: 'origin',
        description: { hu: 'A 4–9. borda', en: 'Fourth to ninth ribs', la: 'Costae IV–IX' },
        structureIds: ['bone-ribs'],
        extent: 'line',
        sourceIds: [SP]
      },
      insertion: {
        type: 'insertion',
        description: {
          hu: 'A lapocka alsó szöge (angulus inferior) közelében, az elülső felszínen',
          en: 'Near the inferior angle of the scapula, costal surface',
          la: 'Angulus inferior scapulae'
        },
        structureIds: ['bone-scapula-inferior-angle'],
        extent: 'line',
        sourceIds: [SP]
      },
      innervation: {
        text: 'Hosszú mellkasi ideg (n. thoracicus longus), emellett egy bordaközi ideg ága.',
        evidence: 'anatomical-fact',
        sourceIds: [SP]
      },
      functions: [
        { text: 'A lapockát felfelé rotálja: az alsó szöget előre-oldalra viszi, ez teszi lehetővé a kar emelését.', evidence: 'anatomical-fact', sourceIds: [SP] },
        { text: 'A csuklyásizom felső és alsó részével együtt tartja a felfelé rotációt a fej fölé emelésnél.', evidence: 'anatomical-fact', sourceIds: [SP, 'neumann-kinesiology'] }
      ]
    }
  ],
  origin: [
    {
      type: 'origin',
      description: {
        hu: 'Az 1–8. (vagy 1–9.) borda külső, felső-oldalsó felszíne, a mellkas oldalfalán, fűrészfogszerű nyúlványokkal',
        en: 'Superolateral (outer) surfaces of ribs 1–8 (or 1–9) on the lateral thoracic wall, by digitations',
        la: 'Costae I–VIII (IX)'
      },
      structureIds: ['bone-ribs'],
      extent: 'line',
      sourceIds: ANAT
    }
  ],
  insertion: [
    {
      type: 'insertion',
      description: {
        hu: 'A lapocka felső szöge, belső széle és alsó szöge – az elülső (bordai) felszínen',
        en: 'Costal (anterior) surface of the superior angle, medial border and inferior angle of the scapula',
        la: 'Margo medialis scapulae (facies costalis), angulus superior et inferior'
      },
      structureIds: ['bone-scapula-superior-angle', 'bone-scapula-medial-border', 'bone-scapula-inferior-angle'],
      extent: 'line',
      sourceIds: ANAT
    }
  ],
  innervation: [
    { text: 'Hosszú mellkasi ideg (n. thoracicus longus), jellemzően a C5–C7 gerincvelői idegekből.', evidence: 'anatomical-fact', sourceIds: [SP, 'statpearls-pectoral', 'moore-coa'] },
    {
      text: 'Az ideg az izom külső felszínén fut lefelé, kis átmérőjű és kevés kötőszövet védi – ezért sérülékeny (pl. hónalji nyirokcsomó-eltávolításnál).',
      evidence: 'anatomical-fact',
      sourceIds: [SP]
    },
    { text: 'A felső és az alsó résznek kettős beidegzése is lehet (független C4–C6 ág, illetve bordaközi ideg ága).', evidence: 'anatomical-fact', sourceIds: [SP, 'nasu-2012'] }
  ],
  nerveIds: ['nerve-long-thoracic'],
  functions: [
    { text: 'A lapockát előre húzza a mellkas körül (protrakció) – a kar előre nyújtásának, ütésnek egyik fő mozgatója („bokszolóizom”).', evidence: 'anatomical-fact', sourceIds: [SP, 'statpearls-pectoral', 'openstax-ap2e'] },
    { text: 'A lapocka felfelé rotációja a csuklyásizom felső és alsó részével együtt – ez teszi lehetővé a fej fölé emelést.', evidence: 'anatomical-fact', sourceIds: [SP, 'neumann-kinesiology'] },
    { text: 'Mozgás közben a lapockát a mellkasfal közelében tartja (ez nem mozdulatlanság); ebben a rombuszizmokkal együtt szinergistaként dolgozik.', evidence: 'anatomical-fact', sourceIds: [SP] },
    { text: 'A karemelés közben bemutatott mozgásban a lapocka hátrabillentéséhez is hozzájárulhat.', evidence: 'educational-model', sourceIds: ['neumann-kinesiology'] },
    {
      text: 'Regionális mérés (a teljes izom funkcióitól külön): egy EMG-vizsgálatban (29 fő, 9 izomteszt) a felfelé rotált lapockával végzett teszteknél az alsó részen nagyobb jelet mértek, mint a felsőn; maximális protrakciós teszteknél nem volt különbség. Ez a vizsgált feladatokra vonatkozik; felső rostokat izoláló gyakorlat nem következik belőle.',
      evidence: 'documented-observation',
      sourceIds: ['ekstrom-2004']
    },
    { text: 'Rögzített vállöv mellett mindhárom része a bordákat emeli: segíti a belégzést.', evidence: 'anatomical-fact', sourceIds: [SP, 'openstax-ap2e'] }
  ],
  jointIds: ['joint-scapulothoracic', 'joint-acromioclavicular', 'joint-sternoclavicular'],
  roles: [
    {
      movementId: 'scapular-protraction',
      role: 'agonist',
      structureIds: ['muscle-serratus-anterior'],
      note: 'A protrakció egyik fő mozgatója.',
      evidence: 'anatomical-fact',
      sourceIds: [SP, ...KIN]
    },
    {
      movementId: 'scapular-protraction',
      role: 'synergist',
      structureIds: ['muscle-pectoralis-minor'],
      evidence: 'anatomical-fact',
      sourceIds: KIN
    },
    {
      movementId: 'scapular-protraction',
      role: 'antagonist',
      structureIds: ['muscle-rhomboids', 'muscle-trapezius'],
      note: 'A retraktorok: a rombuszizmok és a csuklyásizom középső része.',
      evidence: 'anatomical-fact',
      sourceIds: [SP, ...KIN]
    },
    {
      movementId: 'scapular-upward-rotation',
      role: 'agonist',
      structureIds: ['muscle-serratus-anterior', 'muscle-trapezius'],
      note: 'Erőpárként dolgoznak: az elülső fűrészizom és a csuklyásizom felső és alsó része. Egy EMG-vizsgálatban felfelé rotált lapockával az alsó részen nagyobb jelet mértek, mint a felsőn (a vizsgált feladatokban).',
      evidence: 'anatomical-fact',
      sourceIds: [SP, 'neumann-kinesiology']
    },
    {
      movementId: 'scapular-upward-rotation',
      role: 'antagonist',
      structureIds: ['muscle-rhomboids', 'muscle-levator-scapulae', 'muscle-pectoralis-minor'],
      note: 'A lapocka lefelé rotálói.',
      evidence: 'anatomical-fact',
      sourceIds: ['neumann-kinesiology']
    },
    {
      movementId: 'scapular-posterior-tilt',
      role: 'agonist',
      structureIds: ['muscle-serratus-anterior', 'muscle-trapezius'],
      note: 'A csuklyásizomnak az alsó része vesz részt benne.',
      evidence: 'educational-model',
      sourceIds: ['neumann-kinesiology']
    },
    {
      movementId: 'scapular-posterior-tilt',
      role: 'antagonist',
      structureIds: ['muscle-pectoralis-minor'],
      note: 'A kis mellizom a lapockát előre billenti.',
      evidence: 'anatomical-fact',
      sourceIds: ['neumann-kinesiology']
    },
    {
      movementId: 'accessory-inspiration',
      role: 'agonist',
      structureIds: ['muscle-serratus-anterior'],
      note: 'Csak rögzített vállöv mellett emelheti a bordákat.',
      evidence: 'anatomical-fact',
      sourceIds: [SP, 'openstax-ap2e']
    },
    {
      movementId: 'accessory-inspiration',
      role: 'synergist',
      structureIds: ['muscle-pectoralis-minor'],
      note: 'Rögzített lapocka mellett a 3–5. bordát emeli.',
      evidence: 'anatomical-fact',
      sourceIds: ['openstax-ap2e', 'moore-coa']
    },
    {
      movementId: 'accessory-inspiration',
      role: 'stabilizer',
      structureIds: ['muscle-rhomboids', 'muscle-trapezius', 'muscle-levator-scapulae'],
      note: 'A lapocka rögzítése teszi lehetővé, hogy az izom a bordákat húzza, ne a lapockát.',
      evidence: 'educational-model',
      sourceIds: ['neumann-kinesiology']
    }
  ],
  stabilization: [
    {
      text: 'A lapockát a mellkasfalon tartja. Ha működése kiesik, a lapocka belső széle és alsó szöge elemelkedik a mellkasfaltól (szárnyas lapocka).',
      evidence: 'anatomical-fact',
      sourceIds: [SP]
    },
    {
      text: 'A rombuszizmokkal együtt a lapockát a mellkashoz szorítja: a protrakcióban ellentétesen, a rögzítésben együtt dolgoznak.',
      evidence: 'anatomical-fact',
      sourceIds: [SP]
    },
    {
      text: 'Támaszhelyzetben (fekvőtámasz, kartámasz) a lapockát a mellkasfalon tartja, így a vállöv stabil alapot ad a karnak.',
      evidence: 'educational-model',
      sourceIds: ['neumann-kinesiology']
    }
  ],
  notes: [
    {
      text: 'Az ábrákon a kontúrok az egész izom és a három rész hozzávetőleges helyzetét szemléltetik; a bordánkénti eredés és a pontos részhatárok nem mért geometriák. A három rész felosztását boncolásos vizsgálat is alátámasztja (felső: 1. borda és a 2. borda felső kötege → felső szöglet; középső: 2. borda alsó kötege és 3. borda → belső szél; alsó: 4–8/9. borda → alsó szög).',
      evidence: 'educational-model',
      sourceIds: ['webb-2018', SP]
    },
    {
      text: 'Fő része a lapocka és a mellizmok mögött fekszik. A mellkas oldalán, a nagy mellizom és a széles hátizom között jól kitapintható.',
      evidence: 'anatomical-fact',
      sourceIds: [SP]
    },
    {
      text: 'A lapocka alatti izomtól a lapocka alatti nyálkatömlő (bursa supraserrata), a bordáktól a lapocka-mellkasi nyálkatömlő (bursa infraserrata) választja el.',
      evidence: 'anatomical-fact',
      sourceIds: [SP]
    },
    {
      text: 'Vérellátása: az oldalsó mellkasi artéria (a. thoracica lateralis), a felső mellkasi artéria (a. thoracica superior; főként a felső részt) és a mellkas-háti artéria (a. thoracodorsalis; az alsó részt).',
      evidence: 'anatomical-fact',
      sourceIds: [SP, 'statpearls-pectoral']
    },
    {
      text: 'Szárnyas lapocka: a hosszú mellkasi ideg sérülésekor a lapocka belső széle elemelkedik a mellkasfaltól (mediális szárnyaslapocka). Ezt meg kell különböztetni a csuklyásizom vagy a rombuszizmok gyengesége okozta laterális szárnyaslapockától.',
      evidence: 'anatomical-fact',
      sourceIds: [SP]
    },
    {
      text: 'Az ideg sérülésének okai lehetnek: mellkasi és hónalji műtétek (pl. emlőeltávolítás, hónalji nyirokcsomó-eltávolítás, az 1. borda eltávolítása), összenyomódás vagy beszorulás a középső lépcsőizomnál, nehéz teher cipelése, sportolás közbeni túlterhelés, húzódás.',
      evidence: 'anatomical-fact',
      sourceIds: [SP]
    },
    {
      text: 'Változatok: tapadhat a 10. bordán is, hiányozhat az 1. bordai nyúlványa, rostjai összenőhetnek a lapockaemelő izommal, a külső bordaközi izmokkal vagy a külső ferde hasizommal.',
      evidence: 'anatomical-fact',
      sourceIds: [SP, 'statpearls-pectoral']
    },
    {
      text: 'Ismétlődő mikrosérülés (pl. tartós, erős köhögés, nehéz teher ismételt fej fölé emelése, hosszútávfutás) izom-pólyai fájdalomszindrómát okozhat; a fájdalom jellemzően az 5–7. bordánál, a középső hónaljvonalban jelentkezik.',
      evidence: 'anatomical-fact',
      sourceIds: [SP]
    }
  ],
  sourceIds: ['smith-2003', 'nasu-2012', 'webb-2018', 'ekstrom-2004', 'statpearls-serratus', 'statpearls-pectoral', 'openstax-ap2e', 'moore-coa', 'grays-anatomy', 'neumann-kinesiology', 'fipat-ta2'],
  motionIds: ['sa-protraction', 'sa-upward-rotation', 'sa-posterior-tilt', 'sa-accessory-inspiration'],
  exerciseIds: ['serratus-punch', 'push-up-plus', 'scaption-overhead']
};
