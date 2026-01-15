"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { apiFetch } from "@/hooks/API/fetchAPI"; // Import de l'utilitaire API

const SOLUTION_WORDS = [
    "PIXEL", "ICONE", "MEDIA", "VIDEO", "PHOTO", "STYLE",
    "ANCRE", "CACHE", "INDEX", "TRAME", "SITES", "PROXY",
    "LOCAL", "CIBLE", "CODEC",
];
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 7;

const MotusCyberMission = () => {
    const router = useRouter();
    const [guess, setGuess] = useState("");
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState("");
    const [gameState, setGameState] = useState("start");
    const [currentSolution, setCurrentSolution] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [showRules, setShowRules] = useState(false);

    // Fonction de synchronisation pour mettre à jour les autres joueurs via Pusher
    const syncDigit = async (digit, storageKey) => {
        const gameCode = localStorage.getItem('currentGameCode');
        localStorage.setItem(storageKey, digit);

        try {
            await apiFetch(`/api/v1/game/${gameCode}/update-enigma`, {
                method: 'POST',
                body: JSON.stringify({
                    type: 'digit_update',
                    side: storageKey, // 'motus_digit'
                    index: 99,
                    status: digit
                })
            });
        } catch (e) {
            console.error("Erreur de synchronisation Motus:", e);
        }
    };

    const initializeGame = useCallback(() => {
        const word = SOLUTION_WORDS[Math.floor(Math.random() * SOLUTION_WORDS.length)];
        setCurrentSolution(word);
        setHistory([]);
        setGuess("");
        setGameState("playing");
        setMessage("");
        setShowRules(false);
    }, []);

    const checkWordExists = async (word) => {
        const cleanWord = word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (SOLUTION_WORDS.includes(word)) return true;
        try {
            const url = `https://fr.wiktionary.org/w/api.php?action=query&format=json&origin=*&titles=${cleanWord}`;
            const response = await fetch(url);
            const data = await response.json();
            return Object.keys(data.query.pages)[0] !== "-1";
        } catch {
            return true;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedGuess = guess.toUpperCase().trim();
        if (formattedGuess.length !== WORD_LENGTH || gameState !== "playing" || isValidating) return;

        setIsValidating(true);
        setMessage("VÉRIFICATION...");

        const exists = await checkWordExists(formattedGuess);
        if (!exists) {
            setMessage("MOT INCONNU !");
            setIsValidating(false);
            return;
        }

        const feedback = ((proposed) => {
            const fb = Array(WORD_LENGTH).fill("absent");
            const sol = currentSolution.split("");
            const prop = proposed.split("");
            prop.forEach((char, i) => {
                if (char === sol[i]) {
                    fb[i] = "correct";
                    sol[i] = null;
                    prop[i] = null;
                }
            });
            prop.forEach((char, i) => {
                if (char !== null) {
                    const idx = sol.indexOf(char);
                    if (idx !== -1) {
                        fb[i] = "present";
                        sol[idx] = null;
                    }
                }
            });
            return fb;
        })(formattedGuess);

        const newHistory = [...history, { word: formattedGuess, feedback }];
        setHistory(newHistory);
        setGuess("");
        setIsValidating(false);

        if (formattedGuess === currentSolution) {
            setGameState("solved");
            setMessage("ACCÈS ACCORDÉ - SYNCHRONISATION...");

            // Synchronisation et sauvegarde
            syncDigit('4', 'motus_digit');

            setTimeout(() => {
                setGameState("won");
            }, 1500);
        } else if (newHistory.length >= MAX_ATTEMPTS) {
            setGameState("lost");
            setMessage(`ÉCHEC. LE MOT ÉTAIT : ${currentSolution}`);
        } else {
            setMessage("");
        }
    };

    const handleReturn = () => {
        router.push('/enigme-2');
    };

    return (
        <div style={styles.container}>
            <button onClick={() => setShowRules(true)} style={styles.infoBtn}>i</button>

            <div style={styles.header}>
                <h1 style={{
                    ...styles.title,
                    color: gameState === "solved" || gameState === "won" ? "#00ff88" : "#ff3333",
                }}>
                    MOTUS PROTOCOL
                </h1>
                <div style={styles.statusBar}>
                    <div style={styles.levelIndicator}>
                        TENTATIVE : {history.length} / {MAX_ATTEMPTS}
                    </div>
                    <div style={styles.progressTrack}>
                        <div style={{
                            ...styles.progressFill,
                            width: `${(history.length / MAX_ATTEMPTS) * 100}%`,
                        }}></div>
                    </div>
                </div>
            </div>

            <div style={styles.grid}>
                {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                    <div key={i} style={styles.row}>
                        {Array.from({ length: WORD_LENGTH }).map((_, j) => {
                            const attempt = history[i];
                            const char = attempt ? attempt.word[j] : i === history.length ? guess[j] : "";
                            let cellStyle = { ...styles.cell };
                            if (attempt) cellStyle = { ...cellStyle, ...styles[attempt.feedback[j]] };
                            return <div key={j} style={cellStyle}>{char}</div>;
                        })}
                    </div>
                ))}
            </div>

            {(gameState === "playing" || gameState === "solved") && (
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        style={{
                            ...styles.input,
                            borderColor: gameState === "solved" ? "#00ff88" : "#ff3333",
                        }}
                        value={guess}
                        onChange={(e) => setGuess(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5))}
                        disabled={isValidating || gameState === "solved"}
                        placeholder={gameState === "solved" ? "OK" : "SAISIR"}
                        autoFocus
                    />
                </form>
            )}

            {message && (
                <p style={{ ...styles.msgText, color: gameState === "solved" ? "#00ff88" : "white" }}>
                    {message}
                </p>
            )}

            {(gameState === "start" || showRules) && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.cyberText}>{showRules ? "AIDE" : "SYSTÈME VERROUILLÉ"}</h2>
                        <div style={styles.docBox}>
                            <p>Trouvez le mot de 5 lettres.</p>
                            <div style={styles.docItem}>
                                <div style={{ ...styles.miniCell, ...styles.correct }}></div> BIEN PLACÉ
                            </div>
                            <div style={styles.docItem}>
                                <div style={{ ...styles.miniCell, ...styles.present }}></div> MAL PLACÉ
                            </div>
                        </div>
                        <button onClick={showRules ? () => setShowRules(false) : initializeGame} style={styles.mainBtn}>
                            {showRules ? "RETOUR" : "INITIALISER"}
                        </button>
                    </div>
                </div>
            )}

            {gameState === "lost" && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h2 style={{ color: "#ff3333" }}>ACCÈS REFUSÉ</h2>
                        <p style={styles.descText}>{message}</p>
                        <button onClick={initializeGame} style={styles.mainBtn}>RÉESSAYER</button>
                    </div>
                </div>
            )}

            {gameState === "won" && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h2 style={{ color: "#00ff88" }}>MOT DÉCRYPTÉ</h2>
                        <p style={styles.descText}>Premier numéro de la combinaison :</p>
                        <div style={styles.resultNum}>4</div>
                        <button onClick={handleReturn} style={styles.secondaryBtn}>
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
    infoBtn: { position: "absolute", top: "20px", left: "20px", width: "35px", height: "35px", borderRadius: "50%", border: "1px solid #ff3333", backgroundColor: "transparent", color: "#ff3333", zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center" },
    header: { marginBottom: "30px", width: "80%", textAlign: "center" },
    title: { fontSize: "1.4rem", letterSpacing: "4px", margin: "0 0 10px 0", transition: "color 0.5s" },
    statusBar: { width: "100%" },
    levelIndicator: { color: "#ff9999", fontSize: "0.7rem", marginBottom: "5px" },
    progressTrack: { height: "3px", backgroundColor: "#220000" },
    progressFill: { height: "100%", backgroundColor: "#ff3333", transition: "width 0.4s" },
    grid: { display: "flex", flexDirection: "column", gap: "5px", marginTop: "20px" },
    row: { display: "flex", gap: "5px" },
    cell: { width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", border: "2px solid #222", backgroundColor: "#111", color: "white", transition: "all 0.3s" },
    correct: { backgroundColor: "#00ff88", color: "black", borderColor: "#00ff88" },
    present: { backgroundColor: "#ffcc00", color: "black", borderRadius: "50%", borderColor: "#ffcc00" },
    absent: { backgroundColor: "#222", color: "#444" },
    form: { width: "100%", display: "flex", justifyContent: "center", marginTop: "20px" },
    input: { backgroundColor: "#000", color: "#ff3333", border: "2px solid #ff3333", padding: "12px", textAlign: "center", fontSize: "1.2rem", width: "180px", outline: "none", fontFamily: "monospace", transition: "border-color 0.5s" },
    msgText: { marginTop: "15px", fontSize: "0.7rem", letterSpacing: "1px", height: "1em" },
    overlay: { position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.98)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
    modal: { background: "#0a0505", border: "1px solid #ff3333", padding: "30px", borderRadius: "4px", textAlign: "center", width: "85%" },
    cyberText: { color: "#ff3333", fontSize: "1.3rem", marginBottom: "15px" },
    descText: { color: "#ccc", fontSize: "0.9rem", marginBottom: "20px" },
    docBox: { textAlign: "left", color: "#888", fontSize: "0.75rem", marginBottom: "20px" },
    docItem: { display: "flex", alignItems: "center", marginTop: "8px" },
    miniCell: { width: "15px", height: "15px", marginRight: "10px", border: "1px solid #555" },
    resultNum: { fontSize: "6rem", color: "#ff3333", fontWeight: "bold", textShadow: "0 0 30px #ff3333", margin: "15px 0" },
    mainBtn: { padding: "14px 30px", backgroundColor: "#ff3333", color: "#000", border: "none", fontWeight: "bold", letterSpacing: "2px" },
    secondaryBtn: { background: "none", border: "1px solid #333", color: "#555", padding: "10px 20px", marginTop: "10px" }
};

export default MotusCyberMission;