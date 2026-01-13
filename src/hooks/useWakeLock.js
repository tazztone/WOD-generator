import { useEffect, useState } from 'react';

export const useWakeLock = () => {
    const [wakelock, setWakelock] = useState(null);

    useEffect(() => {
        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator) {
                    const lock = await navigator.wakeLock.request('screen');
                    setWakelock(lock);
                }
            } catch (err) { console.log('WakeLock error', err); }
        };
        requestWakeLock();
        return () => wakelock && wakelock.release();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return wakelock;
};
