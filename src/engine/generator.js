// TODO: Consider adding seeded randomness option for reproducible workouts (useful for sharing/testing)
import { EXERCISE_DB, INJURY_MAP } from '../data/exercises';

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

export const getExerciseName = (ex, lang) => (lang === 'de' && ex.name_de) ? ex.name_de : ex.name;

// TODO: Make warmup duration/intensity configurable via user settings
export const generateWarmupLogic = (exercises, lang) => {
    const isDe = lang === 'de';
    let moves = new Set([isDe ? '3 min Cardio (Easy)' : '3 min Cardio (Easy)']);

    exercises.forEach(slot => {
        const { pattern, name } = slot.exercise;
        if (pattern === 'Squat') moves.add(isDe ? '10 Air Squats' : '10 Air Squats');
        if (pattern === 'Hinge') moves.add(isDe ? '10 Glute Bridges + 10 Good Mornings' : '10 Glute Bridges + 10 Good Mornings');
        if (pattern === 'Push') moves.add(isDe ? '10 Scap Push-ups + 5 Inchworms' : '10 Scap Push-ups + 5 Inchworms');
        if (pattern === 'Pull') moves.add(isDe ? '10 Ring Rows / Scap Pulls' : '10 Ring Rows / Scap Pulls');
        if (name.includes('Run') || name.includes('Jump')) moves.add(isDe ? '20 Wadenheben' : '20 Calf Raises');
    });
    return Array.from(moves);
};

// TODO: Expand strength pairing options - currently limited to 3 exercises
export const generateStrengthLogic = (exercises, config, lang) => {
    if (!config.includeStrength) return null;
    const patterns = exercises.map(e => e.exercise.pattern);
    const isDe = lang === 'de';

    // Smart Pairing: Avoid pre-fatiguing the primary mover of the Metcon too much
    // If Metcon is Squat heavy -> Do Hinge or Push Strength

    if (patterns.includes('Squat') && !patterns.includes('Hinge')) {
        return { name: isDe ? 'Deadlift' : 'Deadlift', sets: '5 x 3', notes: isDe ? 'Schwer, Fokus Technik' : 'Heavy, Perfect Form' };
    }
    if (patterns.includes('Push')) {
        return { name: isDe ? 'Back Squat' : 'Back Squat', sets: '5 x 5', notes: isDe ? 'Aufbauend' : 'Building weight' };
    }

    // Default fallback
    return {
        name: isDe ? 'Strict Press' : 'Strict Press',
        sets: '4 x 8',
        notes: isDe ? 'Rumpf fest, kein Beineinsatz' : 'Tight core, no legs'
    };
};

export const isExerciseValid = (ex, currentConfig) => {
    if (ex.equipment === 'Barbell' && !currentConfig.equipment.barbell) return false;
    if (ex.equipment === 'Dumbbell' && !currentConfig.equipment.dumbbell) return false;
    if (ex.equipment === 'PullupBar' && !currentConfig.equipment.pullupBar) return false;
    if (ex.equipment === 'Machine' && !currentConfig.equipment.machine) return false;

    if (currentConfig.difficulty === 'Beginner') {
        if (ex.intensity === 'VeryHigh') return false;
    }

    if (currentConfig.avoid.length > 0) {
        for (const area of currentConfig.avoid) {
            const forbiddenTags = INJURY_MAP[area];
            if (ex.tags && ex.tags.some(tag => forbiddenTags.includes(tag))) return false;
        }
    }
    return true;
};

export const generateWorkout = (config, lang = 'en') => {
    let availableExercises = EXERCISE_DB.filter(ex => isExerciseValid(ex, config));

    if (config.focus !== 'Balanced') {
        const focusPatterns = {
            'Cardio': ['Cardio'],
            'Strength': ['Squat', 'Hinge', 'Push'],
            'Gymnastics': ['Pull', 'Core', 'Push'],
            'Core': ['Core']
        };
        const targetPatterns = focusPatterns[config.focus] || [];
        const priorityMoves = availableExercises.filter(ex => targetPatterns.includes(ex.pattern));
        // Bias the pool by adding duplicates of focused items
        availableExercises = [...availableExercises, ...priorityMoves];
    }

    // Templates pool
    const templates = ['AMRAP', 'RFT', 'EMOM', 'Ladder', 'Death By'];
    let template = config.templateType;
    if (template === 'Random') template = templates[Math.floor(Math.random() * templates.length)];

    let timeCap = config.duration;
    let rounds = 0;
    let buyIn = null;

    if (template === 'RFT') {
        const avgRepTimeMin = 1.5;
        rounds = Math.max(3, Math.floor(config.duration / avgRepTimeMin));
    } else if (template === 'EMOM') {
        rounds = config.duration;
    } else if (template === 'Chipper') {
        rounds = 1;
    } else if (template === 'Tabata') {
        timeCap = 4;
        rounds = 8;
    } else if (template === 'Death By') {
        rounds = config.duration; // It's essentially an EMOM that ends when you fail
    } else if (template === 'Ladder') {
        rounds = 1; // Continuous ladder
    }

    // Optional Buy-In (15% chance if duration > 10)
    if (config.duration > 10 && Math.random() < 0.15) {
        const buyInPool = availableExercises.filter(ex => ex.pattern === 'Cardio' || ex.pattern === 'Core');
        if (buyInPool.length > 0) {
            const picked = buyInPool[Math.floor(Math.random() * buyInPool.length)];
            buyIn = {
                exercise: picked,
                reps: picked.pattern === 'Cardio' ? '500m / 40 cal' : 50
            };
        }
    }

    const selectedExercises = [];
    const selectedExerciseIds = new Set();
    const targetCount = config.numExercises;
    let usedPatterns = [];

    for (let i = 0; i < targetCount; i++) {
        const pool = availableExercises.filter(ex => {
            if (selectedExerciseIds.has(ex.id)) return false;
            if (buyIn && buyIn.exercise.id === ex.id) return false;
            if (usedPatterns.length > 0) {
                const lastPattern = usedPatterns[usedPatterns.length - 1];
                if (ex.pattern === lastPattern) return false;
            }
            return true;
        });

        if (pool.length === 0) break;
        const picked = pool[Math.floor(Math.random() * pool.length)];

        let reps = getReps(picked, config.difficulty, template, timeCap);

        // Partner Mode doubling
        if (config.isPartner && typeof reps === 'number') {
            reps = reps * 2;
        }

        // Template specific reformatting
        if (template === 'Ladder') {
            const isAsc = Math.random() > 0.5;
            reps = isAsc ? "1-2-3-4..." : "10-9-8...1";
        } else if (template === 'Death By') {
            reps = "1 + 1 every min";
        }

        selectedExercises.push({
            exercise: picked,
            reps: reps
        });
        selectedExerciseIds.add(picked.id);
        usedPatterns.push(picked.pattern);
    }

    return {
        template,
        timeCap,
        rounds: (template === 'RFT' || template === 'EMOM' || template === 'Tabata' || template === 'Death By') ? rounds : null,
        exercises: selectedExercises,
        buyIn,
        isPartner: config.isPartner || false,
        generatedAt: new Date(),
        warmup: generateWarmupLogic(selectedExercises, lang),
        strength: generateStrengthLogic(selectedExercises, config, lang)
    };
};

export const swapExercise = (workout, index, newExerciseId, config, lang = 'en') => {
    const newEx = EXERCISE_DB.find(e => e.id === newExerciseId);
    if (!newEx) return workout;

    const newExercises = [...workout.exercises];
    let reps = getReps(newEx, config.difficulty, workout.template, workout.timeCap);

    // Partner Mode doubling
    if (config.isPartner && typeof reps === 'number') {
        reps = reps * 2;
    }

    // Template specific reformatting
    if (workout.template === 'Ladder') {
        const isAsc = Math.random() > 0.5;
        reps = isAsc ? "1-2-3-4..." : "10-9-8...1";
    } else if (workout.template === 'Death By') {
        reps = "1 + 1 every min";
    }

    newExercises[index] = {
        exercise: newEx,
        reps: reps
    };

    return {
        ...workout,
        exercises: newExercises,
        warmup: generateWarmupLogic(newExercises, lang),
        strength: generateStrengthLogic(newExercises, config, lang)
    };
};
