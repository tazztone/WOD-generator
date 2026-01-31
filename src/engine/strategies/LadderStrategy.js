export const LadderStrategy = {
    calculateParams(config) {
        return {
            template: 'Ladder',
            rounds: 1,
            timeCap: config.duration
        };
    },

    scaleReps(_baseReps, _exercise, _difficulty, _duration) {
        // Ladder reps are special strings
        const isAsc = Math.random() > 0.5;
        return isAsc ? "1-2-3-4..." : "10-9-8...1";
    }
};
