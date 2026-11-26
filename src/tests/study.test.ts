import { describe, expect, it } from 'vitest';
import type { StudyQuestion } from '../types';
import { buildExam, emptyProgress, gradeAnswer, recordAnswer, recordExam, score, shuffle, wrongQuestions } from '../engines/study/studyEngine';
import { questions } from '../data/questions';

const mc = questions.find((q) => q.type === 'multiple-choice')! as Extract<StudyQuestion, { type: 'multiple-choice' }>;
const matching = questions.find((q) => q.type === 'matching')! as Extract<StudyQuestion, { type: 'matching' }>;
const fill = questions.find((q) => q.type === 'fill-blank')! as Extract<StudyQuestion, { type: 'fill-blank' }>;
const diagram = questions.find((q) => q.type === 'diagram-identify' && q.correctStructureIds.length > 1)! as Extract<StudyQuestion, { type: 'diagram-identify' }>;

describe('Válaszok kiértékelése', () => {
  it('feleletválasztós', () => {
    expect(gradeAnswer(mc, { type: 'multiple-choice', optionId: mc.correctOptionId })).toBe(true);
    const wrong = mc.options.find((o) => o.id !== mc.correctOptionId)!;
    expect(gradeAnswer(mc, { type: 'multiple-choice', optionId: wrong.id })).toBe(false);
  });
  it('párosítás – csak a teljes, helyes párosítás helyes', () => {
    const correct = Object.fromEntries(matching.pairs.map((p) => [p.id, p.id]));
    expect(gradeAnswer(matching, { type: 'matching', mapping: correct })).toBe(true);
    const [a, b] = matching.pairs;
    expect(gradeAnswer(matching, { type: 'matching', mapping: { ...correct, [a!.id]: b!.id, [b!.id]: a!.id } })).toBe(false);
  });
  it('hiányos szöveg – kis- és nagybetűre, szóközre érzéketlen', () => {
    expect(gradeAnswer(fill, { type: 'fill-blank', value: ` ${fill.answer.toUpperCase()} ` })).toBe(true);
  });
  it('ábrás feladat – több elfogadott struktúra', () => {
    diagram.correctStructureIds.forEach((id) => expect(gradeAnswer(diagram, { type: 'diagram-identify', structureId: id })).toBe(true));
    expect(gradeAnswer(diagram, { type: 'diagram-identify', structureId: 'bone-humerus-x' })).toBe(false);
  });
  it('eltérő típusú válasz hibás', () => {
    expect(gradeAnswer(mc, { type: 'fill-blank', value: 'x' })).toBe(false);
  });
});

describe('Tesztek pontszámítása', () => {
  it('pontszám és százalék', () => {
    expect(score([{ correct: true }, { correct: false }, { correct: true }])).toEqual({ total: 3, correct: 2, percent: 67 });
    expect(score([])).toEqual({ total: 0, correct: 0, percent: 0 });
  });
  it('vizsga összeállítása: témakör-szűrés és kérdésszám', () => {
    const exam = buildExam(questions, { topics: ['innervation'], count: 50 });
    expect(exam.length).toBe(questions.filter((q) => q.topic === 'innervation').length);
    expect(exam.every((q) => q.topic === 'innervation')).toBe(true);
    expect(buildExam(questions, { topics: [], count: 3 }).length).toBe(3);
  });
  it('a keverés megőrzi az elemeket', () => {
    let seed = 1;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const s = shuffle([1, 2, 3, 4, 5], rnd);
    expect([...s].sort()).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('Hibás kérdések ismétlése', () => {
  it('hibás válasz → ismétlendő; később helyes válasz → lekerül', () => {
    let p = recordAnswer(emptyProgress(), mc.id, false);
    expect(p.wrongQuestionIds).toEqual([mc.id]);
    expect(wrongQuestions(questions, p).map((q) => q.id)).toEqual([mc.id]);
    p = recordAnswer(p, mc.id, true);
    expect(p.wrongQuestionIds).toEqual([]);
    expect(p.questions[mc.id]).toMatchObject({ attempts: 2, correct: 1, lastCorrect: true });
  });
  it('vizsgaeredmény rögzítése frissíti a hibás listát és az előzményeket', () => {
    const p = recordExam(emptyProgress(), {
      id: 'e1',
      muscleId: 'muscle-pectoralis-major',
      topics: [],
      total: 2,
      correct: 1,
      percent: 50,
      finishedAt: new Date().toISOString(),
      answers: [
        { questionId: mc.id, correct: true },
        { questionId: fill.id, correct: false }
      ]
    });
    expect(p.exams).toHaveLength(1);
    expect(p.wrongQuestionIds).toEqual([fill.id]);
  });
});
