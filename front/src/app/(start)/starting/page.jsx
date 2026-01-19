"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCodeFromCookie } from "@/hooks/API/rules";

const COUNTDOWN_DURATION = 11; // 11 secondes

export default function StartingPage() {
    const router = useRouter();
    const [remaining, setRemaining] = useState(COUNTDOWN_DURATION);
    const [loading, setLoading] = useState(true);

    /**
     * 1️⃣ Initialisation - Vérifier que la partie existe
     */
    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            try {
                const game = await getCodeFromCookie().catch(() => null);
                const gameCode = game?.game?.code;

                if (!gameCode) {
                    console.error("❌ [Starting] Aucun code de partie");
                    router.replace("/log");
                    return;
                }

                // Vérifier que ending_at existe (partie démarrée)
                const endingAt = localStorage.getItem("game_ending_at_ms");
                if (!endingAt) {
                    console.warn("⚠️ [Starting] Timer pas encore initialisé, attente...");
                    // La partie n'a peut-être pas encore été démarrée
                    // On peut attendre un peu ou rediriger
                }

                if (cancelled) return;

                console.log("✅ [Starting] Page chargée - Code:", gameCode);
                setLoading(false);

            } catch (err) {
                console.error("❌ [Starting] Erreur init:", err);
                if (!cancelled) {
                    router.replace("/log");
                }
            }
        };

        init();

        return () => {
            cancelled = true;
        };
    }, [router]);

    /**
     * 2️⃣ Compte à rebours simple (11 secondes)
     */
    useEffect(() => {
        if (loading) return;

        let count = COUNTDOWN_DURATION;
        setRemaining(count);

        const interval = setInterval(() => {
            count -= 1;

            if (count <= 0) {
                clearInterval(interval);
                router.replace("/role");
                return;
            }

            setRemaining(count);
        }, 1000);

        return () => clearInterval(interval);
    }, [loading, router]);

    /**
     * UI
     */
    if (loading) {
        return (
            <main className="h-screen flex items-center justify-center bg-[var(--color-dark)]">
                <div className="text-white text-xl animate-pulse">Chargement...</div>
            </main>
        );
    }

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
                <div className="absolute w-48 h-48 rounded-full bg-[var(--color-light-green)]/10 blur-2xl animate-pulse" />
                <span className="relative text-[6rem] font-extrabold text-[var(--color-light-green)] leading-none">
                    {remaining}
                </span>
            </div>

            <p className="text-white/50 text-xs font-mono mt-8">
                Redirection automatique vers votre rôle...
            </p>
        </main>
    );
}