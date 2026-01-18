// app/(enigmes)/enigme-2/page.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CodeSlots from '@/components/molecules/enigme2/CodeSlots';
import LockerGrid from '@/components/molecules/enigme2/LockerGrid';
import VictoryPopup from '@/components/molecules/enigme2/VictoryPopup';
import { validateGameStep } from "@/hooks/API/gameRequests";
import { useEnigma2State, useUnlockedApps } from '@/hooks/API/useGameEvents';

export default function Enigme2Page() {
    const router = useRouter();
    const CORRECT_LOCKER = 'right';

    // ✅ Utilisation des hooks réactifs (PAS de Pusher ici !)
    const { codeDigits, leftLocker, rightLocker, leftCases, rightCases } = useEnigma2State();
    const unlockedApps = useUnlockedApps();

    const [showVictory, setShowVictory] = useState(false);
    const [gameCode, setGameCode] = useState(null);
// ✅ Conditions de victoire
    const allDigitsFound =
        codeDigits &&
        Object.values(codeDigits).every(d => d !== null);

    const rightLockerSolved =
        rightLocker === 'validated' &&
        rightCases?.[3] === 'success';

    useEffect(() => {
        setGameCode(localStorage.getItem('currentGameCode'));
    }, []);

    // Vérification victoire
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
        <main className="min-h-screen flex flex-col md:max-w-md mx-auto p-4">
            <CodeSlots digits={codeDigits} />
            <article className="flex flex-col gap-10 justify-start items-center text-white flex-1 py-4 overflow-y-auto">
                <LockerGrid
                    side="left"
                    status={leftLocker}
                    cases={leftCases}
                    onLockerClick={handleLockerClick}
                    onCaseClick={handleCaseClick}
                />
                <LockerGrid
                    side="right"
                    status={rightLocker}
                    cases={rightCases}
                    onLockerClick={handleLockerClick}
                    onCaseClick={handleCaseClick}
                />
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