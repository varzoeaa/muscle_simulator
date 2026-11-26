import type { Exercise } from '../../types';
import { benchPress } from './benchPress';
import { chestExercises } from './chestExercises';

export const exercises: Exercise[] = [benchPress, ...chestExercises];
export const exerciseById = (id: string | undefined) => exercises.find((e) => e.id === id);
