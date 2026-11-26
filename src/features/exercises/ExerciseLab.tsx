import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Equal, Clock } from 'lucide-react';
import type { ContractionType, Muscle } from '../../types';
import { exerciseById } from '../../data/exercises/benchPress';
import { structureName } from '../../data/muscles';
import { BenchPressScene } from '../../components/anatomy/BenchPressScene';
import { AnimationControls } from '../../components/animation/AnimationControls';
import { ClaimList, Disclaimer, Panel, Segmented, Slider, SourceList, TermBlock, Toggle } from '../../components/ui';
import { applyRangeOfMotion, cycleDepth, phaseAt } from '../../engines/animation/animationEngine';
import { platesPerSide } from '../../engines/animation/benchKinematics';
import { useAnimationPlayer, useReducedMotion } from '../../hooks/useAnimationPlayer';
import { useSettingsStore } from '../../stores/settingsStore';
import { contractionLabels } from '../biomechanics/BiomechanicsLab';

/** A specifikációban szereplő, még el nem készült gyakorlatok (nem kattinthatók). */
const plannedExercises = [
  'Kézisúlyzós fekvenyomás – Dumbbell bench press',
  'Kézisúlyzós tárogatás – Dumbbell fly',
  'Gépes mellnyomás – Machine chest press',
  'Pec deck',
  'Csigás kereszthúzás – Cable crossover',
  'Fekvőtámasz – Push-up',
  'Tolódzkodás – Dips',
  'Mellizomnyújtás – Pectoral stretch'
];

type PhaseFilter = 'all' | ContractionType;

export function ExerciseLab() {
  const { muscle } = useOutletContext<{ muscle: Muscle }>();
  const exercise = exerciseById(muscle.exerciseIds[0]);
  const reduced = useReducedMotion();
  const player = useAnimationPlayer(exercise?.cycleDurationMs ?? 4000, { loop: true });
  const p = exercise?.parameters;
  const [rom, setRom] = useState(p?.rangeOfMotion?.default ?? 1);
  const [angle, setAngle] = useState(p?.benchAngle?.default ?? 0);
  const [load, setLoad] = useState(p?.load?.default ?? 60);
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>('all');
  const showLabels = useSettingsStore((s) => s.showLabels);
  const setShowLabels = useSettingsStore((s) => s.setShowLabels);
  const { setRange, seek } = player;

  useEffect(() => {
    if (!exercise) return;
    if (phaseFilter === 'all') setRange([0, 1]);
    else {
      const ph = exercise.phases.find((x) => x.type === phaseFilter);
      if (ph) {
        setRange([ph.from, ph.to]);
        seek(ph.from);
      }
    }
  }, [phaseFilter, exercise, setRange, seek]);

  if (!exercise) return <p className="text-sm text-ink-2">Ehhez az izomhoz még nincs gyakorlat.</p>;

  const t = player.state.progress;
  const phase = phaseAt(exercise.phases, t)!;
  const depth = applyRangeOfMotion(cycleDepth(exercise.phases, t), rom);
  const plates = platesPerSide(load, p!.load!.implementKg);
  const angleName = angle < 0 ? 'negatív pad (decline)' : angle === 0 ? 'vízszintes pad (flat)' : 'ferde pad (incline)';
  const change = phase.type === 'eccentric' ? { i: <ArrowUpRight size={15} />, t: 'hosszabbodik' } : phase.type === 'concentric' ? { i: <ArrowDownRight size={15} />, t: 'rövidül' } : { i: <Equal size={15} />, t: 'közel változatlan' };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
      <div className="flex min-w-0 flex-col gap-3">
        <div>
          <h1 className="font-serif text-2xl text-ink">Exercise Lab</h1>
          <p className="text-xs text-ink-2">Edzőtermi gyakorlatok – interaktív végrehajtási animáció</p>
        </div>

        <div className="relative h-[52vh] min-h-[320px] overflow-hidden rounded-2xl bg-canvas md:h-[60vh]">
          <BenchPressScene incline={angle} depth={depth} loadKg={load} barKg={p!.load!.implementKg} phase={phase.type} active={player.state.playing} showLabels={showLabels} />
          <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1.5 text-xs" aria-live="polite">
            <span className="rounded-lg bg-surface/90 px-2 py-1 font-medium text-ink ring-1 ring-line">{phase.name}</span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface/90 px-2 py-1 text-ink ring-1 ring-line">
              {change.i} Nagy mellizom: aktív, {change.t}
            </span>
          </div>
          <div className="pointer-events-none absolute bottom-2 left-2 flex flex-wrap gap-x-3 gap-y-1 rounded-lg bg-surface/85 px-2 py-1 text-[11px] text-ink-2">
            <span><span className="mr-1 inline-block h-2 w-3 rounded-sm" style={{ background: 'var(--an-muscle-selected)' }} />Nagy mellizom (AG)</span>
            <span><span className="mr-1 inline-block h-2 w-3 rounded-sm" style={{ background: 'var(--an-synergist)' }} />Deltaizom elülső rész (társmozgató)</span>
            <span><span className="mr-1 inline-block h-2 w-3 rounded-sm" style={{ background: 'var(--an-muscle-dim)' }} />Háromfejű karizom</span>
            <span>– – rúdpálya</span>
          </div>
        </div>

        <Panel>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-ink-2">Izomműködési szakasz</span>
              <Segmented<PhaseFilter>
                size="sm"
                label="Izomműködési szakasz"
                value={phaseFilter}
                onChange={setPhaseFilter}
                options={[{ value: 'all', label: 'Teljes ismétlés' }, ...exercise.phases.map((ph) => ({ value: ph.type as PhaseFilter, label: contractionLabels[ph.type].hu }))]}
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
          </div>
        </Panel>

        <Panel title="Paraméterek" subtitle="Szemléltető paraméterek – a súly nem befolyásol izomaktivációt vagy erőt a modellben">
          <div className="grid gap-4 md:grid-cols-3">
            <Slider
              id="rom"
              label="Mozgástartomány"
              value={rom}
              min={p!.rangeOfMotion!.min}
              max={p!.rangeOfMotion!.max}
              step={0.05}
              onChange={setRom}
              format={(v) => `${Math.round(v * 100)}%${v >= 1 ? ' (teljes)' : ''}`}
            />
            <Slider id="angle" label="Pad dőlésszöge" value={angle} min={p!.benchAngle!.min} max={p!.benchAngle!.max} step={p!.benchAngle!.step} onChange={setAngle} format={(v) => `${v}° – ${v < 0 ? 'negatív' : v === 0 ? 'vízszintes' : 'ferde'}`} />
            <Slider id="load" label="Súlyterhelés" value={load} min={p!.load!.min} max={p!.load!.max} step={p!.load!.step} onChange={setLoad} format={(v) => `${v.toLocaleString('hu-HU')} kg`} />
          </div>
          <dl className="mt-3 grid gap-1 text-xs text-ink-2 sm:grid-cols-3">
            <div><dt className="inline">Mozgástartomány: </dt><dd className="inline text-ink">a rúd az út {Math.round(rom * 100)}%-áig ereszkedik</dd></div>
            <div><dt className="inline">Pad: </dt><dd className="inline text-ink">{angleName}</dd></div>
            <div>
              <dt className="inline">Terhelés: </dt>
              <dd className="inline text-ink">
                {p!.load!.implementName} {p!.load!.implementKg} kg{plates.length ? ` + oldalanként ${plates.map((x) => x.toLocaleString('hu-HU')).join(' + ')} kg` : ''}
              </dd>
            </div>
          </dl>
          <div className="mt-3">
            <Toggle label="Feliratok" checked={showLabels} onChange={setShowLabels} />
          </div>
        </Panel>
        <Disclaimer>
          Egyszerűsített 2D szagittális vetület: a rúd függőleges pályán mozog, az alkar függőleges, a felkar rövidülése a vállízületi távolítás vetületi következménye. A testarányok
          és a fogásszélesség rögzítettek. Nem erő- vagy EMG-szimuláció.
        </Disclaimer>
      </div>

      <div className="flex flex-col gap-3">
        <Panel title="Gyakorlatok" subtitle={`${muscle.name.hu} – gyakorlatkönyvtár`}>
          <ul className="flex flex-col gap-1.5 text-sm">
            <li className="rounded-xl border border-accent-2 bg-accent/20 px-3 py-2 text-ink">{exercise.name.hu}</li>
            {plannedExercises.map((n) => (
              <li key={n} className="flex items-center justify-between gap-2 rounded-xl border border-line px-3 py-2 text-ink-2" aria-disabled="true">
                {n}
                <span className="inline-flex shrink-0 items-center gap-1 text-[10px] uppercase"><Clock size={11} /> tervezett</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <TermBlock term={exercise.name} size="lg" />
        </Panel>
        <Panel title="Kiinduló testhelyzet">
          <BulletList items={exercise.startPosition} />
        </Panel>
        <Panel title="Helyes végrehajtás">
          <BulletList items={exercise.execution} />
        </Panel>
        <Panel title="Izmok">
          <MuscleGroup title="Elsődleges mozgatóizmok" ids={exercise.primaryMovers} />
          <MuscleGroup title="Másodlagos mozgatóizmok" ids={exercise.secondaryMovers} />
          <MuscleGroup title="Stabilizáló izmok" ids={exercise.stabilizers} />
        </Panel>
        <Panel title="Szakaszok és izomműködés">
          <ul className="flex flex-col gap-2 text-sm">
            {exercise.phases.map((ph) => (
              <li key={ph.type} className={`rounded-xl p-2.5 ${ph === phase ? 'bg-accent/20 ring-1 ring-accent-2' : 'bg-bg-2/50'}`}>
                <div className="font-medium text-ink">{ph.name}</div>
                <div className="text-ink-2">{ph.description}</div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Gyakori kivitelezési hibák">
          <BulletList items={exercise.commonMistakes} />
        </Panel>
        <Panel title="Anatómiai magyarázat">
          <ClaimList claims={exercise.anatomyExplanation} />
        </Panel>
        <Panel title="Gyakorlati edzői magyarázat">
          <ClaimList claims={exercise.coachingNotes} />
        </Panel>
        <Panel title="Források">
          <SourceList ids={exercise.sourceIds} />
        </Panel>
      </div>
    </div>
  );
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
