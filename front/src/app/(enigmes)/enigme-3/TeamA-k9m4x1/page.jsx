"use client";
import React, { useState, useEffect } from 'react';
import MazeLayoutWithLabels from '@/components/layouts/MazeLayoutWithLabels';
import Maze from '@/components/organisms/Maze';
import styles from './page.module.css';
import TerminalLogs from '@/components/organisms/TerminalLogs';

export default function TeamAPage() {
    const [lives, setLives] = useState(4);
    const [moveCount, setMoveCount] = useState(0);
    const [showLogs, setShowLogs] = useState(false);

    useEffect(() => {
        document.title = "Énigme 3 - Équipe A | La Click";
    }, []);

    const handleReset = () => {
        // Reset géré par le composant Maze
    };

    const toggleLogs = () => {
        setShowLogs(!showLogs);
    };

    return (
        <section className={styles.pageContainer}>
            <div className={styles.mazeWrapper}>
                {/* Bouton Logs en haut à gauche */}
                <div className={styles.logsButtonContainer}>
                    <button onClick={toggleLogs} className={styles.logsButton}>
                        <span className={styles.logsIcon}></span>
                        <span>LOGS</span>
                    </button>
                </div>

                {/* Maze avec labels */}
                <MazeLayoutWithLabels>
                    <Maze
                        showSolution={false}
                        isPlayable={true}
                        minimalMode={false}
                        onLivesChange={setLives}
                        onMoveCountChange={setMoveCount}
                        onReset={handleReset}
                    />
                </MazeLayoutWithLabels>
            </div>

            {/* Overlay Terminal Logs - plein écran */}
            {showLogs && (
                <div className={styles.logsOverlay}>
                    <div className={styles.logsOverlayContent}>
                        <TerminalLogs 
                            minimizable={true} 
                            onMinimize={toggleLogs}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
