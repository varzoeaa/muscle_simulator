import { describe, expect, it } from 'vitest';
import { muscleById, structureById } from '../data/muscles';
import { viewGeometries } from '../data/geometry';
import { jointById, movementById } from '../data/joints/joints';
import { nerveById } from '../data/nerves/nerves';
import { sourceById } from '../data/sources/sources';
import { isStructureDrawn } from '../components/anatomy/AnatomyViewer';

describe('Kulcscsont alatti izom – anatómiai adatok', () => {
  const m = muscleById('muscle-subclavius')!;

  it('elérhető, és minden hivatkozott struktúra, ideg, ízület, mozgás és forrás létezik', () => {
    expect(m.status).toBe('available');
    [...m.origin, ...m.insertion].forEach((a) => a.structureIds.forEach((id) => expect(structureById(id), id).toBeDefined()));
    m.nerveIds.forEach((id) => expect(nerveById(id), id).toBeDefined());
    m.jointIds.forEach((id) => expect(jointById(id), id).toBeDefined());
    m.roles.forEach((r) => {
      expect(movementById(r.movementId), r.movementId).toBeDefined();
      r.structureIds.forEach((id) => expect(structureById(id), id).toBeDefined());
    });
    [...m.innervation, ...m.functions, ...m.stabilization, ...m.notes, ...m.roles, ...m.origin, ...m.insertion]
      .flatMap((c) => c.sourceIds)
      .forEach((id) => expect(sourceById(id), id).toBeDefined());
  });

  it('egy izom egy mozgásban csak egy szerepet kap (a szerepkör-színezés egyértelmű)', () => {
    new Set(m.roles.map((r) => r.movementId)).forEach((mv) => {
      const ids = m.roles.filter((r) => r.movementId === mv).flatMap((r) => r.structureIds);
      expect(new Set(ids).size, mv).toBe(ids.length);
    });
  });

  it('az elülső és az oldalnézetben látszik, eredése az 1. bordánál, tapadása a kulcscsont alatt van', () => {
    (['anterior', 'lateral'] as const).forEach((v) => {
      const g = viewGeometries[v]!;
      expect(isStructureDrawn(g, m.id), v).toBe(true);
      const o = g.attachments.find((a) => a.structureId === m.id && a.type === 'origin')!;
      const i = g.attachments.find((a) => a.structureId === m.id && a.type === 'insertion')!;
      // A tapadás (kulcscsont) magasabban van, mint az eredés (1. borda).
      const avgY = (pts: { y: number }[]) => pts.reduce((s, p) => s + p.y, 0) / pts.length;
      expect(avgY(i.points), v).toBeLessThan(avgY(o.points));
    });
  });
});

describe('Kulcscsont alatti izom – tudományos pontosítás', () => {
  const m = muscleById('muscle-subclavius')!;
  const allClaims = [...m.innervation, ...m.functions, ...m.stabilization, ...m.notes];

  it('minden új állítás forrása létezik, és az izom forráslistáján szerepel', () => {
    allClaims.flatMap((c) => c.sourceIds).forEach((id) => {
      expect(sourceById(id), id).toBeDefined();
      expect(m.sourceIds, id).toContain(id);
    });
  });

  it('az ízületi érintettség közvetlen (szegycsont-kulcscsonti) és közvetett (vállcsúcs-kulcscsonti) jelölésű', () => {
    expect(m.jointNotes?.['joint-sternoclavicular']).toMatch(/Közvetlen/);
    expect(m.jointNotes?.['joint-acromioclavicular']).toMatch(/Közvetett/);
  });

  it('a védőhatás és az izometria nem jelenik meg igazolt vagy „leggyakoribb” állításként', async () => {
    const { subclaviusMotions } = await import('../data/motions/subclaviusMotions');
    const texts = [m.summary, ...allClaims.map((c) => c.text), ...subclaviusMotions.flatMap((mo) => [mo.contraction.concentric.detail, mo.contraction.eccentric.detail, mo.contraction.isometric.detail])];
    texts.forEach((t) => {
      expect(t).not.toMatch(/leggyakoribb/);
      expect(t).not.toMatch(/meghaladja a külső ellenállást/);
    });
    expect(m.summary).toMatch(/lehetséges anatómiai védőréteg/);
  });

  it('a két süllyesztési animáció ugyanannak az iránynak két tartományát mutatja', async () => {
    const { subClavicularDepression, subGirdleDepression } = await import('../data/motions/subclaviusMotions');
    expect(subClavicularDepression.startPose.clavicleElevation).toBe(subGirdleDepression.startPose.clavicleElevation! + 14);
    expect(subClavicularDepression.endPose.clavicleElevation).toBe(subGirdleDepression.startPose.clavicleElevation);
    expect(subClavicularDepression.description).toMatch(/első tartománya/);
    expect(subGirdleDepression.description).toMatch(/második tartománya/);
  });
});
