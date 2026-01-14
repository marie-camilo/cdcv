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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/90 transition-opacity duration-300">

            {/* Carte principale avec bordure Violette (Lavender) */}
            <div className="relative w-full max-w-md bg-[#1a0a0a] border-2 border-[var(--color-lavender)] p-6 rounded-lg shadow-[0_0_40px_rgba(143,147,255,0.2)] overflow-hidden">

                {/* Effet de scanlines en fond */}
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%]" />

                <div className="relative z-10 flex flex-col gap-4">

                    {/* 1. LE TIMER (Tout en haut, aligné à droite pour le style "Système") */}
                    <div className="flex justify-start items-center pb-2 ">
                        <TimerDisplay variant="red" className="text-xl" />
                    </div>

                    {/* 2. BLOC IDENTITÉ (Image Gauche + Infos Droite) */}
                    <div className="flex items-start gap-4 mt-1">

                        {/* Image Carrée à Gauche */}
                        <div className="relative shrink-0 w-20 h-20 bg-black border border-[var(--color-classic-red)] shadow-[0_0_15px_rgba(255,51,51,0.2)]">
                            <Image
                                src="/chemise rouge.svg"
                                alt="Chemise Rouge"
                                width={80}
                                height={80}
                                className="object-cover w-full h-full"
                                unoptimized
                            />
                            {/* Overlay léger */}
                            <div className="absolute inset-0 bg-[var(--color-classic-red)]/10 mix-blend-overlay pointer-events-none"></div>
                        </div>

                        {/* Infos à Droite - Mise en forme modifiée ici */}
                        <div className="flex flex-col h-20 justify-between items-start w-full">

                            {/* Ligne du haut : Badge Faction */}
                            <div className="flex items-center gap-2">
                                <span className="text-[var(--color-lavender)] text-[9px] font-mono tracking-widest uppercase opacity-90">
                                    Chemises Rouges
                                </span>
                            </div>

                            {/* Milieu : Nom de l'agent (Gros) */}
                            <h3 className="text-[var(--color-white)] font-black text-xl font-mono uppercase tracking-tight leading-none drop-shadow-md">
                                {agentName}
                            </h3>

                            {/* Bas : Titre avec ligne décorative */}
                            <div className="flex items-center w-full gap-2">
                                <span className="text-[var(--color-classic-red)] text-xs font-bold italic uppercase shrink-0">
                                    {title}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 3. LE MESSAGE */}
                    <div className="bg-white/5 border-l-2 border-[var(--color-classic-red)] p-4 mt-2">
                        <p className="text-[var(--color-white)] font-[family-name:var(--font-source)] text-sm leading-relaxed italic">
                            "{message}"
                        </p>
                    </div>

                    {/* 4. BOUTON (Aligné à droite) */}
                    <div onClick={() => onConfirm && onConfirm()} className="flex justify-end mt-2">
                        <NextButton variant="lavender" />
                    </div>
                </div>
            </div>
        </div>
    );
}