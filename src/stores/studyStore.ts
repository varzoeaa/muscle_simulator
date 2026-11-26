import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ExamResult, StudyProgress } from '../types';
import { emptyProgress, recordAnswer, recordExam } from '../engines/study/studyEngine';
import { safeStateStorage, STORAGE_KEYS } from '../services/storage';

interface StudyState {
  progress: StudyProgress;
  answer: (questionId: string, correct: boolean) => void;
  finishExam: (result: ExamResult) => void;
  markFlashcardSeen: (id: string) => void;
  clearAll: () => void;
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
      progress: emptyProgress(),
      answer: (questionId, correct) => set((s) => ({ progress: recordAnswer(s.progress, questionId, correct) })),
      finishExam: (result) => set((s) => ({ progress: recordExam(s.progress, result) })),
      markFlashcardSeen: (id) =>
        set((s) => ({
          progress: { ...s.progress, flashcardsSeen: { ...s.progress.flashcardsSeen, [id]: (s.progress.flashcardsSeen[id] ?? 0) + 1 } }
        })),
      clearAll: () => set({ progress: emptyProgress() })
    }),
    {
      name: STORAGE_KEYS.study,
      storage: createJSONStorage(() => safeStateStorage),
      version: 1
    }
  )
);
