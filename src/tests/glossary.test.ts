import { beforeEach, describe, expect, it } from 'vitest';
import { cardsFor, categoriesOf, exportGlossary, filterTerms, matchesQuery, mergeTerms, normalizeText, parseGlossaryJson, type GlossaryTerm } from '../engines/glossary/glossary';
import { importIntoGlossary, loadGlossary, saveGlossary, useGlossaryStore, type GlossaryStorage } from '../stores/glossaryStore';
import { STORAGE_KEYS } from '../services/storage';

/* Minimális, csak a tesztben élő objektumok – nem kerülnek a felhasználói fogalomtárba. */
const a: GlossaryTerm = { id: 't-a', name: 'Ízület', definition: 'Teszt A.', categories: ['K1'], latin: 'Articulatio', aliases: ['Csontkapcsolat'] };
const b: GlossaryTerm = { id: 't-b', name: 'Bőny', definition: 'Teszt B.', categories: ['K1', 'K2'] };
const c: GlossaryTerm = { id: 't-c', name: 'Szalag', definition: 'Teszt C.', categories: ['K2'] };
const file = (...terms: unknown[]) => JSON.stringify({ version: 1, terms });

/** Memóriabeli tároló; `failWrites` esetén írási hibát dob. */
function memory(failWrites = false): GlossaryStorage & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => {
      if (failWrites) throw new DOMException('full', 'QuotaExceededError');
      data.set(k, v);
    }
  };
}

describe('Fogalomtár – JSON-validálás', () => {
  it('érvényes fájlt elfogad, és csak az ismert mezőket tartja meg', () => {
    const r = parseGlossaryJson(file({ ...a, extra: '<b>x</b>' }, b));
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.terms).toHaveLength(2);
      expect(r.terms[0]).toEqual(a);
    }
  });

  it('hibás JSON-ra, hiányzó vagy nem támogatott verzióra magyar hibát ad', () => {
    const bad = parseGlossaryJson('{ "version": 1, "terms": [ ');
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.errors[0]!.message).toMatch(/nem érvényes JSON/);
    const v2 = parseGlossaryJson(JSON.stringify({ version: 2, terms: [] }));
    if (!v2.ok) expect(v2.errors[0]!.message).toMatch(/Nem támogatott sémaverzió/);
    else throw new Error('a 2-es verziót el kellett volna utasítani');
    const noTerms = parseGlossaryJson(JSON.stringify({ version: 1 }));
    expect(noTerms.ok).toBe(false);
  });

  it('rekordhibánál megjelöli a tételt és a mezőt', () => {
    const r = parseGlossaryJson(file(a, { id: 'x', name: '', definition: 'd', categories: [] }, { id: 'y', name: 'n', definition: 'd', categories: ['k'], aliases: 'nem tömb' }));
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors).toContainEqual(expect.objectContaining({ item: 2, id: 'x', field: 'name' }));
    expect(r.errors).toContainEqual(expect.objectContaining({ item: 2, id: 'x', field: 'categories' }));
    expect(r.errors).toContainEqual(expect.objectContaining({ item: 3, id: 'y', field: 'aliases' }));
  });

  it('a fájlon belüli eltérő tartalmú ismételt azonosító hiba, az azonos ismétlés nem', () => {
    expect(parseGlossaryJson(file(a, a)).ok).toBe(true);
    const r = parseGlossaryJson(file(a, { ...a, definition: 'más' }));
    expect(r.ok).toBe(false);
  });
});

describe('Fogalomtár – összefésülés, mentés, újratöltés, export', () => {
  it('ismételt import nem duplikál; eltérő tartalom ütközés, a meglévő marad', () => {
    const first = mergeTerms([], [a, b]);
    expect(first.added).toEqual(['t-a', 't-b']);
    const again = mergeTerms(first.terms, [a, b]);
    expect(again.terms).toHaveLength(2);
    expect(again.unchanged).toEqual(['t-a', 't-b']);
    const conflict = mergeTerms(again.terms, [{ ...a, definition: 'Módosított.' }, c]);
    expect(conflict.conflicts).toEqual(['t-a']);
    expect(conflict.added).toEqual(['t-c']);
    expect(conflict.terms.find((t) => t.id === 't-a')!.definition).toBe('Teszt A.');
  });

  it('érvényes import ment, újratöltéskor visszaolvasható; érvénytelen import nem változtat', () => {
    const store = memory();
    const r1 = importIntoGlossary([], file(a, b), store);
    expect(r1.outcome).toEqual({ kind: 'success', added: ['t-a', 't-b'], unchanged: [], conflicts: [] });
    expect(loadGlossary(store).terms.map((t) => t.id).sort()).toEqual(['t-a', 't-b']);

    const saved = store.data.get(STORAGE_KEYS.glossary);
    const r2 = importIntoGlossary(r1.terms, file(c, { id: 'rossz' }), store);
    expect(r2.outcome.kind).toBe('invalid');
    expect(r2.terms).toBe(r1.terms);
    expect(store.data.get(STORAGE_KEYS.glossary)).toBe(saved);
  });

  it('mentési hibánál a korábbi fogalomtár marad, és érthető üzenet jön', () => {
    const r = importIntoGlossary([a], file(b), memory(true));
    expect(r.outcome.kind).toBe('save-failed');
    if (r.outcome.kind === 'save-failed') expect(r.outcome.message).toMatch(/betelt/);
    expect(r.terms).toEqual([a]);
    expect(saveGlossary([a], null)).toMatch(/nem érhető el/);
  });

  it('az export visszaimportálható: másik böngészőben ugyanaz lesz, ugyanoda újra importálva nem duplikál', () => {
    const text = exportGlossary([b, a, c]);
    const other = importIntoGlossary([], text, memory());
    expect(other.outcome.kind === 'success' && other.outcome.added.length).toBe(3);
    const same = importIntoGlossary([a, b, c], text, memory());
    // Az export név szerint rendez (Bőny, Ízület, Szalag).
    expect(same.outcome).toEqual({ kind: 'success', added: [], unchanged: ['t-b', 't-a', 't-c'], conflicts: [] });
  });

  it('sérült mentett adatnál üres fogalomtár és figyelmeztetés', () => {
    const store = memory();
    store.data.set(STORAGE_KEYS.glossary, '{nem json');
    const r = loadGlossary(store);
    expect(r.terms).toEqual([]);
    expect(r.warning).toMatch(/sérült/);
  });
});

describe('Fogalomtár – keresés, témakörök, kártyák', () => {
  it('az ékezetes és ékezet nélküli alakot is megtalálja névben, latin névben és szinonimában', () => {
    expect(normalizeText('Ízület Bőny Ő')).toBe('izulet bony o');
    expect(matchesQuery(a, 'izulet')).toBe(true);
    expect(matchesQuery(a, 'ÍZÜL')).toBe(true);
    expect(matchesQuery(a, 'articul')).toBe(true);
    expect(matchesQuery(a, 'csontkapcs')).toBe(true);
    expect(matchesQuery(a, 'Teszt')).toBe(false); // a definícióban nem keres
    expect(matchesQuery(b, 'bony')).toBe(true);
  });

  it('a témakörök a rekordokból állnak elő; a több témakörű fogalom minden szűrőben, az összesben egyszer', () => {
    const terms = [a, b, c];
    expect(categoriesOf(terms)).toEqual(['K1', 'K2']);
    expect(filterTerms(terms, 'K1').map((t) => t.id)).toEqual(['t-b', 't-a']);
    expect(filterTerms(terms, 'K2').map((t) => t.id)).toEqual(['t-b', 't-c']);
    expect(cardsFor(terms, null).map((x) => x.termId)).toEqual(['t-b', 't-a', 't-c']);
    expect(cardsFor(terms, 'K2')).toHaveLength(2);
  });

  it('fogalmanként pontosan egy kártya: előlap a név, hátlap a definíció, latin név és szinonimák', () => {
    const [card] = cardsFor([a], null);
    expect(card).toEqual({ id: 'gl-t-a', termId: 't-a', front: 'Ízület', definition: 'Teszt A.', latin: 'Articulatio', aliases: ['Csontkapcsolat'], categories: ['K1'] });
  });
});

describe('Fogalomtár – állapot', () => {
  beforeEach(() => {
    localStorage.clear();
    useGlossaryStore.setState({ terms: [], lastImport: undefined, loadWarning: undefined });
  });

  it('első megnyitáskor üres, sikeres import után azonnal elérhetők a kártyák, és a LocalStorage-ba mentődik', () => {
    expect(useGlossaryStore.getState().terms).toEqual([]);
    const outcome = useGlossaryStore.getState().importText(file(a, b), 'teszt.json');
    expect(outcome.kind).toBe('success');
    expect(cardsFor(useGlossaryStore.getState().terms, null)).toHaveLength(2);
    expect(loadGlossary().terms).toHaveLength(2);
    expect(useGlossaryStore.getState().lastImport).toMatchObject({ kind: 'success', fileName: 'teszt.json' });
  });
});
