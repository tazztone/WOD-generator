# PHASE 1 AUDIT: Content & Logic Analysis

**Milestone**: v1.7
**Date**: 2026-01-31

## 1. Objective
Analyze the current state of the exercise database and generation logic to confirm the necessity of v1.7 goals and to inform the next phases of development.

## 2. Analysis Summary
The `scripts/analyze-distribution.js` script was run for 10,000 iterations. The results clearly validate the goals of this milestone.

### Key Findings:
- **Pool Saturation (Core)**: The Core exercise pool is critically saturated, with a **476.6 hits/ex** ratio. This is the primary driver of workout repetitiveness.
- **Pool Saturation (Cardio)**: The Cardio pool is similarly saturated at **487.9 hits/ex**.
- **Skill Leakage**: There is a **20.68%** chance that a "Beginner" workout will include an exercise tagged with "skill". This is unacceptably high and confirms a flaw in the substitution logic.
- **Push/Pull Ratio**: The ratio is **0.95**, indicating the fundamental balance of the generator is sound.

## 3. Proposed New Exercises

Based on the audit, the following exercises are proposed to expand the content pools.

### Core Expansion (Goal: 15+)
1.  Leg Raises
2.  Windshield Wipers
3.  Dragon Flag
4.  Cable Crunch
5.  Pallof Press
6.  Bird Dog
7.  Tuck Crunch
8.  Russian Kettlebell Swing
9.  Ab Rollout
10. Medicine Ball Slam
11. Side Bend (Dumbbell)
12. Plank with Reach
13. Reverse Crunch
14. Copenhagen Plank
15. Back Extension
16. Good Morning (Barbell)
17. Weighted Sit-up

### Cardio/Bodyweight Expansion (Goal: 10+)
1.  Inchworm
2.  Tuck Jump
3.  Butt Kicks
4.  Stair Climb
5.  Rowing (Machine) - *Variant: Damper setting focus*
6.  Bike (Machine) - *Variant: Sprint intervals*
7.  SkiErg (Machine) - *Variant: Double pole vs. single arm*
8.  Bear Crawl Sled Drag
9.  Jumping Rope (Crossover)
10. Pogo Jump
11. Wall Ball (Target Height Variation)

## 4. Next Steps
- **Phase 2**: Begin implementation of the "Core Expansion" list.
- **Phase 4**: Investigate the `WorkoutDirector` and substitution logic to address the 20.68% skill leakage.
