import { describe, expect, it } from 'vitest';
import { muscleById, muscleBySlug, muscleSections, muscles, structureById } from '../data/muscles';
import { viewGeometries } from '../data/geometry';
import { nerveById } from '../data/nerves/nerves';
import { sourceById } from '../data/sources/sources';
import { exercises } from '../data/exercises';

describe('Csuklyásizom – anatómiai adatlap', () => {
  const m = muscleById('muscle-trapezius')!;

  it('elérhető a meglévő azonosítóval, a „csuklyasizom” útvonalon, hátulnézettel', () => {
    expect(m.status).toBe('available');
    expect(muscleBySlug('csuklyasizom')?.id).toBe('muscle-trapezius');
    expect(m.defaultViewId).toBe('posterior');
    expect(m.atlasViewIds).toEqual(['posterior']);
    expect(m.motionIds).toEqual([]);
    expect(m.exerciseIds).toEqual([]);
  });

  it('három régiója van FIPAT-névvel, rostiránnyal, eredéssel és tapadással', () => {
    expect(m.regions.map((r) => r.name.la)).toEqual(['Pars descendens', 'Pars transversa', 'Pars ascendens']);
    m.regions.forEach((r) => {
      expect(r.fiberDirection, r.id).toBeDefined();
      [...r.origin.structureIds, ...r.insertion.structureIds].forEach((id) => expect(structureById(id), `${r.id}: ${id}`).toBeDefined());
    });
  });

  it('minden állítás forrása létezik és az izom forráslistáján szerepel', () => {
    const claims = [
      ...m.innervation,
      ...m.functions,
      ...m.stabilization,
      ...m.notes,
      ...(m.functionSections ?? []).flatMap((s) => s.claims),
      ...m.regions.flatMap((r) => [r.innervation, ...r.functions, ...(r.fiberDirection ? [r.fiberDirection] : [])]),
      ...[...m.origin, ...m.insertion, ...m.regions.flatMap((r) => [r.origin, r.insertion])]
    ];
    claims.flatMap((c) => c.sourceIds).forEach((id) => {
      expect(sourceById(id), id).toBeDefined();
      expect(m.sourceIds, id).toContain(id);
    });
    m.nerveIds.forEach((id) => expect(nerveById(id), id).toBeDefined());
    m.roles.forEach((r) => r.structureIds.forEach((id) => expect(structureById(id), id).toBeDefined()));
  });

  it('a felkar rotációját nem tanítja a csuklyásizom közvetlen funkciójaként', () => {
    const texts = [...m.functions, ...m.regions.flatMap((r) => r.functions)].map((c) => c.text);
    texts.forEach((t) => expect(t).not.toMatch(/(befelé|kifelé) forgat/));
  });

  it('a hátulnézetben mindhárom régió és az eredés–tapadás jelölés megvan; a rostirány a leírást követi', () => {
    const g = viewGeometries.posterior!;
    const shape = (id: string) => g.muscles.find((s) => s.structureId === id)!;
    m.regions.forEach((r) => {
      expect(shape(r.id), r.id).toBeDefined();
      expect(g.attachments.some((a) => a.structureId === r.id && a.type === 'origin'), r.id).toBe(true);
      expect(g.attachments.some((a) => a.structureId === r.id && a.type === 'insertion'), r.id).toBe(true);
    });
    // [eredés, tapadás] párok: a felső rostok lefelé, a középsők közel vízszintesen, az alsók felfelé futnak.
    const dir = (id: string) => shape(id).fibers.map(([o, i]) => ({ dx: Math.abs(i.x - o.x), dy: i.y - o.y }));
    dir('muscle-trapezius-descending').forEach((f) => expect(f.dy).toBeGreaterThan(0));
    dir('muscle-trapezius-transverse').forEach((f) => expect(Math.abs(f.dy)).toBeLessThan(f.dx * 0.25));
    dir('muscle-trapezius-ascending').forEach((f) => expect(f.dy).toBeLessThan(0));
    // A rombuszizmok és a lapockaemelő izom mély rétegként, a csuklyásizom alatt.
    ['muscle-rhomboids', 'muscle-levator-scapulae'].forEach((id) => expect(shape(id).layer).toBe('deep-muscles'));
    expect(g.landmarkLabels?.length).toBeGreaterThanOrEqual(5);
  });
});

describe('Felületes hátizmok – kezdőoldal és kapcsolódó modulok', () => {
  it('a szekció a megadott sorrendben mutatja a négy izmot; a csuklyásizmon kívül fejlesztés alatt', () => {
    const back = muscleSections.find((s) => s.id === 'superficial-back')!;
    expect(back.title).toBe('Felületes hátizmok');
    expect(back.muscleIds).toEqual(['muscle-trapezius', 'muscle-levator-scapulae', 'muscle-rhomboids', 'muscle-latissimus-dorsi']);
    expect(back.muscleIds.map((id) => muscleById(id)!.status)).toEqual(['available', 'planned', 'planned', 'planned']);
    expect(muscleById('muscle-rhomboids')!.memberIds).toEqual(['muscle-rhomboid-minor', 'muscle-rhomboid-major']);
    back.muscleIds.forEach((id) => expect(viewGeometries.posterior!.muscles.some((s) => s.structureId === id || s.structureId.startsWith(`${id}-`)), id).toBe(true));
  });

  it('a mellizommodulok csuklyásizom-hivatkozásai továbbra is feloldhatók', () => {
    const refs = [
      ...muscles.flatMap((x) => x.roles.flatMap((r) => r.structureIds)),
      ...exercises.flatMap((e) => Object.values(e.phaseRoles ?? {}).flat().flatMap((r) => r.structureIds))
    ].filter((id) => id.startsWith('muscle-trapezius'));
    expect(refs.length).toBeGreaterThan(5);
    refs.forEach((id) => expect(structureById(id), id).toBeDefined());
  });
});
