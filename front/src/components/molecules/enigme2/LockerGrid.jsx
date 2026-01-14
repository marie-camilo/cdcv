"use client";
import React from 'react';
import { IoLockClosed } from "react-icons/io5";

export default function LockerGrid({
                                       side,
                                       status, // 'locked', 'unlocked', 'validated', 'failed'
                                       cases,  // Array des états du snake
                                       onLockerClick,
                                       onCaseClick
                                   }) {
    const isLocked = status === 'locked';
    const isValidated = status === 'validated';
    const isFailed = status === 'failed';

    // Styles dynamiques
    let borderStyle = 'border-2 border-[var(--color-light-green)]';
    if (isLocked) borderStyle = 'border-4 border-[var(--color-classic-red)] shadow-[0_0_20px_rgba(255,51,51,0.5)] animate-pulse';
    if (isFailed) borderStyle = 'border-2 border-red-900 opacity-50';
    if (isValidated) borderStyle = 'border-2 border-green-500 shadow-[0_0_20px_rgba(0,255,0,0.5)]';

    return (
        <div className="relative group">
            {/* Grille */}
            <div className={`size-80 grid grid-cols-3 grid-rows-3 transition-all duration-300 ${borderStyle} ${isLocked ? 'cursor-pointer' : ''} bg-black/40 backdrop-blur-sm`}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((position) => {
                    // Case centrale (4)
                    if (position === 4) {
                        return (
                            <div key={position} className={`flex items-center justify-center text-4xl ${isValidated ? 'bg-green-500/20 text-green-500' : isFailed ? 'bg-red-500/20 text-red-500' : 'bg-white/5'}`}>
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
                                    caseState === 'success' ? 'bg-green-500 text-white cursor-default' :
                                        caseState === 'fail' ? 'bg-red-500 text-white cursor-default' :
                                            'cursor-pointer hover:bg-[var(--color-light-green)] hover:text-black text-white'
                            }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onCaseClick(side, caseIndex);
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
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-[2px] cursor-pointer hover:bg-black/70 transition-colors z-10"
                    onClick={(e) => {
                        e.stopPropagation();
                        onLockerClick(side, e);
                    }}
                >
                    <div className="text-[var(--color-classic-red)] mb-4 animate-bounce">
                        <IoLockClosed size={64} />
                    </div>
                    <div className="text-[var(--color-classic-red)] font-black tracking-[0.3em] text-lg uppercase border-2 border-[var(--color-classic-red)] px-4 py-1">
                        LOCKED
                    </div>
                </div>
            )}

            {/* Message FAILED */}
            {isFailed && (
                <div className="absolute -bottom-8 left-0 right-0 text-center text-[var(--color-classic-red)] text-xs font-mono font-bold tracking-widest animate-pulse">
                    ACCÈS REFUSÉ
                </div>
            )}
        </div>
    );
}