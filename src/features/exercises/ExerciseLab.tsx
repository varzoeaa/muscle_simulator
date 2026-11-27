import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Equal } from 'lucide-react';
import type { DisplayRoleType, Exercise, ExercisePhaseRole, ExercisePhaseType, LengthChange, Muscle } from '../../types';
import { exerciseById } from '../../data/exercises';
import { structureName } from '../../data/muscles';
import { superiorView } from '../../data/geometry/superiorView';
import { BenchPressScene } from '../../components/anatomy/BenchPressScene';
import { SagittalExerciseScene } from '../../components/anatomy/SagittalExerciseScene';
import { TransverseExerciseScene } from '../../components/anatomy/TransverseExerciseScene';
import { GirdleExerciseScene } from '../../components/anatomy/GirdleExerciseScene';
import { viewGeometries } from '../../data/geometry';
import type { SceneMuscleLabel } from '../../components/anatomy/sagittalFigure';
import { isStructureDrawn } from '../../components/anatomy/AnatomyViewer';
import { AnimationControls } from '../../components/animation/AnimationControls';
import { ClaimList, Disclaimer, EvidenceBadge, Panel, Segmented, Slider, SourceList, SourceRefs, TermBlock, Toggle } from '../../components/ui';
import { RoleLegend, roleLabels, roleLetters } from '../../components/anatomy/RoleLegend';
import { applyRangeOfMotion, cycleDepth, phaseAt } from '../../engines/animation/animationEngine';
import { platesPerSide } from '../../engines/animation/benchKinematics';
import { useAnimationPlayer, useReducedMotion } from '../../hooks/useAnimationPlayer';
import { useSettingsStore } from '../../stores/settingsStore';
import { ModulePending } from '../../components/ui';
import {
  BenchAngleComparison,
  BenchImplementComparison,
  FlyAngleComparison,
  FlyMachineComparison,
  PecDeckHeightComparison,
  CablePulleyComparison,
  cablePulleyZoneFor,
  benchAngleZoneFor,
  flyAngleZoneFor,
  pecDeckHeightZoneFor
} from './BenchVariantComparison';
import { lerp } from '../../utils/geometry';
import { PushUpOtherVariants, PushUpSupportComparison, pushUpSupportText, pushUpTilt } from './PushUpVariantPanels';
import { DIP_VARIANTS, type DipOptions, type DipVariant, type PushUpOptions } from '../../engines/animation/sagittalKinematics';
import { DipLeanComparison, DipVariantComparison } from './DipVariantPanels';
import { dipVariantNames } from '../../data/exercises/dipVariants';
import { DEFAULT_STRETCH, type StretchPosition } from '../../data/exercises/stretchVariants';
import { StretchComparison, StretchDosagePanel, StretchPositionPanel, emphasizedRegionIds } from './StretchPanels';
import type { HandWidth } from '../../data/exercises/pushUpVariants';

type PhaseFilter = 'all' | ExercisePhaseType;

export const phaseTypeLabels: Record<ExercisePhaseType, string> = {
  eccentric: 'Excentrikus',
  isometric: 'Izometriás',
  concentric: 'Koncentrikus',
  'passive-stretch': 'Nyújtás felvétele',
  'static-stretch': 'Statikus tartás',
  release: 'Visszatérés'
};

export function ExerciseLab() {
  const { muscle } = useOutletContext<{ muscle: Muscle }>();
  const [params, setParams] = useSearchParams();
  const ids = muscle.exerciseIds;
  const exercise = exerciseById(ids.includes(params.get('gyakorlat') ?? '') ? params.get('gyakorlat')! : ids[0]);
  /** Gyakorlatváltás; a pad dőlésszöge átvihető (pl. rúdról kézisúlyzóra váltáskor). */
  const select = (id: string, benchAngle?: number) =>
    setParams(
      (p) => {
        p.set('gyakorlat', id);
        if (benchAngle === undefined) p.delete('pad');
        else p.set('pad', String(benchAngle));
        return p;
      },
      { replace: true }
    );
  const padParam = Number(params.get('pad'));

  if (!exercise) return <ModulePending name={muscle.name.hu} what="gyakorlatai" />;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      {/* A kulcs miatt gyakorlatváltáskor a lejátszás és a paraméterek alaphelyzetbe kerülnek. */}
      <ExerciseView key={exercise.id} exercise={exercise} initialAngle={params.has('pad') && Number.isFinite(padParam) ? padParam : undefined} onSelect={select} />

      <aside className="flex flex-col gap-3 xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)] xl:self-start xl:overflow-y-auto">
        <Panel title="Gyakorlatok" subtitle={`${muscle.name.hu} – gyakorlatkönyvtár`}>
          <ul className="flex flex-col gap-1.5 text-sm">
            {ids.map((id) => {
              const e = exerciseById(id);
              if (!e) return null;
              const current = e.id === exercise.id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    aria-current={current ? 'true' : undefined}
                    onClick={() => select(id)}
                    className={`w-full rounded-xl border px-3 py-2 text-left transition-colors ${current ? 'border-accent-2 bg-accent/20 text-ink' : 'border-line text-ink-2 hover:border-accent-2 hover:text-ink'}`}
                  >
                    {e.name.hu}
                    <span className="block text-[11px] text-ink-2">{e.name.en}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>
        <Panel title="Források">
          <SourceList ids={exercise.sourceIds} />
        </Panel>
      </aside>
    </div>
  );
}

function ExerciseView({ exercise, initialAngle, onSelect }: { exercise: Exercise; initialAngle?: number; onSelect: (id: string, benchAngle?: number) => void }) {
  const reduced = useReducedMotion();
  const player = useAnimationPlayer(exercise.cycleDurationMs, { loop: true });
  const p = exercise.parameters;
  const [rom, setRom] = useState(p.rangeOfMotion?.default ?? 1);
  const [angle, setAngle] = useState(p.benchAngle && initialAngle !== undefined ? Math.min(p.benchAngle.max, Math.max(p.benchAngle.min, initialAngle)) : (p.benchAngle?.default ?? 0));
  const [load, setLoad] = useState(p.load?.default ?? 0);
  const [elevation, setElevation] = useState(p.armElevation?.default ?? 0);
  const [pulley, setPulley] = useState(p.pulleyAngle?.default ?? 0);
  const [pushUp, setPushUp] = useState<PushUpOptions>({ handCm: p.handSupport?.default ?? 0, feetCm: p.feetSupport?.default ?? 0, knees: false });
  const [handWidth, setHandWidth] = useState<HandWidth>('shoulder');
  const [dips, setDips] = useState<DipOptions>({ variant: 'bar', lean: p.dipLean?.default ?? 30 });
  const setDipVariant = (variant: DipVariant) => setDips({ variant, lean: DIP_VARIANTS[variant].defaultLean });
  const [stretchPosRaw, setStretchPos] = useState<StretchPosition>(DEFAULT_STRETCH);
  const isStretch = exercise.animation.kind === 'transverse' && exercise.animation.implement === 'stretch';
  const supineStretch = exercise.id === 'supine-pectoral-stretch';
  // Fekve a medence nem fordul el.
  const stretchPos = supineStretch ? { ...stretchPosRaw, trunkRotation: false } : stretchPosRaw;
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>('all');
  const showLabels = useSettingsStore((s) => s.showLabels);
  const setShowLabels = useSettingsStore((s) => s.setShowLabels);
  const { setRange, seek } = player;

  useEffect(() => {
    if (phaseFilter === 'all') setRange([0, 1]);
    else {
      const ph = exercise.phases.find((x) => x.type === phaseFilter);
      if (ph) {
        setRange([ph.from, ph.to]);
        seek(ph.from);
      }
    }
  }, [phaseFilter, exercise, setRange, seek]);

  const t = player.state.progress;
  // Ha a felhasználó kiválasztott egy szakaszt, az a kiemelt szakasz; egyébként a lejátszás aktuális szakasza.
  const phase = (phaseFilter !== 'all' ? exercise.phases.find((x) => x.type === phaseFilter) : undefined) ?? phaseAt(exercise.phases, t)!;
  const depth = applyRangeOfMotion(cycleDepth(exercise.phases, t), rom);
  const roles = rolesFor(exercise, phase.type);
  const anim = exercise.animation;
  const drawn = (id: string) =>
    anim.kind === 'transverse' ? isStructureDrawn(superiorView, id) : anim.kind === 'girdle' ? isStructureDrawn(viewGeometries[anim.viewId]!, id) : sagittalMuscles.includes(id);
  // A gyakorlat célizma (pl. nagy vagy kis mellizom) – a fejléc-címke ennek a szerepét mutatja.
  const target = exercise.muscleIds[0] ?? 'muscle-pectoralis-major';
  const sceneLabels = sceneMuscleLabels(roles);
  const roleMap = useMemo(() => transverseRoleMap(roles), [roles]);
  const pecRole = roles.find((r) => r.structureIds.includes(target));
  const agonists = [...new Set(roles.filter((r) => r.role === 'agonist').flatMap((r) => r.structureIds))];
  const presentRoles = displayRolesIn(exercise);
  const hidden = hiddenRoles(roles, drawn);
  const phaseText = `${phase.name}${pecRole ? `, ${structureName(target).hu.toLowerCase()}: ${lengthText[pecRole.lengthChange].text}` : ''}`;

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div>
        <h1 className="font-serif text-2xl text-ink">Exercise Lab</h1>
        <p className="text-xs text-ink-2">Edzőtermi gyakorlatok – interaktív végrehajtási animáció</p>
      </div>

      <div className="relative h-[52vh] min-h-[320px] overflow-hidden rounded-2xl bg-canvas md:h-[60vh]">
        {anim.kind === 'bench' && (
          <BenchPressScene
            incline={angle}
            depth={depth}
            loadKg={load}
            barKg={p.load?.implementKg ?? 0}
            implement={anim.implement}
            phaseText={phaseText}
            active={player.state.playing}
            showLabels={showLabels}
            muscleLabels={sceneLabels}
          />
        )}
        {anim.kind === 'sagittal' && (
          <SagittalExerciseScene
            preset={anim.preset}
            depth={depth}
            loadKg={load}
            phaseText={phaseText}
            active={player.state.playing}
            showLabels={showLabels}
            muscleLabels={sceneLabels}
            pushUp={p.handSupport ? pushUp : undefined}
            dips={p.dipLean ? dips : undefined}
          />
        )}
        {anim.kind === 'transverse' && (
          <TransverseExerciseScene
            animation={anim}
            depth={depth}
            roleMap={roleMap}
            activeIds={isStretch ? emphasizedRegionIds(stretchPos) : player.state.playing && pecRole?.role !== 'stretched' ? agonists : []}
            showLabels={showLabels}
            ariaLabel={`${exercise.name.hu} felülnézetben – ${phaseText}`}
          />
        )}
        {anim.kind === 'girdle' && (
          <GirdleExerciseScene
            animation={anim}
            depth={depth}
            roleMap={roleMap}
            activeIds={player.state.playing && pecRole?.role !== 'stretched' ? agonists : []}
            showLabels={showLabels}
            ariaLabel={`${exercise.name.hu} – ${phaseText}`}
          />
        )}
        <div className="pointer-events-none absolute left-2 top-2 flex max-w-[46%] flex-col gap-1.5 text-xs" aria-live="polite">
          <span className="rounded-lg bg-surface/90 px-2 py-1 font-medium text-ink ring-1 ring-line">{phase.name}</span>
          {pecRole && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface/90 px-2 py-1 text-ink ring-1 ring-line">
              {lengthText[pecRole.lengthChange].icon} {structureName(target).hu}: {pecRole.role === 'stretched' ? 'passzív, ' : 'aktív, '}
              {lengthText[pecRole.lengthChange].text}
            </span>
          )}
          {p.benchAngle && (
            <span className="rounded-lg bg-surface/90 px-2 py-1 text-ink ring-1 ring-line">
              {angle}° – {(anim.kind === 'bench' ? benchAngleZoneFor : flyAngleZoneFor)(angle).name}
            </span>
          )}
          {p.dipLean && (
            <span className="rounded-lg bg-surface/90 px-2 py-1 text-ink ring-1 ring-line">
              {dipVariantNames[dips.variant]} · törzsdőlés alul: {dips.lean}°
            </span>
          )}
          {p.handSupport && (
            <span className="rounded-lg bg-surface/90 px-2 py-1 text-ink ring-1 ring-line">
              {pushUpSupportText(pushUp)} · a test dőlése: {Math.round(pushUpTilt(pushUp).top)}° → {Math.round(pushUpTilt(pushUp).bottom)}°
            </span>
          )}
          {p.pulleyAngle && (
            <span className="rounded-lg bg-surface/90 px-2 py-1 text-ink ring-1 ring-line">
              Húzásirány: {pulley > 0 ? '+' : ''}
              {pulley}° – {cablePulleyZoneFor(pulley).name}
            </span>
          )}
          {p.armElevation && (
            <span className="rounded-lg bg-surface/90 px-2 py-1 text-ink ring-1 ring-line">
              Kar: {elevation > 0 ? '+' : ''}
              {elevation}° – {pecDeckHeightZoneFor(elevation).name}
            </span>
          )}
          {showLabels && loadText(exercise, load) && <span className="rounded-lg bg-surface/90 px-2 py-1 text-ink ring-1 ring-line">{loadText(exercise, load)}</span>}
          {agonists.length > 0 && (
            <span className="rounded-lg bg-surface/90 px-2 py-1 text-ink ring-1 ring-line">
              <b style={{ color: 'var(--an-agonist)' }}>AG</b> {phase.type === 'eccentric' ? '(fékez): ' : phase.type === 'isometric' ? '(tart): ' : '(mozgat): '}
              {agonists.map((id) => structureName(id).hu).join(', ')}
            </span>
          )}
        </div>
        <div className="pointer-events-none absolute bottom-2 left-2 right-2 flex flex-col gap-1 rounded-lg bg-surface/85 px-2 py-1 text-[11px] text-ink-2">
          <RoleLegend compact roles={presentRoles} />
          <span>
            {hidden && <>Ebből a nézetből nem látható: {hidden}</>}
            {hidden && pathText(exercise) && ' · '}
            {pathText(exercise)}
          </span>
        </div>
      </div>

      <Panel>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-ink-2">Szakasz</span>
            <Segmented<PhaseFilter>
              size="sm"
              label="Szakasz"
              value={phaseFilter}
              onChange={setPhaseFilter}
              options={[{ value: 'all', label: 'Teljes ismétlés' }, ...exercise.phases.map((ph) => ({ value: ph.type as PhaseFilter, label: phaseTypeLabels[ph.type] }))]}
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
            timelineLabel="Ismétlés idővonala"
          />
          {reduced && <p className="text-xs text-ink-2">Csökkentett mozgás beállítás észlelve: az animáció csak kézi indításra fut, a pulzáló kiemelés ki van kapcsolva.</p>}
          {(anim.kind === 'transverse' || anim.kind === 'girdle') && <p className="text-xs text-ink-2">{anim.viewNote}</p>}
        </div>
      </Panel>

      <Panel title="Paraméterek" subtitle="Szemléltető paraméterek – a súly nem befolyásol izomaktivációt vagy erőt a modellben">
        <div className="grid gap-4 md:grid-cols-3">
          {p.rangeOfMotion && (
            <Slider
              id="rom"
              label="Mozgástartomány"
              value={rom}
              min={p.rangeOfMotion.min}
              max={p.rangeOfMotion.max}
              step={0.05}
              onChange={setRom}
              format={(v) => `${Math.round(v * 100)}%${v >= 1 ? ' (teljes)' : ''}`}
            />
          )}
          {p.benchAngle && (
            <Slider id="angle" label="Pad dőlésszöge" value={angle} min={p.benchAngle.min} max={p.benchAngle.max} step={p.benchAngle.step} onChange={setAngle} format={(v) => `${v}° – ${v < 0 ? 'negatív' : v === 0 ? 'vízszintes' : 'ferde'}`} />
          )}
          {p.dipLean && (
            <Slider
              id="dip-lean"
              label="Törzs előredőlése (alsó helyzet)"
              value={dips.lean}
              min={p.dipLean.min}
              max={p.dipLean.max}
              step={p.dipLean.step}
              onChange={(v) => setDips((o) => ({ ...o, lean: v }))}
              format={(v) => v + '°' + (v < 15 ? ' – közel függőleges' : v < 30 ? ' – közepes' : ' – előredőlt')}
            />
          )}
          {p.handSupport && (
            <Slider
              id="hand-support"
              label="Kéz alátámasztása"
              value={pushUp.handCm}
              min={p.handSupport.min}
              max={p.handSupport.max}
              step={p.handSupport.step}
              onChange={(v) => setPushUp((o) => ({ ...o, handCm: v }))}
              format={(v) => (v ? v + ' cm (pad, doboz)' : 'talajon')}
            />
          )}
          {p.feetSupport && (
            <Slider
              id="feet-support"
              label="Láb alátámasztása"
              value={pushUp.knees ? 0 : pushUp.feetCm}
              min={p.feetSupport.min}
              max={p.feetSupport.max}
              step={p.feetSupport.step}
              onChange={(v) => setPushUp((o) => ({ ...o, feetCm: v, knees: false }))}
              format={(v) => (pushUp.knees ? 'térdelő változat' : v ? v + ' cm (pad, doboz)' : 'talajon')}
            />
          )}
          {p.pulleyAngle && (
            <Slider
              id="pulley"
              label="A csiga magassága (húzásirány)"
              value={pulley}
              min={p.pulleyAngle.min}
              max={p.pulleyAngle.max}
              step={p.pulleyAngle.step}
              onChange={setPulley}
              format={(v) => (v > 0 ? '+' : '') + v + '° – ' + (v > 0 ? 'felülről lefelé' : v === 0 ? 'vállmagasság' : 'alulról felfelé')}
            />
          )}
          {p.armElevation && (
            <Slider
              id="elevation"
              label="A kar magassága (ülésmagasság)"
              value={elevation}
              min={p.armElevation.min}
              max={p.armElevation.max}
              step={p.armElevation.step}
              onChange={setElevation}
              format={(v) => (v > 0 ? '+' : '') + v + '° – ' + (v < 0 ? 'a váll alatt' : v === 0 ? 'vállmagasság' : 'a váll fölött')}
            />
          )}
          {p.load && (
            <Slider
              id="load"
              label={p.load.mode === 'per-hand' ? `Súlyterhelés (${p.load.implementName === 'kábelenként' ? 'kábelenként' : 'kezenként'})` : 'Súlyterhelés'}
              value={load}
              min={p.load.min}
              max={p.load.max}
              step={p.load.step}
              onChange={setLoad}
              format={(v) => `${v.toLocaleString('hu-HU')} kg`}
            />
          )}
        </div>
        <dl className="mt-3 grid gap-1 text-xs text-ink-2 sm:grid-cols-3">
          <div>
            <dt className="inline">Mozgástartomány: </dt>
            <dd className="inline text-ink">{exercise.romText.replace('{rom}', String(Math.round(rom * 100)))}</dd>
          </div>
          {p.benchAngle && (
            <div>
              <dt className="inline">Pad: </dt>
              <dd className="inline text-ink">{angle < 0 ? 'negatív pad (decline)' : angle === 0 ? 'vízszintes pad (flat)' : 'ferde pad (incline)'}</dd>
            </div>
          )}
          <div>
            <dt className="inline">Terhelés: </dt>
            <dd className="inline text-ink">{loadText(exercise, load) ?? (exercise.animation.kind === 'sagittal' || (exercise.animation.kind === 'girdle' && exercise.animation.bodyweight) ? 'saját testsúly' : 'nincs külső terhelés')}</dd>
          </div>
        </dl>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          <Toggle label="Feliratok" checked={showLabels} onChange={setShowLabels} />
          {p.handSupport && <Toggle label="Térdelő változat" checked={pushUp.knees} onChange={(v) => setPushUp((o) => ({ ...o, knees: v }))} />}
        </div>
      </Panel>

      {anim.kind === 'bench' && p.benchAngle && (
        <>
          <BenchAngleComparison angle={angle} onAngle={setAngle} implement={anim.implement} />
          <BenchImplementComparison implement={anim.implement} onSwitch={(to) => onSelect(to === 'barbell' ? 'barbell-bench-press' : 'dumbbell-bench-press', angle)} />
        </>
      )}
      {exercise.id === 'dumbbell-fly' && p.benchAngle && <FlyAngleComparison angle={angle} onAngle={setAngle} />}
      {p.armElevation && <PecDeckHeightComparison elevation={elevation} onElevation={setElevation} />}
      {p.pulleyAngle && <CablePulleyComparison angle={pulley} onAngle={setPulley} />}
      {!isStretch && exercise.phases.some((ph) => ph.type === 'passive-stretch') && <StretchDosagePanel />}
      {isStretch && (
        <>
          <StretchPositionPanel p={stretchPos} onChange={setStretchPos} supine={supineStretch} />
          <StretchDosagePanel />
          <StretchComparison current={supineStretch ? 'roller' : 'wall'} onSwitch={(to) => onSelect(to === 'roller' ? 'supine-pectoral-stretch' : 'pectoral-stretch')} />
        </>
      )}
      {p.dipLean && (
        <>
          <DipVariantComparison options={dips} onVariant={setDipVariant} />
          <DipLeanComparison options={dips} rom={rom} onLean={(v) => setDips((o) => ({ ...o, lean: v }))} />
        </>
      )}
      {p.handSupport && (
        <>
          <PushUpSupportComparison options={pushUp} onChange={setPushUp} />
          <PushUpOtherVariants width={handWidth} onWidth={setHandWidth} />
        </>
      )}
      {anim.kind === 'transverse' && (anim.implement === 'dumbbell' || anim.implement === 'pec-deck') && (
        <FlyMachineComparison
          current={anim.implement === 'dumbbell' ? 'dumbbell' : 'machine'}
          position={lerp(anim.range[0], anim.range[1], depth)}
          onSwitch={(to) => onSelect(to === 'dumbbell' ? 'dumbbell-fly' : 'pec-deck')}
        />
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel className="lg:col-span-2">
          <TermBlock term={exercise.name} size="lg" />
        </Panel>
        <Panel title="Kiinduló testhelyzet">
          <BulletList items={exercise.startPosition} />
        </Panel>
        <Panel title="Helyes végrehajtás">
          <BulletList items={exercise.execution} />
        </Panel>
        <Panel title="Izmok">
          <MuscleGroup title="Nyújtott izmok" ids={[...new Set(Object.values(exercise.phaseRoles ?? {}).flat().filter((r) => r.role === 'stretched').flatMap((r) => r.structureIds))]} />
          <MuscleGroup title="Elsődleges mozgatóizmok" ids={exercise.primaryMovers} />
          <MuscleGroup title="Másodlagos mozgatóizmok" ids={exercise.secondaryMovers} />
          <MuscleGroup title="Stabilizáló izmok" ids={exercise.stabilizers} />
        </Panel>
        <Panel className="lg:col-span-2" title="Szakaszok és izomműködés">
          <ul className="flex flex-col gap-2 text-sm">
            {exercise.phases.map((ph) => (
              <li key={ph.type} className={`rounded-xl p-2.5 ${ph === phase ? 'bg-accent/20 ring-1 ring-accent-2' : 'bg-bg-2/50'}`}>
                <div className="font-medium text-ink">{ph.name}</div>
                <div className="text-ink-2">{ph.description}</div>
              </li>
            ))}
          </ul>
        </Panel>
        {exercise.phaseRoles && (
          <Panel
            className="lg:col-span-2"
            title="Izomszerepek szakaszonként"
            subtitle={presentRoles.includes('stretched') ? 'Nyújtott és stabilizáló izmok a nyújtás szakaszaiban' : 'Agonista, szinergista, antagonista és stabilizáló izmok az excentrikus és a koncentrikus szakaszban'}
          >
            <PhaseRoles exercise={exercise} current={phase.type} />
          </Panel>
        )}
        <Panel title="Gyakori kivitelezési hibák">
          <BulletList items={exercise.commonMistakes} />
        </Panel>
        <Panel title="Anatómiai magyarázat">
          <ClaimList claims={exercise.anatomyExplanation} />
        </Panel>
        <Panel title="Gyakorlati edzői magyarázat">
          <ClaimList claims={exercise.coachingNotes} />
        </Panel>
      </div>
      <Disclaimer>{disclaimerText(exercise)}</Disclaimer>
    </div>
  );
}

/* ---------------------------------------------------------------- */

/** Az oldalnézeti ábrákon kirajzolt izmok. */
const sagittalMuscles = ['muscle-pectoralis-major', 'muscle-deltoid-anterior', 'muscle-triceps-brachii', 'muscle-biceps-brachii'];
const rolePriority: DisplayRoleType[] = ['stretched', 'agonist', 'antagonist', 'synergist', 'stabilizer'];
const roleOrder: DisplayRoleType[] = ['stretched', 'agonist', 'synergist', 'antagonist', 'stabilizer'];
const jointShort = (joint: string) => (joint.startsWith('Könyök') ? 'könyök' : joint.startsWith('Váll') ? 'váll' : '');
const arrow: Record<LengthChange, string> = { shortening: '↘ rövidül', lengthening: '↗ hosszabbodik', constant: '= változatlan' };
const lengthText: Record<LengthChange, { icon: ReactNode; text: string }> = {
  shortening: { icon: <ArrowDownRight size={13} />, text: 'rövidül' },
  lengthening: { icon: <ArrowUpRight size={13} />, text: 'hosszabbodik' },
  constant: { icon: <Equal size={13} />, text: 'közel változatlan hossz' }
};

/**
 * Az adott szakasz szerepei. Izometriás megtartáskor (ha nincs külön adat) a koncentrikus
 * szakasz szerepei érvényesek, közel változatlan izomhosszal.
 */
export function rolesFor(exercise: Exercise, type: ExercisePhaseType): ExercisePhaseRole[] {
  const own = exercise.phaseRoles?.[type];
  if (own) return own;
  if (type === 'isometric') return (exercise.phaseRoles?.concentric ?? []).map((r) => ({ ...r, lengthChange: 'constant' as const }));
  return [];
}

/** Az oldalnézeti ábra feliratai; ha egy izom több szerepet tölt be, ízületenként. */
function sceneMuscleLabels(roles: ExercisePhaseRole[]): SceneMuscleLabel[] {
  return sagittalMuscles.flatMap((id) => {
    const rs = roles.filter((r) => r.structureIds.includes(id));
    if (!rs.length) return [];
    const role = rolePriority.find((p) => rs.some((r) => r.role === p))!;
    const detail =
      rs.length === 1
        ? `${roleLetters[rs[0]!.role]} · ${arrow[rs[0]!.lengthChange]}`
        : rs.map((r) => `${roleLetters[r.role]} (${jointShort(r.joint)}) ${arrow[r.lengthChange]}`).join(' · ');
    return [{ structureId: id, name: structureName(id).hu, role, detail }];
  });
}

/** Szerepkör-térkép a felülnézeti anatómiai ábrához (egy izom a legfontosabb szerepét kapja). */
function transverseRoleMap(roles: ExercisePhaseRole[]): Record<string, DisplayRoleType> {
  const map: Record<string, DisplayRoleType> = {};
  [...roles]
    .sort((a, b) => rolePriority.indexOf(b.role) - rolePriority.indexOf(a.role))
    .forEach((r) => r.structureIds.forEach((id) => (map[id] = r.role)));
  return map;
}

function displayRolesIn(exercise: Exercise): DisplayRoleType[] {
  const all = new Set(Object.values(exercise.phaseRoles ?? {}).flat().map((r) => r.role));
  return roleOrder.filter((r) => all.has(r));
}

/** Az aktuális szakasz azon izmai, amelyek az ábrán nem szerepelnek. */
function hiddenRoles(roles: ExercisePhaseRole[], drawn: (id: string) => boolean) {
  const seen = new Set<string>();
  return roles
    .flatMap((r) => r.structureIds.map((id) => ({ id, role: r.role })))
    .filter(({ id }) => !drawn(id) && !seen.has(id) && !!seen.add(id))
    .map(({ id, role }) => `${roleLetters[role]} ${structureName(id).hu.toLowerCase()}`)
    .join(', ');
}

function loadText(exercise: Exercise, load: number): string | undefined {
  const l = exercise.parameters.load;
  if (!l) return undefined;
  const kg = (v: number) => v.toLocaleString('hu-HU');
  if (l.mode === 'per-hand') return l.implementName === 'kábelenként' ? `${kg(load)} kg kábelenként` : `${kg(load)} kg kezenként (${l.implementName})`;
  if (l.mode === 'stack') return `${kg(load)} kg a súlyoszlopon`;
  const plates = platesPerSide(load, l.implementKg);
  return `${kg(load)} kg – ${plates.length ? `tárcsák oldalanként: ${plates.map(kg).join(' + ')} kg` : 'üres rúd'}`;
}

function pathText(exercise: Exercise): string {
  const a = exercise.animation;
  if (a.kind === 'bench') return a.implement === 'barbell' ? '– – rúdpálya' : '– – súlyzópálya';
  if (a.kind === 'sagittal') return a.preset === 'machine-press' ? '– – a fogantyú pályája' : '– – a vállízület pályája';
  return '';
}

function disclaimerText(exercise: Exercise): string {
  const a = exercise.animation;
  if (a.kind === 'bench')
    return 'Egyszerűsített 2D szagittális vetület: a terhelés függőleges pályán mozog, az alkar függőleges, a felkar rövidülése a vállízületi távolítás vetületi következménye. A testarányok és a fogásszélesség rögzítettek. Nem erő- vagy EMG-szimuláció.';
  if (a.kind === 'sagittal')
    return a.preset === 'dips'
      ? 'Egyszerűsített 2D oldalnézet: a kéz a támaszon (korlát, gyűrű, pad) rögzített – a gyűrű instabilitását a modell nem ábrázolja –, az alkar függőleges, a felkar a könyök körül fordul, a törzs a mélységgel előredől. A lapocka mozgása nincs ábrázolva. Nem erő- vagy EMG-szimuláció.'
      : 'Egyszerűsített 2D oldalnézet a fekvenyomás-modell alapján: az alkar merőleges a törzsre, a kéz egyenes pályán mozog; a felkar rövidülése vetületi következmény. ' +
          (a.preset === 'push-up' ? 'Zárt lánc: a kéz és a lábujj a talajon rögzített, a test e két pont között billen. ' : 'Ülő helyzet, rögzített háttámla. ') +
          'Nem erő- vagy EMG-szimuláció.';
  if (a.kind === 'girdle')
    return 'Egyszerűsített 2D vállöv-modell: a kulcscsont és a lapocka egy-egy ízület körül fordul, a lapocka mellkasfalon való csúszása és a forgástengely vándorlása nincs ábrázolva. A szögek szemléltetők. Nem erő- vagy EMG-szimuláció.';
  return 'Egyszerűsített 2D felülnézet: a vállízület horizontális távolítása és közelítése nyújtott karral (a valóságban enyhén hajlított könyökkel). A lapocka mozgása és a test helyzete a térben nincs ábrázolva. Nem erő- vagy EMG-szimuláció.';
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-ink">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

function MuscleGroup({ title, ids }: { title: string; ids: string[] }) {
  if (!ids.length) return null;
  return (
    <div className="mb-2">
      <div className="mb-1 text-xs text-ink-2">{title}</div>
      <ul className="flex flex-wrap gap-1">
        {ids.map((id) => (
          <li key={id} className="rounded-full border border-line px-2 py-0.5 text-xs text-ink">
            {structureName(id).hu}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Az izomszerepek bontása szakaszonként; a lejátszás (vagy a kiválasztott) szakasz kiemelve. */
function PhaseRoles({ exercise, current }: { exercise: Exercise; current: ExercisePhaseType }) {
  const types = exercise.phases.map((ph) => ph.type).filter((type) => !!exercise.phaseRoles?.[type]);
  const hasOwn = !!exercise.phaseRoles?.[current];
  return (
    <div className="flex flex-col gap-3">
      <div className={`grid gap-3 ${types.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {types.map((type) => {
          const roles = exercise.phaseRoles![type]!;
          const ph = exercise.phases.find((x) => x.type === type);
          const isCurrent = current === type;
          return (
            <section key={type} aria-current={isCurrent ? 'step' : undefined} className={`flex flex-col gap-2 rounded-xl p-2.5 ${isCurrent ? 'bg-accent/15 ring-1 ring-accent-2' : 'bg-bg-2/40'}`}>
              <header>
                <h3 className="text-sm font-semibold text-ink">{phaseTypeLabels[type]}</h3>
                {ph && <p className="text-xs text-ink-2">{ph.name}</p>}
              </header>
              {roleOrder.map((role) => {
                const items = roles.filter((r) => r.role === role);
                if (!items.length) return null;
                return (
                  <div key={role} className="rounded-lg bg-surface/60 p-2">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold" style={{ color: `var(--an-${role})` }}>
                      <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: `var(--an-${role})` }} aria-hidden="true" />
                      {roleLetters[role]} · {roleLabels[role]}
                    </div>
                    <ul className="flex flex-col gap-2">
                      {items.map((r, i) => (
                        <li key={i} className="flex flex-col gap-1">
                          <div className="flex flex-wrap items-center justify-between gap-x-2 text-[11px] text-ink-2">
                            <span>{r.joint}</span>
                            <span className="inline-flex items-center gap-1 text-ink">
                              {lengthText[r.lengthChange].icon} {lengthText[r.lengthChange].text}
                            </span>
                          </div>
                          <ul className="flex flex-wrap gap-1">
                            {r.structureIds.map((id) => (
                              <li key={id} className={`rounded-full border px-2 py-0.5 text-xs ${exercise.muscleIds.includes(id) ? 'border-accent-2 text-highlight' : 'border-line text-ink'}`}>
                                {structureName(id).hu}
                              </li>
                            ))}
                          </ul>
                          {r.note && <p className="text-xs leading-relaxed text-ink-2">{r.note}</p>}
                          <div className="flex flex-wrap items-center gap-2">
                            <EvidenceBadge level={r.evidence} />
                            <SourceRefs ids={r.sourceIds} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
      {current === 'isometric' && !hasOwn && <p className="text-xs text-ink-2">Megtartáskor (izometriás szakasz) ugyanezek az izmok aktívak, a hosszuk közel változatlan.</p>}
      <RoleLegend compact roles={displayRolesIn(exercise)} />
      <p className="text-xs text-ink-2">
        A szerepek ízületenként értendők: egy izom az egyik ízületen segíthet, a másikon antagonista lehet (pl. a kétfejű karizom). A hosszváltozás minőségi jelzés, nem mért érték; az
        aktivitás mértékét a modell nem jeleníti meg.
      </p>
    </div>
  );
}
