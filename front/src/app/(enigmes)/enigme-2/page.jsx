    "use client";
    import React, { useState, useEffect } from 'react';
    import Link from 'next/link';
    import { useRouter } from 'next/navigation';

    export default function Enigme2Page() {
        const router = useRouter();

        // État pour les 4 chiffres du code (null = pas encore trouvé)
        const [codeDigits, setCodeDigits] = useState({
            motus: null,    // 1er chiffre
            simon: null,    // 2ème chiffre
            zip: null,      // 3ème chiffre
            tuile: null     // 4ème chiffre
        });

        // État des grilles ('locked', 'unlocked', 'validated', 'failed')
        const [leftLocker, setLeftLocker] = useState('locked');
        const [rightLocker, setRightLocker] = useState('locked');

        // État des cases snake pour chaque grille (null = pas joué, 'success' = bon, 'fail' = mauvais)
        const [leftCases, setLeftCases] = useState(Array(8).fill(null));
        const [rightCases, setRightCases] = useState(Array(8).fill(null));

        // Modal de victoire
        const [showVictory, setShowVictory] = useState(false);

        // ⚙️ CONFIGURATION : Quel est le BON casier ?
        const CORRECT_LOCKER = 'right'; // Changez en 'left' ou 'right'
        const CORRECT_CASE_INDEX = 6; // Case 7 (index 6) est la bonne

        // Récupérer les chiffres du localStorage au chargement
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

            // Vérifier l'état des casiers
            const leftLockerStatus = localStorage.getItem('locker_left');
            const rightLockerStatus = localStorage.getItem('locker_right');

            if (leftLockerStatus === 'unlocked') {
                setLeftLocker('unlocked');
            }
            if (rightLockerStatus === 'unlocked') {
                setRightLocker('unlocked');
            }

            // Récupérer les résultats du Snake pour chaque case
            const newLeftCases = [...leftCases];
            const newRightCases = [...rightCases];

            for (let i = 0; i < 8; i++) {
                const leftResult = localStorage.getItem(`snake_left_${i}`);
                const rightResult = localStorage.getItem(`snake_right_${i}`);

                if (leftResult === 'success') newLeftCases[i] = 'success';
                else if (leftResult === 'fail') newLeftCases[i] = 'fail';

                if (rightResult === 'success') newRightCases[i] = 'success';
                else if (rightResult === 'fail') newRightCases[i] = 'fail';
            }

            setLeftCases(newLeftCases);
            setRightCases(newRightCases);

            // Vérifier si un casier doit être validé ou échoué
            const leftAllPlayed = newLeftCases.every(c => c !== null);
            const rightAllPlayed = newRightCases.every(c => c !== null);

            if (leftAllPlayed) {
                const hasLeftSuccess = newLeftCases.some(c => c === 'success');
                setLeftLocker(hasLeftSuccess ? 'validated' : 'failed');
            }

            if (rightAllPlayed) {
                const hasRightSuccess = newRightCases.some(c => c === 'success');
                setRightLocker(hasRightSuccess ? 'validated' : 'failed');
            }
        }, []);

        // Vérifier si victoire (bon casier validé + les 4 chiffres)
        useEffect(() => {
            const hasAllDigits = Object.values(codeDigits).every(v => v !== null);
            const correctLockerValidated = CORRECT_LOCKER === 'left'
                ? leftLocker === 'validated'
                : rightLocker === 'validated';

            if (hasAllDigits && correctLockerValidated) {
                setShowVictory(true);
            }
        }, [codeDigits, leftLocker, rightLocker]);

        // Gestion du clic sur une grille verrouillée
        const handleLockerClick = (side, e) => {
            e.stopPropagation();
            const lockerState = side === 'left' ? leftLocker : rightLocker;

            if (lockerState === 'locked') {
                // Lancer le mini-jeu "fleche" pour déverrouiller
                router.push(`/enigme-2/fleche?target=${side}`);
            }
        };

        // Gestion du clic sur une case snake
        const handleCaseClick = (side, caseIndex) => {
            const lockerState = side === 'left' ? leftLocker : rightLocker;
            const cases = side === 'left' ? leftCases : rightCases;

            // Ne peut jouer que si la grille est déverrouillée
            if (lockerState !== 'unlocked') return;

            // Si la case a déjà été jouée, ne rien faire
            if (cases[caseIndex] !== null) return;

            // Lancer le mini-jeu snake
            router.push(`/enigme-2/snake?locker=${side}&case=${caseIndex}`);
        };

        // Rendu d'une grille
        const renderLocker = (side) => {
            const lockerState = side === 'left' ? leftLocker : rightLocker;
            const cases = side === 'left' ? leftCases : rightCases;
            const isLocked = lockerState === 'locked';
            const isValidated = lockerState === 'validated';
            const isFailed = lockerState === 'failed';

            return (
                <div className="relative">
                    {/* Grille */}
                    <div
                        className={`size-80 grid grid-cols-3 grid-rows-3 border-2 transition-all ${
                            isLocked
                                ? 'border-2 cursor-pointer animate-glitch'
                                : 'border-2'
                        }`}
                    >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((position) => {
                            // Position 4 (centre) = case vide
                            if (position === 4) {
                                return (
                                    <div
                                        key={position}
                                        className={`border-1 flex items-center justify-center text-4xl ${
                                            isValidated
                                                ? 'bg-green-500 text-white'
                                                : isFailed
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-gray-500'
                                        }`}
                                    >
                                        {isValidated && '✓'}
                                        {isFailed && '✗'}
                                    </div>
                                );
                            }

                            // Les autres positions correspondent aux cases jouables
                            const caseIndex = position < 4 ? position : position - 1;
                            const caseState = cases[caseIndex];
                            const displayNumber = position < 4 ? position + 1 : position;

                            return (
                                <div
                                    key={position}
                                    className={`border-1 p-2 flex items-center justify-center text-lg font-bold transition-all ${
                                        isLocked
                                            ? 'cursor-not-allowed bg-gray-900'
                                            : caseState === 'success'
                                                ? 'bg-green-500 text-white cursor-default'
                                                : caseState === 'fail'
                                                    ? 'bg-red-500 text-white cursor-default'
                                                    : 'cursor-pointer hover:bg-gray-700'
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCaseClick(side, caseIndex);
                                    }}
                                >
                                    {displayNumber}
                                </div>
                            );
                        })}
                    </div>

                    {/* Overlay verrouillé */}
                    {isLocked && (
                        <div
                            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLockerClick(side, e);
                            }}
                        >
                            <div className="text-center pointer-events-none">
                                <div className="text-6xl mb-2">🔒</div>
                                <div className="text-white font-mono text-sm tracking-wider">PARE-FEU ACTIF</div>
                                <div className="text-white font-mono text-xs mt-2 opacity-70">Cliquez pour déverrouiller</div>
                            </div>
                        </div>
                    )}

                    {/* Message d'échec */}
                    {isFailed && (
                        <div className="absolute -bottom-8 left-0 right-0 text-center text-white text-xs font-mono">
                            ACCÈS REFUSÉ - MAUVAIS CASIER
                        </div>
                    )}
                </div>
            );
        };

        return (
            <main className="min-h-screen flex flex-col md:max-w-md mx-auto p-4">
                <section className="flex flex-col min-h-screen gap-2">
                    {/* Zone des 4 chiffres du code */}
                    <article className="py-4 px-4 font-mono text-xs border-2 flex justify-around items-center flex-shrink-0">
                        {['motus', 'simon', 'zip', 'tuile'].map((game) => (
                            <Link
                                key={game}
                                href={`/enigme-2/${game}`}
                                className="border-2 size-16 flex items-center justify-center text-2xl font-bold hover:bg-gray-800 transition-all"
                            >
                                {codeDigits[game] !== null ? (
                                    <span className="text-white">{codeDigits[game]}</span>
                                ) : (
                                    <span className="text-white">🔒</span>
                                )}
                            </Link>
                        ))}
                    </article>

                    {/* Zone des 2 casiers */}
                    <article className="flex flex-col gap-6 justify-start items-center text-white flex-1 py-4 overflow-y-auto">
                        {renderLocker('left')}
                        {renderLocker('right')}
                    </article>
                </section>

                {/* Modal de victoire */}
                {showVictory && (
                    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900 border-4 border-white rounded-lg p-8 max-w-md text-center">
                            <div className="text-6xl mb-4">👔</div>
                            <h2 className="text-3xl font-bold text-white mb-4">CHEMISES ROUGES</h2>
                            <p className="text-white mb-4">
                                "Bien joué, vous avez déchiffré notre système. La chemise verte vous attend dans le casier <span className="font-bold">{CORRECT_LOCKER === 'left' ? 'GAUCHE' : 'DROITE'}</span>."
                            </p>
                            <p className="text-white text-sm mb-6">
                                Code : <span className="text-2xl font-mono font-bold">{Object.values(codeDigits).join('')}</span>
                            </p>
                            <p className="text-gray-400 italic text-xs">
                                "Mais rappelez-vous... le temps presse. ⏱️"
                            </p>
                        </div>
                    </div>
                )}

                <style jsx>{`
                    @keyframes glitch {
                        0%, 100% { transform: translate(0); }
                        20% { transform: translate(-2px, 2px); }
                        40% { transform: translate(2px, -2px); }
                        60% { transform: translate(-2px, -2px); }
                        80% { transform: translate(2px, 2px); }
                    }
                    .animate-glitch {
                        animation: glitch 0.5s infinite;
                    }
                `}</style>
            </main>
        );
    }