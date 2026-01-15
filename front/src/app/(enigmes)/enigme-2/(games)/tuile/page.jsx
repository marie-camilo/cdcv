"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from 'next/navigation';
import { apiFetch } from "@/hooks/API/fetchAPI"; // Import de l'utilitaire de fetch

const CipherPuzzleDelayed = () => {
    const router = useRouter();
    const gridSize = 3;
    const tileSize = 90;
    const [tiles, setTiles] = useState([]);
    const [showRules, setShowRules] = useState(false);
    const [gameState, setGameState] = useState("start");
    const isLocked = useRef(false);

    // Fonction de synchronisation pour mettre à jour les autres joueurs via Pusher
    const syncDigit = async (digit, storageKey) => {
        const gameCode = localStorage.getItem('currentGameCode');
        localStorage.setItem(storageKey, digit);

        try {
            await apiFetch(`/api/v1/game/${gameCode}/update-enigma`, {
                method: 'POST',
                body: JSON.stringify({
                    type: 'digit_update',
                    side: storageKey, // ex: 'tuile_digit'
                    index: 99, // Identifiant spécial pour les chiffres globaux
                    status: digit
                })
            });
        } catch (e) {
            console.error("Erreur de synchronisation Pusher:", e);
        }
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

            const moveToIndex =
                neighbors[Math.floor(Math.random() * neighbors.length)];
            const temp = newTiles[emptyIndex];
            newTiles[emptyIndex] = newTiles[moveToIndex];
            newTiles[moveToIndex] = temp;
            emptyIndex = moveToIndex;
        }

        setTiles(newTiles.map((tile, index) => ({ ...tile, currentPos: index })));
        setGameState("playing");
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
            [newTiles[clickedIndex], newTiles[emptyIndex]] = [
                newTiles[emptyIndex],
                newTiles[clickedIndex],
            ];
            setTiles(newTiles);

            if (newTiles.every((tile, index) => tile.originalPos === index)) {
                isLocked.current = true;
                setGameState("solved");

                // Synchronisation Pusher et sauvegarde locale
                syncDigit('9', 'tuile_digit');

                setTimeout(() => {
                    setGameState("won");
                }, 1200);
            }
        }
    };

    const handleReturn = () => {
        router.push('/enigme-2');
    };

    return (
        <div style={styles.container}>
            <button onClick={() => setShowRules(true)} style={styles.infoBtn}>
                i
            </button>

            <div style={styles.header}>
                <h1 style={styles.title}>CIPHER PUZZLE</h1>
                <p
                    style={{
                        ...styles.levelIndicator,
                        color: gameState === "solved" ? "#00ff88" : "#661111",
                    }}
                >
                    {gameState === "solved"
                        ? "MATRICE RESTAURÉE..."
                        : "RÉTABLISSEZ LA MATRICE"}
                </p>
            </div>

            <div
                style={{
                    ...styles.board,
                    borderColor:
                        gameState === "solved" || gameState === "won"
                            ? "#00ff88"
                            : "#ff3333",
                    transition: "border-color 0.5s ease",
                }}
            >
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
                            backgroundColor: tile.isEmpty ? "transparent" : "#1a0a0a",
                            border: tile.isEmpty
                                ? "1px dashed #331111"
                                : `2px solid ${gameState === "solved" ? "#00ff88" : "#ff3333"}`,
                            color: gameState === "solved" ? "#00ff88" : "#ff3333",
                            opacity: tile.isEmpty ? 0 : 1,
                            boxShadow: tile.isEmpty
                                ? "none"
                                : "inset 0 0 15px rgba(255,51,51,0.1)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                    >
                        {tile.originalPos + 1}
                    </div>
                ))}
            </div>

            {gameState === "playing" && (
                <div style={styles.hint}>ALIGNEMENT EN COURS...</div>
            )}

            {(gameState === "start" || showRules) && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.cyberText}>
                            {showRules ? "AIDE" : "SYSTÈME BLOQUÉ"}
                        </h2>
                        <p style={styles.descText}>
                            Faites glisser les tuiles de 1 à 8.
                            <br />
                            Le trou doit finir en bas à droite.
                        </p>
                        <button
                            onClick={showRules ? () => setShowRules(false) : shufflePuzzle}
                            style={styles.mainBtn}
                        >
                            {showRules ? "RETOUR" : "DÉBLOQUER"}
                        </button>
                    </div>
                </div>
            )}

            {gameState === "won" && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h2 style={{ color: "#00ff88" }}>ACCÈS TOTAL</h2>
                        <p style={styles.descText}>Code de fin de matrice identifié :</p>
                        <div style={styles.resultNum}>9</div>
                        <button
                            onClick={handleReturn}
                            style={styles.mainBtn}
                        >
                            RETOUR
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { position: "fixed", inset: 0, backgroundColor: "#050202", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", touchAction: "none", fontFamily: "monospace" },
    infoBtn: { position: "absolute", top: "20px", left: "20px", width: "35px", height: "35px", borderRadius: "50%", border: "1px solid #ff3333", backgroundColor: "transparent", color: "#ff3333", zIndex: 110 },
    header: { marginBottom: "40px", textAlign: "center" },
    title: { color: "#ff3333", fontSize: "1.5rem", letterSpacing: "4px", margin: 0 },
    levelIndicator: { fontSize: "0.7rem", marginTop: "5px", transition: "color 0.5s" },
    board: { position: "relative", width: "270px", height: "270px", backgroundColor: "#000", border: "2px solid #ff3333" },
    tile: { position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: "bold", userSelect: "none" },
    hint: { marginTop: "30px", color: "#ff3333", fontSize: "0.6rem", opacity: 0.5, letterSpacing: "1px" },
    overlay: { position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
    modal: { background: "#0a0505", border: "1px solid #ff3333", padding: "30px", borderRadius: "15px", textAlign: "center", width: "80%" },
    cyberText: { color: "#ff3333", fontSize: "1.2rem", marginBottom: "15px" },
    descText: { color: "#ccc", fontSize: "0.8rem", marginBottom: "25px", lineHeight: "1.5" },
    resultNum: { fontSize: "6rem", color: "#ff3333", fontWeight: "bold", textShadow: "0 0 20px #ff3333", margin: "10px 0" },
    mainBtn: { padding: "12px 25px", backgroundColor: "#ff3333", color: "#000", border: "none", fontWeight: "bold", letterSpacing: "1px" },
    secondaryBtn: { background: "none", border: "1px solid #333", color: "#555", padding: "10px 20px", fontSize: "0.7rem" },
};

export default CipherPuzzleDelayed;