"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {checkGameState, getCodeFromCookie} from "@/hooks/API/rules";

const TOTAL_DURATION = 11000;

export default function StartingPage() {
    const router = useRouter();

    const [code, setCode] = useState(null);
    const [startAt, setStartAt] = useState(null);
    const [remaining, setRemaining] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * 1️⃣ Initialisation (cookie + localStorage)
     */
    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            try {
                const game = await getCodeFromCookie().catch(() => null);
                const storedTime = localStorage.getItem("currentGameStartingAt");

                const gameCode = game?.game?.code;

                if (!gameCode || !storedTime) {
                    router.replace("/log");
                    return;
                }

                if (cancelled) return;

                setCode(gameCode);
                setStartAt(Number(storedTime) * 1000);
            } catch {
                router.replace("/log");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        init();

        return () => {
            cancelled = true;
        };
    }, [router]);

    /**
     * 2️⃣ Timer
     */
    useEffect(() => {
        if (!code || !startAt) return;

        const update = () => {
            const diff = TOTAL_DURATION - (Date.now() - startAt);

            if (diff <= 0) {
                router.replace("/role");
                return;
            }

            setRemaining(Math.ceil(diff / 1000));
        };

        update();
        const interval = setInterval(update, 200);
        return () => clearInterval(interval);
    }, [code, startAt, router]);

    /**
     * UI states
     */
    if (loading || remaining === null) return null;

    return (
        <main className="h-screen flex flex-col items-center justify-center px-8 text-white bg-[var(--color-dark)] overflow-hidden min-h-[100dvh]">
            <div className="mb-16 text-center space-y-4">
                <h1 className="text-3xl font-bold tracking-wide">
                    La partie va commencer
                </h1>
                <p className="text-white/70 text-sm">
                    Soyez discrets, vos rôles vont être distribués
                </p>
            </div>

            <div className="relative flex items-center justify-center mb-20">
                <div className="absolute w-48 h-48 rounded-full bg-[var(--color-light-green)]/10 blur-2xl" />
                <span className="relative text-[6rem] font-extrabold text-[var(--color-light-green)] leading-none">
                    {remaining}
                </span>
            </div>
        </main>
    );
}
