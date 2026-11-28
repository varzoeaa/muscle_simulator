import type { DisplayRoleType, ExerciseAnimation } from '../../types';
import { viewGeometries } from '../../data/geometry';
import { lerpPose } from '../../utils/geometry';
import { AnatomyViewer } from './AnatomyViewer';

type GirdleAnimation = Extract<ExerciseAnimation, { kind: 'girdle' }>;

export interface GirdleExerciseSceneProps {
  animation: GirdleAnimation;
  depth: number;
  roleMap: Record<string, DisplayRoleType>;
  activeIds: string[];
  showLabels: boolean;
  ariaLabel: string;
}

/**
 * Vállöv-gyakorlat ábrája: a mozgó vállövű anatómiai nézet (a lapocka és a kulcscsont mozog),
 * a póz a gyakorlat „mélysége” szerint a két végpont között. A szerepek színezését és feliratait
 * az anatómiai nézet végzi; a mély izmok (pl. kis mellizom) szerepkörrel jelölve előtérbe kerülnek.
 */
export function GirdleExerciseScene({ animation, depth, roleMap, activeIds, showLabels, ariaLabel }: GirdleExerciseSceneProps) {
  const geometry = viewGeometries[animation.viewId]!;
  const pose = lerpPose(animation.startPose, animation.endPose, depth);
  return (
    <AnatomyViewer
      geometry={geometry}
      pose={pose}
      mirrorPose={animation.unilateral ? animation.startPose : undefined}
      roleMap={roleMap}
      activeIds={activeIds}
      hideLabels={!showLabels}
      ariaLabel={ariaLabel}
      // Felülnézetben a kar messze oldalra (vagy előre) nyúlik: szélesebb kivágás, hogy végig látsszon.
      viewBoxOverride={animation.viewBox ?? (animation.viewId === 'superior-girdle' ? [-350, 40, 1300, 700] : undefined)}
    />
  );
}
