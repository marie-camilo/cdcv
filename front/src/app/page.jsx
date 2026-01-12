"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    RiDoorLockBoxLine,
    RiCellphoneFill,
    RiChat4Line,
    RiPuzzleLine,
    RiCameraLine,
    RiFolder6Line,
    RiLockLine,
} from "react-icons/ri";

import TypewriterTerminal from "@/components/molecules/TypewriterTerminal/TypewriterTerminal";
import { TimerProvider } from "@/app/context/TimerContext";
import Navbar from "@/components/organisms/Navbar/Navbar";
import { checkGameState } from "@/hooks/API/rules";

export default function WelcomePage() {
    const router = useRouter();

    const [authorized, setAuthorized] = useState(false);
    const [unlockedApps, setUnlockedApps] = useState([]);

    useEffect(() => {
        const guard = async () => {
            const code = localStorage.getItem("currentGameCode");

            // ❌ Pas de code → dehors
            if (!code) {
                router.replace("/lobby");
                return;
            }

            try {
                const state = await checkGameState(code);

                // ❌ Game pas démarrée → dehors
                if (state.status !== "started") {
                    router.replace("/lobby");
                    return;
                }

                // ✅ Tout est OK
                setAuthorized(true);

            } catch (e) {
                router.replace("/");
            }
        };

        guard();
    }, [router]);

    useEffect(() => {
        if (!authorized) return;

        const unlocked = JSON.parse(
            localStorage.getItem("unlockedApps") || "[]"
        );
        setUnlockedApps(unlocked);
    }, [authorized]);

    // ⛔ Tant que l’accès n’est pas validé, on ne render RIEN
    if (!authorized) return null;

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
        { id: "scan", name: "Scanner", icon: RiCameraLine, href: "/scan" },
        { id: "phone", name: "Téléphone", icon: RiCellphoneFill, href: "/enigme-3" },
        { id: "puzzle", name: "Puzzle", icon: RiPuzzleLine, href: "/enigme-2" },
        { id: "folder", name: "Dossiers", icon: RiFolder6Line, href: "/folder" },
        { id: "chat", name: "Messages", icon: RiChat4Line, href: "/enigme-3" },
    ];

    const AppIcon = ({ app, isUnlocked }) => {
        const Icon = app.icon;

        if (!isUnlocked) {
            return (
                <div className="relative size-18 bg-gray-400 flex items-center justify-center rounded-xl cursor-not-allowed opacity-50">
                    <RiLockLine className="text-2xl text-gray-600" />
                </div>
            );
        }

        return (
            <Link
                href={app.href}
                className="relative size-18 bg-(--color-turquoise) flex items-center justify-center rounded-xl"
            >
                <Icon className="text-2xl text-green-900" />
            </Link>
        );
    };

    return (
        <main className="h-full flex flex-col md:max-w-md mx-auto">
            <TimerProvider>
                <Navbar />
            </TimerProvider>

            <section className="flex flex-col h-full">
                <article className="text-(--color-turquoise) py-4 px-4 font-mono text-xs overflow-y-auto max-h-[35vh] border-b-2 border-(--color-turquoise)">
                    <TypewriterTerminal textLines={terminalLines} speed={40} />
                </article>

                <article className="flex flex-col gap-6 justify-center items-center py-8 text-white flex-1">
                    <div className="text-center">
                        <h2 className="text-(--color-turquoise) font-mono text-lg">
                            🔓 SYSTÈME DE SÉCURITÉ
                        </h2>
                        <p className="text-gray-400 text-xs">
                            Applications débloquées : {unlockedApps.length}/{apps.length}
                        </p>
                    </div>

                    <div className="flex gap-8">
                        <Link
                            href="/answer"
                            className="size-18 bg-red-600 flex items-center justify-center rounded-xl"
                        >
                            <RiDoorLockBoxLine className="text-xl text-white" />
                        </Link>
                        <AppIcon app={apps[0]} isUnlocked={unlockedApps.includes("scan")} />
                        <AppIcon app={apps[1]} isUnlocked={unlockedApps.includes("phone")} />
                    </div>
                </article>
            </section>
        </main>
    );
}
