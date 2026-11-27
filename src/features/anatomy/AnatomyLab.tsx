import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Layers } from 'lucide-react';
import type { AnatomicalViewId, JointMovementId, LayerId, Muscle, MuscleRoleType } from '../../types';
import { AnatomyViewer, ALL_LAYERS, matchesStructure } from '../../components/anatomy/AnatomyViewer';
import { restPoses, viewGeometries, views } from '../../data/geometry';
import { structureName } from '../../data/muscles';
import { jointById, movementById } from '../../data/joints/joints';
import { nerveById } from '../../data/nerves/nerves';
import { ClaimList, Disclaimer, EvidenceBadge, Panel, Segmented, SourceList, SourceRefs, TermBlock, TermInline, Toggle } from '../../components/ui';
import { useSettingsStore } from '../../stores/settingsStore';
import { RoleLegend, roleLabels } from '../../components/anatomy/RoleLegend';

export function AnatomyLab() {
  const { muscle } = useOutletContext<{ muscle: Muscle }>();
  const [selected, setSelected] = useState<string>(muscle.id);
  const [viewId, setViewId] = useState<AnatomicalViewId>(muscle.defaultViewId);
  const [isolate, setIsolate] = useState(false);
  const showLabels = useSettingsStore((s) => s.showLabels);
  const setShowLabels = useSettingsStore((s) => s.setShowLabels);
  const [layers, setLayers] = useState<Record<LayerId, boolean>>(ALL_LAYERS);
  const [roleMovement, setRoleMovement] = useState<JointMovementId>(muscle.roles[0]?.movementId ?? 'shoulder-adduction');

  const geometry = viewGeometries[viewId]!;
  const region = muscle.regions.find((r) => r.id === selected);
  const selectedIsOther = selected !== muscle.id && !region;
  const roleMovements = useMemo(() => [...new Set(muscle.roles.map((r) => r.movementId))], [muscle.roles]);
  const rolesForMovement = muscle.roles.filter((r) => r.movementId === roleMovement);
  const visibleInView = new Set(geometry.muscles.map((m) => m.structureId));

  const setLayer = (k: LayerId, v: boolean) => setLayers((l) => ({ ...l, [k]: v }));

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="font-serif text-2xl text-ink">Anatomy Lab</h1>
            <p className="text-xs text-ink-2">Anatómiai ismeretek – kattints egy izomra vagy izomrészre</p>
          </div>
          <Segmented<AnatomicalViewId>
            label="Anatómiai nézet"
            value={viewId}
            onChange={setViewId}
            options={views.filter((v) => v.atlas && viewGeometries[v.id]).map((v) => ({ value: v.id, label: v.name.hu, title: v.description }))}
          />
        </div>

        <div className="h-[56vh] min-h-[340px] md:h-[64vh]">
          <AnatomyViewer
            focus
            geometry={geometry}
            pose={restPoses[viewId]}
            selectedId={selected}
            onSelect={setSelected}
            layers={{ ...layers, labels: showLabels }}
            isolate={isolate}
            attachmentsFor={muscle.id}
            ariaLabel={`${muscle.name.hu} – ${views.find((v) => v.id === viewId)?.name.hu}`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-2">
          <LegendSwatch color="var(--an-origin)" label="E – Eredés (origo)" />
          <LegendSwatch color="var(--an-insertion)" label="T – Tapadás (insertio), szaggatott" dashed />
          <LegendSwatch color="var(--an-muscle-selected)" label="Kiválasztott izom" />
          <LegendSwatch color="var(--an-muscle-dim)" label="Nem kiválasztott izom" />
          <LegendSwatch color="var(--an-bone)" label="Csont" />
          <LegendSwatch color="var(--an-cartilage)" label="Bordaporc" />
          <span className="inline-flex items-center gap-1">◌ Ízület</span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Panel
            title={muscle.regions.length ? 'Izomrészek kiválasztása' : 'Kiválasztás'}
            subtitle={muscle.regions.length ? `A(z) ${muscle.name.hu.toLowerCase()} egésze vagy egy-egy része` : 'Ennek az izomnak nincsenek külön elnevezett részei'}
          >
            <div className="flex flex-col gap-1.5">
              {[{ id: muscle.id, name: muscle.name }, ...muscle.regions].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelected(r.id)}
                  aria-pressed={selected === r.id}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition ${selected === r.id ? 'border-accent-2 bg-accent/20' : 'border-line hover:bg-bg-2'} ${!visibleInView.has(r.id) && r.id !== muscle.id ? 'opacity-70' : ''}`}
                >
                  <TermInline term={r.name} />
                  {r.id !== muscle.id && !visibleInView.has(r.id) && <span className="ml-1 text-[11px] text-ink-2">– ebben a nézetben nem látható</span>}
                </button>
              ))}
            </div>
          </Panel>
          <Panel title={<span className="inline-flex items-center gap-1.5"><Layers size={15} /> Rétegek és megjelenítés</span>}>
            <Toggle label="Csontváz" checked={layers.bones} onChange={(v) => setLayer('bones', v)} />
            <Toggle label="Felületes izmok" checked={layers['superficial-muscles']} onChange={(v) => setLayer('superficial-muscles', v)} />
            <Toggle label="Mély izmok" hint="kis mellizom, kulcscsont alatti izom" checked={layers['deep-muscles']} onChange={(v) => setLayer('deep-muscles', v)} />
            <Toggle label="Eredés és tapadás" checked={layers.attachments} onChange={(v) => setLayer('attachments', v)} />
            <Toggle label="Ízületek" checked={layers.joints} onChange={(v) => setLayer('joints', v)} />
            <Toggle label="Feliratok" checked={showLabels} onChange={setShowLabels} />
            <Toggle label="Izolált megjelenítés" hint="csak a kiválasztott izom" checked={isolate} onChange={setIsolate} />
          </Panel>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {selectedIsOther ? (
            <Panel title="Kiválasztott struktúra">
              <TermBlock term={structureName(selected)} />
              <p className="mt-3 text-sm text-ink-2">
                Kapcsolódó struktúra – az első verzióban nem rendelkezik önálló oktatási modullal. A mozgásokban betöltött szerepe a Biomechanics Labban látható.
              </p>
              <button type="button" className="mt-3 text-sm text-accent-2 underline" onClick={() => setSelected(muscle.id)}>
                Vissza: {muscle.name.hu}
              </button>
            </Panel>
          ) : (
            <>
              <Panel className="lg:col-span-2">
                <TermBlock term={region ? region.name : muscle.name} size="lg" />
                {region && <p className="mt-1 text-xs text-ink-2">A(z) {muscle.name.hu} része</p>}
                {!region && <p className="mt-3 text-sm leading-relaxed text-ink-2">{muscle.summary}</p>}
              </Panel>

              <Panel title="Eredés és tapadás">
                <dl className="flex flex-col gap-3 text-sm">
                  {(region ? [region.origin] : muscle.origin).map((o, i) => (
                    <AttachmentRow key={`o${i}`} kind="origin" text={o.description} extent={o.extent} sourceIds={o.sourceIds} />
                  ))}
                  {(region ? [region.insertion] : muscle.insertion).map((o, i) => (
                    <AttachmentRow key={`i${i}`} kind="insertion" text={o.description} extent={o.extent} sourceIds={o.sourceIds} />
                  ))}
                </dl>
              </Panel>

              <Panel title={<TermInline term={{ hu: 'Beidegzés', en: 'Innervation', la: 'Innervatio' }} />}>
                <ClaimList claims={region ? [region.innervation] : muscle.innervation} />
                {!region && (
                  <ul className="mt-2 flex flex-col gap-1 text-xs text-ink-2">
                    {muscle.nerveIds.map((id) => {
                      const n = nerveById(id);
                      return n ? (
                        <li key={id}>
                          <TermInline term={n.name} /> – {n.roots}. {n.origin}
                        </li>
                      ) : null;
                    })}
                  </ul>
                )}
              </Panel>

              <Panel title="Funkciók">
                <ClaimList claims={region ? region.functions : muscle.functions} />
              </Panel>

              {!region && (
                <>
                  <Panel title="Érintett ízületek">
                    <ul className="text-sm">
                      {muscle.jointIds.map((id) => {
                        const j = jointById(id);
                        return j ? <li key={id}><TermInline term={j.name} /></li> : null;
                      })}
                    </ul>
                  </Panel>

                  <Panel className="lg:col-span-2" title="Szerepek mozgásonként" subtitle="Az agonista, antagonista és szinergista szerep mindig egy konkrét mozgáshoz tartozik.">
                    <label className="mb-2 flex flex-col gap-1 text-xs text-ink-2">
                      Mozgás
                      <select value={roleMovement} onChange={(e) => setRoleMovement(e.target.value as JointMovementId)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink">
                        {roleMovements.map((id) => (
                          <option key={id} value={id}>
                            {movementById(id)?.name.hu}
                          </option>
                        ))}
                      </select>
                    </label>
                    <RoleTable roles={rolesForMovement} highlight={muscle.id} />
                    <div className="mt-2">
                      <RoleLegend compact />
                    </div>
                  </Panel>

                  <Panel title="Stabilizáló funkció">
                    <ClaimList claims={muscle.stabilization} />
                  </Panel>

                  <Panel title="Összefüggések a gyakorlatban">
                    <ClaimList claims={muscle.notes} />
                  </Panel>

                </>
              )}
            </>
          )}
        </div>
        <Disclaimer>
          Az ábra saját szerkesztésű, egyszerűsített 2D oktatási modell: a csontos tájékozódási pontok és az izmok egymáshoz viszonyított helyzete tankönyvi leírásokon alapul, de nem
          mért vagy szkennelt geometria. A beidegző idegek ellenőrzött geometria hiányában nem szerepelnek az ábrán. Nagyítás: + / − gombok vagy Ctrl + görgő; pásztázás húzással vagy a
          nyílbillentyűkkel.
        </Disclaimer>
      </div>

      <aside className="flex flex-col gap-3 xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)] xl:self-start xl:overflow-y-auto">
        <Panel title="Forrásjegyzék">
          <SourceList ids={muscle.sourceIds} />
        </Panel>
      </aside>
    </div>
  );
}

function AttachmentRow({ kind, text, extent, sourceIds }: { kind: 'origin' | 'insertion'; text: { hu: string; en: string; la?: string }; extent: string; sourceIds: string[] }) {
  return (
    <div className="flex gap-2.5">
      <span
        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white"
        style={{ background: kind === 'origin' ? 'var(--an-origin)' : 'var(--an-insertion)' }}
        aria-hidden="true"
      >
        {kind === 'origin' ? 'E' : 'T'}
      </span>
      <div>
        <dt className="text-xs text-ink-2">
          {kind === 'origin' ? 'Eredés (Origin, Origo)' : 'Tapadás (Insertion, Insertio)'} · {extent === 'area' ? 'terület' : extent === 'line' ? 'vonal / sáv' : 'pont'}
        </dt>
        <dd className="text-ink">{text.hu}</dd>
        <dd className="text-xs text-ink-2">
          {text.en}
          {text.la && <> · <i>{text.la}</i></>}
        </dd>
        <dd className="mt-0.5">
          <SourceRefs ids={sourceIds} />
        </dd>
      </div>
    </div>
  );
}

export function RoleTable({ roles, highlight }: { roles: Muscle['roles']; highlight?: string }) {
  const order: MuscleRoleType[] = ['agonist', 'synergist', 'antagonist', 'stabilizer'];
  return (
    <div className="flex flex-col gap-2">
      {order.map((type) => {
        const rs = roles.filter((r) => r.role === type);
        if (!rs.length) return null;
        return (
          <div key={type} className="rounded-xl bg-bg-2/50 p-2.5">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold" style={{ color: `var(--an-${type})` }}>
              {roleLabels[type]}
            </div>
            {rs.map((r, i) => (
              <div key={i} className="text-sm">
                <ul className="flex flex-wrap gap-1">
                  {r.structureIds.map((id) => (
                    <li key={id} className={`rounded-full border px-2 py-0.5 text-xs ${matchesStructure(id, highlight) ? 'border-accent-2 text-highlight' : 'border-line text-ink'}`}>
                      {structureName(id).hu}
                    </li>
                  ))}
                </ul>
                {r.note && <p className="mt-1 text-xs text-ink-2">{r.note}</p>}
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <EvidenceBadge level={r.evidence} />
                  <SourceRefs ids={r.sourceIds} />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function LegendSwatch({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block h-2.5 w-5 rounded-sm" style={{ background: dashed ? `repeating-linear-gradient(90deg, ${color} 0 5px, transparent 5px 8px)` : color }} />
      {label}
    </span>
  );
}
