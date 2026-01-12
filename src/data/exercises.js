
// --- DATABASE (V7 UPGRADE: ADDED TAGS) ---
export const EXERCISE_DB = [
    // HINGE
    { id: 'dl_bb', name: 'Deadlift', name_de: 'Kreuzheben', pattern: 'Hinge', equipment: 'Barbell', intensity: 'High', tags: ['back', 'heavy'] },
    { id: 'sdlhp_kb', name: 'Sumo Deadlift High Pull', name_de: 'Sumo High Pull', pattern: 'Hinge', equipment: 'Dumbbell', intensity: 'Medium', tags: ['back', 'shoulders'] },
    { id: 'clean_bb', name: 'Clean', name_de: 'Umsetzen', pattern: 'Hinge', equipment: 'Barbell', intensity: 'VeryHigh', tags: ['back', 'shoulders', 'knees', 'impact', 'skill'] },
    { id: 'pwr_clean', name: 'Power Clean', name_de: 'Power Clean', pattern: 'Hinge', equipment: 'Barbell', intensity: 'High', tags: ['back', 'shoulders', 'impact'] },
    { id: 'snatch_bb', name: 'Snatch', name_de: 'Reißen', pattern: 'Hinge', equipment: 'Barbell', intensity: 'VeryHigh', tags: ['back', 'shoulders', 'overhead', 'knees', 'impact', 'skill'] },
    { id: 'kb_swing', name: 'KB Swing', name_de: 'Kettlebell Swing', pattern: 'Hinge', equipment: 'Dumbbell', intensity: 'Medium', tags: ['back', 'grip'] },
    { id: 'snatch_db', name: 'Alt. DB Snatch', name_de: 'Alt. KH Reißen', pattern: 'Hinge', equipment: 'Dumbbell', intensity: 'High', tags: ['back', 'shoulders', 'overhead'] },
    { id: 'db_clean', name: 'DB Power Clean', name_de: 'KH Umsetzen', pattern: 'Hinge', equipment: 'Dumbbell', intensity: 'High', tags: ['back', 'shoulders'] },
    { id: 'db_dl', name: 'DB Deadlift', name_de: 'KH Kreuzheben', pattern: 'Hinge', equipment: 'Dumbbell', intensity: 'Medium', tags: ['back', 'legs'] },
    { id: 'devil_press', name: 'Devil Press', name_de: 'Devil Press', pattern: 'Hinge', equipment: 'Dumbbell', intensity: 'VeryHigh', tags: ['back', 'shoulders', 'overhead', 'cardio'] },

    // SQUAT
    { id: 'bs_bb', name: 'Back Squat', name_de: 'Kniebeuge (hinten)', pattern: 'Squat', equipment: 'Barbell', intensity: 'High', tags: ['knees', 'heavy'] },
    { id: 'fs_bb', name: 'Front Squat', name_de: 'Frontkniebeuge', pattern: 'Squat', equipment: 'Barbell', intensity: 'High', tags: ['knees', 'heavy', 'core'] },
    { id: 'ohs_bb', name: 'Overhead Squat', name_de: 'Overhead Squat', pattern: 'Squat', equipment: 'Barbell', intensity: 'VeryHigh', tags: ['knees', 'shoulders', 'overhead', 'balance', 'skill'] },
    { id: 'thruster_bb', name: 'Thruster', name_de: 'Thruster', pattern: 'Squat', equipment: 'Barbell', intensity: 'VeryHigh', tags: ['knees', 'shoulders', 'overhead'] },
    { id: 'cluster', name: 'Cluster', name_de: 'Cluster', pattern: 'Squat', equipment: 'Barbell', intensity: 'VeryHigh', tags: ['knees', 'shoulders', 'overhead', 'clean'] },
    { id: 'fs_db', name: 'DB Front Squat', name_de: 'KH Frontkniebeuge', pattern: 'Squat', equipment: 'Dumbbell', intensity: 'High', tags: ['knees'] },
    { id: 'goblet', name: 'Goblet Squat', name_de: 'Goblet Squat', pattern: 'Squat', equipment: 'Dumbbell', intensity: 'Low', tags: ['knees'] },
    { id: 'wall_ball', name: 'Wall Ball', name_de: 'Wall Ball', pattern: 'Squat', equipment: 'Dumbbell', intensity: 'High', tags: ['knees', 'shoulders', 'overhead'] },
    { id: 'air_squat', name: 'Air Squat', name_de: 'Air Squat', pattern: 'Squat', equipment: 'Bodyweight', intensity: 'Low', tags: ['knees'] },
    { id: 'pistol', name: 'Pistol Squat', name_de: 'Pistols', pattern: 'Squat', equipment: 'Bodyweight', intensity: 'High', tags: ['knees', 'balance', 'skill'] },
    { id: 'lunge_weighted', name: 'Walking Lunge', name_de: 'Ausfallschritt', pattern: 'Squat', equipment: 'Dumbbell', intensity: 'High', tags: ['knees'] },
    { id: 'oh_lunge_db', name: 'DB Overhead Lunge', name_de: 'KH Überkopf Ausfallschritt', pattern: 'Squat', equipment: 'Dumbbell', intensity: 'VeryHigh', tags: ['knees', 'shoulders', 'overhead', 'balance'] },
    { id: 'box_step_over', name: 'DB Box Step-Over', name_de: 'Box Step-Over', pattern: 'Squat', equipment: 'Dumbbell', intensity: 'High', tags: ['knees', 'grip'] },
    { id: 'box_step_up', name: 'Box Step-Up', name_de: 'Box Aufsteigen', pattern: 'Squat', equipment: 'Bodyweight', intensity: 'Medium', tags: ['knees', 'legs'] },

    // PUSH
    { id: 'strict_press_bb', name: 'Strict Press', name_de: 'Schulterdrücken', pattern: 'Push', equipment: 'Barbell', intensity: 'Medium', tags: ['shoulders', 'overhead'] },
    { id: 'push_press_bb', name: 'Push Press', name_de: 'Push Press (LH)', pattern: 'Push', equipment: 'Barbell', intensity: 'High', tags: ['shoulders', 'overhead'] },
    { id: 'push_jerk_bb', name: 'Push Jerk', name_de: 'Stoßen', pattern: 'Push', equipment: 'Barbell', intensity: 'High', tags: ['shoulders', 'overhead', 'impact', 'skill'] },
    { id: 'push_press_db', name: 'DB Push Press', name_de: 'Push Press (KH)', pattern: 'Push', equipment: 'Dumbbell', intensity: 'High', tags: ['shoulders', 'overhead'] },
    { id: 'bench_press', name: 'Bench Press', name_de: 'Bankdrücken', pattern: 'Push', equipment: 'Barbell', intensity: 'High', tags: ['shoulders', 'chest'] },
    { id: 'pushup', name: 'Push-Up', name_de: 'Liegestütz', pattern: 'Push', equipment: 'Bodyweight', intensity: 'Low', tags: ['shoulders'] },
    { id: 'hspu', name: 'HSPU', name_de: 'Handstand Liegestütz', pattern: 'Push', equipment: 'Bodyweight', intensity: 'VeryHigh', tags: ['shoulders', 'overhead', 'skill'] },
    { id: 'hswalk', name: 'Handstand Walk', name_de: 'Handstandlauf', pattern: 'Push', equipment: 'Bodyweight', intensity: 'VeryHigh', tags: ['shoulders', 'overhead', 'skill', 'balance'] },
    { id: 'wall_walk', name: 'Wall Walk', name_de: 'Wall Walk', pattern: 'Push', equipment: 'Bodyweight', intensity: 'VeryHigh', tags: ['shoulders', 'overhead', 'core'] },
    { id: 'ring_dip', name: 'Ring Dip', name_de: 'Ring Dips', pattern: 'Push', equipment: 'PullupBar', intensity: 'High', tags: ['shoulders', 'skill', 'chest'] },
    { id: 'dip_bar', name: 'Bar Dip', name_de: 'Bar Dips', pattern: 'Push', equipment: 'PullupBar', intensity: 'High', tags: ['shoulders', 'chest'] },
    { id: 'burpee', name: 'Burpee', name_de: 'Burpee', pattern: 'Push', equipment: 'Bodyweight', intensity: 'High', tags: ['shoulders', 'knees', 'cardio'] },
    { id: 'burpee_box_jump', name: 'Burpee Box Jump', name_de: 'Burpee Box Jump', pattern: 'Push', equipment: 'Bodyweight', intensity: 'VeryHigh', tags: ['shoulders', 'knees', 'cardio', 'impact'] },

    // PULL
    { id: 'pullup', name: 'Pull-Up', name_de: 'Klimmzug', pattern: 'Pull', equipment: 'PullupBar', intensity: 'High', tags: ['shoulders', 'grip'] },
    { id: 'c2b', name: 'Chest-to-Bar', name_de: 'Chest-to-Bar', pattern: 'Pull', equipment: 'PullupBar', intensity: 'High', tags: ['shoulders', 'grip', 'skill'] },
    { id: 'bmu', name: 'Bar Muscle-Up', name_de: 'Bar Muscle-Up', pattern: 'Pull', equipment: 'PullupBar', intensity: 'VeryHigh', tags: ['shoulders', 'grip', 'skill', 'overhead'] },
    { id: 'rmu', name: 'Ring Muscle-Up', name_de: 'Ring Muscle-Up', pattern: 'Pull', equipment: 'PullupBar', intensity: 'VeryHigh', tags: ['shoulders', 'grip', 'skill', 'overhead'] },
    { id: 'ring_row', name: 'Ring Row', name_de: 'Ring Rudern', pattern: 'Pull', equipment: 'PullupBar', intensity: 'Low', tags: ['shoulders', 'grip'] },
    { id: 'rope_climb', name: 'Rope Climb', name_de: 'Seilklettern', pattern: 'Pull', equipment: 'PullupBar', intensity: 'High', tags: ['shoulders', 'grip', 'skill', 'legs'] },
    { id: 'bent_row', name: 'Bent Over Row', name_de: 'Langhantelrudern', pattern: 'Pull', equipment: 'Barbell', intensity: 'Medium', tags: ['back', 'grip'] },
    { id: 'db_row', name: 'DB Row', name_de: 'Kurzhantelrudern', pattern: 'Pull', equipment: 'Dumbbell', intensity: 'Medium', tags: ['back', 'grip'] },
    { id: 'strict_pullup', name: 'Strict Pull-Up', name_de: 'Strikter Klimmzug', pattern: 'Pull', equipment: 'PullupBar', intensity: 'High', tags: ['shoulders', 'grip', 'strength'] },
    { id: 'renegade', name: 'Renegade Row', name_de: 'Renegade Row', pattern: 'Pull', equipment: 'Dumbbell', intensity: 'High', tags: ['shoulders', 'core'] },

    // CARDIO
    { id: 'box_jump', name: 'Box Jump', name_de: 'Box Jump', pattern: 'Cardio', equipment: 'Bodyweight', intensity: 'High', tags: ['knees', 'impact'] },
    { id: 'du', name: 'Double Unders', name_de: 'Double Unders', pattern: 'Cardio', equipment: 'Bodyweight', intensity: 'High', tags: ['knees', 'impact', 'skill'] },
    { id: 'run', name: 'Run', name_de: 'Laufen', pattern: 'Cardio', equipment: 'Bodyweight', intensity: 'Low', tags: ['knees', 'impact'] },
    { id: 'row', name: 'Row', name_de: 'Rudern', pattern: 'Cardio', equipment: 'Machine', intensity: 'Low', tags: ['back', 'knees'] },
    { id: 'bike', name: 'Bike', name_de: 'Radfahren', pattern: 'Cardio', equipment: 'Machine', intensity: 'High', tags: ['knees'] },
    { id: 'ski', name: 'SkiErg', name_de: 'SkiErg', pattern: 'Cardio', equipment: 'Machine', intensity: 'Medium', tags: ['shoulders', 'core', 'hinge'] },

    // CORE
    { id: 'ttb', name: 'Toes-to-Bar', name_de: 'Toes-to-Bar', pattern: 'Core', equipment: 'PullupBar', intensity: 'High', tags: ['shoulders', 'grip', 'core'] },
    { id: 'ghd_situp', name: 'GHD Sit-Up', name_de: 'GHD Sit-Up', pattern: 'Core', equipment: 'Machine', intensity: 'High', tags: ['core', 'back'] },
    { id: 'situp', name: 'AbMat Sit-Up', name_de: 'Sit-Up', pattern: 'Core', equipment: 'Bodyweight', intensity: 'Low', tags: ['core', 'back'] },
    { id: 'v_up', name: 'V-Up', name_de: 'Klappmesser', pattern: 'Core', equipment: 'Bodyweight', intensity: 'High', tags: ['core', 'back'] },
    { id: 'tgu', name: 'Turkish Get-Up', name_de: 'Turkish Get-Up', pattern: 'Core', equipment: 'Dumbbell', intensity: 'Medium', tags: ['shoulders', 'core', 'coordination'] },
    { id: 'hollow_rock', name: 'Hollow Rock', name_de: 'Hollow Rock', pattern: 'Core', equipment: 'Bodyweight', intensity: 'Medium', tags: ['core'] },
    { id: 'l_sit', name: 'L-Sit', name_de: 'L-Sit', pattern: 'Core', equipment: 'PullupBar', intensity: 'High', tags: ['core', 'hip_flexor'] },

    // NEW LIMITED EQUIPMENT (V7.1)
    { id: 'mtn_climber', name: 'Mountain Climber', name_de: 'Bergsteiger', pattern: 'Cardio', equipment: 'Bodyweight', intensity: 'Medium', tags: ['core', 'shoulders', 'knees'] },
    { id: 'jumping_lunge', name: 'Jumping Lunge', name_de: 'Gesprungene Ausfallschritte', pattern: 'Squat', equipment: 'Bodyweight', intensity: 'VeryHigh', tags: ['knees', 'impact', 'legs'] },
    { id: 'db_snatch_hang', name: 'DB Hang Snatch', name_de: 'KH Hang Reißen', pattern: 'Hinge', equipment: 'Dumbbell', intensity: 'High', tags: ['back', 'shoulders', 'overhead'] },
    { id: 'db_thruster', name: 'DB Thruster', name_de: 'KH Thruster', pattern: 'Squat', equipment: 'Dumbbell', intensity: 'VeryHigh', tags: ['knees', 'shoulders', 'overhead'] },
    { id: 'bear_crawl', name: 'Bear Crawl', name_de: 'Bärengang', pattern: 'Core', equipment: 'Bodyweight', intensity: 'Medium', tags: ['shoulders', 'core'] },
    { id: 'plank_shoulder_tap', name: 'Plank Shoulder Taps', name_de: 'Plank Schultertippen', pattern: 'Core', equipment: 'Bodyweight', intensity: 'Low', tags: ['shoulders', 'core'] },
    { id: 'broad_jump', name: 'Broad Jump', name_de: 'Weitsprung', pattern: 'Cardio', equipment: 'Bodyweight', intensity: 'High', tags: ['knees', 'impact'] },
];

// V7: Tag-based exclusion instead of fragile strings
export const INJURY_MAP = {
    'Shoulders': ['shoulders', 'overhead'],
    'Knees': ['knees', 'impact'],
    'Back': ['back', 'heavy']
};
