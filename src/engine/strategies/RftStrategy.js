export const RftStrategy = {
    calculateParams(config, _exercises) {
        let rounds = 5; // Default RFT rounds

        // Adjust based on duration
        if (config.duration >= 30) rounds = 6;
        if (config.duration >= 45) rounds = 8;

        // Special handling based on exercise count/type could go here

        return {
            template: 'RFT',
            rounds: rounds,
            timeCap: config.duration
        };
    },

    scaleReps(baseReps, _exercise, _difficulty, _duration) {
        // RFT reps are usually standard
        return baseReps;
    }
};
