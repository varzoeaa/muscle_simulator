import { Link, Outlet, useLocation, useMatch } from 'react-router-dom';
import { BookMarked, LibraryBig, Moon, Sun, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { muscleBySlug } from '../../data/muscles';

export function AppShell() {
  const theme = useSettingsStore((s) => s.theme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  const match = useMatch('/izom/:slug/*');
  const muscle = muscleBySlug(match?.params.slug);
  const online = useOnline();
  const { pathname } = useLocation();
  // Oldalváltáskor (pl. a kezdőoldal aljáról a Fogalomtárra) az új oldal tetejéről induljon a nézet.
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch {
      /* tesztkörnyezetben nincs görgetés */
    }
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-3 focus:py-2 focus:text-white">
        Ugrás a tartalomra
      </a>
      <header className="sticky top-0 z-30 border-b border-line bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Myo – kezdőoldal">
            <Logo />
            <span className="leading-tight">
              <span className="block font-serif text-lg tracking-wide text-ink">Myo</span>
              <span className="hidden text-[10px] uppercase tracking-[0.18em] text-ink-2 sm:block">Interaktív anatómia és biomechanika</span>
            </span>
          </Link>
          {muscle && (
            <div className="ml-2 hidden min-w-0 items-center gap-2 border-l border-line pl-4 md:flex">
              <span className="text-xs text-ink-2">Aktuális izom:</span>
              <span className="truncate text-sm font-medium text-highlight">{muscle.name.hu}</span>
              <span className="truncate text-xs italic text-ink-2">{muscle.name.la}</span>
            </div>
          )}
          <div className="ml-auto flex items-center gap-1.5">
            {!online && (
              <span className="hidden items-center gap-1 rounded-full bg-bg-2 px-2 py-1 text-xs text-ink-2 sm:inline-flex" title="Offline mód – a helyben tárolt tananyag elérhető">
                <WifiOff size={13} /> Offline
              </span>
            )}
            <Link to="/fogalomtar" className="inline-flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-sm text-ink-2 hover:bg-bg-2 hover:text-ink">
              <LibraryBig size={16} /> <span className="hidden sm:inline">Fogalomtár</span>
            </Link>
            <Link to="/forrasok" className="inline-flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-sm text-ink-2 hover:bg-bg-2 hover:text-ink">
              <BookMarked size={16} /> <span className="hidden sm:inline">Források és névjegy</span>
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className="grid h-9 w-9 place-items-center rounded-xl border border-line text-ink hover:bg-bg-2"
              aria-label={theme === 'dark' ? 'Váltás világos módra' : 'Váltás sötét módra'}
              title={theme === 'dark' ? 'Világos mód' : 'Sötét mód'}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-[1600px] px-4 pb-12 pt-4">
        <Outlet />
      </main>
    </div>
  );
}

function useOnline() {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="var(--ml-accent)" />
      <path d="M14 44c4-14 10-22 18-24 8 2 14 10 18 24" fill="none" stroke="var(--ml-highlight)" strokeWidth="5" strokeLinecap="round" />
      <path d="M20 40c3-8 7-12 12-13 5 1 9 5 12 13" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="18" r="4" fill="#fff" />
    </svg>
  );
}
