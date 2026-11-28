import { describe, expect, it } from 'vitest';
import { muscleById } from '../data/muscles';
import { motionById } from '../data/motions';
import { viewGeometries } from '../data/geometry';
import { movementById } from '../data/joints/joints';
import { sourceById } from '../data/sources/sources';
import { computeFrameTransforms, toWorld } from '../utils/geometry';
import type { MotionDefinition, Pose } from '../types';

const M = 'muscle-serratus-anterior';

/** Egy izomrész eredésének és tapadásának középpontja közti távolság az adott pózban. */
function span(motion: MotionDefinition, pose: Pose, structureId: string): number {
  const g = viewGeometries[motion.viewId]!;
  const t = computeFrameTransforms(g.frames, pose);
  const centre = (type: 'origin' | 'insertion') => {
    const pts = g.attachments.filter((a) => a.structureId === structureId && a.type === type).flatMap((a) => a.points.map((p) => toWorld(p, t)));
    expect(pts.length, `${motion.viewId} ${structureId} ${type}`).toBeGreaterThan(0);
    return { x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length };
  };
  const o = centre('origin');
  const i = centre('insertion');
  return Math.hypot(o.x - i.x, o.y - i.y);
}

describe('Elülső fűrészizom – Biomechanika', () => {
  const m = muscleById(M)!;
  const motions = m.motionIds.map((id) => motionById(id)!);

  it('minden funkciójához van animáció, létező nézettel, mozgással és forrásokkal', () => {
    expect(motions.map((x) => x.movementId)).toEqual(['scapular-protraction', 'scapular-upward-rotation', 'scapular-posterior-tilt', 'accessory-inspiration']);
    motions.forEach((x) => {
      expect(x.muscleId).toBe(M);
      expect(viewGeometries[x.viewId], x.id).toBeDefined();
      expect(movementById(x.movementId), x.id).toBeDefined();
      expect(x.roles.length, x.id).toBeGreaterThan(0);
      x.claims.flatMap((c) => c.sourceIds).forEach((id) => expect(sourceById(id), id).toBeDefined());
    });
  });

  it('a koncentrikus mozgásban az izom rövidül (az eredés és a tapadás közeledik)', () => {
    const cases: [string, string][] = [
      ['sa-protraction', M],
      ['sa-upward-rotation', 'muscle-serratus-anterior-inferior'],
      ['sa-posterior-tilt', 'muscle-serratus-anterior-inferior']
    ];
    cases.forEach(([id, part]) => {
      const x = motionById(id)!;
      expect(span(x, x.endPose, part), id).toBeLessThan(span(x, x.startPose, part) - 2);
    });
  });

  it('hátulnézetben a felfelé rotáció az alsó szöget oldalra viszi', () => {
    const x = motionById('sa-upward-rotation')!;
    const g = viewGeometries['posterior-girdle']!;
    const ins = g.attachments.find((a) => a.structureId === 'muscle-serratus-anterior-inferior' && a.type === 'insertion')!;
    const angle = ins.points[ins.points.length - 1]!;
    const before = toWorld(angle, computeFrameTransforms(g.frames, x.startPose));
    const after = toWorld(angle, computeFrameTransforms(g.frames, x.endPose));
    // A tükrözött hátulnézetben a vizsgált (jobb) oldal laterális iránya a nagyobb x.
    expect(after.x).toBeGreaterThan(before.x + 10);
  });

  it('belégzésnél a bordai eredések emelkednek, a lapockai tapadás nem mozdul', () => {
    const x = motionById('sa-accessory-inspiration')!;
    const g = viewGeometries[x.viewId]!;
    const t0 = computeFrameTransforms(g.frames, x.startPose);
    const t1 = computeFrameTransforms(g.frames, x.endPose);
    const origin = g.attachments.find((a) => a.structureId === 'muscle-serratus-anterior-inferior' && a.type === 'origin')!.points[0]!;
    expect(toWorld(origin, t1).y).toBeLessThan(toWorld(origin, t0).y);
    const shape = g.muscles.find((s) => s.structureId === 'muscle-serratus-anterior-inferior')!;
    const medial = shape.outline.find((p) => p.x < 190)!;
    expect(toWorld(medial, t1).y).toBeCloseTo(toWorld(medial, t0).y);
  });
});
