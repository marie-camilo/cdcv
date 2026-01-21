'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './Maze.module.css';
import { gameEvents, GAME_EVENTS } from '@/lib/gameEventBus';

// Labyrinthe 17x17
const MAZE_SIZE = 17;

const MAZE_DATA = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,1],
    [1,0,1,0,1,0,0,0,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,1,1,1,0,0,0,1,0,0,0,1,0,1],
    [1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,0,0,1,0,1,1,1,1,1,0,1,0,1,0,1],
    [1,1,1,0,1,0,1,0,0,0,1,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,1,1,1,0,1],
    [1,0,1,1,1,1,1,0,1,0,1,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,1,1,1,0,0,0,1],
    [1,0,0,0,1,1,1,0,0,0,0,0,1,0,1,1,1],
    [1,0,1,0,1,0,1,1,1,0,1,0,1,0,0,0,1],
    [1,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const generateRandomStartPos = () => {
    const centerPossibleStarts = [];
    const centerStart = Math.floor(MAZE_SIZE * 0.35);
    const centerEnd = Math.floor(MAZE_SIZE * 0.65);

    for (let y = centerStart; y < centerEnd; y++) {
        for (let x = centerStart; x < centerEnd; x++) {
            if (MAZE_DATA[y][x] === 0) {
                centerPossibleStarts.push({ x, y });
            }
        }
    }
    const randomIndex = Math.floor(Math.random() * centerPossibleStarts.length);
    return centerPossibleStarts[randomIndex];
};

const generateRandomExits = () => {
    return [
        {
            x: 3, y: 1,
            direction: 'NORD',
            backendDirection: 'north',
            type: 'VERTE',
            color: 'green',
            command: 'dress-to-impress', // Code Enquêteur
        },
        {
            x: MAZE_SIZE - 2, y: 12,
            direction: 'EST',
            backendDirection: 'east',
            type: 'VERTE',
            color: 'green',
            command: 'msp', // Code Saboteur
        },
        {
            x: 11, y: MAZE_SIZE - 2,
            direction: 'SUD',
            type: 'PIEGE',
            color: 'red',
            command: 'ERREUR_CRITIQUE'
        },
        {
            x: 1, y: 5,
            direction: 'OUEST',
            type: 'PIEGE',
            color: 'red',
            command: 'ACCÈS_REFUSÉ'
        }
    ];
};

export default function Maze({
                                 showSolution = false,
                                 isPlayable = true,
                                 minimalMode = false,
                                 onLivesChange = null,
                                 onMoveCountChange = null,
                                 onError = null,
                                 onExitReached = null,
                                 resetTrigger = 0
                             }) {
    const [exits] = useState(generateRandomExits());
    const [startPos] = useState(generateRandomStartPos());
    const [cursorPos, setCursorPos] = useState(startPos);
    const [hasReached, setHasReached] = useState({});
    const [mounted, setMounted] = useState(false);

    const [lives, setLives] = useState(10);
    const [moveCount, setMoveCount] = useState(0);
    const [showLifeLost, setShowLifeLost] = useState(false);
    const [exitCommands, setExitCommands] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [exitFound, setExitFound] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (resetTrigger > 0) {
            setCursorPos(startPos);
            setMoveCount(0);
            setHasReached({});
            setExitCommands([]);
            setLives(10);
            setGameOver(false);
            setExitFound(false);
        }
    }, [resetTrigger, startPos]);

    useEffect(() => { if (onLivesChange) onLivesChange(lives); }, [lives, onLivesChange]);
    useEffect(() => { if (onMoveCountChange) onMoveCountChange(moveCount); }, [moveCount, onMoveCountChange]);

    useEffect(() => {
        if (!isPlayable && !minimalMode) return;
        if (gameOver || exitFound) return;

        const handleKeyDown = (e) => {
            let newPos = { ...cursorPos };
            let hasMoved = false;

            if (e.key === 'z' || e.key === 'ArrowUp') { newPos.y = Math.max(0, cursorPos.y - 1); hasMoved = true; }
            else if (e.key === 's' || e.key === 'ArrowDown') { newPos.y = Math.min(MAZE_SIZE - 1, cursorPos.y + 1); hasMoved = true; }
            else if (e.key === 'q' || e.key === 'ArrowLeft') { newPos.x = Math.max(0, cursorPos.x - 1); hasMoved = true; }
            else if (e.key === 'd' || e.key === 'ArrowRight') { newPos.x = Math.min(MAZE_SIZE - 1, cursorPos.x + 1); hasMoved = true; }

            if (!hasMoved) return;

            if (MAZE_DATA[newPos.y][newPos.x] === 1) {
                const newLives = lives - 1;
                setLives(newLives);
                setShowLifeLost(true);
                if (onError) onError();
                if (newLives <= 0) setGameOver(true);
                setTimeout(() => setShowLifeLost(false), 1000);
                return;
            }

            setCursorPos(newPos);
            setMoveCount(prev => prev + 1);

            const reachedExit = exits.find(exit => exit.x === newPos.x && exit.y === newPos.y);

            if (reachedExit && !hasReached[reachedExit.direction]) {
                if (reachedExit.type === 'VERTE') {
                    const exitData = {
                        direction: reachedExit.direction,
                        command: reachedExit.command,
                    };

                    setExitCommands(prev => [...prev, exitData]);
                    setExitFound(true);

                    // SAUVEGARDE DANS LE SIDEPANEL
                    const currentCodes = JSON.parse(localStorage.getItem('game_codes') || '[]');

                    // On évite les doublons si le joueur revient sur la page
                    if (!currentCodes.find(c => c.value === reachedExit.command)) {
                        currentCodes.push({
                            label: `LIBÉRATION (${reachedExit.direction})`,
                            value: reachedExit.command
                        });
                        localStorage.setItem('game_codes', JSON.stringify(currentCodes));

                        // On déclenche l'événement pour que le SidePanel se rafraîchisse s'il est ouvert
                        gameEvents.emit(GAME_EVENTS.LABYRINTH_COMPLETED, {
                            direction: reachedExit.backendDirection
                        });
                    }

                    if (onExitReached) onExitReached(reachedExit.backendDirection);
                } else {
                    setCursorPos(startPos);
                    if (onError) onError();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cursorPos, isPlayable, exits, hasReached, lives, minimalMode, startPos, gameOver, exitFound, onError, onExitReached]);

    if (minimalMode) {
        return (
            <div className={styles.minimalWrapper}>
                <div className={styles.minimalContainer}>
                    <div className={styles.mazeGrid}>
                        {MAZE_DATA.map((row, y) => (
                            <div key={y} className={styles.mazeRow}>
                                {row.map((cell, x) => (
                                    <div key={x} className={`${styles.mazeCellMinimal} ${cell === 1 ? styles.borderWall : ''}`}></div>
                                ))}
                            </div>
                        ))}
                    </div>
                    {mounted && exits.map((exit, idx) => (
                        <div key={idx} className={styles.exitPortal} style={{ left: `${((exit.x + 0.5) / MAZE_SIZE) * 100}%`, top: `${((exit.y + 0.5) / MAZE_SIZE) * 100}%` }} />
                    ))}
                    {mounted && (
                        <div className={styles.playerDot} style={{ left: `${((cursorPos.x + 0.5) / MAZE_SIZE) * 100}%`, top: `${((cursorPos.y + 0.5) / MAZE_SIZE) * 100}%` }} />
                    )}
                </div>

                {exitCommands.length > 0 && (
                    <div className={styles.exitCommandsContainer}>
                        {exitCommands.map((exitCmd, idx) => (
                            <div key={idx} className={styles.exitCommandDisplay}>
                                <div className={styles.exitCommandHeader}>
                                    SORTIE TROUVÉE
                                </div>
                                <div className={styles.exitCommandBody}>
                                    <div className={styles.exitCommandLabel}>CODE DE LIBÉRATION :</div>
                                    <div className={styles.exitCommandCode}>{exitCmd.command}</div>
                                    <p className={styles.exitFinalTask}>
                                        <strong>Action requise :</strong> Écrivez ce code dans le tchat pour que les agents vous laissent sortir et passer à la suite des énigmes.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={styles.mazeContainer}>
            <div className={styles.mazeGrid}>
                {MAZE_DATA.map((row, y) => (
                    <div key={y} className={styles.mazeRow}>
                        {row.map((cell, x) => (
                            <div key={x} className={`${styles.mazeCell} ${cell === 1 ? styles.wall : ''}`}></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}