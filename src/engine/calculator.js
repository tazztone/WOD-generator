export const calculateOneRepMax = (weight, reps) => {
  if (!weight || !reps || weight <= 0 || reps <= 0) return 0;

  const w = Number(weight);
  const r = Number(reps);

  if (isNaN(w) || isNaN(r)) return 0;
  if (r === 1) return w;

  // Epley formula: 1RM = w * (1 + r/30)
  const result = w * (1 + r / 30);

  // Round to nearest integer
  return Math.round(result);
};

export const calculatePercentages = (oneRepMax) => {
  if (!oneRepMax || oneRepMax <= 0) return [];

  const percentages = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50];
  return percentages.map((p) => ({
    percentage: p,
    value: Math.round(oneRepMax * (p / 100)),
  }));
};
