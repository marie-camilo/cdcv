"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    useCallback,
} from "react";
import { gameEvents, GAME_EVENTS } from '@/lib/gameEventBus';

const TimerContext = createContext(null);

const STORAGE_KEY = "game_ending_at_ms";

export function TimerProvider({ children }) {
    const [seconds, setSeconds] = useState(undefined);
    const [endingAtMs, setEndingAtMs] = useState(null);
    const [isFinished, setIsFinished] = useState(false);

    const intervalRef = useRef(null);
    const endingAtRef = useRef(null);
    const isInitializedRef = useRef(false);

    // ✅ Fonction pour arrêter le timer
    const stop = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // ✅ Fonction pour déclencher le game over
    const triggerGameOver = useCallback(() => {
        stop();
        setSeconds(0);
        setIsFinished(true);
    }, [stop]);

    // ✅ Fonction pour démarrer le timer depuis un timestamp
    const startFromEndingAt = useCallback((timestamp) => {
        const parsed = Number(timestamp);

        if (!parsed || Number.isNaN(parsed)) {
            console.error("TimerContext: endingAtMs invalide:", timestamp);
            setSeconds(0);
            return;
        }

        console.log("⏱️ [Timer] startFromEndingAt:", parsed);
        localStorage.setItem(STORAGE_KEY, parsed);
        endingAtRef.current = parsed;
        setEndingAtMs(parsed);
        setIsFinished(false);

        const compute = () => {
            const end = endingAtRef.current;
            if (!end) return;

            const now = Date.now();
            const diffMs = end - now;
            const diffSec = Math.ceil(diffMs / 1000);
            const safe = Math.max(0, diffSec);

            setSeconds(safe);

            // Détection de la fin du timer
            if (safe <= 0 && !isFinished) {
                stop();
                setIsFinished(true);
                console.log("⏱️ [Timer] Temps écoulé !");
            }
        };

        stop();
        compute();
        intervalRef.current = setInterval(compute, 1000);
    }, [stop, isFinished]);

    // ✅ 1. Charger ending_at depuis localStorage au démarrage (UNE SEULE FOIS)
    useEffect(() => {
        if (isInitializedRef.current) return;
        isInitializedRef.current = true;

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = Number(stored);
            if (!isNaN(parsed) && parsed > 0) {
                console.log("⏱️ [Timer] Chargé depuis localStorage:", parsed);
                startFromEndingAt(parsed);
            }
        }
    }, [startFromEndingAt]);

    // ✅ 2. Écouter GameStarting
    useEffect(() => {
        const unsub = gameEvents.on(GAME_EVENTS.GAME_STARTING, ({ endingAtMs: newEndingAtMs }) => {
            if (newEndingAtMs) {
                console.log("⏱️ [Timer] GameStarting reçu:", newEndingAtMs);
                startFromEndingAt(newEndingAtMs);
            }
        });

        return () => unsub();
    }, [startFromEndingAt]);

    // ✅ 3. Écouter LabyrinthCompleted
    useEffect(() => {
        const unsub = gameEvents.on(GAME_EVENTS.LABYRINTH_COMPLETED, ({ newEndingAtMs }) => {
            if (newEndingAtMs) {
                console.log("⏱️ [Timer] LabyrinthCompleted reçu:", newEndingAtMs);
                startFromEndingAt(newEndingAtMs);
            }
        });

        return () => unsub();
    }, [startFromEndingAt]);

    // ✅ 4. Sync périodique avec la DB (toutes les 2 minutes)
    useEffect(() => {
        const syncWithDB = async () => {
            const gameCode = localStorage.getItem('currentGameCode');
            if (!gameCode) return;

            try {
                const { apiFetch } = await import('@/hooks/API/fetchAPI');
                const data = await apiFetch(`/api/v1/game/end/${gameCode}`);

                if (data?.ending_at_ms) {
                    const dbEndingAt = Number(data.ending_at_ms);
                    const localEndingAt = Number(localStorage.getItem(STORAGE_KEY));

                    // ✅ Ne sync que si différent de plus de 2 secondes (évite les micro-updates)
                    if (Math.abs(dbEndingAt - localEndingAt) > 2000) {
                        console.log("🔄 [Timer] Sync DB → localStorage:", dbEndingAt);
                        startFromEndingAt(dbEndingAt);
                    }
                }
            } catch (err) {
                console.error("❌ [Timer] Erreur sync DB:", err);
            }
        };

        // Premier sync après 5 secondes (pour laisser le temps au chargement initial)
        const initialTimeout = setTimeout(syncWithDB, 5000);
        // Puis toutes les 2 minutes
        const syncInterval = setInterval(syncWithDB, 120000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(syncInterval);
        };
    }, [startFromEndingAt]);

    // ✅ Nettoyage à la destruction du composant
    useEffect(() => {
        return () => stop();
    }, [stop]);

    return (
        <TimerContext.Provider value={{ seconds, startFromEndingAt, stop, isFinished, triggerGameOver }}>
            {children}
        </TimerContext.Provider>
    );
}

export function useTimer() {
    const ctx = useContext(TimerContext);
    if (!ctx) throw new Error("useTimer must be used within TimerProvider");
    return ctx;
}