import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Equal, Zap } from 'lucide-react';
import type { ContractionType, Muscle, MuscleRoleType, RoleDisplayMode } from '../../types';
import { AnatomyViewer, ALL_LAYERS } from '../../components/anatomy/AnatomyViewer';
import { AnimationControls } from '../../components/animation/AnimationControls';
import { RoleLegend } from '../../components/anatomy/RoleLegend';
import { RoleTable } from '../anatomy/AnatomyLab';
import { ClaimList, Disclaimer, Panel, Segmented, TermBlock, Toggle } from '../../components/ui';
import { motionById } from '../../data/motions/pectoralisMajorMotions';
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

  if (!motion) return <p className="text-sm text-ink-2">Ehhez az izomhoz még nincs mozgásdefiníció.</p>;
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

  const changeMotion = (id: string) => {
    setMotionId(id);
    player.reset();
  };
  const changeType = (t: ContractionType) => {
    setType(t);
    player.reset();
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="font-serif text-2xl text-ink">Biomechanics Lab</h1>
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

        <div className="h-[52vh] min-h-[320px] md:h-[60vh]">
          <AnatomyViewer
            geometry={geometry}
            pose={pose}
            selectedId={selected}
            onSelect={setSelected}
            roleMap={roleMap}
            activeIds={activeIds}
            attachmentsFor={muscle.id}
            layers={{ ...ALL_LAYERS, labels: showLabels, 'deep-muscles': false }}
            ariaLabel={`${motion.name.hu} animáció – ${contractionLabels[type].hu} működés`}
            overlay={
              <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1.5 text-xs" aria-live="polite">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface/90 px-2 py-1 text-ink ring-1 ring-line">
                  <Zap size={14} className={activeIds.length ? 'text-highlight' : 'text-ink-2'} />
                  Aktivitás: <b>{activeIds.length ? 'aktív' : 'nyugalom'}</b>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface/90 px-2 py-1 text-ink ring-1 ring-line">
                  {changeMeta.icon} Izomhossz: <b>{changeMeta.text}</b>
                </span>
                <span className="rounded-lg bg-surface/90 px-2 py-1 text-ink-2 ring-1 ring-line">{contractionLabels[type].hu} ({contractionLabels[type].en})</span>
              </div>
            }
          />
        </div>

        <Panel>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-ink-2">Működési típus</span>
              <Segmented<ContractionType>
                label="Izomműködési típus"
                value={type}
                onChange={changeType}
                options={(['concentric', 'eccentric', 'isometric'] as ContractionType[]).map((t) => ({ value: t, label: contractionLabels[t].hu }))}
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
            <Toggle label="Feliratok" checked={showLabels} onChange={setShowLabels} />
          </div>
        </Panel>
        <Disclaimer>
          Előre definiált, egyszerűsített 2D mozgás. Nem fizikai szimuláció: nem számol erőt, forgatónyomatékot vagy izomhosszt, és nem mutat izomaktivációs százalékot. Az
          „aktív” jelzés csak azt szemlélteti, hogy az izom a mozgás során működik. A lapocka és a kulcscsont együttmozgása nem szerepel az animációban.
        </Disclaimer>
      </div>

      <div className="flex flex-col gap-3">
        <Panel>
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
        <Panel title="Szerepek">
          <RoleTable roles={motion.roles} highlight={muscle.id} />
        </Panel>
        <Panel title="Állítások és források">
          <ClaimList claims={motion.claims} />
        </Panel>
      </div>
    </div>
  );
}
