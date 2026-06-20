// Rules for generating warmups and accessory strength templates based on metcon patterns
const CALF_RAISE_REGEX = /run|jump|^du$/;

export const generateWarmupLogic = (exercises, config = {}) => {
  if (config.includeWarmup === false) return [];

  let moves = new Set();
  const duration = config.warmupDuration || 3;
  const intensity = config.warmupIntensity || 'Easy';

  if (duration === 3 && intensity === 'Easy') {
    moves.add('cardioEasy');
  } else {
    moves.add(`dynamicCardio|${duration}|${intensity}`);
  }

  exercises.forEach((slot) => {
    const { pattern, id } = slot.exercise;
    if (pattern === 'Squat') moves.add('airSquats');
    if (pattern === 'Hinge') moves.add('hingeWarmup');
    if (pattern === 'Push') moves.add('pushWarmup');
    if (pattern === 'Pull') moves.add('pullWarmup');
    if (!moves.has('calfRaises') && CALF_RAISE_REGEX.test(id)) moves.add('calfRaises');
  });
  return Array.from(moves);
};

export const generateStrengthLogic = (exercises, config) => {
  if (!config.includeStrength) return null;
  const patterns = exercises.map((e) => e.exercise.pattern);
  const hasBarbell = config.equipment?.barbell;

  // Multi-pattern combinations
  if (patterns.includes('Push') && patterns.includes('Pull')) {
    return hasBarbell
      ? { nameKey: 'benchPress', sets: '5 x 5', noteKey: 'heavyForm' }
      : { nameKey: 'floorPress', sets: '4 x 8', noteKey: 'building' };
  }
  if (patterns.includes('Squat') && patterns.includes('Core')) {
    return hasBarbell
      ? { nameKey: 'overheadSquat', sets: '5 x 3', noteKey: 'tightCore' }
      : { nameKey: 'gobletSquat', sets: '4 x 8', noteKey: 'uprightTorso' };
  }
  if (patterns.includes('Hinge') && patterns.includes('Pull')) {
    return hasBarbell
      ? { nameKey: 'powerClean', sets: '5 x 3', noteKey: 'explosiveHips' }
      : { nameKey: 'sumoDeadlift', sets: '4 x 8', noteKey: 'heavyForm' };
  }
  if (patterns.includes('Squat') && !patterns.includes('Hinge')) {
    return { nameKey: 'deadlift', sets: '5 x 3', noteKey: 'heavyForm' };
  }
  if (patterns.includes('Push')) {
    return { nameKey: 'backSquat', sets: '5 x 5', noteKey: 'building' };
  }
  if (patterns.includes('Pull')) {
    return { nameKey: 'frontSquat', sets: '5 x 3', noteKey: 'uprightTorso' };
  }
  if (patterns.includes('Hinge')) {
    return { nameKey: 'pushPress', sets: '4 x 6', noteKey: 'explosiveHips' };
  }
  if (patterns.includes('Core')) {
    return { nameKey: 'romanianDeadlift', sets: '4 x 8', noteKey: 'controlledDescent' };
  }

  return {
    nameKey: 'strictPress',
    sets: '4 x 8',
    noteKey: 'tightCore',
  };
};
