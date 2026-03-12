export const TabataStrategy = {
    calculateParams(config) {
        // Tabata is 20s work / 10s rest = 30s per round
        // Rounds = (duration * 60) / 30 = duration * 2
        return {
            template: 'Tabata',
            rounds: config.duration * 2,
            timeCap: config.duration
        };
    },

    scaleReps(baseReps, exercise, _difficulty, _duration) {
        if (typeof baseReps !== 'number') return baseReps;

        // Tabata is max effort, but we provide a target per round or just "Max"
        // The original logic clamped reps like EMOM
        if (baseReps > 12 && exercise.id !== 'du') {
            return 10;
        }
        return baseReps;
    }
};
