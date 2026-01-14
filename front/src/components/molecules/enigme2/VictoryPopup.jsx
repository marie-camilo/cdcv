"use client";
import React from 'react';

export default function VictoryPopup({ isOpen, codeDigits, correctLockerSide, onConfirm }) {
    if (!isOpen) return null;

    const codeString = Object.values(codeDigits).join('');
    const sideText = correctLockerSide === 'left' ? 'GAUCHE' : 'DROITE';

    return (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <div className="bg-black border border-[var(--color-light-green)] shadow-[0_0_50px_rgba(0,255,0,0.2)] rounded-lg p-8 max-w-md text-center">
                <h2 className="text-3xl font-bold text-[var(--color-light-green)] mb-4 tracking-tighter uppercase">
                    Système Piraté
                </h2>
                <p className="text-white/80 mb-6 font-mono text-sm leading-relaxed">
                    Excellent travail ! Casier <span className="font-bold text-[var(--color-light-green)]">{sideText}</span> ouvert.
                </p>
                <div className="bg-white/5 p-4 rounded mb-6 border border-white/10">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Code Final</p>
                    <span className="text-4xl font-mono font-bold text-white tracking-[0.5em] drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        {codeString}
                    </span>
                </div>
                <button
                    onClick={onConfirm}
                    className="bg-[var(--color-light-green)] hover:bg-white text-black font-bold py-3 px-8 rounded uppercase tracking-widest transition-all w-full"
                >
                    Extraire les données
                </button>
            </div>
        </div>
    );
} 