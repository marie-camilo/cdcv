"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { apiFetch } from "@/hooks/API/fetchAPI";
import { RiInformationLine, RiCheckLine, RiCloseLine } from "react-icons/ri";

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
    const speed = 2.5 + score * 1.4;

    const directionRef = useRef(1);
    const posRef = useRef(0);
    const isLocked = useRef(false);

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
        } catch (e) { console.error("Erreur sync Zip:", e); }
    };

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
        if (e) e.stopPropagation();
        resetSystem();
        setScore(0);
        setGameState("playing");
        setShowRules(false);
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
                syncDigit('3', 'zip_digit');
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
            setTimeout(() => setGameState("lost"), 400);
        }
    };

    return (
        <div
            style={styles.container}
            onTouchStart={handleAction}
            onMouseDown={(e) => { if (!("ontouchstart" in window)) handleAction(e); }}
        >
            <button
                onPointerDown={(e) => { e.stopPropagation(); setShowRules(true); }}
                style={styles.infoBtn}
            >
                <RiInformationLine size={22} />
            </button>

            <div style={styles.header}>
                <h1 style={styles.title}>ZIP PROTOCOL</h1>
                <div style={styles.statusBar}>
                    <div style={styles.levelIndicator}>
                        SYNCHRONISATION : {score} / {targetCount}
                    </div>
                    <div style={styles.progressTrack}>
                        <div style={{ ...styles.progressFill, width: `${(score / targetCount) * 100}%` }} />
                    </div>
                </div>
            </div>

            <div style={styles.gameArea}>
                <div style={styles.track}>
                    {/* Zone Cible en Sable */}
                    <div
                        style={{
                            ...styles.targetZone,
                            width: `${targetWidth}px`,
                            left: `${(containerWidth - targetWidth) / 2}px`,
                            backgroundColor: isLocked.current && gameState !== "lost"
                                ? "var(--color-sand)"
                                : "rgba(235, 221, 196, 0.15)",
                            borderColor: "var(--color-sand)"
                        }}
                    />
                    {/* Barre Mobile en Rouge Mat */}
                    <div
                        style={{
                            ...styles.movingBar,
                            left: `${barPos}px`,
                            width: `${barWidth}px`,
                            backgroundColor: isLocked.current
                                ? gameState === "lost" ? "var(--color-red)" : "white"
                                : "var(--color-mat-red)",
                        }}
                    />
                </div>
                <div style={styles.hintText}>ALIGNEMENT LASER REQUIS</div>
            </div>

            {/* MODALES */}
            {(showRules || gameState === "start" || gameState === "lost" || gameState === "won") && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        {showRules && (
                            <>
                                <h2 style={styles.modalTitle}>CALIBRATION</h2>
                                <p style={styles.descText}>Stabilisez le flux au centre de la mire. La zone de capture se réduit à chaque palier.</p>
                                <button onPointerDown={(e) => { e.stopPropagation(); setShowRules(false); }} style={styles.mainBtn}>RETOUR</button>
                            </>
                        )}

                        {gameState === "start" && !showRules && (
                            <>
                                <h2 style={styles.modalTitle}>ACCÈS SÉCURISÉ</h2>
                                <p style={styles.descText}>Initialisation de la séquence de synchronisation niv. 5.</p>
                                <button onPointerDown={handleStart} style={styles.mainBtn}>INITIALISER</button>
                            </>
                        )}

                        {gameState === "lost" && (
                            <>
                                <RiCloseLine size={40} color="var(--color-red)" style={{margin: "0 auto 10px"}} />
                                <h2 style={{ ...styles.modalTitle, color: "var(--color-red)" }}>DÉSYNCHRONISATION</h2>
                                <p style={styles.descText}>Alignement critique échoué. Tentative de reconnexion...</p>
                                <button onPointerDown={handleStart} style={styles.mainBtn}>RÉESSAYER</button>
                            </>
                        )}

                        {gameState === "won" && (
                            <>
                                <RiCheckLine size={40} color="var(--color-sand)" style={{margin: "0 auto 10px"}} />
                                <h2 style={{ ...styles.modalTitle, color: "var(--color-sand)" }}>FLUX STABLE</h2>
                                <p style={styles.descText}>Troisième numéro extrait :</p>
                                <div style={styles.resultNum}>3</div>
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
        touchAction: "none", fontFamily: "'JetBrains Mono', monospace", overflow: "hidden"
    },
    infoBtn: {
        position: "absolute", top: "20px", right: "20px",
        width: "40px", height: "40px", borderRadius: "10px",
        border: "1px solid var(--color-mid-red)", backgroundColor: "rgba(0,0,0,0.3)",
        color: "var(--color-sand)", display: "flex", alignItems: "center", justifyContent: "center"
    },
    header: { marginBottom: "60px", width: "280px", textAlign: "center" },
    title: { color: "var(--color-sand)", fontSize: "1.2rem", letterSpacing: "4px", fontWeight: "900", marginBottom: "15px" },
    statusBar: { width: "100%", background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "8px" },
    levelIndicator: { color: "var(--color-mat-red)", fontSize: "0.6rem", fontWeight: "bold", marginBottom: "8px", tracking: "2px" },
    progressTrack: { height: "4px", backgroundColor: "var(--color-darker-red)", borderRadius: "2px" },
    progressFill: { height: "100%", backgroundColor: "var(--color-red)", transition: "width 0.3s ease" },

    gameArea: { display: "flex", flexDirection: "column", alignItems: "center", width: "100%" },
    track: { position: "relative", width: "300px", height: "50px", backgroundColor: "rgba(0,0,0,0.4)", border: "1px solid var(--color-mid-red)", borderRadius: "8px" },
    targetZone: { position: "absolute", top: 0, bottom: 0, borderLeft: "2px solid", borderRight: "2px solid", transition: "all 0.3s" },
    movingBar: { position: "absolute", top: "4px", bottom: "4px", borderRadius: "2px", transition: "background-color 0.1s" },
    hintText: { marginTop: "30px", color: "var(--color-mat-red)", fontSize: "0.7rem", letterSpacing: "3px", fontWeight: "bold", opacity: 0.6 },

    overlay: { position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" },
    modal: { background: "var(--color-darker-red)", border: "1px solid var(--color-mid-red)", padding: "30px", borderRadius: "20px", textAlign: "center", width: "85%", maxWidth: "340px" },
    modalTitle: { color: "var(--color-red)", fontSize: "1.1rem", fontWeight: "900", marginBottom: "20px", letterSpacing: "2px" },
    descText: { color: "var(--color-mat-blue)", fontSize: "0.85rem", marginBottom: "25px", lineHeight: "1.5" },
    resultNum: { fontSize: "6rem", color: "var(--color-sand)", fontWeight: "900", margin: "10px 0", lineHeight: "1" },
    mainBtn: { width: "100%", padding: "16px", backgroundColor: "var(--color-red)", color: "white", border: "none", fontWeight: "900", borderRadius: "8px", letterSpacing: "2px", cursor: "pointer" },
};

export default ZipCyberShielded;