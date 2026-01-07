"use client";
import React, { useEffect } from 'react';
import Maze from '@/components/organisms/Maze';
import styles from './page.module.css';

export default function TeamAPage() {
    useEffect(() => {
        document.title = "Énigme 3 - Équipe A | La Click";
    }, []);

    return (
        <section className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>
                    [ ÉQUIPE A - GUIDES ]
                </h1>
                <p className={styles.subtitle}>
                    → Vous voyez le labyrinthe complet avec la solution
                </p>
                <p className={styles.description}>
                    Guidez l'Équipe B vers l'objectif via le Talkie-Walkie
                </p>
            </div>

            {/* Mission Info */}
            <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                    <div className={styles.infoLabel}>STATUT</div>
                    <div className={styles.infoValue}>EN MISSION</div>
                </div>
                <div className={styles.infoCard}>
                    <div className={styles.infoLabel}>RÔLE</div>
                    <div className={styles.infoValue}>OBSERVATION</div>
                </div>
            </div>

            {/* Légende */}
            <div className={styles.legend}>
                <div className={styles.legendTitle}>LÉGENDE</div>
                <div className={styles.legendGrid}>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendWall}`}></div>
                        <span>Mur</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendPath}`}></div>
                        <span>Chemin</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendSolution}`}></div>
                        <span className={styles.textRed}>Solution</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendEnd}`}></div>
                        <span className={styles.textRed}>Objectif</span>
                    </div>
                </div>
            </div>

            {/* Labyrinthe */}
            <Maze showSolution={true} isPlayable={false} />

            {/* Instructions */}
            <div className={styles.instructions}>
                <h2 className={styles.instructionsTitle}>INSTRUCTIONS</h2>
                <ul className={styles.instructionsList}>
                    <li>
                        <span className={styles.bullet}>▸</span>
                        <span>Utilisez le Talkie-Walkie pour communiquer avec l'Équipe B</span>
                    </li>
                    <li>
                        <span className={styles.bullet}>▸</span>
                        <span>Le chemin en <span className={styles.textRed}>rouge transparent</span> est la solution optimale</span>
                    </li>
                    <li>
                        <span className={styles.bullet}>▸</span>
                        <span>Guidez-les jusqu'à la case <span className={styles.textRed}>rouge vif</span> (objectif)</span>
                    </li>
                    <li>
                        <span className={styles.bullet}>▸</span>
                        <span className={styles.textRed}>⚠️ Attention aux imposteurs qui peuvent donner de fausses directions</span>
                    </li>
                </ul>
            </div>
        </section>
    );
}
