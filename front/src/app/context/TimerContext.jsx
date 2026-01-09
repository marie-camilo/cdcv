"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const DURATION = 60 * 60;
    const [seconds, setSeconds] = useState(DURATION);

    useEffect(() => {
        let endTime = localStorage.getItem("timer_end_time");

        if (!endTime) {
            endTime = Date.now() + DURATION * 1000;
            localStorage.setItem("timer_end_time", endTime);
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const remaining = Math.round((endTime - now) / 1000);

            if (remaining <= 0) {
                setSeconds(0);
                clearInterval(interval);
            } else {
                setSeconds(remaining);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const simulateEnd = () => {
        const newEnd = Date.now() - 1000;
        localStorage.setItem("timer_end_time", newEnd);
        setSeconds(0);
    };

    return (
        <TimerContext.Provider value={{ seconds, simulateEnd }}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => useContext(TimerContext);