import type { Muscle } from '../../types';

/**
 * Kulcscsont alatti izom (musculus subclavius). Az anatómiai adatok (eredés, tapadás, beidegzés,
 * működés, vérellátás, változatok, klinikai vonatkozás) a StatPearls „Pectoral Muscles” fejezete
 * és az OpenStax Anatomy and Physiology 2e 11.5 fejezete alapján (online ellenőrizve:
 * 2026-11-27), valamint standard tankönyvek (Moore, Gray's) alapján szerepelnek; a beidegző ideg
 * gerincvelői szegmentumai a Moore szerint. A szerepek Neumann (2017) leírását követik.
 */
const KIN = ['neumann-kinesiology', 'moore-coa'];

export const subclavius: Muscle = {
  id: 'muscle-subclavius',
  kind: 'muscle',
  status: 'available',
  name: { hu: 'Kulcscsont alatti izom', en: 'Subclavius', la: 'Musculus subclavius' },
  summary:
    'Kicsi, háromszög alakú izom a kulcscsont alatt, a nagy mellizom mögött. Az 1. bordától a kulcscsont alsó felszínéig fut. A kulcscsontot süllyeszti és rögzíti, így mozgás közben stabilizálja; rögzített kulcscsontnál az 1. bordát emelheti. Kulcscsonttörésnél az alatta futó ereket és idegeket is védheti.',
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
        hu: 'A kulcscsont alsó felszínének középső harmada (a kulcscsont alatti izom barázdája)',
        en: 'Subclavian groove on the inferior surface of the middle third of the clavicle',
        la: 'Sulcus musculi subclavii (clavicula)'
      },
      structureIds: ['bone-clavicle'],
      extent: 'line',
      sourceIds: ['statpearls-pectoral', 'openstax-ap2e', 'moore-coa']
    }
  ],
  innervation: [
    { text: 'Kulcscsont alatti ideg (n. subclavius).', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral', 'moore-coa'] },
    { text: 'Az ideg a karfonat felső törzséből ered, rostjai főként a C5–C6 szegmentumokból származnak.', evidence: 'anatomical-fact', sourceIds: ['moore-coa'] }
  ],
  nerveIds: ['nerve-subclavius'],
  functions: [
    { text: 'A kulcscsontot süllyeszti és rögzíti – mozgás közben stabilizálja.', evidence: 'anatomical-fact', sourceIds: ['openstax-ap2e', 'moore-coa'] },
    { text: 'A vállat (vállövet) süllyeszti.', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral'] },
    { text: 'Rögzített kulcscsont mellett az 1. bordát emeli.', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral'] },
    { text: 'A szegycsont-kulcscsonti ízület stabilitását segíti.', evidence: 'educational-model', sourceIds: ['neumann-kinesiology'] }
  ],
  jointIds: ['joint-sternoclavicular', 'joint-acromioclavicular'],
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
      note: 'A vállöv süllyesztői a lapockán (kis mellizom, valamint a csuklyásizom alsó része) és a felkarcsonton (széles hátizom) keresztül a kulcscsontot is lefelé viszik.',
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
      note: 'A kulcscsont süllyesztésével és rögzítésével segíti a vállöv süllyesztését.',
      evidence: 'anatomical-fact',
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
      note: 'Rögzített kulcscsont mellett az 1. bordát emeli.',
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
      note: 'A vállöv rögzítése teszi lehetővé, hogy az izom a bordát húzza, ne a kulcscsontot.',
      evidence: 'educational-model',
      sourceIds: ['neumann-kinesiology']
    }
  ],
  stabilization: [
    { text: 'A kulcscsontot az 1. borda felé húzva rögzíti, így mozgás közben stabilizálja.', evidence: 'anatomical-fact', sourceIds: ['openstax-ap2e', 'moore-coa'] },
    { text: 'A szegycsont-kulcscsonti ízületnél a kulcscsont helyzetének megtartásában segít, különösen a vállöv mozgásai közben.', evidence: 'educational-model', sourceIds: ['neumann-kinesiology'] }
  ],
  notes: [
    {
      text: 'Kulcscsonttörésnél a kulcscsont alatti izom védheti az alatta futó karfonatot (plexus brachialis) és a kulcscsont alatti ereket.',
      evidence: 'anatomical-fact',
      sourceIds: ['statpearls-pectoral', 'moore-coa']
    },
    { text: 'Eredése a kulcscsont-borda szalag előtt van; ez a szalag köti a kulcscsontot az 1. bordához.', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral'] },
    { text: 'Vérellátását a mellkas-vállcsúcsi artéria (a. thoracoacromialis) kulcscsonti ága adja.', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral'] },
    {
      text: 'Változatok: ritkán a hollócsőrnyúlványon (vagy a kulcscsonton és a hollócsőrnyúlványon is) tapad; egyik oldalon hiányozhat; a „subclavius posticus” változat az 1. bordától a lapocka felső széléig fut; többszörözött izom is előfordul.',
      evidence: 'anatomical-fact',
      sourceIds: ['statpearls-pectoral']
    }
  ],
  sourceIds: ['moore-coa', 'grays-anatomy', 'openstax-ap2e', 'statpearls-pectoral', 'neumann-kinesiology', 'fipat-ta2'],
  motionIds: ['sub-clavicular-depression', 'sub-girdle-depression', 'sub-accessory-inspiration'],
  exerciseIds: []
};
