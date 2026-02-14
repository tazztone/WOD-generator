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

        // Chippers are high volume
        let reps = baseReps * 4;

        // Cap reps reasonably (e.g., 60 reps max per set usually)
        if (reps > 60) reps = 60;

        if (exercise.name.includes('Double')) reps = 100;
        if (exercise.name.includes('Single')) reps = 150;

        return reps;
    }
};
