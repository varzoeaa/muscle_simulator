import { NavLink, Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { muscleBySlug, muscles, slugForMuscle } from '../../data/muscles';
import { isModuleId, modules } from '../../app/modules';
import { TermBlock } from '../ui';

/**
 * Izomközpontú elrendezés: bal oldalon izomválasztó és modulnavigáció (asztali),
 * mobilon kompakt izomválasztó és modulfülek. Modulváltáskor az izom megmarad (az URL része).
 */
export function MuscleLayout() {
  const { slug, module } = useParams();
  const navigate = useNavigate();
  const muscle = muscleBySlug(slug);

  if (!muscle) return <Navigate to="/" replace />;
  const current = isModuleId(module) ? module : 'anatomia';

  const select = (
    <label className="flex flex-col gap-1 text-xs text-ink-2">
      Izom kiválasztása
      <select
        value={muscle.id}
        onChange={(e) => navigate(`/izom/${slugForMuscle(e.target.value)}/${current}`)}
        className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink"
      >
        {muscles.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name.hu} – {m.name.en}
            {m.status === 'planned' ? ' (fejlesztés alatt)' : ''}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="hidden flex-col gap-4 lg:flex">
        <div className="rounded-2xl border border-line bg-surface p-3">
          <TermBlock term={muscle.name} />
          <div className="mt-3">{select}</div>
        </div>
        <nav aria-label="Oktatási modulok" className="flex flex-col gap-1 rounded-2xl border border-line bg-surface p-2">
          {modules.map((m) => (
            <NavLink
              key={m.id}
              to={`/izom/${slug}/${m.id}`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${isActive ? 'bg-accent text-white' : 'text-ink hover:bg-bg-2'}`
              }
            >
              <m.icon size={18} />
              <span className="leading-tight">
                <span className="block text-sm font-medium">{m.name}</span>
                <span className="block text-[11px] opacity-75">{m.subtitle}</span>
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-col gap-3 lg:hidden">
          {select}
          <nav aria-label="Oktatási modulok" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
            {modules.map((m) => (
              <NavLink
                key={m.id}
                to={`/izom/${slug}/${m.id}`}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm transition ${isActive ? 'bg-accent text-white' : 'border border-line text-ink'}`
                }
              >
                <m.icon size={15} />
                {m.name}
              </NavLink>
            ))}
          </nav>
        </div>
        {muscle.status === 'planned' ? (
          <div className="rounded-2xl border border-line bg-surface p-6">
            <TermBlock term={muscle.name} size="lg" />
            <p className="mt-4 flex items-center gap-2 text-sm text-ink-2">
              <Clock size={16} /> Ennek az izomnak az oktatási moduljai még fejlesztés alatt állnak. Az első verzióban a nagy mellizom modulja érhető el teljes egészében.
            </p>
          </div>
        ) : (
          // A kulcs miatt izomváltáskor a modulok állapota (kiválasztás, nézet, lejátszás) alaphelyzetbe áll.
          <div key={muscle.id} className="contents">
            <Outlet context={{ muscle }} />
          </div>
        )}
      </div>
    </div>
  );
}
