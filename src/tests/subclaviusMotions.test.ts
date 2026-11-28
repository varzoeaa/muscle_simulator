import { describe, expect, it } from 'vitest';
import type { MotionDefinition } from '../types';
import { subclaviusMotions } from '../data/motions/subclaviusMotions';
import { motionById } from '../data/motions';
import { subclavius } from '../data/muscles/subclavius';
import { viewGeometries } from '../data/geometry';
import { motionPose } from '../engines/animation/animationEngine';
import { computeFrameTransforms, toWorld } from '../utils/geometry';

const M = 'muscle-subclavius';

/** Az eredési és a tapadási jelölés középpontjának távolsága az adott pózban. */
function length(motion: MotionDefinition, t: number) {
  const g = viewGeometries[motion.viewId]!;
  const tr = computeFrameTransforms(g.frames, motionPose(motion, t, 'concentric'));
  const centre = (type: 'origin' | 'insertion') => {
    const pts = g.attachments.find((a) => a.structureId === M && a.type === type)!.points.map((p) => toWorld(p, tr));
    return { x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length };
  };
  const o = centre('origin');
  const i = centre('insertion');
  return Math.hypot(o.x - i.x, o.y - i.y);
}

describe('A kulcscsont alatti izom mozgásanimációi', () => {
  it('az Anatómia modulban felsorolt minden mozgáshoz tartozik animáció', () => {
    const covered = new Set(subclavius.motionIds.map((id) => motionById(id)?.movementId));
    new Set(subclavius.roles.map((r) => r.movementId)).forEach((m) => expect(covered.has(m), m).toBe(true));
  });

  it.each(subclaviusMotions.map((m) => [m.id, m] as const))('%s: koncentrikus működésnél az eredés és a tapadás közeledik', (_, m) => {
    expect(length(m, 1)).toBeLessThan(length(m, 0) - 1);
  });

  it('a kulcscsont süllyesztésekor a tapadás lefelé mozdul, belégzéskor az eredés felfelé', () => {
    const point = (m: MotionDefinition, type: 'origin' | 'insertion', t: number) => {
      const g = viewGeometries[m.viewId]!;
      return toWorld(g.attachments.find((a) => a.structureId === M && a.type === type)!.points[0]!, computeFrameTransforms(g.frames, motionPose(m, t, 'concentric')));
    };
    const dep = motionById('sub-clavicular-depression')!;
    expect(point(dep, 'insertion', 1).y).toBeGreaterThan(point(dep, 'insertion', 0).y);
    const insp = motionById('sub-accessory-inspiration')!;
    expect(point(insp, 'origin', 1).y).toBeLessThan(point(insp, 'origin', 0).y);
    expect(point(insp, 'insertion', 1).y).toBeCloseTo(point(insp, 'insertion', 0).y, 6);
  });
});
