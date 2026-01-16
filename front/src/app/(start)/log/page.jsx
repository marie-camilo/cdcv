"use client";
import React, {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import {checkGameState, checkPlayerCookie, getCodeFromCookie} from "@/hooks/API/rules";

export default function JoinGamePage() {
    const router = useRouter();

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            if (cancelled) return;

            const gameCodeCookie = await getCodeFromCookie();
            const playerCookie = await checkPlayerCookie();

            const code = gameCodeCookie?.game?.code;
            const isAuthenticated = playerCookie?.authenticated;

            if (!code || cancelled) return;

            const gameState = await checkGameState(code);
            if (cancelled) return;

            if (gameState.status === "waiting") {
                router.replace(
                    isAuthenticated ? "/lobby" : `/start?code=${code}`
                );
            } else if (gameState.status === "started") {
                router.replace(
                    isAuthenticated ? "/" : "/log"
                );
            }
        };

        init();

        return () => {
            cancelled = true;
        };
    }, [router]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const state = await checkGameState(code);

            if (state.status !== "waiting") {
                setError("⛔ ACCÈS REFUSÉ : PARTIE INVALIDE OU DEJA DÉMARRÉE");
                setLoading(false);
                return;
            }
            router.replace("/start?code=" + code);

        } catch {
            setError("⛔ ERREUR : CODE INVALIDE OU PARTIE INEXISTANTE");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen min-h-[100dvh] flex flex-col md:max-w-md mx-auto text-white overflow-y-auto">
            <section className="flex flex-col flex-1">
                <article className="flex flex-col justify-center items-center flex-1 px-6 gap-6">

                    <form
                        onSubmit={handleSubmit}
                        className="w-full flex flex-col gap-4"
                    >
                        <label className="font-mono text-(--color-turquoise) text-xs">
                            &gt; CODE DE LA PARTIE
                        </label>

                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            className="bg-black border-2 border-(--color-turquoise) px-4 py-2 font-mono text-(--color-turquoise) outline-none tracking-widest text-center"
                            placeholder="XXXX-XXXX"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 bg-(--color-turquoise) text-black font-mono py-2 hover:bg-green-500 transition disabled:opacity-50"
                        >
                            {loading ? "VÉRIFICATION..." : "VALIDER LE CODE"}
                        </button>

                        {error && (
                            <p className="text-red-500 font-mono text-xs text-center">
                                {error}
                            </p>
                        )}
                    </form>

                    <p className="text-gray-500 text-[10px] font-mono text-center">
                        ⚠️ Accès restreint – autorisation requise
                    </p>
                </article>
            </section>
        </main>
    );
}
