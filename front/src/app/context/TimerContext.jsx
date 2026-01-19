"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

const TimerContext = createContext(null);

export function TimerProvider({ children }) {
    const [seconds, setSeconds] = useState(undefined);
    const [isFinished, setIsFinished] = useState(false);

    const endingAtRef = useRef(null);
    const intervalRef = useRef(null);

    const stop = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const triggerGameOver = useCallback(() => {
        stop();
        setSeconds(0);
        setIsFinished(true);
    }, [stop]);

    const startFromEndingAt = useCallback(
        (endingAtMs) => {
            const parsed = Number(endingAtMs);

            if (!parsed || Number.isNaN(parsed)) {
                console.error("TimerContext: endingAtMs invalide:", endingAtMs);
                setSeconds(0);
                return;
            }

            endingAtRef.current = parsed;
            setIsFinished(false);

            const compute = () => {
                const end = endingAtRef.current;
                if (!end) return;

                const diffSec = Math.ceil((end - Date.now()) / 1000);
                const safe = Math.max(0, diffSec);

                setSeconds(safe);

                // Détection de la fin du timer
                if (safe <= 0) {
                    stop();
                    setIsFinished(true);
                }
            };

            stop();
            compute();
            intervalRef.current = setInterval(compute, 1000);
        },
        [stop]
    );

    useEffect(() => {
        return () => stop();
    }, [stop]);

    return (
        <TimerContext.Provider value={{ seconds, startFromEndingAt, stop, isFinished, triggerGameOver }}>
            {children}
        </TimerContext.Provider>
    );
}

export function useTimer() {
    const ctx = useContext(TimerContext);
    if (!ctx) throw new Error("useTimer must be used within TimerProvider");
    return ctx;
}