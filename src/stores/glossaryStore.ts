import { create } from 'zustand';
import { exportGlossary, mergeTerms, newTermId, parseGlossaryJson, validateTermRecord, type FieldError, type GlossaryError, type GlossaryTerm } from '../engines/glossary/glossary';
import { STORAGE_KEYS } from '../services/storage';

/**
 * Fogalomtár-állapot. A rekordok a böngésző LocalStorage-ában, az importtal azonos formátumban
 * (`{ version, terms }`) tárolódnak. A mentést nem a zustand persist végzi, mert annak hibáit a
 * közös tároló csendben elnyeli – itt a mentési hibát a felhasználónak jeleznünk kell.
 */

export type ImportOutcome =
  | { kind: 'success'; added: string[]; unchanged: string[]; conflicts: string[] }
  | { kind: 'invalid'; errors: GlossaryError[] }
  | { kind: 'save-failed'; message: string };

/** Minimális tároló-interfész (a tesztek memóriabeli tárolót adhatnak). */
export interface GlossaryStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const browserStorage = (): GlossaryStorage | null => {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
};

/** Betöltés: hiányzó adat → üres fogalomtár; sérült adat → üres + figyelmeztetés (az eredeti nem íródik felül). */
export function loadGlossary(storage: GlossaryStorage | null = browserStorage()): { terms: GlossaryTerm[]; warning?: string } {
  if (!storage) return { terms: [], warning: 'A böngésző helyi tárolója nem érhető el, ezért a fogalomtár nem menthető.' };
  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEYS.glossary);
  } catch {
    return { terms: [], warning: 'A böngésző helyi tárolója nem olvasható.' };
  }
  if (!raw) return { terms: [] };
  const parsed = parseGlossaryJson(raw);
  if (!parsed.ok) return { terms: [], warning: 'A mentett fogalomtár sérült, ezért nem tölthető be. Új import felülírja.' };
  return { terms: parsed.terms };
}

/** Mentés; hiba esetén szöveges okot ad vissza. */
export function saveGlossary(terms: GlossaryTerm[], storage: GlossaryStorage | null = browserStorage()): string | null {
  if (!storage) return 'A böngésző helyi tárolója nem érhető el (pl. privát mód vagy letiltott webhelyadatok), ezért a fogalmak nem menthetők.';
  try {
    const text = exportGlossary(terms);
    storage.setItem(STORAGE_KEYS.glossary, text);
    if (storage.getItem(STORAGE_KEYS.glossary) !== text) return 'A mentés nem sikerült: a tárolt adat nem egyezik a mentettel.';
    return null;
  } catch (e) {
    const quota = e instanceof DOMException && (e.name === 'QuotaExceededError' || e.code === 22);
    return quota ? 'A mentés nem sikerült: betelt a böngésző helyi tárhelye.' : 'A mentés nem sikerült: a böngésző nem engedi az írást a helyi tárolóba.';
  }
}

/**
 * Import: validálás → összefésülés → mentés. Érvénytelen fájlnál vagy mentési hibánál a korábbi
 * fogalomtár változatlan marad.
 */
export function importIntoGlossary(existing: GlossaryTerm[], text: string, storage?: GlossaryStorage | null): { terms: GlossaryTerm[]; outcome: ImportOutcome } {
  const parsed = parseGlossaryJson(text);
  if (!parsed.ok) return { terms: existing, outcome: { kind: 'invalid', errors: parsed.errors } };
  const merged = mergeTerms(existing, parsed.terms);
  if (merged.added.length) {
    const err = persist(merged.terms, storage);
    if (err) return { terms: existing, outcome: { kind: 'save-failed', message: err } };
  }
  return { terms: merged.terms, outcome: { kind: 'success', added: merged.added, unchanged: merged.unchanged, conflicts: merged.conflicts } };
}

/** Mentés a megadott vagy (ha nincs megadva) a böngésző tárolójába. */
const persist = (terms: GlossaryTerm[], storage?: GlossaryStorage | null) => (storage === undefined ? saveGlossary(terms) : saveGlossary(terms, storage));

/** A felületi űrlap adatai (az azonosítót új fogalomnál a rendszer adja). */
export interface TermInput {
  name: string;
  definition: string;
  categories: string[];
  latin?: string;
  aliases?: string[];
}

export type EditOutcome =
  | { kind: 'saved'; mode: 'add' | 'edit'; term: GlossaryTerm }
  | { kind: 'invalid'; errors: FieldError[] }
  | { kind: 'not-found' }
  | { kind: 'save-failed'; message: string };

/**
 * Hozzáadás (id nélkül) vagy szerkesztés (meglévő id-vel). Ugyanazt a rekordvalidációt használja,
 * mint az import. Szerkesztéskor az azonosító és a fogalom helye a listában megmarad. Érvénytelen
 * adatnál vagy mentési hibánál a fogalomtár változatlan.
 */
export function saveTermIn(existing: GlossaryTerm[], input: TermInput, editId: string | null, storage?: GlossaryStorage | null): { terms: GlossaryTerm[]; outcome: EditOutcome } {
  if (editId !== null && !existing.some((t) => t.id === editId)) return { terms: existing, outcome: { kind: 'not-found' } };
  const id = editId ?? newTermId(existing.map((t) => t.id));
  const { term, errors } = validateTermRecord({ ...input, id, latin: input.latin?.trim() || undefined, aliases: input.aliases?.filter((a) => a.trim()) });
  if (!term) return { terms: existing, outcome: { kind: 'invalid', errors } };
  const terms = editId === null ? [...existing, term] : existing.map((t) => (t.id === editId ? term : t));
  const err = persist(terms, storage);
  if (err) return { terms: existing, outcome: { kind: 'save-failed', message: err } };
  return { terms, outcome: { kind: 'saved', mode: editId === null ? 'add' : 'edit', term } };
}

/** Egy fogalom törlése azonosító szerint; mentési hibánál a fogalomtár változatlan. */
export function deleteTermIn(existing: GlossaryTerm[], id: string, storage?: GlossaryStorage | null): { terms: GlossaryTerm[]; error: string | null } {
  if (!existing.some((t) => t.id === id)) return { terms: existing, error: 'A fogalom már nem szerepel a fogalomtárban.' };
  const terms = existing.filter((t) => t.id !== id);
  const err = persist(terms, storage);
  return err ? { terms: existing, error: err } : { terms, error: null };
}

interface GlossaryState {
  terms: GlossaryTerm[];
  loadWarning?: string;
  lastImport?: ImportOutcome & { fileName: string };
  importText: (text: string, fileName: string) => ImportOutcome;
  clearLastImport: () => void;
  saveTerm: (input: TermInput, editId: string | null) => EditOutcome;
  deleteTerm: (id: string) => string | null;
}

export const useGlossaryStore = create<GlossaryState>()((set, get) => {
  const initial = loadGlossary();
  return {
    terms: initial.terms,
    loadWarning: initial.warning,
    importText: (text, fileName) => {
      const { terms, outcome } = importIntoGlossary(get().terms, text);
      set({ terms, lastImport: { ...outcome, fileName }, ...(outcome.kind === 'success' && outcome.added.length ? { loadWarning: undefined } : {}) });
      return outcome;
    },
    clearLastImport: () => set({ lastImport: undefined }),
    saveTerm: (input, editId) => {
      const { terms, outcome } = saveTermIn(get().terms, input, editId);
      if (outcome.kind === 'saved') set({ terms, loadWarning: undefined });
      return outcome;
    },
    deleteTerm: (id) => {
      const { terms, error } = deleteTermIn(get().terms, id);
      if (!error) set({ terms });
      return error;
    }
  };
});
