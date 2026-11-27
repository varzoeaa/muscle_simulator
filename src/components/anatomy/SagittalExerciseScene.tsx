import { useMemo } from 'react';
import { applyMatrix, matrixToSvg } from '../../utils/geometry';
import {
  BENCH_DIP_HEIGHT_CM,
  DEFAULT_DIPS,
  DEFAULT_PUSH_UP,
  DIPS,
  MACHINE,
  PUSH_UP,
  PX_PER_CM,
  pushUpExtents,
  solvePushUp,
  solveSagittal,
  type DipOptions,
  type DipVariant,
  type PushUpOptions,
  type SagittalPreset
} from '../../engines/animation/sagittalKinematics';
import { FigureArm, FigureDefs, RoleLabels, TorsoSilhouette, type SceneMuscleLabel } from './sagittalFigure';

export interface SagittalExerciseSceneProps {
  preset: SagittalPreset;
  depth: number;
  loadKg?: number;
  phaseText: string;
  active: boolean;
  showLabels: boolean;
  muscleLabels?: SceneMuscleLabel[];
  /** Fekvőtámasz-változat: kéz- és lábalátámasztás, térdelő változat. */
  pushUp?: PushUpOptions;
  /** Tolódzkodás-változat: pad, korlát vagy gyűrű, és a törzs előredőlése. */
  dips?: DipOptions;
}

const TITLES: Record<SagittalPreset, string> = {
  'machine-press': 'Gépes mellnyomás oldalnézetben',
  'push-up': 'Fekvőtámasz oldalnézetben',
  dips: 'Tolódzkodás párhuzamos korláton, oldalnézetben'
};

/** Kijelölés (viewBox) gyakorlatonként: az egész mozgás látszik, a feliratoknak is jut hely. */
const VIEWBOX: Record<SagittalPreset, string> = {
  'machine-press': '40 100 700 470',
  'push-up': '-40 30 720 420',
  dips: '-130 -40 930 600'
};

const limb = { stroke: 'var(--an-body)', strokeLinecap: 'round' as const, fill: 'none' };

/**
 * Oldalnézeti gyakorlatábra (gépes mellnyomás, fekvőtámasz, tolódzkodás) a fekvenyomással közös
 * testsémával és izomkontúrokkal. A szerepek színe és felirata az aktuális szakaszból jön.
 */
export function SagittalExerciseScene({ preset, depth, loadKg = 0, phaseText, active, showLabels, muscleLabels = [], pushUp = DEFAULT_PUSH_UP, dips = DEFAULT_DIPS }: SagittalExerciseSceneProps) {
  const { handCm, feetCm, knees } = pushUp;
  const { variant: dipVariant, lean: dipLean } = dips;
  const sol = useMemo(
    () => solveSagittal(preset, depth, { handCm, feetCm, knees }, { variant: dipVariant, lean: dipLean }),
    [preset, depth, handCm, feetCm, knees, dipVariant, dipLean]
  );
  const pu = useMemo(() => (preset === 'push-up' ? solvePushUp(depth, { handCm, feetCm, knees }, false) : undefined), [preset, depth, handCm, feetCm, knees]);
  // Fekvőtámasznál a kivágás az alátámasztástól függ, de egy ismétlésen belül állandó.
  const ext = useMemo(() => (preset === 'push-up' ? pushUpExtents({ handCm, feetCm, knees }) : undefined), [preset, handCm, feetCm, knees]);
  const floor = PUSH_UP.hand.y + 2;
  // A figura jobb oldalán sáv a feliratoknak.
  const dipBox = preset === 'dips' && dipVariant === 'bench' ? '-130 -40 930 560' : undefined;
  const viewBox = dipBox ?? (ext ? `${(ext.minX - 50).toFixed(0)} ${(ext.minY - 90).toFixed(0)} ${(ext.maxX - ext.minX + 330).toFixed(0)} ${(floor + 40 - (ext.minY - 90)).toFixed(0)}` : VIEWBOX[preset]);
  const torso = sol.transforms.torso!;
  const at = (x: number, y: number) => applyMatrix(torso, x, y);

  return (
    <svg viewBox={viewBox} className="h-full w-full" role="img" aria-label={`${TITLES[preset]}, ${phaseText}`}>
      <FigureDefs />
      {preset === 'machine-press' && <MachineBackground torsoMatrix={matrixToSvg(torso)} loadKg={loadKg} showLabels={showLabels} />}
      {preset === 'push-up' && ext && pu && (
        <g>
          <line x1={ext.minX - 200} y1={floor} x2={ext.maxX + 200} y2={floor} stroke="var(--ml-border)" strokeWidth={2} />
          {/* Kéz alátámasztása (pad, doboz) */}
          {pu.handTop < PUSH_UP.hand.y && <rect x={PUSH_UP.hand.x - 48} y={pu.handTop + 2} width={96} height={floor - pu.handTop - 2} rx={4} fill="var(--an-bench)" stroke="var(--an-body-stroke)" />}
          {/* Láb alátámasztása */}
          {pu.feetTop < PUSH_UP.hand.y && <rect x={pu.contact.x - 48} y={pu.feetTop + 2} width={96} height={floor - pu.feetTop - 2} rx={4} fill="var(--an-bench)" stroke="var(--an-body-stroke)" />}
        </g>
      )}
      {preset === 'dips' && <DipApparatus variant={dipVariant} />}

      {/* Láb (sematikus sziluett) */}
      {preset === 'machine-press' && (
        <g {...limb}>
          <path d={`M${sol.hip.x} ${sol.hip.y - 14} L${sol.hip.x + 150} ${sol.hip.y - 8}`} strokeWidth={34} />
          <path d={`M${sol.hip.x + 150} ${sol.hip.y - 8} L${sol.hip.x + 156} ${sol.hip.y + 118}`} strokeWidth={24} />
          <path d={`M${sol.hip.x + 152} ${sol.hip.y + 120} L${sol.hip.x + 190} ${sol.hip.y + 122}`} strokeWidth={14} />
        </g>
      )}
      {preset === 'push-up' &&
        (() => {
          const hip = at(0, -16);
          if (knees) {
            // Térdelő változat: a térd a talajon, a lábszár hátrafelé-felfelé emelve.
            const knee = at(PUSH_UP.kneeLocal.x, -16);
            const ankle = at(282, 64);
            return (
              <g {...limb}>
                <path d={`M${hip.x} ${hip.y} L${knee.x} ${knee.y}`} strokeWidth={30} />
                <path d={`M${knee.x} ${knee.y} L${ankle.x} ${ankle.y}`} strokeWidth={22} />
              </g>
            );
          }
          const ankle = at(310, -16);
          const toe = at(PUSH_UP.toeLocal.x, PUSH_UP.toeLocal.y);
          return (
            <g {...limb}>
              <path d={`M${hip.x} ${hip.y} L${ankle.x} ${ankle.y}`} strokeWidth={30} />
              <path d={`M${ankle.x} ${ankle.y} L${toe.x} ${toe.y}`} strokeWidth={14} />
            </g>
          );
        })()}
      {preset === 'dips' &&
        dipVariant === 'bench' &&
        (() => {
          // Padon végzett tolódzkodás: a láb elöl a talajon, a térd hajlított.
          const hip = at(0, -16);
          const floorY = DIPS.grip.y + BENCH_DIP_HEIGHT_CM * PX_PER_CM;
          const knee = { x: hip.x + 150, y: Math.min(hip.y + 6, floorY - 70) };
          const foot = { x: knee.x + 24, y: floorY - 6 };
          return (
            <g {...limb}>
              <path d={`M${hip.x} ${hip.y} L${knee.x} ${knee.y}`} strokeWidth={30} />
              <path d={`M${knee.x} ${knee.y} L${foot.x} ${foot.y}`} strokeWidth={22} />
              <path d={`M${foot.x - 4} ${foot.y} L${foot.x + 30} ${foot.y + 2}`} strokeWidth={12} />
            </g>
          );
        })()}
      {preset === 'dips' &&
        dipVariant !== 'bench' &&
        (() => {
          const hip = at(0, -16);
          const knee = at(150, -10);
          // Erősen hajlított térd: a lábszár hátrafelé mutat, a láb nem ér le.
          return (
            <g {...limb}>
              <path d={`M${hip.x} ${hip.y} L${knee.x} ${knee.y}`} strokeWidth={30} />
              <path d={`M${knee.x} ${knee.y} L${knee.x - 118} ${knee.y + 42}`} strokeWidth={22} />
            </g>
          );
        })()}

      <TorsoSilhouette torso={torso} />
      <FigureArm transforms={sol.transforms} elbow={sol.elbow} hand={sol.hand} shoulder={sol.shoulder} labels={muscleLabels} active={active} clipId={`sag-pec-clip-${preset}`} />

      {/* A kéz (gépes nyomás) vagy a váll (zárt lánc) pályája */}
      <line x1={sol.path[0].x} y1={sol.path[0].y} x2={sol.path[1].x} y2={sol.path[1].y} stroke="var(--ml-accent-2)" strokeDasharray="3 5" strokeWidth={1.5} opacity={0.7} />

      {preset === 'machine-press' && (
        /* Fogantyú (függőleges markolat) */
        <rect x={sol.hand.x - 6} y={sol.hand.y - 22} width={12} height={44} rx={5} fill="var(--an-plate)" stroke="var(--an-body-stroke)" />
      )}
      {preset === 'push-up' && <circle cx={sol.hand.x} cy={sol.hand.y} r={4} fill="var(--an-joint)" />}

      {showLabels && muscleLabels.length > 0 && (
        <RoleLabels
          labels={muscleLabels}
          transforms={sol.transforms}
          side="right"
          x={preset === 'machine-press' ? 520 : ext ? ext.maxX + 40 : 490}
          top={preset === 'machine-press' ? 150 : ext ? ext.minY - 40 : 40}
        />
      )}
      {showLabels && (
        <g className="an-label" style={{ fontSize: 12 }}>
          {preset === 'push-up' && (
            <text x={PUSH_UP.hand.x} y={(pu?.handTop ?? PUSH_UP.hand.y) + 22} textAnchor="middle">
              Rögzített kéz (zárt lánc)
            </text>
          )}
          {preset === 'dips' && (
            <text x={DIPS.grip.x + (dipVariant === 'bench' ? -20 : 120)} y={DIPS.grip.y + 30} textAnchor="end">
              {dipVariant === 'bench' ? 'Pad – a kéz a test mögött' : dipVariant === 'ring' ? 'Gyűrű – instabil fogás' : 'Párhuzamos korlát – rögzített kéz'}
            </text>
          )}
        </g>
      )}
    </svg>
  );
}

/** Gépes mellnyomás: ülés, háttámla (a törzshöz rögzítve), súlyoszlop. */
function MachineBackground({ torsoMatrix, loadKg, showLabels }: { torsoMatrix: string; loadKg: number; showLabels: boolean }) {
  const { hip } = MACHINE;
  const floor = hip.y + 128;
  const plates = Math.max(1, Math.round(loadKg / 10));
  return (
    <g>
      <line x1={20} y1={floor} x2={740} y2={floor} stroke="var(--ml-border)" strokeWidth={2} />
      {/* Ülés és talp */}
      <rect x={hip.x - 30} y={hip.y + 4} width={130} height={18} rx={6} fill="var(--an-bench)" stroke="var(--an-body-stroke)" />
      <line x1={hip.x + 30} y1={hip.y + 22} x2={hip.x + 30} y2={floor} stroke="var(--an-bench)" strokeWidth={10} />
      {/* Háttámla a törzs mögött */}
      <g transform={torsoMatrix}>
        <rect x={-235} y={16} width={235} height={20} rx={6} fill="var(--an-bench)" stroke="var(--an-body-stroke)" />
      </g>
      {/* Súlyoszlop a gép hátsó részén */}
      <rect x={hip.x - 170} y={hip.y - 260} width={70} height={floor - (hip.y - 260)} rx={4} fill="none" stroke="var(--an-bench)" strokeWidth={6} />
      {Array.from({ length: Math.min(plates, 12) }, (_, i) => (
        <rect key={i} x={hip.x - 164} y={floor - 14 - i * 12} width={58} height={10} rx={2} fill="var(--an-plate)" fillOpacity={0.5} />
      ))}
      {showLabels && (
        <text x={hip.x - 135} y={hip.y - 270} textAnchor="middle" className="an-label" style={{ fontSize: 11 }}>
          Súlyoszlop
        </text>
      )}
    </g>
  );
}

/** A tolódzkodás eszköze: korlát, gyűrű (függesztve) vagy pad (a test mögött). */
function DipApparatus({ variant }: { variant: DipVariant }) {
  const { grip } = DIPS;
  if (variant === 'ring') {
    const floor = grip.y + 400;
    return (
      <g>
        <line x1={60} y1={floor} x2={740} y2={floor} stroke="var(--ml-border)" strokeWidth={2} />
        <line x1={grip.x - 160} y1={-60} x2={grip.x + 160} y2={-60} stroke="var(--an-bench)" strokeWidth={8} />
        <line x1={grip.x} y1={-60} x2={grip.x} y2={grip.y - 14} stroke="var(--an-plate)" strokeWidth={3} />
        <circle cx={grip.x} cy={grip.y} r={14} fill="none" stroke="var(--an-plate)" strokeWidth={5} />
      </g>
    );
  }
  if (variant === 'bench') {
    const floor = grip.y + BENCH_DIP_HEIGHT_CM * PX_PER_CM;
    return (
      <g>
        <line x1={-120} y1={floor} x2={790} y2={floor} stroke="var(--ml-border)" strokeWidth={2} />
        <rect x={grip.x - 190} y={grip.y + 4} width={200} height={20} rx={5} fill="var(--an-bench)" stroke="var(--an-body-stroke)" />
        <line x1={grip.x - 170} y1={grip.y + 24} x2={grip.x - 170} y2={floor} stroke="var(--an-bench)" strokeWidth={10} />
        <line x1={grip.x - 10} y1={grip.y + 24} x2={grip.x - 10} y2={floor} stroke="var(--an-bench)" strokeWidth={10} />
      </g>
    );
  }
  return <DipBars />;
}

/** Párhuzamos korlát oldalnézetben: a korlát a nézés irányával párhuzamos, ezért vízszintes rúdként látszik. */
function DipBars() {
  const { grip } = DIPS;
  // A talaj a kivágáson kívül esik: a korlát lábai lefelé kifutnak.
  const floor = grip.y + 400;
  return (
    <g>
      <line x1={60} y1={floor} x2={740} y2={floor} stroke="var(--ml-border)" strokeWidth={2} />
      <line x1={grip.x - 170} y1={grip.y + 6} x2={grip.x + 150} y2={grip.y + 6} stroke="var(--an-bench)" strokeWidth={10} strokeLinecap="round" />
      <line x1={grip.x - 150} y1={grip.y + 6} x2={grip.x - 150} y2={floor} stroke="var(--an-bench)" strokeWidth={10} />
      <line x1={grip.x + 130} y1={grip.y + 6} x2={grip.x + 130} y2={floor} stroke="var(--an-bench)" strokeWidth={10} />
    </g>
  );
}
