export const RftStrategy = {
    calculateParams(config) {
        // Estimate time per round based on number of exercises
        // Assume ~45s per exercise + 15s transition = 1 min per station
        // Plus some buffer/rest between rounds
        const avgTimePerExercise = 1.25;
        const numExercises = config.numExercises || 5;
        const estTimePerRound = numExercises * avgTimePerExercise;

        const rounds = Math.floor(config.duration / estTimePerRound);

        return {
            template: 'RFT',
            rounds: Math.max(3, rounds),
            timeCap: config.duration
        };
    },

    scaleReps(baseReps, _exercise, _difficulty, _duration) {
        // RFT reps are usually standard
        return baseReps;
    }
};
