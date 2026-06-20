// src/engine/utils.js
import { INJURY_MAP } from '../data/exercises.js';

export const getExerciseName = (ex, lang) => (lang === 'de' && ex.name_de) ? ex.name_de : ex.name;

// Cache for forbidden tags sets based on the "avoid" array content
// This prevents repeated Set instantiation even if config objects are recreated or frozen
const forbiddenTagsCache = new Map();

export const isExerciseValid = (ex, currentConfig) => {
    if (ex.equipment === 'Barbell' && !currentConfig.equipment.barbell) return false;
    if (ex.equipment === 'Dumbbell' && !currentConfig.equipment.dumbbell) return false;
    if (ex.equipment === 'Kettlebell' && !currentConfig.equipment.kettlebell) return false;
    if (ex.equipment === 'PullupBar' && !currentConfig.equipment.pullupBar) return false;
    if (ex.equipment === 'Rings' && !currentConfig.equipment.rings) return false;
    if (ex.equipment === 'Box' && !currentConfig.equipment.box) return false;
    if (ex.equipment === 'JumpRope' && !currentConfig.equipment.jumpRope) return false;
    if (ex.equipment === 'Machine' && !currentConfig.equipment.machine) return false;

    if (currentConfig.difficulty === 'Beginner') {
        if (ex.intensity === 'VeryHigh') return false;
    }

    if (currentConfig.forbiddenTagsSet && ex.tags) {
        if (ex.tags.some(tag => currentConfig.forbiddenTagsSet.has(tag))) return false;
    } else if (currentConfig.avoid && currentConfig.avoid.length > 0) {
        const cacheKey = [...currentConfig.avoid].sort().join(',');
        let forbiddenTagsSet = forbiddenTagsCache.get(cacheKey);

        if (!forbiddenTagsSet) {
            forbiddenTagsSet = new Set();
            for (const area of currentConfig.avoid) {
                const forbiddenTags = INJURY_MAP[area];
                if (forbiddenTags) {
                    for (let i = 0; i < forbiddenTags.length; i++) {
                        forbiddenTagsSet.add(forbiddenTags[i]);
                    }
                }
            }
            forbiddenTagsCache.set(cacheKey, forbiddenTagsSet);
        }
        if (ex.tags && ex.tags.some(tag => forbiddenTagsSet.has(tag))) return false;
    }

    return true;
};
