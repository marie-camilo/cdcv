"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { gameEvents, GAME_EVENTS } from '@/lib/gameEventBus';

const TimerContext = createContext(null);

const STORAGE_KEY = "game_ending_at_ms";

export function TimerProvider({ children }) {
    const [seconds, setSeconds] = useState(undefined);
    const [endingAtMs, setEndingAtMs] = useState(null);

    const intervalRef = useRef(null);

    // ✅ Fonction pour démarrer le timer depuis un timestamp
    const startFromEndingAt = (timestamp) => {
        if (timestamp && !isNaN(timestamp)) {
            console.log("⏱️ [Timer] startFromEndingAt:", timestamp);
            localStorage.setItem(STORAGE_KEY, timestamp);
            setEndingAtMs(timestamp);
        }
    };

    // ✅ 1. Charger ending_at depuis localStorage au démarrage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = Number(stored);
            if (!isNaN(parsed) && parsed > 0) {
                console.log("⏱️ [Timer] Chargé depuis localStorage:", parsed);
                setEndingAtMs(parsed);
            }
        }
    }, []);

    // ✅ 2. Calculer le temps restant chaque seconde
    useEffect(() => {
        if (!endingAtMs) {
            setSeconds(undefined);
            return;
        }

        const compute = () => {
            const now = Date.now();
            const diffMs = endingAtMs - now;
            const diffSec = Math.floor(diffMs / 1000);
            const safe = Math.max(0, diffSec);

            setSeconds(safe);

            if (safe <= 0 && intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                console.log("⏱️ [Timer] Temps écoulé !");
            }
        };

        compute();
        intervalRef.current = setInterval(compute, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [endingAtMs]);

    // ✅ 3. Écouter GameStarting
    useEffect(() => {
        const unsub = gameEvents.on(GAME_EVENTS.GAME_STARTING, ({ endingAtMs: newEndingAtMs }) => {
            if (newEndingAtMs) {
                console.log("⏱️ [Timer] GameStarting reçu:", newEndingAtMs);
                localStorage.setItem(STORAGE_KEY, newEndingAtMs);
                setEndingAtMs(newEndingAtMs);
            }
        });

        return () => unsub();
    }, []);

    // ✅ 4. Écouter LabyrinthCompleted
    useEffect(() => {
        const unsub = gameEvents.on(GAME_EVENTS.LABYRINTH_COMPLETED, ({ newEndingAtMs }) => {
            if (newEndingAtMs) {
                console.log("⏱️ [Timer] LabyrinthCompleted reçu:", newEndingAtMs);
                localStorage.setItem(STORAGE_KEY, newEndingAtMs);
                setEndingAtMs(newEndingAtMs);
            }
        });

        return () => unsub();
    }, []);
    // ✅ 5. Sync périodique avec la DB (toutes les 2 minutes)
    useEffect(() => {
        const syncWithDB = async () => {
            const gameCode = localStorage.getItem('currentGameCode');
            if (!gameCode) return;

            try {
                // ✅ Import dynamique pour éviter les problèmes SSR
                const { apiFetch } = await import('@/hooks/API/fetchAPI');
                const data = await apiFetch(`/api/v1/game/end/${gameCode}`);

                if (data?.ending_at_ms) {
                    const dbEndingAt = Number(data.ending_at_ms);
                    const localEndingAt = Number(localStorage.getItem(STORAGE_KEY));

                    if (dbEndingAt !== localEndingAt) {
                        console.log("🔄 [Timer] Sync DB → localStorage:", dbEndingAt);
                        localStorage.setItem(STORAGE_KEY, dbEndingAt);
                        setEndingAtMs(dbEndingAt);
                    }
                }
            } catch (err) {
                console.error("❌ [Timer] Erreur sync DB:", err);
            }
        };

        syncWithDB();
        const syncInterval = setInterval(syncWithDB, 120000);

        return () => clearInterval(syncInterval);
    }, []);
    return (
        <TimerContext.Provider value={{ seconds, startFromEndingAt }}>
            {children}
        </TimerContext.Provider>
    );
}

export function useTimer() {
    const ctx = useContext(TimerContext);
    if (!ctx) throw new Error("useTimer must be used within TimerProvider");
    return ctx;
}