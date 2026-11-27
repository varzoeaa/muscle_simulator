import { ClaimList, EvidenceBadge, Panel, Segmented, SourceRefs } from '../../components/ui';
import { solvePushUp, type PushUpOptions } from '../../engines/animation/sagittalKinematics';
import {
  handWidths,
  loadLevel,
  loadLevelText,
  pushUpPlusFindings,
  pushUpPresets,
  supportFindings,
  tiltExplanation,
  type HandWidth,
  type LoadLevel
} from '../../data/exercises/pushUpVariants';

const same = (a: PushUpOptions, b: PushUpOptions) => a.handCm === b.handCm && a.feetCm === b.feetCm && a.knees === b.knees;

/** A test dőlése felső és alsó helyzetben (fok) az adott alátámasztásnál. */
export const pushUpTilt = (o: PushUpOptions) => ({ top: solvePushUp(0, o, false).tilt, bottom: solvePushUp(1, o, false).tilt });

export function pushUpSupportText(o: PushUpOptions) {
  if (o.knees) return 'Térdelő fekvőtámasz';
  if (!o.handCm && !o.feetCm) return 'Alap (kéz és láb a talajon)';
  return [o.handCm ? `kéz ${o.handCm} cm-en` : '', o.feetCm ? `láb ${o.feetCm} cm-en` : ''].filter(Boolean).join(', ').replace(/^./, (c) => c.toUpperCase());
}

/**
 * A test dőlése és az alátámasztás: a vizsgált hat változat gyorsgombjai, a számított testdőlés,
 * a kézre jutó terhelés iránya és a vállmozgás változása.
 */
export function PushUpSupportComparison({ options, onChange }: { options: PushUpOptions; onChange: (o: PushUpOptions) => void }) {
  const tilt = pushUpTilt(options);
  const level = loadLevel(options);
  const levels: LoadLevel[] = ['lower', 'reference', 'higher'];
  return (
    <Panel title="Különbségek: a test dőlése (kéz- és lábalátámasztás)" subtitle="Kattints egy változatra – az animáció is átvált; a csúszkákkal köztes magasság is beállítható">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-3 overflow-hidden rounded-xl ring-1 ring-line sm:grid-cols-6" role="group" aria-label="Fekvőtámasz-változatok">
          {pushUpPresets.map((p) => {
            const current = same(p.options, options);
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={current}
                onClick={() => onChange(p.options)}
                className={`border-b border-r border-line px-1.5 py-2 text-center text-[11px] leading-tight sm:border-b-0 ${current ? 'bg-accent/30 font-semibold text-ink' : 'text-ink-2 hover:bg-bg-2/60 hover:text-ink'}`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl bg-bg-2/50 p-2.5">
            <div className="text-xs font-semibold text-ink">{pushUpSupportText(options)}</div>
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-surface/60 p-2">
                <dt className="text-ink-2">A test dőlése felül</dt>
                <dd className="text-base font-semibold text-ink">{Math.round(tilt.top)}°</dd>
              </div>
              <div className="rounded-lg bg-surface/60 p-2">
                <dt className="text-ink-2">A test dőlése alul</dt>
                <dd className="text-base font-semibold text-ink">{Math.round(tilt.bottom)}°</dd>
              </div>
            </dl>
            <p className="text-[11px] text-ink-2">A modellből számított érték (pozitív: a fej van feljebb). Testmérettől függ, nem mért adat.</p>
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-ink">
                Kézre jutó terhelés <SourceRefs ids={['ebben-2011']} />
              </div>
              <div className="grid grid-cols-3 overflow-hidden rounded-lg ring-1 ring-line text-center text-[11px]">
                {levels.map((l) => (
                  <div key={l} className={`px-1 py-1.5 ${l === level ? 'bg-accent/30 font-semibold text-ink' : 'text-ink-2'}`}>
                    {l === 'lower' ? 'kisebb' : l === 'reference' ? 'alap' : 'nagyobb'}
                  </div>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-ink-2">Jelenleg: {loadLevelText[level]}. Csak az irányt mutatjuk; a mért értékeket és a köztes magasságokat a modell nem számszerűsíti.</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink">
              Mi változik a vállízületben <EvidenceBadge level="educational-model" />
            </div>
            <ClaimList claims={tiltExplanation(options)} />
            <div className="text-xs font-semibold text-ink">Mit mértek a vizsgálatok</div>
            <ClaimList claims={supportFindings} />
          </div>
        </div>
        <p className="text-xs text-ink-2">
          A gombok a vizsgált hat változatnak felelnek meg (a vizsgálatban 30,48 és 60,96 cm-es doboz). A modellben az alkar a talajra merőleges, a kéz és a lábujj (térdelő változatnál a térd) a támaszon rögzített. A fekvenyomás dőlésszögeivel való párhuzam anatómiai levezetés;
          fekvőtámasznál a vizsgálatok az erőt mérték, az izomrészek aktivitását nem.
        </p>
      </div>
    </Panel>
  );
}

/** Elölnézeti mini-ábra: a vállak, a kezek távolsága és a könyök iránya. */
function HandWidthSketch({ width }: { width: HandWidth }) {
  const cx = 130;
  const shoulderHalf = 46;
  const handHalf = width === 'narrow' ? 22 : width === 'shoulder' ? 54 : 92;
  const elbowOut = width === 'narrow' ? 6 : width === 'shoulder' ? 22 : 34;
  const sy = 44;
  const hy = 128;
  const side = (k: 1 | -1) => {
    const s = { x: cx + k * shoulderHalf, y: sy };
    const h = { x: cx + k * handHalf, y: hy };
    const e = { x: (s.x + h.x) / 2 + k * elbowOut, y: (s.y + h.y) / 2 };
    return { s, h, e };
  };
  return (
    <svg viewBox="0 0 260 150" className="h-auto w-full max-w-[300px] rounded-lg bg-canvas" role="img" aria-label={`Elölnézet: ${handWidths.find((w) => w.id === width)!.name.toLowerCase()} kéztartás`}>
      <line x1={6} y1={132} x2={254} y2={132} stroke="var(--ml-border)" strokeWidth={1.5} />
      <rect x={cx - shoulderHalf - 4} y={sy - 10} width={2 * shoulderHalf + 8} height={34} rx={14} fill="var(--an-body)" stroke="var(--an-body-stroke)" />
      <circle cx={cx} cy={sy - 6} r={13} fill="var(--an-body)" stroke="var(--an-body-stroke)" />
      {([1, -1] as const).map((k) => {
        const { s, h, e } = side(k);
        return (
          <g key={k}>
            <path d={`M${s.x} ${s.y} L${e.x} ${e.y} L${h.x} ${h.y}`} fill="none" stroke="var(--an-limb)" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={e.x} cy={e.y} r={3.5} fill="none" stroke="var(--an-joint)" />
            <rect x={h.x - 9} y={h.y - 2} width={18} height={5} rx={2} fill="var(--an-plate)" />
          </g>
        );
      })}
      <line x1={cx - shoulderHalf} y1={hy + 12} x2={cx - shoulderHalf} y2={sy + 30} stroke="var(--ml-accent-2)" strokeDasharray="2 3" />
      <line x1={cx + shoulderHalf} y1={hy + 12} x2={cx + shoulderHalf} y2={sy + 30} stroke="var(--ml-accent-2)" strokeDasharray="2 3" />
      <text x={8} y={146} className="an-label" style={{ fontSize: 10 }}>
        szaggatott: vállszélesség
      </text>
    </svg>
  );
}

/** Egyéb változatok: kéztávolság (és ezzel a könyök iránya), fekvőtámasz plusz. */
export function PushUpOtherVariants({ width, onWidth }: { width: HandWidth; onWidth: (w: HandWidth) => void }) {
  const w = handWidths.find((x) => x.id === width)!;
  return (
    <Panel title="Egyéb változatok: kéztávolság, kartartás, fekvőtámasz plusz" subtitle="Az oldalnézeti animáció a kéztávolságot nem mutatja – ezt az elölnézeti ábra szemlélteti">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-2">Kéztávolság</span>
          <Segmented<HandWidth> size="sm" label="Kéztávolság" value={width} onChange={onWidth} options={handWidths.map((h) => ({ value: h.id, label: h.name }))} />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl bg-bg-2/50 p-2.5">
            <HandWidthSketch width={width} />
            <div className="flex items-center gap-2 text-xs font-semibold text-ink">
              Kartartás <EvidenceBadge level="educational-model" />
            </div>
            <p className="text-sm leading-relaxed text-ink">{w.description}</p>
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold text-ink">Mit mértek a vizsgálatok</div>
            <ClaimList claims={w.findings} />
          </div>
        </div>
        <div className="rounded-xl bg-bg-2/40 p-2.5">
          <div className="mb-1 text-sm font-semibold text-ink">Fekvőtámasz plusz (push-up plus)</div>
          <ClaimList claims={pushUpPlusFindings} />
          <p className="mt-2 text-xs text-ink-2">A lapocka mozgását az animáció nem ábrázolja.</p>
        </div>
      </div>
    </Panel>
  );
}
