"use client";
import React, { useState, useEffect } from "react";
import Maze from "@/components/organisms/Maze";
import MazeLayoutWithLabels from "@/components/layouts/MazeLayoutWithLabels";
import styles from "./page.module.css";

export default function TeamBPage() {
    const [lives, setLives] = useState(4);
    const [moveCount, setMoveCount] = useState(0);

    useEffect(() => {
        document.title = "Énigme 3 - Équipe B | La Click";
    }, []);

    const handleReset = () => {
        // Reset géré par le composant Maze
    };

    return (
        <section className={styles.pageContainer}>
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