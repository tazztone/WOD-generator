// src/engine/TimerEngine.js

export class TimerEngine {
  constructor({ workout, audioSettings, initialState = null }) {
    this.workout = workout;
    this.audioSettings = audioSettings || { countdowns: true, announcements: true, beeps: true };

    this.state = initialState
      ? { ...initialState }
      : {
          status: 'pre', // pre, work, rest, finished
          timeLeft: 10,
          totalTime: 0,
          currentRound: 1,
          roundTime: 0,
          isPaused: false,
        };
    this.lastTickTime = Date.now();
  }

  static restore(savedState, workout, audioSettings) {
    const engine = new TimerEngine({ workout, audioSettings });
    engine.state = {
      status: savedState.status || 'pre',
      timeLeft: typeof savedState.timeLeft === 'number' ? savedState.timeLeft : 10,
      totalTime: savedState.totalTime || 0,
      currentRound: savedState.currentRound || 1,
      roundTime: savedState.roundTime || 0,
      isPaused: typeof savedState.isPaused === 'boolean' ? savedState.isPaused : false,
    };
    return engine;
  }

  setPaused(isPaused) {
    this.state.isPaused = isPaused;
    if (!isPaused) {
      this.lastTickTime = Date.now();
    }
  }

  tick(now = Date.now()) {
    const events = [];

    if (this.state.isPaused || this.state.status === 'finished') {
      this.lastTickTime = now;
      return { state: { ...this.state }, events };
    }

    const deltaMs = now - this.lastTickTime;
    if (deltaMs >= 1000) {
      const secondsPassed = Math.floor(deltaMs / 1000);
      this.lastTickTime += secondsPassed * 1000;

      const maxPassed = this.workout.timeCap ? this.workout.timeCap * 60 : 3600;
      let passed = Math.min(secondsPassed, maxPassed);

      while (passed > 0 && this.state.status !== 'finished' && !this.state.isPaused) {
        const isCatchup = passed > 1;
        this._processOneSecond(isCatchup, events);
        passed--;
      }
    }

    return { state: { ...this.state }, events };
  }

  _processOneSecond(isCatchup, events) {
    const state = this.state;
    const workout = this.workout;
    const { countdowns, announcements, beeps } = this.audioSettings;

    if (state.status === 'pre') {
      if (state.timeLeft <= 3 && state.timeLeft > 0 && countdowns && !isCatchup) {
        events.push({ type: 'SOUND_COUNTDOWN' });
        events.push({ type: 'HAPTIC_LIGHT' });
      }

      if (state.timeLeft <= 0) {
        if (beeps && !isCatchup) {
          events.push({ type: 'SOUND_START' });
          events.push({ type: 'HAPTIC_START' });
        }
        state.status = 'work';
        state.timeLeft =
          workout.template === 'Tabata'
            ? 20
            : workout.template === 'EMOM'
              ? 60
              : workout.timeCap * 60;
        if (!isCatchup) {
          events.push({ type: 'SPEAK_MOVEMENTS' });
        }
      } else {
        state.timeLeft -= 1;
      }
    } else {
      // Main Timer Logic
      state.totalTime += 1;
      state.roundTime += 1;

      const isEMOM = workout.template === 'EMOM';
      const isTabata = workout.template === 'Tabata';

      if (isEMOM) {
        if (state.timeLeft === 31 && beeps && !isCatchup) {
          events.push({ type: 'SOUND_HALFWAY' });
        }
        if (state.timeLeft === 11 && announcements && !isCatchup) {
          events.push({ type: 'SPEAK_10_SECONDS' });
        }
        if (state.timeLeft <= 4 && state.timeLeft > 1 && countdowns && !isCatchup) {
          events.push({ type: 'SOUND_COUNTDOWN' });
          events.push({ type: 'HAPTIC_LIGHT' });
        }
        if (state.timeLeft <= 1) {
          if (beeps && !isCatchup) {
            events.push({ type: 'SOUND_ROUND' });
            events.push({ type: 'HAPTIC_MEDIUM' });
          }
          if (state.currentRound >= workout.rounds) {
            state.status = 'finished';
            if (!isCatchup) {
              events.push({ type: 'SOUND_END' });
              events.push({ type: 'HAPTIC_END' });
            }
          } else {
            state.currentRound += 1;
            state.timeLeft = 60;
            state.roundTime = 0;
          }
        } else {
          state.timeLeft -= 1;
        }
      } else if (isTabata) {
        if (state.timeLeft <= 4 && state.timeLeft > 1 && countdowns && !isCatchup) {
          events.push({ type: 'SOUND_COUNTDOWN' });
          events.push({ type: 'HAPTIC_LIGHT' });
        }
        if (state.timeLeft <= 1) {
          if (state.status === 'work') {
            state.status = 'rest';
            state.timeLeft = 10;
            if (beeps && !isCatchup) {
              events.push({ type: 'SOUND_ROUND' });
              events.push({ type: 'HAPTIC_MEDIUM' });
            }
          } else {
            if (state.currentRound >= workout.rounds) {
              state.status = 'finished';
              if (!isCatchup) {
                events.push({ type: 'SOUND_END' });
                events.push({ type: 'HAPTIC_END' });
              }
            } else {
              state.status = 'work';
              state.timeLeft = 20;
              state.currentRound += 1;
              if (beeps && !isCatchup) {
                events.push({ type: 'SOUND_START' });
                events.push({ type: 'HAPTIC_START' });
              }
            }
          }
        } else {
          state.timeLeft -= 1;
        }
      } else {
        // AMRAP, RFT, Chipper, etc.
        const totalDuration = workout.timeCap * 60;
        if (state.timeLeft === Math.floor(totalDuration / 2) + 1 && beeps && !isCatchup) {
          events.push({ type: 'SOUND_HALFWAY' });
        }
        if (state.timeLeft === 61 && announcements && !isCatchup) {
          events.push({ type: 'SPEAK_ONE_MINUTE' });
        }
        if (state.timeLeft <= 4 && state.timeLeft > 1 && countdowns && !isCatchup) {
          events.push({ type: 'SOUND_COUNTDOWN' });
          events.push({ type: 'HAPTIC_LIGHT' });
        }
        if (state.timeLeft <= 1) {
          state.status = 'finished';
          if (!isCatchup) {
            events.push({ type: 'SOUND_END' });
            events.push({ type: 'HAPTIC_END' });
          }
        } else {
          state.timeLeft -= 1;
        }
      }
    }
  }
}
