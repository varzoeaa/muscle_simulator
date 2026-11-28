/**
 * Myo – központi típusdefiníciók.
 * Az anatómiai adatok, a geometria, az animációs definíciók és a megjelenítés szét vannak választva.
 */

/* ---------- Terminológia és források ---------- */

/** Háromnyelvű szakkifejezés. A latin név opcionális: csak elfogadott latin terminus esetén töltjük ki. */
export interface Term {
  hu: string;
  en: string;
  la?: string;
}

/**
 * Az állítás megbízhatósági szintje.
 * - anatomical-fact: tankönyvi/terminológiai szinten elfogadott anatómiai tény
 * - documented-observation: tudományos vizsgálatban dokumentált megfigyelés (pl. EMG-tanulmány)
 * - educational-model: egyszerűsített oktatási modell / szemléltetés
 * - pending-verification: ellenőrzésre vár
 */
export type EvidenceLevel =
  | 'anatomical-fact'
  | 'documented-observation'
  | 'educational-model'
  | 'pending-verification';

/** Forrásra hivatkozó, megbízhatósági szinttel ellátott szöveges állítás. */
export interface Claim {
  text: string;
  evidence: EvidenceLevel;
  sourceIds: string[];
}

export type SourceKind = 'textbook' | 'journal-article' | 'open-textbook' | 'terminology' | 'online-reference' | 'dataset';

export interface ScientificSource {
  id: string;
  kind: SourceKind;
  /** Szerző(k) vagy intézmény. */
  authors: string;
  title: string;
  /** Folyóirat, kiadó vagy kiadvány. */
  publisher?: string;
  year?: number;
  edition?: string;
  url?: string;
  doi?: string;
  license?: string;
  /**
   * Bibliográfiai ellenőrzés állapota.
   * - verified-online: a bibliográfiai adatokat (cím, év, DOI) a fejlesztés során online ellenőriztük
   * - standard-reference: széles körben használt referenciamű, bibliográfiai adatai nem lettek online ellenőrizve
   */
  verification: 'verified-online' | 'standard-reference';
  checkedAt?: string;
  note?: string;
}

/* ---------- Anatómiai struktúrák ---------- */

export type StructureKind = 'muscle' | 'muscle-region' | 'bone' | 'bone-landmark' | 'joint' | 'tendon' | 'nerve';

export interface AnatomicalStructure {
  /** Egyedi anatómiai azonosító, pl. muscle-pectoralis-major-clavicular. */
  id: string;
  kind: StructureKind;
  name: Term;
}

export type BodyRegionId = 'pectoral' | 'shoulder' | 'arm' | 'back' | 'thorax' | 'abdomen' | 'neck';

export interface Bone extends AnatomicalStructure {
  kind: 'bone';
  landmarks?: AnatomicalStructure[];
}

export type JointMovementId =
  | 'shoulder-flexion'
  | 'shoulder-extension'
  | 'shoulder-abduction'
  | 'shoulder-adduction'
  | 'shoulder-horizontal-adduction'
  | 'shoulder-horizontal-abduction'
  | 'shoulder-internal-rotation'
  | 'shoulder-external-rotation'
  | 'elbow-flexion'
  | 'elbow-extension'
  | 'scapular-protraction'
  | 'scapular-retraction'
  | 'scapular-depression'
  | 'scapular-elevation'
  | 'scapular-upward-rotation'
  | 'scapular-downward-rotation'
  | 'scapular-anterior-tilt'
  | 'scapular-posterior-tilt'
  | 'clavicular-depression'
  | 'accessory-inspiration';

export interface JointMovement {
  id: JointMovementId;
  name: Term;
  plane: Term;
}

export interface Joint extends AnatomicalStructure {
  kind: 'joint';
  bones: string[];
  movements: JointMovementId[];
}

export interface Nerve extends AnatomicalStructure {
  kind: 'nerve';
  /** Gerincvelői szegmentumok, pl. "C5–C7". */
  roots: string;
  origin: string;
  sourceIds: string[];
}

export type AttachmentType = 'origin' | 'insertion';

export interface Attachment {
  type: AttachmentType;
  /** Leíró szöveg (magyar), a latin/angol megnevezéssel együtt. */
  description: Term;
  /** Az érintett csont vagy csonttájék azonosítója. */
  structureIds: string[];
  /** Pont- vagy területjellegű tapadás – a széles eredéseket területként jelöljük. */
  extent: 'point' | 'line' | 'area';
  sourceIds: string[];
}

export interface MuscleRegion extends AnatomicalStructure {
  kind: 'muscle-region';
  muscleId: string;
  origin: Attachment;
  insertion: Attachment;
  innervation: Claim;
  functions: Claim[];
}

export type MuscleRoleType = 'agonist' | 'antagonist' | 'synergist' | 'stabilizer';

/** Egy izom szerepe mindig egy konkrét mozgáshoz rendelve. */
export interface MuscleRole {
  movementId: JointMovementId;
  role: MuscleRoleType;
  structureIds: string[];
  note?: string;
  evidence: EvidenceLevel;
  sourceIds: string[];
}

export type MuscleStatus = 'available' | 'planned';

export interface Muscle extends AnatomicalStructure {
  kind: 'muscle';
  status: MuscleStatus;
  /** Rövid, kártyán megjelenő leírás. */
  summary: string;
  regions: MuscleRegion[];
  origin: Attachment[];
  insertion: Attachment[];
  innervation: Claim[];
  nerveIds: string[];
  functions: Claim[];
  jointIds: string[];
  /** Ízületenkénti rövid magyarázat (pl. közvetlen vagy közvetett érintettség). */
  jointNotes?: Record<string, string>;
  roles: MuscleRole[];
  stabilization: Claim[];
  /** Kapcsolódó magyarázatok (gyakorlati összefüggések). */
  notes: Claim[];
  sourceIds: string[];
  /** Az adatlaphoz tartozó elsődleges anatómiai nézet. */
  defaultViewId: AnatomicalViewId;
  motionIds: string[];
  exerciseIds: string[];
}

/* ---------- Geometria ---------- */

export type AnatomicalViewId =
  | 'posterior-girdle'
  | 'anterior-girdle'
  | 'superior-girdle'
  | 'lateral-girdle'
  | 'anterior'
  | 'superior'
  | 'lateral'
  | 'superior-arm-at-side'
  | 'anterior-closed-chain'
  | 'anterior-respiration'
  | 'posterior'
  | 'posterior-closed-chain'
  | 'lateral-bench';

export interface AnatomicalView {
  id: AnatomicalViewId;
  name: Term;
  description: string;
  /** Megjelenik-e az Anatómia modul nézetválasztójában (a mozgásspecifikus nézetek nem). */
  atlas?: boolean;
}

/** Egy pont egy adott csont koordináta-rendszerében (frame). A "world" a nézet rögzített rendszere. */
export interface FramedPoint {
  frame: string;
  x: number;
  y: number;
}

export type LayerId = 'bones' | 'deep-muscles' | 'superficial-muscles' | 'attachments' | 'labels' | 'joints';

export interface MuscleShapeGeometry {
  structureId: string;
  layer: 'deep-muscles' | 'superficial-muscles';
  /** Zárt kontúr pontjai (Catmull–Rom spline-nal simítva). */
  outline: FramedPoint[];
  /** Rostirány-jelzések: [eredési pont, tapadási pont] párok. */
  fibers: [FramedPoint, FramedPoint][];
  label?: { at: FramedPoint; text: string };
  /** Kirajzolási sorrend; nagyobb érték kerül felülre. */
  z: number;
  /**
   * A felületes rétegben van, de nagyrészt más izmok takarják (pl. elülső fűrészizom): kiválasztásakor
   * a fölötte (nagyobb z-vel) rajzolt izmok áttetszők lesznek, mint mély izom kiválasztásakor.
   */
  revealOnSelect?: boolean;
}

export interface AttachmentGeometry {
  structureId: string;
  type: AttachmentType;
  /** Vonal- vagy területjelölés pontjai. */
  points: FramedPoint[];
  /** Kör, ha pontszerű; egyébként vastag sáv. */
  extent: 'point' | 'line' | 'area';
}

export interface BoneShapeGeometry {
  structureId: string;
  frame: string;
  /** SVG path a csont saját koordináta-rendszerében. */
  d: string;
  /** implement: edzőeszköz (súlyzó, gépkar) – nem anatómiai struktúra. */
  variant?: 'bone' | 'cartilage' | 'implement';
  /** Megjelenített név (eszközöknél; csontoknál a névjegyzék adja). */
  title?: string;
  /** Ha meg van adva, a csontot vastag vonalként (pl. borda) rajzoljuk. */
  stroke?: number;
  /** Előtérbe hozott csont: a negatív z értékű izmok fölé rajzoljuk (pl. felkar oldalnézetben). */
  front?: boolean;
  /** Az izmok fölé rajzolt csont (pl. elölnézetben a test előtt mozgó alkar). */
  overlay?: boolean;
}

export interface JointMarkerGeometry {
  structureId: string;
  at: FramedPoint;
}

/** Egy csont koordináta-rendszerének definíciója: forgáspont és szülő frame. */
export interface FrameDefinition {
  id: string;
  parent: string;
  /** Forgáspont a szülő koordináta-rendszerében. */
  pivot: { x: number; y: number };
  /** A póz melyik szögértéke forgatja ezt a frame-et. */
  angleKey?: string;
  /** Alapszög (fok). */
  baseAngle?: number;
  /** Szög-szorzó (pl. -1 a tükrözött oldalon). */
  angleScale?: number;
  /** A frame helyi y tengelyének nyújtása (vetületi rövidülés szemléltetése). */
  scaleYKey?: string;
  /** A frame eltolása a szülő y tengelye mentén (pl. a mellkas emelkedése). */
  translateYKey?: string;
  /**
   * A helyi koordináta-rendszer origója a szülő rendszerében. Ha meg van adva, alaphelyzetben a
   * helyi koordináták megegyeznek a szülőével (pl. a lapocka pontjai világkoordinátákkal adhatók
   * meg, a frame mégis a `pivot` körül forog).
   */
  localOrigin?: { x: number; y: number };
}

export interface ViewGeometry {
  viewId: AnatomicalViewId;
  viewBox: [number, number, number, number];
  /** Szűkebb kivágás statikus (alaphelyzetű) megjelenítéshez. */
  focusViewBox?: [number, number, number, number];
  frames: FrameDefinition[];
  bones: BoneShapeGeometry[];
  muscles: MuscleShapeGeometry[];
  attachments: AttachmentGeometry[];
  joints: JointMarkerGeometry[];
  /** Struktúrák, amelyek csak kontextusként, tükrözve jelennek meg (nem interaktív). */
  mirrorContext?: boolean;
  orientation: { top: string; bottom: string; left: string; right: string };
  /**
   * Zárt kinetikai lánc: a teljes test (a tükrözött oldallal együtt) ennyivel tolódik
   * függőlegesen, a `fixtures` elemei viszont helyben maradnak (pl. húzódzkodórúd).
   */
  sceneOffsetYKey?: string;
  /** Rögzített környezeti elemek (nem anatómiai struktúrák), a nézet rendszerében. */
  fixtures?: { d: string; label?: { x: number; y: number; text: string } }[];
}

/** Pózok: szögek (fok) a frame-ek angleKey kulcsai szerint. */
export type Pose = Record<string, number>;

/* ---------- Mozgások és animáció ---------- */

export type ContractionType = 'concentric' | 'eccentric' | 'isometric';

export interface MotionDefinition {
  id: string;
  muscleId: string;
  movementId: JointMovementId;
  name: Term;
  viewId: AnatomicalViewId;
  /** Kiinduló helyzet (a vizsgált izom megnyúlt helyzete). */
  startPose: Pose;
  /** Véghelyzet (a vizsgált izom rövidült helyzete). */
  endPose: Pose;
  durationMs: number;
  description: string;
  /** Szemléltetett külső ellenállás leírása – a működési típusok értelmezéséhez. */
  resistance: string;
  contraction: Record<ContractionType, { summary: string; detail: string }>;
  /** A mozgásban részt vevő izmok szerepei (megjelenítési módokhoz). */
  roles: MuscleRole[];
  /** Az izomrészek eltérő szerepe ebben a mozgásban. */
  regionNotes: { regionId: string; text: string }[];
  claims: Claim[];
  /** A mozgásnál értelmezhető működési típusok (alapértelmezés: mindhárom). */
  contractionTypes?: ContractionType[];
  /** Az interpolált pózból származtatott teljes póz (pl. zárt láncú inverz kinematika). */
  solvePose?: (pose: Pose) => Pose;
  /**
   * Kiegészítő nézetek ugyanarról a mozgásról (egymás mellett jelennek meg). A `mapPose`
   * a fő nézet pózából számolja a kiegészítő nézet pózát (pl. vetületi rövidüléssel).
   */
  /** A fő nézet egyedi kivágása (pl. kis izomnál a vállöv környéke). */
  viewBox?: [number, number, number, number];
  extraViews?: {
    viewId: AnatomicalViewId;
    mapPose: (pose: Pose) => Pose;
    note?: string;
    /** A mozgáshoz illesztett kivágás (a vizsgált oldal), hogy a kis nézetben is nagy legyen az ábra. */
    viewBox?: [number, number, number, number];
  }[];
}

export type AnimationSpeed = 0.25 | 0.5 | 1 | 1.5 | 2;

export interface AnimationState {
  /** Normalizált idő 0..1 a definiált tartományon belül. */
  progress: number;
  playing: boolean;
  direction: 1 | -1;
  speed: AnimationSpeed;
  loop: boolean;
  /** Lejátszási tartomány (pl. kiválasztott gyakorlati szakasz). */
  range: [number, number];
}

export type RoleDisplayMode = 'selected' | 'agonist' | 'antagonist' | 'synergist' | 'all';

/* ---------- Gyakorlatok ---------- */

/**
 * A gyakorlat szakaszainak típusa: izomműködés (koncentrikus, excentrikus, izometriás), vagy
 * nyújtásnál passzív szakasz (az izom nem aktívan dolgozik, külső erő vagy testhelyzet nyújtja).
 */
export type ExercisePhaseType = ContractionType | 'passive-stretch' | 'static-stretch' | 'release';

/** Megjelenített szerep a gyakorlatban: a szokásos szerepek, nyújtásnál a nyújtott izom. */
export type DisplayRoleType = MuscleRoleType | 'stretched';

export interface ExercisePhase {
  type: ExercisePhaseType;
  name: string;
  /** A ciklus normalizált idővonalán (0..1). */
  from: number;
  to: number;
  description: string;
}

/** Az izom hosszváltozása az adott szakaszban (minőségi, nem mért érték). */
export type LengthChange = 'shortening' | 'lengthening' | 'constant';

/** Egy izomcsoport szerepe a gyakorlat egy szakaszában, egy adott ízületre vonatkoztatva. */
export interface ExercisePhaseRole {
  role: DisplayRoleType;
  /** Az ízület és a mozgás, amelyre a szerep vonatkozik. */
  joint: string;
  structureIds: string[];
  lengthChange: LengthChange;
  note?: string;
  evidence: EvidenceLevel;
  sourceIds: string[];
}

export interface ExerciseParameterConfig {
  rangeOfMotion?: { min: number; max: number; default: number };
  benchAngle?: { min: number; max: number; default: number; step: number };
  /** Gépes tárogatás: a felkar magassága a vállhoz képest (fok; az ülésmagasság határozza meg). */
  armElevation?: { min: number; max: number; default: number; step: number };
  /** Csigás gyakorlat: a kábel húzásiránya a vízszinteshez képest (fok; + felső csiga, − alsó csiga). */
  pulleyAngle?: { min: number; max: number; default: number; step: number };
  /** Fekvőtámasz: a kéz és a láb alátámasztásának magassága (cm). */
  handSupport?: { min: number; max: number; default: number; step: number };
  feetSupport?: { min: number; max: number; default: number; step: number };
  /** Tolódzkodás: a törzs előredőlése az alsó helyzetben (fok). */
  dipLean?: { min: number; max: number; default: number; step: number };
  load?: {
    min: number;
    max: number;
    default: number;
    step: number;
    /** barbell: rúd + tárcsák; per-hand: kezenként; stack: gépi súlyoszlop. */
    mode?: 'barbell' | 'per-hand' | 'stack';
    implementKg: number;
    implementName: string;
  };
}

/**
 * A gyakorlat animációjának leírása.
 *  - bench: fekvenyomás oldalnézetben (rúd vagy kézisúlyzó),
 *  - sagittal: oldalnézeti figura (gépes nyomás, fekvőtámasz, tolódzkodás),
 *  - transverse: felülnézet (a horizontális közelítés síkja) az anatómiai ábrával.
 */
export type ExerciseAnimation =
  | { kind: 'bench'; implement: 'barbell' | 'dumbbell' }
  | { kind: 'sagittal'; preset: 'machine-press' | 'push-up' | 'dips' }
  | {
      kind: 'transverse';
      implement: 'dumbbell' | 'pec-deck' | 'cable' | 'stretch';
      /** A vállízület horizontális távolításának szöge (felülnézeti póz) a mozgás két végpontján: [0. mélység, 1. mélység]. */
      range: [number, number];
      /** Egyoldali gyakorlat: a másik kar nyugalomban marad. */
      unilateral?: boolean;
      /** Rövid leírás a nézetről (pl. a test helyzete a valóságban). */
      viewNote: string;
    }
  | {
      /** Vállöv-gyakorlat: a mozgó vállövű anatómiai nézetben (lapockamozgások). */
      kind: 'girdle';
      viewId: 'anterior-girdle' | 'superior-girdle' | 'lateral-girdle' | 'posterior-girdle';
      /** A póz a 0. és az 1. mélységnél (1 = a célizom leghosszabb helyzete). */
      startPose: Pose;
      endPose: Pose;
      /** Egyoldali gyakorlat: a másik oldal alaphelyzetben marad. */
      unilateral?: boolean;
      /** Saját testsúlyos gyakorlat (a terhelés kijelzéséhez). */
      bodyweight?: boolean;
      /** Egyedi kivágás (pl. kis izomnál a vállöv környéke, vagy fej fölé emelt karnál). */
      viewBox?: [number, number, number, number];
      viewNote: string;
    };

export interface Exercise {
  id: string;
  name: Term;
  muscleIds: string[];
  status: MuscleStatus;
  animation: ExerciseAnimation;
  /** A „Mozgástartomány” csúszka magyarázata (pl. „a rúd az út …%-áig ereszkedik”). */
  romText: string;
  startPosition: string[];
  execution: string[];
  primaryMovers: string[];
  secondaryMovers: string[];
  stabilizers: string[];
  commonMistakes: string[];
  phases: ExercisePhase[];
  /** Agonista, szinergista, antagonista és stabilizáló izmok szakaszonként. */
  phaseRoles?: Partial<Record<ExercisePhaseType, ExercisePhaseRole[]>>;
  anatomyExplanation: Claim[];
  coachingNotes: Claim[];
  parameters: ExerciseParameterConfig;
  cycleDurationMs: number;
  sourceIds: string[];
}

/* ---------- Tanulás ---------- */

export type QuestionTopic =
  | 'name'
  | 'origin'
  | 'insertion'
  | 'innervation'
  | 'function'
  | 'joints'
  | 'regions'
  | 'roles'
  | 'stabilization'
  | 'contraction'
  | 'exercise'
  | 'recognition';

interface QuestionBase {
  id: string;
  muscleId: string;
  topic: QuestionTopic;
  prompt: string;
  explanation: string;
  sourceIds: string[];
  /** Kapcsolódó tananyag útvonala az alkalmazáson belül. */
  relatedPath?: string;
}

export interface MultipleChoiceQuestion extends QuestionBase {
  type: 'multiple-choice';
  options: { id: string; text: string }[];
  correctOptionId: string;
}

export interface DiagramQuestion extends QuestionBase {
  type: 'diagram-identify';
  viewId: AnatomicalViewId;
  /** Elfogadott struktúra-azonosítók (kattintható elemek). */
  correctStructureIds: string[];
  /** A kattintható struktúrák köre (zavaró elemek is). */
  selectableStructureIds: string[];
  /** Mit jelöljön a felhasználó. */
  task: 'muscle' | 'origin' | 'insertion';
}

export interface MatchingQuestion extends QuestionBase {
  type: 'matching';
  pairs: { id: string; left: string; right: string }[];
}

export interface FillBlankQuestion extends QuestionBase {
  type: 'fill-blank';
  /** A szöveg, benne "___" jelöli a hiányt. */
  text: string;
  options: string[];
  answer: string;
}

export type StudyQuestion = MultipleChoiceQuestion | DiagramQuestion | MatchingQuestion | FillBlankQuestion;

export type StudyAnswer =
  | { type: 'multiple-choice'; optionId: string }
  | { type: 'diagram-identify'; structureId: string }
  | { type: 'matching'; mapping: Record<string, string> }
  | { type: 'fill-blank'; value: string };

export interface Flashcard {
  id: string;
  muscleId: string;
  topic: QuestionTopic;
  front: string;
  back: string;
  sourceIds: string[];
}

export interface QuestionRecord {
  attempts: number;
  correct: number;
  lastCorrect: boolean;
  lastAnsweredAt: string;
}

export interface ExamResult {
  id: string;
  muscleId: string;
  topics: QuestionTopic[];
  total: number;
  correct: number;
  percent: number;
  finishedAt: string;
  answers: { questionId: string; correct: boolean }[];
}

export interface StudyProgress {
  questions: Record<string, QuestionRecord>;
  /** Legutóbb hibásan megválaszolt, ismétlendő kérdések. */
  wrongQuestionIds: string[];
  exams: ExamResult[];
  flashcardsSeen: Record<string, number>;
}
