// Storage management for WOD Generator
export const CONFIG_STORAGE_KEY = 'wod_config_v1';
export const HISTORY_STORAGE_KEY = 'wod_history_v7';
export const SAVED_WORKOUTS_STORAGE_KEY = 'wod_saved_v1';

export const DEFAULT_CONFIG = {
  version: 1,
  duration: 15,
  difficulty: 'Rx',
  focus: 'Balanced',
  templateType: 'Random',
  includeStrength: false,
  includeWarmup: true,
  warmupDuration: 3,
  warmupIntensity: 'Easy',
  numExercises: 3,
  avoid: [],
  equipment: {
    barbell: true,
    dumbbell: true,
    kettlebell: true,
    pullupBar: true,
    rings: true,
    box: true,
    jumpRope: true,
    machine: true,
  },
  volume: 0.7,
  audioSettings: { countdowns: true, announcements: true, beeps: true },
  isPartner: false,
};

/**
 * Migration logic for configuration data
 */
function migrateConfig(config) {
  let migrated = { ...config };

  // Initial versioning
  if (!migrated.version) {
    migrated.version = 1;
  }

  return migrated;
}

export function loadConfig() {
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const migrated = migrateConfig(parsed);
      return { ...DEFAULT_CONFIG, ...migrated };
    }
  } catch (e) {
    console.error({
      action: 'loadConfig',
      message: 'Failed to load config',
      error: e instanceof Error ? e.message : String(e),
    });
  }
  return DEFAULT_CONFIG;
}

export function saveConfig(config) {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error({
      action: 'saveConfig',
      message: 'Failed to save config',
      error: e instanceof Error ? e.message : String(e),
    });
  }
}

/**
 * Exports all user data (config, history, saved workouts) as a JSON string.
 * @returns {string} JSON string of the backup data
 */
export function exportData() {
  try {
    const config = loadConfig();

    let history = [];
    const historyJson = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (historyJson) {
      history = JSON.parse(historyJson);
    }

    let savedWorkouts = [];
    const savedJson = localStorage.getItem(SAVED_WORKOUTS_STORAGE_KEY);
    if (savedJson) {
      savedWorkouts = JSON.parse(savedJson);
    }

    const exportPayload = {
      version: 1,
      timestamp: new Date().toISOString(),
      config,
      history,
      savedWorkouts,
    };

    return JSON.stringify(exportPayload, null, 2);
  } catch (e) {
    console.error({
      action: 'exportData',
      message: 'Failed to export data',
      error: e instanceof Error ? e.message : String(e),
    });
    throw e;
  }
}

/**
 * Imports user data from a JSON string or object.
 * @param {string|Object} data
 * @returns {boolean} True if successful
 */
export function importData(data) {
  try {
    let parsed = data;
    if (typeof data === 'string') {
      if (data.length > 5 * 1024 * 1024) {
        console.error({ action: 'importData', message: 'Payload too large' });
        return false;
      }
      parsed = JSON.parse(data);
    }

    if (!parsed || typeof parsed !== 'object' || Object.keys(parsed).length === 0) {
      return false;
    }

    // Import Config
    if (parsed.config) {
      saveConfig(parsed.config);
    }

    // Import History
    if (parsed.history && Array.isArray(parsed.history)) {
      const validHistory = parsed.history
        .filter((item) => item && typeof item === 'object' && item.id && item.timestamp)
        .slice(0, 200);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(validHistory));
    }

    // Import Saved Workouts
    if (parsed.savedWorkouts && Array.isArray(parsed.savedWorkouts)) {
      localStorage.setItem(SAVED_WORKOUTS_STORAGE_KEY, JSON.stringify(parsed.savedWorkouts));
    }

    return true;
  } catch (e) {
    console.error({
      action: 'importData',
      message: 'Failed to import data',
      error: e instanceof Error ? e.message : String(e),
    });
    return false;
  }
}

export function loadHistory() {
  try {
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    return savedHistory ? JSON.parse(savedHistory) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(result) {
  try {
    const history = loadHistory();
    const newEntry = {
      ...result,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    // Cap history at 200 entries to avoid localStorage quota errors
    let updated = [newEntry, ...history];
    if (updated.length > 200) {
      updated = updated.slice(0, 200);
    }
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error({
      action: 'saveToHistory',
      message: 'Failed to save history',
      error: e instanceof Error ? e.message : String(e),
    });
    return loadHistory();
  }
}

export function deleteHistoryEntry(id) {
  try {
    const history = loadHistory();
    const updated = history.filter((entry) => entry.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error({
      action: 'deleteHistoryEntry',
      message: 'Failed to delete history entry',
      error: e instanceof Error ? e.message : String(e),
    });
    return loadHistory();
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (e) {
    console.error({
      action: 'clearHistory',
      message: 'Failed to clear history',
      error: e instanceof Error ? e.message : String(e),
    });
  }
}

export function loadSavedWorkouts() {
  try {
    const savedJson = localStorage.getItem(SAVED_WORKOUTS_STORAGE_KEY);
    return savedJson ? JSON.parse(savedJson) : [];
  } catch {
    return [];
  }
}

export function toggleSavedWorkout(w) {
  const savedWorkouts = loadSavedWorkouts();
  const isSaved = savedWorkouts.some((sw) => sw.id === w.id);
  let updated;
  if (isSaved) {
    updated = savedWorkouts.filter((sw) => sw.id !== w.id);
  } else {
    if (savedWorkouts.length >= 50) {
      throw new Error('MAX_LIMIT_REACHED');
    }
    updated = [w, ...savedWorkouts];
  }
  try {
    localStorage.setItem(SAVED_WORKOUTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error({
      action: 'toggleSavedWorkout',
      message: 'Failed to toggle saved workout',
      error: e instanceof Error ? e.message : String(e),
    });
  }
  return updated;
}

export function loadLanguage() {
  try {
    return localStorage.getItem('wod_lang') || 'en';
  } catch {
    return 'en';
  }
}

export function saveLanguage(lang) {
  try {
    localStorage.setItem('wod_lang', lang);
  } catch (e) {
    console.error({
      action: 'saveLanguage',
      message: 'Failed to save language',
      error: e instanceof Error ? e.message : String(e),
    });
  }
}

export function loadUnit() {
  try {
    return localStorage.getItem('wod_unit') || 'kg';
  } catch {
    return 'kg';
  }
}

export function saveUnit(unit) {
  try {
    localStorage.setItem('wod_unit', unit);
  } catch (e) {
    console.error({
      action: 'saveUnit',
      message: 'Failed to save unit',
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
