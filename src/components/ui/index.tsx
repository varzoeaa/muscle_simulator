import type { ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import type { Claim, EvidenceLevel, Term } from '../../types';
import { sourceById } from '../../data/sources/sources';

export function Panel({ title, subtitle, children, className = '', actions }: { title?: ReactNode; subtitle?: ReactNode; children: ReactNode; className?: string; actions?: ReactNode }) {
  return (
    <section className={`rounded-2xl border border-line bg-surface p-4 ${className}`}>
      {(title || actions) && (
        <header className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-sm font-semibold tracking-wide text-ink">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-ink-2">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export function TermBlock({ term, size = 'md' }: { term: Term; size?: 'sm' | 'md' | 'lg' }) {
  const main = size === 'lg' ? 'text-2xl md:text-3xl font-serif' : size === 'md' ? 'text-base font-medium' : 'text-sm font-medium';
  return (
    <div>
      <div className={`${main} text-ink`}>{term.hu}</div>
      <div className="mt-0.5 text-xs text-ink-2">
        <span>{term.en}</span>
        {term.la && (
          <>
            <span className="mx-1.5 opacity-50">·</span>
            <span className="italic">{term.la}</span>
          </>
        )}
      </div>
    </div>
  );
}

/** Rövid háromnyelvű címke egy sorban. */
export function TermInline({ term }: { term: Term }) {
  return (
    <span>
      {term.hu}
      <span className="ml-1 text-ink-2">
        ({term.en}
        {term.la ? <>, <i>{term.la}</i></> : null})
      </span>
    </span>
  );
}

const evidenceMeta: Record<EvidenceLevel, { label: string; cls: string; title: string }> = {
  'anatomical-fact': { label: 'Anatómiai tény', cls: '', title: 'Tankönyvi szinten elfogadott, ellenőrzött anatómiai tény' },
  'documented-observation': { label: 'Dokumentált megfigyelés', cls: '', title: 'Tudományos vizsgálatban dokumentált megfigyelés' },
  'educational-model': { label: 'Oktatási modell', cls: '', title: 'Egyszerűsített oktatási modell / szemléltetés' },
  'pending-verification': { label: 'Ellenőrzésre vár', cls: '', title: 'Ellenőrzésre váró információ' }
};

export function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  const m = evidenceMeta[level];
  return (
    <span title={m.title} className={`inline-flex shrink-0 items-center rounded-full border px-1.5 py-px text-[10px] font-medium uppercase tracking-wide ${m.cls} evidence-${level}`}>
      {m.label}
    </span>
  );
}

export function SourceRefs({ ids }: { ids: string[] }) {
  if (!ids.length) return null;
  return (
    <span className="text-[11px] text-ink-2">
      {ids.map((id, i) => {
        const s = sourceById(id);
        if (!s) return null;
        const short = `${s.authors.split(/[,(]/)[0]!.trim()}${s.year ? ` ${s.year}` : ''}`;
        return (
          <span key={id}>
            {i > 0 && '; '}
            <button
              type="button"
              className="underline decoration-dotted underline-offset-2 hover:text-ink"
              title={`${s.authors}: ${s.title}${s.year ? ` (${s.year})` : ''}`}
              onClick={() => document.getElementById(`forras-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            >
              {short}
            </button>
          </span>
        );
      })}
    </span>
  );
}

export function ClaimItem({ claim }: { claim: Claim }) {
  return (
    <li className="flex flex-col gap-1 rounded-xl bg-bg-2/50 p-2.5">
      <div className="text-sm leading-relaxed text-ink">{claim.text}</div>
      <div className="flex flex-wrap items-center gap-2">
        <EvidenceBadge level={claim.evidence} />
        <SourceRefs ids={claim.sourceIds} />
      </div>
    </li>
  );
}

export function ClaimList({ claims }: { claims: Claim[] }) {
  return <ul className="flex flex-col gap-2">{claims.map((c, i) => <ClaimItem key={i} claim={c} />)}</ul>;
}

export function SourceList({ ids }: { ids: string[] }) {
  return (
    <ol className="flex flex-col gap-2 text-xs text-ink-2">
      {ids.map((id) => {
        const s = sourceById(id);
        if (!s) return null;
        return (
          <li key={id} id={`forras-${id}`} className="scroll-mt-24 rounded-xl border border-line p-2.5">
            <div className="text-ink">
              {s.authors}
              {s.year ? ` (${s.year})` : ''}. <i>{s.title}</i>
              {s.edition ? `, ${s.edition}` : ''}.{s.publisher ? ` ${s.publisher}.` : ''}
            </div>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
              {s.doi && (
                <a className="inline-flex items-center gap-1 underline" href={`https://doi.org/${s.doi}`} target="_blank" rel="noreferrer">
                  DOI: {s.doi} <ExternalLink size={11} />
                </a>
              )}
              {s.url && (
                <a className="inline-flex items-center gap-1 underline" href={s.url} target="_blank" rel="noreferrer">
                  Online elérés <ExternalLink size={11} />
                </a>
              )}
              {s.license && <span>Licenc: {s.license}</span>}
              <span>{s.verification === 'verified-online' ? `Bibliográfiai adatok online ellenőrizve (${s.checkedAt})` : 'Standard referenciamű – kiadási adatok nyomtatott példány alapján ellenőrizendők'}</span>
            </div>
            {s.note && <div className="mt-1 opacity-80">{s.note}</div>}
          </li>
        );
      })}
    </ol>
  );
}

export function Segmented<T extends string | number>({
  value,
  options,
  onChange,
  label,
  size = 'md'
}: {
  value: T;
  options: { value: T; label: ReactNode; title?: string }[];
  onChange: (v: T) => void;
  label: string;
  size?: 'sm' | 'md';
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-xl bg-bg-2 p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={active}
            title={o.title}
            onClick={() => onChange(o.value)}
            className={`rounded-lg ${size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'} transition ${active ? 'bg-accent text-white shadow-sm' : 'text-ink-2 hover:text-ink'}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1 text-sm">
      <span>
        <span className="text-ink">{label}</span>
        {hint && <span className="block text-xs text-ink-2">{hint}</span>}
      </span>
      <span className="relative inline-flex">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="h-5 w-9 rounded-full bg-bg-2 ring-1 ring-line transition peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-highlight" />
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-ink-2 transition peer-checked:translate-x-4 peer-checked:bg-white" />
      </span>
    </label>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  id
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  id: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between text-sm">
        <label htmlFor={id} className="text-ink">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-xs text-highlight">
          {format(value)}
        </output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </div>
  );
}

export function Button({ children, onClick, variant = 'primary', disabled, type = 'button', title, className = '' }: { children: ReactNode; onClick?: () => void; variant?: 'primary' | 'ghost' | 'outline'; disabled?: boolean; type?: 'button' | 'submit'; title?: string; className?: string }) {
  const v =
    variant === 'primary'
      ? 'bg-accent text-white hover:brightness-110'
      : variant === 'outline'
        ? 'border border-line text-ink hover:bg-bg-2'
        : 'text-ink-2 hover:text-ink hover:bg-bg-2';
  return (
    <button type={type} title={title} onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${v} ${className}`}>
      {children}
    </button>
  );
}

export function Disclaimer({ children }: { children?: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-line px-3 py-2 text-[11px] leading-relaxed text-ink-2">
      {children ?? 'A 2D ábrák és animációk egyszerűsített oktatási szemléltetések, nem klinikailag validált biomechanikai szimulációk. Az alkalmazás nem diagnosztikai és nem rehabilitációs eszköz.'}
    </p>
  );
}

/** Üres modul: az izom elérhető, de ehhez a modulhoz még nem készült tartalom. */
export function ModulePending({ name, what }: { name: string; what: string }) {
  return (
    <Panel>
      <p className="text-sm text-ink-2">
        A(z) {name.toLowerCase()} {what} még fejlesztés alatt állnak. Az izom anatómiája az Anatomy Labban már elérhető.
      </p>
    </Panel>
  );
}
