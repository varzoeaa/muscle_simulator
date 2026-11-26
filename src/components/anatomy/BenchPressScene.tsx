import { useMemo } from 'react';
import { applyMatrix, computeFrameTransforms, matrixToSvg } from '../../utils/geometry';
import { benchFrames, platesPerSide, solveBench } from '../../engines/animation/benchKinematics';
import { FigureArm, FigureDefs, RoleLabels, TorsoSilhouette, type SceneMuscleLabel } from './sagittalFigure';

export type { SceneMuscleLabel } from './sagittalFigure';

const PLATE_R: Record<number, number> = { 25: 86, 20: 80, 15: 70, 10: 58, 5: 42, 2.5: 32, 1.25: 26 };

/** Kézisúlyzó oldalnézetben (a súlyzó tengelye a nézővel szemben): a tárcsa sugara a súllyal nő. */
export const dumbbellRadius = (kg: number) => Math.min(40, 14 + kg * 0.6);

export interface BenchPressSceneProps {
  incline: number;
  depth: number;
  loadKg: number;
  barKg: number;
  /** Rúd vagy kézisúlyzó (kezenként `loadKg`). */
  implement?: 'barbell' | 'dumbbell';
  phaseText: string;
  active: boolean;
  showLabels: boolean;
  /** Szerepkör-feliratok az aktuális szakaszhoz (adatvezérelt). */
  muscleLabels?: SceneMuscleLabel[];
}

export function BenchPressScene({ incline, depth, loadKg, barKg, implement = 'barbell', phaseText, active, showLabels, muscleLabels = [] }: BenchPressSceneProps) {
  const sol = useMemo(() => solveBench(incline, depth), [incline, depth]);
  const tf = useMemo(() => computeFrameTransforms(benchFrames, sol.pose), [sol.pose]);
  const torso = tf.torso!;
  const plates = platesPerSide(loadKg, barKg);
  const hip = applyMatrix(torso, 0, 0);
  const supportTop = applyMatrix(torso, -130, 36);
  const floor = 470;
  // A kivágás a dőlésszögtől függ (a felső helyzet magasabbra kerül ferde padon), de egy ismétlésen belül állandó.
  const minY = Math.min(sol.top.y - 110, 150);
  const viewBox = `110 ${minY.toFixed(0)} 520 ${(486 - minY).toFixed(0)}`;
  const what = implement === 'dumbbell' ? `Kézisúlyzós fekvenyomás oldalnézetben, kezenként ${loadKg} kg` : `Fekvenyomás oldalnézetben, ${loadKg} kg`;

  return (
    <svg viewBox={viewBox} className="h-full w-full" role="img" aria-label={`${what}, ${incline}° paddőlés, ${phaseText}`}>
      <FigureDefs />
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

      <TorsoSilhouette torso={torso} />
      <FigureArm transforms={tf} elbow={sol.elbow} hand={{ x: sol.bar.x, y: sol.bar.y + 6 }} shoulder={sol.shoulder} labels={muscleLabels} active={active} clipId="bp-pec-clip" />

      {/* Pálya */}
      <line x1={sol.top.x} y1={sol.top.y} x2={sol.bottom.x} y2={sol.bottom.y} stroke="var(--ml-accent-2)" strokeDasharray="3 5" strokeWidth={1.5} opacity={0.7} />

      {implement === 'barbell' ? (
        /* Rúd és tárcsák (a rúd vége a nézővel szemben) */
        <g transform={`translate(${sol.bar.x} ${sol.bar.y})`}>
          {[...plates].reverse().map((p, i) => (
            <circle key={i} r={PLATE_R[p] ?? 30} fill="var(--an-plate)" fillOpacity={0.12} stroke="var(--an-plate)" strokeWidth={1.5} />
          ))}
          <circle r={10} fill="var(--an-plate)" />
          <circle r={4} fill="var(--an-canvas)" />
          <circle r={13} fill="none" stroke="var(--an-body)" strokeWidth={6} opacity={0.9} />
        </g>
      ) : (
        /* Kézisúlyzó: a súlyzó tengelye a nézővel szemben, a kéz a fogantyún */
        <g transform={`translate(${sol.bar.x} ${sol.bar.y})`}>
          <polygon
            points={Array.from({ length: 6 }, (_, i) => {
              const a = (Math.PI / 3) * i + Math.PI / 6;
              const r = dumbbellRadius(loadKg);
              return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
            }).join(' ')}
            fill="var(--an-plate)"
            fillOpacity={0.18}
            stroke="var(--an-plate)"
            strokeWidth={1.5}
          />
          <circle r={6} fill="var(--an-plate)" />
          <circle r={12} fill="none" stroke="var(--an-body)" strokeWidth={6} opacity={0.9} />
        </g>
      )}

      {showLabels && muscleLabels.length > 0 && <RoleLabels labels={muscleLabels} transforms={tf} x={452} top={minY + 40} />}

      {showLabels && (
        <g className="an-label" style={{ fontSize: 12 }}>
          <text x={hip.x - 10} y={hip.y + 52}>Pad: {incline}°</text>
        </g>
      )}
    </svg>
  );
}
