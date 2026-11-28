import { describe, expect, it } from 'vitest';
import { muscleById, structureById } from '../data/muscles';
import { viewGeometries } from '../data/geometry';
import { jointById, movementById } from '../data/joints/joints';
import { nerveById } from '../data/nerves/nerves';
import { sourceById } from '../data/sources/sources';
import { isStructureDrawn } from '../components/anatomy/AnatomyViewer';

describe('Kis mellizom – anatómiai adatok', () => {
  const m = muscleById('muscle-pectoralis-minor')!;

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

  it('az elülső nézetben látszik, és van eredése (bordák) és tapadása (hollócsőrnyúlvány)', () => {
    const g = viewGeometries.anterior!;
    expect(isStructureDrawn(g, m.id)).toBe(true);
    expect(g.attachments.some((a) => a.structureId === m.id && a.type === 'origin')).toBe(true);
    const ins = g.attachments.find((a) => a.structureId === m.id && a.type === 'insertion')!;
    // A tapadás a hollócsőrnyúlványon van: ugyanott, ahol a hollócsőr-karizom ered.
    const cb = g.muscles.find((x) => x.structureId === 'muscle-coracobrachialis')!;
    const cbOrigin = cb.outline[0]!;
    ins.points.forEach((p) => expect(Math.hypot(p.x - cbOrigin.x, p.y - cbOrigin.y)).toBeLessThan(15));
  });

  it('minden mozgáshoz van agonista, és maga a kis mellizom szerepel a szerepek között', () => {
    const movements = [...new Set(m.roles.map((r) => r.movementId))];
    movements.forEach((mv) => expect(m.roles.some((r) => r.movementId === mv && r.role === 'agonist'), mv).toBe(true));
    movements.forEach((mv) => expect(m.roles.some((r) => r.movementId === mv && r.structureIds.includes(m.id)), mv).toBe(true));
  });
});
