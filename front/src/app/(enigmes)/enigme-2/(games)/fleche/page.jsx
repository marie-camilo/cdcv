"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

export default function ArrowMazeCyberStyle() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const canvasRef = useRef(null);
    const [leftArrows, setLeftArrows] = useState(0);
    const [rightArrows, setRightArrows] = useState(0);
    const [totalCollected, setTotalCollected] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState("");

    // Récupérer le paramètre target (left ou right)
    const target = searchParams.get('target');

    const playerRef = useRef({
        x: 30,
        y: 300,
        width: 22,
        height: 22,
        vx: 0,
        vy: 0,
        jumping: false,
    });
    const controlsRef = useRef({ left: false, right: false, jump: false });
    const arrowsRef = useRef([]);
    const platformsRef = useRef([]);
    const collectedRef = useRef(new Set());

    const canvasWidth = 350;
    const canvasHeight = 480;
    const gravity = 0.6;
    const jumpPower = -12;
    const moveSpeed = 5;

    useEffect(() => {
        platformsRef.current = [
            { x: 0, y: 450, width: 350, height: 30 },
            { x: 40, y: 370, width: 100, height: 12 },
            { x: 200, y: 310, width: 100, height: 12 },
            { x: 50, y: 240, width: 120, height: 12 },
            { x: 220, y: 180, width: 100, height: 12 },
            { x: 40, y: 120, width: 110, height: 12 },
            { x: 180, y: 60, width: 130, height: 12 },
        ];

        arrowsRef.current = [
            { id: 1, x: 80, y: 340, dir: "left" },
            { id: 2, x: 260, y: 280, dir: "right" },
            { id: 3, x: 100, y: 210, dir: "left" },
            { id: 4, x: 280, y: 150, dir: "left" },
            { id: 5, x: 80, y: 90, dir: "right" },
            { id: 6, x: 250, y: 30, dir: "left" },
            { id: 7, x: 300, y: 420, dir: "right" },
        ];
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animationId;

        const gameLoop = () => {
            if (showResult) return;
            const player = playerRef.current;

            if (controlsRef.current.left) player.vx = -moveSpeed;
            else if (controlsRef.current.right) player.vx = moveSpeed;
            else player.vx *= 0.8;

            if (controlsRef.current.jump && !player.jumping) {
                player.vy = jumpPower;
                player.jumping = true;
            }

            player.vy += gravity;
            player.y += player.vy;
            player.x += player.vx;

            if (player.x < 0) player.x = 0;
            if (player.x + player.width > canvasWidth)
                player.x = canvasWidth - player.width;

            platformsRef.current.forEach((p) => {
                if (
                    player.x < p.x + p.width &&
                    player.x + player.width > p.x &&
                    player.y < p.y + p.height &&
                    player.y + player.height > p.y
                ) {
                    if (player.vy > 0 && player.y + player.height <= p.y + 12) {
                        player.y = p.y - player.height;
                        player.vy = 0;
                        player.jumping = false;
                    }
                }
            });

            if (player.y > canvasHeight) {
                player.y = 350;
                player.x = 30;
                player.vy = 0;
            }

            arrowsRef.current.forEach((arrow) => {
                if (collectedRef.current.has(arrow.id)) return;
                const dx = player.x + player.width / 2 - arrow.x;
                const dy = player.y + player.height / 2 - arrow.y;
                if (Math.sqrt(dx * dx + dy * dy) < 22) {
                    collectedRef.current.add(arrow.id);
                    if (arrow.dir === "left") setLeftArrows((l) => l + 1);
                    else setRightArrows((r) => r + 1);
                    setTotalCollected((prev) => {
                        const next = prev + 1;
                        if (next === arrowsRef.current.length) {
                            const finalL = arrow.dir === "left" ? leftArrows + 1 : leftArrows;
                            const finalR =
                                arrow.dir === "right" ? rightArrows + 1 : rightArrows;
                            setResult(finalL > finalR ? "GAUCHE" : "DROITE");
                            setTimeout(() => setShowResult(true), 300);
                        }
                        return next;
                    });
                }
            });

            ctx.fillStyle = "#0d0505";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            ctx.fillStyle = "#00ff88";
            platformsRef.current.forEach((p) => {
                ctx.fillRect(p.x, p.y, p.width, p.height);
            });

            arrowsRef.current.forEach((a) => {
                if (collectedRef.current.has(a.id)) return;
                ctx.fillStyle = a.dir === "left" ? "#ff3333" : "#3366ff";
                ctx.beginPath();
                if (a.dir === "left") {
                    ctx.moveTo(a.x + 8, a.y - 6);
                    ctx.lineTo(a.x - 8, a.y);
                    ctx.lineTo(a.x + 8, a.y + 6);
                } else {
                    ctx.moveTo(a.x - 8, a.y - 6);
                    ctx.lineTo(a.x + 8, a.y);
                    ctx.lineTo(a.x - 8, a.y + 6);
                }
                ctx.fill();
            });

            ctx.fillStyle = "#ff3333";
            ctx.fillRect(player.x, player.y, player.width, player.height);
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 1;
            ctx.strokeRect(player.x, player.y, player.width, player.height);

            animationId = requestAnimationFrame(gameLoop);
        };

        gameLoop();
        return () => cancelAnimationFrame(animationId);
    }, [leftArrows, rightArrows, showResult]);

    const handleReturn = () => {
        // Sauvegarder le déverrouillage du casier
        if (target) {
            localStorage.setItem(`locker_${target}`, 'unlocked');
        }
        router.push('/enigme-2');
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>EXPLORATION MISSION</h1>
                <div style={styles.statsRow}>
                    <div style={styles.arrowsIndicator}>
                        <span style={{ color: "#ff3333", marginRight: "10px" }}>
                            ← {leftArrows}
                        </span>
                        <span style={{ color: "#3366ff" }}>→ {rightArrows}</span>
                    </div>
                </div>
            </div>

            <div style={styles.canvasWrapper}>
                <canvas
                    ref={canvasRef}
                    width={canvasWidth}
                    height={canvasHeight}
                    style={styles.canvas}
                />
            </div>

            <div style={styles.controls}>
                <div style={styles.dPad}>
                    <button
                        onTouchStart={() => (controlsRef.current.left = true)}
                        onTouchEnd={() => (controlsRef.current.left = false)}
                        style={styles.btnMove}
                    >
                        ◄
                    </button>
                    <button
                        onTouchStart={() => (controlsRef.current.right = true)}
                        onTouchEnd={() => (controlsRef.current.right = false)}
                        style={styles.btnMove}
                    >
                        ►
                    </button>
                </div>
                <button
                    onTouchStart={() => (controlsRef.current.jump = true)}
                    onTouchEnd={() => (controlsRef.current.jump = false)}
                    style={styles.btnJump}
                >
                    SAUT
                </button>
            </div>

            {showResult && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.modalTitle}>PARE-FEU DÉSACTIVÉ</h2>
                        <div style={styles.resultContainer}>
                            <div style={styles.hackIcon}>🔓</div>
                            <div style={styles.successMsg}>ACCÈS AUTORISÉ</div>
                        </div>
                        <p style={styles.modalHint}>
                            Protocole de sécurité neutralisé. Le casier {target === 'left' ? 'GAUCHE' : 'DROITE'} est maintenant accessible.
                        </p>
                        <button
                            onClick={handleReturn}
                            style={styles.restartBtn}
                        >
                            RETOUR AU TERMINAL
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        position: "fixed",
        inset: 0,
        backgroundColor: "#1a0a0a",
        display: "flex",
        flexDirection: "column",
        touchAction: "none",
        fontFamily: "sans-serif",
    },
    header: {
        padding: "15px",
        textAlign: "center",
        borderBottom: "2px solid #ff3333",
    },
    title: {
        color: "#ff3333",
        margin: "0 0 5px",
        fontSize: "1.2rem",
        letterSpacing: "2px",
        fontWeight: "bold",
    },
    statsRow: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.9rem",
        fontWeight: "bold",
    },
    arrowsIndicator: {
        backgroundColor: "#2a1010",
        padding: "2px 10px",
        borderRadius: "5px",
    },
    canvasWrapper: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        padding: "10px",
    },
    canvas: {
        border: "3px solid #ff3333",
        borderRadius: "10px",
        maxWidth: "100%",
        maxHeight: "100%",
    },
    controls: {
        height: "150px",
        backgroundColor: "#1a0a0a",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 25px",
        borderTop: "2px solid #ff3333",
    },
    dPad: { display: "flex", gap: "15px" },
    btnMove: {
        width: "70px",
        height: "70px",
        backgroundColor: "#2a1010",
        border: "2px solid #ff3333",
        color: "#ff3333",
        borderRadius: "15px",
        fontSize: "24px",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
    },
    btnJump: {
        width: "85px",
        height: "85px",
        backgroundColor: "#ff3333",
        border: "none",
        borderRadius: "50%",
        color: "#000",
        fontWeight: "bold",
        fontSize: "14px",
        boxShadow: "0 0 15px rgba(255,51,51,0.4)",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
    },
    overlay: {
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
    },
    modal: {
        background: "#1a0a0a",
        border: "2px solid #ff3333",
        borderRadius: "20px",
        padding: "30px",
        textAlign: "center",
        width: "85%",
    },
    modalTitle: {
        color: "#ff3333",
        fontSize: "1.8rem",
        margin: "0 0 20px",
        fontWeight: "bold",
    },
    resultContainer: { margin: "20px 0" },
    resultLabel: { color: "#ff9999", fontSize: "0.8rem", letterSpacing: "1px" },
    resultValue: {
        color: "#ff3333",
        fontSize: "3.5rem",
        fontWeight: "bold",
        textShadow: "0 0 15px rgba(255,51,51,0.5)",
    },
    hackIcon: {
        fontSize: "5rem",
        margin: "10px 0",
    },
    successMsg: {
        color: "#00ff88",
        fontSize: "1.8rem",
        fontWeight: "bold",
        letterSpacing: "3px",
        textShadow: "0 0 20px rgba(0,255,136,0.5)",
    },
    modalHint: { color: "#fff", fontSize: "0.9rem", marginBottom: "25px" },
    restartBtn: {
        padding: "15px 30px",
        background: "#ff3333",
        color: "#000",
        border: "none",
        borderRadius: "10px",
        fontWeight: "bold",
        width: "100%",
        fontSize: "1rem",
    },
};