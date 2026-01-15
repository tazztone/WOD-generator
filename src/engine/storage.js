// TODO: Add schema version migration logic when DEFAULT_CONFIG changes
// TODO: Add export/import functionality for users to backup their data
export const CONFIG_STORAGE_KEY = 'wod_config_v1';
export const HISTORY_STORAGE_KEY = 'wod_history_v7';

export const DEFAULT_CONFIG = {
    duration: 15,
    difficulty: 'Rx',
    focus: 'Balanced',
    templateType: 'Random',
    includeStrength: false,
    numExercises: 3,
    avoid: [],
    // TODO: Add more equipment options: kettlebell, jump rope, box, rings
    equipment: { barbell: true, dumbbell: true, pullupBar: true, machine: true }
};

export function loadConfig() {
    try {
        const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
        if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
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
