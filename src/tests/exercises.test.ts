import { describe, expect, it } from 'vitest';
import { exercises } from '../data/exercises';
import { pectoralisMajor } from '../data/muscles/pectoralisMajor';
import { structureById } from '../data/muscles';
import { sourceById } from '../data/sources/sources';
import { cycleDepth, phaseAt } from '../engines/animation/animationEngine';
import { DIPS, PUSH_UP, solveSagittal } from '../engines/animation/sagittalKinematics';
import { applyMatrix } from '../utils/geometry';

describe('A nagy mellizom gyakorlatai', () => {
  it('minden gyakorlat elérhető az izom adatlapjáról, és mind a kilenc létezik', () => {
    expect(pectoralisMajor.exerciseIds).toHaveLength(9);
    pectoralisMajor.exerciseIds.forEach((id) => expect(exercises.some((e) => e.id === id), id).toBe(true));
  });

  it.each(exercises.map((e) => [e.id, e] as const))('%s: szakaszok, szerepek, struktúrák és források érvényesek', (_, e) => {
    // A szakaszok lefedik a ciklust, típusuk egyedi.
    expect(e.phases[0]!.from).toBe(0);
    expect(e.phases[e.phases.length - 1]!.to).toBe(1);
    expect(new Set(e.phases.map((p) => p.type)).size).toBe(e.phases.length);
    e.phases.forEach((p) => expect(phaseAt(e.phases, p.from)!.type).toBe(p.type));
    // Minden nem izometriás szakaszhoz van szereplista.
    e.phases.filter((p) => p.type !== 'isometric').forEach((p) => expect(e.phaseRoles?.[p.type]?.length, `${e.id} ${p.type}`).toBeGreaterThan(0));
    Object.values(e.phaseRoles ?? {})
      .flat()
      .forEach((r) => {
        r.structureIds.forEach((id) => expect(structureById(id), `${e.id}: ${id}`).toBeDefined());
        expect(r.sourceIds.length).toBeGreaterThan(0);
        r.sourceIds.forEach((id) => expect(sourceById(id), id).toBeDefined());
      });
    // A „mélység” a ciklus elején és végén azonos (folyamatos ismétlés).
    expect(cycleDepth(e.phases, 0)).toBeCloseTo(cycleDepth(e.phases, 0.9999), 2);
  });

  it('mozgató gyakorlatoknál az agonisták excentrikusan hosszabbodnak, koncentrikusan rövidülnek; nyújtásnál nincs agonista', () => {
    exercises.forEach((e) => {
      const ecc = e.phaseRoles?.eccentric?.filter((r) => r.role === 'agonist') ?? [];
      const con = e.phaseRoles?.concentric?.filter((r) => r.role === 'agonist') ?? [];
      ecc.forEach((r) => expect(r.lengthChange, e.id).toBe('lengthening'));
      con.forEach((r) => expect(r.lengthChange, e.id).toBe('shortening'));
      expect(ecc.flatMap((r) => r.structureIds)).toEqual(con.flatMap((r) => r.structureIds));
    });
    const stretch = exercises.find((e) => e.id === 'pectoral-stretch')!;
    const all = Object.values(stretch.phaseRoles!).flat();
    expect(all.some((r) => r.role === 'agonist')).toBe(false);
    expect(all.find((r) => r.role === 'stretched' && r.structureIds.includes('muscle-pectoralis-major'))).toBeDefined();
  });
});

describe('Oldalnézeti kinematika', () => {
  it('fekvőtámasz: a kéz és a lábujj a talajon marad, a váll ereszkedik', () => {
    [0, 0.5, 1].forEach((d) => {
      const s = solveSagittal('push-up', d);
      expect(s.hand.x).toBeCloseTo(PUSH_UP.hand.x, 6);
      expect(s.hand.y).toBeCloseTo(PUSH_UP.hand.y, 6);
      expect(applyMatrix(s.transforms.torso!, PUSH_UP.toeLocal.x, PUSH_UP.toeLocal.y).y).toBeCloseTo(PUSH_UP.hand.y, 6);
    });
    expect(solveSagittal('push-up', 1).shoulder.y).toBeGreaterThan(solveSagittal('push-up', 0).shoulder.y);
  });

  it('tolódzkodás: a kéz a korláton marad, a váll ereszkedik és előre kerül a könyökhöz képest', () => {
    const top = solveSagittal('dips', 0);
    const bottom = solveSagittal('dips', 1);
    [top, bottom].forEach((s) => expect(s.hand).toEqual(DIPS.grip));
    expect(bottom.shoulder.y).toBeGreaterThan(top.shoulder.y);
    expect(bottom.shoulder.x - bottom.elbow.x).toBeGreaterThan(top.shoulder.x - top.elbow.x);
  });

  it('gépes mellnyomás: a kéz vízszintes pályán, a törzs előtt mozog', () => {
    const a = solveSagittal('machine-press', 0);
    const b = solveSagittal('machine-press', 1);
    expect(a.hand.x).toBeGreaterThan(b.hand.x);
    expect(Math.abs(a.hand.y - b.hand.y)).toBeLessThan(Math.abs(a.hand.x - b.hand.x) * 0.3);
    expect(b.hand.x).toBeGreaterThan(b.shoulder.x);
  });
});
