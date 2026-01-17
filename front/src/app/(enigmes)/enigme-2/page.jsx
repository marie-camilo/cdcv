"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Pusher from "pusher-js";
import CodeSlots from '@/components/molecules/enigme2/CodeSlots';
import LockerGrid from '@/components/molecules/enigme2/LockerGrid';
import VictoryPopup from '@/components/molecules/enigme2/VictoryPopup';
import { validateGameStep } from "@/hooks/API/gameRequests";

export default function Enigme2Page() {
    const router = useRouter();
    const CORRECT_LOCKER = 'right';
    const [codeDigits, setCodeDigits] = useState({ motus: null, simon: null, zip: null, tuile: null });
    const [leftLocker, setLeftLocker] = useState('locked');
    const [rightLocker, setRightLocker] = useState('locked');
    const [leftCases, setLeftCases] = useState(Array(8).fill(null));
    const [rightCases, setRightCases] = useState(Array(8).fill(null));
    const [showVictory, setShowVictory] = useState(false);
    const [gameCode, setGameCode] = useState(null);

    const pusherRef = useRef(null);

    // ✅ 1) Récupération du code + chargement initial
    useEffect(() => {
        const code = localStorage.getItem('currentGameCode');
        setGameCode(code);
        loadLocalStatus();
    }, []);

    // ✅ 2) ÉCOUTE PUSHER pour synchronisation temps réel
    useEffect(() => {
        if (!gameCode || pusherRef.current) return;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
            cluster: "eu",
            forceTLS: true,
        });
        pusherRef.current = pusher;

        const channel = pusher.subscribe(`game.${gameCode}`);

        // 🔥 Synchronisation des cases Snake et Cadenas
        channel.bind('EnigmaUpdated', (data) => {
            console.log("📡 ÉNIGME 2 - Mise à jour reçue:", data.payload);

            const { type, side, index, status } = data.payload;

            if (type === 'case_update') {
                if (index === -1) {
                    // C'est un cadenas (locker)
                    if (side === 'left') {
                        setLeftLocker(status);
                        localStorage.setItem(`locker_${side}`, status);
                        console.log("🔓 Cadenas GAUCHE déverrouillé");
                    } else {
                        setRightLocker(status);
                        localStorage.setItem(`locker_${side}`, status);
                        console.log("🔓 Cadenas DROITE déverrouillé");
                    }
                } else {
                    // C'est une case Snake
                    if (side === 'left') {
                        setLeftCases(prev => {
                            const n = [...prev];
                            n[index] = status;
                            localStorage.setItem(`snake_${side}_${index}`, status);
                            return n;
                        });
                    } else {
                        setRightCases(prev => {
                            const n = [...prev];
                            n[index] = status;
                            localStorage.setItem(`snake_${side}_${index}`, status);
                            return n;
                        });
                    }
                    console.log(`✅ Case ${side} [${index}] = ${status}`);
                }
            }

            // 🔥 Synchronisation des chiffres du code (Motus, Zip, etc.)
            if (type === 'digit_update') {
                const key = side.replace('_digit', '');
                const digitValue = parseInt(status);

                setCodeDigits(prev => {
                    const updated = { ...prev, [key]: digitValue };
                    localStorage.setItem(side, status);
                    console.log(`🔢 Chiffre ${key.toUpperCase()} = ${digitValue}`);
                    return updated;
                });
            }
        });

        // 🔥 Écoute du déblocage de l'app 'puzzle'
        channel.bind('AppUnlocked', (data) => {
            console.log("🔓 APP DÉBLOQUÉE:", data.appId);

            if (data.appId === 'puzzle') {
                const unlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');
                if (!unlocked.includes('puzzle')) {
                    unlocked.push('puzzle');
                    localStorage.setItem('unlockedApps', JSON.stringify(unlocked));
                }
                setShowVictory(true);
            }
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe(`game.${gameCode}`);
            pusher.disconnect();
            pusherRef.current = null;
        };
    }, [gameCode]);

    const loadLocalStatus = () => {
        // Chargement des chiffres depuis localStorage
        const storedDigits = {
            motus: localStorage.getItem('motus_digit'),
            simon: localStorage.getItem('simon_digit'),
            zip: localStorage.getItem('zip_digit'),
            tuile: localStorage.getItem('tuile_digit')
        };

        setCodeDigits({
            motus: storedDigits.motus ? parseInt(storedDigits.motus) : null,
            simon: storedDigits.simon ? parseInt(storedDigits.simon) : null,
            zip: storedDigits.zip ? parseInt(storedDigits.zip) : null,
            tuile: storedDigits.tuile ? parseInt(storedDigits.tuile) : null
        });

        // Chargement des états des cadenas
        if (localStorage.getItem('locker_left') === 'unlocked') setLeftLocker('unlocked');
        if (localStorage.getItem('locker_right') === 'unlocked') setRightLocker('unlocked');

        // Chargement des états des cases Snake
        const newLeft = [...leftCases];
        const newRight = [...rightCases];
        for (let i = 0; i < 8; i++) {
            newLeft[i] = localStorage.getItem(`snake_left_${i}`);
            newRight[i] = localStorage.getItem(`snake_right_${i}`);
        }
        setLeftCases(newLeft);
        setRightCases(newRight);
    };

    const handleCaseClick = (side, caseIndex) => {
        const cases = side === 'left' ? leftCases : rightCases;
        if (cases[caseIndex] === 'success') return; // Déjà validée

        const lockerState = side === 'left' ? leftLocker : rightLocker;
        if (lockerState === 'unlocked') {
            router.push(`/enigme-2/snake?locker=${side}&case=${caseIndex}`);
        }
    };

    const handleLockerClick = (side) => {
        const currentStatus = side === 'left' ? leftLocker : rightLocker;
        if (currentStatus === 'locked') {
            router.push(`/enigme-2/fleche?target=${side}`);
        }
    };

    const handleVictoryConfirm = async () => {
        try {
            console.log("📡 Validation de l'Énigme 2...");
            await validateGameStep(gameCode);
            router.push('/');
        } catch (error) {
            console.error("❌ Erreur validation Énigme 2:", error);
            router.push('/');
        }
    };

    return (
        <main className="min-h-[100dvh] w-full flex flex-col md:max-w-md mx-auto p-4 bg-[var(--color-darker-red)] overflow-hidden">

            <CodeSlots digits={codeDigits} />

            <article className="flex flex-col gap-10 justify-start items-center text-white flex-1 py-4 overflow-y-auto">

                {/* BLOC GAUCHE */}
                <div className="flex flex-col items-center gap-2 w-full">
                    {/* Inscription visible uniquement si débloqué */}
                    {leftLocker === 'unlocked' && (
                        <span className="text-[var(--color-sand)] font-mono text-xs font-bold tracking-[4px] opacity-80 animate-pulse">
                            ZONE GAUCHE
                        </span>
                    )}
                    <LockerGrid
                        side="left"
                        status={leftLocker}
                        cases={leftCases}
                        onLockerClick={handleLockerClick}
                        onCaseClick={handleCaseClick}
                    />
                </div>

                {/* BLOC DROITE */}
                <div className="flex flex-col items-center gap-2 w-full">
                    {/* Inscription visible uniquement si débloqué */}
                    {rightLocker === 'unlocked' && (
                        <span className="text-[var(--color-sand)] font-mono text-xs font-bold tracking-[4px] opacity-80 animate-pulse">
                            ZONE DROITE
                        </span>
                    )}
                    <LockerGrid
                        side="right"
                        status={rightLocker}
                        cases={rightCases}
                        onLockerClick={handleLockerClick}
                        onCaseClick={handleCaseClick}
                    />
                </div>

            </article>

            <VictoryPopup
                isOpen={showVictory}
                codeDigits={codeDigits}
                correctLockerSide={CORRECT_LOCKER}
                onConfirm={handleVictoryConfirm}
            />
        </main>
    );
}