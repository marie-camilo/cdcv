// src/components/organisms/AnswerTerminal/AnswerTerminal.jsx
"use client";
import { useState } from "react";
import CodeInput from "@/components/atoms/Inputs/CodeInput";

const ERROR_MESSAGES = [
    "ERREUR : ACCÈS REFUSÉ",
    "TENTATIVE NON AUTORISÉE. TRACAGE EN COURS...",
    "ALERTE : SYSTÈME DE SÉCURITÉ ACTIVÉ. IDENTIFIEZ-VOUS !",
    "PROFIL SUSPECT DÉTECTÉ. DERNIÈRE TENTATIVE AVANT VERROUILLAGE."
];

export default function AnswerTerminal({ onValidate, expectedAnswer }) {
    const [inputValue, setInputValue] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [isError, setIsError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() === expectedAnswer.toUpperCase()) {
            setIsError(false);
            onValidate();
        } else {
            setIsError(true);
            setAttempts(prev => prev + 1);
            setInputValue("");
            setTimeout(() => setIsError(false), 3000);
        }
    };

    const currentMessage = ERROR_MESSAGES[Math.min(attempts, ERROR_MESSAGES.length - 1)];

    return (
        <div className={`w-full max-w-[450px] bg-black/60 border ${isError ? 'border-[var(--color-classic-red)]' : 'border-white/10'} p-6 rounded-lg backdrop-blur-sm transition-colors duration-300`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="text-[var(--color-light-green)] font-bold">{">"}</span>
                    <CodeInput value={inputValue} onChange={setInputValue} placeholder="ENTRER CODE..." />
                </div>

                <div className="flex justify-between items-center min-h-[32px]">
                    <div className="flex flex-col">
                        {isError ? (
                            <p className="text-[var(--color-classic-red)] text-[10px] font-bold animate-pulse uppercase leading-tight">
                                {currentMessage}
                            </p>
                        ) : (
                            <p className="text-[var(--color-light-green)]/40 text-[10px] uppercase italic">
                                Tentatives : {attempts} | Localisation : Masquée
                            </p>
                        )}
                    </div>
                    <button type="submit" className="text-[var(--color-light-green)] border border-[var(--color-light-green)] px-4 py-1 rounded hover:bg-[var(--color-light-green)] hover:text-black transition-all text-sm font-bold uppercase">
                        Valider
                    </button>
                </div>
            </form>
        </div>
    );
}