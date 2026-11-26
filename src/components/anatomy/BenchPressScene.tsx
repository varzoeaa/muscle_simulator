import { useMemo } from 'react';
import type { ContractionType, FramedPoint } from '../../types';
import { applyMatrix, computeFrameTransforms, matrixToSvg, smoothClosedPath, toWorld } from '../../utils/geometry';
import { benchFrames, platesPerSide, solveBench } from '../../engines/animation/benchKinematics';

const T = (x: number, y: number): FramedPoint => ({ frame: 'torso', x, y });
const H = (x: number, y: number): FramedPoint => ({ frame: 'humerus', x, y });

/** Szagittális vetületű izomkontúrok (sematikus) – törzs- és felkar-rendszerben. */
const pecOutline = [T(-204, -36), T(-182, -56), T(-148, -63), T(-120, -58), T(-116, -44), H(8, 42), H(-6, 22), T(-198, -22)];
const pecFibers: [FramedPoint, FramedPoint][] = [
  [T(-196, -46), H(-2, 26)],
  [T(-176, -56), H(0, 30)],
  [T(-156, -60), H(2, 34)],
  [T(-136, -58), H(4, 38)],
  [T(-120, -50), H(6, 40)]
];
const deltOutline = [T(-210, -26), T(-200, -42), H(-12, 4), H(-12, 64), H(-2, 70), H(10, 12)];
const tricepsOutline = [H(-14, 30), H(-16, 100), H(-8, 118), H(0, 116), H(-4, 40)];

const PLATE_R: Record<number, number> = { 25: 86, 20: 80, 15: 70, 10: 58, 5: 42, 2.5: 32, 1.25: 26 };

export interface BenchPressSceneProps {
  incline: number;
  depth: number;
  loadKg: number;
  barKg: number;
  phase: ContractionType;
  active: boolean;
  showLabels: boolean;
}

export function BenchPressScene({ incline, depth, loadKg, barKg, phase, active, showLabels }: BenchPressSceneProps) {
  const sol = useMemo(() => solveBench(incline, depth), [incline, depth]);
  const tf = useMemo(() => computeFrameTransforms(benchFrames, sol.pose), [sol.pose]);
  const torso = tf.torso!;
  const plates = platesPerSide(loadKg, barKg);
  const w = (p: FramedPoint) => toWorld(p, tf);
  const pecD = smoothClosedPath(pecOutline.map(w));
  const deltD = smoothClosedPath(deltOutline.map(w));
  const triD = smoothClosedPath(tricepsOutline.map(w));
  const hip = applyMatrix(torso, 0, 0);
  const supportTop = applyMatrix(torso, -130, 36);
  const floor = 470;
  // A kivágás a dőlésszögtől függ (a felső rúdhelyzet magasabbra kerül ferde padon), de egy ismétlésen belül állandó.
  const minY = Math.min(sol.top.y - 100, 150);
  const viewBox = `110 ${minY.toFixed(0)} 520 ${(486 - minY).toFixed(0)}`;
  const phaseText = phase === 'eccentric' ? 'excentrikus – hosszabbodik' : phase === 'concentric' ? 'koncentrikus – rövidül' : 'izometriás – közel változatlan hossz';

  return (
    <svg viewBox={viewBox} className="h-full w-full" role="img" aria-label={`Fekvenyomás oldalnézetben, ${incline}° paddőlés, ${loadKg} kg, ${phaseText}`}>
      <defs>
        <clipPath id="bp-pec-clip">
          <path d={pecD} />
        </clipPath>
      </defs>
      {/* Talaj */}
      <line x1={40} y1={floor} x2={660} y2={floor} stroke="var(--ml-border)" strokeWidth={2} />

      {/* Pad: ülőrész, háttámla a csípőnél csuklósan */}
      <g>
        <rect x={hip.x - 8} y={hip.y + 6} width={112} height={20} rx={6} fill="var(--an-bench)" stroke="var(--an-body-stroke)" />
        <line x1={hip.x + 40} y1={hip.y + 26} x2={hip.x + 40} y2={floor} stroke="var(--an-bench)" strokeWidth={10} />
        <line x1={supportTop.x} y1={supportTop.y} x2={supportTop.x} y2={floor} stroke="var(--an-bench)" strokeWidth={10} />
        <g transform={matrixToSvg(torso)}>
          <rect x={-275} y={16} width={290} height={20} rx={6} fill="var(--an-bench)" stroke="var(--an-body-stroke)" />
        </g>
      </g>

      {/* Láb (sematikus sziluett) */}
      <g stroke="var(--an-body)" strokeLinecap="round" fill="none">
        <path d={`M${hip.x} ${hip.y} L${hip.x + 92} ${hip.y + 4}`} strokeWidth={34} />
        <path d={`M${hip.x + 92} ${hip.y + 4} L${hip.x + 112} ${floor - 10}`} strokeWidth={24} />
        <path d={`M${hip.x + 108} ${floor - 8} L${hip.x + 146} ${floor - 6}`} strokeWidth={14} />
      </g>

      {/* Törzs és fej (sematikus sziluett) */}
      <g transform={matrixToSvg(torso)}>
        <path
          d="M14,16 L-206,16 C-222,10 -226,-18 -212,-34 C-196,-50 -166,-58 -126,-54 C-96,-50 -66,-40 -36,-38 C-10,-36 12,-22 16,0 Z"
          fill="var(--an-body)"
          stroke="var(--an-body-stroke)"
        />
        <rect x={-232} y={-20} width={26} height={30} rx={8} fill="var(--an-body)" />
        <circle cx={-246} cy={-6} r={24} fill="var(--an-body)" stroke="var(--an-body-stroke)" />
      </g>

      {/* Izmok – a nagy mellizom aktív a teljes ismétlés alatt */}
      <path d={triD} className="an-muscle is-dim" />
      <g id="muscle-pectoralis-major">
        <path d={pecD} className={`an-muscle is-selected ${active ? 'is-active' : ''}`} />
        <g clipPath="url(#bp-pec-clip)">
          {pecFibers.map(([a, b], i) => {
            const pa = w(a);
            const pb = w(b);
            return <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} className="an-fiber" />;
          })}
        </g>
      </g>

      {/* Felkar (vetület) és alkar */}
      <g transform={matrixToSvg(tf.humerus!)}>
        <rect x={-13} y={-6} width={26} height={126} rx={12} fill="var(--an-limb)" stroke="var(--an-body-stroke)" />
      </g>
      <path d={deltD} className="an-muscle role-synergist" style={{ fill: 'url(#pat-bp-syn)' }} />
      <defs>
        <pattern id="pat-bp-syn" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="var(--an-synergist)" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
        </pattern>
      </defs>
      <line x1={sol.elbow.x} y1={sol.elbow.y} x2={sol.bar.x} y2={sol.bar.y + 6} stroke="var(--an-limb)" strokeWidth={20} strokeLinecap="round" />
      <circle cx={sol.elbow.x} cy={sol.elbow.y} r={4} fill="none" stroke="var(--an-joint)" strokeDasharray="2 1.5" />
      <circle cx={sol.shoulder.x} cy={sol.shoulder.y} r={5} fill="none" stroke="var(--an-joint)" strokeDasharray="2 1.5" />

      {/* Rúdpálya */}
      <line x1={sol.top.x} y1={sol.top.y} x2={sol.bottom.x} y2={sol.bottom.y} stroke="var(--ml-accent-2)" strokeDasharray="3 5" strokeWidth={1.5} opacity={0.7} />

      {/* Rúd és tárcsák (a rúd vége a nézővel szemben) */}
      <g transform={`translate(${sol.bar.x} ${sol.bar.y})`}>
        {[...plates].reverse().map((p, i) => (
          <circle key={i} r={PLATE_R[p] ?? 30} fill="var(--an-plate)" fillOpacity={0.12} stroke="var(--an-plate)" strokeWidth={1.5} />
        ))}
        <circle r={10} fill="var(--an-plate)" />
        <circle r={4} fill="var(--an-canvas)" />
        <circle r={13} fill="none" stroke="var(--an-body)" strokeWidth={6} opacity={0.9} />
      </g>

      {showLabels && (
        <g className="an-label" style={{ fontSize: 12 }}>
          <text x={sol.bar.x + 100} y={sol.bar.y - 6}>{loadKg.toLocaleString('hu-HU')} kg</text>
          <text x={sol.bar.x + 100} y={sol.bar.y + 10} style={{ fontSize: 10 }}>
            {plates.length ? `tárcsák oldalanként: ${plates.map((p) => p.toLocaleString('hu-HU')).join(' + ')} kg` : 'üres rúd'}
          </text>
          <line x1={w(T(-128, -60)).x} y1={w(T(-128, -60)).y} x2={w(T(-40, -96)).x} y2={w(T(-40, -96)).y} stroke="var(--ml-text-2)" strokeWidth={0.8} />
          <text x={w(T(-40, -96)).x + 4} y={w(T(-40, -96)).y}>Nagy mellizom</text>
          <text x={hip.x - 10} y={hip.y + 52}>Pad: {incline}°</text>
        </g>
      )}
    </svg>
  );
}
