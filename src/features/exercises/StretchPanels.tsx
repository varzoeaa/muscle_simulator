import { Check, Minus, CircleHelp } from 'lucide-react';
import { ClaimList, Panel, Segmented, SourceRefs, Toggle } from '../../components/ui';
import { dosageFindings, regionFindings, regionResults, stretchComparisonRows, type StretchAbduction, type StretchPosition } from '../../data/exercises/stretchVariants';
import { ComparisonTable } from './BenchVariantComparison';

/** A nyújtás során kiemelt (a vizsgálatban jobban nyúló) izomrészek az adott karhelyzetben. */
export const emphasizedRegionIds = (p: StretchPosition) => regionResults.filter((r) => r.matches(p)).map((r) => r.regionId);

/**
 * Elölnézeti vázlat: a kar távolítása (45°, 90°, 135°), a külső rotáció (a tenyér iránya) és a
 * törzs elfordítása. Fekvő nyújtásnál ugyanez felülről nézve.
 */
function ArmPositionSketch({ p, supine }: { p: StretchPosition; supine: boolean }) {
  const shoulder = { x: 112, y: 58 };
  // A távolítás a törzs hossztengelyétől (lefelé) mért szög: 45° lent-oldalt, 90° vízszintes, 135° fent-oldalt.
  const a = ((p.abduction - 90) * Math.PI) / 180;
  const len = 96;
  const hand = { x: shoulder.x + len * Math.cos(a), y: shoulder.y - len * Math.sin(a) };
  return (
    <svg
      viewBox="0 0 260 150"
      className="h-auto w-full max-w-[300px] rounded-lg bg-canvas"
      role="img"
      aria-label={`${supine ? 'Felülről' : 'Elölről'}: a kar ${p.abduction}°-os távolításban${p.externalRotation ? ', kifelé forgatva' : ''}${p.trunkRotation ? ', a törzs elfordítva' : ''}`}
    >
      {!supine && <line x1={6} y1={146} x2={254} y2={146} stroke="var(--ml-border)" strokeWidth={1.5} />}
      {supine && <rect x={84} y={34} width={30} height={112} rx={12} fill="var(--an-bench)" opacity={0.7} />}
      <g transform={p.trunkRotation && !supine ? `rotate(-8 92 90)` : undefined}>
        <rect x={70} y={50} width={44} height={74} rx={14} fill="var(--an-body)" stroke="var(--an-body-stroke)" />
        <circle cx={92} cy={34} r={13} fill="var(--an-body)" stroke="var(--an-body-stroke)" />
        <line x1={72} y1={58} x2={60} y2={118} stroke="var(--an-body)" strokeWidth={10} strokeLinecap="round" />
      </g>
      <line x1={shoulder.x} y1={shoulder.y} x2={shoulder.x} y2={shoulder.y + 62} stroke="var(--ml-border)" strokeDasharray="2 3" />
      <line x1={shoulder.x} y1={shoulder.y} x2={hand.x} y2={hand.y} stroke="var(--an-limb)" strokeWidth={10} strokeLinecap="round" />
      <circle cx={hand.x} cy={hand.y} r={7} fill={p.externalRotation ? 'var(--an-stretched)' : 'var(--an-limb)'} stroke="var(--an-body-stroke)" />
      <text x={shoulder.x + 22} y={shoulder.y + (p.abduction > 90 ? 34 : -14)} className="an-label" style={{ fontSize: 11 }}>
        {p.abduction}° távolítás
      </text>
      <text x={8} y={140} className="an-label" style={{ fontSize: 10 }}>
        {[p.externalRotation ? 'külső rotáció' : 'semleges forgatás', !supine && p.trunkRotation ? 'törzs elfordítva' : ''].filter(Boolean).join(' · ')}
      </text>
    </svg>
  );
}

/** Karhelyzet és a nagy mellizom régiói: melyik rész nyúlt jobban a vizsgálatban. */
export function StretchPositionPanel({ p, onChange, supine }: { p: StretchPosition; onChange: (p: StretchPosition) => void; supine: boolean }) {
  return (
    <Panel title="Különbségek: karhelyzet – melyik mellizomrész nyúlik jobban" subtitle="A kar magassága, a külső rotáció és a törzs elfordítása szerint (a felülnézeti animáción a kiemelt részek pulzálnak)">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-2">A kar magassága</span>
            <Segmented<StretchAbduction>
              size="sm"
              label="A kar magassága (távolítás)"
              value={p.abduction}
              onChange={(abduction) => onChange({ ...p, abduction })}
              options={[
                { value: 45, label: '45° (lent)' },
                { value: 90, label: '90° (vállmagasság)' },
                { value: 135, label: '135° (fent)' }
              ]}
            />
          </div>
          <Toggle label="Külső rotáció (tenyér előre/felfelé)" checked={p.externalRotation} onChange={(externalRotation) => onChange({ ...p, externalRotation })} />
          {!supine && <Toggle label="Törzs (medence) elfordítása" checked={p.trunkRotation} onChange={(trunkRotation) => onChange({ ...p, trunkRotation })} />}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl bg-bg-2/50 p-2.5">
            <ArmPositionSketch p={p} supine={supine} />
            {supine && <p className="text-[11px] text-ink-2">Fekve a medence nem fordul el; a vizsgálat medence-elfordításos helyzetei itt nem érvényesek.</p>}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-ink">
              A vizsgálat eredménye a választott helyzetre <SourceRefs ids={['umehara-2021']} />
            </div>
            <ul className="flex flex-col gap-1.5">
              {regionResults.map((r) => {
                const match = r.matches(p);
                const partial = !match && !!r.partial?.(p);
                return (
                  <li key={r.regionId} className={`rounded-lg p-2 text-sm ${match ? 'bg-accent/20 ring-1 ring-accent-2' : 'bg-surface/60'}`}>
                    <div className="flex items-center gap-1.5 font-medium text-ink">
                      {match ? <Check size={14} aria-hidden="true" /> : partial ? <CircleHelp size={14} aria-hidden="true" /> : <Minus size={14} aria-hidden="true" />}
                      {r.name}:{' '}
                      <span className="font-normal">
                        {match ? 'ebben a helyzetben nyúlt jobban' : partial ? 'lehetséges – a vizsgálat ezt a helyzetet nem pontosan adja meg' : 'nem a kiemelt helyzetek egyike'}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-ink-2">Kiemelt helyzetek: {r.studyPositions}.</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <ClaimList claims={regionFindings} />
        <p className="text-xs text-ink-2">
          A nyírási modulus az izom „feszességét” jelzi, és közvetve utal a megnyúlásra; nem a nyújtás hosszú távú hatását méri. A hasi rész felülnézetből nem látható, ezért az animáción nem
          jelenik meg.
        </p>
      </div>
    </Panel>
  );
}

/** Adagolás és akut hatások: mennyi ideig, milyen gyakran, és mikor érdemes nyújtani. */
export function StretchDosagePanel() {
  return (
    <Panel title="Adagolás és hatás: mennyi ideig és mikor nyújts?" subtitle="Ajánlás és szisztematikus áttekintés alapján">
      <div className="flex flex-col gap-3">
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { k: 'Gyakorlatonként', v: 'összesen 60 s' },
            { k: 'Gyakoriság', v: 'legalább heti 2 nap' },
            { k: 'Felosztás (példa)', v: '2 × 30 s vagy 4 × 15 s' }
          ].map((x) => (
            <div key={x.k} className="rounded-xl bg-bg-2/50 p-2.5">
              <div className="text-[11px] text-ink-2">{x.k}</div>
              <div className="text-base font-semibold text-ink">{x.v}</div>
            </div>
          ))}
        </div>
        <ClaimList claims={dosageFindings} />
        <p className="text-xs text-ink-2">
          A felosztás csak számpélda a 60 másodperces összidőre. Az animáció tartási szakasza a szemléltetés kedvéért rövidebb. A nyújtás nem lehet fájdalmas; vállpanasz esetén
          szakemberrel egyeztess.
        </p>
      </div>
    </Panel>
  );
}

/** A két nyújtó gyakorlat összehasonlítása, átváltással. */
export function StretchComparison({ current, onSwitch }: { current: 'wall' | 'roller'; onSwitch: (to: 'wall' | 'roller') => void }) {
  return (
    <ComparisonTable
      title="Különbségek: falnál (egykaros) vagy hengeren (kétkaros)"
      subtitle="Ugyanaz az ízületi helyzet (horizontális távolítás) – eltérő erőforrás, szabályozás és testhelyzet"
      columns={[
        { key: 'wall', label: 'Falnál, egykaros' },
        { key: 'roller', label: 'Hengeren, kétkaros' }
      ]}
      current={current}
      rows={stretchComparisonRows}
      onSwitch={(k) => onSwitch(k as 'wall' | 'roller')}
      footnote="A két nyújtási módot közvetlenül összehasonlító vizsgálatot nem találtunk; a különbségek a testhelyzetből és az ízületi mozgásból levezetett oktatási modell."
    />
  );
}
