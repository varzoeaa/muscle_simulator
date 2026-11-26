/**
 * Tárolási réteg. Jelenleg LocalStorage; a felület (StorageAdapter) később
 * backenddel vagy IndexedDB-vel is megvalósítható az alkalmazás többi részének módosítása nélkül.
 */
export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const STORAGE_PREFIX = 'musclelab:';
export const STORAGE_KEYS = {
  settings: `${STORAGE_PREFIX}settings`,
  study: `${STORAGE_PREFIX}study`
} as const;

/** Memóriabeli tároló – akkor használjuk, ha a LocalStorage nem érhető el (pl. privát mód, tiltott sütik). */
export function createMemoryStorage(): StorageAdapter {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k)
  };
}

let fallback: StorageAdapter | null = null;

/** Biztonságos hozzáférés: minden művelet try/catch-ben, hiba esetén memóriabeli tárolóra vált. */
export function getStorage(): StorageAdapter {
  try {
    const ls = globalThis.localStorage;
    const probe = `${STORAGE_PREFIX}probe`;
    ls.setItem(probe, '1');
    ls.removeItem(probe);
    return ls;
  } catch {
    fallback ??= createMemoryStorage();
    return fallback;
  }
}

export function isPersistentStorageAvailable(): boolean {
  try {
    const ls = globalThis.localStorage;
    ls.setItem(`${STORAGE_PREFIX}probe`, '1');
    ls.removeItem(`${STORAGE_PREFIX}probe`);
    return true;
  } catch {
    return false;
  }
}

/** Zustand persist-kompatibilis, hibatűrő storage. */
export const safeStateStorage = {
  getItem: (name: string) => {
    try {
      return getStorage().getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      getStorage().setItem(name, value);
    } catch {
      /* betelt vagy tiltott tároló – csendben elnyeljük, az állapot memóriában megmarad */
    }
  },
  removeItem: (name: string) => {
    try {
      getStorage().removeItem(name);
    } catch {
      /* lásd fent */
    }
  }
};
