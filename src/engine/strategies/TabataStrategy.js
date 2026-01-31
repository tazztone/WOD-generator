export const TabataStrategy = {
    calculateParams(_config) {
        return {
            template: 'Tabata',
            rounds: 8,
            timeCap: 4 // Standard Tabata is 4 mins
        };
    },

    scaleReps(baseReps, exercise, _difficulty, _duration) {
        if (typeof baseReps !== 'number') return baseReps;

        // Tabata is max effort, but we provide a target per round or just "Max"
        // The original logic clamped reps like EMOM
        if (baseReps > 12 && !exercise.name.includes('Double')) {
            return 10;
        }
        return baseReps;
    }
};
