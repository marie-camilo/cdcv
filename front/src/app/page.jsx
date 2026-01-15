"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Pusher from "pusher-js";
import {
    RiDoorLockBoxLine,
    RiCellphoneFill,
    RiPuzzleLine,
    RiCameraLine,
    RiCompass3Line,
    RiTerminalBoxLine,
    RiLockLine,
    RiArrowRightLine,
    RiErrorWarningLine
} from 'react-icons/ri';
import TypewriterTerminal from "@/components/molecules/TypewriterTerminal/TypewriterTerminal";
import clsx from "clsx";

import {getPlayerRole} from "@/hooks/API/gameRequests";
import {checkPlayerCookie, getCodeFromCookie} from "@/hooks/API/rules";

const TOOLS_DATA = {
    console: {
        id: 'console',
        name: 'CONSOLE DE DÉBOGAGE',
        role: 'TOUS LES AGENTS',
        roleKey: 'all',
        image: '/console.png',
        fallbackIcon: RiDoorLockBoxLine,
        href: '/answer',
        description: "L'outil primordial. Entrez ici les codes fragments trouvés pour briser les pare-feux.",
        color: 'text-[var(--color-lavender)]',
        borderColor: 'border-[var(--color-lavender)]',
    },
    scan: {
        id: 'scan',
        name: 'SCANNER QR CODE',
        role: 'CADREURS',
        roleKey: 'cadreur',
        image: '/scan.png',
        fallbackIcon: RiCameraLine,
        href: '/scan',
        description: "MODULE CRITIQUE. Ce scanner est le seul moyen de passer à l'étape suivante via les codes visuels.",
        color: 'text-[var(--color-light-green)]',
        borderColor: 'border-[var(--color-light-green)]',
    },
    puzzle: {
        id: 'puzzle',
        name: 'DÉCRYPTEUR PUZZLE',
        role: 'TOUS LES AGENTS',
        roleKey: 'all',
        image: '/puzzle.png',
        fallbackIcon: RiPuzzleLine,
        href: '/enigme-2',
        description: "Interface de résolution d'anomalies logiques et de reconstruction de données.",
        color: 'text-[var(--color-light-green)]',
        borderColor: 'border-[var(--color-light-green)]',
    },
    phone: {
        id: 'phone',
        name: 'TALKIES WALKIES',
        role: 'COMMUNICANTS',
        roleKey: 'communicant',
        image: '/talkies.png',
        fallbackIcon: RiCellphoneFill,
        href: '/enigme-3',
        description: "Ligne cryptée pour coordonner les actions avec les autres unités.",
        color: 'text-[var(--color-light-green)]',
        borderColor: 'border-[var(--color-light-green)]',
    },
    boussole: {
        id: 'boussole',
        name: 'BOUSSOLE RADAR',
        role: 'NAVIGATEURS',
        roleKey: 'navigateur',
        image: '/boussole.png',
        fallbackIcon: RiCompass3Line,
        href: '/enigme-4',
        description: "Module de géolocalisation pour s'orienter vers les objectifs physiques.",
        color: 'text-[var(--color-light-green)]',
        borderColor: 'border-[var(--color-light-green)]',
    },
    terminal: {
        id: 'terminal',
        name: 'TERMINAL SYSTÈME',
        role: 'DÉVELOPPEURS',
        roleKey: 'developpeur',
        image: '/terminal.png',
        fallbackIcon: RiTerminalBoxLine,
        href: '/enigme-finale',
        description: "L'ultime barrière. Accès direct au noyau central du système.",
        color: 'text-[var(--color-light-green)]',
        borderColor: 'border-[var(--color-light-green)]',
    }
};

const DidacticModal = ({ tool, onClose, onConfirm, isRoleMismatch }) => {
    if (!tool) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5">
                <div className={`absolute top-0 left-0 right-0 h-1 ${isRoleMismatch ? 'bg-red-500' : 'bg-[var(--color-light-green)]'} opacity-50`} />
                <div className="p-6 flex flex-col gap-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${isRoleMismatch ? 'text-red-500' : tool.color}`}>
                                {isRoleMismatch ? <RiLockLine className="text-2xl" /> : tool.image ? <Image src={tool.image} alt="" width={32} height={32} unoptimized /> : <tool.fallbackIcon className="text-2xl" />}
                            </div>
                            <div>
                                <h3 className={`font-mono font-bold text-lg leading-tight ${isRoleMismatch ? 'text-red-500' : tool.color}`}>{tool.name}</h3>
                                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">REQUIS : {tool.role}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
                    </div>
                    <div className="relative pl-4 border-l-2 border-white/10 text-xs font-mono text-gray-300 leading-relaxed">
                        {isRoleMismatch ? (
                            <div className="flex flex-col gap-2 uppercase">
                                <p className="text-red-400 font-bold flex items-center gap-2">
                                    <RiErrorWarningLine /> ACCÈS REFUSÉ
                                </p>
                                <p>Identifiants non valides. Cet outil est réservé au profil : {tool.role}.</p>
                            </div>
                        ) : tool.description}
                    </div>
                    <div className="flex justify-end pt-2">
                        {!isRoleMismatch ? (
                            <button onClick={onConfirm} className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 transition-all">
                                <span className={`text-xs font-bold font-mono ${tool.color}`}>ACCÉDER</span>
                                <RiArrowRightLine className={tool.color} />
                            </button>
                        ) : (
                            <button onClick={onClose} className="px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono font-bold">RETOUR</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AppIcon = ({ id, unlockedApps, seenApps, onOpen }) => {
    const tool = TOOLS_DATA[id];
    const isUnlocked = unlockedApps.includes(id);
    const hasBeenSeen = seenApps.includes(id);
    const shouldPulse = isUnlocked && !hasBeenSeen;

    if (!isUnlocked) {
        return (
            <div className="relative aspect-square bg-gray-800/40 border border-gray-700 flex items-center justify-center rounded-2xl opacity-40 grayscale">
                <RiLockLine className="text-3xl text-gray-400" />
            </div>
        );
    }

    return (
        <button
            onClick={() => onOpen(id)}
            className={clsx(
                "relative aspect-square flex flex-col items-center justify-center rounded-2xl border transition-all active:scale-90 group overflow-visible",
                shouldPulse ? "border-[var(--color-light-green)] bg-[var(--color-light-green)]/10 animate-[pulse_3s_ease-in-out_infinite] shadow-[0_0_15px_rgba(0,255,100,0.2)]" : "border-white/10 bg-white/5 hover:border-white/30"
            )}
        >
            <div className="relative z-10 transform -translate-y-1 group-hover:scale-110 transition-transform duration-300">
                {tool.image ? (
                    <Image src={tool.image} alt="" width={56} height={56} className="object-contain" unoptimized />
                ) : (
                    <tool.fallbackIcon className={clsx("text-4xl", tool.color)} />
                )}
            </div>
            {shouldPulse && <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-black z-20 shadow-[0_0_8px_red]" />}
            {!shouldPulse && <div className="absolute -top-2 -right-2 bg-green-900/80 text-green-400 border border-green-700 text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-sm">✓</div>}
            <div className={`absolute bottom-2 text-[8px] font-mono font-bold tracking-tighter uppercase opacity-60 ${tool.color}`}>{id}</div>
        </button>
    );
};

export default function InfiltrationHub() {
    const router = useRouter();
    const pusherRef = useRef(null);

    const [unlockedApps, setUnlockedApps] = useState([]);
    const [seenApps, setSeenApps] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [selectedTool, setSelectedTool] = useState(null);
    const [startTyping, setStartTyping] = useState(false);
    const [code, setCode] = useState(null);
    const [authorized, setAuthorized] = useState(false);

    // ✅ 1) LOGIQUE DE GARDE / SESSION
    useEffect(() => {
        const init = async () => {
            try {
                const player = await checkPlayerCookie();
                const game = await getCodeFromCookie();

                if (!player.authenticated || !game?.game?.code) {
                    router.replace("/log");
                    return;
                }

                const roleRes = await getPlayerRole();
                setUserRole(roleRes?.role?.toLowerCase() || localStorage.getItem('userRole'));

                // ✅ Chargement initial depuis localStorage
                const storedUnlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');
                const storedSeen = JSON.parse(localStorage.getItem('seenApps') || '[]');

                setUnlockedApps(storedUnlocked);
                setSeenApps(storedSeen);

                setCode(game.game.code);
                setAuthorized(true);
            } catch (e) {
                console.error("Erreur initialisation:", e);
                router.replace("/");
            }
        };
        init();
    }, [router]);

    // ✅ 2) LOGIQUE PUSHER - Synchronisation temps réel
    useEffect(() => {
        if (!authorized || !code || pusherRef.current) return;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
            cluster: "eu",
            forceTLS: true,
        });

        pusherRef.current = pusher;
        const channel = pusher.subscribe(`game.${code}`);

        // 🔥 ÉCOUTE DU DÉBLOCAGE D'APPLICATIONS
        channel.bind('AppUnlocked', (data) => {
            console.log("🔓 NOUVEL OUTIL DÉBLOQUÉ:", data.appId);

            setUnlockedApps((prev) => {
                // Protection anti-doublon
                if (!prev.includes(data.appId)) {
                    const newApps = [...prev, data.appId];
                    localStorage.setItem('unlockedApps', JSON.stringify(newApps));
                    console.log("✅ Apps débloquées:", newApps);
                    return newApps;
                }
                return prev;
            });

            // ✅ Retirer l'app de "seenApps" pour qu'elle pulse
            setSeenApps((prev) => {
                const filtered = prev.filter(id => id !== data.appId);
                localStorage.setItem('seenApps', JSON.stringify(filtered));
                return filtered;
            });
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe(`game.${code}`);
            pusher.disconnect();
            pusherRef.current = null;
        };
    }, [authorized, code]);

    // ✅ 3) TIMER TERMINAL
    useEffect(() => {
        const typingTimer = setTimeout(() => setStartTyping(true), 1000);
        return () => clearTimeout(typingTimer);
    }, []);

    const handleOpenTool = (id) => {
        setSelectedTool(TOOLS_DATA[id]);

        // Marquer comme vu pour arrêter le pulse
        if (!seenApps.includes(id)) {
            const newSeen = [...seenApps, id];
            setSeenApps(newSeen);
            localStorage.setItem('seenApps', JSON.stringify(newSeen));
        }
    };

    const terminalLines = [
        "> CONNEXION SÉCURISÉE ÉTABLIE...",
        "> MESSAGE DE : M. JACQUOT",
        "> Bon, j'ai réussi à leur forcer la porte...",
        "> J'ai pu injecter mes propres outils dans leur réseau.",
        "> Regardez les icônes en dessous : ",
        "> Si ça clignote, c'est que je viens de débloquer le module.",
        "> Cliquez dessus pour l'activer et voir ce qu'il contient.",
        "> Attention, les Chemises Rouges ont blindé la sécurité :",
        "> Chaque outil ne répond qu'à un profil précis",
        "> Si l'accès est refusé, laissez faire l'agent avec le bon rôle.",
        "> — M. JACQUOT",
    ];

    const isRoleMismatch = selectedTool && selectedTool.roleKey !== 'all' && selectedTool.roleKey !== userRole;

    return (
        <main className="flex flex-col md:max-w-md mx-auto min-h-screen bg-[var(--color-dark)] pt-12">
            {selectedTool && (
                <DidacticModal
                    tool={selectedTool}
                    onClose={() => setSelectedTool(null)}
                    onConfirm={() => router.push(selectedTool.href)}
                    isRoleMismatch={isRoleMismatch}
                />
            )}

            <section className="flex flex-col h-full flex-1">
                <article className="text-[var(--color-light-green)] py-4 px-4 font-mono text-xs overflow-y-auto flex-shrink-0 min-h-[150px] max-h-[30vh] border-b border-[var(--color-light-green)]/30 bg-black/40 backdrop-blur-sm relative z-50">
                    <div className="flex flex-col gap-1 mt-2">
                        {startTyping && <TypewriterTerminal textLines={terminalLines} speed={15} />}
                    </div>
                </article>

                <div className="flex-1 p-6 flex flex-col gap-6">
                    <div className="text-center">
                        <h2 className="text-[var(--color-light-green)] font-mono text-2xl font-black uppercase tracking-widest">Pare-Feu</h2>
                        <p className="text-[13px] font-mono text-white/40 uppercase tracking-widest mt-1">Applications actives : {unlockedApps.length} / 5</p>
                    </div>

                    <div className="grid grid-cols-3 gap-5">
                        <AppIcon id="console" unlockedApps={['console', ...unlockedApps]} seenApps={seenApps} onOpen={handleOpenTool} />
                        <AppIcon id="scan" unlockedApps={unlockedApps} seenApps={seenApps} onOpen={handleOpenTool} />
                        <AppIcon id="puzzle" unlockedApps={unlockedApps} seenApps={seenApps} onOpen={handleOpenTool} />
                        <AppIcon id="phone" unlockedApps={unlockedApps} seenApps={seenApps} onOpen={handleOpenTool} />
                        <AppIcon id="boussole" unlockedApps={unlockedApps} seenApps={seenApps} onOpen={handleOpenTool} />
                        <AppIcon id="terminal" unlockedApps={unlockedApps} seenApps={seenApps} onOpen={handleOpenTool} />
                    </div>
                </div>
            </section>
        </main>
    );
}