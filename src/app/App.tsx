import { Component, type ReactNode } from 'react';
import { HashRouter, Link, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { MuscleLayout } from '../components/layout/MuscleLayout';
import { HomePage } from '../features/home/HomePage';
import { AnatomyLab } from '../features/anatomy/AnatomyLab';
import { BiomechanicsLab } from '../features/biomechanics/BiomechanicsLab';
import { ExerciseLab } from '../features/exercises/ExerciseLab';
import { StudyMode } from '../features/study/StudyMode';
import { SourcesPage } from '../features/sources/SourcesPage';
import { GlossaryPage } from '../features/glossary/GlossaryPage';
import { isModuleId } from './modules';

function ModuleSwitch() {
  const { module } = useParams();
  if (!isModuleId(module)) return <Navigate to="../anatomia" replace />;
  // A modulok a MuscleLayout Outlet-kontextusából kapják a kiválasztott izmot.
  return { anatomia: <AnatomyLab />, biomechanika: <BiomechanicsLab />, gyakorlatok: <ExerciseLab />, tanulas: <StudyMode /> }[module];
}

function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="font-serif text-2xl">Az oldal nem található</h1>
      <Link to="/" className="mt-3 inline-block text-accent-2 underline">
        Vissza a kezdőoldalra
      </Link>
    </div>
  );
}

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error)
      return (
        <div role="alert" className="mx-auto max-w-xl p-8 text-center">
          <h1 className="font-serif text-2xl">Váratlan hiba történt</h1>
          <p className="mt-2 text-sm text-ink-2">{this.state.error.message}</p>
          <button type="button" className="mt-4 rounded-xl bg-accent px-4 py-2 text-white" onClick={() => location.reload()}>
            Újratöltés
          </button>
        </div>
      );
    return this.props.children;
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="forrasok" element={<SourcesPage />} />
            <Route path="fogalomtar" element={<GlossaryPage />} />
            <Route path="izom/:slug" element={<Navigate to="anatomia" replace />} />
            <Route path="izom/:slug/:module/*" element={<MuscleLayout />}>
              <Route path="*" element={<ModuleSwitch />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}
