import type { AnimationSpeed, AnimationState, ContractionType, ExercisePhase, MotionDefinition, Pose } from '../../types';
import { clamp, lerp, lerpPose } from '../../utils/geometry';

/**
 * Adatvezérelt, tiszta (mellékhatás nélküli) animációs motor.
 * A megjelenítéstől független: az állapotot a hook / komponens tárolja,
 * a motor csak az átmeneteket számolja. Így egységtesztelhető.
 */

export const SPEEDS: AnimationSpeed[] = [0.25, 0.5, 1, 1.5, 2];

export const createAnimationState = (overrides: Partial<AnimationState> = {}): AnimationState => ({
  progress: 0,
  playing: false,
  direction: 1,
  speed: 1,
  loop: false,
  range: [0, 1],
  ...overrides
});

/** Egy időlépés. `dtMs`: eltelt valós idő, `durationMs`: a teljes (0..1) idővonal hossza 1× sebességnél. */
export function tick(state: AnimationState, dtMs: number, durationMs: number): AnimationState {
  if (!state.playing || durationMs <= 0) return state;
  const [lo, hi] = state.range;
  const delta = (dtMs / durationMs) * state.speed * state.direction;
  let progress = state.progress + delta;
  let playing: boolean = state.playing;
  if (state.loop) {
    const span = hi - lo;
    if (span <= 0) return { ...state, progress: lo };
    if (progress > hi) progress = lo + ((progress - lo) % span);
    if (progress < lo) progress = hi - ((lo - progress) % span);
  } else if (state.direction === 1 && progress >= hi) {
    progress = hi;
    playing = false;
  } else if (state.direction === -1 && progress <= lo) {
    progress = lo;
    playing = false;
  } else {
    progress = clamp(progress, lo, hi);
  }
  return { ...state, progress, playing };
}

export const play = (s: AnimationState): AnimationState => {
  const [lo, hi] = s.range;
  // A tartomány végéről indítva előlről kezdjük (illetve hátrafelé játszásnál a végéről).
  if (!s.loop && s.direction === 1 && s.progress >= hi) return { ...s, progress: lo, playing: true };
  if (!s.loop && s.direction === -1 && s.progress <= lo) return { ...s, progress: hi, playing: true };
  return { ...s, playing: true };
};
export const pause = (s: AnimationState): AnimationState => ({ ...s, playing: false });
/** Visszatekerés: a lejátszás iránya megfordul, és elindul. */
export const rewind = (s: AnimationState): AnimationState => play({ ...s, direction: -1 });
export const forward = (s: AnimationState): AnimationState => play({ ...s, direction: 1 });
export const seek = (s: AnimationState, progress: number): AnimationState => ({ ...s, progress: clamp(progress, s.range[0], s.range[1]) });
export const setSpeed = (s: AnimationState, speed: AnimationSpeed): AnimationState => ({ ...s, speed });
export const setRange = (s: AnimationState, range: [number, number]): AnimationState => ({
  ...s,
  range,
  progress: clamp(s.progress, range[0], range[1])
});
/** Kiinduló helyzet visszaállítása: megáll, előre irány, a tartomány eleje. */
export const reset = (s: AnimationState): AnimationState => ({ ...s, playing: false, direction: 1, progress: s.range[0] });

/* ---------------- Biomechanics Lab: izomműködési típusok ---------------- */

/**
 * A mozgás póza adott idő és izomműködési típus esetén.
 * - koncentrikus: a megnyúlt helyzetből (startPose) a rövidült helyzetbe (endPose)
 * - excentrikus: fordítva – az izom terhelés alatt hosszabbodik
 * - izometriás: középhelyzetben marad
 * Az idő (t) minden esetben előre halad; a "visszatekerés" az időt fordítja meg.
 */
export function motionPose(motion: MotionDefinition, t: number, type: ContractionType): Pose {
  const e = easeInOut(clamp(t, 0, 1));
  const shortening = type === 'concentric' ? e : type === 'eccentric' ? 1 - e : 0.5;
  const pose = lerpPose(motion.startPose, motion.endPose, shortening);
  return motion.solvePose ? motion.solvePose(pose) : pose;
}

/** Minőségi (nem numerikus) izomhossz-változás iránya a vizsgált izomra. */
export function lengthChange(type: ContractionType, playing: boolean): 'shortening' | 'lengthening' | 'constant' {
  if (type === 'isometric' || !playing) return 'constant';
  return type === 'concentric' ? 'shortening' : 'lengthening';
}

export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/* ---------------- Exercise Lab: ciklus és szakaszok ---------------- */

export function phaseAt(phases: ExercisePhase[], t: number): ExercisePhase | undefined {
  return phases.find((p) => t >= p.from && t <= p.to) ?? phases[phases.length - 1];
}

/**
 * A rúd "mélysége" a ciklus egy pontján: 0 = felső helyzet (kinyújtott kar), 1 = alsó helyzet.
 * A szakaszok határait az adatfájl definiálja.
 */
export function cycleDepth(phases: ExercisePhase[], t: number): number {
  const p = phaseAt(phases, t);
  if (!p) return 0;
  const local = p.to > p.from ? clamp((t - p.from) / (p.to - p.from), 0, 1) : 0;
  if (p.type === 'eccentric') return easeInOut(local);
  if (p.type === 'concentric') return 1 - easeInOut(local);
  // Izometriás: a megelőző szakasz végpontjában marad.
  const idx = phases.indexOf(p);
  const prev = phases[idx - 1];
  return prev?.type === 'concentric' ? 0 : 1;
}

/**
 * Mozgástartomány alkalmazása: a ROM (0..1) a teljes út hányada.
 * A felső helyzet változatlan, az alsó helyzet a ROM-mal arányosan közelebb kerül.
 */
export const applyRangeOfMotion = (depth: number, rom: number) => clamp(depth, 0, 1) * clamp(rom, 0, 1);

export const lerpPoint = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });
