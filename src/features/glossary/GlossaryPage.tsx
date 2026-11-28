import { useMemo, useRef, useState, type ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Download, FileJson, Search, Upload, X } from 'lucide-react';
import { Button, Panel, Segmented } from '../../components/ui';
import { FlashcardDeck } from '../../components/study/FlashcardDeck';
import { cardsFor, categoriesOf, describeError, exportGlossary, filterTerms, GLOSSARY_SCHEMA_VERSION, type GlossaryTerm } from '../../engines/glossary/glossary';
import { useGlossaryStore, type ImportOutcome } from '../../stores/glossaryStore';

type View = 'terms' | 'cards';
/** Ennél nagyobb fájlt nem olvasunk be (a LocalStorage kapacitása amúgy is néhány MB). */
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALL = '__all__';

/**
 * Fogalomtár: JSON-ből importált fogalmak listája és a belőlük előállított tanulókártyák.
 * Minden adat a böngészőben marad (LocalStorage); a modul nem tartalmaz fogalomadatot.
 */
export function GlossaryPage() {
  const terms = useGlossaryStore((s) => s.terms);
  const loadWarning = useGlossaryStore((s) => s.loadWarning);
  const lastImport = useGlossaryStore((s) => s.lastImport);
  const importText = useGlossaryStore((s) => s.importText);
  const clearLastImport = useGlossaryStore((s) => s.clearLastImport);
  const [view, setView] = useState<View>('terms');
  const [readError, setReadError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const onFile = async (file: File | undefined) => {
    setReadError(null);
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setReadError(`A fájl túl nagy (${(file.size / 1024 / 1024).toFixed(1)} MB). Legfeljebb 5 MB-os fájl importálható.`);
      return;
    }
    try {
      importText(await file.text(), file.name);
    } catch {
      setReadError('A fájl nem olvasható be.');
    }
  };

  const exportFile = () => {
    const blob = new Blob([exportGlossary(terms)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fogalomtar-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const importButton = (
    <Button onClick={() => fileInput.current?.click()}>
      <Upload size={15} /> JSON importálása
    </Button>
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          void onFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-ink">Fogalomtár</h1>
          <p className="text-xs text-ink-2">JSON-fájlból importált fogalmak és a belőlük készült tanulókártyák – minden adat ebben a böngészőben marad</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {terms.length > 0 && (
            <Segmented<View>
              label="Nézet"
              value={view}
              onChange={setView}
              options={[
                { value: 'terms', label: 'Fogalmak' },
                { value: 'cards', label: 'Tanulókártyák' }
              ]}
            />
          )}
          {importButton}
          <Button variant="outline" onClick={exportFile} disabled={!terms.length} title={terms.length ? 'A teljes fogalomtár letöltése importálható JSON-fájlként' : 'Nincs exportálható fogalom'}>
            <Download size={15} /> Exportálás JSON-ba
          </Button>
        </div>
      </div>

      {loadWarning && <Notice tone="warn">{loadWarning}</Notice>}
      {readError && <Notice tone="error" onClose={() => setReadError(null)}>{readError}</Notice>}
      {lastImport && <ImportReport outcome={lastImport} fileName={lastImport.fileName} onClose={clearLastImport} />}

      {terms.length === 0 ? (
        <Panel>
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <FileJson size={32} className="text-accent-2" aria-hidden="true" />
            <h2 className="font-serif text-lg text-ink">A fogalomtár még üres</h2>
            <p className="max-w-md text-sm text-ink-2">Fogalmakat JSON-fájlból adhatsz hozzá. Minden fogalomból automatikusan tanulókártya is készül.</p>
            {importButton}
          </div>
        </Panel>
      ) : view === 'terms' ? (
        <TermsView terms={terms} />
      ) : (
        <CardsView terms={terms} />
      )}

      <FormatHelp open={terms.length === 0} />
    </div>
  );
}

/* ---------------- Visszajelzések ---------------- */

function Notice({ tone, children, onClose }: { tone: 'ok' | 'warn' | 'error'; children: ReactNode; onClose?: () => void }) {
  const cls = tone === 'ok' ? 'border-emerald-500/50 bg-emerald-500/10' : tone === 'warn' ? 'border-amber-500/50 bg-amber-500/10' : 'border-red-500/50 bg-red-500/10';
  const Icon = tone === 'ok' ? CheckCircle2 : AlertTriangle;
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-2 rounded-xl border p-3 text-sm text-ink ${cls}`}>
      <Icon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">{children}</div>
      {onClose && (
        <button type="button" onClick={onClose} className="rounded-lg p-0.5 text-ink-2 hover:text-ink" aria-label="Üzenet bezárása">
          <X size={15} />
        </button>
      )}
    </div>
  );
}

function ImportReport({ outcome, fileName, onClose }: { outcome: ImportOutcome; fileName: string; onClose: () => void }) {
  if (outcome.kind === 'invalid')
    return (
      <Notice tone="error" onClose={onClose}>
        <p className="font-medium">A(z) „{fileName}” fájl nem importálható – a fogalomtár nem változott.</p>
        <ul className="mt-1 list-disc pl-5 text-xs">
          {outcome.errors.map((e, i) => (
            <li key={i}>{describeError(e)}</li>
          ))}
        </ul>
      </Notice>
    );
  if (outcome.kind === 'save-failed')
    return (
      <Notice tone="error" onClose={onClose}>
        <p className="font-medium">A(z) „{fileName}” fájl érvényes, de a fogalmak nem menthetők – a fogalomtár nem változott.</p>
        <p className="mt-1 text-xs">{outcome.message}</p>
      </Notice>
    );
  return (
    <Notice tone={outcome.conflicts.length ? 'warn' : 'ok'} onClose={onClose}>
      <p className="font-medium">Import kész: „{fileName}”</p>
      <p className="mt-1 text-xs">
        Új fogalom: <b>{outcome.added.length}</b> · már szerepelt: <b>{outcome.unchanged.length}</b> · ütközés: <b>{outcome.conflicts.length}</b>
      </p>
      {outcome.conflicts.length > 0 && (
        <p className="mt-1 text-xs">
          Ezekhez az azonosítókhoz eltérő tartalom érkezett, a meglévő rekord maradt meg: {outcome.conflicts.map((id) => `„${id}”`).join(', ')}.
        </p>
      )}
    </Notice>
  );
}

/* ---------------- Fogalmak ---------------- */

function CategorySelect({ categories, value, onChange, id }: { categories: string[]; value: string; onChange: (v: string) => void; id: string }) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1 text-xs text-ink-2">
      Témakör
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink">
        <option value={ALL}>Összes témakör</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}

function TermsView({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL);
  const categories = useMemo(() => categoriesOf(terms), [terms]);
  const cat = categories.includes(category) ? category : ALL;
  const list = useMemo(() => filterTerms(terms, cat === ALL ? null : cat, query), [terms, cat, query]);
  return (
    <Panel>
      <div className="mb-3 grid gap-3 sm:grid-cols-[1fr_16rem]">
        <label htmlFor="gl-search" className="flex flex-col gap-1 text-xs text-ink-2">
          Keresés (név, latin megfelelő, szinonima – ékezettel vagy anélkül)
          <span className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-2" aria-hidden="true" />
            <input
              id="gl-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Keresés…"
              className="w-full rounded-xl border border-line bg-surface py-2 pl-9 pr-3 text-sm text-ink"
            />
          </span>
        </label>
        <CategorySelect id="gl-category" categories={categories} value={cat} onChange={setCategory} />
      </div>
      <p className="mb-2 text-xs text-ink-2" aria-live="polite">
        {list.length} / {terms.length} fogalom
      </p>
      {list.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-2">Nincs a szűrésnek megfelelő fogalom.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {list.map((t) => (
            <li key={t.id} className="py-3">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <h3 className="font-serif text-lg text-ink">{t.name}</h3>
                {t.latin && <span className="text-sm italic text-ink-2">{t.latin}</span>}
              </div>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink">{t.definition}</p>
              {t.aliases && t.aliases.length > 0 && <p className="mt-1 text-xs text-ink-2">Szinonimák: {t.aliases.join(', ')}</p>}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {t.categories.map((c) => (
                  <span key={c} className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-2">
                    {c}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ---------------- Tanulókártyák ---------------- */

function CardsView({ terms }: { terms: GlossaryTerm[] }) {
  const [category, setCategory] = useState(ALL);
  const categories = useMemo(() => categoriesOf(terms), [terms]);
  const cat = categories.includes(category) ? category : ALL;
  const cards = useMemo(() => cardsFor(terms, cat === ALL ? null : cat), [terms, cat]);
  return (
    <div className="flex flex-col gap-3">
      <div className="mx-auto w-full max-w-2xl">
        <CategorySelect id="gl-card-category" categories={categories} value={cat} onChange={setCategory} />
      </div>
      <FlashcardDeck
        key={`${cat}:${cards.length}`}
        cards={cards.map((c) => ({
          id: c.id,
          label: cat === ALL ? 'Fogalomtár' : cat,
          front: c.front,
          back: (
            <span className="flex flex-col gap-2">
              <span className="whitespace-pre-line">{c.definition}</span>
              {c.latin && (
                <span className="text-sm text-ink-2">
                  Latinul: <i>{c.latin}</i>
                </span>
              )}
              {c.aliases.length > 0 && <span className="text-sm text-ink-2">Szinonimák: {c.aliases.join(', ')}</span>}
            </span>
          )
        }))}
      />
    </div>
  );
}

/* ---------------- Formátum ---------------- */

function FormatHelp({ open }: { open: boolean }) {
  return (
    <details open={open} className="rounded-2xl border border-line bg-surface p-4 text-sm text-ink">
      <summary className="cursor-pointer font-medium">Az importálható JSON-fájl formátuma</summary>
      <div className="mt-3 flex flex-col gap-2 text-ink-2">
        <p>
          A fájl gyökere egy objektum két mezővel: <code>version</code> (a támogatott sémaverzió: <code>{GLOSSARY_SCHEMA_VERSION}</code>) és <code>terms</code> (a fogalmak
          tömbje). Minden fogalom egy objektum:
        </p>
        <ul className="list-disc pl-5">
          <li>
            <code>id</code> – kötelező, stabil szöveges azonosító; ez alapján bővül a fogalomtár
          </li>
          <li>
            <code>name</code> – kötelező, a fogalom neve (a kártya előlapja)
          </li>
          <li>
            <code>definition</code> – kötelező, a definíció
          </li>
          <li>
            <code>categories</code> – kötelező szöveges tömb, legalább egy témakörrel
          </li>
          <li>
            <code>latin</code> – opcionális szöveg
          </li>
          <li>
            <code>aliases</code> – opcionális szöveges tömb (szinonimák)
          </li>
        </ul>
        <pre className="overflow-x-auto rounded-xl bg-bg-2 p-3 text-xs text-ink">{`{
  "version": ${GLOSSARY_SCHEMA_VERSION},
  "terms": [
    { "id": "…", "name": "…", "definition": "…", "categories": ["…"],
      "latin": "…", "aliases": ["…"] }
  ]
}`}</pre>
        <p>
          A teljes fájlt ellenőrizzük mentés előtt: ha bármelyik tétel hibás, semmi nem kerül be. Ismételt importnál a már meglévő azonosítók nem duplikálódnak; ha egy meglévő
          azonosítóhoz eltérő tartalom érkezik, a meglévő rekord marad meg, és az import jelzi az ütközést. Az „Exportálás JSON-ba” ugyanebben a formátumban menti a teljes
          fogalomtárat.
        </p>
      </div>
    </details>
  );
}
