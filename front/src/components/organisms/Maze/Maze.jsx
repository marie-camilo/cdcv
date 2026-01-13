'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './Maze.module.css';

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

// Solution path pour Team A - chemin vers sortie EST (VERTE)
const SOLUTION_PATH = [
  {x:1, y:1}, {x:1, y:2}, {x:2, y:2}, {x:3, y:2}, {x:3, y:3},
  {x:4, y:3}, {x:5, y:3}, {x:6, y:3}, {x:7, y:3}, {x:8, y:3},
  {x:9, y:3}, {x:10, y:3}, {x:11, y:3}, {x:12, y:3}, {x:13, y:3},
  {x:14, y:3}, {x:15, y:3}, {x:15, y:4}, {x:15, y:5},
  {x:15, y:6}, {x:15, y:7}, {x:15, y:8}, {x:15, y:9},
  {x:15, y:10}, {x:15, y:11}, {x:15, y:12}
];

// Génération d'une position de départ aléatoire au centre
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
      type: 'VERTE',
      color: 'green',
      command: 'cat /sys/kernel/security/access.log | grep VERTE'
    },
    {
      x: MAZE_SIZE - 2, y: 12,
      direction: 'EST',
      type: 'VERTE',
      color: 'green',
      command: 'grep "LIBERATION" /var/log/system.log'
    },
    {
      x: 11, y: MAZE_SIZE - 2,
      direction: 'SUD',
      type: 'PIEGE',
      color: 'red',
      command: 'rm -rf /tmp/*'
    },
    {
      x: 1, y: 5,
      direction: 'OUEST',
      type: 'PIEGE',
      color: 'red',
      command: 'cat /dev/null'
    }
  ];
};

const MINIMUM_MOVES = 30;

export default function Maze({
                               showSolution = false,
                               isPlayable = true,
                               minimalMode = false,
                               gameSessionId = null,
                               onTimerPenalty = null,
                               onTerminalClick = null,
                               // NOUVELLES PROPS
                               onLivesChange = null,
                               onMoveCountChange = null,
                               onReset = null
                             }) {
  const [exits] = useState(generateRandomExits());
  const [startPos] = useState(generateRandomStartPos());
  const [cursorPos, setCursorPos] = useState(startPos);
  const [hasReached, setHasReached] = useState({});
  const [mounted, setMounted] = useState(false);

  const [lives, setLives] = useState(4);
  const [moveCount, setMoveCount] = useState(0);
  const [penaltyCount, setPenaltyCount] = useState(0);
  const [showPenalty, setShowPenalty] = useState(false);
  const [showLifeLost, setShowLifeLost] = useState(false);
  const [exitCommand, setExitCommand] = useState(null);

  // Monter le composant côté client uniquement
  useEffect(() => {
    setMounted(true);
  }, []);

  // Remonter les changements de vies au parent
  useEffect(() => {
    if (onLivesChange) {
      onLivesChange(lives);
    }
  }, [lives, onLivesChange]);

  // Remonter les changements de coups au parent
  useEffect(() => {
    if (onMoveCountChange) {
      onMoveCountChange(moveCount);
    }
  }, [moveCount, onMoveCountChange]);

  // Effet de pénalité visuel
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

  // Appliquer pénalité timer
  const applyTimerPenalty = useCallback(async () => {
    setShowPenalty(true);

    setPenaltyCount(prev => {
      const newPenaltyCount = prev + 1;
      const totalPenalty = newPenaltyCount * 10;

      if (onTimerPenalty) {
        onTimerPenalty(totalPenalty);
      }

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

    setLives(1);
  }, [onTimerPenalty, gameSessionId]);

  // Reset position + coups
  const handleReset = () => {
    setCursorPos(startPos);
    setMoveCount(0);
    setHasReached({});

    if (onReset) {
      onReset();
    }
  };

  // Gestion des mouvements
  useEffect(() => {
    if (!isPlayable && !minimalMode) return;

    const handleKeyDown = (e) => {
      if (moveCount >= MINIMUM_MOVES) {
        return;
      }

      let newPos = { ...cursorPos };
      let hasMoved = false;

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

      const isWall = MAZE_DATA[newPos.y][newPos.x] === 1;

      if (isWall) {
        const newLives = lives - 1;
        setLives(newLives);
        setShowLifeLost(true);

        if (newLives <= 0) {
          applyTimerPenalty();
        }

        return;
      }

      setCursorPos(newPos);
      setMoveCount(prev => prev + 1);

      const reachedExit = exits.find(exit => exit.x === newPos.x && exit.y === newPos.y);

      if (reachedExit && !hasReached[reachedExit.direction]) {
        setHasReached(prev => ({ ...prev, [reachedExit.direction]: true }));

        if (reachedExit.type === 'VERTE') {
          setExitCommand({
            direction: reachedExit.direction,
            command: reachedExit.command
          });
        } else {
          setCursorPos(startPos);
          alert(`PIEGE (${reachedExit.direction}) - Vous etes teleporte au point de depart`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cursorPos, isPlayable, exits, hasReached, lives, minimalMode, startPos, moveCount, applyTimerPenalty]);

  // MODE MINIMAL (Team B)
  if (minimalMode) {
    return (
        <div className={`${styles.minimalWrapper} ${showPenalty ? styles.penaltyActive : ''}`}>
          {/* Le labyrinthe */}
          <div className={styles.minimalContainer}>
            {/* Grillage uniforme en arrière-plan */}
            <div className={styles.mazeGrid}>
              {MAZE_DATA.map((row, y) => (
                  <div key={y} className={styles.mazeRow}>
                    {row.map((cell, x) => {
                      const isWall = cell === 1;
                      const isBorderWall = (y === 0 || y === MAZE_SIZE - 1 || x === 0 || x === MAZE_SIZE - 1) && isWall;

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

  // MODE NORMAL (Team A)
  return (
      <div className={styles.mazeContainer}>
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