"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from "@/hooks/API/fetchAPI";

export default function ArrowMazeCyberStyle() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const canvasRef = useRef(null);
    const [leftArrows, setLeftArrows] = useState(0);
    const [rightArrows, setRightArrows] = useState(0);
    const [totalCollected, setTotalCollected] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const target = searchParams.get('target');

    const playerRef = useRef({
        x: 30, y: 300, width: 22, height: 22, vx: 0, vy: 0, jumping: false,
    });
    const controlsRef = useRef({ left: false, right: false, jump: false });
    const arrowsRef = useRef([]);
    const platformsRef = useRef([]);
    const collectedRef = useRef(new Set());

    const canvasWidth = 350;
    const canvasHeight = 480;

    // vitesse et physiques curseur
    const gravity = 0.6;
    const jumpPower = -11;
    const moveSpeed = 5.8;
    const friction = 0.82;

    // GESTION DU CLAVIER
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft" || e.key === "q") controlsRef.current.left = true;
            if (e.key === "ArrowRight" || e.key === "d") controlsRef.current.right = true;
            if (e.key === "ArrowUp" || e.key === " " || e.key === "z") controlsRef.current.jump = true;
        };

        const handleKeyUp = (e) => {
            if (e.key === "ArrowLeft" || e.key === "q") controlsRef.current.left = false;
            if (e.key === "ArrowRight" || e.key === "d") controlsRef.current.right = false;
            if (e.key === "ArrowUp" || e.key === " " || e.key === "z") controlsRef.current.jump = false;
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

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

            // --- PHYSIQUE ---
            if (controlsRef.current.left) player.vx = -moveSpeed;
            else if (controlsRef.current.right) player.vx = moveSpeed;
            else player.vx *= friction; // Friction ajustée

            if (controlsRef.current.jump && !player.jumping) {
                player.vy = jumpPower;
                player.jumping = true;
            }

            player.vy += gravity;
            player.y += player.vy;
            player.x += player.vx;

            // Limites bords
            if (player.x < 0) player.x = 0;
            if (player.x + player.width > canvasWidth) player.x = canvasWidth - player.width;

            // Collisions Plateformes
            platformsRef.current.forEach((p) => {
                if (player.x < p.x + p.width && player.x + player.width > p.x &&
                    player.y < p.y + p.height && player.y + player.height > p.y) {

                    // Détection simplifiée pour éviter de passer au travers
                    if (player.vy > 0 && player.y + player.height <= p.y + 15) {
                        player.y = p.y - player.height;
                        player.vy = 0;
                        player.jumping = false;
                    }
                }
            });

            // Mort (chute) -> Respawn
            if (player.y > canvasHeight) {
                player.y = 350; player.x = 30; player.vy = 0;
            }

            // Collecte
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
                            setTimeout(() => setShowResult(true), 300);
                        }
                        return next;
                    });
                }
            });

            ctx.fillStyle = "#2A0C0C";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            ctx.strokeStyle = "rgba(195, 118, 112, 0.1)";
            ctx.lineWidth = 1;
            for (let i = 0; i < canvasWidth; i += 25) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvasHeight); ctx.stroke(); }
            for (let i = 0; i < canvasHeight; i += 25) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvasWidth, i); ctx.stroke(); }

            platformsRef.current.forEach((p) => {
                ctx.fillStyle = "#4A080C";
                ctx.fillRect(p.x, p.y, p.width, p.height);
                ctx.strokeStyle = "#C37670";
                ctx.strokeRect(p.x, p.y, p.width, p.height);
            });

            arrowsRef.current.forEach((a) => {
                if (collectedRef.current.has(a.id)) return;
                ctx.fillStyle = a.dir === "left" ? "#C37670" : "#A9B9C8";
                ctx.beginPath();
                if (a.dir === "left") { ctx.moveTo(a.x + 8, a.y - 6); ctx.lineTo(a.x - 8, a.y); ctx.lineTo(a.x + 8, a.y + 6); }
                else { ctx.moveTo(a.x - 8, a.y - 6); ctx.lineTo(a.x + 8, a.y); ctx.lineTo(a.x - 8, a.y + 6); }
                ctx.fill();
            });

            ctx.fillStyle = "#D0FF71";
            ctx.fillRect(player.x, player.y, player.width, player.height);
            ctx.strokeRect(player.x, player.y, player.width, player.height);

            animationId = requestAnimationFrame(gameLoop);
        };

        gameLoop();
        return () => cancelAnimationFrame(animationId);
    }, [showResult]);

    const handleReturn = async () => {
        const gameCode = localStorage.getItem('currentGameCode');
        if (target) localStorage.setItem(`locker_${target}`, 'unlocked');
        try {
            await apiFetch(`/api/v1/game/${gameCode}/update-enigma`, {
                method: 'POST',
                body: JSON.stringify({ type: 'case_update', side: target, index: -1, status: 'unlocked' })
            });
        } catch (e) { console.error(e); }
        router.push('/enigme-2');
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.statsRow}>
                    <div style={styles.arrowsIndicator}>
                        <span style={{ color: "var(--color-mat-red)", marginRight: "10px", fontWeight: "bold" }}>← {leftArrows}</span>
                        <span style={{ color: "var(--color-mat-blue)", fontWeight: "bold" }}>→ {rightArrows}</span>
                    </div>
                </div>
            </div>

            <div style={styles.canvasWrapper}>
                <div style={styles.canvasFrame}>
                    <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} style={styles.canvas} />
                </div>
            </div>

            <div style={styles.controls}>
                <div style={styles.dPad}>
                    <button onTouchStart={() => (controlsRef.current.left = true)} onTouchEnd={() => (controlsRef.current.left = false)} style={styles.btnMove}>◄</button>
                    <button onTouchStart={() => (controlsRef.current.right = true)} onTouchEnd={() => (controlsRef.current.right = false)} style={styles.btnMove}>►</button>
                </div>
                <button onTouchStart={() => (controlsRef.current.jump = true)} onTouchEnd={() => (controlsRef.current.jump = false)} style={styles.btnJump}>SAUT</button>
            </div>

            {showResult && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.modalTitle}>ACCÈS AUTORISÉ</h2>

                        <div style={styles.resultContainer}>
                            <p style={styles.modalIntro}>
                                Mouais.. Pas mal.
                                <br/><br/>
                                La sécurité de la rangée <strong>{target === 'left' ? 'GAUCHE' : 'DROITE'}</strong> est désactivée. Retournez au terminal et fouillez les casiers de cette zone.
                            </p>

                            <span style={{ color: 'var(--color-sand)', fontSize: '1.5rem', display: 'block', marginTop: '15px', fontWeight: '900', textTransform: 'uppercase' }}>
                                ZONE {target === 'left' ? 'GAUCHE' : 'DROITE'} OPEN
                            </span>
                        </div>

                        <button onClick={handleReturn} style={styles.restartBtn}>RETOUR AU TERMINAL</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        height: "100dvh",
        width: "100%",
        backgroundColor: "var(--color-darker-red)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'JetBrains Mono', monospace",
        overflow: "hidden"
    },
    header: {
        padding: "10px",
        textAlign: "center",
        borderBottom: "1px solid var(--color-mid-red)",
        background: "rgba(0,0,0,0.2)",
        flexShrink: 0
    },
    title: { color: "var(--color-sand)", margin: "0 0 5px", fontSize: "1rem", letterSpacing: "4px", fontWeight: "900" },
    statsRow: { display: "flex", justifyContent: "left" },
    arrowsIndicator: { backgroundColor: "var(--color-mid-red)", padding: "4px 15px", borderRadius: "20px", border: "1px solid var(--color-mat-red)" },
    canvasWrapper: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
        minHeight: 0
    },
    canvasFrame: {
        padding: "4px",
        background: "var(--color-mid-red)",
        borderRadius: "12px",
        boxShadow: "0 0 30px rgba(0,0,0,0.5)",
        maxWidth: "90vw"
    },
    canvas: {
        backgroundColor: "#2A0C0C",
        borderRadius: "8px",
        display: "block",
        width: "100%",
        height: "auto",
        maxHeight: "60vh"
    },
    controls: {
        height: "auto", // Hauteur automatique
        minHeight: "120px",
        backgroundColor: "rgba(0,0,0,0.3)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        borderTop: "1px solid var(--color-mid-red)",
        touchAction: "none",
        flexShrink: 0,
        paddingBottom: "calc(15px + env(safe-area-inset-bottom))" // Gère l'encoche du bas sur iPhone
    },
    dPad: { display: "flex", gap: "20px" },
    btnMove: { width: "65px", height: "65px", backgroundColor: "var(--color-mid-red)", border: "1px solid var(--color-mat-red)", color: "var(--color-sand)", borderRadius: "12px", fontSize: "20px", outline: "none" },
    btnJump: { width: "80px", height: "80px", backgroundColor: "var(--color-red)", border: "2px solid var(--color-sand)", borderRadius: "50%", color: "var(--color-sand)", fontWeight: "900", fontSize: "12px", boxShadow: "0 0 20px rgba(173,11,22,0.4)", outline: "none" },
    overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(10, 3, 3, 0.95)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px", backdropFilter: "blur(4px)" },
    modal: { background: "var(--color-darker-red)", border: "1px solid var(--color-mat-red)", padding: "30px", textAlign: "center", width: "100%", maxWidth: "350px" },
    modalTitle: { color: "var(--color-mat-red)", fontSize: "1rem", margin: "0 0 20px", fontWeight: "900", letterSpacing: "2px" },
    resultContainer: { margin: "20px 0" },
    modalIntro: { color: "#fff", fontSize: "0.9rem", lineHeight: "1.5" },
    restartBtn: { padding: "12px", background: "var(--color-red)", color: "var(--color-sand)", border: "none", borderRadius: "4px", fontWeight: "900", width: "100%", fontSize: "0.8rem", letterSpacing: "2px", marginTop: "20px", cursor: "pointer" },
};