'use client';

import { useState, useEffect } from 'react';
import styles from './Maze.module.css';

// Labyrinthe hardcodé 12x12
// 0 = chemin, 1 = mur
// Design chaotique et asymétrique
const MAZE_SIZE = 12;

const MAZE_DATA = [
  [1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,1,0,0,1],
  [1,1,0,1,1,0,1,0,0,0,1,1],
  [1,0,0,0,0,0,1,1,1,0,0,1],
  [1,0,1,1,0,1,0,0,0,1,0,1],
  [1,0,0,1,0,0,0,1,0,1,0,1],
  [1,1,0,0,1,1,0,1,0,0,0,1],
  [1,0,0,1,0,0,0,0,1,1,0,1],
  [1,0,1,1,1,0,1,0,0,0,0,1],
  [1,0,0,0,0,0,1,1,1,0,1,1],
  [1,0,1,1,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1],
];

// Solution path pour Team A (chemin unique vers la vraie sortie)
const SOLUTION_PATH = [
  {x:1, y:1}, {x:2, y:1}, {x:3, y:1},
  {x:3, y:2}, {x:3, y:3}, {x:4, y:3}, {x:5, y:3},
  {x:5, y:4}, {x:5, y:5}, {x:6, y:5}, {x:7, y:5},
  {x:8, y:5}, {x:9, y:5}, {x:10, y:5},
  {x:10, y:6}, {x:10, y:7}, {x:10, y:8}, {x:10, y:9},
  {x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13},
  {x:11, y:13}, {x:12, y:13}, {x:13, y:13}
];

const START_POS = { x: 1, y: 1 };

// Génération d'une position de départ aléatoire au centre du labyrinthe
const generateRandomStartPos = () => {
  const centerPossibleStarts = [];

  // Zone centrale : environ 30% du centre
  const centerStart = Math.floor(MAZE_SIZE * 0.35);
  const centerEnd = Math.floor(MAZE_SIZE * 0.65);

  // Trouver les chemins dans la zone centrale (loin des bords)
  for (let y = centerStart; y < centerEnd; y++) {
    for (let x = centerStart; x < centerEnd; x++) {
      if (MAZE_DATA[y][x] === 0) {
        centerPossibleStarts.push({ x, y });
      }
    }
  }

  // Si pas de chemins au centre, prendre n'importe où
  if (centerPossibleStarts.length === 0) {
    for (let y = 1; y < MAZE_SIZE - 1; y++) {
      for (let x = 1; x < MAZE_SIZE - 1; x++) {
        if (MAZE_DATA[y][x] === 0) {
          centerPossibleStarts.push({ x, y });
        }
      }
    }
  }

  // Retourner une position aléatoire
  const randomIndex = Math.floor(Math.random() * centerPossibleStarts.length);
  return centerPossibleStarts[randomIndex];
};

// Génération des 4 sorties avec leur type (ROUGE ou VERTE) et commandes shell
const generateRandomExits = () => {
  const middle = Math.floor(MAZE_SIZE / 2); // Position du milieu

  // 4 sorties fixes aux 4 points cardinaux
  return [
    {
      x: middle, y: 1,
      direction: 'NORD',
      type: 'ROUGE',
      color: 'red',
      command: 'echo "ACCES_SALLE_ROUGE_42" | base64'
    },
    {
      x: MAZE_SIZE - 2, y: middle,
      direction: 'EST',
      type: 'PIÈGE',
      color: 'orange',
      command: 'cat /dev/null'
    },
    {
      x: middle, y: MAZE_SIZE - 2,
      direction: 'SUD',
      type: 'PIÈGE',
      color: 'orange',
      command: 'rm -rf /hope'
    },
    {
      x: 1, y: middle,
      direction: 'OUEST',
      type: 'VERTE',
      color: 'green',
      command: 'echo "CODE_ACCES_SALLE_115" | sed \'s/ACCES/REUNION/\''
    }
  ];
};

export default function Maze({
                               showSolution = false,
                               isPlayable = false,
                               minimalMode = false // Mode minimal pour Team B
                             }) {
  const [cursorPos, setCursorPos] = useState(() => generateRandomStartPos());
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

          // Message personnalisé selon le type de sortie avec commande shell
          let message = '';
          if (reachedExit.type === 'ROUGE') {
            message = `🔴 SORTIE ROUGE (${reachedExit.direction})\n\nVous avez atteint la sortie des ROUGES (saboteurs) !\n\nCommande à exécuter :\n$ ${reachedExit.command}`;
          } else if (reachedExit.type === 'VERTE') {
            message = `🟢 SORTIE VERTE (${reachedExit.direction})\n\nVous avez atteint la sortie des VERTS (investigateurs) !\n\nCommande à exécuter :\n$ ${reachedExit.command}\n\nBRAVO ! 🎉`;
          } else {
            message = `⚠️ PIÈGE (${reachedExit.direction})\n\nCe n'est pas une vraie sortie...\n\n$ ${reachedExit.command}`;
          }

          alert(message);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cursorPos, isPlayable, exits, hasReached]);

  // MODE MINIMAL (Team B) - Grille visible mais tout noir + points flottants
  if (minimalMode) {
    return (
        <div className={styles.minimalWrapper}>
          {/* Commandes */}
          <div className={styles.controlsInfo}>
            <div className={styles.controlKey}>Z / ↑ = Haut</div>
            <div className={styles.controlKey}>Q / ← = Gauche</div>
            <div className={styles.controlKey}>S / ↓ = Bas</div>
            <div className={styles.controlKey}>D / → = Droite</div>
          </div>

          <div className={styles.minimalContainer}>
            {/* Grille en arrière-plan (tout noir, juste pour le repère visuel) */}
            <div className={styles.backgroundGrid}>
              {MAZE_DATA.map((row, y) => (
                  <div key={y} className={styles.backgroundRow}>
                    {row.map((cell, x) => (
                        <div key={x} className={styles.backgroundCell}></div>
                    ))}
                  </div>
              ))}
            </div>

            {/* Sorties flottantes par-dessus */}
            {exits.map((exit, idx) => (
                <div
                    key={idx}
                    className={styles.exitDot}
                    style={{
                      left: `${(exit.x / MAZE_SIZE) * 100}%`,
                      top: `${(exit.y / MAZE_SIZE) * 100}%`
                    }}
                />
            ))}

            {/* Le curseur du joueur par-dessus */}
            <div
                className={styles.playerDot}
                style={{
                  left: `${(cursorPos.x / MAZE_SIZE) * 100}%`,
                  top: `${(cursorPos.y / MAZE_SIZE) * 100}%`
                }}
            />
          </div>
        </div>
    );
  }

  // MODE NORMAL (Team A) - Grille complète avec murs visibles
  return (
      <div className={styles.mazeContainer}>
        <div className={styles.mazeGrid}>
          {MAZE_DATA.map((row, y) => (
              <div key={y} className={styles.mazeRow}>
                {row.map((cell, x) => {
                  const isWall = cell === 1;

                  let cellClass = styles.mazeCell;
                  if (isWall) cellClass += ` ${styles.wall}`;

                  return (
                      <div key={x} className={cellClass}></div>
                  );
                })}
              </div>
          ))}
        </div>
      </div>
  );
}