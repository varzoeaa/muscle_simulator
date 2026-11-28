import type { Claim, Muscle } from '../../types';

/**
 * Csuklyásizom (musculus trapezius) – anatómiai adatlap. Eredés, tapadás, rostirány, változatok,
 * beidegzés és működés: Gray's Anatomy 20. kiadás (1918, 432–435. o., közkincs, teljes szöveg),
 * StatPearls „Anatomy, Back, Trapezius” (2023), a részek latin neve: FIPAT (TA2). A vállöv
 * kineziológiája (erőpár, a lapocka térbeli mozgásai): Neumann (2017) és Ludewig és mtsai (2009).
 * A három rész csigolyaszint-határa oktatási felosztás: a források eltérően húzzák meg.
 */
const G = 'grays-1918';
const SPT = 'statpearls-trapezius';
const NEU = 'neumann-kinesiology';
const ANAT = [G, SPT];
const LEVELS_NOTE: Claim = {
  text: 'A szinthatár oktatási felosztás: a források eltérően osztják fel a C7–T12 eredést (a StatPearls például a tövisnyúlványok felső és alsó szakaszát rendeli a középső, illetve az alsó részhez). Gray (1918) szerint a középső szakasz a C6–T3 szinten egy széles, ínas lemezzel ered.',
  evidence: 'educational-model',
  sourceIds: [G, SPT]
};

export const trapezius: Muscle = {
  id: 'muscle-trapezius',
  kind: 'muscle',
  status: 'available',
  name: { hu: 'Csuklyásizom', en: 'Trapezius', la: 'Musculus trapezius' },
  summary:
    'Lapos, háromszög alakú, felületes izom a tarkó, a nyak hátsó része és a felső hát felett – a két oldali izom együtt trapéz (rombusz) alakú. A nyakszirtcsonttól, a tarkószalagtól és a C7–T12 tövisnyúlványoktól a kulcscsont laterális harmadáig, a vállcsúcsig és a lapockatövisig fut. Motoros beidegzése a járulékos ideg (XI. agyideg). A lapockát mozgatja és mozgás közben stabilizálja: a felső rész emeli, a középső hátrahúzza, az alsó süllyeszti, és az elülső fűrészizommal együtt felfelé rotálja.',
  defaultViewId: 'posterior',
  atlasViewIds: ['posterior'],
  viewNotes: {
    posterior:
      'Sematikus oktatási ábra (hátulnézet). A felső rész a kulcscsont laterális harmadának hátsó szélén tapad; a kulcscsont hátulról csak a váll tetején, rövidülve látszik, ezért ez a tapadás itt hozzávetőleges. A középső rész a vállcsúcs mediális szélén és a lapockatövis felső ajkán, az alsó rész a tövis mediális végének gumóján tapad – a tövis vonalán sematikusan jelölve. A régióhatárok és a csigolyaszintek (kb. C7–T3, T4–T12) oktatási felosztás; a rostvonalak az irányt szemléltetik, nem mért geometriát.'
  },
  regions: [
    {
      id: 'muscle-trapezius-descending',
      kind: 'muscle-region',
      muscleId: 'muscle-trapezius',
      name: { hu: 'Felső (leszálló) rész', en: 'Descending part (upper fibres)', la: 'Pars descendens' },
      origin: {
        type: 'origin',
        description: {
          hu: 'A külső nyakszirti dudor, a felső tarkóvonal mediális harmada és a tarkószalag (ligamentum nuchae)',
          en: 'External occipital protuberance, medial third of the superior nuchal line and the nuchal ligament',
          la: 'Protuberantia occipitalis externa, linea nuchalis superior, ligamentum nuchae'
        },
        structureIds: ['bone-skull', 'ligament-nuchae'],
        extent: 'line',
        sourceIds: ANAT
      },
      insertion: {
        type: 'insertion',
        description: {
          hu: 'A kulcscsont laterális harmadának hátsó széle',
          en: 'Posterior border of the lateral third of the clavicle',
          la: 'Clavicula (pars acromialis, margo posterior)'
        },
        structureIds: ['bone-clavicle'],
        extent: 'line',
        sourceIds: ANAT
      },
      fiberDirection: { text: 'A rostok a tapadás felé lefelé és oldalra futnak.', evidence: 'anatomical-fact', sourceIds: [G] },
      innervation: { text: 'Motoros: járulékos ideg (XI. agyideg). A C3–C4 nyaki ágak a tankönyvi leírás szerint főként érző és proprioceptív rostokat visznek.', evidence: 'anatomical-fact', sourceIds: ANAT },
      functions: [
        { text: 'Rögzített fej mellett a vállcsúcsot – a lapockát és a kulcscsont laterális végét – emeli (pl. teher tartásakor).', evidence: 'anatomical-fact', sourceIds: [G] },
        { text: 'A lapocka felfelé rotációjában az alsó résszel és az elülső fűrészizommal együtt vesz részt (erőpár).', evidence: 'educational-model', sourceIds: [NEU, G] },
        { text: 'Rögzített vállöv mellett a fejet és a nyakat hátrafelé húzza (kétoldali működés), egyoldali működésnél az azonos oldal felé hajlítja.', evidence: 'anatomical-fact', sourceIds: [G] }
      ]
    },
    {
      id: 'muscle-trapezius-transverse',
      kind: 'muscle-region',
      muscleId: 'muscle-trapezius',
      name: { hu: 'Középső (haránt) rész', en: 'Transverse part (middle fibres)', la: 'Pars transversa' },
      origin: {
        type: 'origin',
        description: {
          hu: 'Az alsó nyaki és a felső háti tövisnyúlványok (kb. C7–T3) és a tövisnyúlvány feletti szalag',
          en: 'Spinous processes of the lower cervical and upper thoracic vertebrae (approx. C7–T3) and the supraspinous ligament',
          la: 'Processus spinosi (C7–T3), ligamentum supraspinale'
        },
        structureIds: ['bone-spinous-processes', 'ligament-supraspinous'],
        extent: 'line',
        sourceIds: ANAT
      },
      insertion: {
        type: 'insertion',
        description: {
          hu: 'A vállcsúcs mediális széle és a lapockatövis hátsó szélének felső ajka',
          en: 'Medial margin of the acromion and superior lip of the posterior border of the spine of the scapula',
          la: 'Acromion (margo medialis), spina scapulae (labium superius)'
        },
        structureIds: ['bone-scapula-acromion', 'bone-scapula-spine'],
        extent: 'line',
        sourceIds: [G]
      },
      fiberDirection: { text: 'A rostok közel vízszintesen futnak a tapadás felé.', evidence: 'anatomical-fact', sourceIds: [G] },
      innervation: { text: 'Motoros: járulékos ideg (XI. agyideg); C3–C4 nyaki ágak (főként érző és proprioceptív rostok).', evidence: 'anatomical-fact', sourceIds: ANAT },
      functions: [
        { text: 'A lapockát a gerinc felé hátrahúzza (retrakció); ebben a rombuszizmokkal és az alsó résszel működik együtt.', evidence: 'anatomical-fact', sourceIds: [G, SPT] },
        { text: 'A teljes izommal együtt a vállat hátrafeszíti; mozgás közben a lapockát a mellkasfal mentén tartja.', evidence: 'anatomical-fact', sourceIds: [G] },
        LEVELS_NOTE
      ]
    },
    {
      id: 'muscle-trapezius-ascending',
      kind: 'muscle-region',
      muscleId: 'muscle-trapezius',
      name: { hu: 'Alsó (felszálló) rész', en: 'Ascending part (lower fibres)', la: 'Pars ascendens' },
      origin: {
        type: 'origin',
        description: {
          hu: 'A középső és alsó háti tövisnyúlványok (kb. T4–T12) és a tövisnyúlvány feletti szalag',
          en: 'Spinous processes of the middle and lower thoracic vertebrae (approx. T4–T12) and the supraspinous ligament',
          la: 'Processus spinosi (T4–T12), ligamentum supraspinale'
        },
        structureIds: ['bone-spinous-processes', 'ligament-supraspinous'],
        extent: 'line',
        sourceIds: ANAT
      },
      insertion: {
        type: 'insertion',
        description: {
          hu: 'A lapockatövis mediális végén lévő sima, háromszögletű felszín csúcsánál fekvő gumó – ínas lemezzel, amely a sima felszínen siklik',
          en: 'Tubercle at the apex of the smooth triangular surface at the medial end of the scapular spine, via an aponeurosis gliding over that surface',
          la: 'Spina scapulae (extremitas medialis)'
        },
        structureIds: ['bone-scapula-spine'],
        extent: 'point',
        sourceIds: [G]
      },
      fiberDirection: { text: 'A rostok felfelé és oldalra futnak, és a lapocka közelében összetartanak.', evidence: 'anatomical-fact', sourceIds: [G] },
      innervation: { text: 'Motoros: járulékos ideg (XI. agyideg); C3–C4 nyaki ágak (főként érző és proprioceptív rostok).', evidence: 'anatomical-fact', sourceIds: ANAT },
      functions: [
        { text: 'Segít a lapocka süllyesztésében.', evidence: 'anatomical-fact', sourceIds: [G, SPT] },
        { text: 'A középső résszel és az elülső fűrészizommal a lapockát felfelé rotálja – közben a vállcsúcs emelkedik.', evidence: 'anatomical-fact', sourceIds: [G] },
        { text: 'A rombuszizmokkal és a középső résszel a lapocka hátrahúzásában (retrakció) is részt vesz.', evidence: 'anatomical-fact', sourceIds: [G] },
        LEVELS_NOTE
      ]
    }
  ],
  origin: [
    {
      type: 'origin',
      description: {
        hu: 'A külső nyakszirti dudor és a felső tarkóvonal mediális harmada (nyakszirtcsont)',
        en: 'External occipital protuberance and medial third of the superior nuchal line (occipital bone)',
        la: 'Protuberantia occipitalis externa, linea nuchalis superior'
      },
      structureIds: ['bone-skull'],
      extent: 'line',
      sourceIds: ANAT
    },
    {
      type: 'origin',
      description: { hu: 'A tarkószalag', en: 'Nuchal ligament', la: 'Ligamentum nuchae' },
      structureIds: ['ligament-nuchae'],
      extent: 'line',
      sourceIds: ANAT
    },
    {
      type: 'origin',
      description: {
        hu: 'A C7 és mind a 12 háti csigolya (T1–T12) tövisnyúlványa és a tövisnyúlvány feletti szalag',
        en: 'Spinous processes of C7 and all thoracic vertebrae (T1–T12) and the supraspinous ligament',
        la: 'Processus spinosi C7–T12, ligamentum supraspinale'
      },
      structureIds: ['bone-spinous-processes', 'ligament-supraspinous'],
      extent: 'line',
      sourceIds: ANAT
    }
  ],
  insertion: [
    {
      type: 'insertion',
      description: { hu: 'A kulcscsont laterális harmadának hátsó széle', en: 'Posterior border of the lateral third of the clavicle', la: 'Clavicula (tertia lateralis)' },
      structureIds: ['bone-clavicle'],
      extent: 'line',
      sourceIds: ANAT
    },
    {
      type: 'insertion',
      description: { hu: 'A vállcsúcs mediális széle', en: 'Medial margin of the acromion', la: 'Acromion' },
      structureIds: ['bone-scapula-acromion'],
      extent: 'line',
      sourceIds: ANAT
    },
    {
      type: 'insertion',
      description: {
        hu: 'A lapockatövis: a hátsó szél felső ajka és a mediális vég gumója',
        en: 'Spine of the scapula: superior lip of its posterior border and the tubercle at its medial end',
        la: 'Spina scapulae'
      },
      structureIds: ['bone-scapula-spine'],
      extent: 'line',
      sourceIds: ANAT
    }
  ],
  innervation: [
    { text: 'Motoros beidegzés: járulékos ideg (n. accessorius, XI. agyideg).', evidence: 'anatomical-fact', sourceIds: [SPT, G, 'moore-coa'] },
    {
      text: 'A C3–C4 nyaki idegek ventrális ágai is elérik az izmot. A StatPearls szerint ezek érző (fájdalom) és proprioceptív rostokat visznek; a régebbi leírás (Gray 1918) csak ágakat említ. A felosztást ezért tankönyvi leírásként, nem kizárólagos szabályként tanítjuk.',
      evidence: 'anatomical-fact',
      sourceIds: [SPT, G]
    }
  ],
  nerveIds: ['nerve-accessory', 'nerve-cervical-c3-c4'],
  functions: [
    { text: 'A teljes izom működésekor a lapockát hátrahúzza (retrakció), és a vállat hátrafeszíti.', evidence: 'anatomical-fact', sourceIds: [G] },
    { text: 'A három rész rostiránya eltérő, ezért a működés a vállöv és a kar helyzetétől függ: ugyanaz a rész más helyzetben más mozgásban lehet hatékony.', evidence: 'educational-model', sourceIds: [NEU, G] },
    {
      text: 'A felkarcsonton nem tapad, ezért a felkar belső–külső rotációja nem közvetlen funkciója. A kar emelését a lapocka felfelé rotációján keresztül, közvetve segíti.',
      evidence: 'educational-model',
      sourceIds: [NEU, G]
    }
  ],
  functionSections: [
    {
      title: 'Vállövi működés: a lapocka és a kulcscsont mozgatása',
      claims: [
        { text: 'Emelés (eleváció): a felső rész rögzített fej mellett a vállcsúcsot emeli – a lapockát és a kulcscsont laterális végét felfelé húzza.', evidence: 'anatomical-fact', sourceIds: [G] },
        { text: 'Hátrahúzás (retrakció): a középső rész a lapockát a gerinc felé húzza; a rombuszizmokkal és az alsó résszel együtt dolgozik.', evidence: 'anatomical-fact', sourceIds: [G, SPT] },
        { text: 'Süllyesztés (depresszió): az alsó rész segít a lapocka süllyesztésében.', evidence: 'anatomical-fact', sourceIds: [G, SPT] },
        {
          text: 'Felfelé rotáció: a lapocka úgy fordul, hogy az ízületi árok felfelé néz, a vállcsúcs emelkedik, az alsó szög oldalra-előre mozdul. A felső rész a vállcsúcsot és a kulcscsont laterális végét emeli, az alsó rész a lapockatövis mediális végét húzza lefelé, az elülső fűrészizom az alsó szöget viszi oldalra-előre – ez a három húzás erőpárként fordítja a lapockát.',
          evidence: 'educational-model',
          sourceIds: [NEU, G]
        },
        { text: 'Miután a deltaizom a kart vállmagasságig emelte, az elülső fűrészizom és a csuklyásizom a lapocka rotációjával segíti a kart közel függőleges helyzetbe.', evidence: 'anatomical-fact', sourceIds: [G] },
        { text: 'Hogy melyik rész mennyire dolgozik, az a vállöv és a kar helyzetétől, valamint a terheléstől függ; a fenti szerepek a jellemző irányt mutatják, nem mért aktivitást.', evidence: 'educational-model', sourceIds: [NEU] }
      ]
    },
    {
      title: 'A lapocka egyéb térbeli mozgásai és a felkar',
      claims: [
        {
          text: 'Karemeléskor a lapocka a felfelé rotáción kívül a függőleges tengelye körül is fordul (belső–külső rotáció), és hátrafelé billen; ezek a mozgások a vállcsúcs-kulcscsonti és a szegycsont-kulcscsonti ízületben jönnek létre.',
          evidence: 'documented-observation',
          sourceIds: ['ludewig-2009']
        },
        { text: 'A csuklyásizom egyes részeinek szerepét ezekben a térbeli forgásokban itt nem tanítjuk, mert ellenőrzött, részenkénti adat nem áll rendelkezésre.', evidence: 'educational-model', sourceIds: [NEU] },
        { text: 'A felkar belső és külső rotációja a vállízületben történik, a felkarcsonton tapadó izmok végzik; a csuklyásizom ebben nem közvetlen mozgató.', evidence: 'educational-model', sourceIds: [NEU, G] }
      ]
    },
    {
      title: 'Fej és nyak (rögzített vállöv mellett)',
      claims: [
        { text: 'Kétoldali működés: a két felső rész együtt a fejet és a nyakat egyenesen hátrafelé húzza (feszítés).', evidence: 'anatomical-fact', sourceIds: [G, SPT] },
        { text: 'Egyoldali működés: a felső rész a fejet az azonos oldal felé húzza (oldalra hajlítás).', evidence: 'anatomical-fact', sourceIds: [G] },
        { text: 'A fej ellentétes oldalra fordításában betöltött szerepét egyes leírások említik; ezt itt ellenőrzött forrás hiányában nem tanítjuk.', evidence: 'educational-model', sourceIds: [NEU] }
      ]
    }
  ],
  jointIds: ['joint-scapulothoracic', 'joint-acromioclavicular', 'joint-sternoclavicular', 'joint-glenohumeral'],
  jointNotes: {
    'joint-scapulothoracic': 'Közvetlen: a lapockát mozgatja és a mellkasfal mentén tartja. Ez élettani kapcsolat, nem valódi ízület.',
    'joint-acromioclavicular': 'Közvetlen: a középső és az alsó rész a vállcsúcsra és a lapockatövisre tapad; a lapocka itt fordul és billen a kulcscsonthoz képest.',
    'joint-sternoclavicular': 'Közvetlen: a felső rész a kulcscsont laterális harmadára tapad, így a kulcscsontot – a vállöv emelésekor és rotációjakor – ebben az ízületben mozdítja.',
    'joint-glenohumeral': 'Közvetett: a felkarcsonton nem tapad. A lapocka helyzetén, vagyis az ízületi árok irányán keresztül befolyásolja a vállízület mozgását.'
  },
  roles: [
    {
      movementId: 'scapular-elevation',
      role: 'agonist',
      structureIds: ['muscle-trapezius-descending', 'muscle-levator-scapulae'],
      note: 'A felső rész a vállcsúcsot és a kulcscsont laterális végét emeli; a lapockaemelő izom a lapocka felső szögét.',
      evidence: 'anatomical-fact',
      sourceIds: [G, NEU]
    },
    {
      movementId: 'scapular-elevation',
      role: 'antagonist',
      structureIds: ['muscle-trapezius-ascending', 'muscle-pectoralis-minor', 'muscle-latissimus-dorsi', 'muscle-subclavius'],
      note: 'A vállöv süllyesztői; a széles hátizom a felkarcsonton keresztül hat.',
      evidence: 'educational-model',
      sourceIds: [NEU]
    },
    {
      movementId: 'scapular-retraction',
      role: 'agonist',
      structureIds: ['muscle-trapezius-transverse', 'muscle-rhomboids'],
      evidence: 'anatomical-fact',
      sourceIds: [G, NEU]
    },
    {
      movementId: 'scapular-retraction',
      role: 'synergist',
      structureIds: ['muscle-trapezius-ascending'],
      note: 'Gray (1918) szerint a középső és az alsó rész a rombuszizmokkal együtt húzza hátra a lapockát.',
      evidence: 'anatomical-fact',
      sourceIds: [G]
    },
    {
      movementId: 'scapular-retraction',
      role: 'antagonist',
      structureIds: ['muscle-serratus-anterior', 'muscle-pectoralis-minor'],
      evidence: 'anatomical-fact',
      sourceIds: [NEU]
    },
    {
      movementId: 'scapular-depression',
      role: 'agonist',
      structureIds: ['muscle-trapezius-ascending', 'muscle-pectoralis-minor', 'muscle-latissimus-dorsi'],
      note: 'Az alsó rész a lapockatövis mediális végét, a kis mellizom a hollócsőrnyúlványt húzza lefelé; a széles hátizom a felkarcsonton keresztül hat. A sorrend a szemléltetett helyzetre vonatkozik.',
      evidence: 'educational-model',
      sourceIds: [G, NEU]
    },
    {
      movementId: 'scapular-depression',
      role: 'antagonist',
      structureIds: ['muscle-trapezius-descending', 'muscle-levator-scapulae'],
      evidence: 'anatomical-fact',
      sourceIds: [NEU]
    },
    {
      movementId: 'scapular-upward-rotation',
      role: 'agonist',
      structureIds: ['muscle-trapezius-descending', 'muscle-trapezius-ascending', 'muscle-serratus-anterior'],
      note: 'Erőpár: a felső rész a vállcsúcsot emeli, az alsó rész a tövis mediális végét húzza lefelé, az elülső fűrészizom az alsó szöget viszi oldalra-előre. A középső rész Gray (1918) szerint szintén hozzájárul.',
      evidence: 'educational-model',
      sourceIds: [NEU, G]
    },
    {
      movementId: 'scapular-upward-rotation',
      role: 'antagonist',
      structureIds: ['muscle-rhomboids', 'muscle-levator-scapulae', 'muscle-pectoralis-minor'],
      note: 'A lapocka lefelé rotálói (a címke a nyomaték irányát jelöli).',
      evidence: 'anatomical-fact',
      sourceIds: [NEU]
    }
  ],
  stabilization: [
    {
      text: 'A lapockát a törzshöz rögzíti, így a lapockáról a felkarra futó izmok hatékonyan tudnak működni. A rögzítés itt nem mozdulatlanságot jelent: mozgás közben a lapocka helyzetét szabályozza.',
      evidence: 'anatomical-fact',
      sourceIds: [SPT, NEU]
    },
    { text: 'A három rész együttműködése a vállöv és a kar helyzetétől függ: a stabilizálás és a mozgatás ugyanannak a működésnek két oldala.', evidence: 'educational-model', sourceIds: [NEU] }
  ],
  notes: [
    { text: 'Felületes izom: bőrön át, a tarkótól a hát közepéig tapintható. Boncoláskor a hát felületes izmai közül elsőként látszik.', evidence: 'anatomical-fact', sourceIds: [SPT] },
    { text: 'A két oldali izom együtt rombusz alakú: két szöge a vállaknál, egy a külső nyakszirti dudornál, egy a T12 tövisnyúlványánál van.', evidence: 'anatomical-fact', sourceIds: [G] },
    { text: 'A nyak hátsó háromszögének hátsó határa; a háromszöget elölről a fejbiccentő izom, alulról a kulcscsont zárja.', evidence: 'anatomical-fact', sourceIds: [SPT] },
    { text: 'A járulékos ideg sérülése után a csuklyásizom gyengül vagy sorvad: a váll lejjebb állhat, és a vállvonogatás ellenállással szemben gyengébb.', evidence: 'anatomical-fact', sourceIds: [SPT] },
    { text: 'Vérellátás: leggyakrabban főként a nyaki haránt artériából (a. transversa cervicis), a felső részhez a lapocka dorzális artériájából, a mélyebb részekhez hátsó bordaközi ágakból is.', evidence: 'anatomical-fact', sourceIds: [SPT] },
    { text: 'Változatok: a háti tövisnyúlványokról való eredés gyakran kisebb, az alsók hiányozhatnak; a nyakszirti eredés hiányozhat; a kulcscsonti tapadás a kulcscsont közepéig is érhet. Ritkán az izom egésze vagy egy része hiányzik.', evidence: 'documented-observation', sourceIds: [G, SPT] }
  ],
  sourceIds: ['fipat-ta2', G, SPT, 'moore-coa', 'grays-anatomy', NEU, 'ludewig-2009'],
  motionIds: [],
  exerciseIds: []
};
