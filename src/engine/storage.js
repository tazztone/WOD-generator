// TODO: Add export/import functionality for users to backup their data
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
    numExercises: 3,
    avoid: [],
    // TODO: Add more equipment options: kettlebell, jump rope, box, rings
    equipment: { barbell: true, dumbbell: true, pullupBar: true, machine: true },
    volume: 0.7,
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

    // Add future migrations here:
    // if (migrated.version < 2) { ... migrated.version = 2 }

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
        console.error('Failed to load config', e);
    }
    return DEFAULT_CONFIG;
}

export function saveConfig(config) {
    try {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
        console.error('Failed to save config', e);
    }
}
