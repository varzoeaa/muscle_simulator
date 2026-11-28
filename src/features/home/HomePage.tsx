import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { muscles, slugForMuscle } from '../../data/muscles';
import { AnatomyViewer, ALL_LAYERS } from '../../components/anatomy/AnatomyViewer';
import { anteriorView } from '../../data/geometry/anteriorView';
import { restPoses } from '../../data/geometry';
import { modules, tools } from '../../app/modules';
import { Disclaimer } from '../../components/ui';

const deep = new Set(['muscle-pectoralis-minor', 'muscle-subclavius']);

export function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-6 pt-2 md:grid-cols-[1.2fr_1fr] md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent-2">Funkcionális anatómia · Biomechanika · Vizsgafelkészítés</p>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-ink md:text-4xl">Felületes mellizmok</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2">
            Válassz egy izmot, majd tanulmányozd az anatómiáját, a működését, a hozzá kapcsolódó edzőtermi gyakorlatokat, és ellenőrizd a tudásod. Minden állítás mellett
            jelöljük a forrást és a megbízhatósági szintet.
          </p>
        </div>
        <Disclaimer />
      </section>

      <section aria-labelledby="muscles-title">
        <h2 id="muscles-title" className="mb-3 font-serif text-xl text-ink">
          Izmok
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {muscles.map((m) => {
            const available = m.status === 'available';
            const inner = (
              <>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <AnatomyViewer
            focus
                    minimal
                    geometry={anteriorView}
                    pose={restPoses.anterior}
                    selectedId={m.id}
                    layers={{ ...ALL_LAYERS, labels: false, joints: false, attachments: false, 'superficial-muscles': true }}
                    isolate={deep.has(m.id)}
                    ariaLabel={`${m.name.hu} – elülső nézet, kiemelve`}
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
                {available ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {modules.map((mod) => (
                      <span key={mod.id} className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-2">
                        {mod.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-ink-2">Az oktatási modulok a nagy mellizom prototípusa után készülnek el. Az ábrán kontextusként már szerepel.</p>
                )}
              </>
            );
            return (
              <li key={m.id}>
                {available ? (
                  <Link to={`/izom/${slugForMuscle(m.id)}/anatomia`} className="group block h-full rounded-2xl border border-line bg-surface p-3 transition hover:border-accent-2">
                    {inner}
                  </Link>
                ) : (
                  <div className="block h-full rounded-2xl border border-line bg-surface/60 p-3 opacity-80" aria-disabled="true">
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

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
