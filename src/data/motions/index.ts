import type { MotionDefinition } from '../../types';
import { motions as pectoralisMajorMotions } from './pectoralisMajorMotions';
import { pectoralisMinorMotions } from './pectoralisMinorMotions';
import { subclaviusMotions } from './subclaviusMotions';

/** Minden izom mozgásanimációja. */
export const motions: MotionDefinition[] = [...pectoralisMajorMotions, ...pectoralisMinorMotions, ...subclaviusMotions];
export const motionById = (id: string | undefined) => motions.find((m) => m.id === id);
