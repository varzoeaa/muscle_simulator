import { describe, expect, it } from 'vitest';
import { muscles, structureById } from '../data/muscles';
import { pectoralisMajor } from '../data/muscles/pectoralisMajor';
import { sources, sourceById } from '../data/sources/sources';
import { viewGeometries } from '../data/geometry';
import { motions } from '../data/motions';
import { exercises } from '../data/exercises';
import { flashcards, questions } from '../data/questions';

const allSourceIdsIn = (obj: unknown): string[] => {
  const out: string[] = [];
  const walk = (v: unknown) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') {
      Object.entries(v).forEach(([k, val]) => {
        if (k === 'sourceIds' && Array.isArray(val)) out.push(...(val as string[]));
        else walk(val);
      });
    }
  };
  walk(obj);
  return out;
};

describe('Anatómiai adatmodellek validálása', () => {
  it('a négy felületes mellizom szerepel, a nagy mellizom elérhető', async () => {
    const { muscleSections } = await import('../data/muscles');
    expect(muscleSections.find((x) => x.id === 'superficial-chest')!.muscleIds).toEqual([
      'muscle-pectoralis-major',
      'muscle-pectoralis-minor',
      'muscle-subclavius',
      'muscle-serratus-anterior'
    ]);
    muscleSections.flatMap((x) => x.muscleIds).forEach((id) => expect(muscles.some((m) => m.id === id), id).toBe(true));
    expect(pectoralisMajor.status).toBe('available');
  });

  it('a nagy mellizom három része külön szerepel, eredéssel, tapadással és beidegzéssel', () => {
    expect(pectoralisMajor.regions.map((r) => r.id)).toEqual([
      'muscle-pectoralis-major-clavicular',
      'muscle-pectoralis-major-sternocostal',
      'muscle-pectoralis-major-abdominal'
    ]);
    pectoralisMajor.regions.forEach((r) => {
      expect(r.origin.type).toBe('origin');
      expect(r.insertion.type).toBe('insertion');
      expect(r.innervation.sourceIds.length).toBeGreaterThan(0);
      expect(r.name.la).toMatch(/^Pars /);
    });
  });

  it('minden hivatkozott forrás létezik, és nincs duplikált forrásazonosító', () => {
    const ids = sources.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    const referenced = [...allSourceIdsIn(muscles), ...allSourceIdsIn(motions), ...allSourceIdsIn(exercises), ...allSourceIdsIn(questions), ...allSourceIdsIn(flashcards)];
    referenced.forEach((id) => expect(sourceById(id), `ismeretlen forrás: ${id}`).toBeDefined());
  });

  it('a DOI-val rendelkező források online ellenőrzöttek', () => {
    sources.filter((s) => s.doi).forEach((s) => expect(s.verification).toBe('verified-online'));
  });

  it('minden szerepkörben és geometriában hivatkozott struktúra ismert', () => {
    const ids = [
      ...pectoralisMajor.roles.flatMap((r) => r.structureIds),
      ...motions.flatMap((m) => m.roles.flatMap((r) => r.structureIds)),
      ...exercises.flatMap((e) => [...e.primaryMovers, ...e.secondaryMovers, ...e.stabilizers]),
      ...Object.values(viewGeometries).flatMap((g) => [...g!.muscles.map((m) => m.structureId), ...g!.bones.map((b) => b.structureId), ...g!.joints.map((j) => j.structureId)])
    ];
    ids.forEach((id) => expect(structureById(id), `ismeretlen struktúra: ${id}`).toBeDefined());
  });

  it('a geometriában minden pont létező frame-re hivatkozik', () => {
    Object.values(viewGeometries).forEach((g) => {
      const frames = new Set(['world', ...g!.frames.map((f) => f.id)]);
      g!.muscles.forEach((m) => [...m.outline, ...m.fibers.flat()].forEach((p) => expect(frames.has(p.frame)).toBe(true)));
      g!.attachments.forEach((a) => a.points.forEach((p) => expect(frames.has(p.frame)).toBe(true)));
    });
  });

  it('a kérdések belsőleg konzisztensek', () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    questions.forEach((q) => {
      if (q.type === 'multiple-choice') expect(q.options.some((o) => o.id === q.correctOptionId)).toBe(true);
      if (q.type === 'fill-blank') {
        expect(q.options).toContain(q.answer);
        expect(q.text).toContain('___');
      }
      if (q.type === 'diagram-identify') q.correctStructureIds.forEach((id) => expect(q.selectableStructureIds).toContain(id));
      if (q.type === 'matching') expect(q.pairs.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('a gyakorlat szakaszai lefedik a teljes ciklust', () => {
    exercises.forEach((e) => {
      expect(e.phases[0]!.from).toBe(0);
      expect(e.phases[e.phases.length - 1]!.to).toBe(1);
      e.phases.slice(1).forEach((p, i) => expect(p.from).toBeCloseTo(e.phases[i]!.to));
    });
  });
});

describe('Fekvenyomás: izomszerepek szakaszonként', () => {
  it('excentrikus és koncentrikus szakaszra is van agonista, antagonista, szinergista és stabilizáló, ismert izmokkal és forrással', async () => {
    const { benchPress } = await import('../data/exercises/benchPress');
    const { structureById } = await import('../data/muscles');
    const { sourceById } = await import('../data/sources/sources');
    (['eccentric', 'concentric'] as const).forEach((type) => {
      const roles = benchPress.phaseRoles?.[type] ?? [];
      (['agonist', 'synergist', 'antagonist', 'stabilizer'] as const).forEach((r) => expect(roles.some((x) => x.role === r), `${type} ${r}`).toBe(true));
      roles.forEach((r) => {
        r.structureIds.forEach((id) => expect(structureById(id), id).toBeDefined());
        expect(r.sourceIds.length).toBeGreaterThan(0);
        r.sourceIds.forEach((id) => expect(sourceById(id), id).toBeDefined());
      });
    });
    // Az agonisták nem cserélődnek: excentrikusan hosszabbodnak, koncentrikusan rövidülnek.
    const ag = (t: 'eccentric' | 'concentric') => benchPress.phaseRoles![t]!.filter((r) => r.role === 'agonist');
    expect(ag('eccentric').flatMap((r) => r.structureIds)).toEqual(ag('concentric').flatMap((r) => r.structureIds));
    expect(ag('eccentric').every((r) => r.lengthChange === 'lengthening')).toBe(true);
    expect(ag('concentric').every((r) => r.lengthChange === 'shortening')).toBe(true);
  });
});
