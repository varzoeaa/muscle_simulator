import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Plus, X } from 'lucide-react';
import { Button, Panel } from '../../components/ui';
import type { FieldError, GlossaryTerm } from '../../engines/glossary/glossary';
import type { EditOutcome, TermInput } from '../../stores/glossaryStore';

type FieldKey = 'name' | 'definition' | 'categories' | 'latin' | 'aliases';

/** A validációs hibák mezőnkénti, rövid magyar üzenetei (az import és az űrlap ugyanazt a validációt használja). */
const messages: Record<FieldKey, string> = {
  name: 'Add meg a fogalom nevét.',
  definition: 'Add meg a definíciót.',
  categories: 'Válassz vagy adj meg legalább egy témakört.',
  latin: 'A latin megfelelő szöveg legyen.',
  aliases: 'Minden szinonima legyen nem üres szöveg.'
};

const fieldOf = (e: FieldError): FieldKey | null => {
  const base = e.field?.replace(/\[\d+\]$/, '');
  return base && base in messages ? (base as FieldKey) : null;
};

/**
 * Fogalom hozzáadása és szerkesztése ugyanazzal az űrlappal. A bevitt értékek hiba esetén az
 * űrlapon maradnak; a „Mégse” semmit nem ír a tárolóba.
 */
export function TermForm({
  initial,
  categories,
  onSubmit,
  onCancel
}: {
  /** Szerkesztett fogalom (null: új fogalom). */
  initial: GlossaryTerm | null;
  /** A fogalomtár meglévő témakörei. */
  categories: string[];
  onSubmit: (input: TermInput) => EditOutcome;
  onCancel: () => void;
}) {
  const uid = useId();
  const [name, setName] = useState(initial?.name ?? '');
  const [definition, setDefinition] = useState(initial?.definition ?? '');
  const [latin, setLatin] = useState(initial?.latin ?? '');
  const [aliases, setAliases] = useState((initial?.aliases ?? []).join('\n'));
  const [selected, setSelected] = useState<string[]>(initial?.categories ?? []);
  const [newCategory, setNewCategory] = useState('');
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => firstField.current?.focus(), []);

  const allCategories = [...new Set([...categories, ...selected])];
  const toggle = (c: string) => setSelected((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  const addCategory = () => {
    const c = newCategory.trim();
    if (!c) return;
    setSelected((s) => (s.includes(c) ? s : [...s, c]));
    setNewCategory('');
    setErrors((e) => ({ ...e, categories: undefined }));
  };
  const onNewCategoryKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCategory();
    }
  };

  const submit = () => {
    // A beírt, de még fel nem vett új témakört is figyelembe vesszük.
    const pending = newCategory.trim();
    const cats = pending && !selected.includes(pending) ? [...selected, pending] : selected;
    const input: TermInput = {
      name,
      definition,
      categories: cats,
      latin: latin.trim() || undefined,
      aliases: aliases
        .split('\n')
        .map((a) => a.trim())
        .filter(Boolean)
    };
    const outcome = onSubmit(input);
    if (outcome.kind === 'invalid') {
      const next: Partial<Record<FieldKey, string>> = {};
      outcome.errors.forEach((e) => {
        const f = fieldOf(e);
        if (f) next[f] = messages[f];
      });
      setErrors(next);
      setFormError(Object.keys(next).length ? null : 'A fogalom nem menthető.');
      if (pending) {
        setSelected(cats);
        setNewCategory('');
      }
    } else if (outcome.kind === 'save-failed') setFormError(outcome.message);
    else if (outcome.kind === 'not-found') setFormError('A szerkesztett fogalom közben törlődött.');
  };

  const field = (key: FieldKey, label: string, control: ReactNode, hint?: string) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={`${uid}-${key}`} className="text-xs font-medium text-ink">
        {label}
      </label>
      {control}
      {hint && !errors[key] && <span className="text-[11px] text-ink-2">{hint}</span>}
      {errors[key] && (
        <span id={`${uid}-${key}-err`} className="text-xs text-red-500">
          {errors[key]}
        </span>
      )}
    </div>
  );
  const inputCls = (key: FieldKey) => `rounded-xl border bg-surface px-3 py-2 text-sm text-ink ${errors[key] ? 'border-red-500' : 'border-line'}`;
  const aria = (key: FieldKey) => ({ 'aria-invalid': !!errors[key] || undefined, 'aria-describedby': errors[key] ? `${uid}-${key}-err` : undefined });

  return (
    <Panel title={initial ? `Fogalom szerkesztése: ${initial.name}` : 'Új fogalom'} subtitle="A csillaggal jelölt mezők kötelezők">
      <form
        noValidate
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        onKeyDown={(e) => e.key === 'Escape' && onCancel()}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {field('name', 'Név *', <input ref={firstField} id={`${uid}-name`} value={name} onChange={(e) => setName(e.target.value)} className={inputCls('name')} {...aria('name')} />)}
          {field('latin', 'Latin megfelelő', <input id={`${uid}-latin`} value={latin} onChange={(e) => setLatin(e.target.value)} className={inputCls('latin')} {...aria('latin')} />)}
        </div>
        {field(
          'definition',
          'Definíció *',
          <textarea id={`${uid}-definition`} rows={4} value={definition} onChange={(e) => setDefinition(e.target.value)} className={inputCls('definition')} {...aria('definition')} />
        )}

        <fieldset className="flex flex-col gap-2" aria-describedby={errors.categories ? `${uid}-categories-err` : undefined}>
          <legend className="mb-1 text-xs font-medium text-ink">Témakörök * (több is választható)</legend>
          {allCategories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {allCategories.map((c) => {
                const on = selected.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(c)}
                    className={`rounded-full border px-2.5 py-1 text-xs ${on ? 'border-accent-2 bg-accent/30 text-ink' : 'border-line text-ink-2 hover:text-ink'}`}
                  >
                    {on ? '✓ ' : ''}
                    {c}
                  </button>
                );
              })}
            </div>
          )}
          <div className="flex gap-2">
            <input
              id={`${uid}-categories`}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={onNewCategoryKey}
              placeholder="Új témakör"
              aria-label="Új témakör neve"
              className={`min-w-0 flex-1 ${inputCls('categories')}`}
            />
            <Button variant="outline" onClick={addCategory} disabled={!newCategory.trim()}>
              <Plus size={15} /> Hozzáadás
            </Button>
          </div>
          {errors.categories && (
            <span id={`${uid}-categories-err`} className="text-xs text-red-500">
              {errors.categories}
            </span>
          )}
        </fieldset>

        {field(
          'aliases',
          'Szinonimák',
          <textarea id={`${uid}-aliases`} rows={2} value={aliases} onChange={(e) => setAliases(e.target.value)} className={inputCls('aliases')} {...aria('aliases')} />,
          'Soronként egy szinonima.'
        )}

        {formError && (
          <p role="alert" className="rounded-xl border border-red-500/50 bg-red-500/10 p-2 text-sm text-ink">
            {formError}
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Mégse
          </Button>
          <Button type="submit">Mentés</Button>
        </div>
      </form>
    </Panel>
  );
}

/** Megerősítő párbeszédablak (pl. törlés előtt). Escape vagy a háttérre kattintás bezárja. */
export function ConfirmDialog({ title, children, confirmLabel, onConfirm, onCancel }: { title: string; children: ReactNode; confirmLabel: string; onConfirm: () => void; onCancel: () => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onCancel}>
      <div role="alertdialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-md rounded-2xl border border-line bg-surface p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-2">
          <h2 id={titleId} className="font-serif text-lg text-ink">
            {title}
          </h2>
          <button type="button" onClick={onCancel} className="rounded-lg p-0.5 text-ink-2 hover:text-ink" aria-label="Bezárás">
            <X size={16} />
          </button>
        </div>
        <div className="mt-2 text-sm text-ink-2">{children}</div>
        <div className="mt-4 flex justify-end gap-2">
          <button ref={cancelRef} type="button" onClick={onCancel} className="rounded-xl border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-bg-2">
            Mégse
          </button>
          <button type="button" onClick={onConfirm} className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white hover:brightness-110">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
