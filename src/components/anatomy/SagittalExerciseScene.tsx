import { useMemo } from 'react';
import { applyMatrix, matrixToSvg } from '../../utils/geometry';
import { DIPS, MACHINE, PUSH_UP, solveSagittal, type SagittalPreset } from '../../engines/animation/sagittalKinematics';
import { FigureArm, FigureDefs, RoleLabels, TorsoSilhouette, type SceneMuscleLabel } from './sagittalFigure';

export interface SagittalExerciseSceneProps {
  preset: SagittalPreset;
  depth: number;
  loadKg?: number;
  phaseText: string;
  active: boolean;
  showLabels: boolean;
  muscleLabels?: SceneMuscleLabel[];
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
export function SagittalExerciseScene({ preset, depth, loadKg = 0, phaseText, active, showLabels, muscleLabels = [] }: SagittalExerciseSceneProps) {
  const sol = useMemo(() => solveSagittal(preset, depth), [preset, depth]);
  const torso = sol.transforms.torso!;
  const at = (x: number, y: number) => applyMatrix(torso, x, y);

  return (
    <svg viewBox={VIEWBOX[preset]} className="h-full w-full" role="img" aria-label={`${TITLES[preset]}, ${phaseText}`}>
      <FigureDefs />
      {preset === 'machine-press' && <MachineBackground torsoMatrix={matrixToSvg(torso)} loadKg={loadKg} showLabels={showLabels} />}
      {preset === 'push-up' && <line x1={-60} y1={PUSH_UP.hand.y + 2} x2={720} y2={PUSH_UP.hand.y + 2} stroke="var(--ml-border)" strokeWidth={2} />}
      {preset === 'dips' && <DipBars />}

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
          side={preset === 'push-up' ? 'left' : 'right'}
          x={preset === 'machine-press' ? 520 : preset === 'push-up' ? 300 : 490}
          top={preset === 'machine-press' ? 150 : preset === 'push-up' ? 140 : 40}
        />
      )}
      {showLabels && (
        <g className="an-label" style={{ fontSize: 12 }}>
          {preset === 'push-up' && (
            <text x={PUSH_UP.hand.x} y={PUSH_UP.hand.y + 22} textAnchor="middle">
              Rögzített kéz (zárt lánc)
            </text>
          )}
          {preset === 'dips' && (
            <text x={DIPS.grip.x + 120} y={DIPS.grip.y + 30} textAnchor="end">
              Párhuzamos korlát – rögzített kéz
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
