import { describe, expect, it } from 'vitest';
import { muscleById, structureById } from '../data/muscles';
import { viewGeometries } from '../data/geometry';
import { jointById, movementById } from '../data/joints/joints';
import { nerveById } from '../data/nerves/nerves';
import { sourceById } from '../data/sources/sources';
import { isStructureDrawn } from '../components/anatomy/AnatomyViewer';

describe('Elülső fűrészizom – anatómiai adatok', () => {
  const m = muscleById('muscle-serratus-anterior')!;

  it('elérhető, és minden hivatkozott struktúra, ideg, ízület, mozgás és forrás létezik', () => {
    expect(m.status).toBe('available');
    const attachments = [...m.origin, ...m.insertion, ...m.regions.flatMap((r) => [r.origin, r.insertion])];
    attachments.forEach((a) => a.structureIds.forEach((id) => expect(structureById(id), id).toBeDefined()));
    m.nerveIds.forEach((id) => expect(nerveById(id), id).toBeDefined());
    m.jointIds.forEach((id) => expect(jointById(id), id).toBeDefined());
    m.roles.forEach((r) => {
      expect(movementById(r.movementId), r.movementId).toBeDefined();
      r.structureIds.forEach((id) => expect(structureById(id), id).toBeDefined());
    });
    [...m.innervation, ...m.functions, ...m.stabilization, ...m.notes, ...m.roles, ...attachments, ...m.regions.flatMap((r) => [r.innervation, ...r.functions])]
      .flatMap((c) => c.sourceIds)
      .forEach((id) => expect(sourceById(id), id).toBeDefined());
  });

  it('három része van (felső, középső, alsó), mind a regiszterben', () => {
    expect(m.regions.map((r) => r.id)).toEqual(['muscle-serratus-anterior-superior', 'muscle-serratus-anterior-intermediate', 'muscle-serratus-anterior-inferior']);
    m.regions.forEach((r) => expect(structureById(r.id)?.name.hu).toBe(r.name.hu));
  });

  it('a beidegzés a hosszú mellkasi ideg (C5–C7)', () => {
    expect(m.nerveIds).toEqual(['nerve-long-thoracic']);
    expect(nerveById('nerve-long-thoracic')?.roots).toBe('C5–C7');
  });

  it('egy izom egy mozgásban csak egy szerepet kap (a szerepkör-színezés egyértelmű)', () => {
    new Set(m.roles.map((r) => r.movementId)).forEach((mv) => {
      const ids = m.roles.filter((r) => r.movementId === mv).flatMap((r) => r.structureIds);
      expect(new Set(ids).size, mv).toBe(ids.length);
    });
  });

  it('a protrakció és a felfelé rotáció agonistája', () => {
    (['scapular-protraction', 'scapular-upward-rotation'] as const).forEach((mv) =>
      expect(m.roles.some((r) => r.movementId === mv && r.role === 'agonist' && r.structureIds.includes(m.id)), mv).toBe(true)
    );
  });

  it('oldalnézetben mindhárom rész eredése elöl (bordák), tapadása hátul (lapocka belső széle) van', () => {
    const g = viewGeometries.lateral!;
    m.regions.forEach((r) => {
      expect(isStructureDrawn(g, r.id), r.id).toBe(true);
      const o = g.attachments.find((a) => a.structureId === r.id && a.type === 'origin')!;
      const i = g.attachments.find((a) => a.structureId === r.id && a.type === 'insertion')!;
      const avgX = (pts: { x: number }[]) => pts.reduce((s, p) => s + p.x, 0) / pts.length;
      // Oldalnézetben jobbra van az elülső oldal.
      expect(avgX(o.points), r.id).toBeGreaterThan(avgX(i.points));
    });
  });

  it('elöl- és felülnézetben is látszik, a mozgó vállövű nézetekben a tapadás a lapockával mozog', () => {
    (['anterior', 'superior'] as const).forEach((v) => expect(isStructureDrawn(viewGeometries[v]!, m.id), v).toBe(true));
    viewGeometries['lateral-girdle']!.attachments
      .filter((a) => a.structureId.startsWith(m.id) && a.type === 'insertion')
      .forEach((a) => a.points.forEach((p) => expect(p.frame).toBe('scapula')));
    viewGeometries['superior-girdle']!.attachments
      .filter((a) => a.structureId.startsWith(m.id) && a.type === 'insertion')
      .forEach((a) => a.points.forEach((p) => expect(p.frame).toBe('scapula')));
  });
});

describe('Elülső fűrészizom – tudományos pontosítás (fekvőtámasz plusz, stabilizálás)', () => {
  it('a q-pm2-stab-plus kérdés a protrakció fő mozgatójára kérdez, és a válasz a fűrészizom', async () => {
    const { questions } = await import('../data/questions');
    const q = questions.find((x) => x.id === 'q-pm2-stab-plus')!;
    expect(q.type).toBe('multiple-choice');
    if (q.type !== 'multiple-choice') return;
    expect(q.prompt).toMatch(/fő mozgatója/);
    expect(q.prompt).not.toMatch(/leginkább/);
    expect(q.options.find((o) => o.id === q.correctOptionId)!.text).toMatch(/elülső fűrészizom/i);
  });

  it('a Ludewig-állítások nem állítanak teljes izomaktivitási rangsort', async () => {
    const { questions, flashcards } = await import('../data/questions');
    const texts = [...questions, ...flashcards]
      .filter((x) => x.sourceIds.includes('ludewig-2004'))
      .map((x) => JSON.stringify(x));
    texts.forEach((t) => expect(t).not.toMatch(/dolgozik leginkább|legnagyobb aktivitását/));
  });

  it('a közös stabilizáló sorok különválasztják a felkarcsontfejet és a lapockát', async () => {
    const { exercises } = await import('../data/exercises');
    exercises.forEach((e) =>
      Object.values(e.phaseRoles ?? {})
        .flat()
        .filter((r) => r.role === 'stabilizer' && r.structureIds.includes('muscle-serratus-anterior'))
        .forEach((r) => {
          expect(r.structureIds, `${e.id}: ${r.joint}`).not.toContain('muscle-rotator-cuff');
          expect(r.joint, e.id).not.toMatch(/felkarcsontfej/);
        })
    );
  });

  it('a fekvőtámasz plusz hosszváltozási szerepei a modell feltevéseként jelöltek', async () => {
    const { exercises } = await import('../data/exercises');
    const e = exercises.find((x) => x.id === 'push-up-plus')!;
    Object.values(e.phaseRoles ?? {})
      .flat()
      .filter((r) => r.structureIds.includes('muscle-serratus-anterior'))
      .forEach((r) => expect(r.evidence).toBe('educational-model'));
  });
});
