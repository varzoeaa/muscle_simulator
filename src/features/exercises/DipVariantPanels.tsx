import { ClaimList, EvidenceBadge, Panel } from '../../components/ui';
import { DIP_VARIANTS, dipShoulderExtension, type DipOptions, type DipVariant } from '../../engines/animation/sagittalKinematics';
import { dipFatigueFindings, dipLeanClaims, dipVariantNames, dipVariantRows } from '../../data/exercises/dipVariants';
import { ComparisonTable } from './BenchVariantComparison';

/** Pad, korlát és gyűrű összehasonlítása; az oszlopfejléc gombja az animációt is átváltja. */
export function DipVariantComparison({ options, onVariant }: { options: DipOptions; onVariant: (v: DipVariant) => void }) {
  return (
    <ComparisonTable
      title="Különbségek: pad, korlát vagy gyűrű"
      subtitle="Mért kinematika és izomaktivitás – az oszlopfejléc gombjával az animáció is átvált"
      columns={(['bench', 'bar', 'ring'] as DipVariant[]).map((v) => ({ key: v, label: dipVariantNames[v] }))}
      current={options.variant}
      rows={dipVariantRows}
      onSwitch={(k) => onVariant(k as DipVariant)}
      switchLabel="Mutasd az animáción"
      footnote="Egy 13 fős, tapasztalt férfiakkal végzett vizsgálat eredményei; az EMG az izom elektromos aktivitását méri, nem az izomerőt vagy a hipertrófiás hatást. Az animáció a változatok sorrendjét szemlélteti (vállfeszítés: pad > korlát > gyűrű), az ízületi szögek nem a mért értékek."
    />
  );
}

const LEAN_PRESETS: { name: string; lean: number }[] = [
  { name: 'Függőleges törzs', lean: 5 },
  { name: 'Közepes dőlés', lean: 20 },
  { name: 'Előredőlt törzs', lean: 35 }
];

/** Törzsdőlés és mélység: gyorsgombok, a modellből számított vállfeszítés és a magyarázat. */
export function DipLeanComparison({ options, rom, onLean }: { options: DipOptions; rom: number; onLean: (v: number) => void }) {
  const ext = dipShoulderExtension(options, rom);
  const maxExt = Math.max(...(Object.keys(DIP_VARIANTS) as DipVariant[]).map((v) => dipShoulderExtension({ variant: v, lean: 0 }, 1)));
  return (
    <Panel title="Különbségek: törzsdőlés és mélység" subtitle="A törzs előredőlése és a mozgástartomány együtt határozza meg, mennyire feszül a vállízület">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-3 overflow-hidden rounded-xl ring-1 ring-line" role="group" aria-label="Törzsdőlés">
          {LEAN_PRESETS.map((p) => {
            const current = Math.abs(options.lean - p.lean) < 3;
            return (
              <button
                key={p.name}
                type="button"
                aria-pressed={current}
                onClick={() => onLean(p.lean)}
                className={`border-r border-line px-1.5 py-2 text-center text-[11px] leading-tight last:border-r-0 ${current ? 'bg-accent/30 font-semibold text-ink' : 'text-ink-2 hover:bg-bg-2/60 hover:text-ink'}`}
              >
                {p.name}
                <span className="block text-[10px] font-normal opacity-80">{p.lean}° alul</span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl bg-bg-2/50 p-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink">
              Vállfeszítés alul (modell) <EvidenceBadge level="educational-model" />
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-surface/70 ring-1 ring-line" aria-hidden="true">
              <div className="h-full rounded-full" style={{ width: `${Math.max(4, Math.min(100, (ext / maxExt) * 100))}%`, background: 'var(--an-antagonist)' }} />
            </div>
            <p className="text-sm text-ink">
              {dipVariantNames[options.variant]}, {options.lean}° törzsdőlés, {Math.round(rom * 100)}% mozgástartomány: a felkar a törzshöz képest kb. <b>{Math.round(ext)}°</b>-kal kerül hátra.
            </p>
            <p className="text-[11px] text-ink-2">A sematikus modellből számított érték: a felkar függőlegestől mért szöge mínusz a törzs előredőlése. Nem mért adat; a mért értékek a fenti táblázatban vannak.</p>
          </div>
          <div className="flex flex-col gap-2">
            <ClaimList claims={dipLeanClaims(options.lean)} />
          </div>
        </div>

        <div className="rounded-xl bg-bg-2/40 p-2.5">
          <div className="mb-1 text-sm font-semibold text-ink">Fáradás a sorozat végén</div>
          <ClaimList claims={dipFatigueFindings} />
        </div>
        <p className="text-xs text-ink-2">
          A törzsdőlés hatását közvetlenül összehasonlító vizsgálatot nem találtunk; a magyarázat az ízületi geometriából és az izmok ismert működéséből levezetett oktatási modell. A mély
          leengedés a vállízületet nagy feszítésbe viszi – a mozgástartományt az egyéni vállmobilitáshoz kell igazítani.
        </p>
      </div>
    </Panel>
  );
}
