"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RiDoorLockBoxLine, RiCellphoneFill, RiChat4Line, RiPuzzleLine, RiCameraLine, RiFolder6Line, RiLockLine } from 'react-icons/ri';
import TypewriterTerminal from "@/components/molecules/TypewriterTerminal/TypewriterTerminal";

export default function WelcomePage() {
    const [unlockedApps, setUnlockedApps] = useState([]);
    const [startTyping, setStartTyping] = useState(false);

    useEffect(() => {
        // Récupère les apps débloquées
        const unlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');
        setUnlockedApps(unlocked);

        // 2. On attend 3 secondes (durée du chargement) avant de lancer l'écriture du terminal
        const timer = setTimeout(() => {
            setStartTyping(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const terminalLines = [
        "> CONNEXION SÉCURISÉE ÉTABLIE...",
        "> DÉCRYPTAGE EN COURS...",
        "> MESSAGE DE : M. JACQUOT",
        "> Équipe, j'ai réussi à infiltrer le réseau des Chemises Rouges.",
        "> J'ai accès à leur système de sécurité, mais il est protégé par un pare-feu multicouche.",
        "> Chaque application est verrouillée par un code différent.",
        "> Vous devez trouver ces codes et les entrer dans le système de déblocage.",
        "> Une fois déverrouillées, ces applications vous donneront accès à leurs secrets.",
        "> Rendez-vous dans la CONSOLE DE DÉBLOCAGE (Case rouge) pour entrer les codes.",
        "> Bonne chance. Le temps presse.",
        "> — M. JACQUOT",
    ];

    const apps = [
        { id: 'scan', name: 'Scanner', icon: RiCameraLine, href: '/scan' },
        { id: 'phone', name: 'Téléphone', icon: RiCellphoneFill, href: '/enigme-3' },
        { id: 'puzzle', name: 'Puzzle', icon: RiPuzzleLine, href: '/enigme-2' },
        { id: 'folder', name: 'Dossiers', icon: RiFolder6Line, href: '/folder' },
        { id: 'chat', name: 'Messages', icon: RiChat4Line, href: '/enigme-3' },
    ];

    const AppIcon = ({ app, isUnlocked }) => {
        const Icon = app.icon;

        if (!isUnlocked) {
            return (
                <div className="relative size-18 bg-gray-400 flex items-center justify-center rounded-xl cursor-not-allowed opacity-50">
                    <RiLockLine className="text-2xl text-gray-600" />
                    <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        🔒
                    </div>
                </div>
            );
        }

        return (
            // Correction syntaxe couleur Tailwind : [var(--...)]
            <Link href={app.href} className="relative size-18 bg-[var(--color-turquoise)] flex items-center justify-center rounded-xl hover:bg-green-500 transition-colors">
                <Icon className="text-2xl text-green-900" />
                <div className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    ✓
                </div>
            </Link>
        );
    };

    return (
        <main className="flex flex-col md:max-w-md mx-auto min-h-screen">

            <section className="flex flex-col h-full flex-1">
                {/* Zone de texte avec scroll */}
                <article className="text-[var(--color-turquoise)] py-4 px-4 font-mono text-xs overflow-y-auto flex-shrink-0 max-h-[40vh] border-b-2 border-[var(--color-turquoise)]">
                    <div style={{ width: "100%" }}>
                        {/* Le terminal ne s'affiche que quand le chargement est fini */}
                        {startTyping && (
                            <TypewriterTerminal textLines={terminalLines} speed={15} />
                        )}
                    </div>
                </article>

                {/* Zone des applications - toujours visible */}
                <article className="flex flex-col gap-6 justify-center items-center py-8 text-white flex-1 overflow-hidden">
                    <div className="text-center mb-2">
                        <h2 className="text-[var(--color-turquoise)] font-mono text-lg mb-1">SYSTÈME DE SÉCURITÉ</h2>
                        <p className="text-gray-400 text-xs">Applications débloquées : {unlockedApps.length}/{apps.length}</p>
                    </div>

                    <div className="flex gap-8">
                        <Link href="/answer" className="size-18 bg-red-600 flex items-center justify-center rounded-xl hover:bg-red-700 transition-colors border-2 border-red-400 shadow-[0_0_15px_rgba(255,0,0,0.4)]">
                            <RiDoorLockBoxLine className="text-3xl text-white" />
                        </Link>
                        <AppIcon app={apps[0]} isUnlocked={unlockedApps.includes('scan')} />
                        <AppIcon app={apps[1]} isUnlocked={unlockedApps.includes('phone')} />
                    </div>
                    <div className="flex gap-8">
                        <AppIcon app={apps[2]} isUnlocked={unlockedApps.includes('puzzle')} />
                        <AppIcon app={apps[3]} isUnlocked={unlockedApps.includes('folder')} />
                        <AppIcon app={apps[4]} isUnlocked={unlockedApps.includes('chat')} />
                    </div>

                    <div className="mt-4 text-center text-xs text-gray-500 font-mono">
                        <p className="animate-pulse">PARE-FEU ACTIF</p>
                        <p className="text-[10px] mt-1 text-[var(--color-classic-red)]">Console de déblocage (Rouge)</p>
                    </div>
                </article>
            </section>
        </main>
    );
}