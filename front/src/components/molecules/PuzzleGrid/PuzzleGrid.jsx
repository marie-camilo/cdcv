"use client";
import React, { useState } from 'react';
import { FaPuzzlePiece } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function PuzzleGrid({ pieces, foundIds, onValidatePiece, onSlotClick }) {
    const [selectedId, setSelectedId] = useState(null);
    const [inputCode, setInputCode] = useState("");

    const handleClick = (id) => {
        // Si la pièce est déjà trouvée, on appelle le parent (pour la modale du Slot 1)
        if (foundIds.includes(id)) {
            if (onSlotClick) {
                onSlotClick(id);
            }
            return;
        }

        // Sinon, on ouvre la saisie du code
        setSelectedId(id);
        setInputCode("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onValidatePiece(selectedId, inputCode);
        setSelectedId(null);
    };

    return (
        <div className="w-full max-w-md mt-6">
            {/* Grille des slots */}
            <div className="grid grid-cols-2 gap-4">
                {pieces.map((p) => {
                    const isFound = foundIds.includes(p.id);

                    return (
                        <button
                            key={p.id}
                            onClick={() => handleClick(p.id)}
                            // On ne désactive PAS le bouton pour permettre le clic sur le Slot 1
                            disabled={false}
                            className={`
                                relative h-20 rounded-xl flex flex-col items-center justify-center border-2 transition-all active:scale-95
                                ${isFound
                                ? "bg-[var(--color-light-green)]/20 border-[var(--color-light-green)] text-[var(--color-light-green)]"
                                : "bg-black/40 border-[var(--color-medium)] text-[var(--color-white)] opacity-60 hover:opacity-100 hover:border-white"
                            }
                            `}
                        >
                            {isFound ? (
                                <>
                                    <IoCheckmarkCircle size={24} className="mb-1" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Sécurisé</span>
                                </>
                            ) : (
                                <>
                                    <FaPuzzlePiece size={20} className="mb-2 opacity-70" />
                                    <span className="text-xs font-mono">{p.label || `Slot ${p.id}`}</span>
                                </>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Modal de saisie */}
            {selectedId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#111] border border-[var(--color-light-green)] p-6 rounded-xl w-full max-w-xs text-center shadow-[0_0_30px_rgba(50,255,50,0.1)]">
                        <h3 className="text-[var(--color-light-green)] font-mono text-sm mb-4 uppercase">
                            Code : {pieces.find(p => p.id === selectedId)?.label || `Fragment #${selectedId}`}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                inputMode="numeric"
                                autoFocus
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                className="w-full bg-black border border-[var(--color-medium)] p-3 text-center text-2xl text-white font-mono mb-4 rounded-md focus:border-[var(--color-light-green)] outline-none tracking-[0.5em]"
                                placeholder="---"
                                maxLength={3}
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedId(null)}
                                    className="flex-1 py-3 text-xs uppercase text-white/50 border border-white/20 rounded hover:bg-white/10"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 text-xs uppercase font-bold bg-[var(--color-light-green)] text-black rounded hover:brightness-110"
                                >
                                    Valider
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}