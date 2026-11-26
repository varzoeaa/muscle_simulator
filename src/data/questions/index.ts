import type { QuestionTopic } from '../../types';
import { pmFlashcards, pmQuestions } from './pectoralisMajor';

export const questions = [...pmQuestions];
export const flashcards = [...pmFlashcards];

export const questionsForMuscle = (muscleId: string) => questions.filter((q) => q.muscleId === muscleId);
export const flashcardsForMuscle = (muscleId: string) => flashcards.filter((f) => f.muscleId === muscleId);

export const topicLabels: Record<QuestionTopic, string> = {
  name: 'Elnevezés',
  origin: 'Eredés',
  insertion: 'Tapadás',
  innervation: 'Beidegzés',
  function: 'Funkció',
  joints: 'Érintett ízületek',
  regions: 'Izomrészek',
  roles: 'Agonisták, antagonisták, szinergisták',
  stabilization: 'Stabilizáló működés',
  contraction: 'Izomműködési típusok',
  exercise: 'Gyakorlatok',
  recognition: 'Izomfelismerés az ábrán'
};
