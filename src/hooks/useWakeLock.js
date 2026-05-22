import { useEffect, useRef } from 'react';

export const useWakeLock = () => {
    const wakeLockRef = useRef(null);

    useEffect(() => {
        let isNative = false;

        const requestWakeLock = async () => {
            // 1. Try Capacitor Native Plugin first
            try {
                const { KeepAwake } = await import('@capacitor-community/keep-awake');
                await KeepAwake.keep();
                isNative = true;
                if (import.meta.env.DEV) {
                    console.log('WakeLock: Acquired via Capacitor KeepAwake');
                }
            } catch {
                // Not running in Capacitor or plugin not found
            }

            // 2. Fallback to Web API if not native
            if (!isNative && 'wakeLock' in navigator) {
                try {
                    wakeLockRef.current = await navigator.wakeLock.request('screen');
                    if (import.meta.env.DEV) {
                        console.log('WakeLock: Acquired via Web API');
                    }
                } catch (err) {
                    if (import.meta.env.DEV) {
                        console.log('WakeLock error:', err);
                    }
                }
            }
        };

        const releaseWakeLock = async () => {
            if (isNative) {
                try {
                    const { KeepAwake } = await import('@capacitor-community/keep-awake');
                    await KeepAwake.allowSleep();
                } catch { /* ignore */ }
            } else if (wakeLockRef.current) {
                try {
                    await wakeLockRef.current.release();
                    wakeLockRef.current = null;
                } catch { /* ignore */ }
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                requestWakeLock();
            } else {
                // Optional: Force release on hide, or rely on browser/native behavior
                // Usually better to re-request on show to be safe
            }
        };

        requestWakeLock();
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            releaseWakeLock();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
};
