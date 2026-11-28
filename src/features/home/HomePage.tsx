import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import type { Muscle } from '../../types';
import { muscleById, muscleSections, slugForMuscle, structureName } from '../../data/muscles';
import { AnatomyViewer, ALL_LAYERS, matchesStructure } from '../../components/anatomy/AnatomyViewer';
import { restPoses, viewGeometries } from '../../data/geometry';
import { questionsForMuscle } from '../../data/questions';
import { modules, tools, type ModuleDef } from '../../app/modules';
import { Disclaimer } from '../../components/ui';

/** Az izom oktatási moduljai közül azok, amelyekhez már van tartalom (az Anatómia mindig). */
const modulesWithContent = (m: Muscle): ModuleDef[] =>
  modules.filter((mod) =>
    mod.id === 'anatomia' ? true : mod.id === 'biomechanika' ? m.motionIds.length > 0 : mod.id === 'gyakorlatok' ? m.exerciseIds.length > 0 : questionsForMuscle(m.id).length > 0
  );

function MuscleCard({ m }: { m: Muscle }) {
  const available = m.status === 'available';
  const geometry = viewGeometries[m.defaultViewId] ?? viewGeometries.anterior!;
  // Mély (más izmok alatt fekvő) izomnál az izolált nézet mutatja meg a helyét.
  const shape = geometry.muscles.find((s) => matchesStructure(s.structureId, m.id));
  const isolate = shape?.layer === 'deep-muscles';
  const inner = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <AnatomyViewer
          focus
          minimal
          geometry={geometry}
          pose={restPoses[m.defaultViewId]}
          selectedId={m.id}
          layers={{ ...ALL_LAYERS, labels: false, joints: false, attachments: false, 'superficial-muscles': true }}
          isolate={isolate}
          ariaLabel={`${m.name.hu} – ${m.defaultViewId === 'posterior' ? 'hátulnézet' : 'elülső nézet'}, kiemelve`}
        />
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-serif text-lg text-ink">{m.name.hu}</h3>
          <p className="text-xs text-ink-2">
            {m.name.en} · <i>{m.name.la}</i>
          </p>
        </div>
        {available ? (
          <ArrowRight size={18} className="mt-1 text-accent-2 transition group-hover:translate-x-0.5" />
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-bg-2 px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-2">
            <Clock size={11} /> Fejlesztés alatt
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">{m.summary}</p>
      {m.memberIds && m.memberIds.length > 0 && (
        <p className="mt-2 text-xs text-ink-2">Részei: {m.memberIds.map((id) => structureName(id).hu.toLowerCase()).join(', ')}</p>
      )}
      {available ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {modulesWithContent(m).map((mod) => (
            <span key={mod.id} className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-2">
              {mod.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xs text-ink-2">Az oktatási modulok később készülnek el. Az ábrán kontextusként már szerepel.</p>
      )}
    </>
  );
  return available ? (
    <Link to={`/izom/${slugForMuscle(m.id)}/anatomia`} className="group block h-full rounded-2xl border border-line bg-surface p-3 transition hover:border-accent-2">
      {inner}
    </Link>
  ) : (
    <div className="block h-full rounded-2xl border border-line bg-surface/60 p-3 opacity-80" aria-disabled="true">
      {inner}
    </div>
  );
}

export function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-6 pt-2 md:grid-cols-[1.2fr_1fr] md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent-2">Funkcionális anatómia · Biomechanika · Vizsgafelkészítés</p>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-ink md:text-4xl">A vállöv izmai</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2">
            Válassz egy izmot, majd tanulmányozd az anatómiáját, a működését, a hozzá kapcsolódó edzőtermi gyakorlatokat, és ellenőrizd a tudásod. Minden állítás mellett
            jelöljük a forrást és a megbízhatósági szintet.
          </p>
        </div>
        <Disclaimer />
      </section>

      {muscleSections.map((sec) => (
        <section key={sec.id} aria-labelledby={`${sec.id}-title`}>
          <h2 id={`${sec.id}-title`} className="mb-3 font-serif text-xl text-ink">
            {sec.title}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {sec.muscleIds.map((id) => {
              const m = muscleById(id);
              return m ? (
                <li key={id}>
                  <MuscleCard m={m} />
                </li>
              ) : null;
            })}
          </ul>
        </section>
      ))}

      <section aria-labelledby="tools-title">
        <h2 id="tools-title" className="mb-3 font-serif text-xl text-ink">
          Tanulási eszközök
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tools.map((t) => (
            <li key={t.id}>
              <Link to={t.path} className="group flex h-full flex-col gap-2 rounded-2xl border border-line bg-surface p-4 transition hover:border-accent-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/20 text-accent-2">
                    <t.icon size={20} aria-hidden="true" />
                  </span>
                  <ArrowRight size={18} className="mt-1 text-accent-2 transition group-hover:translate-x-0.5" />
                </div>
                <h3 className="font-serif text-lg text-ink">{t.name}</h3>
                <p className="text-sm leading-relaxed text-ink-2">{t.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
