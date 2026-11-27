import type { Exercise } from '../../types';
import { benchPress } from './benchPress';
import { chestExercises } from './chestExercises';
import { pectoralisMinorExercises } from './pectoralisMinorExercises';

export const exercises: Exercise[] = [benchPress, ...chestExercises, ...pectoralisMinorExercises];
export const exerciseById = (id: string | undefined) => exercises.find((e) => e.id === id);
