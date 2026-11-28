import type { Exercise } from '../../types';
import { benchPress } from './benchPress';
import { chestExercises } from './chestExercises';
import { pectoralisMinorExercises } from './pectoralisMinorExercises';
import { subclaviusExercises } from './subclaviusExercises';
import { serratusAnteriorExercises } from './serratusAnteriorExercises';

export const exercises: Exercise[] = [benchPress, ...chestExercises, ...pectoralisMinorExercises, ...subclaviusExercises, ...serratusAnteriorExercises];
export const exerciseById = (id: string | undefined) => exercises.find((e) => e.id === id);
