"use client";
import React, { useState, useRef } from 'react'; // Ajout de useRef
import { useRouter } from "next/navigation";
import { RiLockUnlockLine, RiArrowLeftLine, RiShieldKeyholeLine } from 'react-icons/ri';
import clsx from "clsx";

export default function AnswerPage() {
    const router = useRouter();
    const videoRef = useRef(null); // Pour contrôler la vidéo
    const [code, setCode] = useState("");
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [isShaking, setIsShaking] = useState(false);
    const [showVideo, setShowVideo] = useState(false); // État pour la vidéo

    const codes = {
        'FOYER': 'scan',
        'BETA5678': 'phone',
        'GAMMA9012': 'puzzle',
        'OMEGA7890': 'boussole',
        'DELTA3456': 'terminal',
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const inputCode = code.toUpperCase().trim();

        if (inputCode === 'P7AJ0') {
            setShowVideo(true);
            return;
        }

        const appId = codes[inputCode];
        if (appId) {
            const unlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');
            if (unlocked.includes(appId)) {
                setStatus({ type: 'error', msg: "APPLICATION DÉJÀ ACTIVE" });
                triggerShake();
            } else {
                unlocked.push(appId);
                localStorage.setItem('unlockedApps', JSON.stringify(unlocked));
                setStatus({ type: 'success', msg: "DÉCRYPTAGE RÉUSSI" });
                setTimeout(() => router.push('/'), 1500);
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

    const handleVideoEnd = () => {
        router.push('/enigme-3');
    };

    return (
        <main className="min-h-[100dvh] bg-[var(--color-dark)] flex flex-col items-center justify-center p-6 font-mono">

            {showVideo && (
                <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                        <video
                            ref={videoRef}
                            src="/video-foyer.mov"
                            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
                            controls
                            autoPlay
                            onEnded={handleVideoEnd}
                            playsInline
                        />
                        <button
                            onClick={handleVideoEnd}
                            className="absolute bottom-4 right-4 text-[10px] text-white/30 border border-white/10 px-2 py-1 rounded"
                        >
                            Passer la séquence
                        </button>
                    </div>
                </div>
            )}

            {!showVideo && (
                <>
                    <button
                        onClick={() => router.push('/')}
                        className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-[var(--color-lavender)] hover:border-[var(--color-lavender)]/30 transition-all text-xs tracking-widest group"
                    >
                        <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" />
                        RETOUR AU NEXUS
                    </button>

                    <div className={clsx(
                        "max-w-md w-full transition-all duration-300",
                        isShaking && "animate-shake"
                    )}>
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
                                    />
                                    <button
                                        type="submit"
                                        className="mx-auto flex items-center justify-center gap-3 bg-[var(--color-lavender)] hover:bg-[var(--color-lavender)]/90 text-black font-black px-8 py-3 rounded-full transition-all"
                                    >
                                        <span>Valider</span>
                                        <RiLockUnlockLine />
                                    </button>
                                </form>
                                <div className="h-12 mt-6 flex items-center justify-center">
                                    {status.msg && (
                                        <div className={clsx("text-[10px] font-bold py-2 px-4 rounded-full border", status.type === 'success' ? "text-[var(--color-light-green)]" : "text-red-500")}>
                                            {status.msg}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-8px); }
                    50% { transform: translateX(8px); }
                    75% { transform: translateX(-8px); }
                }
                .animate-shake {
                    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
        </main>
    );
}