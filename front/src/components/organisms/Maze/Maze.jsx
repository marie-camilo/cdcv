'use client';

import { useState, useEffect } from 'react';

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
    <div className="flex flex-col items-center gap-6">
      {/* Grille du labyrinthe */}
      <div className="inline-grid gap-[2px] p-4 bg-[#1a0d2e] rounded-lg border-2 border-[#FF304F] shadow-[0_0_20px_rgba(255,48,79,0.3)]"
           style={{ gridTemplateColumns: `repeat(15, 1fr)` }}>
        {MAZE_DATA.map((row, y) => (
          row.map((cell, x) => {
            const isCursor = isPlayable && cursorPos.x === x && cursorPos.y === y;
            const isStart = x === START_POS.x && y === START_POS.y;
            const isEnd = x === END_POS.x && y === END_POS.y;
            const isSolution = showSolution && isOnSolutionPath(x, y);
            
            let cellClass = "w-8 h-8 transition-all duration-150 ";
            
            if (cell === 1) {
              // Mur
              cellClass += "bg-[#2B1B47] border border-[#FF304F]/30";
            } else {
              // Chemin
              cellClass += "bg-[#1a0d2e] ";
              
              if (isCursor) {
                cellClass += "bg-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.8)] animate-pulse";
              } else if (isEnd) {
                cellClass += "bg-[#FF1744] shadow-[0_0_10px_rgba(255,23,68,0.6)]";
              } else if (isStart) {
                cellClass += "bg-[#00D9FF]/50";
              } else if (isSolution) {
                cellClass += "bg-[#FF304F]/40";
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
        <div className="w-full max-w-2xl bg-[#1a0d2e] border-2 border-[#00D9FF] rounded-lg p-6 shadow-[0_0_30px_rgba(0,217,255,0.4)]">
          <div className="font-mono text-[#00D9FF] mb-4 text-sm">
            [ SYSTÈME ] Objectif atteint - Commande de déverrouillage générée
          </div>
          <div className="bg-black/50 p-4 rounded border border-[#FF304F]/30 font-mono text-[#F5E6D3]">
            <span className="text-[#00D9FF]">$</span> echo "CODE_ACCES_SALLE_115" | sed 's/ACCES/REUNION/'
          </div>
          <div className="mt-4 text-sm text-[#F5E6D3]/70">
            Exécutez cette commande dans le terminal pour obtenir le Code 1
          </div>
        </div>
      )}
    </div>
  );
}
