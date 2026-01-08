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
            {/* Juste le maze en mode minimal, rien d'autre */}
            <Maze 
                showSolution={false} 
                isPlayable={true}
                minimalMode={true}
            />
        </section>
    );
}
