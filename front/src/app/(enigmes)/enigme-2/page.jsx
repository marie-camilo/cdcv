"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CodeSlots from '@/components/molecules/enigme2/CodeSlots';
import LockerGrid from '@/components/molecules/enigme2/LockerGrid';
import VictoryPopup from '@/components/molecules/enigme2/VictoryPopup';
import TypewriterTerminal from "@/components/molecules/TypewriterTerminal/TypewriterTerminal"; // ✅ Import ajouté
import { validateGameStep } from "@/hooks/API/gameRequests";
import { useEnigma2State, useUnlockedApps } from '@/hooks/API/useGameEvents';

export default function Enigme2Page() {
    const router = useRouter();
    const CORRECT_LOCKER = 'right';

    const { codeDigits, leftLocker, rightLocker, leftCases, rightCases } = useEnigma2State();
    const unlockedApps = useUnlockedApps();

    const [showVictory, setShowVictory] = useState(false);
    const [gameCode, setGameCode] = useState(null);

    const terminalLines = [
        "> Agents, écoutez bien.",
        "> Vous devez d'abord débloquer l'accès aux deux zones de casiers (Gauche et Droite).",
        "> Une fois l'accès ouvert, fouillez chaque compartiment via le protocole du jeu Snake.",
        "> Optimisez votre temps : partagez-vous les mini-jeux entre agents pour gagner en efficacité.",
        "> L'objectif final est de trouver le casier cible et de le dévérouiller grâce au code secret à 4 chiffres."
    ];

    const allDigitsFound =
        codeDigits &&
        Object.values(codeDigits).every(d => d !== null);

    const rightLockerSolved =
        rightLocker === 'validated' &&
        rightCases?.[3] === 'success';

    useEffect(() => {
        setGameCode(localStorage.getItem('currentGameCode'));
    }, []);

    useEffect(() => {
        if (allDigitsFound && rightLockerSolved && !showVictory) {
            setShowVictory(true);
        }
    }, [allDigitsFound, rightLockerSolved, showVictory]);

    const handleCaseClick = (side, caseIndex) => {
        const cases = side === 'left' ? leftCases : rightCases;
        if (cases[caseIndex] === 'success') return;

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

            <article className="shrink-0 pt-4 pb-2 border-b border-[var(--color-mid-red)]/30 min-h-[110px]">
                <TypewriterTerminal textLines={terminalLines} speed={20} />
            </article>

            <CodeSlots digits={codeDigits} />

            <article className="flex flex-col gap-10 justify-start items-center text-white flex-1 py-8 overflow-y-auto">

                {/* BLOC GAUCHE */}
                <div className="flex flex-col items-center gap-2 w-full">
                    {leftLocker === 'unlocked' && (
                        <span className="text-[var(--color-sand)] font-mono text-[10px] font-bold tracking-[4px] opacity-80 animate-pulse uppercase">
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
                    {rightLocker === 'unlocked' && (
                        <span className="text-[var(--color-sand)] font-mono text-[10px] font-bold tracking-[4px] opacity-80 animate-pulse uppercase">
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