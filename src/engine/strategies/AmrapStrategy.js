export const AmrapStrategy = {
    calculateParams(config) {
        return {
            template: 'AMRAP',
            rounds: null,
            timeCap: config.duration
        };
    },

    scaleReps(baseReps, exercise, difficulty, duration) {
        if (typeof baseReps !== 'number') return baseReps;

        // Dynamic Scaling based on duration
        const isLong = duration > 25;
        const isExtraLong = duration > 45;
        const isExtreme = duration > 80;

        let reps = baseReps;

        // Pacing adjustments for longer AMRAPs
        if (isExtreme && reps > 6) reps = 6;
        else if (isExtraLong && reps > 8) reps = 8;
        else if (isLong && reps > 10) reps = 10;

        return reps;
    }
};
