"use client";
import React, { useState, useEffect } from "react";
import Maze from "@/components/organisms/Maze";
import MazeLayoutWithLabels from "@/components/layouts/MazeLayoutWithLabels";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import {apiFetch} from "@/hooks/API/fetchAPI";

export default function TeamBPage() {
    const [lives, setLives] = useState(10); // ✅ CHANGÉ : 10 vies au lieu de 5
    const [moveCount, setMoveCount] = useState(0);
    const [showWarning, setShowWarning] = useState(true);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [gameCode, setGameCode] = useState(null);
    const [malusCount, setMalusCount] = useState(0);
    const [isCompleting, setIsCompleting] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            if (!localStorage.getItem("page459")) {
                localStorage.setItem('page459', 'navigateur394');
            } else if (localStorage.getItem("page459") !== 'navigateur394') {
                router.replace('/enigme-3/guideur');
            }

            // ✅ UTILISER apiFetch au lieu de fetch
            try {
                const data = await apiFetch('/api/v1/labyrinth/code');

                if (data.code) {
                    setGameCode(data.code);
                    console.log('✅ Game code récupéré:', data.code);
                } else {
                    console.error('❌ Aucun code de partie associé au labyrinthe');
                }
            } catch (err) {
                console.error('❌ Erreur récupération game_code:', err);
            }
        };

        init();
    }, [router]);

    useEffect(() => {
        document.title = "Énigme 3 - Équipe B | La Click";
    }, []);

    const handleReset = () => {
        setResetTrigger(prev => prev + 1);
        setMalusCount(0); // Reset malus aussi
    };

    const closeWarning = () => {
        setShowWarning(false);
    };

    // 🎯 Fonction appelée quand le joueur trouve une sortie

    const handleExitReached = async (exitDirection) => {
        if (isCompleting || !gameCode) {
            console.warn('Completion déjà en cours ou pas de game code');
            return;
        }

        setIsCompleting(true);

        try {
            console.log('📡 Envoi completion labyrinthe...', {
                game_code: gameCode,
                exit_direction: exitDirection,
                malus_count: malusCount
            });

            const data = await apiFetch('/api/v1/labyrinth/complete', {
                method: 'POST',
                body: JSON.stringify({
                    game_code: gameCode,
                    exit_direction: exitDirection,
                    malus_count: malusCount
                })
            });

            if (data.success) {
                // ... ton code succès ...
            } else {
                alert('Erreur : ' + data.message);
                setIsCompleting(false);
            }
        } catch (err) {
            console.error('❌ Erreur soumission labyrinthe:', err);
            alert('Erreur de connexion');
            setIsCompleting(false);
        }
    };

    // Incrémenter malus à chaque erreur
    const handleError = () => {
        setMalusCount(prev => prev + 1);
    };

    return (
        <section className={styles.pageContainer}>
            {/* Popup d'avertissement */}
            {showWarning && (
                <div className={styles.warningOverlay}>
                    <div className={styles.warningModal}>
                        <div className={styles.warningHeader}>
                            <span className={styles.warningIcon}>⚠️</span>
                            <h2 className={styles.warningTitle}>ATTENTION PILOTES</h2>
                        </div>

                        <div className={styles.warningContent}>
                            <p className={styles.warningText}>
                                Vous êtes dans une <strong>zone restreinte</strong>.
                            </p>
                            <p className={styles.warningText}>
                                ⚠️ <strong>NE BOUGEZ PAS</strong> avant d'avoir établi le contact avec votre équipe.
                            </p>
                            <p className={styles.warningText}>
                                Attendez leurs instructions. Chaque mouvement compte.
                            </p>
                            <p className={styles.warningTextDanger}>
                                {/* ✅ CHANGÉ : Texte mis à jour */}
                                10 erreurs maximum | Chaque erreur = malus de 1 minute (max 10 minutes)
                            </p>
                        </div>

                        <button onClick={closeWarning} className={styles.warningButton}>
                            J'ai compris - Commencer
                        </button>
                    </div>
                </div>
            )}

            {/* ✅ MODIF : Alerte CODE MANQUANT plus grosse et visible */}
            {!gameCode && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm">
                    <div className="max-w-md w-full mx-4 p-8 bg-red-900/40 border-4 border-red-500 rounded-xl shadow-[0_0_50px_rgba(239,68,68,0.6)] animate-pulse">
                        <div className="flex flex-col items-center text-center">
                            <span className="text-6xl mb-4">⚠️</span>
                            <h2 className="text-3xl font-black text-red-500 mb-4 font-mono uppercase tracking-wider">
                                CODE PARTIE MANQUANT
                            </h2>
                            <p className="text-white text-lg mb-6">
                                Le labyrinthe n'a pas été initialisé.
                            </p>
                            <p className="text-red-400 font-mono text-sm">
                                Contactez l'équipe back-office pour associer ce labyrinthe à votre partie.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.mazeWrapper}>
                <div className={styles.infoBar}>
                    {/* ✅ MODIF : 10 hearts au lieu de 5 */}
                    <div className={styles.heartsContainer}>
                        {[...Array(10)].map((_, i) => (
                            <span key={i} className={i < lives ? styles.heartFull : styles.heartEmpty}>
                                ♥
                            </span>
                        ))}
                    </div>

                    {/* ✅ MODIF : Affichage malus en minutes */}
                    <div className="text-orange-500 font-mono font-bold">
                        Malus: {malusCount} (-{malusCount}min)
                    </div>

                    {/* Reset */}
                    <div className={styles.rightGroup}>
                        <button onClick={handleReset} className={styles.resetButton}>
                            ↻
                        </button>
                    </div>
                </div>

                <MazeLayoutWithLabels>
                    <Maze
                        showSolution={false}
                        isPlayable={true}
                        minimalMode={true}
                        onLivesChange={setLives}
                        onMoveCountChange={setMoveCount}
                        onError={handleError}
                        onExitReached={handleExitReached}
                        resetTrigger={resetTrigger}
                    />
                </MazeLayoutWithLabels>
            </div>
        </section>
    );
}