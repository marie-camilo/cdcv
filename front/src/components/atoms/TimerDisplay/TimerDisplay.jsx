"use client";

import { useTimer } from "@/app/context/TimerContext";

export default function TimerDisplay({ variant = "green", className = "" }) {
    const { seconds } = useTimer();

    if (seconds === undefined) return null;

    const t = Math.max(0, Math.floor(Number(seconds) || 0));
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;

    const colorClass =
        variant === "red"
            ? "text-[var(--color-classic-red)]"
            : "text-[var(--color-light-green)]";

    return (
        <span className={`${colorClass} font-mono font-bold tracking-widest ${className}`}>
      {`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`}
    </span>
    );
}
