'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './Maze.module.css';

// Labyrinthe 17x17 - Tres complexe avec sorties imprevisibles
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

// Solution path pour Team A - chemin vers sortie EST (VERTE)
const SOLUTION_PATH = [
  {x:1, y:1}, {x:1, y:2}, {x:2, y:2}, {x:3, y:2}, {x:3, y:3},
  {x:4, y:3}, {x:5, y:3}, {x:6, y:3}, {x:7, y:3}, {x:8, y:3},
  {x:9, y:3}, {x:10, y:3}, {x:11, y:3}, {x:12, y:3}, {x:13, y:3},
  {x:14, y:3}, {x:15, y:3}, {x:15, y:4}, {x:15, y:5},
  {x:15, y:6}, {x:15, y:7}, {x:15, y:8}, {x:15, y:9},
  {x:15, y:10}, {x:15, y:11}, {x:15, y:12}
];

// Génération d'une position de départ aléatoire au centre (INCHANGÉ)
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

  if (centerPossibleStarts.length === 0) {
    for (let y = 1; y < MAZE_SIZE - 1; y++) {
      for (let x = 1; x < MAZE_SIZE - 1; x++) {
        if (MAZE_DATA[y][x] === 0) {
          centerPossibleStarts.push({ x, y });
        }
      }
    }
  }

  const randomIndex = Math.floor(Math.random() * centerPossibleStarts.length);
  return centerPossibleStarts[randomIndex];
};

// Génération des 4 sorties (2 vraies + 2 pièges)
const generateRandomExits = () => {
  return [
    {
      x: 3, y: 1,
      direction: 'NORD',
      type: 'VERTE',          // VRAIE SORTIE #1
      color: 'green',
      command: 'cat /sys/kernel/security/access.log | grep VERTE'
    },
    {
      x: MAZE_SIZE - 2, y: 12,
      direction: 'EST',
      type: 'VERTE',          // VRAIE SORTIE #2
      color: 'green',
      command: 'grep "LIBERATION" /var/log/system.log'
    },
    {
      x: 11, y: MAZE_SIZE - 2,
      direction: 'SUD',
      type: 'PIEGE',          // PIÈGE #1
      color: 'red',
      command: 'rm -rf /tmp/*'
    },
    {
      x: 1, y: 5,
      direction: 'OUEST',
      type: 'PIEGE',          // PIÈGE #2
      color: 'red',
      command: 'cat /dev/null'
    }
  ];
};

// ============================================
// Nombre de coups minimum pour labyrinthe 17x17
// ============================================
const MINIMUM_MOVES = 30; // Nombre minimum de coups pour atteindre les sorties

export default function Maze({
                               showSolution = false,
                               isPlayable = true,
                               minimalMode = false,
                               gameSessionId = null, // Pour API Laravel
                               onTimerPenalty = null, // Callback quand pénalité appliquée
                               onTerminalClick = null // Callback pour ouvrir le terminal (Team A)
                             }) {
  const [exits] = useState(generateRandomExits());
  const [startPos] = useState(generateRandomStartPos());
  const [cursorPos, setCursorPos] = useState(startPos);
  const [hasReached, setHasReached] = useState({});
  const [mounted, setMounted] = useState(false);

  // ============================================
  // NOUVEAUX STATES
  // ============================================
  const [lives, setLives] = useState(4); // 4 vies de départ
  const [moveCount, setMoveCount] = useState(0); // Compteur de coups
  const [penaltyCount, setPenaltyCount] = useState(0); // Nombre de fois qu'ils ont perdu toutes leurs vies
  const [showPenalty, setShowPenalty] = useState(false); // Afficher l'effet de pénalité
  const [showLifeLost, setShowLifeLost] = useState(false); // Notification -1 vie
  const [exitCommand, setExitCommand] = useState(null); // Commande de sortie à afficher

  // Monter le composant côté client uniquement
  useEffect(() => {
    setMounted(true);
  }, []);

  // Effet de pénalité visuel (filtre rouge + shake)
  useEffect(() => {
    if (showPenalty) {
      const timer = setTimeout(() => setShowPenalty(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showPenalty]);

  // Effet notification -1 vie
  useEffect(() => {
    if (showLifeLost) {
      const timer = setTimeout(() => setShowLifeLost(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [showLifeLost]);

  // ============================================
  // FONCTION : Appliquer pénalité timer (stackable)
  // ============================================
  const applyTimerPenalty = useCallback(async () => {
    // Effet visuel
    setShowPenalty(true);

    // Incrémenter le compteur de pénalités
    setPenaltyCount(prev => {
      const newPenaltyCount = prev + 1;

      // Calculer malus total stacké (10, 20, 30, 40...)
      const totalPenalty = newPenaltyCount * 10;

      // Callback vers le parent (si fourni)
      if (onTimerPenalty) {
        onTimerPenalty(totalPenalty);
      }

      // Appel API Laravel (si game_session_id fourni)
      if (gameSessionId) {
        fetch('/api/timer/penalty', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            game_session_id: gameSessionId,
            penalty_minutes: totalPenalty,
            reason: 'lives_depleted'
          })
        })
            .then(response => response.json())
            .then(data => console.log('Penalite appliquee:', data))
            .catch(error => console.error('Erreur API penalite:', error));
      }

      return newPenaltyCount;
    });

    // Redonner 1 vie après pénalité
    setLives(1);
  }, [onTimerPenalty, gameSessionId]);

  // ============================================
  // FONCTION : Reset position + coups
  // ============================================
  const handleReset = () => {
    setCursorPos(startPos);
    setMoveCount(0);
    setHasReached({});
    // Les vies ne se reset PAS
  };

  // ============================================
  // GESTION DES MOUVEMENTS (modifié)
  // ============================================
  useEffect(() => {
    if (!isPlayable && !minimalMode) return;

    const handleKeyDown = (e) => {
      // ============================================
      // BLOQUER si nombre de mouvements dépassé
      // ============================================
      if (moveCount >= MINIMUM_MOVES) {
        return; // Ne plus permettre de bouger
      }

      let newPos = { ...cursorPos };
      let hasMoved = false;

      // Détection des touches
      if (e.key === 'z' || e.key === 'Z' || e.key === 'ArrowUp') {
        newPos.y = Math.max(0, cursorPos.y - 1);
        hasMoved = true;
      } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        newPos.y = Math.min(MAZE_SIZE - 1, cursorPos.y + 1);
        hasMoved = true;
      } else if (e.key === 'q' || e.key === 'Q' || e.key === 'ArrowLeft') {
        newPos.x = Math.max(0, cursorPos.x - 1);
        hasMoved = true;
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        newPos.x = Math.min(MAZE_SIZE - 1, cursorPos.x + 1);
        hasMoved = true;
      }

      if (!hasMoved) return;

      // ============================================
      // NOUVEAU : Vérifier collision avec mur
      // ============================================
      const isWall = MAZE_DATA[newPos.y][newPos.x] === 1;

      if (isWall) {
        // Collision ! Perdre 1 vie
        const newLives = lives - 1;
        setLives(newLives);

        // Notification -1 vie
        setShowLifeLost(true);

        // Si 0 vie, appliquer pénalité
        if (newLives <= 0) {
          applyTimerPenalty();
        }

        // Ne pas bouger le curseur
        return;
      }

      // ============================================
      // Mouvement valide : incrémenter compteur
      // ============================================
      setCursorPos(newPos);
      setMoveCount(prev => prev + 1);

      // Vérifier si sortie atteinte
      const reachedExit = exits.find(exit => exit.x === newPos.x && exit.y === newPos.y);

      if (reachedExit && !hasReached[reachedExit.direction]) {
        setHasReached(prev => ({ ...prev, [reachedExit.direction]: true }));

        if (reachedExit.type === 'VERTE') {
          // Vraie sortie : afficher la commande sur la page
          setExitCommand({
            direction: reachedExit.direction,
            command: reachedExit.command
          });
        } else {
          // Fausse sortie : respawn au point de départ
          setCursorPos(startPos);
          alert(`PIEGE (${reachedExit.direction}) - Vous etes teleporte au point de depart`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cursorPos, isPlayable, exits, hasReached, lives, minimalMode, startPos, moveCount, applyTimerPenalty]);

  // ============================================
  // MODE MINIMAL (Team B) - MODIFIÉ
  // ============================================
  if (minimalMode) {
    return (
        <div className={`${styles.minimalWrapper} ${showPenalty ? styles.penaltyActive : ''}`}>

          {/* Top bar avec hearts, compteur et reset */}
          <div className={styles.topBar}>
            {/* Hearts à gauche */}
            <div className={styles.heartsContainer}>
              {[...Array(4)].map((_, i) => (
                  <span key={i} className={i < lives ? styles.heartFull : styles.heartEmpty}>
                ♥
              </span>
              ))}
            </div>

            {/* Groupe compteur + reset à droite */}
            <div className={styles.rightGroup}>
              <div className={styles.counterBox}>
                {moveCount} / {MINIMUM_MOVES}
              </div>
              <button onClick={handleReset} className={styles.resetButton}>
                ↻
              </button>
            </div>
          </div>

          {/* Le labyrinthe */}
          <div className={styles.minimalContainer}>
            {/* Grillage uniforme en arrière-plan */}
            <div className={styles.mazeGrid}>
              {MAZE_DATA.map((row, y) => (
                  <div key={y} className={styles.mazeRow}>
                    {row.map((cell, x) => {
                      const isWall = cell === 1;
                      const isBorderWall = (y === 0 || y === MAZE_SIZE - 1 || x === 0 || x === MAZE_SIZE - 1) && isWall;

                      // Team B voit la grille uniforme + murs des bords
                      let cellClass = styles.mazeCellMinimal;
                      if (isBorderWall) {
                        cellClass += ` ${styles.borderWall}`;
                      }

                      return (
                          <div key={x} className={cellClass}></div>
                      );
                    })}
                  </div>
              ))}
            </div>

            {/* Sorties flottantes (4 points rouges) */}
            {mounted && exits.map((exit, idx) => (
                <div
                    key={idx}
                    className={styles.exitDot}
                    style={{
                      left: `${((exit.x + 0.5) / MAZE_SIZE) * 100}%`,
                      top: `${((exit.y + 0.5) / MAZE_SIZE) * 100}%`
                    }}
                />
            ))}

            {/* Le curseur du joueur (point cyan) */}
            {mounted && (
                <div
                    className={styles.playerDot}
                    style={{
                      left: `${((cursorPos.x + 0.5) / MAZE_SIZE) * 100}%`,
                      top: `${((cursorPos.y + 0.5) / MAZE_SIZE) * 100}%`
                    }}
                />
            )}
          </div>

          {/* Message de pénalité */}
          {showPenalty && (
              <div className={styles.penaltyMessage}>
                0 VIE ! -{penaltyCount * 10} MINUTES
              </div>
          )}

          {/* Notification -1 vie */}
          {showLifeLost && lives > 0 && (
              <div className={styles.lifeLostNotif}>
                -1 VIE
              </div>
          )}

          {/* Commande de sortie (si vraie sortie trouvée) */}
          {exitCommand && (
              <div className={styles.exitCommandDisplay}>
                <div className={styles.exitCommandHeader}>
                  SORTIE TROUVEE ({exitCommand.direction})
                </div>
                <div className={styles.exitCommandBody}>
                  <div className={styles.exitCommandLabel}>Commande de liberation :</div>
                  <div className={styles.exitCommandCode}>$ {exitCommand.command}</div>
                </div>
              </div>
          )}
        </div>
    );
  }

  // ============================================
  // MODE NORMAL (Team A) - Seulement compteur, pas de reset
  // ============================================
  return (
      <div className={styles.mazeContainer}>

        {/* Top bar avec seulement le compteur (centré à droite) */}
        <div className={styles.topBar}>
          {/* Espace vide à gauche */}
          <div style={{flex: 1}}></div>

          {/* Compteur à droite */}
          <div className={styles.counterBox}>
            {moveCount} / {MINIMUM_MOVES}
          </div>
        </div>

        <div className={styles.mazeGrid}>
          {MAZE_DATA.map((row, y) => (
              <div key={y} className={styles.mazeRow}>
                {row.map((cell, x) => {
                  const isWall = cell === 1;
                  const isSolution = showSolution && SOLUTION_PATH.some(
                      pos => pos.x === x && pos.y === y
                  );

                  let cellClass = styles.mazeCell;
                  if (isWall) {
                    // Team A voit tous les murs
                    cellClass += ` ${styles.wall}`;
                  } else if (isSolution) {
                    cellClass += ` ${styles.solution}`;
                  }

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