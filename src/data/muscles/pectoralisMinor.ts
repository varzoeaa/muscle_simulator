import type { Muscle } from '../../types';

/**
 * Kis mellizom (musculus pectoralis minor). Az anatómiai adatok (eredés, tapadás, beidegzés,
 * működés, változatok, klinikai vonatkozások) a StatPearls „Pectoral Muscles” fejezete és az
 * OpenStax Anatomy and Physiology 2e 11.5 fejezete alapján (online ellenőrizve: 2026-11-27),
 * valamint standard tankönyvek (Moore, Gray's) alapján szerepelnek. A lapockamozgásokban
 * betöltött szerepek Neumann (2017) kineziológiai leírását követik.
 */
const KIN = ['neumann-kinesiology', 'moore-coa'];

export const pectoralisMinor: Muscle = {
  id: 'muscle-pectoralis-minor',
  kind: 'muscle',
  status: 'available',
  name: { hu: 'Kis mellizom', en: 'Pectoralis minor', la: 'Musculus pectoralis minor' },
  summary:
    'Vékony, háromszög alakú izom a nagy mellizom alatt. A 3–5. bordától a lapocka hollócsőrnyúlványáig fut, így a mellkasfalat a lapockával köti össze. Fő feladata a lapocka stabilizálása: lefelé és előre, a mellkasfalhoz húzza. Rögzített lapockánál a bordákat emelheti.',
  defaultViewId: 'anterior',
  regions: [],
  origin: [
    {
      type: 'origin',
      description: {
        hu: 'A 3–5. borda elülső felszíne és széle, a borda-bordaporc határ közelében',
        en: 'Anterior surfaces and margins of ribs 3–5, near the costochondral junctions',
        la: 'Costae III–V'
      },
      structureIds: ['bone-ribs'],
      extent: 'line',
      sourceIds: ['statpearls-pectoral', 'openstax-ap2e', 'moore-coa']
    }
  ],
  insertion: [
    {
      type: 'insertion',
      description: {
        hu: 'A lapocka hollócsőrnyúlványának belső széle és felső felszíne',
        en: 'Medial border and superior surface of the coracoid process of the scapula',
        la: 'Processus coracoideus scapulae'
      },
      structureIds: ['bone-scapula-coracoid'],
      extent: 'line',
      sourceIds: ['statpearls-pectoral', 'openstax-ap2e', 'moore-coa']
    }
  ],
  innervation: [
    { text: 'Belső mellizomideg (n. pectoralis medialis, C8–T1).', evidence: 'anatomical-fact', sourceIds: ['moore-coa', 'statpearls-pectoral'] },
    { text: 'A StatPearls a külső mellizomideget (n. pectoralis lateralis, C5–C7) is megnevezi a kis mellizom idegei között.', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral'] }
  ],
  nerveIds: ['nerve-medial-pectoral', 'nerve-lateral-pectoral'],
  functions: [
    { text: 'A lapockát lefelé és előre, a mellkasfalhoz húzza – ezzel stabilizálja a lapockát.', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral', 'moore-coa'] },
    { text: 'A lapocka süllyesztése (depresszió).', evidence: 'anatomical-fact', sourceIds: ['openstax-ap2e', 'neumann-kinesiology'] },
    { text: 'A lapocka előre vezetésének (protrakció) segítése az elülső fűrészizommal együtt.', evidence: 'anatomical-fact', sourceIds: KIN },
    { text: 'A lapocka lefelé rotációja (az ízületi árok lefelé fordul) és előrebillentése (a lapocka felső része előre dől).', evidence: 'anatomical-fact', sourceIds: ['neumann-kinesiology'] },
    { text: 'A vállat előre fordítja (pl. dobó mozdulatban).', evidence: 'anatomical-fact', sourceIds: ['openstax-ap2e'] },
    { text: 'Rögzített lapocka mellett a 3–5. bordát emeli: járulékos belégzőizom.', evidence: 'anatomical-fact', sourceIds: ['openstax-ap2e', 'moore-coa'] }
  ],
  jointIds: ['joint-scapulothoracic', 'joint-acromioclavicular', 'joint-sternoclavicular'],
  roles: [
    {
      movementId: 'scapular-depression',
      role: 'agonist',
      structureIds: ['muscle-pectoralis-minor', 'muscle-trapezius', 'muscle-latissimus-dorsi'],
      note: 'A csuklyásizomnak az alsó része süllyeszt; a széles hátizom a felkarcsonton keresztül húzza lefelé a vállövet.',
      evidence: 'anatomical-fact',
      sourceIds: KIN
    },
    {
      movementId: 'scapular-depression',
      role: 'synergist',
      structureIds: ['muscle-subclavius'],
      note: 'A kulcscsont alatti izom a kulcscsontot süllyeszti és rögzíti.',
      evidence: 'anatomical-fact',
      sourceIds: ['openstax-ap2e', 'neumann-kinesiology']
    },
    {
      movementId: 'scapular-depression',
      role: 'antagonist',
      structureIds: ['muscle-levator-scapulae', 'muscle-rhomboids'],
      note: 'A lapocka emelői; a csuklyásizom felső része is ide tartozik.',
      evidence: 'anatomical-fact',
      sourceIds: KIN
    },
    {
      movementId: 'scapular-protraction',
      role: 'agonist',
      structureIds: ['muscle-serratus-anterior'],
      note: 'A protrakció fő mozgatója az elülső fűrészizom.',
      evidence: 'anatomical-fact',
      sourceIds: KIN
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
      sourceIds: KIN
    },
    {
      movementId: 'scapular-downward-rotation',
      role: 'agonist',
      structureIds: ['muscle-rhomboids', 'muscle-levator-scapulae', 'muscle-pectoralis-minor'],
      evidence: 'anatomical-fact',
      sourceIds: ['neumann-kinesiology']
    },
    {
      movementId: 'scapular-downward-rotation',
      role: 'antagonist',
      structureIds: ['muscle-serratus-anterior', 'muscle-trapezius'],
      note: 'A felfelé rotációt az elülső fűrészizom és a csuklyásizom (felső és alsó része) végzi.',
      evidence: 'anatomical-fact',
      sourceIds: ['neumann-kinesiology']
    },
    {
      movementId: 'scapular-anterior-tilt',
      role: 'agonist',
      structureIds: ['muscle-pectoralis-minor'],
      evidence: 'anatomical-fact',
      sourceIds: ['neumann-kinesiology']
    },
    {
      movementId: 'scapular-anterior-tilt',
      role: 'antagonist',
      structureIds: ['muscle-serratus-anterior', 'muscle-trapezius'],
      note: 'A hátrabillentésben az elülső fűrészizom és a csuklyásizom alsó része vesz részt.',
      evidence: 'educational-model',
      sourceIds: ['neumann-kinesiology']
    },
    {
      movementId: 'accessory-inspiration',
      role: 'agonist',
      structureIds: ['muscle-pectoralis-minor'],
      note: 'Csak rögzített lapocka mellett emelheti a bordákat.',
      evidence: 'anatomical-fact',
      sourceIds: ['openstax-ap2e', 'moore-coa']
    },
    {
      movementId: 'accessory-inspiration',
      role: 'synergist',
      structureIds: ['muscle-pectoralis-major-sternocostal'],
      note: 'Rögzített felső végtag és vállöv mellett a nagy mellizom szegycsonti-bordai része is a bordák emelését segítheti (a kulcscsonti rész a kulcscsonton ered).',
      evidence: 'anatomical-fact',
      sourceIds: ['grays-anatomy']
    },
    {
      movementId: 'accessory-inspiration',
      role: 'stabilizer',
      structureIds: ['muscle-rhomboids', 'muscle-trapezius', 'muscle-levator-scapulae'],
      note: 'A lapocka rögzítése teszi lehetővé, hogy a kis mellizom a bordákat húzza, ne a lapockát.',
      evidence: 'educational-model',
      sourceIds: ['neumann-kinesiology']
    }
  ],
  stabilization: [
    { text: 'A lapockát a mellkasfalhoz rögzíti azáltal, hogy lefelé és előre húzza.', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral', 'moore-coa'] },
    {
      text: 'Az elülső fűrészizommal együtt a lapockát a mellkasfalon tartja, ezért a vállöv stabil alapot ad a karmozgásokhoz és a támaszhelyzetekhez.',
      evidence: 'educational-model',
      sourceIds: ['neumann-kinesiology']
    }
  ],
  notes: [
    { text: 'A nagy mellizommal együtt a hónalj (axilla) elülső falát alkotja.', evidence: 'anatomical-fact', sourceIds: ['moore-coa'] },
    {
      text: 'Alatta, a hollócsőrnyúlvány alatti térben fut a karfonat (plexus brachialis) és a hónaljartéria. Fokozott feszessége szűkítheti ezt a teret, és a mellkasi kimeneti szindróma (thoracic outlet syndrome) egyik okaként írják le; súlyos esetben ínának sebészi átmetszése is szóba jöhet.',
      evidence: 'anatomical-fact',
      sourceIds: ['statpearls-pectoral']
    },
    { text: 'A hónaljartériát (a. axillaris) a kis mellizomhoz viszonyított helyzete alapján három szakaszra osztják.', evidence: 'anatomical-fact', sourceIds: ['moore-coa'] },
    { text: 'Vérellátását – a nagy mellizoméhoz hasonlóan – a mellkas-vállcsúcsi artéria (a. thoracoacromialis) mellizomága adja.', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral'] },
    {
      text: 'Változatok: az eredés a 2. bordára is kiterjedhet (egyes tankönyvek a 2–4. bordát adják meg), az ín pedig ritkán a hollócsőrnyúlványon túl a felkarcsont nagy gumójáig fut.',
      evidence: 'anatomical-fact',
      sourceIds: ['statpearls-pectoral', 'openstax-ap2e']
    }
  ],
  sourceIds: ['moore-coa', 'grays-anatomy', 'openstax-ap2e', 'statpearls-pectoral', 'neumann-kinesiology', 'fipat-ta2'],
  motionIds: ['pmi-depression', 'pmi-downward-rotation', 'pmi-protraction', 'pmi-anterior-tilt', 'pmi-accessory-inspiration'],
  exerciseIds: ['scapular-depression-dip', 'push-up-plus', 'pectoralis-minor-stretch']
};
