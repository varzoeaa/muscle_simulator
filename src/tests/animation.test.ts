import { describe, expect, it } from 'vitest';
import * as engine from '../engines/animation/animationEngine';
import { pmAdduction } from '../data/motions/pectoralisMajorMotions';
import { benchPress } from '../data/exercises/benchPress';
import { platesPerSide, solveBench } from '../engines/animation/benchKinematics';
import { computeFrameTransforms, toWorld } from '../utils/geometry';
import { anteriorView } from '../data/geometry/anteriorView';

describe('Animációs állapotkezelés', () => {
  it('lejátszás közben az idő arányosan halad, a sebesség szorzóként hat', () => {
    let s = engine.play(engine.createAnimationState());
    s = engine.tick(s, 0, 1000); // az első képkocka nem állíthatja meg a lejátszást
    expect(s.playing).toBe(true);
    s = engine.tick(s, 250, 1000);
    expect(s.progress).toBeCloseTo(0.25);
    s = engine.tick(engine.setSpeed(s, 2), 100, 1000);
    expect(s.progress).toBeCloseTo(0.45);
  });

  it('a tartomány végén megáll (loop nélkül), újraindításkor elölről kezd', () => {
    let s = engine.play(engine.createAnimationState());
    s = engine.tick(s, 5000, 1000);
    expect(s.progress).toBe(1);
    expect(s.playing).toBe(false);
    s = engine.play(s);
    expect(s.progress).toBe(0);
    expect(s.playing).toBe(true);
  });

  it('visszatekerés: az idő visszafelé halad és az elején megáll', () => {
    let s = engine.seek(engine.createAnimationState(), 0.5);
    s = engine.rewind(s);
    s = engine.tick(s, 200, 1000);
    expect(s.progress).toBeCloseTo(0.3);
    s = engine.tick(s, 1000, 1000);
    expect(s.progress).toBe(0);
    expect(s.playing).toBe(false);
  });

  it('szüneteltetés megállítja az időt', () => {
    let s = engine.pause(engine.play(engine.createAnimationState()));
    s = engine.tick(s, 500, 1000);
    expect(s.progress).toBe(0);
  });

  it('animáció visszaállítása: kiinduló helyzet, előre irány, megállítva', () => {
    let s = engine.rewind(engine.seek(engine.createAnimationState({ speed: 2 }), 0.7));
    s = engine.reset(s);
    expect(s).toMatchObject({ progress: 0, playing: false, direction: 1, speed: 2 });
  });

  it('ismétlődő lejátszás egy kiválasztott szakaszon belül marad', () => {
    let s = engine.setRange(engine.createAnimationState({ loop: true }), [0.55, 1]);
    expect(s.progress).toBe(0.55);
    s = engine.play(s);
    s = engine.tick(s, 600, 1000);
    expect(s.progress).toBeGreaterThanOrEqual(0.55);
    expect(s.progress).toBeLessThanOrEqual(1);
    expect(s.playing).toBe(true);
  });

  it('a seek a tartományra korlátoz', () => {
    const s = engine.setRange(engine.createAnimationState(), [0.2, 0.4]);
    expect(engine.seek(s, 0.9).progress).toBe(0.4);
    expect(engine.seek(s, -1).progress).toBe(0.2);
  });
});

describe('Izomműködési típusok (Biomechanics Lab)', () => {
  it('koncentrikus: megnyúlt → rövidült helyzet; excentrikus: fordítva; izometriás: állandó', () => {
    const start = pmAdduction.startPose.shoulderAbduction!;
    const end = pmAdduction.endPose.shoulderAbduction!;
    expect(engine.motionPose(pmAdduction, 0, 'concentric').shoulderAbduction).toBeCloseTo(start);
    expect(engine.motionPose(pmAdduction, 1, 'concentric').shoulderAbduction).toBeCloseTo(end);
    expect(engine.motionPose(pmAdduction, 0, 'eccentric').shoulderAbduction).toBeCloseTo(end);
    expect(engine.motionPose(pmAdduction, 1, 'eccentric').shoulderAbduction).toBeCloseTo(start);
    const iso = [0, 0.3, 1].map((t) => engine.motionPose(pmAdduction, t, 'isometric').shoulderAbduction);
    expect(new Set(iso).size).toBe(1);
  });

  it('a hosszváltozás iránya elkülönül az aktivitástól', () => {
    expect(engine.lengthChange('concentric', true)).toBe('shortening');
    expect(engine.lengthChange('eccentric', true)).toBe('lengthening');
    expect(engine.lengthChange('isometric', true)).toBe('constant');
  });

  it('közelítéskor a nagy mellizom tapadása közelebb kerül az eredéshez (vizuális rövidülés)', () => {
    const ins = anteriorView.attachments.find((a) => a.type === 'insertion' && a.structureId.endsWith('sternocostal'))!.points[0]!;
    const origin = { x: 293, y: 220 };
    const dist = (deg: number) => {
      const p = toWorld(ins, computeFrameTransforms(anteriorView.frames, { shoulderAbduction: deg }));
      return Math.hypot(p.x - origin.x, p.y - origin.y);
    };
    expect(dist(pmAdduction.endPose.shoulderAbduction!)).toBeLessThan(dist(pmAdduction.startPose.shoulderAbduction!));
  });
});

describe('Mozgástartomány és fekvenyomás-kinematika', () => {
  it('a mozgástartomány arányosan csökkenti az alsó helyzetet', () => {
    expect(engine.applyRangeOfMotion(1, 1)).toBe(1);
    expect(engine.applyRangeOfMotion(1, 0.5)).toBe(0.5);
    expect(engine.applyRangeOfMotion(0, 0.5)).toBe(0);
  });

  it('a ciklus szakaszai: leengedés → megtartás alul → felnyomás', () => {
    const ph = benchPress.phases;
    expect(engine.cycleDepth(ph, 0)).toBeCloseTo(0);
    expect(engine.cycleDepth(ph, 0.45)).toBeCloseTo(1);
    expect(engine.cycleDepth(ph, 0.5)).toBe(1);
    expect(engine.cycleDepth(ph, 1)).toBeCloseTo(0);
    expect(engine.phaseAt(ph, 0.2)!.type).toBe('eccentric');
    expect(engine.phaseAt(ph, 0.5)!.type).toBe('isometric');
    expect(engine.phaseAt(ph, 0.8)!.type).toBe('concentric');
  });

  it('a ROM ténylegesen módosítja a rúd alsó helyzetét', () => {
    const full = solveBench(0, engine.applyRangeOfMotion(1, 1));
    const half = solveBench(0, engine.applyRangeOfMotion(1, 0.5));
    expect(half.bar.y).toBeLessThan(full.bar.y); // kisebb y = magasabban
    expect(full.bar.y).toBeCloseTo(full.bottom.y);
  });

  it('a paddőlésszög megváltoztatja a váll és a rúdpálya helyzetét', () => {
    const flat = solveBench(0, 1);
    const incline = solveBench(30, 1);
    expect(incline.shoulder.y).toBeLessThan(flat.shoulder.y);
    expect(incline.top.y).toBeLessThan(flat.top.y);
    expect(incline.pose.incline).toBe(30);
  });

  it('az alkar mindvégig függőleges marad', () => {
    [0, 0.5, 1].forEach((d) => {
      const s = solveBench(15, d);
      expect(s.elbow.x).toBeCloseTo(s.bar.x);
    });
  });

  it('tárcsák számítása oldalanként', () => {
    expect(platesPerSide(20, 20)).toEqual([]);
    expect(platesPerSide(60, 20)).toEqual([20]);
    expect(platesPerSide(102.5, 20)).toEqual([25, 15, 1.25]);
  });
});

describe('Szakaszhatárok', () => {
  it('egy szakasz elején már az a szakasz aktív, nem az előző', async () => {
    const engine = await import('../engines/animation/animationEngine');
    const { benchPress } = await import('../data/exercises/benchPress');
    benchPress.phases.forEach((ph) => expect(engine.phaseAt(benchPress.phases, ph.from)!.type).toBe(ph.type));
    expect(engine.phaseAt(benchPress.phases, 1)!.type).toBe('concentric');
  });
});
