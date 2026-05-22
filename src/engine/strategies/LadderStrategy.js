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
        const array = new Uint8Array(1);
        crypto.getRandomValues(array);
        const isAsc = array[0] > 127;
        return isAsc ? "1-2-3-4..." : "10-9-8...1";
    }
};
