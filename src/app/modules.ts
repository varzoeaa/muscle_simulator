import { Activity, BookOpenCheck, Dumbbell, Microscope, type LucideIcon } from 'lucide-react';

export type ModuleId = 'anatomia' | 'biomechanika' | 'gyakorlatok' | 'tanulas';

export interface ModuleDef {
  id: ModuleId;
  name: string;
  subtitle: string;
  icon: LucideIcon;
}

export const modules: ModuleDef[] = [
  { id: 'anatomia', name: 'Anatomy Lab', subtitle: 'Anatómiai ismeretek', icon: Microscope },
  { id: 'biomechanika', name: 'Biomechanics Lab', subtitle: 'Izomműködés és mozgásanimációk', icon: Activity },
  { id: 'gyakorlatok', name: 'Exercise Lab', subtitle: 'Edzőtermi gyakorlatok', icon: Dumbbell },
  { id: 'tanulas', name: 'Study Mode', subtitle: 'Tanulás és vizsgafelkészítés', icon: BookOpenCheck }
];

export const isModuleId = (v: string | undefined): v is ModuleId => modules.some((m) => m.id === v);
