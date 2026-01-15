"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from "@/hooks/API/fetchAPI"; // Import de l'utilitaire API

const SnakeFinalMobile = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState("playing");

    // Récupérer les paramètres de l'URL
    const locker = searchParams.get('locker'); // 'left' ou 'right'
    const caseIndex = searchParams.get('case'); // 0-7

    // CONFIGURATION : Quel est le bon casier et la bonne case ?
    const CORRECT_LOCKER = 'right';
    const CORRECT_CASE = '4'; // Case 5 = index 4

    const gridSize = 20;
    const tileCount = 16;
    const targetScore = 7;
    const gameSpeed = 220;

    const snakeRef = useRef([{ x: 8, y: 8 }]);
    const foodRef = useRef({ x: 5, y: 5 });
    const dirRef = useRef({ x: 0, y: 0 });
    const gameLoopRef = useRef(null);

    // Fonction pour synchroniser le résultat avec le groupe via Pusher
    const handleWinSync = async (finalStatus) => {
        const gameCode = localStorage.getItem('currentGameCode');

        // 1. Sauvegarde locale pour persistance immédiate
        if (locker && caseIndex !== null) {
            const storageKey = `snake_${locker}_${caseIndex}`;
            localStorage.setItem(storageKey, finalStatus);
        }

        // 2. Diffusion Pusher via Laravel
        try {
            await apiFetch(`/api/v1/game/${gameCode}/update-enigma`, {
                method: 'POST',
                body: JSON.stringify({
                    type: 'case_update',
                    side: locker,
                    index: parseInt(caseIndex),
                    status: finalStatus
                })
            });
        } catch (e) {
            console.error("Erreur de synchronisation Snake:", e);
        }
    };

    const spawnFood = () => {
        let newFood;
        let collision = true;
        while (collision) {
            newFood = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount),
            };
            collision = snakeRef.current.some(
                (s) => s.x === newFood.x && s.y === newFood.y
            );
        }
        foodRef.current = newFood;
    };

    const handleDirection = (dx, dy) => {
        if (gameState !== "playing") return;
        if (dirRef.current.x === -dx && dirRef.current.y === -dy) return;
        dirRef.current = { x: dx, y: dy };
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const runLogic = () => {
            if (gameState !== "playing") return;
            if (dirRef.current.x === 0 && dirRef.current.y === 0) {
                draw();
                return;
            }

            const head = {
                x: snakeRef.current[0].x + dirRef.current.x,
                y: snakeRef.current[0].y + dirRef.current.y,
            };

            if (
                head.x < 0 ||
                head.x >= tileCount ||
                head.y < 0 ||
                head.y >= tileCount
            ) {
                setGameState("lost");
                return;
            }

            if (snakeRef.current.some((s) => s.x === head.x && s.y === head.y)) {
                setGameState("lost");
                return;
            }

            const newSnake = [head, ...snakeRef.current];

            if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
                const newScore = score + 1;
                setScore(newScore);

                if (newScore >= targetScore) {
                    setGameState("won");
                    const isCorrectLocker = locker === CORRECT_LOCKER;
                    const isCorrectCase = caseIndex === CORRECT_CASE;
                    const result = isCorrectLocker && isCorrectCase ? 'success' : 'fail';

                    // Synchronisation du résultat
                    handleWinSync(result);
                    return;
                }
                spawnFood();
            } else {
                newSnake.pop();
            }

            snakeRef.current = newSnake;
            draw();
        };

        const draw = () => {
            ctx.fillStyle = "#0d0505";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#00ff88";
            ctx.fillRect(
                foodRef.current.x * gridSize + 2,
                foodRef.current.y * gridSize + 2,
                gridSize - 4,
                gridSize - 4
            );

            snakeRef.current.forEach((segment, index) => {
                ctx.fillStyle = index === 0 ? "#ff3333" : "#ff6666";
                ctx.fillRect(
                    segment.x * gridSize + 1,
                    segment.y * gridSize + 1,
                    gridSize - 2,
                    gridSize - 2
                );
            });
        };

        gameLoopRef.current = setInterval(runLogic, gameSpeed);
        return () => clearInterval(gameLoopRef.current);
    }, [gameState, score]);

    const handleReturn = () => {
        router.push('/enigme-2');
    };

    return (
        <div style={styles.appContainer}>
            <div style={styles.header}>
                <h1 style={styles.mainTitle}>SNAKE FOYER</h1>
                <div style={styles.scoreBoard}>Chemises ramassées : {score} /7 </div>
            </div>

            <canvas ref={canvasRef} width={320} height={320} style={styles.canvas} />

            <div style={styles.dpad}>
                <div />
                <button style={styles.btn} onTouchStart={() => handleDirection(0, -1)}>
                    ▲
                </button>
                <div />
                <button style={styles.btn} onTouchStart={() => handleDirection(-1, 0)}>
                    ◄
                </button>
                <div />
                <button style={styles.btn} onTouchStart={() => handleDirection(1, 0)}>
                    ►
                </button>
                <div />
                <button style={styles.btn} onTouchStart={() => handleDirection(0, 1)}>
                    ▼
                </button>
                <div />
            </div>

            {gameState !== "playing" && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h2
                            style={{
                                color: gameState === "won" ? "#00ff88" : "#ff3333",
                                fontSize: "1.8rem",
                            }}
                        >
                            {gameState === "won" ? "RÉUSSI !" : "GAME OVER"}
                        </h2>

                        {gameState === "won" ? (
                            <div style={styles.winContent}>
                                <p>Tu as collecté toutes les chemises.</p>
                                {locker === CORRECT_LOCKER && caseIndex === CORRECT_CASE ? (
                                    <>
                                        <p>Le casier contenant la chemise verte est :</p>
                                        <div style={styles.resultBox}>
                                            <div style={styles.casierLabel}>CASIER N°</div>
                                            <div style={styles.bigNumber}>5</div>
                                            <div style={styles.colorIndicator}>
                                                <div style={styles.colorDot}></div>
                                                <span>ARMOIRE DROITE</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p style={{ color: "#ff3333", marginTop: "15px" }}>
                                        Ce n'était pas le bon casier... Continuez à chercher !
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p style={{ margin: "20px 0" }}>
                                Dommage ! Essaie encore pour découvrir le code.
                            </p>
                        )}

                        <button
                            style={styles.restartBtn}
                            onClick={gameState === "won" ? handleReturn : () => window.location.reload()}
                        >
                            {gameState === "won" ? "RETOUR" : "RÉESSAYER"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    appContainer: { position: "fixed", inset: 0, backgroundColor: "#1a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", touchAction: "none", fontFamily: "system-ui, -apple-system, sans-serif" },
    header: { marginBottom: "15px", textAlign: "center" },
    mainTitle: { color: "#ff3333", margin: 0, fontSize: "1.6rem", letterSpacing: "1px" },
    scoreBoard: { color: "#ff9999", fontSize: "1.2rem", fontWeight: "bold" },
    canvas: { border: "3px solid #ff3333", borderRadius: "12px", background: "#000", boxShadow: "0 0 20px rgba(255, 51, 51, 0.3)" },
    dpad: { display: "grid", gridTemplateColumns: "repeat(3, 80px)", gridTemplateRows: "repeat(3, 80px)", gap: "12px", marginTop: "25px" },
    btn: { backgroundColor: "#2a1010", border: "2px solid #ff3333", color: "#ff3333", borderRadius: "20px", fontSize: "1.8rem", display: "flex", alignItems: "center", justifyContent: "center", WebkitTapHighlightColor: "transparent", outline: "none" },
    overlay: { position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
    modal: { background: "#1a0a0a", border: "3px solid #ff3333", borderRadius: "25px", padding: "30px", textAlign: "center", width: "85%", color: "#fff" },
    winContent: { margin: "20px 0" },
    resultBox: { backgroundColor: "#0d0505", border: "2px solid #ff3333", borderRadius: "15px", padding: "20px", margin: "15px 0" },
    casierLabel: { color: "#ff9999", fontSize: "0.9rem", letterSpacing: "2px", marginBottom: "5px" },
    bigNumber: { fontSize: "4.5rem", fontWeight: "bold", color: "#ff3333", textShadow: "0 0 20px rgba(255, 51, 51, 0.6)", margin: "10px 0" },
    colorIndicator: { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "15px", color: "#00ff88", fontSize: "0.9rem", fontWeight: "bold" },
    colorDot: { width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#00ff88", boxShadow: "0 0 15px rgba(0, 255, 136, 0.6)" },
    restartBtn: { padding: "15px 35px", backgroundColor: "#ff3333", color: "#1a0a0a", border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer" },
};

export default SnakeFinalMobile;