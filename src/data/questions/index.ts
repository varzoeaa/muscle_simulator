import type { QuestionTopic } from '../../types';
import { pmFlashcards, pmQuestions } from './pectoralisMajor';
import { pmExtraFlashcards, pmExtraQuestions } from './pectoralisMajorExtra';
import { pmiFlashcards, pmiQuestions } from './pectoralisMinor';
import { subFlashcards, subQuestions } from './subclavius';
import { saFlashcards, saQuestions } from './serratusAnterior';

export const questions = [...pmQuestions, ...pmExtraQuestions, ...pmiQuestions, ...subQuestions, ...saQuestions];
export const flashcards = [...pmFlashcards, ...pmExtraFlashcards, ...pmiFlashcards, ...subFlashcards, ...saFlashcards];

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
