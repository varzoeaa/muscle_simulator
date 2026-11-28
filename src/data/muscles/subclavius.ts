import type { Muscle } from '../../types';

/**
 * Kulcscsont alatti izom (musculus subclavius). Az anatómiai adatok (eredés, tapadás, beidegzés,
 * működés, vérellátás, változatok, klinikai vonatkozás) a StatPearls „Pectoral Muscles” és
 * „Sternoclavicular Joint” fejezete, az OpenStax Anatomy and Physiology 11.5 alfejezete, valamint
 * standard tankönyvek (Moore, Gray's) alapján szerepelnek (online ellenőrizve: 2026-11-27). A
 * változatok boncolásos vizsgálatokból, a stabilizáló szerep egy EMG-vizsgálatból (Reis 1979)
 * származik. Különválasztjuk a tipikus anatómiát, a konkrét vizsgálati eredményt és az animáció
 * szemléltető feltevéseit. A szerepek Neumann (2017) leírását követik.
 */
const KIN = ['neumann-kinesiology', 'moore-coa'];

export const subclavius: Muscle = {
  id: 'muscle-subclavius',
  kind: 'muscle',
  status: 'available',
  name: { hu: 'Kulcscsont alatti izom', en: 'Subclavius', la: 'Musculus subclavius' },
  summary:
    'Kicsi, háromszög alakú izom a kulcscsont alatt, a nagy mellizom mögött. Az 1. bordától a kulcscsont alsó felszínéig fut. A kulcscsontot süllyeszti és rögzíti, így mozgás közben stabilizálja; rögzített kulcscsontnál az 1. bordát emelheti. Kulcscsonttörésnél lehetséges anatómiai védőréteg az alatta futó erek és idegek előtt – ez nem igazolt klinikai védelem.',
  defaultViewId: 'anterior',
  regions: [],
  origin: [
    {
      type: 'origin',
      description: {
        hu: 'Az 1. borda és bordaporca, a kulcscsont-borda szalag (lig. costoclaviculare) előtt',
        en: 'First rib and its costal cartilage, anterior to the costoclavicular ligament',
        la: 'Costa I et cartilago costalis I'
      },
      structureIds: ['bone-ribs', 'bone-costal-cartilages'],
      extent: 'line',
      sourceIds: ['statpearls-pectoral', 'openstax-ap2e', 'moore-coa']
    }
  ],
  insertion: [
    {
      type: 'insertion',
      description: {
        hu: 'A kulcscsont alsó felszínén, a kulcscsont alatti izom barázdájában (tájékozódásként: a középső harmad; a tapadás tényleges kiterjedése egyénenként változhat)',
        en: 'Subclavian groove on the inferior surface of the clavicle (as a landmark: the middle third; the actual extent of the attachment varies)',
        la: 'Sulcus musculi subclavii (clavicula)'
      },
      structureIds: ['bone-clavicle'],
      extent: 'line',
      sourceIds: ['statpearls-pectoral', 'openstax-ap2e', 'moore-coa']
    }
  ],
  innervation: [
    { text: 'Kulcscsont alatti ideg (n. subclavius).', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral', 'moore-coa'] },
    { text: 'Az ideg tipikusan a karfonat felső törzséből ered, rostjai tipikusan a C5–C6 szegmentumokból származnak.', evidence: 'anatomical-fact', sourceIds: ['moore-coa', 'statpearls-sc-joint'] }
  ],
  nerveIds: ['nerve-subclavius'],
  functions: [
    { text: 'A kulcscsontot süllyeszti és rögzíti – mozgás közben stabilizálja.', evidence: 'anatomical-fact', sourceIds: ['openstax-ap2e', 'moore-coa'] },
    { text: 'A vállat (vállövet) süllyeszti.', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral'] },
    { text: 'Rögzített kulcscsont mellett az 1. bordát emelheti (tankönyvi mechanizmus).', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral'] },
    { text: 'A szegycsont-kulcscsonti ízület stabilitását segíti.', evidence: 'anatomical-fact', sourceIds: ['statpearls-sc-joint'] },
    {
      text: 'Közvetlenül a kulcscsontra hat, ezért a szegycsont-kulcscsonti ízületnél fejti ki a hatását. A vállcsúcs-kulcscsonti ízületet csak közvetve érinti: a kulcscsont helyzete a lapockával való kapcsolatot is befolyásolja, és a vállöv mozgásában mindkét ízület részt vesz.',
      evidence: 'educational-model',
      sourceIds: ['ludewig-2009', 'neumann-kinesiology']
    }
  ],
  jointIds: ['joint-sternoclavicular', 'joint-acromioclavicular'],
  jointNotes: {
    'joint-sternoclavicular': 'Közvetlen hatás: a kulcscsontot süllyeszti és rögzíti ennél az ízületnél.',
    'joint-acromioclavicular': 'Közvetett érintettség: az izom nem ér el a lapockáig; a kulcscsont helyzetén keresztül befolyásolja.'
  },
  roles: [
    {
      movementId: 'clavicular-depression',
      role: 'agonist',
      structureIds: ['muscle-subclavius'],
      evidence: 'anatomical-fact',
      sourceIds: ['openstax-ap2e', 'moore-coa']
    },
    {
      movementId: 'clavicular-depression',
      role: 'synergist',
      structureIds: ['muscle-pectoralis-minor', 'muscle-latissimus-dorsi'],
      note: 'Más csontra hatnak: a kis mellizom és a csuklyásizom alsó része a lapockára, a széles hátizom a felkarcsontra; a kulcscsontot csak közvetve, a vállövön keresztül viszik lefelé. A sorrend a szemléltetett helyzetre (emelt kulcscsont visszatérése) vonatkozik.',
      evidence: 'educational-model',
      sourceIds: KIN
    },
    {
      movementId: 'clavicular-depression',
      role: 'antagonist',
      structureIds: ['muscle-trapezius', 'muscle-levator-scapulae'],
      note: 'A vállöv emelői: a csuklyásizom felső része a kulcscsonton, a lapockaemelő izom a lapockán keresztül.',
      evidence: 'anatomical-fact',
      sourceIds: KIN
    },
    {
      movementId: 'scapular-depression',
      role: 'agonist',
      structureIds: ['muscle-pectoralis-minor', 'muscle-trapezius', 'muscle-latissimus-dorsi'],
      note: 'A csuklyásizomnak az alsó része süllyeszt.',
      evidence: 'anatomical-fact',
      sourceIds: KIN
    },
    {
      movementId: 'scapular-depression',
      role: 'synergist',
      structureIds: ['muscle-subclavius'],
      note: 'Közvetlenül a kulcscsontra hat: annak süllyesztésével és rögzítésével segítheti a vállöv süllyesztését. A kis mellizom a lapockára, a széles hátizom a felkarcsontra hat. Az agonista–szinergista sorrend a szemléltetett helyzetre vonatkozik.',
      evidence: 'educational-model',
      sourceIds: ['statpearls-pectoral', 'neumann-kinesiology']
    },
    {
      movementId: 'scapular-depression',
      role: 'antagonist',
      structureIds: ['muscle-levator-scapulae', 'muscle-rhomboids'],
      evidence: 'anatomical-fact',
      sourceIds: KIN
    },
    {
      movementId: 'accessory-inspiration',
      role: 'agonist',
      structureIds: ['muscle-subclavius'],
      note: 'Rögzített kulcscsont mellett az 1. bordát emelheti (tankönyvi mechanizmus). Hogy egy adott belégzési feladatban mikor és mennyire aktív, azt nem mérték.',
      evidence: 'anatomical-fact',
      sourceIds: ['statpearls-pectoral']
    },
    {
      movementId: 'accessory-inspiration',
      role: 'synergist',
      structureIds: ['muscle-pectoralis-minor', 'muscle-pectoralis-major-sternocostal'],
      note: 'Rögzített vállöv mellett ezek is a bordák emelését segíthetik (a nagy mellizomnak a szegycsonti-bordai része; a kulcscsonti rész a kulcscsonton ered).',
      evidence: 'anatomical-fact',
      sourceIds: ['openstax-ap2e', 'grays-anatomy']
    },
    {
      movementId: 'accessory-inspiration',
      role: 'stabilizer',
      structureIds: ['muscle-trapezius', 'muscle-levator-scapulae'],
      note: 'A modell feltételezése: a vállöv rögzített, így az izom a bordát húzhatja, nem a kulcscsontot. A tartóizmok részvételét ebben a helyzetben nem mérték.',
      evidence: 'educational-model',
      sourceIds: ['neumann-kinesiology']
    }
  ],
  stabilization: [
    { text: 'A kulcscsontot az 1. borda felé húzva rögzíti, így mozgás közben stabilizálja.', evidence: 'anatomical-fact', sourceIds: ['openstax-ap2e', 'moore-coa'] },
    {
      text: 'Egy 12 fős EMG-vizsgálatban (31 mozgás) a szerzők azt találták, hogy az izom főként a szegycsont-kulcscsonti ízület stabilitásában működik, a kulcscsont mozgásban való részvételének mértékétől függő intenzitással. Ez a stabilizáló szerepet támogató megfigyelés (az absztrakt alapján).',
      evidence: 'documented-observation',
      sourceIds: ['reis-1979']
    },
    { text: 'Közel változatlan testhelyzetben az izom a kulcscsontot aktívan, elmozdulás nélkül is rögzítheti (izometriás működés) – ez lehetséges működés; hogy milyen gyakori, arra nincs közvetlen mérés.', evidence: 'educational-model', sourceIds: ['neumann-kinesiology'] }
  ],
  notes: [
    {
      text: 'Lehetséges anatómiai védőréteg: az izom és a fascia clavipectoralis a kulcscsont és az alatta futó karfonat (plexus brachialis), illetve a kulcscsont alatti erek között helyezkedik el, ezért kulcscsonttörésnél védőrétegként szolgálhat.',
      evidence: 'anatomical-fact',
      sourceIds: ['statpearls-pectoral', 'statpearls-sc-joint']
    },
    {
      text: 'Ez nem igazolt klinikai kimenetel: egy esetismertetésben az elmozdult belső törtdarab ép izom mellett is a karfonatot és a kulcscsont alatti artériát az 1. bordához nyomta.',
      evidence: 'documented-observation',
      sourceIds: ['gill-2013']
    },
    { text: 'Eredése a kulcscsont-borda szalag előtt van; ez a szalag köti a kulcscsontot az 1. bordához.', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral'] },
    { text: 'Dokumentált ellátó ága a mellkas-vállcsúcsi artériás törzs (truncus thoracoacromialis) kulcscsonti ága.', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral'] },
    {
      text: 'Rostos nyúlvány a hollócsőrnyúlvány felé: egy boncolásos mintában (26 test, 52 felső végtag) 49 esetben találtak az izomból a hollócsőrnyúlványhoz futó rostos nyúlványt. Ez az adott minta eredménye.',
      evidence: 'documented-observation',
      sourceIds: ['crepaz-eger-2022']
    },
    {
      text: 'Rendhagyó izmos tapadás: ritkán a kulcscsont helyett, vagy azzal együtt, a hollócsőrnyúlványon tapad.',
      evidence: 'anatomical-fact',
      sourceIds: ['statpearls-pectoral']
    },
    {
      text: 'Járulékos izom – „subclavius posticus”: az 1. borda környékéről a kulcscsont alatt halad, és a lapocka felső szélén vagy a hollócsőrnyúlványon tapadhat.',
      evidence: 'documented-observation',
      sourceIds: ['statpearls-pectoral', 'crepaz-eger-2022', 'prommahom-2026']
    },
    {
      text: 'Az izom hiánya és a többszörös izomköteg is dokumentált változat.',
      evidence: 'documented-observation',
      sourceIds: ['statpearls-pectoral', 'crepaz-eger-2022']
    }
  ],
  sourceIds: ['moore-coa', 'grays-anatomy', 'openstax-ap2e', 'statpearls-pectoral', 'statpearls-sc-joint', 'reis-1979', 'ludewig-2009', 'crepaz-eger-2022', 'prommahom-2026', 'gill-2013', 'neumann-kinesiology', 'fipat-ta2'],
  motionIds: ['sub-clavicular-depression', 'sub-girdle-depression', 'sub-accessory-inspiration'],
  // A lapocka-süllyesztés támaszban gyakorlat a kis mellizommal közös.
  exerciseIds: ['scapular-depression-dip', 'scapular-pulldown', 'shoulder-shrug']
};
