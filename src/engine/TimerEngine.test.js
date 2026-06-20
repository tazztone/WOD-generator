import { describe, it, expect } from 'vitest';
import { TimerEngine } from './TimerEngine';

describe('TimerEngine Unit Tests', () => {
    const defaultSettings = { countdowns: true, announcements: true, beeps: true };

    describe('Countdown and Start phase', () => {
        it('should initialize to pre status and decrement countdown', () => {
            const workout = { id: 'test-1', template: 'AMRAP', timeCap: 10, exercises: [] };
            const engine = new TimerEngine({ workout, audioSettings: defaultSettings });
            
            expect(engine.state.status).toBe('pre');
            expect(engine.state.timeLeft).toBe(10);

            // Mock a tick that has passed 1 second
            const now = Date.now();
            engine.lastTickTime = now - 1000;
            const { state, events } = engine.tick(now);

            expect(state.status).toBe('pre');
            expect(state.timeLeft).toBe(9);
            expect(events).toEqual([]);
        });

        it('should trigger count down and haptic on last seconds of countdown', () => {
            const workout = { id: 'test-1', template: 'AMRAP', timeCap: 10, exercises: [] };
            const engine = new TimerEngine({ workout, audioSettings: defaultSettings });
            
            // Advance countdown to 3 seconds remaining
            engine.state.timeLeft = 3;

            const now = Date.now();
            engine.lastTickTime = now - 1000;
            const { state, events } = engine.tick(now);

            expect(state.timeLeft).toBe(2);
            expect(events).toContainEqual({ type: 'SOUND_COUNTDOWN' });
            expect(events).toContainEqual({ type: 'HAPTIC_LIGHT' });
        });

        it('should transition to work phase and generate correct events at 0', () => {
            const workout = { id: 'test-1', template: 'AMRAP', timeCap: 10, exercises: [] };
            const engine = new TimerEngine({ workout, audioSettings: defaultSettings });
            
            engine.state.timeLeft = 0;

            const now = Date.now();
            engine.lastTickTime = now - 1000;
            const { state, events } = engine.tick(now);

            expect(state.status).toBe('work');
            expect(state.timeLeft).toBe(600); // 10 minutes * 60 seconds
            expect(events).toContainEqual({ type: 'SOUND_START' });
            expect(events).toContainEqual({ type: 'HAPTIC_START' });
            expect(events).toContainEqual({ type: 'SPEAK_MOVEMENTS' });
        });
    });

    describe('EMOM workout logic', () => {
        it('should run correct EMOM rounds, half-way count, and 10s warnings', () => {
            const workout = { id: 'emom-1', template: 'EMOM', rounds: 5, timeCap: 5, exercises: [] };
            const engine = new TimerEngine({ workout, audioSettings: defaultSettings });

            // Jump straight to work phase, round 1, with 31 seconds remaining
            engine.state.status = 'work';
            engine.state.timeLeft = 31;
            engine.state.currentRound = 1;

            const now = Date.now();
            engine.lastTickTime = now - 1000;
            let res = engine.tick(now);

            // at 31, halfway sound triggers and timeLeft is decremented to 30
            expect(res.state.timeLeft).toBe(30);
            expect(res.events).toContainEqual({ type: 'SOUND_HALFWAY' });

            // Advance to 11 seconds remaining
            engine.state.timeLeft = 11;
            engine.lastTickTime = now - 1000;
            res = engine.tick(now);

            // at 11, warning speech triggers and timeLeft becomes 10
            expect(res.state.timeLeft).toBe(10);
            expect(res.events).toContainEqual({ type: 'SPEAK_10_SECONDS' });

            // Advance to 2 seconds remaining
            engine.state.timeLeft = 2;
            engine.lastTickTime = now - 1000;
            res = engine.tick(now);

            // countdown sounds
            expect(res.state.timeLeft).toBe(1);
            expect(res.events).toContainEqual({ type: 'SOUND_COUNTDOWN' });

            // Next tick, round advances
            engine.lastTickTime = now - 1000;
            res = engine.tick(now);
            expect(res.state.currentRound).toBe(2);
            expect(res.state.timeLeft).toBe(60);
            expect(res.events).toContainEqual({ type: 'SOUND_ROUND' });
        });
    });

    describe('Tabata workout logic', () => {
        it('should cycle work and rest phases correctly', () => {
            const workout = { id: 'tab-1', template: 'Tabata', rounds: 8, exercises: [] };
            const engine = new TimerEngine({ workout, audioSettings: defaultSettings });

            engine.state.status = 'work';
            engine.state.timeLeft = 1;
            engine.state.currentRound = 1;

            const now = Date.now();
            engine.lastTickTime = now - 1000;
            let res = engine.tick(now);

            // Transitions from work to rest
            expect(res.state.status).toBe('rest');
            expect(res.state.timeLeft).toBe(10);
            expect(res.events).toContainEqual({ type: 'SOUND_ROUND' });

            // Transitions from rest back to work
            engine.state.timeLeft = 1;
            engine.lastTickTime = now - 1000;
            res = engine.tick(now);
            expect(res.state.status).toBe('work');
            expect(res.state.timeLeft).toBe(20);
            expect(res.state.currentRound).toBe(2);
            expect(res.events).toContainEqual({ type: 'SOUND_START' });
        });
    });

    describe('Recovery and fast-forward calculations', () => {
        it('should support multi-second catch-ups when delta is large, without audio storms', () => {
            const workout = { id: 'test-1', template: 'AMRAP', timeCap: 10, exercises: [] };
            const engine = new TimerEngine({ workout, audioSettings: defaultSettings });

            // Initialize at 10s countdown
            engine.state.timeLeft = 10;

            const now = Date.now();
            // Simulate 12 seconds passing at once (as if backgrounded)
            // 10s countdown (ticks 10 to 0) + 1s transition to work + 1s of work = 12 ticks
            engine.lastTickTime = now - 12000;
            const { state, events } = engine.tick(now);

            expect(state.status).toBe('work');
            expect(state.timeLeft).toBe(599); // 600 - 1
            expect(state.totalTime).toBe(1);

            // Catch-up should suppress audio start/countdown calls
            const audioStartCalls = events.filter(e => e.type === 'SOUND_START');
            const countdownCalls = events.filter(e => e.type === 'SOUND_COUNTDOWN');
            expect(audioStartCalls.length).toBe(0);
            expect(countdownCalls.length).toBe(0);
        });
    });
});
