"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import NextButton from "@/components/atoms/Buttons/NextButton";
import TimerDisplay from "@/components/atoms/TimerDisplay/TimerDisplay";

// Liste des noms de code
const RED_SHIRT_NAMES = [
    "Agent Stone",
    "Agent Fox",
    "Agent Hunter",
    "Agent Blaze",
    "Agent Storm",
    "Agent Frost",
    "Agent Scarlet",
    "Agent Knight",
    "Agent Hawk",
    "Agent Miller",
    "Agent Cooper",
    "Agent White",
    "Agent Sterling",
    "Agent Chase"
];

export default function BaseModal({ isOpen, title, message, onConfirm }) {
    const [agentName, setAgentName] = useState("");

    useEffect(() => {
        if (isOpen) {
            setAgentName(RED_SHIRT_NAMES[Math.floor(Math.random() * RED_SHIRT_NAMES.length)]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/95 transition-opacity duration-300">

            <div className="relative w-full max-w-md bg-[var(--color-darker-red)] border-2 border-[var(--color-mat-red)] p-6 rounded-lg shadow-[0_0_50px_rgba(173,11,22,0.2)] overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%]" />

                <div className="relative z-10 flex flex-col gap-4">

                    {/* LE TIMER */}
                    <div className="flex justify-start items-center pb-2">
                        <TimerDisplay variant="red" className="text-xl" />
                    </div>

                    <div className="flex items-start gap-4 mt-1">

                        <div className="relative shrink-0 w-20 h-20 bg-[var(--color-mid-red)] border border-[var(--color-red)] shadow-[0_0_15px_rgba(173,11,22,0.3)]">
                            <Image
                                src="/chemise rouge.svg"
                                alt="Chemise Rouge"
                                width={80}
                                height={80}
                                className="object-cover w-full h-full opacity-90"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-[var(--color-red)]/10 mix-blend-overlay pointer-events-none"></div>
                        </div>

                        <div className="flex flex-col h-20 justify-between items-start w-full">

                            <div className="flex items-center gap-2">
                                <span className="text-[var(--color-mat-red)] text-[10px] font-mono tracking-widest uppercase opacity-90 border border-[var(--color-mat-red)] px-2 py-0.5 rounded-sm bg-[var(--color-mid-red)]/50">
                                    Chemises Rouges
                                </span>
                            </div>

                            <h3 className="text-[var(--color-sand)] font-black text-xl font-mono uppercase tracking-tight leading-none drop-shadow-md">
                                {agentName}
                            </h3>

                            <div className="flex items-center w-full gap-2">
                                <span className="text-[var(--color-mat-blue)] text-xs font-bold italic uppercase shrink-0">
                                    {title}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-mid-red)] border-l-2 border-[var(--color-red)] p-4 mt-2 shadow-inner">
                        <p className="text-[var(--color-sand)] font-[family-name:var(--font-source)] text-sm leading-relaxed italic opacity-90">
                            "{message}"
                        </p>
                    </div>

                    {/* 4. BOUTON */}
                    <div onClick={() => onConfirm && onConfirm()} className="flex justify-end mt-2">
                        {/* Passage en variant red pour coller au thème */}
                        <NextButton variant="red" />
                    </div>
                </div>
            </div>
        </div>
    );
}