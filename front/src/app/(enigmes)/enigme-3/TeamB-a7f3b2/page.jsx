"use client";
import React, { useState, useEffect } from "react";
import Maze from "@/components/organisms/Maze";
import MazeLayoutWithLabels from "@/components/layouts/MazeLayoutWithLabels";
import styles from "./page.module.css";

export default function TeamBPage() {
    const [lives, setLives] = useState(4);
    const [moveCount, setMoveCount] = useState(0);
    const [showWarning, setShowWarning] = useState(true);

    useEffect(() => {
        document.title = "Énigme 3 - Équipe B | La Click";
    }, []);

    const handleReset = () => {
        // Reset géré par le composant Maze
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
                                Vos vies sont <strong>limitées</strong>.
                            </p>
                            <p className={styles.warningText}>
                                Communiquez efficacement avec votre équipe de Guides.
                            </p>
                            <p className={styles.warningTextDanger}>
                                ⚡ Si vous perdez toutes vos vies, votre timer en souffrira !
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
                        {[...Array(4)].map((_, i) => (
                            <span key={i} className={i < lives ? styles.heartFull : styles.heartEmpty}>
                                ♥
                            </span>
                        ))}
                    </div>

                    {/* Compteur + Reset à droite */}
                    <div className={styles.rightGroup}>
                        <div className={styles.counterBox}>
                            {moveCount} / 30
                        </div>
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
                        onReset={handleReset}
                    />
                </MazeLayoutWithLabels>
            </div>
        </section>
    );
}
