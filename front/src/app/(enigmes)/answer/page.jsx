"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { RiLockUnlockLine, RiArrowLeftLine, RiShieldKeyholeLine } from 'react-icons/ri';
import { apiFetch } from "@/hooks/API/fetchAPI";
import { gameEvents, GAME_EVENTS } from '@/lib/gameEventBus';
import { getCodeInfo } from "@/lib/gameCodes"; // ✅ Import
import clsx from "clsx";

export default function AnswerPage() {
    const router = useRouter();
    const [code, setCode] = useState("");
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [isShaking, setIsShaking] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const inputCode = code.toUpperCase().trim();
        const gameCode = localStorage.getItem('currentGameCode');

        if (!gameCode) {
            setStatus({ type: 'error', msg: "AUCUNE PARTIE EN COURS" });
            triggerShake();
            setCode("");
            return;
        }

        // ✅ Récupérer les infos du code
        const codeInfo = getCodeInfo(inputCode);

        if (!codeInfo) {
            setStatus({ type: 'error', msg: "CODE D'ACCÈS INVALIDE" });
            triggerShake();
            setCode("");
            return;
        }

        const { appId, fileName, videoId } = codeInfo;

        // Vérifier si app déjà débloquée
        const unlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');
        if (unlocked.includes(appId)) {
            setStatus({ type: 'error', msg: "APPLICATION DÉJÀ ACTIVE" });
            triggerShake();
            setCode("");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1️⃣ Débloquer l'app
            await apiFetch(`/api/v1/game/${gameCode}/unlock-app`, {
                method: 'POST',
                body: JSON.stringify({
                    app_id: appId,
                    file_name: fileName
                })
            });

            // Mettre à jour localement
            unlocked.push(appId);
            localStorage.setItem('unlockedApps', JSON.stringify(unlocked));

            const currentCodes = JSON.parse(localStorage.getItem('game_codes') || '[]');
            if (!currentCodes.find(c => c.value === fileName)) {
                currentCodes.push({
                    label: `APP: ${appId.toUpperCase()}`,
                    value: fileName
                });
                localStorage.setItem('game_codes', JSON.stringify(currentCodes));
            }

            gameEvents.emit(GAME_EVENTS.APP_UNLOCKED, {
                appId: appId,
                fileName: fileName,
                unlockedApps: unlocked
            });

            // 2️⃣ Déclencher la vidéo SI présente
            if (videoId) {
                await apiFetch(`/api/v1/game/${gameCode}/trigger-video`, {
                    method: 'POST',
                    body: JSON.stringify({ video_id: videoId })
                });
                gameEvents.emit(GAME_EVENTS.VIDEO_TRIGGERED, { videoId: videoId });
                console.log("🎬 Vidéo déclenchée:", videoId);
            }

            setStatus({ type: 'success', msg: "DÉCRYPTAGE RÉUSSI" });
            setTimeout(() => router.push('/'), 1500);

        } catch (err) {
            console.error("❌ Erreur validation:", err);
            setStatus({ type: 'error', msg: "ERREUR DE CONNEXION" });
            triggerShake();
        } finally {
            setIsSubmitting(false);
            setCode("");
        }
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
                    <div className="relative z-10 text-center">
                        <div className="inline-flex p-4 rounded-2xl bg-[var(--color-lavender)]/10 border border-[var(--color-lavender)]/20 mb-6">
                            <RiShieldKeyholeLine className="text-4xl text-[var(--color-lavender)]" />
                        </div>
                        <h1 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">
                            CONSOLE DE <span className="text-[var(--color-lavender)]">DÉBOGAGE</span>
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-[var(--color-lavender)] text-center uppercase tracking-[0.4em] focus:outline-none focus:border-[var(--color-lavender)]/50 focus:bg-white/10"
                                autoFocus
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mx-auto flex items-center justify-center gap-3 bg-[var(--color-lavender)] hover:bg-[var(--color-lavender)]/90 text-black font-black px-8 py-3 rounded-full transition-all disabled:opacity-50"
                            >
                                <span>{isSubmitting ? 'VALIDATION...' : 'Valider'}</span>
                                <RiLockUnlockLine />
                            </button>
                        </form>
                        <div className="h-12 mt-6 flex items-center justify-center">
                            {status.msg && (
                                <div className={clsx("text-[10px] font-bold py-2 px-4 rounded-full border",
                                    status.type === 'success' ? "text-[var(--color-light-green)]" : "text-red-500")}>
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