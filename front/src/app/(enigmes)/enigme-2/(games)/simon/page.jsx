"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';

const SimonFastCyber = () => {
    const router = useRouter();
    const [sequence, setSequence] = useState([]);
    const [userSequence, setUserSequence] = useState([]);
    const [isDisplaying, setIsDisplaying] = useState(false);
    const [activeColor, setActiveColor] = useState(null);
    const [gameState, setGameState] = useState("start");
    const [showRules, setShowRules] = useState(false);

    const colors = ["green", "red", "yellow", "blue"];
    const targetLength = 7;
    const intervalRef = useRef(null);

    const SPEED_INTERVAL = 400;
    const LIGHT_DURATION = 350;

    const resetSystem = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setActiveColor(null);
        setIsDisplaying(false);
    };

    const startGame = () => {
        resetSystem();
        setSequence([]);
        setUserSequence([]);
        setGameState("playing");
        setShowRules(false);
        setTimeout(() => addToSequence([]), 600);
    };

    const addToSequence = (currentSeq) => {
        const nextColor = colors[Math.floor(Math.random() * colors.length)];
        const newSeq = [...currentSeq, nextColor];
        setSequence(newSeq);
        setUserSequence([]);
        setIsDisplaying(true);
        setTimeout(() => playSequence(newSeq), 500);
    };

    const playSequence = (seq) => {
        let i = 0;
        resetSystem();
        setIsDisplaying(true);

        intervalRef.current = setInterval(() => {
            setActiveColor(seq[i]);

            setTimeout(() => {
                setActiveColor(null);
            }, LIGHT_DURATION);

            i++;
            if (i >= seq.length) {
                clearInterval(intervalRef.current);
                setTimeout(() => setIsDisplaying(false), 500);
            }
        }, SPEED_INTERVAL);
    };

    const handleColorClick = (color) => {
        if (isDisplaying || gameState !== "playing") return;

        setActiveColor(color);
        setTimeout(() => setActiveColor(null), 200);

        const newUserSequence = [...userSequence, color];
        setUserSequence(newUserSequence);

        const currentIndex = newUserSequence.length - 1;
        if (newUserSequence[currentIndex] !== sequence[currentIndex]) {
            setGameState("lost");
            resetSystem();
            return;
        }

        if (newUserSequence.length === sequence.length) {
            if (sequence.length === targetLength) {
                setGameState("solved");
                // Sauvegarder le chiffre
                localStorage.setItem('simon_digit', '8');
                setTimeout(() => setGameState("won"), 1200);
            } else {
                setIsDisplaying(true);
                setTimeout(() => addToSequence(sequence), 800);
            }
        }
    };

    const handleReturn = () => {
        router.push('/enigme-2');
    };

    useEffect(() => {
        return () => resetSystem();
    }, []);

    return (
        <div style={styles.container}>
            <button onClick={() => setShowRules(true)} style={styles.infoBtn}>
                i
            </button>

            <div style={styles.header}>
                <h1 style={styles.title}>SIMON PROTOCOL</h1>
                <div style={styles.statusBar}>
                    <div style={styles.levelIndicator}>
                        SÉQUENCE : {sequence.length} / {targetLength}
                    </div>
                    <div style={styles.progressTrack}>
                        <div
                            style={{
                                ...styles.progressFill,
                                width: `${(sequence.length / targetLength) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            <div style={styles.gameBoard}>
                {colors.map((color) => (
                    <button
                        key={color}
                        onClick={() => handleColorClick(color)}
                        style={{
                            ...styles.pad,
                            backgroundColor: styles.colorMap[color].bg,
                            opacity:
                                activeColor === color || gameState === "solved" ? 1 : 0.2,
                            boxShadow:
                                activeColor === color || gameState === "solved"
                                    ? `0 0 50px ${styles.colorMap[color].glow}`
                                    : "none",
                            border:
                                activeColor === color
                                    ? `4px solid #fff`
                                    : `2px solid ${styles.colorMap[color].glow}`,
                        }}
                    />
                ))}
            </div>

            <div style={styles.statusText}>
                {gameState === "solved"
                    ? "FLUX STABLE"
                    : isDisplaying
                        ? "ANALYSE..."
                        : "VOTRE TOUR"}
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
                                    Reproduisez la séquence. Le rythme s'accélère.
                                </p>
                                <button
                                    onClick={() => setShowRules(false)}
                                    style={styles.mainBtn}
                                >
                                    RETOUR
                                </button>
                            </>
                        )}

                        {gameState === "start" && !showRules && (
                            <>
                                <h2 style={styles.cyberText}>ACCÈS SÉCURISÉ</h2>
                                <p style={styles.descText}>
                                    Mémorisation de fréquence niveau 7.
                                </p>
                                <button onClick={startGame} style={styles.mainBtn}>
                                    INITIALISER
                                </button>
                            </>
                        )}

                        {gameState === "lost" && (
                            <>
                                <h2 style={{ color: "#ff3333" }}>ÉCHEC CRITIQUE</h2>
                                <p style={styles.descText}>Séquence corrompue.</p>
                                <button onClick={startGame} style={styles.mainBtn}>
                                    RÉESSAYER
                                </button>
                            </>
                        )}

                        {gameState === "won" && (
                            <>
                                <h2 style={{ color: "#00ff88" }}>SUCCÈS</h2>
                                <p style={styles.descText}>Deuxième chiffre extrait :</p>
                                <div style={styles.resultNum}>8</div>
                                <button
                                    onClick={handleReturn}
                                    style={styles.secondaryBtn}
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
        fontFamily: "sans-serif",
    },
    infoBtn: {
        position: "absolute",
        top: "20px",
        left: "20px",
        width: "35px",
        height: "35px",
        borderRadius: "50%",
        border: "2px solid #ff3333",
        backgroundColor: "transparent",
        color: "#ff3333",
        zIndex: 110,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
    },
    header: { marginBottom: "40px", width: "80%", textAlign: "center" },
    title: {
        color: "#ff3333",
        fontSize: "1.4rem",
        letterSpacing: "5px",
        margin: "0 0 15px 0",
        fontWeight: "900",
    },
    statusBar: { width: "100%" },
    levelIndicator: {
        color: "#ff3333",
        fontSize: "0.7rem",
        marginBottom: "8px",
        textAlign: "center",
    },
    progressTrack: { height: "3px", backgroundColor: "#220000" },
    progressFill: {
        height: "100%",
        backgroundColor: "#ff3333",
        transition: "width 0.4s ease",
    },
    gameBoard: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        width: "300px",
        height: "300px",
    },
    pad: {
        borderRadius: "25px",
        border: "none",
        transition: "all 0.15s",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
    },
    statusText: {
        marginTop: "50px",
        color: "#ff3333",
        fontWeight: "bold",
        fontSize: "0.8rem",
        letterSpacing: "3px",
    },
    overlay: {
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.96)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
    },
    modal: {
        background: "#0a0505",
        border: "2px solid #ff3333",
        padding: "30px",
        borderRadius: "20px",
        textAlign: "center",
        width: "85%",
    },
    cyberText: { color: "#ff3333", fontSize: "1.4rem", marginBottom: "15px" },
    descText: { color: "#fff", fontSize: "0.9rem", marginBottom: "25px" },
    resultNum: {
        fontSize: "7rem",
        color: "#ff3333",
        fontWeight: "900",
        textShadow: "0 0 30px #ff3333",
        margin: "10px 0",
    },
    mainBtn: {
        padding: "16px 40px",
        backgroundColor: "#ff3333",
        color: "#000",
        border: "none",
        borderRadius: "8px",
        fontWeight: "bold",
        letterSpacing: "2px",
    },
    secondaryBtn: {
        background: "none",
        border: "1px solid #333",
        color: "#666",
        padding: "10px 20px",
        borderRadius: "8px",
        fontSize: "0.8rem",
    },
    colorMap: {
        green: { bg: "#00ff88", glow: "#00ff88" },
        red: { bg: "#ff3333", glow: "#ff3333" },
        yellow: { bg: "#ffcc00", glow: "#ffcc00" },
        blue: { bg: "#3366ff", glow: "#3366ff" },
    },
};

export default SimonFastCyber;