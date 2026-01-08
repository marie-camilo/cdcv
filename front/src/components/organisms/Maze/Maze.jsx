'use client';

import { useState, useEffect } from 'react';
import styles from './Maze.module.css';

// Labyrinthe hardcodé 15x15
// 0 = chemin, 1 = mur
const MAZE_DATA = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
  [1,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,0,1,1,1,0,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,0,1,1,1,1,1,0,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,1,0,1,0,1],
  [1,1,1,0,1,0,1,1,1,0,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Solution path pour Team A
const SOLUTION_PATH = [
  {x:1, y:1}, {x:2, y:1}, {x:3, y:1},
  {x:3, y:2}, {x:3, y:3}, {x:4, y:3}, {x:5, y:3},
  {x:5, y:4}, {x:5, y:5}, {x:5, y:6}, {x:5, y:7},
  {x:5, y:8}, {x:5, y:9}, {x:6, y:9}, {x:7, y:9},
  {x:8, y:9}, {x:9, y:9}, {x:10, y:9}, {x:11, y:9},
  {x:11, y:10}, {x:11, y:11}, {x:11, y:12}, {x:11, y:13},
  {x:12, y:13}, {x:13, y:13}
];

const START_POS = { x: 1, y: 1 };

// Génération aléatoire des sorties (2 à 4 sorties)
const generateRandomExits = () => {
  const numExits = Math.floor(Math.random() * 3) + 2; // 2-4 sorties
  const possibleExits = [
    { x: 13, y: 1, direction: 'NORTH' },
    { x: 13, y: 13, direction: 'SOUTH' },
    { x: 1, y: 13, direction: 'EAST' },
    { x: 13, y: 7, direction: 'WEST' }
  ];
  
  // Shuffle et prendre numExits sorties
  const shuffled = possibleExits.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numExits);
};

export default function Maze({ 
  showSolution = false, 
  isPlayable = false,
  minimalMode = false // Mode minimal pour Team B
}) {
  const [cursorPos, setCursorPos] = useState(START_POS);
  const [exits] = useState(generateRandomExits());
  const [hasReached, setHasReached] = useState(false);

  // Gestion des touches clavier
  useEffect(() => {
    if (!isPlayable) return;

    const handleKeyDown = (e) => {
      e.preventDefault();
      
      let newPos = { ...cursorPos };
      
      // ZQSD + Flèches
      if (e.key === 'z' || e.key === 'Z' || e.key === 'ArrowUp') {
        newPos.y -= 1;
      } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        newPos.y += 1;
      } else if (e.key === 'q' || e.key === 'Q' || e.key === 'ArrowLeft') {
        newPos.x -= 1;
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        newPos.x += 1;
      }
      
      // Vérifier collision avec les murs
      if (MAZE_DATA[newPos.y]?.[newPos.x] === 0) {
        setCursorPos(newPos);
        
        // Vérifier si on a atteint une sortie
        const reachedExit = exits.find(exit => 
          exit.x === newPos.x && exit.y === newPos.y
        );
        
        if (reachedExit && !hasReached) {
          setHasReached(true);
          alert(`Sortie atteinte : ${reachedExit.direction}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cursorPos, isPlayable, exits, hasReached]);

  // MODE MINIMAL (Team B) - Juste le point et les sorties
  if (minimalMode) {
    return (
      <div className={styles.minimalContainer}>
        {/* Affichage minimal : juste le curseur et les sorties */}
        {exits.map((exit, idx) => (
          <div
            key={idx}
            className={styles.exitDot}
            style={{
              left: `${(exit.x / 15) * 100}%`,
              top: `${(exit.y / 15) * 100}%`
            }}
          />
        ))}
        
        {/* Le curseur du joueur */}
        <div
          className={styles.playerDot}
          style={{
            left: `${(cursorPos.x / 15) * 100}%`,
            top: `${(cursorPos.y / 15) * 100}%`
          }}
        />
      </div>
    );
  }

  // MODE NORMAL (Team A) - Vue complète
  const isSolutionCell = (x, y) => {
    return SOLUTION_PATH.some(pos => pos.x === x && pos.y === y);
  };

  const isExitCell = (x, y) => {
    return exits.some(exit => exit.x === x && exit.y === y);
  };

  return (
    <div className={styles.mazeContainer}>
      <div className={styles.mazeGrid}>
        {MAZE_DATA.map((row, y) => (
          <div key={y} className={styles.mazeRow}>
            {row.map((cell, x) => {
              const isWall = cell === 1;
              const isSolution = showSolution && isSolutionCell(x, y);
              const isExit = isExitCell(x, y);
              const isCursor = isPlayable && cursorPos.x === x && cursorPos.y === y;

              let cellClass = styles.mazeCell;
              if (isWall) cellClass += ` ${styles.wall}`;
              if (isSolution) cellClass += ` ${styles.solution}`;
              if (isExit) cellClass += ` ${styles.exit}`;
              if (isCursor) cellClass += ` ${styles.cursor}`;

              return (
                <div key={x} className={cellClass}>
                  {isExit && <span className={styles.exitLabel}>🚪</span>}
                  {isCursor && <span className={styles.cursorLabel}>●</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
