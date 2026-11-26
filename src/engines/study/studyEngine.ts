import type { ExamResult, QuestionTopic, StudyAnswer, StudyProgress, StudyQuestion } from '../../types';

/** Válasz kiértékelése. Tiszta függvény. */
export function gradeAnswer(question: StudyQuestion, answer: StudyAnswer): boolean {
  if (question.type !== answer.type) return false;
  switch (question.type) {
    case 'multiple-choice':
      return answer.type === 'multiple-choice' && answer.optionId === question.correctOptionId;
    case 'diagram-identify':
      return answer.type === 'diagram-identify' && question.correctStructureIds.includes(answer.structureId);
    case 'fill-blank':
      return answer.type === 'fill-blank' && normalize(answer.value) === normalize(question.answer);
    case 'matching':
      return (
        answer.type === 'matching' &&
        question.pairs.length === Object.keys(answer.mapping).length &&
        question.pairs.every((p) => answer.mapping[p.id] === p.id)
      );
  }
}

const normalize = (s: string) => s.trim().toLocaleLowerCase('hu');

export interface ScoreSummary {
  total: number;
  correct: number;
  percent: number;
}

export function score(results: { correct: boolean }[]): ScoreSummary {
  const total = results.length;
  const correct = results.filter((r) => r.correct).length;
  return { total, correct, percent: total === 0 ? 0 : Math.round((correct / total) * 100) };
}

/** Értékelés szövegesen (vizsga végi visszajelzés). */
export function evaluation(percent: number): string {
  if (percent >= 90) return 'Kiváló – a témakört magabiztosan ismered.';
  if (percent >= 75) return 'Jó – néhány részletet érdemes átismételni.';
  if (percent >= 50) return 'Közepes – ismételd át a hibás kérdésekhez kapcsolódó tananyagot.';
  return 'Gyenge – javasolt az Anatomy Lab tananyagának újbóli áttekintése.';
}

/** Fisher–Yates keverés, injektálható véletlenforrással (tesztelhetőség). */
export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function buildExam(
  pool: StudyQuestion[],
  opts: { topics: QuestionTopic[]; count: number },
  random: () => number = Math.random
): StudyQuestion[] {
  const filtered = opts.topics.length ? pool.filter((q) => opts.topics.includes(q.topic)) : pool;
  return shuffle(filtered, random).slice(0, Math.max(1, opts.count));
}

export const emptyProgress = (): StudyProgress => ({ questions: {}, wrongQuestionIds: [], exams: [], flashcardsSeen: {} });

/** Egy válasz rögzítése a tanulási előrehaladásban. Hibás válasz → ismétlendő listára kerül; helyes → lekerül. */
export function recordAnswer(progress: StudyProgress, questionId: string, correct: boolean, now = new Date()): StudyProgress {
  const prev = progress.questions[questionId];
  const record = {
    attempts: (prev?.attempts ?? 0) + 1,
    correct: (prev?.correct ?? 0) + (correct ? 1 : 0),
    lastCorrect: correct,
    lastAnsweredAt: now.toISOString()
  };
  const wrong = new Set(progress.wrongQuestionIds);
  if (correct) wrong.delete(questionId);
  else wrong.add(questionId);
  return { ...progress, questions: { ...progress.questions, [questionId]: record }, wrongQuestionIds: [...wrong] };
}

export function recordExam(progress: StudyProgress, result: ExamResult): StudyProgress {
  let next = progress;
  result.answers.forEach((a) => {
    next = recordAnswer(next, a.questionId, a.correct, new Date(result.finishedAt));
  });
  return { ...next, exams: [result, ...next.exams].slice(0, 50) };
}

/** Az ismétlendő (korábban elrontott) kérdések az adott izomhoz. */
export function wrongQuestions(pool: StudyQuestion[], progress: StudyProgress): StudyQuestion[] {
  return pool.filter((q) => progress.wrongQuestionIds.includes(q.id));
}
