"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from 'next/navigation';
import { apiFetch } from "@/hooks/API/fetchAPI";
import { RiInformationLine, RiCheckLine, RiGridFill } from "react-icons/ri";

const CipherPuzzleDelayed = () => {
    const router = useRouter();
    const gridSize = 3;
    const tileSize = 90;
    const [tiles, setTiles] = useState([]);
    const [showRules, setShowRules] = useState(false);
    const [gameState, setGameState] = useState("start");
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
        } catch (e) { console.error("Erreur sync Puzzle:", e); }
    };

    const createBoard = useCallback(() => {
        return Array.from({ length: gridSize * gridSize }, (_, i) => ({
            id: i,
            originalPos: i,
            currentPos: i,
            isEmpty: i === gridSize * gridSize - 1,
        }));
    }, []);

    const shufflePuzzle = () => {
        let newTiles = createBoard();
        let emptyIndex = gridSize * gridSize - 1;
        isLocked.current = false;

        for (let i = 0; i < 80; i++) {
            const neighbors = [];
            const row = Math.floor(emptyIndex / gridSize);
            const col = emptyIndex % gridSize;
            if (row > 0) neighbors.push(emptyIndex - gridSize);
            if (row < gridSize - 1) neighbors.push(emptyIndex + gridSize);
            if (col > 0) neighbors.push(emptyIndex - 1);
            if (col < gridSize - 1) neighbors.push(emptyIndex + 1);

            const moveToIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
            const temp = newTiles[emptyIndex];
            newTiles[emptyIndex] = newTiles[moveToIndex];
            newTiles[moveToIndex] = temp;
            emptyIndex = moveToIndex;
        }

        setTiles(newTiles.map((tile, index) => ({ ...tile, currentPos: index })));
        setGameState("playing");
        setShowRules(false);
    };

    const handleTileClick = (clickedIndex) => {
        if (gameState !== "playing" || isLocked.current) return;

        const emptyIndex = tiles.findIndex((t) => t.isEmpty);
        const rowClick = Math.floor(clickedIndex / gridSize);
        const colClick = clickedIndex % gridSize;
        const rowEmpty = Math.floor(emptyIndex / gridSize);
        const colEmpty = emptyIndex % gridSize;

        if (Math.abs(rowClick - rowEmpty) + Math.abs(colClick - colEmpty) === 1) {
            const newTiles = [...tiles];
            [newTiles[clickedIndex], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[clickedIndex]];
            setTiles(newTiles);

            if (newTiles.every((tile, index) => tile.originalPos === index)) {
                isLocked.current = true;
                setGameState("solved");
                syncDigit('9', 'tuile_digit');
                setTimeout(() => setGameState("won"), 1200);
            }
        }
    };

    return (
        <div style={styles.container}>
            <button onClick={() => setShowRules(true)} style={styles.infoBtn}>
                <RiInformationLine size={22} />
            </button>

            <div style={styles.header}>
                <h1 style={styles.title}>CIPHER PUZZLE</h1>
                <p style={{ ...styles.levelIndicator, color: gameState === "solved" ? "var(--color-sand)" : "var(--color-mat-red)" }}>
                    {gameState === "solved" ? "MATRICE RESTAURÉE" : "RÉALIGNEZ LES FRAGMENTS"}
                </p>
            </div>

            <div style={{
                ...styles.board,
                borderColor: gameState === "solved" ? "var(--color-sand)" : "var(--color-mid-red)"
            }}>
                {tiles.map((tile, index) => (
                    <div
                        key={tile.id}
                        onClick={() => handleTileClick(index)}
                        style={{
                            ...styles.tile,
                            width: tileSize - 4,
                            height: tileSize - 4,
                            left: (index % gridSize) * tileSize,
                            top: Math.floor(index / gridSize) * tileSize,
                            backgroundColor: tile.isEmpty ? "transparent" : "rgba(0,0,0,0.4)",
                            border: tile.isEmpty ? "1px dashed var(--color-mid-red)" : `2px solid ${gameState === "solved" ? "var(--color-sand)" : "var(--color-red)"}`,
                            color: gameState === "solved" ? "var(--color-sand)" : "white",
                            opacity: tile.isEmpty ? 0 : 1,
                            boxShadow: tile.isEmpty ? "none" : "inset 0 0 10px rgba(173,11,22,0.2)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                    >
                        {tile.originalPos + 1}
                    </div>
                ))}
            </div>

            {gameState === "playing" && (
                <div style={styles.hint}>
                    <RiGridFill style={{ marginRight: "8px" }} />
                    INTÉGRITÉ SYSTÈME : {Math.round((tiles.filter((t, i) => t.originalPos === i).length / 9) * 100)}%
                </div>
            )}

            {/* MODALES */}
            {(gameState === "start" || showRules) && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.modalTitle}>{showRules ? "ARCHIVES" : "MATRICE CORROMPUE"}</h2>
                        <p style={styles.descText}>
                            Réorganisez les fragments de 1 à 8 pour stabiliser le noyau.
                            <br /><br />
                            Le secteur vide doit se situer sur le noeud final (en bas à droite).
                        </p>
                        <button onClick={showRules ? () => setShowRules(false) : shufflePuzzle} style={styles.mainBtn}>
                            {showRules ? "RETOUR" : "DÉBLOQUER L'ACCÈS"}
                        </button>
                    </div>
                </div>
            )}

            {gameState === "won" && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <RiCheckLine size={40} color="var(--color-sand)" style={{ margin: "0 auto 10px" }} />
                        <h2 style={{ ...styles.modalTitle, color: "var(--color-sand)" }}>ACCÈS TOTAL</h2>
                        <p style={styles.descText}>Dernière séquence identifiée :</p>
                        <div style={styles.resultNum}>9</div>
                        <button onClick={() => router.push('/enigme-2')} style={styles.mainBtn}>
                            RETOUR AU TERMINAL
                        </button>
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
    header: { marginBottom: "40px", textAlign: "center" },
    title: { color: "var(--color-sand)", fontSize: "1.2rem", letterSpacing: "4px", fontWeight: "900", margin: 0 },
    levelIndicator: { fontSize: "0.65rem", marginTop: "8px", fontWeight: "bold", textTransform: "uppercase", tracking: "1px" },

    board: {
        position: "relative", width: "270px", height: "270px",
        backgroundColor: "rgba(0,0,0,0.2)", border: "2px solid",
        borderRadius: "8px", padding: "0px"
    },
    tile: {
        position: "absolute", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.8rem", fontWeight: "900", borderRadius: "4px", cursor: "pointer"
    },
    hint: {
        marginTop: "40px", color: "var(--color-mat-red)", fontSize: "0.65rem",
        fontWeight: "bold", opacity: 0.8, letterSpacing: "2px", display: "flex", alignItems: "center"
    },

    overlay: {
        position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.9)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)"
    },
    modal: {
        background: "var(--color-darker-red)", border: "1px solid var(--color-mid-red)",
        padding: "30px", borderRadius: "20px", textAlign: "center", width: "85%", maxWidth: "340px"
    },
    modalTitle: { color: "var(--color-red)", fontSize: "1.1rem", fontWeight: "900", marginBottom: "20px", letterSpacing: "2px" },
    descText: { color: "var(--color-mat-blue)", fontSize: "0.85rem", marginBottom: "25px", lineHeight: "1.6" },
    resultNum: { fontSize: "6rem", color: "var(--color-sand)", fontWeight: "900", margin: "10px 0", lineHeight: "1" },
    mainBtn: {
        width: "100%", padding: "16px", backgroundColor: "var(--color-red)",
        color: "white", border: "none", fontWeight: "900", borderRadius: "8px",
        letterSpacing: "2px", cursor: "pointer"
    },
};

export default CipherPuzzleDelayed;