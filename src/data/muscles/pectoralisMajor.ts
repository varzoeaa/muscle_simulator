import type { Muscle } from '../../types';

const ANAT = ['moore-coa', 'grays-anatomy', 'openstax-ap2e', 'statpearls-pectoral'];
const KIN = ['neumann-kinesiology', 'moore-coa'];

export const pectoralisMajor: Muscle = {
  id: 'muscle-pectoralis-major',
  kind: 'muscle',
  status: 'available',
  name: { hu: 'Nagy mellizom', en: 'Pectoralis major', la: 'Musculus pectoralis major' },
  summary:
    'Vastag, legyező alakú izom, amely a mellkas elülső felső részét borítja. A mellkasfalat köti össze a felkarcsonttal; a vállízület fő közelítő és befelé forgató izmainak egyike.',
  defaultViewId: 'anterior',
  regions: [
    {
      id: 'muscle-pectoralis-major-clavicular',
      kind: 'muscle-region',
      muscleId: 'muscle-pectoralis-major',
      name: { hu: 'Kulcscsonti rész', en: 'Clavicular part (head)', la: 'Pars clavicularis' },
      origin: {
        type: 'origin',
        description: {
          hu: 'A kulcscsont mediális (belső) felének elülső felszíne',
          en: 'Anterior surface of the medial half of the clavicle',
          la: 'Clavicula (dimidium mediale)'
        },
        structureIds: ['bone-clavicle'],
        extent: 'line',
        sourceIds: ANAT
      },
      insertion: {
        type: 'insertion',
        description: {
          hu: 'A felkarcsont bicepsbarázdájának külső pereme (a nagy gumó taraja) – a közös ín elülső, disztálisabb lemezében',
          en: 'Lateral lip of the intertubercular sulcus (crest of greater tubercle), anterior lamina of the tendon',
          la: 'Crista tuberculi majoris'
        },
        structureIds: ['bone-humerus-crest-greater-tubercle'],
        extent: 'line',
        sourceIds: ANAT
      },
      innervation: { text: 'Külső mellizomideg (n. pectoralis lateralis), főként C5–C6', evidence: 'anatomical-fact', sourceIds: ['moore-coa', 'statpearls-pectoral'] },
      functions: [
        { text: 'A vállízület hajlítása (flexio), főként anatómiai helyzetből indulva.', evidence: 'anatomical-fact', sourceIds: KIN },
        { text: 'Horizontális közelítés és befelé forgatás a teljes izommal együtt.', evidence: 'anatomical-fact', sourceIds: KIN }
      ]
    },
    {
      id: 'muscle-pectoralis-major-sternocostal',
      kind: 'muscle-region',
      muscleId: 'muscle-pectoralis-major',
      name: { hu: 'Szegycsonti-bordai rész', en: 'Sternocostal part (head)', la: 'Pars sternocostalis' },
      origin: {
        type: 'origin',
        description: {
          hu: 'A szegycsont elülső felszíne és a felső hat bordaporc',
          en: 'Anterior surface of the sternum and the superior six costal cartilages',
          la: 'Sternum et cartilagines costales I–VI'
        },
        structureIds: ['bone-sternum', 'bone-costal-cartilages'],
        extent: 'area',
        sourceIds: ANAT
      },
      insertion: {
        type: 'insertion',
        description: {
          hu: 'A nagy gumó taraja – a rostok csavarodva, a közös ín hátsó lemezében, proximálisabban tapadnak',
          en: 'Crest of greater tubercle – fibres twist and insert more proximally in the posterior lamina',
          la: 'Crista tuberculi majoris'
        },
        structureIds: ['bone-humerus-crest-greater-tubercle'],
        extent: 'line',
        sourceIds: ANAT
      },
      innervation: {
        text: 'Külső és belső mellizomideg (n. pectoralis lateralis et medialis), C7–C8–T1',
        evidence: 'anatomical-fact',
        sourceIds: ['moore-coa', 'statpearls-pectoral']
      },
      functions: [
        { text: 'A vállízület fő közelítő (adductio) része, emelt karhelyzetből különösen hatékony.', evidence: 'anatomical-fact', sourceIds: KIN },
        { text: 'Hajlított (előreemelt) karhelyzetből a vállízület feszítése az anatómiai helyzetig.', evidence: 'anatomical-fact', sourceIds: KIN }
      ]
    },
    {
      id: 'muscle-pectoralis-major-abdominal',
      kind: 'muscle-region',
      muscleId: 'muscle-pectoralis-major',
      name: { hu: 'Hasi rész', en: 'Abdominal part', la: 'Pars abdominalis' },
      origin: {
        type: 'origin',
        description: {
          hu: 'A külső ferde hasizom bőnye (az egyenes hasizom hüvelyének elülső lemeze)',
          en: 'Aponeurosis of the external oblique (anterior layer of the rectus sheath)',
          la: 'Vagina musculi recti abdominis (lamina anterior)'
        },
        structureIds: ['bone-external-oblique-aponeurosis'],
        extent: 'line',
        sourceIds: ANAT
      },
      insertion: {
        type: 'insertion',
        description: {
          hu: 'A nagy gumó taraja – a leginkább proximálisan, a hátsó ínlemezben',
          en: 'Crest of greater tubercle – most proximal fibres of the posterior lamina',
          la: 'Crista tuberculi majoris'
        },
        structureIds: ['bone-humerus-crest-greater-tubercle'],
        extent: 'line',
        sourceIds: ['grays-anatomy', 'moore-coa']
      },
      innervation: { text: 'Belső mellizomideg (n. pectoralis medialis), C8–T1', evidence: 'anatomical-fact', sourceIds: ['moore-coa'] },
      functions: [
        {
          text: 'Közelítés és a kar lefelé-előre húzása emelt karhelyzetből; a szegycsonti-bordai résszel együtt működik.',
          evidence: 'educational-model',
          sourceIds: KIN
        }
      ]
    }
  ],
  origin: [
    {
      type: 'origin',
      description: { hu: 'Kulcscsont mediális fele', en: 'Medial half of clavicle', la: 'Clavicula' },
      structureIds: ['bone-clavicle'],
      extent: 'line',
      sourceIds: ANAT
    },
    {
      type: 'origin',
      description: { hu: 'Szegycsont elülső felszíne és az 1–6. bordaporc', en: 'Anterior sternum and costal cartilages 1–6', la: 'Sternum, cartilagines costales' },
      structureIds: ['bone-sternum', 'bone-costal-cartilages'],
      extent: 'area',
      sourceIds: ANAT
    },
    {
      type: 'origin',
      description: { hu: 'A külső ferde hasizom bőnye', en: 'Aponeurosis of external oblique', la: 'Aponeurosis musculi obliqui externi abdominis' },
      structureIds: ['bone-external-oblique-aponeurosis'],
      extent: 'line',
      sourceIds: ANAT
    }
  ],
  insertion: [
    {
      type: 'insertion',
      description: {
        hu: 'A felkarcsont bicepsbarázdájának külső pereme (nagy gumó taraja); a lapos ín két lemeze U alakban csavarodik',
        en: 'Lateral lip of intertubercular sulcus (crest of greater tubercle); bilaminar, twisted tendon',
        la: 'Crista tuberculi majoris'
      },
      structureIds: ['bone-humerus-crest-greater-tubercle'],
      extent: 'line',
      sourceIds: ANAT
    }
  ],
  innervation: [
    { text: 'Külső mellizomideg (n. pectoralis lateralis, C5–C7) – főként a kulcscsonti részt látja el.', evidence: 'anatomical-fact', sourceIds: ['moore-coa', 'statpearls-pectoral'] },
    { text: 'Belső mellizomideg (n. pectoralis medialis, C8–T1) – főként a szegycsonti-bordai és a hasi részt látja el.', evidence: 'anatomical-fact', sourceIds: ['moore-coa', 'statpearls-pectoral'] }
  ],
  nerveIds: ['nerve-lateral-pectoral', 'nerve-medial-pectoral'],
  functions: [
    { text: 'A felkar közelítése (adductio) a vállízületben.', evidence: 'anatomical-fact', sourceIds: ['moore-coa', 'openstax-ap2e'] },
    { text: 'A felkar befelé forgatása (rotatio medialis).', evidence: 'anatomical-fact', sourceIds: ['moore-coa', 'openstax-ap2e'] },
    { text: 'Horizontális közelítés (a kar vízszintes síkban a test középvonala felé mozog).', evidence: 'anatomical-fact', sourceIds: KIN },
    { text: 'Vállízületi hajlítás – elsősorban a kulcscsonti rész.', evidence: 'anatomical-fact', sourceIds: ['moore-coa', 'neumann-kinesiology'] },
    { text: 'Hajlított karhelyzetből a vállízület feszítése – elsősorban a szegycsonti-bordai rész.', evidence: 'anatomical-fact', sourceIds: ['moore-coa', 'neumann-kinesiology'] },
    {
      text: 'Rögzített felkar esetén (pl. húzódzkodás felső szakaszában) a törzset a kar felé húzhatja; járulékos légzőizomként is leírják, ha a vállöv rögzített.',
      evidence: 'anatomical-fact',
      sourceIds: ['grays-anatomy']
    }
  ],
  jointIds: ['joint-glenohumeral'],
  roles: [
    {
      movementId: 'shoulder-adduction',
      role: 'agonist',
      structureIds: ['muscle-pectoralis-major', 'muscle-latissimus-dorsi', 'muscle-teres-major'],
      evidence: 'anatomical-fact',
      sourceIds: KIN
    },
    {
      movementId: 'shoulder-adduction',
      role: 'synergist',
      structureIds: ['muscle-triceps-long-head', 'muscle-coracobrachialis', 'muscle-rhomboids'],
      note: 'A rombuszizmok a lapocka lefelé rotációjával és rögzítésével segítik a közelítést.',
      evidence: 'educational-model',
      sourceIds: KIN
    },
    {
      movementId: 'shoulder-adduction',
      role: 'antagonist',
      structureIds: ['muscle-deltoid-middle', 'muscle-supraspinatus'],
      evidence: 'anatomical-fact',
      sourceIds: KIN
    },
    {
      movementId: 'shoulder-horizontal-adduction',
      role: 'agonist',
      structureIds: ['muscle-pectoralis-major', 'muscle-deltoid-anterior'],
      evidence: 'anatomical-fact',
      sourceIds: KIN
    },
    {
      movementId: 'shoulder-horizontal-adduction',
      role: 'synergist',
      structureIds: ['muscle-coracobrachialis', 'muscle-biceps-brachii'],
      note: 'A kétfejű karizom rövid feje kis mértékben járul hozzá.',
      evidence: 'educational-model',
      sourceIds: KIN
    },
    {
      movementId: 'shoulder-horizontal-adduction',
      role: 'antagonist',
      structureIds: ['muscle-deltoid-posterior', 'muscle-infraspinatus', 'muscle-teres-minor'],
      evidence: 'anatomical-fact',
      sourceIds: KIN
    },
    {
      movementId: 'shoulder-horizontal-adduction',
      role: 'stabilizer',
      structureIds: ['muscle-serratus-anterior', 'muscle-rotator-cuff'],
      note: 'Az elülső fűrészizom a lapockát a mellkasfalhoz rögzíti; a rotátorköpeny a felkarcsontfejet az ízületi árokban centrálja.',
      evidence: 'educational-model',
      sourceIds: KIN
    },
    {
      movementId: 'shoulder-internal-rotation',
      role: 'agonist',
      structureIds: ['muscle-subscapularis', 'muscle-pectoralis-major', 'muscle-latissimus-dorsi', 'muscle-teres-major', 'muscle-deltoid-anterior'],
      evidence: 'anatomical-fact',
      sourceIds: KIN
    },
    {
      movementId: 'shoulder-internal-rotation',
      role: 'antagonist',
      structureIds: ['muscle-infraspinatus', 'muscle-teres-minor', 'muscle-deltoid-posterior'],
      evidence: 'anatomical-fact',
      sourceIds: KIN
    },
    {
      movementId: 'shoulder-flexion',
      role: 'agonist',
      structureIds: ['muscle-deltoid-anterior', 'muscle-pectoralis-major-clavicular'],
      evidence: 'anatomical-fact',
      sourceIds: KIN
    },
    {
      movementId: 'shoulder-flexion',
      role: 'synergist',
      structureIds: ['muscle-coracobrachialis', 'muscle-biceps-brachii'],
      evidence: 'anatomical-fact',
      sourceIds: KIN
    },
    {
      movementId: 'shoulder-flexion',
      role: 'antagonist',
      structureIds: ['muscle-latissimus-dorsi', 'muscle-teres-major', 'muscle-deltoid-posterior', 'muscle-triceps-long-head'],
      evidence: 'anatomical-fact',
      sourceIds: KIN
    },
    {
      movementId: 'shoulder-extension',
      role: 'agonist',
      structureIds: ['muscle-latissimus-dorsi', 'muscle-teres-major', 'muscle-pectoralis-major-sternocostal'],
      note: 'A szegycsonti-bordai rész csak hajlított karhelyzetből, az anatómiai helyzetig feszít.',
      evidence: 'anatomical-fact',
      sourceIds: KIN
    },
    {
      movementId: 'shoulder-extension',
      role: 'antagonist',
      structureIds: ['muscle-deltoid-anterior', 'muscle-pectoralis-major-clavicular', 'muscle-coracobrachialis'],
      evidence: 'anatomical-fact',
      sourceIds: KIN
    },
    {
      movementId: 'accessory-inspiration',
      role: 'agonist',
      structureIds: ['muscle-pectoralis-major'],
      note: 'Járulékos belégzőizomként csak rögzített felső végtag és vállöv mellett emelheti a bordákat.',
      evidence: 'anatomical-fact',
      sourceIds: ['grays-anatomy']
    },
    {
      movementId: 'accessory-inspiration',
      role: 'synergist',
      structureIds: ['muscle-pectoralis-minor'],
      note: 'Rögzített lapockánál a kis mellizom is a bordák emelését segítheti.',
      evidence: 'anatomical-fact',
      sourceIds: ['moore-coa']
    }
  ],
  stabilization: [
    {
      text: 'A vállízület elülső oldalán dinamikus támaszt nyújt; a felkarcsontfejet a rotátorköpennyel együtt az ízületi árokban tartja terhelés alatt.',
      evidence: 'educational-model',
      sourceIds: ['neumann-kinesiology']
    },
    {
      text: 'Támaszhelyzetekben (pl. fekvőtámasz, tolódzkodás) a kart a törzshöz rögzíti, miközben a test súlya a felső végtagon keresztül adódik át.',
      evidence: 'educational-model',
      sourceIds: ['neumann-kinesiology']
    }
  ],
  notes: [
    {
      text: 'A rostok iránya a három részben eltérő, ezért a karhelyzet határozza meg, melyik rész tud hatékonyabban húzni. A kulcscsonti rész rostjai felülről-befelé, a hasi rész rostjai alulról-befelé futnak.',
      evidence: 'anatomical-fact',
      sourceIds: ANAT
    },
    {
      text: 'A közös ín két lemeze csavarodott: a kulcscsonti rostok disztálisabban, a legalsó rostok proximálisabban tapadnak. Emelt karnál a csavarodás kiegyenesedik.',
      evidence: 'anatomical-fact',
      sourceIds: ['grays-anatomy', 'moore-coa']
    },
    {
      text: 'Ferde padon (kb. 30°) végzett fekvenyomásnál EMG-vizsgálatokban a felső (kulcscsonti) rész nagyobb aktivitását mérték, mint vízszintes padon; vízszintes padon a középső és alsó rész aktivitása volt nagyobb.',
      evidence: 'documented-observation',
      sourceIds: ['rodriguez-ridao-2020', 'lauver-2016']
    }
  ],
  sourceIds: ['fipat-ta2', 'moore-coa', 'grays-anatomy', 'openstax-ap2e', 'statpearls-pectoral', 'neumann-kinesiology', 'rodriguez-ridao-2020', 'lauver-2016'],
  motionIds: ['pm-adduction', 'pm-horizontal-adduction', 'pm-internal-rotation', 'pm-flexion', 'pm-extension', 'pm-closed-chain', 'pm-accessory-inspiration'],
  exerciseIds: ['barbell-bench-press', 'dumbbell-bench-press', 'dumbbell-fly', 'machine-chest-press', 'pec-deck', 'cable-crossover', 'push-up', 'dips', 'pectoral-stretch', 'supine-pectoral-stretch']
};
