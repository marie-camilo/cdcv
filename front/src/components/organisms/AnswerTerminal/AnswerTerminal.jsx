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
        <div className={`w-full max-w-[500px] bg-[#050505]/90 backdrop-blur-md border ${isError ? 'border-[var(--color-red)] shadow-[0_0_20px_rgba(255,0,0,0.2)]' : 'border-[var(--color-light-green)]/30 shadow-[0_0_30px_rgba(0,255,0,0.05)]'} p-6 rounded-xl transition-all duration-300`}>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                <div className={`flex items-center gap-4 bg-black/50 p-4 rounded-lg border transition-colors duration-300 ${isError ? 'border-[var(--color-red)]/50' : 'border-white/5 focus-within:border-[var(--color-light-green)]/50'}`}>
                    <div className="flex-1">
                        <CodeInput
                            value={inputValue}
                            onChange={setInputValue}
                            placeholder="ENTRER LE CODE"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 min-h-[40px]">

                    <div className="flex flex-col w-full sm:w-auto text-center sm:text-left order-2 sm:order-1">
                        {isError ? (
                            <p className="text-[var(--color-red)] text-[10px] font-black font-mono tracking-widest animate-pulse leading-tight">
                                [ ! ] {currentMessage}
                            </p>
                        ) : (
                            <p className="text-[var(--color-light-green)]/50 text-[10px] font-mono tracking-wider uppercase">
                                // SYSTÈME EN ATTENTE <br/>
                                // TENTATIVES : <span className="text-white">{attempts}</span>
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`
                            order-1 sm:order-2 w-full sm:w-auto
                            px-6 py-3 rounded-lg font-mono font-bold text-xs tracking-[2px] uppercase transition-all duration-200
                            ${isError
                            ? 'bg-[var(--color-mat-red)] text-black hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                            : 'bg-[var(--color-light-green)] text-black hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                        }
                            active:scale-95
                        `}
                    >
                        {isError ? "RÉESSAYER" : "EXÉCUTER_"}
                    </button>
                </div>
            </form>
        </div>
    );
}