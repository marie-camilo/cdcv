"use client";
import NextButton from "@/components/atoms/Buttons/NextButton";
import TimerDisplay from "@/components/atoms/TimerDisplay/TimerDisplay";

export default function BaseModal({ isOpen, title, message, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/90">
            <div className="w-full max-w-md border-2 border-[var(--color-classic-red)] bg-[#1a0a0a] p-8 rounded-2xl shadow-[0_0_50px_rgba(255,51,51,0.3)] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%]" />

                <div className="relative z-10 text-center">
                    <h2 className="text-[var(--color-classic-red)] text-3xl font-black uppercase italic mb-2 tracking-tighter">
                        {title}
                    </h2>

                    <div className="mb-6">
                        <p className="text-[var(--color-white)]/40 text-[10px] uppercase tracking-[0.2em]">Temps restant avant effacement</p>
                        <TimerDisplay variant="red" className="text-2xl" />
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-classic-red)] to-transparent mb-6 opacity-50" />

                    <p className="text-[var(--color-white)] font-[family-name:var(--font-source)] text-sm leading-relaxed mb-8 text-left border-l-2 border-[var(--color-classic-red)] pl-4 italic">
                        {message}
                    </p>

                    <div onClick={() => onConfirm && onConfirm()}>
                        <NextButton variant="danger" />
                    </div>
                </div>
            </div>
        </div>
    );
}