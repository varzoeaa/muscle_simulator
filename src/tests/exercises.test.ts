import { describe, expect, it } from 'vitest';
import { exercises } from '../data/exercises';
import { pectoralisMajor } from '../data/muscles/pectoralisMajor';
import { structureById } from '../data/muscles';
import { sourceById } from '../data/sources/sources';
import { cycleDepth, phaseAt } from '../engines/animation/animationEngine';
import { DIPS, PUSH_UP, solveSagittal } from '../engines/animation/sagittalKinematics';
import { applyMatrix } from '../utils/geometry';

describe('A nagy mellizom gyakorlatai', () => {
  it('minden gyakorlat elérhető az izom adatlapjáról, és mind a tíz létezik', () => {
    expect(pectoralisMajor.exerciseIds).toHaveLength(10);
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

describe('Fekvenyomás-változatok különbségei', () => {
  it('a csúszka minden dőlésszögéhez pontosan egy padtípus tartozik, a példaszögek a saját zónájukba esnek', async () => {
    const { angleZones, angleZoneFor } = await import('../data/exercises/benchVariants');
    for (let a = -15; a <= 60; a++) expect(angleZones.filter((z) => a >= z.range[0] && a <= z.range[1]), `${a}°`).toHaveLength(1);
    angleZones.forEach((z) => expect(angleZoneFor(z.example).id).toBe(z.id));
    expect(angleZoneFor(0).id).toBe('flat');
    expect(angleZoneFor(30).id).toBe('incline');
  });

  it('minden állításnak és összehasonlító sornak van létező forrása, és a fekvenyomás-gyakorlatok forráslistáján is szerepel', async () => {
    const { angleZones, implementRows, angleCommonFinding } = await import('../data/exercises/benchVariants');
    const ids = [...angleZones.flatMap((z) => z.findings), angleCommonFinding, ...implementRows].flatMap((c) => c.sourceIds);
    ids.forEach((id) => expect(sourceById(id), id).toBeDefined());
    ['barbell-bench-press', 'dumbbell-bench-press'].forEach((eid) => {
      const e = exercises.find((x) => x.id === eid)!;
      ids.forEach((id) => expect(e.sourceIds, `${eid}: ${id}`).toContain(id));
    });
  });
});

describe('Tárogatás-változatok különbségei', () => {
  it('a tárogatás csúszkájának minden dőlésszögéhez egy padtípus tartozik, és a kiinduló vállhajlítás a dőléssel nő', async () => {
    const { flyAngleZones, flyStartFlexion } = await import('../data/exercises/flyVariants');
    const fly = exercises.find((e) => e.id === 'dumbbell-fly')!;
    const { min, max } = fly.parameters.benchAngle!;
    for (let a = min; a <= max; a++) expect(flyAngleZones.filter((z) => a >= z.range[0] && a <= z.range[1]), `${a}°`).toHaveLength(1);
    expect(flyStartFlexion(0)).toBe(90);
    expect(flyStartFlexion(30)).toBeGreaterThan(flyStartFlexion(0));
    expect(flyStartFlexion(-15)).toBeLessThan(flyStartFlexion(0));
  });

  it('kézisúlyzónál az ellenállás zárt karnál közel nulla, nyitott karnál a legnagyobb; gépnél zárt karnál is van', async () => {
    const { relativeMoment } = await import('../data/exercises/flyVariants');
    expect(relativeMoment('dumbbell', 0)).toBeCloseTo(0, 6);
    expect(relativeMoment('dumbbell', 90)).toBeCloseTo(1, 6);
    expect(relativeMoment('dumbbell', 45)).toBeLessThan(relativeMoment('dumbbell', 80));
    expect(relativeMoment('machine', 0)).toBeGreaterThan(0);
  });

  it('a tárogatás-összehasonlítás forrásai léteznek, és mindkét gyakorlat forráslistáján szerepelnek', async () => {
    const { flyAngleZones, flyMachineRows } = await import('../data/exercises/flyVariants');
    const ids = [...flyAngleZones.flatMap((z) => z.findings), ...flyMachineRows].flatMap((c) => c.sourceIds);
    ['dumbbell-fly', 'pec-deck'].forEach((eid) => ids.forEach((id) => expect(exercises.find((e) => e.id === eid)!.sourceIds).toContain(id)));
    flyMachineRows.forEach((r) => expect(Object.keys(r.values).sort()).toEqual(['dumbbell', 'machine']));
  });
});

describe('Gépes tárogatás: ülésmagasság', () => {
  it('a karmagasság csúszkájának minden értékéhez egy zóna tartozik, a vállmagasság 90°, és a forrásai a pec deck forráslistáján vannak', async () => {
    const { pecDeckHeightZones, pecDeckArmAngle } = await import('../data/exercises/flyVariants');
    const pec = exercises.find((e) => e.id === 'pec-deck')!;
    const { min, max } = pec.parameters.armElevation!;
    for (let a = min; a <= max; a++) expect(pecDeckHeightZones.filter((z) => a >= z.range[0] && a <= z.range[1]), `${a}°`).toHaveLength(1);
    pecDeckHeightZones.forEach((z) => expect(z.example).toBeGreaterThanOrEqual(min));
    expect(pecDeckArmAngle(0)).toBe(90);
    expect(pecDeckArmAngle(15)).toBeGreaterThan(90);
    pecDeckHeightZones.flatMap((z) => z.findings).flatMap((c) => c.sourceIds).forEach((id) => expect(pec.sourceIds).toContain(id));
  });
});

describe('Csigás keresztbehúzás: csigamagasság', () => {
  it('a húzásirány csúszkájának minden értékéhez egy zóna tartozik, és a forrásai a gyakorlat forráslistáján vannak', async () => {
    const { cablePulleyZones, cableFinishText } = await import('../data/exercises/flyVariants');
    const cable = exercises.find((e) => e.id === 'cable-crossover')!;
    const { min, max } = cable.parameters.pulleyAngle!;
    for (let a = min; a <= max; a++) expect(cablePulleyZones.filter((z) => a >= z.range[0] && a <= z.range[1]), `${a}°`).toHaveLength(1);
    cablePulleyZones.forEach((z) => expect(z.example >= min && z.example <= max).toBe(true));
    expect(cableFinishText(20)).not.toBe(cableFinishText(-20));
    cablePulleyZones
      .flatMap((z) => z.findings)
      .forEach((c) => {
        c.sourceIds.forEach((id) => expect(cable.sourceIds).toContain(id));
      });
  });
});

describe('Fekvőtámasz-változatok', () => {
  it('kéz- és lábalátámasztásnál a kéz és a lábujj (térdelőnél a térd) a támaszon marad, és az alkar függőleges', async () => {
    const { solvePushUp, PUSH_UP, PX_PER_CM } = await import('../engines/animation/sagittalKinematics');
    const { pushUpPresets } = await import('../data/exercises/pushUpVariants');
    pushUpPresets.forEach(({ id, options }) =>
      [0, 0.5, 1].forEach((d) => {
        const s = solvePushUp(d, options);
        expect(s.hand.x, id).toBeCloseTo(PUSH_UP.hand.x, 6);
        expect(s.hand.y, id).toBeCloseTo(PUSH_UP.hand.y - options.handCm * PX_PER_CM, 6);
        expect(s.contact.y, id).toBeCloseTo(PUSH_UP.hand.y - (options.knees ? 0 : options.feetCm) * PX_PER_CM, 3);
        expect(Math.abs(s.elbow.x - s.hand.x), id).toBeLessThan(0.01);
        expect(s.elbow.y, id).toBeLessThan(s.hand.y);
      })
    );
  });

  it('kézemelésnél a test meredekebb, lábemelésnél laposabb; a terhelés iránya az Ebben-féle sorrendet követi', async () => {
    const { solvePushUp } = await import('../engines/animation/sagittalKinematics');
    const { loadLevel } = await import('../data/exercises/pushUpVariants');
    const tilt = (handCm: number, feetCm: number) => solvePushUp(0, { handCm, feetCm, knees: false }).tilt;
    expect(tilt(60, 0)).toBeGreaterThan(tilt(30, 0));
    expect(tilt(30, 0)).toBeGreaterThan(tilt(0, 0));
    expect(tilt(0, 30)).toBeLessThan(tilt(0, 0));
    expect(tilt(0, 60)).toBeLessThan(tilt(0, 30));
    expect(loadLevel({ handCm: 0, feetCm: 30, knees: false })).toBe('higher');
    expect(loadLevel({ handCm: 30, feetCm: 0, knees: false })).toBe('lower');
    expect(loadLevel({ handCm: 0, feetCm: 0, knees: true })).toBe('lower');
    expect(loadLevel({ handCm: 0, feetCm: 0, knees: false })).toBe('reference');
  });

  it('minden fekvőtámasz-állítás forrása létezik és szerepel a gyakorlat forráslistáján', async () => {
    const v = await import('../data/exercises/pushUpVariants');
    const pu = exercises.find((e) => e.id === 'push-up')!;
    const claims = [...v.supportFindings, ...v.pushUpPlusFindings, ...v.handWidths.flatMap((h) => h.findings), ...v.pushUpPresets.flatMap((p) => v.tiltExplanation(p.options))];
    claims.flatMap((c) => c.sourceIds).forEach((id) => {
      expect(sourceById(id), id).toBeDefined();
      expect(pu.sourceIds).toContain(id);
    });
  });
});

describe('Tolódzkodás-változatok', () => {
  it('minden változatnál a kéz a támaszon marad, és a vállfeszítés sorrendje: pad > korlát > gyűrű', async () => {
    const { solveDips, DIPS, DIP_VARIANTS, dipShoulderExtension } = await import('../engines/animation/sagittalKinematics');
    (['bench', 'bar', 'ring'] as const).forEach((variant) =>
      [0, 0.5, 1].forEach((d) => expect(solveDips(d, { variant, lean: DIP_VARIANTS[variant].defaultLean }).hand).toEqual(DIPS.grip))
    );
    const ext = (variant: 'bench' | 'bar' | 'ring') => dipShoulderExtension({ variant, lean: DIP_VARIANTS[variant].defaultLean });
    expect(ext('bench')).toBeGreaterThan(ext('bar'));
    expect(ext('bar')).toBeGreaterThan(ext('ring'));
  });

  it('nagyobb törzsdőlésnél kisebb a vállfeszítés, a váll mégis ereszkedik', async () => {
    const { solveDips, dipShoulderExtension } = await import('../engines/animation/sagittalKinematics');
    expect(dipShoulderExtension({ variant: 'bar', lean: 35 })).toBeLessThan(dipShoulderExtension({ variant: 'bar', lean: 5 }));
    [5, 35].forEach((lean) => expect(solveDips(1, { variant: 'bar', lean }).shoulder.y).toBeGreaterThan(solveDips(0, { variant: 'bar', lean }).shoulder.y));
  });

  it('a tolódzkodás-állítások forrásai léteznek és a gyakorlat forráslistáján vannak', async () => {
    const v = await import('../data/exercises/dipVariants');
    const dip = exercises.find((e) => e.id === 'dips')!;
    [...v.dipVariantRows, ...v.dipFatigueFindings, ...v.dipLeanClaims(5), ...v.dipLeanClaims(35)]
      .flatMap((c) => c.sourceIds)
      .forEach((id) => {
        expect(sourceById(id), id).toBeDefined();
        expect(dip.sourceIds).toContain(id);
      });
    v.dipVariantRows.forEach((r) => expect(Object.keys(r.values).sort()).toEqual(['bar', 'bench', 'ring']));
  });
});

describe('Mellizomnyújtás: karhelyzet és adagolás', () => {
  it('a régiók kiemelése a vizsgálat helyzeteit követi', async () => {
    const { regionResults } = await import('../data/exercises/stretchVariants');
    const { structureById } = await import('../data/muscles');
    const hit = (abduction: 45 | 90 | 135, externalRotation: boolean, trunkRotation: boolean) =>
      regionResults.filter((r) => r.matches({ abduction, externalRotation, trunkRotation })).map((r) => r.regionId);
    expect(hit(90, false, false)).toEqual(['muscle-pectoralis-major-clavicular']);
    expect(hit(90, true, false)).toEqual(['muscle-pectoralis-major-clavicular', 'muscle-pectoralis-major-sternocostal']);
    expect(hit(45, true, true)).toEqual(['muscle-pectoralis-major-clavicular']);
    expect(hit(135, true, true)).toEqual(['muscle-pectoralis-major-abdominal']);
    expect(hit(135, false, false)).toEqual([]);
    regionResults.forEach((r) => expect(structureById(r.regionId), r.regionId).toBeDefined());
  });

  it('biztos kiemelést csak az absztraktban pontosan leírt kombináció kap (regresszió)', async () => {
    const { regionResults } = await import('../data/exercises/stretchVariants');
    const { emphasizedRegionIds } = await import('../features/exercises/StretchPanels');
    const status = (abduction: 45 | 90 | 135, externalRotation: boolean, trunkRotation: boolean) => {
      const p = { abduction, externalRotation, trunkRotation };
      return Object.fromEntries(regionResults.map((r) => [r.regionId.replace('muscle-pectoralis-major-', ''), r.matches(p) ? 'match' : r.partial?.(p) ? 'partial' : 'none']));
    };
    // 90° + medence-elfordítás: egyik 90°-os kulcscsonti helyzet sem ilyen → nem biztos egyezés.
    expect(status(90, false, true)).toEqual({ clavicular: 'partial', sternocostal: 'none', abdominal: 'none' });
    expect(status(90, true, true)).toEqual({ clavicular: 'partial', sternocostal: 'partial', abdominal: 'none' });
    // A szegycsonti „medence-elfordítás + külső rotáció” szöge ismeretlen: semmilyen szögnél nem biztos.
    expect(status(45, true, true)).toEqual({ clavicular: 'match', sternocostal: 'partial', abdominal: 'none' });
    expect(status(135, true, true)).toEqual({ clavicular: 'none', sternocostal: 'partial', abdominal: 'match' });
    // Külső rotáció vagy medence-elfordítás nélkül a 45° és a 135° nem kiemelt helyzet.
    expect(status(45, false, true).clavicular).toBe('none');
    expect(status(45, true, false).clavicular).toBe('none');
    expect(status(135, true, false).abdominal).toBe('none');
    // Az animáció kiemelése csak a biztos egyezéseket kapja.
    expect(emphasizedRegionIds({ abduction: 90, externalRotation: true, trunkRotation: true })).toEqual([]);
    expect(emphasizedRegionIds({ abduction: 90, externalRotation: true, trunkRotation: false })).toEqual([
      'muscle-pectoralis-major-clavicular',
      'muscle-pectoralis-major-sternocostal'
    ]);
  });

  it('a két nyújtó gyakorlat minden nyújtási állításának forrása létezik és a gyakorlat forráslistáján van', async () => {
    const v = await import('../data/exercises/stretchVariants');
    const claims = [...v.regionFindings, ...v.dosageFindings, ...v.stretchComparisonRows];
    ['pectoral-stretch', 'supine-pectoral-stretch'].forEach((eid) => {
      const e = exercises.find((x) => x.id === eid)!;
      claims.flatMap((c) => c.sourceIds).forEach((id) => {
        expect(sourceById(id), id).toBeDefined();
        expect(e.sourceIds, `${eid}: ${id}`).toContain(id);
      });
    });
    v.stretchComparisonRows.forEach((r) => expect(Object.keys(r.values).sort()).toEqual(['roller', 'wall']));
  });
});

describe('Kis mellizom-gyakorlatok', () => {
  it('a kis mellizom adatlapjáról mindhárom gyakorlat elérhető, és mindegyik a vállöv-nézetben animál', async () => {
    const { pectoralisMinor } = await import('../data/muscles/pectoralisMinor');
    expect(pectoralisMinor.exerciseIds).toHaveLength(3);
    pectoralisMinor.exerciseIds.forEach((id) => {
      const e = exercises.find((x) => x.id === id)!;
      expect(e, id).toBeDefined();
      expect(e.animation.kind).toBe('girdle');
      expect(e.muscleIds[0]).toBe('muscle-pectoralis-minor');
    });
  });

  it('az 1-es mélységnél (nyújtott helyzet) hosszabb a kis mellizom, mint a 0-snál', async () => {
    const { viewGeometries } = await import('../data/geometry');
    const { computeFrameTransforms, lerpPose, toWorld } = await import('../utils/geometry');
    ['scapular-depression-dip', 'push-up-plus', 'pectoralis-minor-stretch'].forEach((id) => {
      const e = exercises.find((x) => x.id === id)!;
      if (e.animation.kind !== 'girdle') throw new Error(id);
      const a = e.animation;
      const g = viewGeometries[a.viewId]!;
      const len = (d: number) => {
        const tr = computeFrameTransforms(g.frames, lerpPose(a.startPose, a.endPose, d));
        const c = (type: 'origin' | 'insertion') => {
          const pts = g.attachments.find((x) => x.structureId === 'muscle-pectoralis-minor' && x.type === type)!.points.map((p) => toWorld(p, tr));
          return { x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length };
        };
        const o = c('origin');
        const i = c('insertion');
        return Math.hypot(o.x - i.x, o.y - i.y);
      };
      expect(len(1), id).toBeGreaterThan(len(0) + 2);
    });
  });
});

describe('Kulcscsont alatti izom – gyakorlatok', () => {
  it('mindhárom gyakorlat elérhető, a vállöv-nézetben animál, és mindegyikben szerepel a kulcscsont alatti izom', async () => {
    const { subclavius } = await import('../data/muscles/subclavius');
    expect(subclavius.exerciseIds).toHaveLength(3);
    subclavius.exerciseIds.forEach((id) => {
      const e = exercises.find((x) => x.id === id)!;
      expect(e, id).toBeDefined();
      expect(e.animation.kind, id).toBe('girdle');
      expect(Object.values(e.phaseRoles ?? {}).flat().some((r) => r.structureIds.includes('muscle-subclavius')), id).toBe(true);
    });
  });

  it('lehúzáskor (koncentrikus) rövidül, vállvonogatáskor (koncentrikus emelés) hosszabbodik a kulcscsont alatti izom', async () => {
    const { viewGeometries } = await import('../data/geometry');
    const { computeFrameTransforms, lerpPose, toWorld } = await import('../utils/geometry');
    const { cycleDepth } = await import('../engines/animation/animationEngine');
    const len = (id: string, t: number) => {
      const e = exercises.find((x) => x.id === id)!;
      if (e.animation.kind !== 'girdle') throw new Error(id);
      const a = e.animation;
      const g = viewGeometries[a.viewId]!;
      const tr = computeFrameTransforms(g.frames, lerpPose(a.startPose, a.endPose, cycleDepth(e.phases, t)));
      const c = (type: 'origin' | 'insertion') => {
        const pts = g.attachments.find((x) => x.structureId === 'muscle-subclavius' && x.type === type)!.points.map((p) => toWorld(p, tr));
        return { x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length };
      };
      const o = c('origin');
      const i = c('insertion');
      return Math.hypot(o.x - i.x, o.y - i.y);
    };
    // A koncentrikus szakasz vége (0,4) a szakasz elejéhez (0) képest.
    expect(len('scapular-pulldown', 0.4)).toBeLessThan(len('scapular-pulldown', 0) - 1);
    expect(len('shoulder-shrug', 0.4)).toBeGreaterThan(len('shoulder-shrug', 0) + 1);
    // A szerepadatok is ezt mondják.
    const role = (id: string) => exercises.find((x) => x.id === id)!.phaseRoles!.concentric!.find((r) => r.structureIds.includes('muscle-subclavius'))!;
    expect(role('scapular-pulldown').lengthChange).toBe('shortening');
    expect(role('shoulder-shrug')).toMatchObject({ role: 'antagonist', lengthChange: 'lengthening' });
  });
});

describe('Elülső fűrészizom – gyakorlatok', () => {
  it('mindhárom gyakorlat elérhető, a vállöv-nézetben animál, és mindegyikben agonista az elülső fűrészizom', async () => {
    const { serratusAnterior } = await import('../data/muscles/serratusAnterior');
    expect(serratusAnterior.exerciseIds).toEqual(['serratus-punch', 'push-up-plus', 'scaption-overhead']);
    serratusAnterior.exerciseIds.forEach((id) => {
      const e = exercises.find((x) => x.id === id)!;
      expect(e, id).toBeDefined();
      expect(e.animation.kind, id).toBe('girdle');
      expect(e.phaseRoles!.concentric!.find((r) => r.structureIds.includes('muscle-serratus-anterior'))?.role, id).toBe('agonist');
    });
  });

  it('az 1-es mélységnél (kinyúlt helyzet) hosszabb az elülső fűrészizom, mint a 0-snál', async () => {
    const { viewGeometries } = await import('../data/geometry');
    const { computeFrameTransforms, lerpPose, toWorld } = await import('../utils/geometry');
    ['serratus-punch', 'push-up-plus', 'scaption-overhead'].forEach((id) => {
      const e = exercises.find((x) => x.id === id)!;
      if (e.animation.kind !== 'girdle') throw new Error(id);
      const a = e.animation;
      const g = viewGeometries[a.viewId]!;
      // Ahol a részek külön szerepelnek, az alsó részt (az alsó szöghöz tapad) mérjük.
      const part = g.attachments.some((x) => x.structureId === 'muscle-serratus-anterior-inferior') ? 'muscle-serratus-anterior-inferior' : 'muscle-serratus-anterior';
      const len = (d: number) => {
        const tr = computeFrameTransforms(g.frames, lerpPose(a.startPose, a.endPose, d));
        const c = (type: 'origin' | 'insertion') => {
          const pts = g.attachments.filter((x) => x.structureId === part && x.type === type).flatMap((x) => x.points.map((p) => toWorld(p, tr)));
          return { x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length };
        };
        const o = c('origin');
        const i = c('insertion');
        return Math.hypot(o.x - i.x, o.y - i.y);
      };
      expect(len(1), id).toBeGreaterThan(len(0) + 2);
    });
  });
});
