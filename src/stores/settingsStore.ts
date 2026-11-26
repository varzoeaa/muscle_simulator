import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { safeStateStorage, STORAGE_KEYS } from '../services/storage';

export type Theme = 'dark' | 'light';

interface SettingsState {
  theme: Theme;
  showLabels: boolean;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  setShowLabels: (v: boolean) => void;
}

const systemTheme = (): Theme => {
  try {
    return globalThis.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

export const applyTheme = (t: Theme) => {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = t;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#171419' : '#FAF6F7');
  }
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: systemTheme(),
      showLabels: true,
      toggleTheme: () => {
        const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        set({ theme: next });
      },
      setTheme: (t) => {
        applyTheme(t);
        set({ theme: t });
      },
      setShowLabels: (v) => set({ showLabels: v })
    }),
    {
      name: STORAGE_KEYS.settings,
      storage: createJSONStorage(() => safeStateStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      }
    }
  )
);
