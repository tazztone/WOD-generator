export const DeathByStrategy = {
    calculateParams(config) {
        return {
            template: 'Death By',
            rounds: config.duration, // Usually goes until failure, but cap is duration
            timeCap: config.duration
        };
    },

    scaleReps(_baseReps, _exercise, _difficulty, _duration) {
        return "1 + 1 every min";
    }
};
