"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { apiFetch } from "@/hooks/API/fetchAPI";
import { RiInformationLine, RiCheckLine, RiCloseLine } from "react-icons/ri";

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

    const colorMap = {
        green:  { bg: "#7A8C5E", glow: "#D0FF71" },
        red:    { bg: "#AD0B16", glow: "#ff3333" },
        yellow: { bg: "#8C8166", glow: "#EBDDC4" },
        blue:   { bg: "#5A6B7A", glow: "#A9B9C8" }
    };

    const syncDigit = async (digit, storageKey) => {
        const gameCode = localStorage.getItem('currentGameCode');
        localStorage.setItem(storageKey, digit);
        try {
            await apiFetch(`/api/v1/game/${gameCode}/update-enigma`, {
                method: 'POST',
                body: JSON.stringify({
                    type: 'digit_update',
                    side: storageKey,
                    index: 99,
                    status: digit
                })
            });
        } catch (e) { console.error("Erreur sync Simon:", e); }
    };

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
            setTimeout(() => setActiveColor(null), LIGHT_DURATION);
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
                syncDigit('8', 'simon_digit');
                setTimeout(() => setGameState("won"), 1200);
            } else {
                setIsDisplaying(true);
                setTimeout(() => addToSequence(sequence), 800);
            }
        }
    };

    return (
        <div style={styles.container}>
            <button onClick={() => setShowRules(true)} style={styles.infoBtn}>
                <RiInformationLine size={22} />
            </button>

            <div style={styles.header}>
                <h1 style={styles.title}>SIMON PROTOCOL</h1>
                <div style={styles.statusBar}>
                    <div style={styles.levelIndicator}>
                        SÉQUENCE : {sequence.length} / {targetLength}
                    </div>
                    <div style={styles.progressTrack}>
                        <div style={{ ...styles.progressFill, width: `${(sequence.length / targetLength) * 100}%` }} />
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
                            backgroundColor: colorMap[color].bg,
                            opacity: activeColor === color || gameState === "solved" ? 1 : 0.3,
                            boxShadow: activeColor === color || gameState === "solved"
                                ? `0 0 40px ${colorMap[color].glow}`
                                : "none",
                            borderColor: activeColor === color ? "#fff" : "rgba(255,255,255,0.1)",
                        }}
                    />
                ))}
            </div>

            <div style={styles.statusText}>
                {gameState === "solved" ? "FLUX STABLE" : isDisplaying ? "ANALYSE DU SIGNAL..." : "VOTRE TOUR"}
            </div>

            {/* MODALES D'INTERACTION */}
            {(showRules || gameState === "start" || gameState === "lost" || gameState === "won") && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        {showRules && (
                            <>
                                <h2 style={styles.modalTitle}>INSTRUCTIONS</h2>
                                <p style={styles.descText}>Mémorisez et reproduisez la séquence lumineuse. Le système augmente sa complexité à chaque étape.</p>
                                <button onClick={() => setShowRules(false)} style={styles.mainBtn}>RETOUR</button>
                            </>
                        )}

                        {gameState === "start" && !showRules && (
                            <>
                                <h2 style={styles.modalTitle}>SYSTÈME VERROUILLÉ</h2>
                                <p style={styles.descText}>Mémorisation de fréquence niveau {targetLength} requise.</p>
                                <button onClick={startGame} style={styles.mainBtn}>INITIALISER</button>
                            </>
                        )}

                        {gameState === "lost" && (
                            <>
                                <RiCloseLine size={40} color="var(--color-red)" style={{margin: "0 auto 10px"}} />
                                <h2 style={{ ...styles.modalTitle, color: "var(--color-red)" }}>ÉCHEC CRITIQUE</h2>
                                <p style={styles.descText}>Séquence corrompue. Réessayez.</p>
                                <button onClick={startGame} style={styles.mainBtn}>REDÉMARRER</button>
                            </>
                        )}

                        {gameState === "won" && (
                            <>
                                <RiCheckLine size={40} color="var(--color-sand)" style={{margin: "0 auto 10px"}} />
                                <h2 style={{ ...styles.modalTitle, color: "var(--color-sand)" }}>ACCÈS AUTORISÉ</h2>
                                <p style={styles.descText}>Deuxième chiffre extrait :</p>
                                <div style={styles.resultNum}>8</div>
                                <button onClick={() => router.push('/enigme-2')} style={styles.mainBtn}>RETOUR AU TERMINAL</button>
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
        position: "fixed", inset: 0,
        backgroundColor: "var(--color-darker-red)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        touchAction: "none", fontFamily: "'JetBrains Mono', monospace"
    },
    infoBtn: {
        position: "absolute", top: "20px", right: "20px",
        width: "40px", height: "40px", borderRadius: "10px",
        border: "1px solid var(--color-mid-red)", backgroundColor: "rgba(0,0,0,0.3)",
        color: "var(--color-sand)", display: "flex", alignItems: "center", justifyContent: "center"
    },
    header: { marginBottom: "40px", width: "280px", textAlign: "center" },
    title: { color: "var(--color-sand)", fontSize: "1.2rem", letterSpacing: "4px", fontWeight: "900", marginBottom: "15px" },
    statusBar: { width: "100%", background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "8px" },
    levelIndicator: { color: "var(--color-mat-red)", fontSize: "0.6rem", fontWeight: "bold", marginBottom: "8px" },
    progressTrack: { height: "4px", backgroundColor: "var(--color-darker-red)", borderRadius: "2px" },
    progressFill: { height: "100%", backgroundColor: "var(--color-red)", transition: "width 0.4s ease" },

    gameBoard: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", width: "280px", height: "280px" },
    pad: { borderRadius: "16px", border: "2px solid transparent", transition: "all 0.15s", outline: "none", cursor: "pointer" },

    statusText: { marginTop: "40px", color: "var(--color-mat-red)", fontWeight: "bold", fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase" },

    overlay: { position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" },
    modal: { background: "var(--color-darker-red)", border: "1px solid var(--color-mid-red)", padding: "30px", borderRadius: "20px", textAlign: "center", width: "85%", maxWidth: "340px" },
    modalTitle: { color: "var(--color-red)", fontSize: "1.1rem", fontWeight: "900", marginBottom: "20px", letterSpacing: "2px" },
    descText: { color: "var(--color-mat-blue)", fontSize: "0.85rem", marginBottom: "25px", lineHeight: "1.4" },
    resultNum: { fontSize: "6rem", color: "var(--color-sand)", fontWeight: "900", margin: "10px 0", lineHeight: "1" },
    mainBtn: { width: "100%", padding: "16px", backgroundColor: "var(--color-red)", color: "white", border: "none", fontWeight: "900", borderRadius: "8px", letterSpacing: "2px", cursor: "pointer" },
};

export default SimonFastCyber;