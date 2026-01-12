"use client";
import React, { useState } from 'react';
import { FaPuzzlePiece } from "react-icons/fa";

export default function PuzzleGrid({ pieces, foundIds, onValidatePiece }) {
    const [selectedId, setSelectedId] = useState(null);
    const [inputCode, setInputCode] = useState("");

    const handleClick = (id) => {
        if (!foundIds.includes(id)) {
            setSelectedId(id);
            setInputCode("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onValidatePiece(selectedId, inputCode);
        setSelectedId(null);
    };

    return (
        <div className="w-full max-w-md mt-6">
            <div className="flex justify-center gap-3 flex-wrap">
                {pieces.map((p) => {
                    const isFound = foundIds.includes(p.id);
                    return (
                        <button
                            key={p.id}
                            onClick={() => handleClick(p.id)}
                            disabled={isFound}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 transition-all ${
                                isFound
                                    ? "bg-[var(--color-light-green)] border-[var(--color-light-green)] text-black scale-100"
                                    : "bg-black/40 border-[var(--color-medium)] text-[var(--color-white)] opacity-60 hover:opacity-100 hover:scale-110"
                            }`}
                        >
                            <FaPuzzlePiece size={20} />
                            {isFound && <span className="absolute -top-1 -right-1 text-[8px] bg-black text-white px-1 rounded-full">✓</span>}
                        </button>
                    );
                })}
            </div>

            {selectedId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#111] border border-[var(--color-light-green)] p-6 rounded-xl w-full max-w-xs text-center shadow-[0_0_30px_rgba(50,255,50,0.1)]">
                        <h3 className="text-[var(--color-light-green)] font-mono text-sm mb-4 uppercase">
                            Entrez le code de la pièce #{selectedId}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                inputMode="numeric"
                                autoFocus
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                className="w-full bg-black border border-[var(--color-medium)] p-3 text-center text-2xl text-white font-mono mb-4 rounded-md focus:border-[var(--color-light-green)] outline-none"
                                placeholder="---"
                                maxLength={3}
                            />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setSelectedId(null)} className="flex-1 py-2 text-xs uppercase text-white/50 border border-white/20 rounded hover:bg-white/10">Annuler</button>
                                <button type="submit" className="flex-1 py-2 text-xs uppercase font-bold bg-[var(--color-light-green)] text-black rounded hover:opacity-90">Valider</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}