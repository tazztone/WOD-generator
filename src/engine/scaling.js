// Logic for scaling reps and substituting exercises based on difficulty

// V8 Upgrade: Smart Substitutions
// Maps advanced movements to simpler variants for Beginner/Scaled levels
const SUBSTITUTIONS = {
    'hspu': 'push_press_db',      // Handstand Push-up -> DB Push Press
    'bmu': 'pullup',              // Bar Muscle-up -> Pull-up
    'rmu': 'c2b',                 // Ring Muscle-up -> Chest-to-Bar
    'pistol': 'lunge_weighted',    // Pistol -> Weighted Lunge
    'du': 'su',                    // Double Unders -> Single Unders
    'ttb': 'v_up',                 // Toes-to-Bar -> V-Up
    'hswalk': 'bear_crawl',        // Handstand Walk -> Bear Crawl
    'wall_walk': 'plank_shoulder_tap' // Wall Walk -> Shoulder Taps
};

export const getReps = (exercise, difficulty, format, duration) => {
    // V7: Dynamic Scaling based on duration
    const isLong = duration > 25;
    const isExtraLong = duration > 45;
    const isExtreme = duration > 80;
    const isShort = duration < 12;

    if (exercise.name.includes('Run')) {
        if (isExtreme) return '1000m';
        if (isExtraLong) return '800m';
        return isShort ? '200m' : '400m';
    }
    if (exercise.name.includes('Plank') || exercise.name.includes('Wall Sit')) return '45s';
    if (exercise.equipment === 'Machine') {
        if (format === 'Chipper') return '40/30 cal';
        if (isExtreme) return '25 cal';
        if (isExtraLong) return '20 cal';
        return isShort ? '10 cal' : '15 cal';
    }

    let baseReps = 15;
    if (exercise.intensity === 'High') baseReps = 10;
    if (exercise.intensity === 'VeryHigh') baseReps = 6;
    if (exercise.name.includes('Double')) baseReps = 40;
    if (exercise.name.includes('Single Unders')) baseReps = 60;

    // Scale down for beginners
    if (difficulty === 'Beginner') {
        baseReps = Math.ceil(baseReps * 0.6);
        if (exercise.name.includes('Double') || exercise.name.includes('Single')) baseReps = 30;
    }

    // Format adjustments
    if (format === 'EMOM' || format === 'Tabata') {
        // EMOMs need to be sprintable
        if (baseReps > 12 && !exercise.name.includes('Double')) baseReps = 10;
    } else if (format === 'Chipper') {
        // Chippers are high volume
        baseReps = baseReps * 4;
        if (exercise.name.includes('Double')) baseReps = 100;
        if (exercise.name.includes('Single')) baseReps = 150;
    } else if (isExtreme && format === 'AMRAP') {
        if (baseReps > 6) baseReps = 6;
    } else if (isExtraLong && format === 'AMRAP') {
        if (baseReps > 8) baseReps = 8;
    } else if (isLong && format === 'AMRAP') {
        // Pacing for long workouts
        if (baseReps > 10) baseReps = 10;
    }

    return baseReps;
};

/**
 * Returns a substituted exercise ID if applicable for the difficulty
 */
export const getSubstitution = (exerciseId, difficulty) => {
    if (difficulty !== 'Beginner') return null;
    return SUBSTITUTIONS[exerciseId] || null;
};