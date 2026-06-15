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
        machine: true
    },
    volume: 0.7,
    audioSettings: { countdowns: true, announcements: true, beeps: true },
    isPartner: false
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
            error: e instanceof Error ? e.message : String(e)
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
            error: e instanceof Error ? e.message : String(e)
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
            savedWorkouts
        };

        return JSON.stringify(exportPayload, null, 2);
    } catch (e) {
        console.error({
            action: 'exportData',
            message: 'Failed to export data',
            error: e instanceof Error ? e.message : String(e)
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
            const validHistory = parsed.history.filter(item =>
                item && typeof item === 'object' && item.id && item.timestamp
            ).slice(0, 200);
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
            error: e instanceof Error ? e.message : String(e)
        });
        return false;
    }
}
