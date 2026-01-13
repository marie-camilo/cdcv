"use client";
import { useState, useEffect } from 'react';
import MazeLayoutWithLabels from '@/components/layouts/MazeLayoutWithLabels';
import Maze from '@/components/organisms/Maze';
import styles from './page.module.css';

export default function TeamAPage() {
    const [lives, setLives] = useState(4);
    const [moveCount, setMoveCount] = useState(0);

    useEffect(() => {
        document.title = "Énigme 3 - Équipe A | La Click";
    }, []);

    const handleReset = () => {
        // Reset géré par le composant Maze
    };

    return (
        <section className={styles.pageContainer}>
            <div className={styles.mazeWrapper}>

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
        </section>
    );
}