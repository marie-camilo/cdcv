"use client";

import { useEffect } from "react";
import { useTimer } from "@/app/context/TimerContext";
import { getTimeRemaining } from "@/hooks/API/gameRequests";
import { getCodeFromCookie } from "@/hooks/API/rules";

export default function TimerDisplay({ variant = "green", className = "" }) {
    const { seconds, startTimer } = useTimer();

    useEffect(() => {
        const init = async () => {
            const gameCode = await getCodeFromCookie();
            const res = await getTimeRemaining(gameCode.game.code);

            // res doit être { remaining_seconds: number }
            startTimer(res.remaining_seconds);
        };

        init();
    }, [startTimer]);

    if (seconds === undefined) return null;

    const formatTime = (totalSeconds) => {
        const t = Math.max(0, Math.floor(Number(totalSeconds) || 0)); // ✅ entier

        const h = Math.floor(t / 3600);
        const m = Math.floor((t % 3600) / 60);
        const s = t % 60;

        return `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const colorClass =
        variant === "red"
            ? "text-[var(--color-classic-red)]"
            : "text-[var(--color-light-green)]";

    return (
        <span className={`${colorClass} font-mono font-bold tracking-widest ${className}`}>
      {formatTime(seconds)}
    </span>
    );
}
