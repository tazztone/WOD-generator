# WOD Gen Ultimate Domain Model

This document outlines the core domain concepts and glossary for the WOD Gen Ultimate Progressive Web App (PWA).

## Glossary

### Workout of the Day (WOD)
A generated functional fitness workout tailored to user equipment constraints, difficulty levels, and injury filters.

### Workout Template Types
- **AMRAP**: As Many Rounds As Possible. Time is fixed; work is variable.
- **RFT**: Rounds For Time. Work (number of rounds) is fixed; time is variable.
- **EMOM**: Every Minute on the Minute. A new round or specific work starts at the beginning of each minute.
- **Chipper**: A workout consisting of a single round of high-rep movements done in sequence.
- **Tabata**: High-intensity interval training consisting of 8 rounds of 20 seconds of work followed by 10 seconds of rest.
- **Ladder**: A format where repetitions increase or decrease sequentially with each round.
- **Death By**: An EMOM format where reps of an exercise increase by 1 every minute until the athlete can no longer complete the required reps in the minute.

### Difficulty Scale
- **Rx**: Prescribed standard (expert difficulty).
- **Scaled**: Modified standard (intermediate difficulty).
- **Beginner**: Simplified movements and lighter loads. May include exercise substitutions for high-skill elements.

### Timer Engine
The framework-free timing engine that manages phase transitions (pre-countdown, work interval, rest interval, finished) and fast-forward calculations for offline metcon execution.

### Scaling Engine
The module responsible for translating base exercise rep counts and distances, applying difficulty multipliers, and resolving substitutions.

### Generation Pipeline
The pipeline of filter rules (static and dynamic) applied to the base exercise pool to construct a balanced and valid workout.
