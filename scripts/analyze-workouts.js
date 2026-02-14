import { generateWorkout } from '../src/engine/generator.js';

const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Elite'];
const durations = [15, 30, 45, 60];
const focuses = ['Balanced', 'Strength', 'Cardio', 'Gymnastics'];
const templates = ['AMRAP', 'RFT', 'EMOM', 'Chipper', 'Tabata', 'Ladder', 'Death By'];

let totalWorkouts = 0;
let issues = [];

console.log('Starting comprehensive workout analysis...');

for (const diff of difficulties) {
    for (const dur of durations) {
        for (const focus of focuses) {
            for (const template of templates) {
                const config = {
                    difficulty: diff,
                    duration: dur,
                    focus: focus,
                    templateType: template,
                    numExercises: 5,
                    isPartner: false,
                    includeRun: true,
                    includeRow: true,
                    includeBike: true,
                    includeStrength: true,
                    avoid: [],
                    equipment: {
                        barbell: true,
                        dumbbell: true,
                        kettlebell: true,
                        pullupBar: true,
                        box: true,
                        rings: true,
                        machine: true,
                        jumpRope: true
                    }
                };

                try {
                    const workout = generateWorkout(config);
                    totalWorkouts++;

                    // 1. RFT Rounds Check
                    if (template === 'RFT') {
                        // Assuming 5 exercises, ~1m per exercise + transitions
                        // 45m workout shouldn't have > 15 rounds
                        const maxReasonableRounds = (dur / config.numExercises) * 1.5;
                        if (workout.rounds > maxReasonableRounds) {
                            issues.push({
                                config,
                                type: 'Excessive RFT Rounds',
                                message: `${workout.rounds} rounds for ${dur}m workout with ${config.numExercises} exercises`
                            });
                        }
                    }

                    // 2. Chipper Scaling Check
                    if (template === 'Chipper') {
                        // Long chippers should have > 1 round or massive reps
                        if (dur >= 45 && workout.rounds === 1) {
                             // This is subjective, but 1 round for 45m is likely too short unless reps are huge
                             // Let's check average reps
                             const avgReps = workout.exercises.reduce((sum, e) => sum + (typeof e.reps === 'number' ? e.reps : 0), 0) / config.numExercises;
                             if (avgReps < 50) { // If avg reps < 50, it's too short for 45m
                                issues.push({
                                    config,
                                    type: 'Short Chipper',
                                    message: `1 round of avg ${Math.round(avgReps)} reps for ${dur}m duration`
                                });
                             }
                        }
                    }

                    // 3. General Logic Checks
                    if (workout.exercises.length < 3 && dur > 20) {
                         issues.push({
                                config,
                                type: 'Low Exercise Count',
                                message: `Only ${workout.exercises.length} exercises for ${dur}m workout`
                            });
                    }

                } catch (e) {
                    issues.push({ config, error: `Crash: ${e.message}` });
                }
            }
        }
    }
}

console.log(`\nAnalyzed ${totalWorkouts} workouts.`);
console.log(`Found ${issues.length} potential logical issues.`);

if (issues.length > 0) {
    console.log('--- Issues Found (First 20) ---');
    issues.slice(0, 20).forEach((issue, i) => {
        const msg = issue.error || issue.message;
        console.log(`${i + 1}. [${issue.config.templateType} | ${issue.config.difficulty} | ${issue.config.duration}m] -> ${issue.type || 'Error'}: ${msg}`);
    });
}
