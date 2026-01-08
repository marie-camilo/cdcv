"use client";
import React, { useEffect } from 'react';
import Maze from '@/components/organisms/Maze';
import TerminalLogs from '@/components/organisms/TerminalLogs';
import styles from './page.module.css';

export default function TeamAPage() {
    useEffect(() => {
        document.title = "Énigme 3 - Équipe A | La Click";
    }, []);

    return (
        <section className={styles.container}>
            {/* Les logs prennent toute la place au début */}
            <div className={styles.logsWrapper}>
                <TerminalLogs minimizable={true} />
            </div>

            {/* Le labyrinthe est en dessous, caché par les logs */}
            <div className={styles.mazeWrapper}>
                <Maze 
                    showSolution={true} 
                    isPlayable={false}
                    minimalMode={false}
                />
            </div>
        </section>
    );
}
