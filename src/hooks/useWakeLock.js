import { useEffect, useRef } from 'react';

// TODO: Re-acquire wake lock when page becomes visible again (visibilitychange event)
// TODO: Add user-facing indicator when wake lock is active
export const useWakeLock = () => {
    const wakeLockRef = useRef(null);

    useEffect(() => {
        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator) {
                    wakeLockRef.current = await navigator.wakeLock.request('screen');
                }
            } catch (err) { console.log('WakeLock error', err); }
        };
        requestWakeLock();
        return () => wakeLockRef.current && wakeLockRef.current.release();
    }, []);

    return wakeLockRef.current;
};
