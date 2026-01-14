"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CodeSlots from '@/components/molecules/enigme2/CodeSlots';
import LockerGrid from '@/components/molecules/enigme2/LockerGrid';
import VictoryPopup from '@/components/molecules/enigme2/VictoryPopup';

export default function Enigme2Page() {
    const router = useRouter();
    const CORRECT_LOCKER = 'right';
    const [codeDigits, setCodeDigits] = useState({ motus: null, simon: null, zip: null, tuile: null });
    const [leftLocker, setLeftLocker] = useState('locked');
    const [rightLocker, setRightLocker] = useState('locked');
    const [leftCases, setLeftCases] = useState(Array(8).fill(null));
    const [rightCases, setRightCases] = useState(Array(8).fill(null));
    const [showVictory, setShowVictory] = useState(false);

    useEffect(() => {
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

        // Lockers status
        if (localStorage.getItem('locker_left') === 'unlocked') setLeftLocker('unlocked');
        if (localStorage.getItem('locker_right') === 'unlocked') setRightLocker('unlocked');

        // Snake cases status
        const newLeftCases = [...leftCases];
        const newRightCases = [...rightCases];

        for (let i = 0; i < 8; i++) {
            const l = localStorage.getItem(`snake_left_${i}`);
            const r = localStorage.getItem(`snake_right_${i}`);
            if (l) newLeftCases[i] = l;
            if (r) newRightCases[i] = r;
        }
        setLeftCases(newLeftCases);
        setRightCases(newRightCases);

        // Validation locker
        if (newLeftCases.every(c => c !== null)) {
            setLeftLocker(newLeftCases.some(c => c === 'success') ? 'validated' : 'failed');
        }
        if (newRightCases.every(c => c !== null)) {
            setRightLocker(newRightCases.some(c => c === 'success') ? 'validated' : 'failed');
        }
    }, []);

    // victoire
    useEffect(() => {
        const hasAllDigits = Object.values(codeDigits).every(v => v !== null);
        const correctCases = CORRECT_LOCKER === 'left' ? leftCases : rightCases;
        const hasFoundCorrectLocker = correctCases.some(c => c === 'success');

        if (hasAllDigits && hasFoundCorrectLocker) {
            if (CORRECT_LOCKER === 'left') setLeftLocker('validated');
            else setRightLocker('validated');
            setShowVictory(true);
        }
    }, [codeDigits, leftCases, rightCases]);

    // handlers
    const handleLockerClick = (side) => {
        const currentStatus = side === 'left' ? leftLocker : rightLocker;
        if (currentStatus === 'locked') {
            router.push(`/enigme-2/fleche?target=${side}`);
        }
    };

    const handleCaseClick = (side, caseIndex) => {
        const lockerState = side === 'left' ? leftLocker : rightLocker;
        const cases = side === 'left' ? leftCases : rightCases;

        if (lockerState === 'unlocked' && cases[caseIndex] === null) {
            router.push(`/enigme-2/snake?locker=${side}&case=${caseIndex}`);
        }
    };

    const handleVictoryConfirm = () => {
        const unlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');
        if (!unlocked.includes('enigme2_completed')) {
            unlocked.push('enigme2_completed');
            localStorage.setItem('unlockedApps', JSON.stringify(unlocked));
        }
        router.push('/');
    };

    return (
        <main className="min-h-screen flex flex-col md:max-w-md mx-auto p-4">
            <section className="flex flex-col min-h-screen gap-6">

                {/* 1. Les Slots du haut */}
                <CodeSlots digits={codeDigits} />

                {/* 2. Les Casiers */}
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
            </section>

            <VictoryPopup
                isOpen={showVictory}
                codeDigits={codeDigits}
                correctLockerSide={CORRECT_LOCKER}
                onConfirm={handleVictoryConfirm}
            />
        </main>
    );
}