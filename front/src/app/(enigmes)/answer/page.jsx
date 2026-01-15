"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { RiLockUnlockLine, RiArrowLeftLine, RiShieldKeyholeLine } from 'react-icons/ri';
import { validateGameStep } from "@/hooks/API/gameRequests";
import clsx from "clsx";

export default function AnswerPage() {
    const router = useRouter();
    const [code, setCode] = useState("");
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [isShaking, setIsShaking] = useState(false);
    const [gameCode, setGameCode] = useState(null);
    const pusherRef = useRef(null);

    // Mapping des codes vers les apps
    const codes = {
        'FOYER': 'scan',
        'BETA5678': 'phone',
        'GAMMA9012': 'puzzle',
        'OMEGA7890': 'boussole',
        'DELTA3456': 'terminal',
    };

    // ✅ 1) Récupération du code de partie
    useEffect(() => {
        const code = localStorage.getItem('currentGameCode');
        setGameCode(code);
    }, []);

    // ✅ 2) ÉCOUTE PUSHER pour synchroniser les apps débloquées
    useEffect(() => {
        if (!gameCode || pusherRef.current) return;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
            cluster: "eu",
            forceTLS: true,
        });

        pusherRef.current = pusher;
        const channel = pusher.subscribe(`game.${gameCode}`);

        // 🔥 Écoute du déblocage d'app
        channel.bind('AppUnlocked', (data) => {
            console.log("🔓 CONSOLE - Nouvelle app débloquée:", data.appId);

            // Met à jour le localStorage pour tous les joueurs
            const unlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');
            if (!unlocked.includes(data.appId)) {
                unlocked.push(data.appId);
                localStorage.setItem('unlockedApps', JSON.stringify(unlocked));
                console.log("✅ Apps débloquées:", unlocked);
            }
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe(`game.${gameCode}`);
            pusher.disconnect();
            pusherRef.current = null;
        };
    }, [gameCode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const input = code.toUpperCase().trim();
        const appId = codes[input];

        if (appId) {
            try {
                console.log("📡 CONSOLE - Envoi de la validation pour:", appId);

                // ✅ Appel API : le backend enverra l'événement Pusher à TOUT LE GROUPE
                if (gameCode) {
                    await validateGameStep(gameCode);
                }

                setStatus({ type: 'success', msg: "DÉCRYPTAGE RÉUSSI" });

                // ✅ Note : On ne modifie PAS le localStorage ici
                // C'est Pusher qui le fera pour tout le monde

                setTimeout(() => router.push('/'), 1500);

            } catch (err) {
                console.error("❌ Erreur lors de la validation:", err);

                // En cas d'erreur réseau, on informe l'utilisateur
                setStatus({ type: 'error', msg: "ERREUR DE CONNEXION" });
                triggerShake();
            }
        } else {
            setStatus({ type: 'error', msg: "CODE D'ACCÈS INVALIDE" });
            triggerShake();
        }
        setCode("");
    };

    const triggerShake = () => {
        setIsShaking(true);
        if (navigator.vibrate) navigator.vibrate(200);
        setTimeout(() => setIsShaking(false), 500);
    };

    return (
        <main className="min-h-[100dvh] bg-[var(--color-dark)] flex flex-col items-center justify-center p-6 font-mono">
            <button
                onClick={() => router.push('/')}
                className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-[var(--color-lavender)] hover:border-[var(--color-lavender)]/30 transition-all text-xs tracking-widest group"
            >
                <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" />
                RETOUR
            </button>

            <div className={clsx("max-w-md w-full transition-all duration-300", isShaking && "animate-shake")}>
                <div className="bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl ring-1 ring-white/5 relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 size-48 bg-[var(--color-lavender)]/10 blur-3xl rounded-full" />
                    <div className="relative z-10 text-center">
                        <div className="inline-flex p-4 rounded-2xl bg-[var(--color-lavender)]/10 border border-[var(--color-lavender)]/20 mb-6">
                            <RiShieldKeyholeLine className="text-4xl text-[var(--color-lavender)]" />
                        </div>
                        <h1 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">
                            CONSOLE DE <span className="text-[var(--color-lavender)]">DÉBOGAGE</span>
                        </h1>
                        <p className="text-[12px] uppercase mb-8">Saisissez un code pour débloquer une nouvelle application</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-[var(--color-lavender)] text-center uppercase tracking-[0.4em] focus:outline-none focus:border-[var(--color-lavender)]/50 focus:bg-white/10 transition-all placeholder:text-white/10"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="mx-auto flex items-center justify-center gap-3 bg-[var(--color-lavender)] hover:bg-[var(--color-lavender)]/90 text-black font-black px-8 py-3 rounded-full transition-all active:scale-95 shadow-lg shadow-[var(--color-lavender)]/10"
                            >
                                <span className="text-xs tracking-widest uppercase">Valider</span>
                                <RiLockUnlockLine className="text-sm" />
                            </button>
                        </form>
                        <div className="h-12 mt-6 flex items-center justify-center">
                            {status.msg && (
                                <div className={clsx(
                                    "text-[10px] font-bold py-2 px-4 rounded-full border animate-in fade-in zoom-in duration-300",
                                    status.type === 'success' ? "bg-[var(--color-light-green)]/10 border-[var(--color-light-green)]/30 text-[var(--color-light-green)] shadow-[0_0_15px_rgba(0,255,100,0.1)]" : "bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_15px_rgba(255,0,0,0.1)]"
                                )}>
                                    {status.msg}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-8px); }
                    50% { transform: translateX(8px); }
                    75% { transform: translateX(-8px); }
                }
                .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
            `}</style>
        </main>
    );
}