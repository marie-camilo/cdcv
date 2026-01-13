"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPlayerRole } from "@/hooks/API/gameRequests";
import SectionTitle from "@/components/molecules/SectionTitle";
import { checkGameState, getCodeFromCookie } from "@/hooks/API/rules";
import ImpostorBanner from "@/components/molecules/Lobby/ImpostorBanner";
import {ROLE_DESCRIPTIONS} from "@/lib/gameData";

const DISPLAY_DURATION = 30_000; // temporaire

export default function RolePage() {
    const router = useRouter();

    const [role, setRole] = useState(null);
    const [isImpostor, setIsImpostor] = useState(false);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        let interval;
        let timeout;

        const init = async () => {
            const gameData = await getCodeFromCookie().catch(() => null);
            if (!gameData?.game?.code) {
                router.replace("/");
                return;
            }

            const gameState = await checkGameState(gameData.game.code);
            if (gameState.status !== "started") {
                router.replace("/");
                return;
            }

            const data = await getPlayerRole();

            // Validation défensive (JS only)
            if (typeof data.role !== "string" || typeof data.impostor !== "boolean") {
                throw new Error("INVALID_ROLE_PAYLOAD");
            }

            setRole(data.role);
            setIsImpostor(data.impostor);

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

    const roleData = ROLE_DESCRIPTIONS[role];

    if (!roleData) {
        throw new Error(`UNKNOWN_ROLE: ${role}`);
    }

    const { mission, equipement, info } = roleData;

    return (
        <main className="min-h-screen px-8 py-10 text-white">
            {/* Header */}
            <header className="pb-6">
                <SectionTitle
                    variant="lobby"
                    title="Ton rôle"
                    subtitle="Voici les instructions associées à ton rôle"
                />
            </header>

            <section className="flex flex-col items-center justify-center mt-5 space-y-6">

                {/* Bannière imposteur */}
                {isImpostor && (
                    <ImpostorBanner
                        label="Imposteur"
                        text1="Tu es un imposteur infiltré dans l’équipe."
                        text2="Tu auras l'occasion de saboter les efforts de l’équipe adverse."
                        ps="PS : Tu n'es pas seul..."
                    />
                )}

                <div className="w-full max-w-md relative rounded-2xl border border-white/30 p-8 pt-12">
                    {/* Role label */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[var(--color-dark)] px-6">
                        <span className="text-3xl font-bold uppercase tracking-widest italic text-[var(--color-light-green)]">
                            {role}
                        </span>
                    </div>

                    {/* Mission */}
                    <div className="space-y-6 text-md font-light leading-relaxed">
                        <p>{mission}</p>
                    </div>

                    {/* Outils */}
                    <div className="space-y-4 text-md font-light leading-relaxed mt-6">
                        <h4 className="font-semibold">
                            Tes outils : <span className="italic">{equipement}</span>
                        </h4>
                        <p>{info}</p>
                    </div>

                    <p className="mt-8 italic text-[var(--color-light-green)]">
                        Bonne mission.
                    </p>

                    {/* Progress bar */}
                    <div className="mt-10 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--color-light-green)] transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
