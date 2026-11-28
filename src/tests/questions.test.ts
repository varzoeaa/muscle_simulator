import { describe, expect, it } from 'vitest';
import type { QuestionTopic, StudyQuestion } from '../types';
import { flashcards, questions, topicLabels } from '../data/questions';
import { viewGeometries } from '../data/geometry';
import { isStructureDrawn } from '../components/anatomy/AnatomyViewer';
import { gradeAnswer } from '../engines/study/studyEngine';
import { sourceById } from '../data/sources/sources';

describe('Feladatbank', () => {
  it('minden témakörben legalább öt feladat van, és összesen legalább 70', () => {
    expect(questions.length).toBeGreaterThanOrEqual(70);
    (Object.keys(topicLabels) as QuestionTopic[]).forEach((t) => expect(questions.filter((q) => q.topic === t).length, t).toBeGreaterThanOrEqual(5));
  });

  it('a feladatok és kártyák azonosítói egyediek, a forrásaik léteznek', () => {
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
    expect(new Set(flashcards.map((f) => f.id)).size).toBe(flashcards.length);
    [...questions, ...flashcards].forEach((q) => {
      expect(q.sourceIds.length, q.id).toBeGreaterThan(0);
      q.sourceIds.forEach((id) => expect(sourceById(id), `${q.id}: ${id}`).toBeDefined());
    });
  });

  it('az ábrás feladatok minden kattintható eleme ki van rajzolva a nézetben', () => {
    questions
      .filter((q): q is Extract<StudyQuestion, { type: 'diagram-identify' }> => q.type === 'diagram-identify')
      .forEach((q) => {
        const g = viewGeometries[q.viewId]!;
        expect(g, q.id).toBeDefined();
        const drawn = (id: string) => (id.startsWith('bone-') ? g.bones.some((b) => b.structureId === id) : isStructureDrawn(g, id));
        q.selectableStructureIds.forEach((id) => expect(drawn(id), `${q.id}: ${id}`).toBe(true));
      });
  });

  it('a feleletválasztós feladatoknál a válaszlehetőségek egyediek', () => {
    questions.forEach((q) => {
      if (q.type === 'multiple-choice') expect(new Set(q.options.map((o) => o.text)).size, q.id).toBe(q.options.length);
      if (q.type === 'fill-blank') expect(new Set(q.options).size, q.id).toBe(q.options.length);
    });
  });

  it('párosításnál az azonos szövegű jobb oldali válaszok bármelyike elfogadott', () => {
    const q = questions.find((x) => x.id === 'q-pm2-ex-chain') as Extract<StudyQuestion, { type: 'matching' }>;
    // A „Fekvőtámasz” és a „Tolódzkodás” is „Zárt lánc”: a két azonos válasz felcserélése is helyes.
    const mapping = { p1: 'p2', p2: 'p1', p3: 'p4', p4: 'p3' };
    expect(gradeAnswer(q, { type: 'matching', mapping })).toBe(true);
    expect(gradeAnswer(q, { type: 'matching', mapping: { p1: 'p3', p2: 'p2', p3: 'p1', p4: 'p4' } })).toBe(false);
  });
});

describe('Kis mellizom – feladatbank', () => {
  it('minden témakörben legalább négy feladat van, összesen legalább 50, és legalább 15 tanulókártya', () => {
    const pool = questions.filter((q) => q.muscleId === 'muscle-pectoralis-minor');
    expect(pool.length).toBeGreaterThanOrEqual(50);
    (Object.keys(topicLabels) as QuestionTopic[]).forEach((t) => expect(pool.filter((q) => q.topic === t).length, t).toBeGreaterThanOrEqual(4));
    expect(flashcards.filter((f) => f.muscleId === 'muscle-pectoralis-minor').length).toBeGreaterThanOrEqual(15);
  });
});

describe('Kulcscsont alatti izom – feladatbank', () => {
  it('minden témakörben legalább négy feladat van, összesen legalább 50, és legalább 12 tanulókártya', () => {
    const pool = questions.filter((q) => q.muscleId === 'muscle-subclavius');
    expect(pool.length).toBeGreaterThanOrEqual(50);
    (Object.keys(topicLabels) as QuestionTopic[]).forEach((t) => expect(pool.filter((q) => q.topic === t).length, t).toBeGreaterThanOrEqual(4));
    expect(flashcards.filter((f) => f.muscleId === 'muscle-subclavius').length).toBeGreaterThanOrEqual(12);
  });
});

describe('Elülső fűrészizom – feladatbank', () => {
  it('minden témakörben legalább négy feladat van, összesen legalább 50, és legalább 12 tanulókártya', () => {
    const pool = questions.filter((q) => q.muscleId === 'muscle-serratus-anterior');
    expect(pool.length).toBeGreaterThanOrEqual(50);
    (Object.keys(topicLabels) as QuestionTopic[]).forEach((t) => expect(pool.filter((q) => q.topic === t).length, t).toBeGreaterThanOrEqual(4));
    expect(flashcards.filter((f) => f.muscleId === 'muscle-serratus-anterior').length).toBeGreaterThanOrEqual(12);
  });

  it('az ábrás feladatoknál a helyes válasz kattintható, és az izom bármely része elfogadott', () => {
    const q = questions.find((x) => x.id === 'q-sa-diagram-anterior') as Extract<StudyQuestion, { type: 'diagram-identify' }>;
    ['muscle-serratus-anterior-superior', 'muscle-serratus-anterior-intermediate', 'muscle-serratus-anterior-inferior'].forEach((id) =>
      expect(gradeAnswer(q, { type: 'diagram-identify', structureId: id }), id).toBe(true)
    );
    expect(gradeAnswer(q, { type: 'diagram-identify', structureId: 'muscle-latissimus-dorsi' })).toBe(false);
    questions
      .filter((x): x is Extract<StudyQuestion, { type: 'diagram-identify' }> => x.type === 'diagram-identify' && x.muscleId === 'muscle-serratus-anterior')
      .forEach((x) => x.correctStructureIds.forEach((id) => expect(x.selectableStructureIds, x.id).toContain(id)));
  });
});
