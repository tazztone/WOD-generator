import { useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useWorkout } from '../context/WorkoutContext';

export const useCapacitorBackButton = () => {
  const { modalOpen, setModalOpen } = useSettings();
  const { setAppState } = useWorkout();
  const modalOpenRef = useRef(false);

  useEffect(() => {
    modalOpenRef.current = modalOpen;
  }, [modalOpen]);

  const backButtonLastPressRef = useRef(0);

  // Capacitor Back Button Logic
  useEffect(() => {
    let backButtonListener = null;

    const setupBackButton = async () => {
      try {
        const { App } = await import('@capacitor/app');
        const { Toast } = await import('@capacitor/toast');

        backButtonListener = await App.addListener('backButton', () => {
          if (modalOpenRef.current) {
            setModalOpen(false);
            return;
          }

          setAppState((current) => {
            switch (current) {
              case 'preview':
                return 'config';
              case 'active': {
                setModalOpen(true);
                return current;
              }
              case 'history':
                return 'config';
              case 'calculator':
                return 'config';
              case 'config':
              default: {
                const now = Date.now();
                if (now - backButtonLastPressRef.current < 2000) {
                  App.exitApp();
                } else {
                  backButtonLastPressRef.current = now;
                  Toast.show({ text: 'Tap back again to exit', duration: 'short' });
                }
                return current;
              }
            }
          });
        });
      } catch {
        // Not running in Capacitor
      }
    };

    setupBackButton();

    return () => {
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, [setAppState, setModalOpen]);
};
