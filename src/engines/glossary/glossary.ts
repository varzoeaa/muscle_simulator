/**
 * Fogalomtár – tiszta függvények: a JSON-import validálása, az azonosító szerinti összefésülés,
 * az ékezetfüggetlen keresés, a témakörök és a tanulókártyák előállítása, valamint az export.
 * A felület és a tárolás ezekre épül; a modul nem tartalmaz fogalomadatot.
 */

/** A támogatott sémaverzió(k). */
export const GLOSSARY_SCHEMA_VERSION = 1;

export interface GlossaryTerm {
  /** Stabil szöveges azonosító – az import ez alapján fésül össze. */
  id: string;
  name: string;
  definition: string;
  /** Legalább egy témakör; egy fogalom több témakörhöz is tartozhat. */
  categories: string[];
  latin?: string;
  aliases?: string[];
}

export interface GlossaryFile {
  version: typeof GLOSSARY_SCHEMA_VERSION;
  terms: GlossaryTerm[];
}

export interface GlossaryError {
  /** A hibás tétel 1-től számozott sorszáma a `terms` tömbben (ha tételhez tartozik). */
  item?: number;
  /** A hibás tétel azonosítója, ha olvasható. */
  id?: string;
  /** A hibás mező neve (pl. `name`, `categories[2]`). */
  field?: string;
  message: string;
}

export type ParseResult = { ok: true; terms: GlossaryTerm[] } | { ok: false; errors: GlossaryError[] };

/** Ennyi hibánál többet nem sorolunk fel; a teljes fájl ettől még érvénytelen. */
const MAX_ERRORS = 50;

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const nonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

export interface FieldError {
  /** A hibás mező neve (pl. `name`, `categories[2]`). */
  field?: string;
  message: string;
}

/**
 * Egy rekord validálása és megtisztítása – ezt használja a JSON-import és a felületi űrlap is.
 * Csak az ismert mezőket tartja meg, a szövegeket levágja, a tömbökből kiszűri az ismétlést.
 */
export function validateTermRecord(raw: unknown): { term: GlossaryTerm | null; errors: FieldError[] } {
  if (!isObject(raw)) return { term: null, errors: [{ message: 'A tétel nem objektum.' }] };
  const errors: FieldError[] = [];
  const err = (field: string, message: string) => errors.push({ field, message });

  if (!nonEmptyString(raw.id)) err('id', 'Kötelező, nem üres szöveg.');
  if (!nonEmptyString(raw.name)) err('name', 'Kötelező, nem üres szöveg.');
  if (!nonEmptyString(raw.definition)) err('definition', 'Kötelező, nem üres szöveg.');

  if (!Array.isArray(raw.categories)) err('categories', 'Kötelező szöveges tömb, legalább egy elemmel.');
  else if (raw.categories.length === 0) err('categories', 'Legalább egy témakört meg kell adni.');
  else raw.categories.forEach((c, i) => !nonEmptyString(c) && err(`categories[${i}]`, 'A témakör nem üres szöveg legyen.'));

  if (raw.latin !== undefined && raw.latin !== null && typeof raw.latin !== 'string') err('latin', 'Ha megadod, szöveg legyen.');
  if (raw.aliases !== undefined && raw.aliases !== null) {
    if (!Array.isArray(raw.aliases)) err('aliases', 'Ha megadod, szöveges tömb legyen.');
    else raw.aliases.forEach((a, i) => !nonEmptyString(a) && err(`aliases[${i}]`, 'A szinonima nem üres szöveg legyen.'));
  }
  if (errors.length) return { term: null, errors };

  const dedupe = (xs: string[]) => [...new Set(xs.map((x) => x.trim()))];
  const term: GlossaryTerm = {
    id: (raw.id as string).trim(),
    name: (raw.name as string).trim(),
    definition: (raw.definition as string).trim(),
    categories: dedupe(raw.categories as string[])
  };
  if (typeof raw.latin === 'string' && raw.latin.trim()) term.latin = raw.latin.trim();
  if (Array.isArray(raw.aliases)) {
    const aliases = dedupe(raw.aliases as string[]);
    if (aliases.length) term.aliases = aliases;
  }
  return { term, errors: [] };
}

/** Import: a rekordhibákat a tétel sorszámával és azonosítójával egészíti ki. */
function validateTerm(raw: unknown, index: number, errors: GlossaryError[]): GlossaryTerm | null {
  const { term, errors: fieldErrors } = validateTermRecord(raw);
  const id = isObject(raw) && nonEmptyString(raw.id) ? raw.id.trim() : undefined;
  fieldErrors.forEach((e) => errors.push({ item: index + 1, id, ...e }));
  return term;
}

/**
 * Stabil, egyedi azonosító új, felületen felvett fogalomhoz. A névtől független, ezért a név
 * későbbi módosítása nem változtatja meg.
 */
export function newTermId(existingIds: Iterable<string>): string {
  const taken = new Set(existingIds);
  const random = () => {
    try {
      if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID().slice(0, 8);
    } catch {
      /* nincs crypto */
    }
    return Math.random().toString(36).slice(2, 10);
  };
  let id: string;
  do id = `sajat-${Date.now().toString(36)}-${random()}`;
  while (taken.has(id));
  return id;
}

/** Egy már beolvasott (JSON.parse utáni) érték validálása. A teljes fájl vagy érvényes, vagy nem. */
export function validateGlossary(data: unknown): ParseResult {
  if (!isObject(data)) return { ok: false, errors: [{ message: 'A fájl gyökere nem objektum. Várt szerkezet: { "version": 1, "terms": [...] }.' }] };
  if (data.version === undefined) return { ok: false, errors: [{ field: 'version', message: 'Hiányzik a „version” mező.' }] };
  if (data.version !== GLOSSARY_SCHEMA_VERSION)
    return { ok: false, errors: [{ field: 'version', message: `Nem támogatott sémaverzió: ${JSON.stringify(data.version)}. A támogatott verzió: ${GLOSSARY_SCHEMA_VERSION}.` }] };
  if (!Array.isArray(data.terms)) return { ok: false, errors: [{ field: 'terms', message: 'A „terms” mező hiányzik, vagy nem tömb.' }] };

  const errors: GlossaryError[] = [];
  const terms: GlossaryTerm[] = [];
  const seen = new Map<string, number>();
  data.terms.forEach((raw, i) => {
    const t = validateTerm(raw, i, errors);
    if (!t) return;
    const first = seen.get(t.id);
    if (first !== undefined) {
      if (!sameTerm(terms[first]!, t)) errors.push({ item: i + 1, id: t.id, field: 'id', message: `Az azonosító már szerepel a fájlban (${first + 1}. tétel) eltérő tartalommal.` });
      return; // azonos tartalmú ismétlés: egyszer vesszük fel
    }
    seen.set(t.id, terms.length);
    terms.push(t);
  });
  if (errors.length) return { ok: false, errors: errors.slice(0, MAX_ERRORS) };
  return { ok: true, terms };
}

/** Szöveges fájltartalom értelmezése és validálása. */
export function parseGlossaryJson(text: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(text.replace(/^﻿/, ''));
  } catch {
    return { ok: false, errors: [{ message: 'A fájl nem érvényes JSON. Ellenőrizd a zárójeleket, az idézőjeleket és a vesszőket (például nincs-e vessző az utolsó elem után).' }] };
  }
  return validateGlossary(data);
}

/** Két rekord tartalmilag azonos-e (a mezők sorrendje nem számít, a tömbök elemsorrendje igen). */
export function sameTerm(a: GlossaryTerm, b: GlossaryTerm): boolean {
  const arr = (x?: string[]) => JSON.stringify(x ?? []);
  return a.id === b.id && a.name === b.name && a.definition === b.definition && (a.latin ?? '') === (b.latin ?? '') && arr(a.categories) === arr(b.categories) && arr(a.aliases) === arr(b.aliases);
}

export interface MergeResult {
  terms: GlossaryTerm[];
  /** Új azonosítók – bekerültek. */
  added: string[];
  /** Már szereplő, azonos tartalmú rekordok. */
  unchanged: string[];
  /** Már szereplő azonosító eltérő tartalommal – a meglévő rekord maradt meg. */
  conflicts: string[];
}

/** Azonosító szerinti bővítés: új rekord bekerül, azonos marad, eltérő tartalom ütközés (a meglévő marad). */
export function mergeTerms(existing: GlossaryTerm[], incoming: GlossaryTerm[]): MergeResult {
  const byId = new Map(existing.map((t) => [t.id, t]));
  const terms = [...existing];
  const result: MergeResult = { terms, added: [], unchanged: [], conflicts: [] };
  incoming.forEach((t) => {
    const old = byId.get(t.id);
    if (!old) {
      byId.set(t.id, t);
      terms.push(t);
      result.added.push(t.id);
    } else if (sameTerm(old, t)) result.unchanged.push(t.id);
    else result.conflicts.push(t.id);
  });
  return result;
}

/** Kisbetűs, ékezet nélküli alak a kereséshez (pl. „Ízület” → „izulet”, „ő” → „o”). */
export const normalizeText = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

/** Keresés névre, latin megfelelőre és szinonimákra; ékezetfüggetlen. */
export function matchesQuery(t: GlossaryTerm, query: string): boolean {
  const q = normalizeText(query);
  if (!q) return true;
  return [t.name, t.latin ?? '', ...(t.aliases ?? [])].some((x) => normalizeText(x).includes(q));
}

const collator = new Intl.Collator('hu', { sensitivity: 'base' });
export const sortTerms = (terms: GlossaryTerm[]) => [...terms].sort((a, b) => collator.compare(a.name, b.name) || a.id.localeCompare(b.id));

/** A rekordokból előálló témakörök, ábécérendben. */
export const categoriesOf = (terms: GlossaryTerm[]) => [...new Set(terms.flatMap((t) => t.categories))].sort(collator.compare);

/** Szűrés témakörre (null: összes) és keresőszóra; ábécérendben. Minden fogalom legfeljebb egyszer szerepel. */
export function filterTerms(terms: GlossaryTerm[], category: string | null, query = ''): GlossaryTerm[] {
  return sortTerms(terms.filter((t) => (category === null || t.categories.includes(category)) && matchesQuery(t, query)));
}

export interface GlossaryCard {
  id: string;
  termId: string;
  front: string;
  definition: string;
  latin?: string;
  aliases: string[];
  categories: string[];
}

/** Fogalmanként pontosan egy tanulókártya, a fogalomtár rekordjaiból előállítva (külön nem tároljuk). */
export const cardsFor = (terms: GlossaryTerm[], category: string | null): GlossaryCard[] =>
  filterTerms(terms, category).map((t) => ({ id: `gl-${t.id}`, termId: t.id, front: t.name, definition: t.definition, latin: t.latin, aliases: t.aliases ?? [], categories: t.categories }));

/** Az importtal kompatibilis export szövege. */
export const exportGlossary = (terms: GlossaryTerm[]): string => JSON.stringify({ version: GLOSSARY_SCHEMA_VERSION, terms: sortTerms(terms) } satisfies GlossaryFile, null, 2);

/** Rövid, magyar nyelvű hibaszöveg egy hibához (tétel és mező megjelölésével). */
export function describeError(e: GlossaryError): string {
  const where = [e.item ? `${e.item}. tétel` : '', e.id ? `(id: „${e.id}”)` : '', e.field ? `„${e.field}” mező` : ''].filter(Boolean).join(' ');
  return where ? `${where}: ${e.message}` : e.message;
}
