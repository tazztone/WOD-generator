/**
 * Workout Generation Configuration Constants
 */

export const CLASH_TAGS = ['shoulders', 'legs', 'grip', 'core', 'overhead'];

export const FOCUS_PATTERNS = {
    'Cardio': ['Cardio'],
    'Strength': ['Squat', 'Hinge', 'Push', 'Pull'],
    'Gymnastics': ['Pull', 'Core', 'Push'],
    'Core': ['Core']
};

export const BUY_IN_CONFIG = {
    CHANCE: 0.20,
    MIN_DURATION: 10,
    PATTERNS: {
        'Default': ['Cardio', 'Core'],
        'Cardio': ['Core'],
        'Strength': ['Cardio']
    },
    REPS: {
        'Cardio': '500m / 40 cal',
        'Default': 50
    }
};

export const SCALING_CONSTANTS = {
    BEGINNER_MULTIPLIER: 0.6,
    DEFAULT_REPS: 15,
    INTENSITY_REPS: {
        'High': 10,
        'VeryHigh': 6
    },
    SPECIAL_REPS: {
        'Double': 40,
        'Single Unders': 60,
        'Beginner_Jump': 30
    },
    DURATION_THRESHOLDS: {
        SHORT: 12,
        EXTRA_LONG: 45,
        EXTREME: 80
    },
    MACHINE_REPS: {
        EXTREME: 25,
        EXTRA_LONG: 20,
        SHORT: 10,
        DEFAULT: 15
    },
    RUN_DISTANCES: {
        EXTREME: '1000m',
        EXTRA_LONG: '800m',
        SHORT: '200m',
        DEFAULT: '400m'
    }
};

export const SUBSTITUTIONS = {
    Beginner: {
        'hspu': 'push_press_db',      // Handstand Push-up -> DB Push Press
        'bmu': 'pullup',              // Bar Muscle-up -> Pull-up
        'rmu': 'pullup',              // Ring Muscle-up -> Pull-up
        'c2b': 'pullup',              // Chest-to-Bar -> Pull-up
        'pistol': 'goblet_squat',     // Pistol -> Goblet Squat
        'du': 'su',                    // Double Unders -> Single Unders
        'ttb': 'situp',                // Toes-to-Bar -> Sit-Up
        'hswalk': 'bear_crawl',        // Handstand Walk -> Bear Crawl
        'wall_walk': 'plank_shoulder_tap' // Wall Walk -> Shoulder Taps
    },
    Scaled: {
        'hspu': 'push_press_db',      // Handstand Push-up -> DB Push Press
        'bmu': 'pullup',              // Bar Muscle-up -> Pull-up
        'rmu': 'c2b',                 // Ring Muscle-up -> Chest-to-Bar
        'pistol': 'lunge_weighted',    // Pistol -> Weighted Lunge
        'du': 'su',                    // Double Unders -> Single Unders
        'ttb': 'v_up',                 // Toes-to-Bar -> V-Up
        'hswalk': 'bear_crawl',        // Handstand Walk -> Bear Crawl
        'wall_walk': 'plank_shoulder_tap' // Wall Walk -> Shoulder Taps
    }
};
