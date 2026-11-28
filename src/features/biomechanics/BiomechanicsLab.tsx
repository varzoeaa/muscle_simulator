import { useMemo, useState, type ReactNode } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Equal, Zap } from 'lucide-react';
import type { ContractionType, Muscle, MuscleRole, MuscleRoleType, RoleDisplayMode } from '../../types';
import { AnatomyViewer, ALL_LAYERS, isStructureDrawn, matchesStructure } from '../../components/anatomy/AnatomyViewer';
import { AnimationControls } from '../../components/animation/AnimationControls';
import { RoleLegend } from '../../components/anatomy/RoleLegend';
import { RoleTable } from '../anatomy/AnatomyLab';
import { ModulePending } from '../../components/ui';
import { ClaimList, Disclaimer, Panel, Segmented, TermBlock, Toggle } from '../../components/ui';
import { motionById } from '../../data/motions';
import { viewGeometries, viewById } from '../../data/geometry';
import { structureName } from '../../data/muscles';
import { lengthChange, motionPose } from '../../engines/animation/animationEngine';
import { useAnimationPlayer } from '../../hooks/useAnimationPlayer';
import { useSettingsStore } from '../../stores/settingsStore';

export const contractionLabels: Record<ContractionType, { hu: string; en: string }> = {
  concentric: { hu: 'Koncentrikus', en: 'Concentric' },
  eccentric: { hu: 'Excentrikus', en: 'Eccentric' },
  isometric: { hu: 'Izometriás', en: 'Isometric' }
};

const roleModes: { value: RoleDisplayMode; label: string }[] = [
  { value: 'selected', label: 'Csak a kiválasztott izom' },
  { value: 'agonist', label: 'Agonisták' },
  { value: 'antagonist', label: 'Antagonisták' },
  { value: 'synergist', label: 'Szinergisták' },
  { value: 'all', label: 'Minden releváns izom' }
];

export function BiomechanicsLab() {
  const { muscle } = useOutletContext<{ muscle: Muscle }>();
  const motionList = muscle.motionIds.map(motionById).filter((m) => !!m);
  const [motionId, setMotionId] = useState(motionList[0]?.id ?? '');
  const motion = motionById(motionId) ?? motionList[0];
  const [type, setType] = useState<ContractionType>('concentric');
  const [roleMode, setRoleMode] = useState<RoleDisplayMode>('selected');
  const [selected, setSelected] = useState<string>(muscle.id);
  const showLabels = useSettingsStore((s) => s.showLabels);
  const setShowLabels = useSettingsStore((s) => s.setShowLabels);
  const player = useAnimationPlayer(motion?.durationMs ?? 3000);

  const roleMap = useMemo(() => {
    if (!motion || roleMode === 'selected') return undefined;
    const map: Record<string, MuscleRoleType> = {};
    motion.roles.forEach((r) => {
      if (roleMode === 'all' || r.role === roleMode) r.structureIds.forEach((id) => (map[id] = r.role));
    });
    return map;
  }, [motion, roleMode]);

  if (!motion) return <ModulePending name={muscle.name.hu} what="mozgásanimációi" />;
  const geometry = viewGeometries[motion.viewId]!;
  const pose = motionPose(motion, player.state.progress, type);
  const change = lengthChange(type, player.state.playing);
  const agonists = motion.roles.filter((r) => r.role === 'agonist').flatMap((r) => r.structureIds);
  // Aktivitás: lejátszás közben (izometriásnál a tartás alatt) az agonisták aktívak – a hosszváltozástól függetlenül.
  const activeIds = player.state.playing ? [muscle.id, ...agonists] : [];
  const changeMeta = {
    shortening: { icon: <ArrowDownRight size={15} />, text: 'Rövidül' },
    lengthening: { icon: <ArrowUpRight size={15} />, text: 'Hosszabbodik' },
    constant: { icon: <Equal size={15} />, text: player.state.playing ? 'Közel változatlan' : 'Nincs mozgás' }
  }[change];

  const extraViews = (motion.extraViews ?? []).filter((v) => !!viewGeometries[v.viewId]);
  const shownGeometries = [geometry, ...extraViews.map((v) => viewGeometries[v.viewId]!)];
  const mainAria = `${motion.name.hu} animáció – ${contractionLabels[type].hu} működés`;
  const viewerProps = {
    selectedId: selected,
    onSelect: setSelected,
    roleMap,
    activeIds,
    attachmentsFor: muscle.id,
    // A mély réteg csak akkor látszik, ha maga a vizsgált izom is mély (pl. kis mellizom); egyébként zsúfolná az ábrát.
    layers: { ...ALL_LAYERS, labels: showLabels, 'deep-muscles': geometry.muscles.some((m) => m.layer === 'deep-muscles' && matchesStructure(m.structureId, muscle.id)) }
  };
  const statusBadges = (
    <div className="flex flex-wrap gap-1.5 text-xs" aria-live="polite">
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface/90 px-2 py-1 text-ink ring-1 ring-line">
        <Zap size={14} className={activeIds.length ? 'text-highlight' : 'text-ink-2'} />
        Aktivitás: <b>{activeIds.length ? 'aktív' : 'nyugalom'}</b>
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface/90 px-2 py-1 text-ink ring-1 ring-line">
        {changeMeta.icon} Izomhossz: <b>{changeMeta.text}</b>
      </span>
      <span className="rounded-lg bg-surface/90 px-2 py-1 text-ink-2 ring-1 ring-line">
        {contractionLabels[type].hu} ({contractionLabels[type].en})
      </span>
    </div>
  );
  const allowedTypes: ContractionType[] = motion.contractionTypes ?? ['concentric', 'eccentric', 'isometric'];
  const changeMotion = (id: string) => {
    const next = motionById(id);
    if (next?.contractionTypes && !next.contractionTypes.includes(type)) setType(next.contractionTypes[0]!);
    setMotionId(id);
    player.reset();
  };
  const changeType = (t: ContractionType) => {
    setType(t);
    player.reset();
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="font-serif text-2xl text-ink">Biomechanika</h1>
            <p className="text-xs text-ink-2">Izomműködés és mozgásanimációk · nézet: {viewById(motion.viewId)?.name.hu}</p>
          </div>
          <label className="flex items-center gap-2 text-xs text-ink-2">
            Mozgás
            <select value={motion.id} onChange={(e) => changeMotion(e.target.value)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink">
              {motionList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name.hu}
                </option>
              ))}
            </select>
          </label>
        </div>

        {extraViews.length === 0 ? (
          <div className="h-[52vh] min-h-[320px] md:h-[60vh]">
            <AnatomyViewer {...viewerProps} geometry={geometry} pose={pose} viewBoxOverride={motion.viewBox} ariaLabel={mainAria} overlay={<div className="pointer-events-none absolute left-2 top-2">{statusBadges}</div>} />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {statusBadges}
            <div className="grid gap-2 md:grid-cols-2">
              <ViewTile
                className={extraViews.length >= 2 ? 'md:col-span-2' : ''}
                title={viewById(motion.viewId)?.name.hu ?? ''}
                note="Fő nézet – a mozgás síkja torzítás nélkül"
              >
                <AnatomyViewer {...viewerProps} geometry={geometry} pose={pose} viewBoxOverride={motion.viewBox} ariaLabel={mainAria} />
              </ViewTile>
              {extraViews.map((v) => (
                <ViewTile key={v.viewId} title={viewById(v.viewId)?.name.hu ?? ''} note={[v.note, roleMode === 'selected' ? 'Izomnév: vidd fölé az egeret, vagy válts szerepkör-megjelenítésre.' : undefined].filter(Boolean).join(' ')}>
                  <AnatomyViewer {...viewerProps} layers={{ ...viewerProps.layers, labels: false }} geometry={viewGeometries[v.viewId]!} pose={v.mapPose(pose)} viewBoxOverride={v.viewBox} ariaLabel={`${mainAria} – ${viewById(v.viewId)?.name.hu}`} />
                </ViewTile>
              ))}
            </div>
          </div>
        )}

        <Panel>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-ink-2">Működési típus</span>
              <Segmented<ContractionType>
                label="Izomműködési típus"
                value={type}
                onChange={changeType}
                options={allowedTypes.map((t) => ({ value: t, label: contractionLabels[t].hu }))}
              />
            </div>
            <AnimationControls
              state={player.state}
              onPlay={player.play}
              onPause={player.pause}
              onRewind={player.rewind}
              onReset={player.reset}
              onSeek={player.seek}
              onSpeed={player.setSpeed}
              playLabel={type === 'isometric' ? 'Tartás indítása' : 'Összehúzódás indítása'}
            />
          </div>
        </Panel>

        <Panel title="Megjelenítési mód" subtitle="Szerepek a kiválasztott mozgásban – szín, mintázat és betűjel (AG/SZ/AN/ST)">
          <div className="flex flex-col gap-3">
            <Segmented<RoleDisplayMode> size="sm" label="Megjelenítési mód" value={roleMode} onChange={setRoleMode} options={roleModes} />
            <RoleLegend />
            {roleMode !== 'selected' && <RoleVisibility roles={motion.roles} mode={roleMode} drawn={(id) => shownGeometries.some((g) => isStructureDrawn(g, id))} />}
            <Toggle label="Feliratok" hint="szerepkör-módban csak a jelölt izmok felirata látszik, és az mindig" checked={showLabels} onChange={setShowLabels} />
          </div>
        </Panel>
        <div className="grid gap-3 lg:grid-cols-2">
          <Panel className="lg:col-span-2">
            <TermBlock term={motion.name} size="lg" />
            <p className="mt-3 text-sm leading-relaxed text-ink-2">{motion.description}</p>
          </Panel>
          <Panel title={`${contractionLabels[type].hu} működés`}>
            <p className="text-sm font-medium text-ink">{motion.contraction[type].summary}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{motion.contraction[type].detail}</p>
            <p className="mt-3 rounded-xl bg-bg-2/60 p-2.5 text-xs leading-relaxed text-ink-2">{motion.resistance}</p>
          </Panel>
          <Panel title="A három működési típus röviden">
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <b>Koncentrikus:</b> az aktív izom rövidül.
              </li>
              <li>
                <b>Excentrikus:</b> az aktív izom terhelés alatt hosszabbodik.
              </li>
              <li>
                <b>Izometriás:</b> az izom aktívan feszül, miközben az izom-ín egység hossza és az ízületi helyzet megközelítőleg változatlan.
              </li>
            </ul>
            <p className="mt-2 text-xs text-ink-2">Az aktivitás nem azonos a rövidüléssel: mindhárom esetben aktív az izom.</p>
          </Panel>
          <Panel title="Izomrészek szerepe ebben a mozgásban">
            <ul className="flex flex-col gap-2 text-sm">
              {motion.regionNotes.map((n) => (
                <li key={n.regionId}>
                  <button type="button" className="text-left font-medium text-highlight underline decoration-dotted underline-offset-2" onClick={() => setSelected(n.regionId)}>
                    {structureName(n.regionId).hu}
                  </button>
                  <span className="text-ink-2"> – {n.text}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="lg:col-span-2" title="Szerepek">
            <RoleTable roles={motion.roles} highlight={muscle.id} />
          </Panel>
        </div>
        <Disclaimer>
          Előre definiált, egyszerűsített 2D mozgás. Nem fizikai szimuláció: nem számol erőt, forgatónyomatékot vagy izomhosszt, és nem mutat izomaktivációs százalékot. Az
          „aktív” jelzés csak azt szemlélteti, hogy az izom a mozgás során működik. A lapocka és a kulcscsont együttmozgása nem szerepel az animációban.
        </Disclaimer>
      </div>

      <aside className="flex flex-col gap-3 xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)] xl:self-start xl:overflow-y-auto">
        <Panel title="Állítások és források">
          <ClaimList claims={motion.claims} />
        </Panel>
      </aside>
    </div>
  );
}

const roleLetters: Record<MuscleRoleType, string> = { agonist: 'AG', synergist: 'SZ', antagonist: 'AN', stabilizer: 'ST' };

/** A megjelenített szerepkörök izmai, jelezve, ha egy izom ebből a nézetből nem látszik. */
function RoleVisibility({ roles, mode, drawn }: { roles: MuscleRole[]; mode: RoleDisplayMode; drawn: (id: string) => boolean }) {
  const items = roles
    .filter((r) => mode === 'all' || r.role === mode)
    .flatMap((r) => r.structureIds.map((id) => ({ id, role: r.role, visible: drawn(id) })));
  if (!items.length) return <p className="text-xs text-ink-2">Ebben a mozgásban nincs ilyen szerepű izom.</p>;
  const hidden = items.filter((i) => !i.visible);
  return (
    <div className="flex flex-col gap-2 text-xs">
      <ul className="flex flex-wrap gap-1.5" aria-label="Jelölt izmok">
        {items.map((i) => (
          <li
            key={`${i.role}-${i.id}`}
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${i.visible ? 'border-line text-ink' : 'border-dashed border-line text-ink-2'}`}
            title={i.visible ? 'Az ábrán látható' : 'Ebből a nézetből nem látható'}
          >
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: `var(--an-${i.role})` }} aria-hidden="true" />
            <b>{roleLetters[i.role]}</b> {structureName(i.id).hu}
            {!i.visible && <span className="text-ink-2">– egyik nézetből sem látható</span>}
          </li>
        ))}
      </ul>
      {hidden.length > 0 && (
        <p className="text-ink-2">
          A szaggatott keretű izmok ({hidden.length}) a megjelenített nézetekből takarásban vannak (pl. mélyen fekszenek), ezért csak a listában szerepelnek.
        </p>
      )}
    </div>
  );
}

function ViewTile({ title, note, className = '', children }: { title: string; note?: string; className?: string; children: ReactNode }) {
  return (
    <figure className={`flex flex-col gap-1 ${className}`}>
      <div className="h-[44vh] min-h-[280px]">{children}</div>
      <figcaption className="px-1 text-xs text-ink-2">
        <b className="text-ink">{title}</b>
        {note && <> · {note}</>}
      </figcaption>
    </figure>
  );
}
