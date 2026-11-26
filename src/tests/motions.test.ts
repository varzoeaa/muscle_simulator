import { describe, expect, it } from 'vitest';
import type { MotionDefinition } from '../types';
import { motions, motionById } from '../data/motions/pectoralisMajorMotions';
import { pectoralisMajor } from '../data/muscles/pectoralisMajor';
import { viewGeometries } from '../data/geometry';
import { GRIP } from '../data/geometry/anteriorVariants';
import { motionPose } from '../engines/animation/animationEngine';
import { computeFrameTransforms, toWorld } from '../utils/geometry';

/** Az eredési és a tapadási jelölés középpontjának távolsága az adott pózban. */
function originInsertionDistance(motion: MotionDefinition, structureId: string, t: number) {
  const g = viewGeometries[motion.viewId]!;
  const pose = motionPose(motion, t, 'concentric');
  const tr = computeFrameTransforms(g.frames, pose);
  const centre = (type: 'origin' | 'insertion') => {
    const att = g.attachments.find((a) => a.type === type && (a.structureId === structureId || structureId.startsWith(`${a.structureId}-`)))!;
    const pts = att.points.map((p) => toWorld(p, tr));
    return { x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length };
  };
  const o = centre('origin');
  const i = centre('insertion');
  return Math.hypot(o.x - i.x, o.y - i.y);
}

describe('A nagy mellizom funkcióinak animációi', () => {
  it('az Anatomy Labban felsorolt minden funkcióhoz tartozik mozgás', () => {
    const covered = new Set(pectoralisMajor.motionIds.map((id) => motionById(id)?.movementId));
    ['shoulder-adduction', 'shoulder-internal-rotation', 'shoulder-horizontal-adduction', 'shoulder-flexion', 'shoulder-extension', 'accessory-inspiration'].forEach((m) =>
      expect(covered.has(m as MotionDefinition['movementId']), m).toBe(true)
    );
    // Rögzített felkar: zárt láncú mozgás (a törzs mozog a kar felé).
    expect(pectoralisMajor.motionIds.map(motionById).some((m) => m?.solvePose)).toBe(true);
    expect(pectoralisMajor.motionIds.every((id) => !!motionById(id))).toBe(true);
  });

  it('minden mozgás nézetéhez van geometria, és a működési típusok érvényesek', () => {
    motions.forEach((m) => {
      expect(viewGeometries[m.viewId], m.id).toBeDefined();
      (m.contractionTypes ?? []).forEach((t) => expect(['concentric', 'eccentric', 'isometric']).toContain(t));
    });
  });

  it.each([
    ['pm-flexion', 'muscle-pectoralis-major-clavicular'],
    ['pm-extension', 'muscle-pectoralis-major-sternocostal'],
    ['pm-internal-rotation', 'muscle-pectoralis-major-sternocostal'],
    ['pm-closed-chain', 'muscle-pectoralis-major-sternocostal'],
    ['pm-accessory-inspiration', 'muscle-pectoralis-major-sternocostal']
  ])('%s: koncentrikus működésnél az agonista rész eredése és tapadása közeledik', (motionId, part) => {
    const m = motionById(motionId)!;
    expect(originInsertionDistance(m, part, 1)).toBeLessThan(originInsertionDistance(m, part, 0));
  });

  it('zárt lánc: a kéz a rúdon marad, a törzs emelkedik', () => {
    const m = motionById('pm-closed-chain')!;
    const g = viewGeometries[m.viewId]!;
    [0, 0.3, 0.7, 1].forEach((t) => {
      const pose = motionPose(m, t, 'concentric');
      const hand = toWorld({ frame: 'forearm', x: 0, y: 200 }, computeFrameTransforms(g.frames, pose));
      expect(hand.x).toBeCloseTo(GRIP.x, 3);
      expect(hand.y + (pose.trunkY ?? 0)).toBeCloseTo(GRIP.y, 3);
    });
    expect(motionPose(m, 1, 'concentric').trunkY!).toBeLessThan(motionPose(m, 0, 'concentric').trunkY!);
  });

  it('járulékos belégzés: a felkar nem mozdul, csak a mellkas', () => {
    const m = motionById('pm-accessory-inspiration')!;
    expect(m.contractionTypes).toEqual(['concentric']);
    expect(motionPose(m, 0, 'concentric').shoulderAbduction).toBe(motionPose(m, 1, 'concentric').shoulderAbduction);
    expect(motionPose(m, 1, 'concentric').ribLift).toBeLessThan(0);
  });
});
