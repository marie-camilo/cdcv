"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from "@/hooks/API/fetchAPI";

const SnakeFinalMobile = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState("playing");

    // Paramètres URL
    const locker = searchParams.get('locker');
    const caseIndex = searchParams.get('case');

    // CONFIGURATION JEU
    const CORRECT_LOCKER = 'right';
    const CORRECT_CASE = '4'; // Case 5 = index 4
    const gridSize = 20;
    const tileCount = 16;
    const targetScore = 7;
    const gameSpeed = 180; // Un poil plus rapide pour le dynamisme

    const snakeRef = useRef([{ x: 8, y: 8 }]);
    const foodRef = useRef({ x: 5, y: 5 });
    const dirRef = useRef({ x: 0, y: 0 });
    const gameLoopRef = useRef(null);

    // Fonction Synchronisation Pusher (Logique Intouchée)
    const handleWinSync = async (finalStatus) => {
        const gameCode = localStorage.getItem('currentGameCode');
        if (locker && caseIndex !== null) {
            const storageKey = `snake_${locker}_${caseIndex}`;
            localStorage.setItem(storageKey, finalStatus);
        }
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
        } catch (e) { console.error("Erreur sync Snake:", e); }
    };

    const spawnFood = () => {
        let newFood;
        let collision = true;
        while (collision) {
            newFood = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount),
            };
            collision = snakeRef.current.some(s => s.x === newFood.x && s.y === newFood.y);
        }
        foodRef.current = newFood;
    };

    const handleDirection = (dx, dy) => {
        if (gameState !== "playing") return;
        if (dirRef.current.x === -dx && dirRef.current.y === -dy) return; // Empêche le retournement
        dirRef.current = { x: dx, y: dy };
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameState !== "playing") return;
            switch(e.key) {
                case "ArrowUp": case "z": handleDirection(0, -1); break;
                case "ArrowDown": case "s": handleDirection(0, 1); break;
                case "ArrowLeft": case "q": handleDirection(-1, 0); break;
                case "ArrowRight": case "d": handleDirection(1, 0); break;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameState]);

    // BOUCLE DE JEU
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const runLogic = () => {
            if (gameState !== "playing") return;
            if (dirRef.current.x === 0 && dirRef.current.y === 0) {
                draw(ctx);
                return;
            }

            const head = {
                x: snakeRef.current[0].x + dirRef.current.x,
                y: snakeRef.current[0].y + dirRef.current.y,
            };

            // Mort (Mur ou Queue)
            if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount ||
                snakeRef.current.some(s => s.x === head.x && s.y === head.y)) {
                setGameState("lost");
                return;
            }

            const newSnake = [head, ...snakeRef.current];

            // Manger
            if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
                const newScore = score + 1;
                setScore(newScore);

                if (newScore >= targetScore) {
                    setGameState("won");
                    const isCorrect = locker === CORRECT_LOCKER && caseIndex === CORRECT_CASE;
                    handleWinSync(isCorrect ? 'success' : 'fail');
                    return;
                }
                spawnFood();
            } else {
                newSnake.pop();
            }

            snakeRef.current = newSnake;
            draw(ctx);
        };

        const draw = (ctx) => {
            // Fond
            ctx.fillStyle = "#2A0C0C"; // Darker Red
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Grille Subtile
            ctx.strokeStyle = "rgba(195, 118, 112, 0.1)"; // Mat Red transparent
            ctx.lineWidth = 1;
            for (let i = 0; i <= canvas.width; i += gridSize) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
            }

            // Pomme (Cible)
            ctx.fillStyle = "#D0FF71";
            ctx.shadowBlur = 10; ctx.shadowColor = "rgba(208,255,113,0.53)";
            ctx.fillRect(foodRef.current.x * gridSize + 2, foodRef.current.y * gridSize + 2, gridSize - 4, gridSize - 4);
            ctx.shadowBlur = 0;

            // Serpent
            snakeRef.current.forEach((segment, index) => {
                ctx.fillStyle = index === 0 ? "#AD0B16" : "#C37670";
                ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
            });
        };

        gameLoopRef.current = setInterval(runLogic, gameSpeed);
        return () => clearInterval(gameLoopRef.current);
    }, [gameState, score]);

    const handleReturn = () => { router.push('/enigme-2'); };

    return (
        <div style={styles.appContainer}>
            {/* Conteneur de contenu pour gérer le centrage indépendamment du fond */}
            <div style={styles.gameContent}>

                <div style={styles.header}>
                    <h1 style={styles.mainTitle}>SNAKE FOYER</h1>
                    <div style={styles.scoreBoard}>DONNÉES : {score} / {targetScore}</div>
                </div>

                <div style={styles.canvasContainer}>
                    <canvas ref={canvasRef} width={320} height={320} style={styles.canvas} />
                </div>

                <div style={styles.dpad}>
                    <div />
                    <button style={styles.btn} onTouchStart={() => handleDirection(0, -1)}>▲</button>
                    <div />
                    <button style={styles.btn} onTouchStart={() => handleDirection(-1, 0)}>◄</button>
                    <div />
                    <button style={styles.btn} onTouchStart={() => handleDirection(1, 0)}>►</button>
                    <div />
                    <button style={styles.btn} onTouchStart={() => handleDirection(0, 1)}>▼</button>
                    <div />
                </div>
            </div>

            {/* Modal de fin de partie */}
            {gameState !== "playing" && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.modalTitle}>
                            {gameState === "won" ? "EXTRACTION RÉUSSIE" : "ÉCHEC SYSTÈME"}
                        </h2>

                        {gameState === "won" ? (
                            <div style={styles.winContent}>
                                {locker === CORRECT_LOCKER && caseIndex === CORRECT_CASE ? (
                                    <>
                                        <p style={styles.modalText}>Fichier source localisé.</p>
                                        <div style={styles.resultBox}>
                                            <div style={styles.casierLabel}>CASIER CIBLE</div>
                                            <div style={styles.bigNumber}>5</div>
                                            <div style={styles.colorIndicator}>RANGÉE DE DROITE</div>
                                        </div>
                                    </>
                                ) : (
                                    <p style={{ color: "var(--color-sand)", marginTop: "15px", fontWeight: "bold", fontSize: "0.9rem" }}>
                                        Dossier vide. <br/>Mauvais casier détecté.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p style={{ margin: "20px 0", fontSize: "0.9rem", opacity: 0.8, color: "#fff" }}>
                                Connexion perdue. Tentative de reconnexion...
                            </p>
                        )}

                        <button
                            style={styles.restartBtn}
                            onClick={gameState === "won" ? handleReturn : () => window.location.reload()}
                        >
                            {gameState === "won" ? "RETOUR AU TERMINAL" : "RÉESSAYER L'INJECTION"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    appContainer: {
        height: "100dvh",
        width: "100%",
        backgroundColor: "var(--color-darker-red)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'JetBrains Mono', monospace",
        overflow: "hidden"
    },
    gameContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        flex: 1,
        padding: "10px 0"
    },
    header: {
        marginTop: "10px",
        textAlign: "center",
        flexShrink: 0
    },
    mainTitle: { color: "var(--color-sand)", margin: 0, fontSize: "1.3rem", letterSpacing: "3px", fontWeight: "900" },
    scoreBoard: { color: "var(--color-mat-red)", fontSize: "0.9rem", marginTop: "5px", fontWeight: "bold" },
    canvasContainer: {
        padding: "4px",
        background: "var(--color-mid-red)",
        borderRadius: "12px",
        boxShadow: "0 0 40px rgba(0,0,0,0.6)",
        margin: "10px 0"
    },
    canvas: {
        border: "1px solid var(--color-mat-red)",
        borderRadius: "8px",
        background: "#2A0C0C",
        display: "block",
        maxWidth: "80vw",
        maxHeight: "45vh",
        height: "auto"
    },
    dpad: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 60px)",
        gridTemplateRows: "repeat(3, 60px)",
        gap: "8px",
        marginBottom: "calc(10px + env(safe-area-inset-bottom))",
        touchAction: "none",
        flexShrink: 0
    },
    btn: {
        backgroundColor: "var(--color-mid-red)",
        border: "1px solid var(--color-mat-red)",
        color: "var(--color-sand)",
        borderRadius: "12px",
        fontSize: "1.4rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        WebkitTapHighlightColor: "transparent",
        outline: "none"
    },
    overlay: {
        position: "fixed", // On garde fixed ici pour que la modal couvre tout
        inset: 0,
        backgroundColor: "rgba(10,3,3,0.96)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(6px)",
        padding: "20px"
    },
    modal: {
        background: "var(--color-darker-red)",
        border: "1px solid var(--color-mat-red)",
        padding: "30px",
        textAlign: "center",
        width: "100%",
        maxWidth: "350px",
        color: "#fff",
        boxShadow: "0 0 50px rgba(0,0,0,0.8)"
    },
    modalTitle: { color: "var(--color-mat-red)", fontSize: "1.1rem", margin: "0 0 15px", fontWeight: "900", letterSpacing: "2px" },
    modalText: { fontSize: "0.85rem", color: "#fff", opacity: 0.9 },
    winContent: { margin: "15px 0" },
    resultBox: {
        backgroundColor: "rgba(0,0,0,0.4)",
        border: "1px solid var(--color-mid-red)",
        borderRadius: "4px",
        padding: "20px",
        margin: "20px 0"
    },
    casierLabel: { color: "var(--color-mat-blue)", fontSize: "0.75rem", letterSpacing: "3px", fontWeight: "bold", marginBottom: "10px" },
    bigNumber: { fontSize: "4.5rem", fontWeight: "900", color: "var(--color-sand)", margin: "0", lineHeight: "1" },
    colorIndicator: { color: "var(--color-mat-red)", fontSize: "0.7rem", fontWeight: "bold", textTransform: "uppercase", marginTop: "10px", letterSpacing: "1px" },
    restartBtn: {
        padding: "14px",
        backgroundColor: "var(--color-red)",
        color: "var(--color-sand)",
        border: "none",
        borderRadius: "4px",
        fontWeight: "900",
        width: "100%",
        fontSize: "0.8rem",
        letterSpacing: "2px",
        marginTop: "10px",
        cursor: "pointer",
        transition: "transform 0.1s active"
    },
};

export default SnakeFinalMobile;