export const ChipperStrategy = {
    calculateParams(config) {
        return {
            template: 'Chipper',
            rounds: 1,
            timeCap: config.duration
        };
    },

    scaleReps(baseReps, exercise, _difficulty, _duration) {
        // Handle non-numeric base reps (e.g. "400m", "45s")
        if (typeof baseReps !== 'number') {
            // Special case for Run: Double the distance for Chipper?
            // For now, return as is or maybe scale if it looks like a number
            return baseReps; 
        }

        // Machine calories scaling for Chipper (baseReps is now a number like 15)
        if (exercise.equipment === 'Machine') {
             return '40/30 cal';
        }

        // Chippers are high volume
        let reps = baseReps * 4;

        if (exercise.name.includes('Double')) reps = 100;
        if (exercise.name.includes('Single')) reps = 150;

        return reps;
    }
};
