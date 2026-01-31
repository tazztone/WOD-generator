# Algorithm Analysis & Tuning Report
**Date:** 2026-01-31
**Version:** v1.5 (Analysis Phase)

## 1. Analysis Summary
Based on the generation of 2,000 mock workouts using the improved `scripts/analyze-distribution.js`, we have mathematically verified the behavior of the generator.

### Key Observations
*   **Safety**: Zero "Impossible" exercises generated. The equipment constraint logic is working perfectly.
*   **Balance**: 
    *   **Push/Pull Ratio is 1.52**. This confirms the hypothesis that the generator favors Push movements significantly over Pull movements.
    *   **Core Utilization is Extreme (141.3 hits/ex)**. With only 10 Core exercises in the pool, they repeat very often.
    *   **Cardio Utilization is High (135.6 hits/ex)**. Similar to Core, the small pool (9 exercises) leads to repetition.
*   **Structure**:
    *   Strength parts appear in ~50% of workouts.
    *   Buy-Ins appear in ~14%.

## 2. Verified Hypotheses
1.  ✅ **"Sit-Up" Dominance is due to Small Pool**: CONFIRMED. Core has the highest utilization rate (141.3) because the pool is tiny (10 items).
2.  ✅ **Push/Pull Imbalance**: CONFIRMED. Push pattern has 1419 hits vs Pull's 931 hits. This is likely because "Push" exercises are present in more logic paths or simply because the random picker hits them more often due to Focus biases.
3.  ✅ **Impossible Combos**: REFUTED. The generator correctly handles equipment constraints (0 errors).

## 3. Actionable Tuning Steps (For v1.6 or v2.0)
To improve the "Smart" feel of the generator:

### A. Dilute the Core & Cardio Pools
*   **Action**: Add at least 5-10 more exercises to both Core and Cardio categories.
*   **Target**: Bring utilization rate down to ~100 hits/ex (matching Squat/Push).

### B. Balance Push/Pull
*   **Action**: Investigate why Push is selected 50% more often.
*   **Hypothesis**: "Gymnastics" and "Strength" focus might both heavily weight Push, whereas Pull is only heavily weighted in "Gymnastics".
*   **Fix**: Add "Pull" to the "Strength" focus target patterns or increase the probability of Pull in the random selector.

### C. Chipper Composition
*   **Observation**: Chippers logic is currently sound, but tags show heavy Shoulder/Knee bias.
*   **Action**: Ensure Chippers rotate muscle groups more strictly to avoid local fatigue overload (e.g., don't do 50 Push-ups then 50 HSPU).

## 4. Conclusion
The testing infrastructure has provided clear, actionable data. The immediate priority for the next content update is expanding the **Core** and **Cardio** sections of the database and adjusting the **Push/Pull** logic balance.