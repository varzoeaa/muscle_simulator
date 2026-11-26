import type { Flashcard, StudyQuestion } from '../../types';

const M = 'muscle-pectoralis-major';
const ANAT = ['moore-coa', 'openstax-ap2e', 'statpearls-pectoral'];

export const pmFlashcards: Flashcard[] = [
  { id: 'fc-pm-name', muscleId: M, topic: 'name', front: 'Nagy mellizom – angol és latin név?', back: 'Pectoralis major – Musculus pectoralis major', sourceIds: ['fipat-ta2'] },
  { id: 'fc-pm-origin', muscleId: M, topic: 'origin', front: 'Hol ered a nagy mellizom?', back: 'Kulcscsonti rész: a kulcscsont mediális fele. Szegycsonti-bordai rész: a szegycsont elülső felszíne és az 1–6. bordaporc. Hasi rész: a külső ferde hasizom bőnye.', sourceIds: ANAT },
  { id: 'fc-pm-insertion', muscleId: M, topic: 'insertion', front: 'Hol tapad a nagy mellizom?', back: 'A felkarcsont bicepsbarázdájának külső peremén (crista tuberculi majoris), kétlemezes, csavarodott ínnal.', sourceIds: ANAT },
  { id: 'fc-pm-innervation', muscleId: M, topic: 'innervation', front: 'Mi idegzi be a nagy mellizmot?', back: 'A külső mellizomideg (n. pectoralis lateralis, C5–C7) és a belső mellizomideg (n. pectoralis medialis, C8–T1).', sourceIds: ['moore-coa', 'statpearls-pectoral'] },
  { id: 'fc-pm-function', muscleId: M, topic: 'function', front: 'Melyek a nagy mellizom fő funkciói?', back: 'Közelítés, befelé forgatás és horizontális közelítés a vállízületben; a kulcscsonti rész hajlít, a szegycsonti-bordai rész hajlított helyzetből feszít.', sourceIds: ['moore-coa', 'neumann-kinesiology'] },
  { id: 'fc-pm-joints', muscleId: M, topic: 'joints', front: 'Mely ízület(ek)en hat a nagy mellizom?', back: 'A vállízületen (articulatio humeri / glenohumeralis ízület).', sourceIds: ANAT },
  { id: 'fc-pm-regions', muscleId: M, topic: 'regions', front: 'Melyek a nagy mellizom részei?', back: 'Pars clavicularis (kulcscsonti), pars sternocostalis (szegycsonti-bordai), pars abdominalis (hasi rész).', sourceIds: ['fipat-ta2', 'grays-anatomy'] },
  { id: 'fc-pm-agonists', muscleId: M, topic: 'roles', front: 'Horizontális közelítés: melyik izom a nagy mellizom fő társ-agonistája?', back: 'A deltaizom elülső (kulcscsonti) része.', sourceIds: ['neumann-kinesiology'] },
  { id: 'fc-pm-antagonists', muscleId: M, topic: 'roles', front: 'Horizontális közelítés: melyek az antagonisták?', back: 'A deltaizom hátsó része, a tövis alatti izom és a kis görgetegizom (horizontális távolítók).', sourceIds: ['neumann-kinesiology'] },
  { id: 'fc-pm-synergists', muscleId: M, topic: 'roles', front: 'Vállízületi közelítés: melyik izmok agonisták/szinergisták a nagy mellizom mellett?', back: 'Agonisták: széles hátizom, nagy görgetegizom. Szinergisták: pl. a háromfejű karizom hosszú feje, hollócsőr-karizom.', sourceIds: ['neumann-kinesiology'] },
  { id: 'fc-pm-stabilization', muscleId: M, topic: 'stabilization', front: 'Milyen stabilizáló szerepe van a nagy mellizomnak?', back: 'Dinamikusan támogatja a vállízület elülső oldalát, és támaszhelyzetekben (pl. fekvőtámasz, tolódzkodás) a kart a törzshöz rögzíti.', sourceIds: ['neumann-kinesiology'] }
];

export const pmQuestions: StudyQuestion[] = [
  {
    id: 'q-pm-origin-clav',
    muscleId: M,
    topic: 'origin',
    type: 'multiple-choice',
    prompt: 'Honnan ered a nagy mellizom kulcscsonti része?',
    options: [
      { id: 'a', text: 'A kulcscsont mediális (belső) felének elülső felszínéről' },
      { id: 'b', text: 'A kulcscsont laterális harmadáról' },
      { id: 'c', text: 'A hollócsőrnyúlványról' },
      { id: 'd', text: 'Az első borda felső felszínéről' }
    ],
    correctOptionId: 'a',
    explanation: 'A kulcscsont laterális harmadán a deltaizom elülső része ered; a nagy mellizom kulcscsonti része a mediális felén.',
    sourceIds: ANAT,
    relatedPath: 'anatomia'
  },
  {
    id: 'q-pm-insertion',
    muscleId: M,
    topic: 'insertion',
    type: 'multiple-choice',
    prompt: 'Hol tapad a nagy mellizom?',
    options: [
      { id: 'a', text: 'A felkarcsont deltaizom-érdességén (tuberositas deltoidea)' },
      { id: 'b', text: 'A bicepsbarázda külső peremén (crista tuberculi majoris)' },
      { id: 'c', text: 'A bicepsbarázda belső peremén (crista tuberculi minoris)' },
      { id: 'd', text: 'A hollócsőrnyúlványon' }
    ],
    correctOptionId: 'b',
    explanation: 'A barázda belső peremén a nagy görgetegizom, a barázda alján a széles hátizom tapad. A hollócsőrnyúlvány a kis mellizom tapadása.',
    sourceIds: ANAT,
    relatedPath: 'anatomia'
  },
  {
    id: 'q-pm-innervation',
    muscleId: M,
    topic: 'innervation',
    type: 'multiple-choice',
    prompt: 'Melyik idegek látják el a nagy mellizmot?',
    options: [
      { id: 'a', text: 'N. axillaris és n. radialis' },
      { id: 'b', text: 'N. thoracicus longus' },
      { id: 'c', text: 'N. pectoralis lateralis és n. pectoralis medialis' },
      { id: 'd', text: 'N. thoracodorsalis' }
    ],
    correctOptionId: 'c',
    explanation: 'A külső mellizomideg (C5–C7) főként a kulcscsonti részt, a belső mellizomideg (C8–T1) főként az alsóbb részeket idegzi be. A n. thoracicus longus az elülső fűrészizmot, a n. thoracodorsalis a széles hátizmot látja el.',
    sourceIds: ['moore-coa', 'statpearls-pectoral'],
    relatedPath: 'anatomia'
  },
  {
    id: 'q-pm-function-clav',
    muscleId: M,
    topic: 'function',
    type: 'multiple-choice',
    prompt: 'Melyik vállízületi mozgásban van elsősorban szerepe a kulcscsonti résznek?',
    options: [
      { id: 'a', text: 'Hajlítás (flexio)' },
      { id: 'b', text: 'Feszítés (extensio) anatómiai helyzetből hátrafelé' },
      { id: 'c', text: 'Kifelé forgatás' },
      { id: 'd', text: 'Távolítás' }
    ],
    correctOptionId: 'a',
    explanation: 'A kulcscsonti rész a deltaizom elülső részével együtt hajlítja a vállízületet. A nagy mellizom befelé forgat, nem kifelé.',
    sourceIds: ['moore-coa', 'neumann-kinesiology'],
    relatedPath: 'anatomia'
  },
  {
    id: 'q-pm-function-rotation',
    muscleId: M,
    topic: 'function',
    type: 'fill-blank',
    prompt: 'Egészítsd ki a mondatot!',
    text: 'A nagy mellizom a vállízületben közelít és ___ forgat.',
    options: ['befelé', 'kifelé', 'előre', 'hátra'],
    answer: 'befelé',
    explanation: 'A tapadás a felkarcsont elülső-külső részén van, a rostok a mellkas felől húznak – így a felkarcsontot befelé (mediálisan) forgatják.',
    sourceIds: ['moore-coa', 'openstax-ap2e'],
    relatedPath: 'anatomia'
  },
  {
    id: 'q-pm-fill-cartilages',
    muscleId: M,
    topic: 'origin',
    type: 'fill-blank',
    prompt: 'Egészítsd ki a mondatot!',
    text: 'A szegycsonti-bordai rész a szegycsontról és a felső ___ bordaporcról ered.',
    options: ['hat', 'két', 'tizenkét', 'egy'],
    answer: 'hat',
    explanation: 'A tankönyvek az 1–6. bordaporcot adják meg eredésként (egyes leírások az 1–7. bordaporcot említik).',
    sourceIds: ANAT,
    relatedPath: 'anatomia'
  },
  {
    id: 'q-pm-matching-regions',
    muscleId: M,
    topic: 'regions',
    type: 'matching',
    prompt: 'Párosítsd az izomrészt az eredésével!',
    pairs: [
      { id: 'p1', left: 'Pars clavicularis', right: 'Kulcscsont mediális fele' },
      { id: 'p2', left: 'Pars sternocostalis', right: 'Szegycsont és 1–6. bordaporc' },
      { id: 'p3', left: 'Pars abdominalis', right: 'A külső ferde hasizom bőnye' }
    ],
    explanation: 'Az izomrészek neve az eredésükre utal.',
    sourceIds: ANAT,
    relatedPath: 'anatomia'
  },
  {
    id: 'q-pm-matching-innervation',
    muscleId: M,
    topic: 'innervation',
    type: 'matching',
    prompt: 'Párosítsd az ideget a gerincvelői szegmentumaival!',
    pairs: [
      { id: 'p1', left: 'N. pectoralis lateralis', right: 'C5–C7' },
      { id: 'p2', left: 'N. pectoralis medialis', right: 'C8–T1' }
    ],
    explanation: 'A külső mellizomideg a plexus brachialis külső kötegéből, a belső a belső kötegéből ered.',
    sourceIds: ['moore-coa'],
    relatedPath: 'anatomia'
  },
  {
    id: 'q-pm-diagram-clav',
    muscleId: M,
    topic: 'recognition',
    type: 'diagram-identify',
    task: 'muscle',
    viewId: 'anterior',
    prompt: 'Kattints az ábrán a nagy mellizom kulcscsonti részére!',
    correctStructureIds: ['muscle-pectoralis-major-clavicular'],
    selectableStructureIds: [
      'muscle-pectoralis-major-clavicular',
      'muscle-pectoralis-major-sternocostal',
      'muscle-pectoralis-major-abdominal',
      'muscle-deltoid-anterior',
      'muscle-deltoid-middle',
      'muscle-biceps-brachii',
      'muscle-serratus-anterior'
    ],
    explanation: 'A kulcscsonti rész a kulcscsont alatt, a deltaizommal határosan helyezkedik el (a határon fut a sulcus deltoideopectoralis).',
    sourceIds: ANAT,
    relatedPath: 'anatomia'
  },
  {
    id: 'q-pm-diagram-deltoid',
    muscleId: M,
    topic: 'recognition',
    type: 'diagram-identify',
    task: 'muscle',
    viewId: 'anterior',
    prompt: 'Kattints arra az izomra, amely a horizontális közelítésben a nagy mellizom fő társ-agonistája!',
    correctStructureIds: ['muscle-deltoid-anterior'],
    selectableStructureIds: [
      'muscle-pectoralis-major-clavicular',
      'muscle-pectoralis-major-sternocostal',
      'muscle-deltoid-anterior',
      'muscle-deltoid-middle',
      'muscle-biceps-brachii',
      'muscle-latissimus-dorsi',
      'muscle-serratus-anterior'
    ],
    explanation: 'A deltaizom elülső (kulcscsonti) része a nagy mellizommal együtt végzi a horizontális közelítést és a vállízületi hajlítást.',
    sourceIds: ['neumann-kinesiology'],
    relatedPath: 'biomechanika'
  },
  {
    id: 'q-pm-diagram-origin',
    muscleId: M,
    topic: 'origin',
    type: 'diagram-identify',
    task: 'origin',
    viewId: 'anterior',
    prompt: 'Jelöld meg az ábrán azt a csontot, amelyen a szegycsonti-bordai rész eredésének nagyobbik része található!',
    correctStructureIds: ['bone-sternum', 'bone-costal-cartilages'],
    selectableStructureIds: ['bone-sternum', 'bone-costal-cartilages', 'bone-clavicle', 'bone-humerus', 'bone-scapula', 'bone-ribs'],
    explanation: 'A szegycsonti-bordai rész a szegycsont elülső felszínéről és a felső hat bordaporcról ered – mindkettő elfogadott válasz.',
    sourceIds: ANAT,
    relatedPath: 'anatomia'
  },
  {
    id: 'q-pm-diagram-insertion',
    muscleId: M,
    topic: 'insertion',
    type: 'diagram-identify',
    task: 'insertion',
    viewId: 'anterior',
    prompt: 'Jelöld meg az ábrán azt a csontot, amelyen a nagy mellizom tapad!',
    correctStructureIds: ['bone-humerus'],
    selectableStructureIds: ['bone-sternum', 'bone-costal-cartilages', 'bone-clavicle', 'bone-humerus', 'bone-scapula', 'bone-ribs'],
    explanation: 'A tapadás a felkarcsont nagy gumójának taraján (a bicepsbarázda külső peremén) van.',
    sourceIds: ANAT,
    relatedPath: 'anatomia'
  },
  {
    id: 'q-pm-contraction-eccentric',
    muscleId: M,
    topic: 'contraction',
    type: 'multiple-choice',
    prompt: 'Fekvenyomásnál a rúd kontrollált leengedése alatt milyen működést végez a nagy mellizom?',
    options: [
      { id: 'a', text: 'Koncentrikus' },
      { id: 'b', text: 'Excentrikus' },
      { id: 'c', text: 'Izometriás' },
      { id: 'd', text: 'Nem aktív, a gravitáció végzi a mozgást' }
    ],
    correctOptionId: 'b',
    explanation: 'Az izom aktív és fékezi a rudat, miközben hossza nő – ez excentrikus működés. Ha az izom nem lenne aktív, a rúd szabadon esne.',
    sourceIds: ['nsca-essentials'],
    relatedPath: 'gyakorlatok'
  },
  {
    id: 'q-pm-contraction-isometric',
    muscleId: M,
    topic: 'contraction',
    type: 'multiple-choice',
    prompt: 'Melyik állítás igaz az izometriás működésre?',
    options: [
      { id: 'a', text: 'Az izom nem aktív, ezért a hossza változatlan.' },
      { id: 'b', text: 'Az izom aktívan feszül, miközben az izom-ín egység hossza és az ízületi szög közel változatlan.' },
      { id: 'c', text: 'Az izom aktív és rövidül.' },
      { id: 'd', text: 'Az izom terhelés alatt hosszabbodik.' }
    ],
    correctOptionId: 'b',
    explanation: 'Az aktivitás és a hosszváltozás két külön szempont: izometriás működésnél aktív feszülés van, látható elmozdulás nélkül.',
    sourceIds: ['neumann-kinesiology'],
    relatedPath: 'biomechanika'
  },
  {
    id: 'q-pm-matching-contraction',
    muscleId: M,
    topic: 'contraction',
    type: 'matching',
    prompt: 'Párosítsd a fekvenyomás szakaszát az izomműködés típusával (nagy mellizom)!',
    pairs: [
      { id: 'p1', left: 'Leengedés', right: 'Excentrikus' },
      { id: 'p2', left: 'Megállás alul', right: 'Izometriás' },
      { id: 'p3', left: 'Felnyomás', right: 'Koncentrikus' }
    ],
    explanation: 'Mindhárom szakaszban aktív az izom; a különbség a hosszváltozás irányában van.',
    sourceIds: ['nsca-essentials'],
    relatedPath: 'gyakorlatok'
  },
  {
    id: 'q-pm-roles-antagonist',
    muscleId: M,
    topic: 'roles',
    type: 'multiple-choice',
    prompt: 'Horizontális közelítésben melyik izom antagonistája a nagy mellizomnak?',
    options: [
      { id: 'a', text: 'Deltaizom elülső része' },
      { id: 'b', text: 'Hollócsőr-karizom' },
      { id: 'c', text: 'Deltaizom hátsó része' },
      { id: 'd', text: 'Lapocka alatti izom' }
    ],
    correctOptionId: 'c',
    explanation: 'A deltaizom hátsó része horizontális távolítást végez, tehát ebben a mozgásban antagonista. Az elülső rész és a hollócsőr-karizom ugyanabba az irányba dolgozik.',
    sourceIds: ['neumann-kinesiology'],
    relatedPath: 'biomechanika'
  },
  {
    id: 'q-pm-exercise-incline',
    muscleId: M,
    topic: 'exercise',
    type: 'multiple-choice',
    prompt: 'Az idézett EMG-vizsgálat szerint melyik paddőlésszögnél volt a legnagyobb a felső (kulcscsonti) mellizomrész aktivitása?',
    options: [
      { id: 'a', text: '0° (vízszintes pad)' },
      { id: 'b', text: 'kb. 30°' },
      { id: 'c', text: '60°' },
      { id: 'd', text: '−15° (negatív pad)' }
    ],
    correctOptionId: 'b',
    explanation: 'Rodríguez-Ridao és mtsai. (2020) vizsgálatában a felső rész aktivitása 30°-nál volt maximális, 45° felett a deltaizom elülső részének aktivitása nőtt. Az EMG-aktivitás nem azonos az izomerővel vagy a növekedési hatással.',
    sourceIds: ['rodriguez-ridao-2020'],
    relatedPath: 'gyakorlatok'
  },
  {
    id: 'q-pm-exercise-movers',
    muscleId: M,
    topic: 'exercise',
    type: 'multiple-choice',
    prompt: 'Fekvenyomásnál melyik izom végzi elsősorban a könyökfeszítést?',
    options: [
      { id: 'a', text: 'Kétfejű karizom' },
      { id: 'b', text: 'Háromfejű karizom' },
      { id: 'c', text: 'Nagy mellizom' },
      { id: 'd', text: 'Széles hátizom' }
    ],
    correctOptionId: 'b',
    explanation: 'A könyökízület feszítője a háromfejű karizom; a nagy mellizom a vállízületben dolgozik.',
    sourceIds: ['nsca-essentials', 'openstax-ap2e'],
    relatedPath: 'gyakorlatok'
  }
];
