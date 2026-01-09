"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { RiDoorLockBoxLine, RiCellphoneFill, RiChat4Line, RiPuzzleLine, RiCameraLine, RiFolder6Line, RiLockLine } from 'react-icons/ri';
import TypewriterTerminal from "@/components/molecules/TypewriterTerminal/TypewriterTerminal";

export default function WelcomePage() {
    const router = useRouter();
    const [unlockedApps, setUnlockedApps] = useState([]);

    useEffect(() => {
        // Récupère les apps débloquées depuis le state (mis à jour depuis /answer)
        const unlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');
        setUnlockedApps(unlocked);
    }, []);

    const terminalLines = [
        "> CONNEXION SÉCURISÉE ÉTABLIE...",
        "> DÉCRYPTAGE EN COURS...",
        "> ",
        "> MESSAGE DE : M. JACQUOT",
        "> STATUT : URGENT",
        "> ",
        "> Équipe, j'ai réussi à infiltrer le réseau des Chemises Rouges.",
        "> J'ai accès à leur système de sécurité, mais il est protégé par un pare-feu multicouche.",
        "> ",
        "> Chaque application est verrouillée par un code différent.",
        "> Vous devez trouver ces codes et les entrer dans le système de déblocage.",
        "> ",
        "> Une fois déverrouillées, ces applications vous donneront accès à leurs secrets.",
        "> ",
        "> Rendez-vous dans la CONSOLE DE DÉBLOCAGE pour entrer les codes.",
        "> ",
        "> Bonne chance. Le temps presse.",
        "> ",
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
            <Link href={app.href} className="relative size-18 bg-(--color-turquoise) flex items-center justify-center rounded-xl hover:bg-green-500 transition-colors">
                <Icon className="text-2xl text-green-900" />
                <div className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    ✓
                </div>
            </Link>
        );
    };

    return (
        <main className="h-full flex flex-col md:max-w-md mx-auto">
            <section className="flex flex-col h-full">
                {/* Zone de texte avec scroll */}
                <article className="text-(--color-turquoise) py-4 px-4 font-mono text-xs overflow-y-auto flex-shrink-0 max-h-[35vh] border-b-2 border-(--color-turquoise)">
                    <div style={{ width: "100%" }}>
                        <TypewriterTerminal textLines={terminalLines} speed={40} />
                    </div>
                </article>

                {/* Zone des applications - toujours visible */}
                <article className="flex flex-col gap-6 justify-center items-center py-8 text-white flex-1 overflow-hidden">
                    <div className="text-center mb-2">
                        <h2 className="text-(--color-turquoise) font-mono text-lg mb-1">🔓 SYSTÈME DE SÉCURITÉ</h2>
                        <p className="text-gray-400 text-xs">Applications débloquées : {unlockedApps.length}/{apps.length}</p>
                    </div>

                    <div className="flex gap-8">
                        <Link href="/answer" className="size-18 bg-red-600 flex items-center justify-center rounded-xl hover:bg-red-700 transition-colors border-2 border-red-400">
                            <RiDoorLockBoxLine className="text-xl text-white" />
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
                        <p>⚠️ PARE-FEU ACTIF</p>
                        <p className="text-[10px]">Console de déblocage (🔓)</p>
                    </div>
                </article>
            </section>
        </main>
    );
}