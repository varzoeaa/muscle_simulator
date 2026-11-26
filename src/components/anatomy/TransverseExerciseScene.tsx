import { useMemo } from 'react';
import type { BoneShapeGeometry, DisplayRoleType, ExerciseAnimation, Pose, ViewGeometry } from '../../types';
import { superiorView } from '../../data/geometry/superiorView';
import { computeFrameTransforms, lerp, toWorld } from '../../utils/geometry';
import { AnatomyViewer } from './AnatomyViewer';

type TransverseAnimation = Extract<ExerciseAnimation, { kind: 'transverse' }>;

/** A kéz helye az alkar rendszerében (felülnézet). */
const HAND = { frame: 'forearm', x: 0, y: 214 };
/** A csigák helye (oldalt, kissé a test síkja mögött) – a jobb oldalon; a bal oldal tükrözött. */
const PULLEY = { x: -96, y: 214 };
const MIRROR_AXIS = 300;

const implementShapes: Record<TransverseAnimation['implement'], BoneShapeGeometry[]> = {
  // Semleges fogás: a súlyzó tengelye a test hossztengelyével párhuzamos, felülről a vége látszik.
  dumbbell: [{ structureId: 'implement-dumbbell', title: 'Kézisúlyzó', frame: 'forearm', variant: 'implement', overlay: true, d: 'M-20,214 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0 Z' }],
  // A gép karja a vállízület fölötti tengely körül fordul; a fogantyú a kéz elülső oldalán.
  'pec-deck': [
    { structureId: 'implement-pec-deck', title: 'A gép karja', frame: 'humerus', variant: 'implement', overlay: true, d: 'M24,20 L32,20 L32,420 L24,420 Z M12,404 L44,404 L44,428 L12,428 Z' }
  ],
  cable: [{ structureId: 'implement-cable-handle', title: 'Kábelfogantyú', frame: 'forearm', variant: 'implement', overlay: true, d: 'M-10,214 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 Z' }],
  stretch: [{ structureId: 'implement-wall-contact', title: 'A tenyér a falon', frame: 'forearm', variant: 'implement', overlay: true, d: 'M-14,206 L14,206 L14,220 L-14,220 Z' }]
};

export interface TransverseExerciseSceneProps {
  animation: TransverseAnimation;
  depth: number;
  roleMap: Record<string, DisplayRoleType>;
  activeIds: string[];
  showLabels: boolean;
  ariaLabel: string;
}

/**
 * Felülnézeti gyakorlatábra: a vállöv anatómiai felülnézete, a kar a horizontális
 * távolítás–közelítés tartományában mozog. A szerepek színezését és feliratait az
 * anatómiai nézet (AnatomyViewer) végzi.
 */
export function TransverseExerciseScene({ animation, depth, roleMap, activeIds, showLabels, ariaLabel }: TransverseExerciseSceneProps) {
  const geometry = useMemo<ViewGeometry>(() => ({ ...superiorView, bones: [...superiorView.bones, ...implementShapes[animation.implement]] }), [animation.implement]);
  const pose: Pose = { shoulderHorizontalAbduction: lerp(animation.range[0], animation.range[1], depth) };
  // Egyoldali gyakorlatnál a másik kar lóg: felülről a hossztengelye mentén, erősen rövidülve látszik.
  const mirrorPose: Pose | undefined = animation.unilateral ? { shoulderHorizontalAbduction: 90, humerusScale: 0.12 } : undefined;

  const cables =
    animation.implement === 'cable' &&
    (() => {
      const hand = toWorld(HAND, computeFrameTransforms(geometry.frames, pose));
      return (
        <g>
          <line x1={hand.x} y1={hand.y} x2={PULLEY.x} y2={PULLEY.y} className="an-cable" />
          <line x1={2 * MIRROR_AXIS - hand.x} y1={hand.y} x2={2 * MIRROR_AXIS - PULLEY.x} y2={PULLEY.y} className="an-cable" />
          <circle cx={PULLEY.x} cy={PULLEY.y} r={9} className="an-implement" />
          <circle cx={2 * MIRROR_AXIS - PULLEY.x} cy={PULLEY.y} r={9} className="an-implement" />
          {showLabels && (
            <text x={PULLEY.x} y={PULLEY.y - 16} textAnchor="middle" className="an-label" style={{ fontSize: 13 }}>
              Csiga
            </text>
          )}
        </g>
      );
    })();

  return (
    <AnatomyViewer
      geometry={geometry}
      pose={pose}
      mirrorPose={mirrorPose}
      roleMap={roleMap}
      activeIds={activeIds}
      hideLabels={!showLabels}
      ariaLabel={ariaLabel}
      sceneExtras={cables || undefined}
      // Mindkét kar a teljes mozgástartományban látsszon (nyitott karnál a kéz messze oldalt van).
      viewBoxOverride={[-350, 40, 1300, 700]}
    />
  );
}
