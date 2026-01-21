"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { apiFetch } from "@/hooks/API/fetchAPI";
import { RiInformationLine, RiCloseLine, RiCheckLine } from "react-icons/ri";

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
        } catch (e) {
            console.error("Erreur sync Motus:", e);
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
        if (SOLUTION_WORDS.includes(word)) return true;
        try {
            const cleanWord = word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const url = `https://fr.wiktionary.org/w/api.php?action=query&format=json&origin=*&titles=${cleanWord}`;
            const response = await fetch(url);
            const data = await response.json();
            return Object.keys(data.query.pages)[0] !== "-1";
        } catch { return true; }
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
            setMessage("ACCÈS ACCORDÉ");
            syncDigit('4', 'motus_digit');
            setTimeout(() => setGameState("won"), 1500);
        } else if (newHistory.length >= MAX_ATTEMPTS) {
            setGameState("lost");
        } else {
            setMessage("");
        }
    };

    return (
        <div style={styles.container}>
            {/* Bouton Info moderne */}
            <button onClick={() => setShowRules(true)} style={styles.infoBtn}>
                <RiInformationLine size={20} />
            </button>

            <div style={styles.header}>
                <h1 style={styles.title}>MOTUS PROTOCOL</h1>
                <div style={styles.statusBar}>
                    <div style={styles.levelIndicator}>
                        TENTATIVE {history.length} / {MAX_ATTEMPTS}
                    </div>
                    <div style={styles.progressTrack}>
                        <div style={{ ...styles.progressFill, width: `${(history.length / MAX_ATTEMPTS) * 100}%` }} />
                    </div>
                </div>
            </div>

            <div style={styles.grid}>
                {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                    <div key={i} style={styles.row}>
                        {Array.from({ length: WORD_LENGTH }).map((_, j) => {
                            const attempt = history[i];
                            const isCurrent = i === history.length;
                            const char = attempt ? attempt.word[j] : isCurrent ? guess[j] : "";

                            let cellStyle = { ...styles.cell };
                            if (attempt) cellStyle = { ...cellStyle, ...styles[attempt.feedback[j]] };
                            if (isCurrent && char) cellStyle.borderColor = "var(--color-mat-red)";

                            return <div key={j} style={cellStyle}>{char}</div>;
                        })}
                    </div>
                ))}
            </div>

            {(gameState === "playing" || gameState === "solved") && (
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        style={styles.input}
                        value={guess}
                        onChange={(e) => setGuess(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5))}
                        disabled={isValidating || gameState === "solved"}
                        placeholder="ENTRER MOT"
                        autoFocus
                    />
                </form>
            )}

            <p style={styles.msgText}>{message}</p>

            {/* MODALE D'AIDE ET INITIALISATION */}
            {(gameState === "start" || showRules) && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.modalTitle}>{showRules ? "ARCHIVES" : "SYSTÈME VERROUILLÉ"}</h2>
                        <div style={styles.docBox}>
                            <p style={{ marginBottom: "15px", color: "white" }}>Déchiffrez le mot de 5 lettres pour obtenir le fragment du code.</p>
                            <div style={styles.docItem}>
                                <div style={{ ...styles.miniCell, ...styles.correct }}>A</div>
                                <span><b>LETTRE CORRECTE :</b> BIEN PLACÉE</span>
                            </div>
                            <div style={styles.docItem}>
                                <div style={{ ...styles.miniCell, ...styles.present }}>B</div>
                                <span><b>LETTRE PRÉSENTE :</b> MAL PLACÉE</span>
                            </div>
                        </div>
                        <button onClick={showRules ? () => setShowRules(false) : initializeGame} style={styles.mainBtn}>
                            {showRules ? "RETOUR" : "INITIALISER"}
                        </button>
                    </div>
                </div>
            )}

            {/* MODALE PERDU */}
            {gameState === "lost" && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <RiCloseLine size={40} color="var(--color-red)" style={{ margin: "0 auto 10px" }} />
                        <h2 style={styles.modalTitle}>ACCÈS REFUSÉ</h2>
                        <p style={styles.descText}>Le mot était : <b style={{ color: "white" }}>{currentSolution}</b></p>
                        <button onClick={initializeGame} style={styles.mainBtn}>RÉESSAYER</button>
                    </div>
                </div>
            )}

            {/* MODALE VICTOIRE */}
            {gameState === "won" && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <RiCheckLine size={40} color="var(--color-sand)" style={{ margin: "0 auto 10px" }} />
                        <h2 style={{ ...styles.modalTitle, color: "var(--color-sand)" }}>FRAGMENT RÉCUPÉRÉ</h2>
                        <p style={styles.descText}>Premier numéro de la combinaison :</p>
                        <div style={styles.resultNum}>4</div>
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
        fontFamily: "'JetBrains Mono', monospace", color: "var(--color-sand)"
    },
    infoBtn: {
        position: "absolute", top: "20px", right: "20px",
        width: "40px", height: "40px", borderRadius: "10px",
        border: "1px solid var(--color-mid-red)", backgroundColor: "rgba(0,0,0,0.3)",
        color: "var(--color-sand)", display: "flex", alignItems: "center", justifyContent: "center"
    },
    header: { marginBottom: "20px", width: "280px", textAlign: "center" },
    title: { fontSize: "1.1rem", fontWeight: "900", letterSpacing: "4px", marginBottom: "15px" },
    statusBar: { width: "100%", background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "8px" },
    levelIndicator: { color: "var(--color-mat-red)", fontSize: "0.6rem", fontWeight: "bold", marginBottom: "8px", tracking: "2px" },
    progressTrack: { height: "4px", backgroundColor: "var(--color-darker-red)", borderRadius: "2px" },
    progressFill: { height: "100%", backgroundColor: "var(--color-red)", transition: "width 0.4s", borderRadius: "2px" },

    grid: { display: "flex", flexDirection: "column", gap: "6px" },
    row: { display: "flex", gap: "6px" },
    cell: {
        width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.5rem", fontWeight: "900", border: "2px solid var(--color-mid-red)",
        backgroundColor: "rgba(0,0,0,0.3)", color: "white", transition: "all 0.3s"
    },

    // Status Couleurs (Palette)
    correct: { backgroundColor: "#b4d179", borderColor: "#b4d179", color: "var(--color-darker-red)" },
    present: { backgroundColor: "transparent", borderColor: "#f5b942", color: "#f5b942", borderRadius: "50%" },
    absent: { opacity: 0.3, borderColor: "transparent" },

    form: { marginTop: "30px" },
    input: {
        backgroundColor: "rgba(0,0,0,0.4)", color: "var(--color-sand)",
        border: "1px solid var(--color-mid-red)", padding: "15px",
        textAlign: "center", fontSize: "1.2rem", width: "220px", outline: "none",
        borderRadius: "8px", fontWeight: "bold"
    },
    msgText: { marginTop: "15px", fontSize: "0.7rem", fontWeight: "bold", letterSpacing: "1px", height: "1.2em", color: "var(--color-mat-red)" },

    overlay: {
        position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.9)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)"
    },
    modal: {
        background: "var(--color-darker-red)", border: "1px solid var(--color-mid-red)",
        padding: "30px", borderRadius: "16px", textAlign: "center", width: "85%", maxWidth: "340px"
    },
    modalTitle: { color: "var(--color-red)", fontSize: "1.1rem", fontWeight: "900", marginBottom: "20px", letterSpacing: "2px" },
    docBox: { textAlign: "left", fontSize: "0.75rem", marginBottom: "25px" },
    docItem: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", color: "var(--color-mat-blue)" },
    miniCell: {
        width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid var(--color-mid-red)", fontWeight: "bold", fontSize: "0.8rem"
    },
    resultNum: { fontSize: "6rem", color: "var(--color-sand)", fontWeight: "900", margin: "10px 0", lineHeight: "1" },
    mainBtn: {
        width: "100%", padding: "16px", backgroundColor: "var(--color-red)",
        color: "white", border: "none", fontWeight: "900", borderRadius: "8px",
        letterSpacing: "2px", cursor: "pointer"
    },
    descText: { color: "var(--color-mat-blue)", fontSize: "0.9rem", marginBottom: "20px" }
};

export default MotusCyberMission;