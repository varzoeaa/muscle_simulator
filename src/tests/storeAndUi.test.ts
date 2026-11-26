import { beforeEach, describe, expect, it } from 'vitest';
import { useSettingsStore } from '../stores/settingsStore';
import { useStudyStore } from '../stores/studyStore';
import { createMemoryStorage, safeStateStorage, STORAGE_KEYS } from '../services/storage';
import { matchesStructure, roleForStructure } from '../components/anatomy/AnatomyViewer';
import { muscleBySlug, slugForMuscle } from '../data/muscles';

beforeEach(() => {
  localStorage.clear();
});

describe('Témaváltás', () => {
  it('egy gombnyomással vált, beállítja a data-theme attribútumot és elmenti', () => {
    useSettingsStore.getState().setTheme('dark');
    useSettingsStore.getState().toggleTheme();
    expect(useSettingsStore.getState().theme).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.settings)!).state.theme).toBe('light');
    useSettingsStore.getState().toggleTheme();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});

describe('Helyi adattárolás', () => {
  it('a tanulási előrehaladás a LocalStorage-ba kerül, és törölhető', () => {
    useStudyStore.getState().answer('q-pm-insertion', false);
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.study)!);
    expect(saved.state.progress.wrongQuestionIds).toContain('q-pm-insertion');
    useStudyStore.getState().clearAll();
    expect(useStudyStore.getState().progress.wrongQuestionIds).toEqual([]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.study)!).state.progress.questions).toEqual({});
  });

  it('a memóriabeli tároló a LocalStorage-szal azonos módon működik', () => {
    const m = createMemoryStorage();
    m.setItem('a', '1');
    expect(m.getItem('a')).toBe('1');
    m.removeItem('a');
    expect(m.getItem('a')).toBeNull();
  });

  it('a biztonságos tároló nem dob hibát', () => {
    expect(() => safeStateStorage.setItem('musclelab:test', 'x')).not.toThrow();
    expect(safeStateStorage.getItem('musclelab:test')).toBe('x');
  });
});

describe('Izomválasztás', () => {
  it('az izomrész az egész izom kiválasztásához tartozik, fordítva nem', () => {
    expect(matchesStructure('muscle-pectoralis-major-clavicular', 'muscle-pectoralis-major')).toBe(true);
    expect(matchesStructure('muscle-pectoralis-major', 'muscle-pectoralis-major-clavicular')).toBe(false);
    expect(matchesStructure('muscle-pectoralis-minor', 'muscle-pectoralis-major')).toBe(false);
    expect(matchesStructure('muscle-deltoid', null)).toBe(false);
  });
  it('a szerepkör az izomrészekre is érvényes', () => {
    const map = { 'muscle-pectoralis-major': 'agonist' as const, 'muscle-deltoid-posterior': 'antagonist' as const };
    expect(roleForStructure('muscle-pectoralis-major-sternocostal', map)).toBe('agonist');
    expect(roleForStructure('muscle-deltoid-posterior', map)).toBe('antagonist');
    expect(roleForStructure('muscle-deltoid-anterior', map)).toBeUndefined();
  });
  it('URL-azonosítók oda-vissza', () => {
    expect(muscleBySlug('nagy-mellizom')?.id).toBe('muscle-pectoralis-major');
    expect(slugForMuscle('muscle-serratus-anterior')).toBe('elulso-fureszizom');
    expect(muscleBySlug('nincs-ilyen')).toBeUndefined();
  });
});
