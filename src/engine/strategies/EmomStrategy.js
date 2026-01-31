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

        // EMOMs need to be sprintable within the minute
        if (baseReps > 12 && !exercise.name.includes('Double')) {
            return 10;
        }
        return baseReps;
    }
};
