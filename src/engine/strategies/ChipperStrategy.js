export const ChipperStrategy = {
    calculateParams(config) {
        // Longer duration Chippers become 2 or 3 rounds for time
        let rounds = 1;
        if (config.duration >= 45) {
            rounds = 3;
        } else if (config.duration >= 30) {
            rounds = 2;
        }

        return {
            template: 'Chipper',
            rounds: rounds,
            timeCap: config.duration
        };
    },

    scaleReps(baseReps, exercise, _difficulty, _duration) {
        // Handle non-numeric base reps (e.g. "400m", "45s")
        if (typeof baseReps !== 'number') {
            // Special case for Run: Increase distance for Chipper
            if (typeof baseReps === 'string' && baseReps.endsWith('m')) {
                const dist = parseInt(baseReps);
                if (!isNaN(dist)) return `${dist * 2}m`;
            }
            return baseReps; 
        }

        // Machine calories scaling for Chipper
        if (exercise.equipment === 'Machine') {
             return '40/30 cal';
        }

        let multiplier = 4;

        // Scale down high skill/intensity movements
        if (exercise.intensity === 'VeryHigh' || exercise.name.includes('Muscle-Up')) {
            multiplier = 2;
        } else if (exercise.intensity === 'High' || exercise.name.includes('Pull-Up') || exercise.name.includes('HSPU')) {
            multiplier = 3;
        }

        let reps = Math.floor(baseReps * multiplier);

        // Cap reps reasonably (e.g., 60 reps max per set usually, 100 for DU)
        if (reps > 60 && !exercise.name.includes('Double') && !exercise.name.includes('Single')) {
            reps = 60;
        }

        if (exercise.name.includes('Double')) reps = 100;
        if (exercise.name.includes('Single')) reps = 150;

        return reps;
    }
};
