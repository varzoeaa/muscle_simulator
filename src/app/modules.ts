import { Activity, BookOpenCheck, Dumbbell, LibraryBig, Microscope, type LucideIcon } from 'lucide-react';

export type ModuleId = 'anatomia' | 'biomechanika' | 'gyakorlatok' | 'tanulas';

export interface ModuleDef {
  id: ModuleId;
  name: string;
  subtitle: string;
  icon: LucideIcon;
}

export const modules: ModuleDef[] = [
  { id: 'anatomia', name: 'Anatómia', subtitle: 'Izmok, eredés, tapadás, beidegzés', icon: Microscope },
  { id: 'biomechanika', name: 'Biomechanika', subtitle: 'Izomműködés és mozgásanimációk', icon: Activity },
  { id: 'gyakorlatok', name: 'Gyakorlatok', subtitle: 'Edzőtermi mozdulatok szakaszonként', icon: Dumbbell },
  { id: 'tanulas', name: 'Tanulás', subtitle: 'Kártyák, gyakorlás, vizsga', icon: BookOpenCheck }
];

export const isModuleId = (v: string | undefined): v is ModuleId => modules.some((m) => m.id === v);

/**
 * Izmoktól független, önálló tanulási eszközök a kezdőoldalon (az izomkártyák mellett).
 * Új eszköz ide vehető fel; az izmok listája a `data/muscles` modulból jön, így új izom is
 * a kezdőoldal módosítása nélkül jelenik meg.
 */
export interface ToolDef {
  id: string;
  path: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export const tools: ToolDef[] = [
  {
    id: 'fogalomtar',
    path: '/fogalomtar',
    name: 'Fogalomtár',
    description: 'Saját fogalmak JSON-fájlból: kereshető lista témakörök szerint, és belőlük automatikusan készülő tanulókártyák.',
    icon: LibraryBig
  }
];
