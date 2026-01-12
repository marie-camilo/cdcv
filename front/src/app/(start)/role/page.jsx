"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPlayerRole } from "@/hooks/API/gameRequests";
import SectionTitle from "@/components/molecules/SectionTitle";
import {checkGameState, getCodeFromCookie} from "@/hooks/API/rules";

const DISPLAY_DURATION = 10_000; // 10 secondes

export default function RolePage() {
    const router = useRouter();

    const [role, setRole] = useState(null);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        let interval;
        let timeout;

        const init = async () => {
            const gameData = await getCodeFromCookie().catch(() => null);
            const gameState = await checkGameState(gameData.game.code);

            if (gameState.status !== "waiting") {
                router.replace("/");
                return;
            }

            const data = await getPlayerRole();
            setRole(data.role);

            const start = Date.now();

            interval = setInterval(() => {
                const elapsed = Date.now() - start;
                const remaining = Math.max(0, DISPLAY_DURATION - elapsed);
                setProgress((remaining / DISPLAY_DURATION) * 100);
            }, 100);

            timeout = setTimeout(() => {
                router.replace("/enigme-1");
            }, DISPLAY_DURATION);
        };

        init();

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [router]);

    if (!role) return null;

    const isImpostor = role === "impostor";

    return (
        <main className="h-screen max-h-screen overflow-hidden flex flex-col px-8 text-white">
            {/* Header */}
            <header className="pt-10 pb-6">
                <SectionTitle
                    variant="lobby"
                    title="Ton rôle"
                    subtitle="Voici les instructions associées à ton rôle"
                />
            </header>

            {/* Centre vertical */}
            <section className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-md relative rounded-2xl border border-white/30 p-8 pt-12">
                    {/* Role label */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[var(--color-dark)] px-6">
                        <span
                            className={`text-3xl font-bold uppercase tracking-widest italic ${
                                isImpostor
                                    ? "text-red-400"
                                    : "text-[var(--color-light-green)]"
                            }`}
                        >
                            {role}
                        </span>
                    </div>

                    {/* Role description */}
                    <div className="space-y-6 text-lg font-light leading-relaxed">
                        {isImpostor ? (
                            <>
                                <p>Tu es un imposteur infiltré dans l’équipe.</p>
                                <p>Oriente discrètement les décisions sans éveiller les soupçons.</p>
                                <p>Ton objectif est de mener l’équipe à l’échec.</p>
                            </>
                        ) : (
                            <>
                                <p>Tu fais partie de l’équipage.</p>
                                <p>Analyse les indices, coopère et reste attentif aux comportements suspects.</p>
                                <p>Ton objectif est de résoudre l’énigme sans te faire manipuler.</p>
                            </>
                        )}
                    </div>

                    <p className="mt-8 italic text-[var(--color-light-green)]">
                        Bonne mission.
                    </p>

                    {/* Progress bar */}
                    <div className="mt-10 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--color-light-green)] transition-all"
                            style={{width: `${progress}%`}}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
