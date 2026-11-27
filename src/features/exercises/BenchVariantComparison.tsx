import type { ReactNode } from 'react';
import { ClaimList, EvidenceBadge, Panel, SourceRefs } from '../../components/ui';
import type { Claim } from '../../types';
import { angleCommonFinding, angleZoneFor, angleZones, implementRows, type AngleZone, type ComparisonRow } from '../../data/exercises/benchVariants';
import {
  cableFinishText,
  cablePulleyZones,
  flyAngleZones,
  flyMachineRows,
  flyStartFlexion,
  pecDeckArmAngle,
  pecDeckHeightZones,
  relativeMoment
} from '../../data/exercises/flyVariants';

/* ------------------------------------------------------------------ */
/* Általános elemek                                                    */
/* ------------------------------------------------------------------ */

const zoneFor = (zones: AngleZone[], angle: number) => zones.find((z) => angle >= z.range[0] && angle <= z.range[1]) ?? zones[0]!;

/**
 * Dőlésszög-összehasonlítás: padtípus-gombok (a csúszkát is beállítják), az aktuális zóna
 * kiemelve, mellette a mozgás változása és a vizsgálati eredmények.
 */
function AngleComparison({
  zones,
  angle,
  onAngle,
  findingsTitle,
  extraFindings = [],
  illustration,
  footnote,
  title = 'Különbségek: a pad dőlésszöge',
  subtitle = 'Kattints egy padtípusra – az animáció és a magyarázat is átvált',
  groupLabel = 'Padtípusok'
}: {
  title?: string;
  subtitle?: string;
  groupLabel?: string;
  zones: AngleZone[];
  angle: number;
  onAngle: (v: number) => void;
  findingsTitle: string;
  extraFindings?: Claim[];
  illustration?: ReactNode;
  footnote: ReactNode;
}) {
  const zone = zoneFor(zones, angle);
  return (
    <Panel title={title} subtitle={subtitle}>
      <div className="flex flex-col gap-3">
        <div>
          <div className="grid overflow-hidden rounded-xl ring-1 ring-line" style={{ gridTemplateColumns: `repeat(${zones.length}, minmax(0, 1fr))` }} role="group" aria-label={groupLabel}>
            {zones.map((z) => {
              const current = z.id === zone.id;
              return (
                <button
                  key={z.id}
                  type="button"
                  aria-pressed={current}
                  onClick={() => onAngle(z.example)}
                  className={`min-w-0 border-r border-line px-1.5 py-2 text-center text-[11px] leading-tight last:border-r-0 ${current ? 'bg-accent/30 font-semibold text-ink' : 'text-ink-2 hover:bg-bg-2/60 hover:text-ink'}`}
                >
                  {z.name.split(' (')[0]}
                  <span className="block text-[10px] font-normal opacity-80">{z.range[0] === z.range[1] ? `${z.range[0]}°` : `${z.range[0]}…${z.range[1]}°`}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-1 text-[11px] text-ink-2" aria-live="polite">
            Jelenleg: <b className="text-ink">{angle}°</b> – {zone.name}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl bg-bg-2/50 p-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink">
              Mi változik a mozgásban <EvidenceBadge level="educational-model" />
            </div>
            <p className="text-sm leading-relaxed text-ink">{zone.kinematics}</p>
            {illustration}
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold text-ink">{findingsTitle}</div>
            <ClaimList claims={[...zone.findings, ...extraFindings]} />
          </div>
        </div>
        <p className="text-xs text-ink-2">{footnote}</p>
      </div>
    </Panel>
  );
}

interface ComparisonColumn {
  key: string;
  label: string;
}

/** Változatok összehasonlító táblázata; az aktuális változat oszlopa kiemelve, a másikra át lehet váltani. */
export function ComparisonTable({
  title,
  subtitle,
  columns,
  current,
  rows,
  onSwitch,
  children,
  footnote,
  switchLabel = 'Váltás erre a gyakorlatra'
}: {
  switchLabel?: string;
  title: string;
  subtitle: string;
  columns: ComparisonColumn[];
  current: string;
  rows: ComparisonRow[];
  onSwitch: (key: string) => void;
  children?: ReactNode;
  footnote: ReactNode;
}) {
  const cls = (key: string) => (current === key ? 'bg-accent/15 text-ink' : 'text-ink-2');
  return (
    <Panel title={title} subtitle={subtitle}>
      {children}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-xs">
              <th scope="col" className="w-[24%] p-2 text-left font-semibold text-ink-2">
                Szempont
              </th>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={`p-2 text-left align-bottom ${cls(c.key)}`}>
                  <div className="font-semibold">{c.label}</div>
                  {current === c.key ? (
                    <span className="text-[10px] font-normal uppercase tracking-wide text-highlight">jelenleg ezt nézed</span>
                  ) : (
                    <button type="button" onClick={() => onSwitch(c.key)} className="text-[11px] font-normal underline decoration-dotted underline-offset-2 hover:text-ink">
                      {switchLabel}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.aspect} className="border-b border-line/60 align-top last:border-b-0">
                <th scope="row" className="p-2 text-left text-xs font-semibold text-ink">
                  {r.aspect}
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 font-normal">
                    <EvidenceBadge level={r.evidence} />
                    <SourceRefs ids={r.sourceIds} />
                  </div>
                </th>
                {columns.map((c) => (
                  <td key={c.key} className={`p-2 leading-relaxed ${cls(c.key)}`}>
                    {r.values[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ink-2">{footnote}</p>
    </Panel>
  );
}

const EMG_NOTE = 'Az EMG az izom elektromos aktivitását méri, nem az izomerőt vagy a hipertrófiás hatást.';

/* ------------------------------------------------------------------ */
/* Fekvenyomás                                                         */
/* ------------------------------------------------------------------ */

export function BenchAngleComparison({ angle, onAngle, implement }: { angle: number; onAngle: (v: number) => void; implement: 'barbell' | 'dumbbell' }) {
  return (
    <AngleComparison
      zones={angleZones}
      angle={angle}
      onAngle={onAngle}
      findingsTitle="Mit mértek a vizsgálatok (EMG)"
      extraFindings={[angleCommonFinding]}
      illustration={<p className="text-xs text-ink-2">Az ábrán: a mellkasi érintési pont és a terhelés pályája a dőlésszöggel együtt változik.</p>}
      footnote={`${EMG_NOTE} A vizsgálatok edzett felnőttekkel, rúddal készültek${implement === 'dumbbell' ? '; kézisúlyzóra az eredményeket a modell nem vetíti át közvetlenül' : ''}.`}
    />
  );
}

export const benchAngleZoneFor = angleZoneFor;

export function BenchImplementComparison({ implement, onSwitch }: { implement: 'barbell' | 'dumbbell'; onSwitch: (to: 'barbell' | 'dumbbell') => void }) {
  return (
    <ComparisonTable
      title="Különbségek: rúd vagy kézisúlyzó"
      subtitle="Ugyanazok az ízületi mozgások – eltérő stabilitás, pálya és terhelhetőség"
      columns={[
        { key: 'barbell', label: 'Rúd' },
        { key: 'dumbbell', label: 'Kézisúlyzó' }
      ]}
      current={implement}
      rows={implementRows}
      onSwitch={(k) => onSwitch(k as 'barbell' | 'dumbbell')}
      footnote={`Az EMG-eredmények egy 12 fős, edzett férfiakkal végzett vizsgálatból származnak (maximális terhelésnél); más terhelésnél és csoportban eltérhetnek. ${EMG_NOTE}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Tárogatás                                                           */
/* ------------------------------------------------------------------ */

export const flyAngleZoneFor = (angle: number) => zoneFor(flyAngleZones, angle);

/** Oldalnézeti mini-ábra: a pad, a törzs és a függőleges kar; a kettő közti szög a kiinduló vállhajlítás. */
function FlyBenchSketch({ angle }: { angle: number }) {
  const hip = { x: 215, y: 112 };
  const len = 130;
  const a = (angle * Math.PI) / 180;
  // Egységvektor a csípőtől a fej felé (balra, a dőlésszöggel felfelé emelkedve), és a törzsre merőleges „felfelé” irány.
  const dir = { x: -Math.cos(a), y: -Math.sin(a) };
  const up = { x: Math.sin(a), y: -Math.cos(a) };
  const p = (d: number, h = 0) => ({ x: hip.x + dir.x * d + up.x * h, y: hip.y + dir.y * d + up.y * h });
  const benchA = p(-20, -8);
  const benchB = p(len + 6, -8);
  const torsoA = p(0, 6);
  const torsoB = p(len - 10, 6);
  const head = p(len + 8, 8);
  const shoulder = p(len - 24, 10);
  const hand = { x: shoulder.x, y: shoulder.y - 60 };
  const r = 22;
  const arcStart = { x: shoulder.x + r * dir.x, y: shoulder.y + r * dir.y };
  const arcEnd = { x: shoulder.x, y: shoulder.y - r };
  const flex = flyStartFlexion(angle);
  return (
    <svg viewBox="0 0 260 150" className="h-auto w-full max-w-[300px] rounded-lg bg-canvas" role="img" aria-label={`Oldalnézet: ${angle}°-os pad, a függőleges kar és a törzs által bezárt szög kb. ${flex}°`}>
      <line x1={6} y1={142} x2={254} y2={142} stroke="var(--ml-border)" strokeWidth={1.5} />
      <line x1={benchA.x} y1={benchA.y} x2={benchB.x} y2={benchB.y} stroke="var(--an-bench)" strokeWidth={8} strokeLinecap="round" />
      <line x1={torsoA.x} y1={torsoA.y} x2={torsoB.x} y2={torsoB.y} stroke="var(--an-body)" strokeWidth={18} strokeLinecap="round" />
      <circle cx={head.x} cy={head.y} r={11} fill="var(--an-body)" stroke="var(--an-body-stroke)" />
      <line x1={shoulder.x} y1={shoulder.y} x2={hand.x} y2={hand.y} stroke="var(--an-limb)" strokeWidth={8} strokeLinecap="round" />
      <circle cx={hand.x} cy={hand.y - 6} r={8} fill="var(--an-plate)" fillOpacity={0.85} />
      <path d={`M${arcStart.x} ${arcStart.y} A${r} ${r} 0 0 1 ${arcEnd.x} ${arcEnd.y}`} fill="none" stroke="var(--ml-accent-2)" strokeWidth={1.5} />
      <text x={shoulder.x + 10} y={shoulder.y - 30} className="an-label" style={{ fontSize: 11 }}>
        {flex}° vállhajlítás
      </text>
      <text x={hand.x + 14} y={hand.y - 4} className="an-label" style={{ fontSize: 10 }}>
        ↓ gravitáció
      </text>
      <text x={8} y={136} className="an-label" style={{ fontSize: 10 }}>
        pad: {angle}°
      </text>
    </svg>
  );
}

export function FlyAngleComparison({ angle, onAngle }: { angle: number; onAngle: (v: number) => void }) {
  return (
    <AngleComparison
      zones={flyAngleZones}
      angle={angle}
      onAngle={onAngle}
      findingsTitle="Anatómiai magyarázat"
      illustration={
        <>
          <FlyBenchSketch angle={angle} />
          <p className="text-xs text-ink-2">
            Oldalnézet: a súlyzók függőlegesen a váll fölött vannak, ezért a kar és a törzs szöge a pad dőlésével együtt változik. A felülnézeti animáció a törzshöz viszonyított
            nyitást–zárást mutatja.
          </p>
        </>
      }
      footnote="Tárogatásra vonatkozó, dőlésszögeket összehasonlító EMG-vizsgálatot nem találtunk; a fekvenyomás-vizsgálatok eredményei nem vihetők át közvetlenül a tárogatásra. A fenti különbségek az izomrészek ismert ízületi működéséből levezetett oktatási modell."
    />
  );
}

/**
 * Relatív ellenállási nyomaték a vállízületen a mozgás során (minőségi görbe), az aktuális
 * helyzet jelölésével.
 */
function MomentChart({ current, position }: { current: 'dumbbell' | 'machine'; position: number }) {
  const W = 300;
  const H = 120;
  const pad = { l: 34, r: 10, t: 10, b: 26 };
  const x = (deg: number) => pad.l + (deg / 90) * (W - pad.l - pad.r);
  const y = (m: number) => H - pad.b - m * (H - pad.t - pad.b);
  const curve = (kind: 'dumbbell' | 'machine') =>
    Array.from({ length: 31 }, (_, i) => i * 3)
      .map((d, i) => `${i ? 'L' : 'M'}${x(d).toFixed(1)} ${y(relativeMoment(kind, d)).toFixed(1)}`)
      .join(' ');
  const pos = Math.min(90, Math.max(0, position));
  return (
    <figure className="mb-3 rounded-xl bg-bg-2/50 p-2.5">
      <figcaption className="mb-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-ink">
        Ellenállás a vállízületen a mozgás során (relatív, minőségi) <EvidenceBadge level="educational-model" />
        <SourceRefs ids={['neumann-kinesiology', 'nsca-essentials']} />
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[460px]" role="img" aria-label="Kézisúlyzónál az ellenállás zárt karnál közel nulla, nyitott karnál a legnagyobb; gépnél a teljes tartományban jelen van.">
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke="var(--ml-border)" />
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke="var(--ml-border)" />
        <path d={curve('dumbbell')} fill="none" stroke="var(--an-agonist)" strokeWidth={current === 'dumbbell' ? 2.5 : 1.2} opacity={current === 'dumbbell' ? 1 : 0.55} />
        <path d={curve('machine')} fill="none" stroke="var(--an-plate)" strokeWidth={current === 'machine' ? 2.5 : 1.2} strokeDasharray="5 4" opacity={current === 'machine' ? 1 : 0.55} />
        <line x1={x(pos)} y1={pad.t} x2={x(pos)} y2={H - pad.b} stroke="var(--ml-accent-2)" strokeDasharray="2 3" />
        <circle cx={x(pos)} cy={y(relativeMoment(current, pos))} r={4} fill={current === 'dumbbell' ? 'var(--an-agonist)' : 'var(--an-plate)'} />
        <text x={pad.l} y={H - 8} className="an-label" style={{ fontSize: 9 }}>
          zárt kar (a mellkas előtt)
        </text>
        <text x={W - pad.r} y={H - 8} textAnchor="end" className="an-label" style={{ fontSize: 9 }}>
          nyitott kar (oldalt)
        </text>
        <text x={pad.l - 4} y={pad.t + 8} textAnchor="end" className="an-label" style={{ fontSize: 9 }}>
          nagy
        </text>
        <text x={pad.l - 4} y={H - pad.b} textAnchor="end" className="an-label" style={{ fontSize: 9 }}>
          0
        </text>
      </svg>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ink-2">
        <span>
          <span className="mr-1 inline-block h-0.5 w-5 align-middle" style={{ background: 'var(--an-agonist)' }} />
          Kézisúlyzó: a nyomaték az erőkarral (a kar és a függőleges szögének szinuszával) arányos – a pad dőlésétől független.
        </span>
        <span>
          <span className="mr-1 inline-block w-5 border-t-2 border-dashed align-middle" style={{ borderColor: 'var(--an-plate)' }} />
          Gép: gépfüggő profil; az ábra állandó értéket feltételez.
        </span>
      </div>
    </figure>
  );
}

export function FlyMachineComparison({ current, position, onSwitch }: { current: 'dumbbell' | 'machine'; position: number; onSwitch: (to: 'dumbbell' | 'machine') => void }) {
  return (
    <ComparisonTable
      title="Különbségek: kézisúlyzós vagy gépes tárogatás"
      subtitle="Ugyanaz az ízületi mozgás – eltérő testhelyzet, ellenállásirány és terhelési profil"
      columns={[
        { key: 'dumbbell', label: 'Kézisúlyzós tárogatás' },
        { key: 'machine', label: 'Gépes tárogatás (pec deck)' }
      ]}
      current={current}
      rows={flyMachineRows}
      onSwitch={(k) => onSwitch(k as 'dumbbell' | 'machine')}
      footnote="A két gyakorlatot közvetlenül összehasonlító lektorált EMG-vizsgálatot nem találtunk; a különbségek mechanikai és anatómiai levezetések (oktatási modell). A nyomatékgörbe minőségi, nem mért érték."
    >
      <MomentChart current={current} position={position} />
    </ComparisonTable>
  );
}

/* ------------------------------------------------------------------ */
/* Gépes tárogatás: ülésmagasság                                       */
/* ------------------------------------------------------------------ */

export const pecDeckHeightZoneFor = (elevation: number) => zoneFor(pecDeckHeightZones, elevation);

/** Elölnézeti mini-ábra: ülő törzs, a jobb felkar a vállhoz képest emelve vagy süllyesztve. */
function SeatSketch({ elevation }: { elevation: number }) {
  const shoulder = { x: 118, y: 56 };
  const e = (elevation * Math.PI) / 180;
  const len = 92;
  const elbow = { x: shoulder.x + len * Math.cos(e), y: shoulder.y - len * Math.sin(e) };
  const angle = pecDeckArmAngle(elevation);
  return (
    <svg
      viewBox="0 0 260 150"
      className="h-auto w-full max-w-[300px] rounded-lg bg-canvas"
      role="img"
      aria-label={`Elölnézet: a felkar ${Math.abs(elevation)}°-kal ${elevation < 0 ? 'a vállmagasság alatt' : elevation > 0 ? 'a vállmagasság fölött' : 'vállmagasságban'}, a törzshöz képest kb. ${angle}°`}
    >
      <line x1={6} y1={142} x2={254} y2={142} stroke="var(--ml-border)" strokeWidth={1.5} />
      {/* Ülés */}
      <rect x={62} y={118} width={70} height={10} rx={4} fill="var(--an-bench)" />
      <line x1={97} y1={128} x2={97} y2={142} stroke="var(--an-bench)" strokeWidth={6} />
      {/* Törzs, fej, bal kar (lógó, kontextus) */}
      <rect x={76} y={48} width={42} height={72} rx={14} fill="var(--an-body)" stroke="var(--an-body-stroke)" />
      <circle cx={97} cy={32} r={13} fill="var(--an-body)" stroke="var(--an-body-stroke)" />
      <line x1={78} y1={58} x2={70} y2={112} stroke="var(--an-body)" strokeWidth={10} strokeLinecap="round" />
      {/* Vállmagasság (vízszintes referencia) és a törzs hossztengelye */}
      <line x1={shoulder.x} y1={shoulder.y} x2={shoulder.x + 120} y2={shoulder.y} stroke="var(--ml-accent-2)" strokeDasharray="3 4" strokeWidth={1} />
      <line x1={shoulder.x} y1={shoulder.y} x2={shoulder.x} y2={shoulder.y + 58} stroke="var(--ml-border)" strokeDasharray="2 3" />
      {/* Jobb felkar és a gép karpárnája */}
      <line x1={shoulder.x} y1={shoulder.y} x2={elbow.x} y2={elbow.y} stroke="var(--an-limb)" strokeWidth={10} strokeLinecap="round" />
      <circle cx={elbow.x} cy={elbow.y} r={7} fill="var(--an-plate)" fillOpacity={0.85} />
      <text x={shoulder.x + 28} y={shoulder.y + (elevation <= 0 ? -12 : 24)} className="an-label" style={{ fontSize: 11 }}>
        {angle}° a törzshöz képest
      </text>
      <text x={8} y={136} className="an-label" style={{ fontSize: 10 }}>
        kar: {elevation > 0 ? '+' : ''}
        {elevation}° (vállmagasság: 0°)
      </text>
    </svg>
  );
}

export function PecDeckHeightComparison({ elevation, onElevation }: { elevation: number; onElevation: (v: number) => void }) {
  return (
    <AngleComparison
      title="Különbségek: ülésmagasság (a kar magassága)"
      subtitle="A gépnél nincs dönthető pad – a megfelelője az, hogy a felkar a váll alatt, vállmagasságban vagy fölötte mozog"
      groupLabel="Karmagasság"
      zones={pecDeckHeightZones}
      angle={elevation}
      onAngle={onElevation}
      findingsTitle="Anatómiai magyarázat"
      illustration={
        <>
          <SeatSketch elevation={elevation} />
          <p className="text-xs text-ink-2">Elölnézet: az ülésmagasság dönti el, milyen magasan van a felkar a vállhoz képest. A felülnézeti animáció a vízszintes összetevőt mutatja.</p>
        </>
      }
      footnote="A gépes tárogatás ülés- vagy karmagasságát összehasonlító EMG-vizsgálatot nem találtunk; a különbségek az izomrészek ismert ízületi működéséből levezetett oktatási modell. A gépek kialakítása eltér: egyes gépeken a kar helyzetét a fogantyú vagy a karpárna magassága is befolyásolja."
    />
  );
}

/* ------------------------------------------------------------------ */
/* Csigás keresztbehúzás: a csiga magassága                            */
/* ------------------------------------------------------------------ */

export const cablePulleyZoneFor = (angle: number) => zoneFor(cablePulleyZones, angle);

/**
 * Elölnézeti mini-ábra: álló figura, a csiga a húzásiránynak megfelelő magasságban, a kábel a
 * kiinduló kéztartásig, és a kéz útja a találkozási pontig.
 */
function PulleySketch({ angle }: { angle: number }) {
  const shoulder = { x: 112, y: 70 };
  const a = (angle * Math.PI) / 180;
  const dir = { x: Math.cos(a), y: -Math.sin(a) };
  const start = { x: shoulder.x + 84 * dir.x, y: shoulder.y + 84 * dir.y };
  const pulley = { x: shoulder.x + 128 * dir.x, y: shoulder.y + 128 * dir.y };
  // A kezek találkozási pontja a test előtt (elölről a törzs közepe felé).
  const end = { x: 98, y: shoulder.y + (angle > 0 ? 2 * angle : 0.9 * angle) + 6 };
  const ctrl = { x: (start.x + end.x) / 2 + 6, y: Math.max(start.y, end.y) + (angle > 0 ? 18 : 10) };
  return (
    <svg
      viewBox="0 0 260 160"
      className="h-auto w-full max-w-[300px] rounded-lg bg-canvas"
      role="img"
      aria-label={`Elölnézet: a kábel ${angle > 0 ? 'felülről' : angle < 0 ? 'alulról' : 'vállmagasságból'} húz, a kezek ${cableFinishText(angle)} találkoznak`}
    >
      <defs>
        <marker id="pulley-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--ml-accent-2)" />
        </marker>
      </defs>
      <line x1={6} y1={152} x2={254} y2={152} stroke="var(--ml-border)" strokeWidth={1.5} />
      {/* Csigaoszlop és csiga */}
      <line x1={244} y1={4} x2={244} y2={152} stroke="var(--an-bench)" strokeWidth={6} />
      <line x1={pulley.x} y1={pulley.y} x2={244} y2={pulley.y} stroke="var(--an-bench)" strokeWidth={3} />
      <circle cx={pulley.x} cy={pulley.y} r={6} fill="var(--an-plate)" />
      {/* Törzs, fej, lábak */}
      <rect x={76} y={62} width={44} height={66} rx={14} fill="var(--an-body)" stroke="var(--an-body-stroke)" />
      <circle cx={98} cy={46} r={13} fill="var(--an-body)" stroke="var(--an-body-stroke)" />
      <line x1={88} y1={126} x2={84} y2={150} stroke="var(--an-body)" strokeWidth={11} strokeLinecap="round" />
      <line x1={108} y1={126} x2={112} y2={150} stroke="var(--an-body)" strokeWidth={11} strokeLinecap="round" />
      {/* Kábel és a kar kiinduló helyzete */}
      <line x1={start.x} y1={start.y} x2={pulley.x} y2={pulley.y} className="an-cable" />
      <line x1={shoulder.x} y1={shoulder.y} x2={start.x} y2={start.y} stroke="var(--an-limb)" strokeWidth={9} strokeLinecap="round" />
      <circle cx={start.x} cy={start.y} r={5} fill="var(--an-plate)" />
      {/* A kéz útja a találkozási pontig */}
      <path d={`M${start.x} ${start.y} Q${ctrl.x} ${ctrl.y} ${end.x} ${end.y}`} fill="none" stroke="var(--ml-accent-2)" strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#pulley-arrow)" />
      <circle cx={end.x} cy={end.y} r={3.5} fill="var(--ml-accent-2)" />
      <text x={8} y={146} className="an-label" style={{ fontSize: 10 }}>
        húzásirány: {angle > 0 ? '+' : ''}
        {angle}°
      </text>
    </svg>
  );
}

export function CablePulleyComparison({ angle, onAngle }: { angle: number; onAngle: (v: number) => void }) {
  return (
    <AngleComparison
      title="Különbségek: a csiga magassága (húzásirány)"
      subtitle="Kattints egy csigamagasságra – a csúszka, az ábra és a magyarázat is átvált"
      groupLabel="Csigamagasság"
      zones={cablePulleyZones}
      angle={angle}
      onAngle={onAngle}
      findingsTitle="Anatómiai magyarázat"
      illustration={
        <>
          <PulleySketch angle={angle} />
          <p className="text-xs text-ink-2">
            Elölnézet: a szaggatott nyíl a kéz útja a kiinduló helyzettől a találkozási pontig ({cableFinishText(angle)}). A felülnézeti animáció ennek csak a vízszintes összetevőjét
            mutatja.
          </p>
        </>
      }
      footnote="A csigamagasságot összehasonlító elsődleges EMG-vizsgálatot nem találtunk; a gyakran olvasható „felső csiga – alsó rostok, alsó csiga – felső rostok” szabály edzői gyakorlatból származik. A fenti különbségek az izomrészek ismert ízületi működéséből levezetett oktatási modell."
    />
  );
}
