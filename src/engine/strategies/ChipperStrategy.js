export const ChipperStrategy = {
  calculateParams(config) {
    // Longer duration Chippers become 2 or 3 rounds for time
    let rounds = 1;
    if (config.duration >= 45) {
      rounds = 3;
    } else if (config.duration >= 30) {
      rounds = 2;
    }

    return {
      template: 'Chipper',
      rounds: rounds,
      timeCap: config.duration,
    };
  },

  scaleReps(baseReps, exercise, _difficulty, _duration) {
    // Handle non-numeric base reps (e.g. "400m", "45s", "50ft")
    if (typeof baseReps !== 'number') {
      // Special case for Run/Distance: Increase distance for Chipper
      if (typeof baseReps === 'string' && (baseReps.endsWith('m') || baseReps.endsWith('ft'))) {
        const match = baseReps.match(/^(\d+)/);
        const dist = match ? parseInt(match[1]) : null;
        const unit = baseReps.endsWith('m') ? 'm' : 'ft';
        if (dist !== null) return `${dist * 2}${unit}`;
      }
      return baseReps;
    }

    // Machine calories scaling for Chipper
    if (exercise.equipment === 'Machine') {
      return '40/30 cal';
    }

    let multiplier = 4;

    // Scale down high skill/intensity movements
    if (exercise.intensity === 'VeryHigh' || exercise.id.includes('muscle_up')) {
      multiplier = 2;
    } else if (
      exercise.intensity === 'High' ||
      exercise.id.includes('pullup') ||
      exercise.id.includes('hspu')
    ) {
      multiplier = 3;
    }

    let reps = Math.floor(baseReps * multiplier);

    // --- Refined Caps ---
    if (exercise.intensity === 'VeryHigh' && reps > 8) {
      reps = 8;
    } else if (reps > 60 && exercise.id !== 'du' && exercise.id !== 'su') {
      reps = 60;
    }

    if (exercise.id === 'du') reps = 100;
    if (exercise.id === 'su') reps = 150;

    return reps;
  },
};
