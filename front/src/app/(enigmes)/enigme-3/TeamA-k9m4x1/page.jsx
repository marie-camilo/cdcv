"use client";
import React, { useEffect, useState } from 'react';
import Maze from '@/components/organisms/Maze';
import TerminalLogs from '@/components/organisms/TerminalLogs';
import styles from './page.module.css';

export default function TeamAPage() {
    const [showLogs, setShowLogs] = useState(true);

    useEffect(() => {
        document.title = "Énigme 3 - Équipe A | La Click";
    }, []);

    return (
        <section className={styles.container}>
            {/* Bouton pour réouvrir les logs (toujours présent) */}
            {!showLogs && (
                <button
                    onClick={() => setShowLogs(true)}
                    className={styles.reopenLogsButton}
                >
                    [+] Ouvrir Terminal
                </button>
            )}

            {/* Les logs sont TOUJOURS montés (même quand cachés) */}
            <div className={showLogs ? styles.fullscreenLogs : styles.hiddenLogs}>
                <TerminalLogs
                    minimizable={true}
                    onMinimize={() => setShowLogs(false)}
                />
            </div>

            {/* Le labyrinthe s'affiche quand les logs sont cachés */}
            {!showLogs && (
                <div className={styles.fullscreenMaze}>
                    <Maze
                        showSolution={false}
                        isPlayable={false}
                        minimalMode={false}
                    />
                </div>
            )}
        </section>
    );
}