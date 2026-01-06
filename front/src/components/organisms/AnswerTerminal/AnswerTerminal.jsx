"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import CodeInput from "@/components/atoms/Inputs/CodeInput";

export default function AnswerTerminal({ onValidate, expectedAnswer }) {
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() === expectedAnswer.toUpperCase()) {
            setError(false);
            onValidate();
        } else {
            setError(true);
            setInputValue("");
            // Animation de secousse (shake) optionnelle ici
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="w-full max-w-[450px] bg-black/60 border border-white/10 p-6 rounded-lg backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="text-[var(--color-light-green)] font-bold">{">"}</span>
                    <CodeInput
                        value={inputValue}
                        onChange={setInputValue}
                        placeholder="ENTRER CODE..."
                    />
                </div>

                <div className="flex justify-between items-center min-h-[24px]">
                    {error ? (
                        <p className="text-[var(--color-classic-red)] text-xs font-bold animate-pulse uppercase">
                            ERREUR : ACCÈS REFUSÉ
                        </p>
                    ) : (
                        <p className="text-[var(--color-light-green)]/40 text-xs uppercase italic">
                            En attente de déchiffrage...
                        </p>
                    )}
                    <button
                        type="submit"
                        className="text-[var(--color-light-green)] border border-[var(--color-light-green)] px-4 py-1 rounded hover:bg-[var(--color-light-green)] hover:text-black transition-all text-sm font-bold uppercase"
                    >
                        Valider
                    </button>
                </div>
            </form>
        </div>
    );
}