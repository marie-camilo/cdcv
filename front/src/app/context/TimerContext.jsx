"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const TimerContext = createContext();

export function TimerProvider({ children }) {
    const [seconds, setSeconds] = useState(undefined);
    const intervalRef = useRef(null);

    const startTimer = (initialSeconds) => {
        clearInterval(intervalRef.current);
        setSeconds(initialSeconds);

        intervalRef.current = setInterval(() => {
            setSeconds((prev) => {
                if (prev === undefined) return prev;
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <TimerContext.Provider value={{ seconds, startTimer }}>
            {children}
        </TimerContext.Provider>
    );
}

export const useTimer = () => useContext(TimerContext);
