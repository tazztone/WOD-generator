export const RftStrategy = {
    calculateParams(config) {
        const avgRepTimeMin = 1.5;
        const rounds = Math.max(3, Math.floor(config.duration / avgRepTimeMin));
        return {
            template: 'RFT',
            rounds: rounds,
            timeCap: config.duration // RFT usually has a cap equal to the intended duration slot
        };
    },

    scaleReps(baseReps, exercise, difficulty, duration) {
        // RFT reps are usually standard, maybe slightly higher than AMRAP since you get rest between rounds (theoretically)
        // But for this generator, we keep them similar to base
        return baseReps;
    }
};
