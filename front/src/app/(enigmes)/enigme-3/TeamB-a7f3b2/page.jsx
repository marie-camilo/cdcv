"use client";
import React, { useState, useEffect } from "react";
import Maze from "@/components/organisms/Maze";
import MazeLayoutWithLabels from "@/components/layouts/MazeLayoutWithLabels";
import styles from "./page.module.css";

export default function TeamBPage() {
    const [lives, setLives] = useState(5);
    const [moveCount, setMoveCount] = useState(0);
    const [showWarning, setShowWarning] = useState(true);
    const [resetTrigger, setResetTrigger] = useState(0); // Trigger pour reset

    useEffect(() => {
        document.title = "Énigme 3 - Équipe B | La Click";
    }, []);

    const handleReset = () => {
        // Incrémenter le trigger pour déclencher le reset dans Maze
        setResetTrigger(prev => prev + 1);
    };

    const closeWarning = () => {
        setShowWarning(false);
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
                                5 erreurs = GAME OVER | Pénalités : -2s → -30s → -2min → -5min
                            </p>
                        </div>

                        <button onClick={closeWarning} className={styles.warningButton}>
                            J'ai compris - Commencer
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.mazeWrapper}>
                {/* Infos positionnées en absolu */}
                <div className={styles.infoBar}>
                    {/* Hearts à gauche */}
                    <div className={styles.heartsContainer}>
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < lives ? styles.heartFull : styles.heartEmpty}>
                                ♥
                            </span>
                        ))}
                    </div>

                    {/* Reset à droite */}
                    <div className={styles.rightGroup}>
                        <button onClick={handleReset} className={styles.resetButton}>
                            ↻
                        </button>
                    </div>
                </div>

                {/* Maze avec labels */}
                <MazeLayoutWithLabels>
                    <Maze
                        showSolution={false}
                        isPlayable={true}
                        minimalMode={true}
                        onLivesChange={setLives}
                        onMoveCountChange={setMoveCount}
                        resetTrigger={resetTrigger}
                    />
                </MazeLayoutWithLabels>
            </div>
        </section>
    );
}