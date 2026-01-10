"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';

const ZipCyberShielded = () => {
    const router = useRouter();
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState("start");
    const [showRules, setShowRules] = useState(false);
    const [barPos, setBarPos] = useState(0);
    const requestRef = useRef();

    const targetCount = 5;
    const containerWidth = 300;
    const targetWidth = Math.max(70 - score * 12, 22);
    const barWidth = 6;
    const speed = 2.5 + score;

    const directionRef = useRef(1);
    const posRef = useRef(0);
    const isLocked = useRef(false);

    const resetSystem = () => {
        cancelAnimationFrame(requestRef.current);
        isLocked.current = false;
        posRef.current = 0;
        directionRef.current = 1;
    };

    const animate = () => {
        if (isLocked.current) return;
        posRef.current += speed * directionRef.current;

        if (posRef.current >= containerWidth - barWidth) {
            posRef.current = containerWidth - barWidth;
            directionRef.current = -1;
        } else if (posRef.current <= 0) {
            posRef.current = 0;
            directionRef.current = 1;
        }

        setBarPos(posRef.current);
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (gameState === "playing" && !isLocked.current) {
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState, score]);

    const handleStart = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        resetSystem();
        setScore(0);
        setGameState("playing");
    };

    const handleAction = (e) => {
        if (gameState !== "playing" || isLocked.current || showRules) return;

        if (e && e.type === "touchstart") e.preventDefault();

        isLocked.current = true;
        cancelAnimationFrame(requestRef.current);

        const center = containerWidth / 2;
        const targetStart = center - targetWidth / 2;
        const targetEnd = center + targetWidth / 2;
        const barCenter = posRef.current + barWidth / 2;

        if (barCenter >= targetStart && barCenter <= targetEnd) {
            if (score + 1 === targetCount) {
                // Sauvegarder le chiffre
                localStorage.setItem('zip_digit', '3');
                setTimeout(() => setGameState("won"), 400);
            } else {
                setTimeout(() => {
                    setScore((s) => s + 1);
                    posRef.current = 0;
                    directionRef.current = 1;
                    isLocked.current = false;
                }, 500);
            }
        } else {
            setTimeout(() => {
                setGameState("lost");
            }, 400);
        }
    };

    const handleReturn = () => {
        router.push('/enigme-2');
    };

    return (
        <div
            style={styles.container}
            onTouchStart={handleAction}
            onMouseDown={(e) => {
                if (!("ontouchstart" in window)) handleAction(e);
            }}
        >
            <button
                onPointerDown={(e) => {
                    e.stopPropagation();
                    setShowRules(true);
                }}
                style={styles.infoBtn}
            >
                i
            </button>

            <div style={styles.header}>
                <h1 style={styles.title}>ZIP PROTOCOL</h1>
                <div style={styles.statusBar}>
                    <div style={styles.levelIndicator}>
                        SYNCHRONISATION : {score} / {targetCount}
                    </div>
                    <div style={styles.progressTrack}>
                        <div
                            style={{
                                ...styles.progressFill,
                                width: `${(score / targetCount) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            <div style={styles.gameArea}>
                <div style={styles.track}>
                    <div
                        style={{
                            ...styles.targetZone,
                            width: `${targetWidth}px`,
                            left: `${(containerWidth - targetWidth) / 2}px`,
                            backgroundColor:
                                isLocked.current && gameState !== "lost"
                                    ? "rgba(0, 255, 136, 0.6)"
                                    : "rgba(0, 255, 136, 0.15)",
                        }}
                    />
                    <div
                        style={{
                            ...styles.movingBar,
                            left: `${barPos}px`,
                            width: `${barWidth}px`,
                            backgroundColor: isLocked.current
                                ? gameState === "lost"
                                    ? "#ff3333"
                                    : "#00ff88"
                                : "#ff3333",
                        }}
                    />
                </div>
                <div style={styles.hintText}>PRÉCISION REQUISE</div>
            </div>

            {(showRules ||
                gameState === "start" ||
                gameState === "lost" ||
                gameState === "won") && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        {showRules && (
                            <>
                                <h2 style={styles.cyberText}>INSTRUCTIONS</h2>
                                <p style={styles.descText}>
                                    Alignement laser nécessaire. La zone se réduit à chaque
                                    succès.
                                </p>
                                <button
                                    onPointerDown={(e) => {
                                        e.stopPropagation();
                                        setShowRules(false);
                                    }}
                                    style={styles.mainBtn}
                                >
                                    COMPRIS
                                </button>
                            </>
                        )}

                        {gameState === "start" && !showRules && (
                            <>
                                <h2 style={styles.cyberText}>ACCÈS ZIP</h2>
                                <p style={styles.descText}>Séquence de calibration niv. 5.</p>
                                <button onPointerDown={handleStart} style={styles.mainBtn}>
                                    INITIALISER
                                </button>
                            </>
                        )}

                        {gameState === "lost" && (
                            <>
                                <h2 style={{ color: "#ff3333", marginBottom: "20px" }}>
                                    ERREUR TIMING
                                </h2>
                                <p style={styles.descText}>
                                    Désynchronisation critique détectée.
                                </p>
                                <button onPointerDown={handleStart} style={styles.mainBtn}>
                                    RÉESSAYER
                                </button>
                            </>
                        )}

                        {gameState === "won" && (
                            <>
                                <h2 style={{ color: "#00ff88", marginBottom: "20px" }}>
                                    FLUX STABLE
                                </h2>
                                <p style={styles.descText}>Troisième numéro extrait :</p>
                                <div style={styles.resultNum}>3</div>
                                <button
                                    onClick={handleReturn}
                                    style={styles.mainBtn}
                                >
                                    RETOUR
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        position: "fixed",
        inset: 0,
        backgroundColor: "#050202",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "none",
        fontFamily: '"Courier New", Courier, monospace',
        overflow: "hidden",
    },
    infoBtn: {
        position: "absolute",
        top: "20px",
        right: "20px",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        border: "1px solid #ff3333",
        backgroundColor: "transparent",
        color: "#ff3333",
        fontSize: "20px",
        zIndex: 110,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    header: { marginBottom: "80px", width: "85%", textAlign: "center" },
    title: {
        color: "#ff3333",
        fontSize: "1.6rem",
        letterSpacing: "6px",
        margin: "0 0 15px 0",
        fontWeight: "bold",
    },
    statusBar: { width: "100%" },
    levelIndicator: {
        color: "#ff9999",
        fontSize: "0.7rem",
        marginBottom: "8px",
        textAlign: "center",
        letterSpacing: "1px",
    },
    progressTrack: {
        height: "3px",
        backgroundColor: "#331111",
        borderRadius: "2px",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#ff3333",
        boxShadow: "0 0 15px #ff3333",
        transition: "width 0.3s ease",
    },
    gameArea: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
    },
    track: {
        position: "relative",
        width: "300px",
        height: "50px",
        backgroundColor: "#000",
        border: "1px solid #ff3333",
        borderRadius: "4px",
    },
    targetZone: {
        position: "absolute",
        top: 0,
        bottom: 0,
        borderLeft: "1px solid #00ff88",
        borderRight: "1px solid #00ff88",
    },
    movingBar: {
        position: "absolute",
        top: "2px",
        bottom: "2px",
        transition: "background-color 0.1s",
    },
    hintText: {
        marginTop: "30px",
        color: "#ff3333",
        fontSize: "0.7rem",
        letterSpacing: "3px",
        fontWeight: "bold",
        opacity: 0.5,
    },
    overlay: {
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.98)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
    },
    modal: {
        background: "#0a0505",
        border: "1px solid #ff3333",
        padding: "30px",
        borderRadius: "4px",
        textAlign: "center",
        width: "85%",
    },
    cyberText: {
        color: "#ff3333",
        fontSize: "1.4rem",
        marginBottom: "20px",
        letterSpacing: "2px",
    },
    descText: {
        color: "#ccc",
        fontSize: "0.9rem",
        marginBottom: "30px",
        lineHeight: "1.6",
    },
    resultNum: {
        fontSize: "6rem",
        color: "#ff3333",
        fontWeight: "bold",
        textShadow: "0 0 30px #ff3333",
        margin: "15px 0",
    },
    mainBtn: {
        padding: "14px 30px",
        backgroundColor: "#ff3333",
        color: "#000",
        border: "none",
        borderRadius: "2px",
        fontWeight: "bold",
        fontSize: "0.9rem",
        letterSpacing: "2px",
        cursor: "pointer",
    },
    secondaryBtn: {
        background: "none",
        border: "1px solid #333",
        color: "#555",
        padding: "10px 20px",
        borderRadius: "2px",
        fontSize: "0.7rem",
        marginTop: "10px",
    },
};

export default ZipCyberShielded;