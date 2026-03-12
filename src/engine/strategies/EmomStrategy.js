export const EmomStrategy = {
    calculateParams(config) {
        return {
            template: 'EMOM',
            rounds: config.duration,
            timeCap: config.duration
        };
    },

    scaleReps(baseReps, exercise, _difficulty, _duration) {
        if (typeof baseReps !== 'number') return baseReps;

        // EMOMs need to be sprintable within the minute (approx 40s work)

        // 1. Handle Light/High Rep movements (Double Unders, Single Unders, Running)
        // If baseReps is already high (> 15), it usually implies a light movement or distance
        // We generally want to keep these high to fill the minute
        if (baseReps >= 15 || exercise.id === 'du' || exercise.id === 'su' || exercise.pattern === 'Cardio') {
             return baseReps; // Keep the high rep count (e.g. 50 DU, 200m Run)
        }

        // 2. Handle Heavy/Slow movements
        // If it's a standard movement (e.g. Thruster, Pull-up), cap it to ensure it fits
        if (baseReps > 12) {
            return 10; // Cap standard movements to 10-12 reps per min
        }

        return baseReps;
    }
};
