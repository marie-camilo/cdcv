// hooks/useGameEvents.js
import { useEffect, useState, useCallback } from 'react';
import { gameEvents, GAME_EVENTS } from '@/lib/gameEventBus';

// Hook pour les apps débloquées
export function useUnlockedApps() {
    const [unlockedApps, setUnlockedApps] = useState([]);

    // Chargement initial
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('unlockedApps') || '[]');
        setUnlockedApps(stored);
    }, []);

    // Écoute des événements Pusher
    useEffect(() => {
        const unsubscribe = gameEvents.on(GAME_EVENTS.APP_UNLOCKED, (data) => {
            console.log("🔔 [EVENT] App unlocked reçu:", data);
            setUnlockedApps([...data.unlockedApps]);
        });

        return unsubscribe;
    }, []);

    return unlockedApps;
}

// Hook pour l'état de l'énigme 2
export function useEnigma2State() {
    const [codeDigits, setCodeDigits] = useState({
        motus: null, simon: null, zip: null, tuile: null
    });
    const [leftLocker, setLeftLocker] = useState('locked');
    const [rightLocker, setRightLocker] = useState('locked');
    const [leftCases, setLeftCases] = useState(Array(8).fill(null));
    const [rightCases, setRightCases] = useState(Array(8).fill(null));

    // Fonction de chargement depuis localStorage
    const loadFromStorage = useCallback(() => {
        setCodeDigits({
            motus: localStorage.getItem('motus_digit') ? parseInt(localStorage.getItem('motus_digit')) : null,
            simon: localStorage.getItem('simon_digit') ? parseInt(localStorage.getItem('simon_digit')) : null,
            zip: localStorage.getItem('zip_digit') ? parseInt(localStorage.getItem('zip_digit')) : null,
            tuile: localStorage.getItem('tuile_digit') ? parseInt(localStorage.getItem('tuile_digit')) : null,
        });

        if (localStorage.getItem('locker_left') === 'unlocked') setLeftLocker('unlocked');
        if (localStorage.getItem('locker_right') === 'unlocked') setRightLocker('unlocked');

        const newLeft = [];
        const newRight = [];
        for (let i = 0; i < 8; i++) {
            newLeft[i] = localStorage.getItem(`snake_left_${i}`);
            newRight[i] = localStorage.getItem(`snake_right_${i}`);
        }
        setLeftCases(newLeft);
        setRightCases(newRight);
    }, []);

    // Chargement initial
    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    // Écoute des événements
    useEffect(() => {
        const unsubs = [
            gameEvents.on(GAME_EVENTS.DIGIT_UPDATED, ({ side, value }) => {
                console.log("🔔 [EVENT] Digit updated:", side, value);
                const key = side.replace('_digit', '');
                setCodeDigits(prev => ({ ...prev, [key]: parseInt(value) }));
            }),

            gameEvents.on(GAME_EVENTS.LOCKER_UPDATED, ({ side, status }) => {
                console.log("🔔 [EVENT] Locker updated:", side, status);
                if (side === 'left') setLeftLocker(status);
                else setRightLocker(status);
            }),

            gameEvents.on(GAME_EVENTS.SNAKE_UPDATED, ({ side, index, status }) => {
                console.log("🔔 [EVENT] Snake updated:", side, index, status);
                if (side === 'left') {
                    setLeftCases(prev => {
                        const newArr = [...prev];
                        newArr[index] = status;
                        return newArr;
                    });
                } else {
                    setRightCases(prev => {
                        const newArr = [...prev];
                        newArr[index] = status;
                        return newArr;
                    });
                }
            }),
        ];

        return () => unsubs.forEach(unsub => unsub());
    }, []);

    return { codeDigits, leftLocker, rightLocker, leftCases, rightCases };
}