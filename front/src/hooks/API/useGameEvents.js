// hooks/API/useGameEvents.js
import { useEffect, useState, useCallback } from 'react';
import { gameEvents, GAME_EVENTS } from '@/lib/gameEventBus';

export function useUnlockedApps() {
    const [unlockedApps, setUnlockedApps] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('unlockedApps') || '[]');
        console.log("📦 [useUnlockedApps] Chargement initial:", stored);
        setUnlockedApps(stored);
    }, []);

    useEffect(() => {
        console.log("👂 [useUnlockedApps] Installation du listener...");

        const unsubscribe = gameEvents.on(GAME_EVENTS.APP_UNLOCKED, (data) => {
            console.log("🔔 [useUnlockedApps] Event reçu:", data);
            setUnlockedApps([...data.unlockedApps]);
        });

        return () => {
            console.log("🧹 [useUnlockedApps] Nettoyage du listener");
            unsubscribe();
        };
    }, []);

    console.log("🔍 [useUnlockedApps] State actuel:", unlockedApps);
    return unlockedApps;
}

export function useEnigma2State() {
    const [codeDigits, setCodeDigits] = useState({
        motus: null,
        simon: null,
        zip: null,
        tuile: null
    });
    const [leftLocker, setLeftLocker] = useState('locked');
    const [rightLocker, setRightLocker] = useState('locked');
    const [leftCases, setLeftCases] = useState(Array(8).fill(null));
    const [rightCases, setRightCases] = useState(Array(8).fill(null));

    const loadFromStorage = useCallback(() => {
        console.log("📦 [useEnigma2State] Chargement depuis localStorage...");

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

    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    useEffect(() => {
        console.log("👂 [useEnigma2State] Installation des listeners...");

        const unsubs = [
            gameEvents.on(GAME_EVENTS.DIGIT_UPDATED, ({ side, value }) => {
                console.log("🔔 [useEnigma2State] Digit updated:", side, value);

                // ✅ METTRE À JOUR LOCALSTORAGE IMMÉDIATEMENT
                localStorage.setItem(side, value);

                const key = side.replace('_digit', '');
                setCodeDigits(prev => ({ ...prev, [key]: parseInt(value) }));
            }),

            gameEvents.on(GAME_EVENTS.LOCKER_UPDATED, ({ side, status }) => {
                console.log("🔔 [useEnigma2State] Locker updated:", side, status);

                // ✅ METTRE À JOUR LOCALSTORAGE IMMÉDIATEMENT
                localStorage.setItem(`locker_${side}`, status);

                if (side === 'left') setLeftLocker(status);
                else setRightLocker(status);
            }),

            gameEvents.on(GAME_EVENTS.SNAKE_UPDATED, ({ side, index, status }) => {
                console.log("🔔 [useEnigma2State] Snake updated:", side, index, status);

                // ✅ METTRE À JOUR LOCALSTORAGE IMMÉDIATEMENT
                localStorage.setItem(`snake_${side}_${index}`, status);

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

        return () => {
            console.log("🧹 [useEnigma2State] Nettoyage des listeners");
            unsubs.forEach(unsub => unsub());
        };
    }, []);

    return { codeDigits, leftLocker, rightLocker, leftCases, rightCases };
}