"use client";
import React, { useEffect } from 'react';
import Maze from '@/components/organisms/Maze';
import styles from './page.module.css';

export default function TeamBPage() {
    useEffect(() => {
        document.title = "Énigme 3 - Équipe B | La Click";
    }, []);

    return (
        <section className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>
                    [ ÉQUIPE B - PILOTES ]
                </h1>
                <p className={styles.subtitle}>
                    → Vous contrôlez le curseur dans le labyrinthe
                </p>
                <p className={styles.description}>
                    Suivez les instructions de l'Équipe A pour atteindre l'objectif
                </p>
            </div>

            {/* Mission Info */}
            <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                    <div className={styles.infoLabel}>STATUT</div>
                    <div className={styles.infoValue}>EN DÉPLACEMENT</div>
                </div>
                <div className={styles.infoCard}>
                    <div className={styles.infoLabel}>RÔLE</div>
                    <div className={styles.infoValue}>NAVIGATION</div>
                </div>
            </div>

            {/* Contrôles */}
            <div className={styles.controls}>
                <div className={styles.controlsTitle}>CONTRÔLES</div>
                <div className={styles.controlsGrid}>
                    <div className={styles.controlKey}>
                        <div className={styles.keyLabel}>Z / ↑</div>
                        <div className={styles.keyDesc}>Haut</div>
                    </div>
                    <div className={styles.controlKey}>
                        <div className={styles.keyLabel}>Q / ←</div>
                        <div className={styles.keyDesc}>Gauche</div>
                    </div>
                    <div className={styles.controlKey}>
                        <div className={styles.keyLabel}>S / ↓</div>
                        <div className={styles.keyDesc}>Bas</div>
                    </div>
                    <div className={styles.controlKey}>
                        <div className={styles.keyLabel}>D / →</div>
                        <div className={styles.keyDesc}>Droite</div>
                    </div>
                </div>
            </div>

            {/* Légende */}
            <div className={styles.legend}>
                <div className={styles.legendTitle}>LÉGENDE</div>
                <div className={styles.legendGrid}>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendWall}`}></div>
                        <span>Mur (collision)</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendCursor}`}></div>
                        <span className={styles.textCyan}>Votre position</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendEnd}`}></div>
                        <span className={styles.textRed}>Objectif</span>
                    </div>
                </div>
            </div>

            {/* Labyrinthe */}
            <Maze showSolution={false} isPlayable={true} />

            {/* Instructions */}
            <div className={styles.instructions}>
                <h2 className={styles.instructionsTitle}>INSTRUCTIONS</h2>
                <ul className={styles.instructionsList}>
                    <li>
                        <span className={styles.bullet}>▸</span>
                        <span>Écoutez attentivement les instructions de l'Équipe A via le Talkie-Walkie</span>
                    </li>
                    <li>
                        <span className={styles.bullet}>▸</span>
                        <span>Utilisez ZQSD ou les flèches directionnelles pour vous déplacer</span>
                    </li>
                    <li>
                        <span className={styles.bullet}>▸</span>
                        <span>Si vous heurtez un mur, vous ne pourrez pas avancer dans cette direction</span>
                    </li>
                    <li>
                        <span className={styles.bullet}>▸</span>
                        <span>Atteignez la case <span className={styles.textRed}>rouge</span> pour terminer l'énigme</span>
                    </li>
                    <li>
                        <span className={styles.bullet}>▸</span>
                        <span className={styles.textRed}>⚠️ Méfiez-vous des fausses instructions des imposteurs</span>
                    </li>
                </ul>
            </div>

            {/* Log system */}
            <div className={styles.logs}>
                <div className={styles.logText}>[SYS_LOG] Système de navigation actif...</div>
                <div className={styles.logCommand}>$ Déplacements: Utilisez ZQSD ou flèches</div>
            </div>
        </section>
    );
}
