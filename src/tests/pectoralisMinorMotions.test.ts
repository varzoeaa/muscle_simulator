import { describe, expect, it } from 'vitest';
import type { MotionDefinition } from '../types';
import { pectoralisMinorMotions } from '../data/motions/pectoralisMinorMotions';
import { motionById } from '../data/motions';
import { pectoralisMinor } from '../data/muscles/pectoralisMinor';
import { viewGeometries } from '../data/geometry';
import { motionPose } from '../engines/animation/animationEngine';
import { computeFrameTransforms, toWorld } from '../utils/geometry';

const M = 'muscle-pectoralis-minor';

/** A kis mellizom eredési és tapadási jelölésének középpontja közti távolság az adott pózban. */
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

describe('A kis mellizom mozgásanimációi', () => {
  it('az Anatomy Labban felsorolt minden lapockamozgáshoz és a belégzéshez tartozik animáció', () => {
    const covered = new Set(pectoralisMinor.motionIds.map((id) => motionById(id)?.movementId));
    new Set(pectoralisMinor.roles.map((r) => r.movementId)).forEach((m) => expect(covered.has(m), m).toBe(true));
  });

  it.each(pectoralisMinorMotions.map((m) => [m.id, m] as const))('%s: koncentrikus működésnél az eredés és a tapadás közeledik', (_, m) => {
    expect(length(m, 1)).toBeLessThan(length(m, 0) - 2);
  });

  it('minden mozgás nézetében a kis mellizom ki van rajzolva, és minden pont létező frame-hez tartozik', () => {
    pectoralisMinorMotions.forEach((m) => {
      const g = viewGeometries[m.viewId]!;
      const frames = new Set(['world', ...g.frames.map((f) => f.id)]);
      expect(g.muscles.some((x) => x.structureId === M), m.id).toBe(true);
      g.muscles.forEach((x) => x.outline.forEach((p) => expect(frames.has(p.frame), `${m.viewId}: ${x.structureId}`).toBe(true)));
      g.bones.forEach((b) => expect(frames.has(b.frame), `${m.viewId}: ${b.structureId}`).toBe(true));
    });
  });

  it('alaphelyzetben a mozgó vállövű nézetek pontosan fedik az eredeti nézetet (localOrigin)', () => {
    const pairs: [string, string, Record<string, number>][] = [
      ['anterior-girdle', 'anterior', { shoulderAbduction: 12 }],
      ['superior-girdle', 'superior', { shoulderHorizontalAbduction: 60 }],
      ['lateral-girdle', 'lateral', { shoulderFlexion: 0 }]
    ];
    pairs.forEach(([a, b, pose]) => {
      const ga = viewGeometries[a as 'anterior-girdle']!;
      const gb = viewGeometries[b as 'anterior']!;
      const ta = computeFrameTransforms(ga.frames, pose);
      const tb = computeFrameTransforms(gb.frames, pose);
      const ma = ga.muscles.find((x) => x.structureId === M)!;
      const mb = gb.muscles.find((x) => x.structureId === M)!;
      ma.outline.forEach((p, i) => {
        const pa = toWorld(p, ta);
        const pb = toWorld(mb.outline[i]!, tb);
        expect(pa.x).toBeCloseTo(pb.x, 6);
        expect(pa.y).toBeCloseTo(pb.y, 6);
      });
    });
  });

  it('süllyesztéskor a hollócsőrnyúlvány lefelé, protrakciókor előre mozdul', () => {
    const coracoid = (m: MotionDefinition, t: number) => {
      const g = viewGeometries[m.viewId]!;
      const ins = g.attachments.find((a) => a.structureId === M && a.type === 'insertion')!;
      return toWorld(ins.points[0]!, computeFrameTransforms(g.frames, motionPose(m, t, 'concentric')));
    };
    const dep = motionById('pmi-depression')!;
    expect(coracoid(dep, 1).y).toBeGreaterThan(coracoid(dep, 0).y);
    // Felülnézetben lent van az elülső (ventrális) oldal.
    const pro = motionById('pmi-protraction')!;
    expect(coracoid(pro, 1).y).toBeGreaterThan(coracoid(pro, 0).y);
  });
});
