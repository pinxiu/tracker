import { AppState } from './types';

const STORAGE_KEY = 'learning_tracker_v1';

export function loadState(defaultState: AppState): AppState {
  if (typeof localStorage === 'undefined') return defaultState;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;
  try {
    const parsed = JSON.parse(raw) as AppState;
    if (parsed.version !== defaultState.version) {
      return defaultState;
    }
    return { ...defaultState, ...parsed };
  } catch (e) {
    console.error('Failed to parse state', e);
    return defaultState;
  }
}

export function saveState(state: AppState) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState(defaultState: AppState) {
  saveState(defaultState);
  return defaultState;
}

export function exportState(state: AppState) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'learning-tracker-backup.json';
  link.click();
  URL.revokeObjectURL(url);
}

export function importState(raw: string, currentState: AppState): AppState {
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object') throw new Error('Invalid file');
  if (parsed.version !== currentState.version) throw new Error('Version mismatch');
  const keys: Array<keyof AppState> = ['products', 'skills', 'media', 'weeks', 'shipLog', 'streak'];
  for (const key of keys) {
    if (!Array.isArray(parsed[key]) && key !== 'streak') {
      throw new Error(`Missing field: ${String(key)}`);
    }
  }
  return { ...currentState, ...parsed } as AppState;
}
