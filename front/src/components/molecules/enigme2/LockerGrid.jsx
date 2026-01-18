"use client";
import React from 'react';
import { IoLockClosed } from "react-icons/io5";

export default function LockerGrid({
                                       side,
                                       status,
                                       cases,
                                       onLockerClick,
                                       onCaseClick
                                   }) {
    const isLocked = status === 'locked';
    const isValidated = status === 'validated';
    const isFailed = status === 'failed';

    // ✨ STYLES DYNAMIQUES MIS À JOUR
    let borderStyle = 'border-2 border-[var(--color-light-green)]/30';
    if (isLocked) borderStyle = 'border-4 border-[var(--color-red)] shadow-[0_0_20px_rgba(173,11,22,0.3)] animate-pulse';
    if (isFailed) borderStyle = 'border-2 border-[var(--color-mat-red)] opacity-70';
    if (isValidated) borderStyle = 'border-2 border-[var(--color-light-green)] shadow-[0_0_20px_rgba(0,255,136,0.3)]';

    return (
        <div className="relative group">
            {/* Grille */}
            <div className={`size-80 grid grid-cols-3 grid-rows-3 transition-all duration-300 ${borderStyle} ${isLocked ? 'cursor-pointer' : ''} bg-black/60 backdrop-blur-sm`}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((position) => {
                    // Case centrale (4)
                    if (position === 4) {
                        return (
                            <div key={position} className={`flex items-center justify-center text-4xl border border-white/5 ${
                                isValidated ? 'bg-[var(--color-light-green)]/20 text-[var(--color-light-green)]' :
                                    isFailed ? 'bg-[var(--color-mat-red)]/20 text-[var(--color-mat-red)]' :
                                        'bg-white/5'
                            }`}>
                                {isValidated && '✓'}
                                {isFailed && '✗'}
                            </div>
                        );
                    }

                    // Autres cases
                    const caseIndex = position < 4 ? position : position - 1;
                    const caseState = cases[caseIndex];

                    return (
                        <div
                            key={position}
                            className={`p-2 flex items-center justify-center text-lg font-bold transition-all border border-white/5 ${
                                isLocked ? 'cursor-not-allowed text-white/10' :
                                    // ✨ ICI : On utilise var(--color-mat-red) pour l'échec
                                    caseState === 'success' ? 'bg-[var(--color-light-green)] text-black cursor-default' :
                                        caseState === 'fail' ? 'bg-[var(--color-mat-red)] text-white cursor-default' :
                                            'cursor-pointer hover:bg-[var(--color-light-green)] hover:text-black text-white/80'
                            }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isLocked) onCaseClick(side, caseIndex);
                            }}
                        >
                            {position < 4 ? position + 1 : position}
                        </div>
                    );
                })}
            </div>

            {/* Overlay LOCKED */}
            {isLocked && (
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-[3px] cursor-pointer hover:bg-black/80 transition-colors z-10"
                    onClick={(e) => {
                        e.stopPropagation();
                        onLockerClick(side, e);
                    }}
                >
                    <div className="text-[var(--color-red)] mb-4 animate-bounce">
                        <IoLockClosed size={64} />
                    </div>
                    <div className="text-[var(--color-red)] font-black tracking-[0.3em] text-lg uppercase border-2 border-[var(--color-red)] px-4 py-1">
                        LOCKED
                    </div>
                </div>
            )}

            {/* Message FAILED */}
            {isFailed && (
                <div className="absolute -bottom-8 left-0 right-0 text-center text-[var(--color-mat-red)] text-xs font-mono font-bold tracking-widest animate-pulse">
                    ACCÈS RÉSERVÉ
                </div>
            )}
        </div>
    );
}