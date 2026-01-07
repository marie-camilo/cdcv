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

// Solution path (coordonnées x,y)
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
const END_POS = { x: 13, y: 13 };

export default function Maze({ showSolution = false, isPlayable = false }) {
  const [cursorPos, setCursorPos] = useState(START_POS);
  const [hasReached, setHasReached] = useState(false);

  // Gestion des touches clavier
  useEffect(() => {
    if (!isPlayable) return;

    const handleKeyDown = (e) => {
      e.preventDefault();
      
      let newPos = { ...cursorPos };
      
      // ZQSD + Flèches
      switch(e.key.toLowerCase()) {
        case 'z':
        case 'arrowup':
          newPos.y = Math.max(0, cursorPos.y - 1);
          break;
        case 's':
        case 'arrowdown':
          newPos.y = Math.min(14, cursorPos.y + 1);
          break;
        case 'q':
        case 'arrowleft':
          newPos.x = Math.max(0, cursorPos.x - 1);
          break;
        case 'd':
        case 'arrowright':
          newPos.x = Math.min(14, cursorPos.x + 1);
          break;
        default:
          return;
      }

      // Vérifier si c'est un mur
      if (MAZE_DATA[newPos.y][newPos.x] === 1) {
        // Collision avec un mur - ne pas bouger
        return;
      }

      // Mouvement valide
      setCursorPos(newPos);

      // Vérifier si arrivé
      if (newPos.x === END_POS.x && newPos.y === END_POS.y) {
        setHasReached(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cursorPos, isPlayable]);

  // Vérifier si une cellule est sur le chemin solution
  const isOnSolutionPath = (x, y) => {
    return SOLUTION_PATH.some(pos => pos.x === x && pos.y === y);
  };

  return (
    <div className={styles.mazeContainer}>
      {/* Grille du labyrinthe */}
      <div className={styles.grid}>
        {MAZE_DATA.map((row, y) => (
          row.map((cell, x) => {
            const isCursor = isPlayable && cursorPos.x === x && cursorPos.y === y;
            const isStart = x === START_POS.x && y === START_POS.y;
            const isEnd = x === END_POS.x && y === END_POS.y;
            const isSolution = showSolution && isOnSolutionPath(x, y);
            
            let cellClass = `${styles.cell} `;
            
            if (cell === 1) {
              // Mur
              cellClass += styles.wall;
            } else {
              // Chemin
              cellClass += styles.path;
              
              if (isCursor) {
                cellClass += ` ${styles.cursor}`;
              } else if (isEnd) {
                cellClass += ` ${styles.end}`;
              } else if (isStart) {
                cellClass += ` ${styles.start}`;
              } else if (isSolution) {
                cellClass += ` ${styles.solution}`;
              }
            }

            return (
              <div
                key={`${x}-${y}`}
                className={cellClass}
              />
            );
          })
        ))}
      </div>

      {/* Commande Linux si arrivé */}
      {hasReached && (
        <div className={styles.commandBox}>
          <div className={styles.commandHeader}>
            [ SYSTÈME ] Objectif atteint - Commande de déverrouillage générée
          </div>
          <div className={styles.commandContent}> /// COMMANDE DONNEE PAR LE LABY
            <span className={styles.prompt}>$</span> echo "CODE_ACCES_SALLE_115" | sed 's/ACCES/REUNION/'
          </div>
          <div className={styles.commandFooter}>
            Exécutez cette commande dans le terminal pour obtenir le Code 1
          </div>
        </div>
      )}
    </div>
  );
}
