"use client";
import { useTimer } from "@/app/context/TimerContext";

export default function TimerDisplay({ variant = "green", className = "" }) {
    const { seconds } = useTimer();
    if (seconds === undefined) return null;

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        return `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const colorClass = variant === "red"
        ? "text-[var(--color-classic-red)]"
        : "text-[var(--color-light-green)]";

    return (
        <span className={`${colorClass} font-mono font-bold tracking-widest ${className}`}>
            {formatTime(seconds || 0)}
        </span>
    );
}