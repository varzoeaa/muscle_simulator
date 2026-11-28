import type { MotionDefinition } from '../../types';
import { motions as pectoralisMajorMotions } from './pectoralisMajorMotions';
import { pectoralisMinorMotions } from './pectoralisMinorMotions';
import { subclaviusMotions } from './subclaviusMotions';
import { serratusAnteriorMotions } from './serratusAnteriorMotions';

/** Minden izom mozgásanimációja. */
export const motions: MotionDefinition[] = [...pectoralisMajorMotions, ...pectoralisMinorMotions, ...subclaviusMotions, ...serratusAnteriorMotions];
export const motionById = (id: string | undefined) => motions.find((m) => m.id === id);
