// hooks/API/usePusherGlobal.js
import { useEffect, useRef, useState } from 'react';
import Pusher from "pusher-js";
import { gameEvents, GAME_EVENTS } from '@/lib/gameEventBus';

export function usePusherGlobal() {
    const [gameCode, setGameCode] = useState(null);
    const pusherRef = useRef(null);
    const channelRef = useRef(null);

    // 1️⃣ Récupération du code de partie
    useEffect(() => {
        const code = localStorage.getItem('currentGameCode');
        if (code) {
            console.log("🎮 [Pusher] Code de partie détecté:", code);
            setGameCode(code);
        } else {
            console.warn("⚠️ [Pusher] Aucun code de partie trouvé");
        }
    }, []);

    // 2️⃣ Connexion Pusher et écoute des événements
    useEffect(() => {
        // Ne pas créer une nouvelle connexion si elle existe déjà
        if (!gameCode || pusherRef.current) {
            return;
        }

        console.log("🔌 [Pusher] Initialisation de la connexion...");

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
            cluster: "eu",
            forceTLS: true,
        });

        pusherRef.current = pusher;
        const channel = pusher.subscribe(`game.${gameCode}`);
        channelRef.current = channel;

        console.log("✅ [Pusher] Connecté au canal:", `game.${gameCode}`);

        // 🔥 EVENT 1 : AppUnlocked
        channel.bind('AppUnlocked', (data) => {
            console.log("🔓 [Pusher] AppUnlocked reçu:", data);

            // Mise à jour du localStorage
            const unlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');
            if (!unlocked.includes(data.appId)) {
                unlocked.push(data.appId);
                localStorage.setItem('unlockedApps', JSON.stringify(unlocked));
                console.log("💾 [Pusher] localStorage mis à jour:", unlocked);
            }

            // ✅ CRITICAL : Émettre l'événement sur le bus
            gameEvents.emit(GAME_EVENTS.APP_UNLOCKED, {
                appId: data.appId,
                unlockedApps: unlocked
            });
        });

        // 🔥 EVENT 2 : EnigmaUpdated
        channel.bind('EnigmaUpdated', (data) => {
            console.log("🧩 [Pusher] EnigmaUpdated reçu:", data.payload);

            const { type, side, index, status } = data.payload;

            if (type === 'digit_update') {
                localStorage.setItem(side, status);
                gameEvents.emit(GAME_EVENTS.DIGIT_UPDATED, { side, value: status });

            } else if (type === 'case_update') {
                if (index === -1) {
                    // Casier global
                    localStorage.setItem(`locker_${side}`, status);
                    gameEvents.emit(GAME_EVENTS.LOCKER_UPDATED, { side, status });
                } else {
                    // Case spécifique du Snake
                    localStorage.setItem(`snake_${side}_${index}`, status);
                    gameEvents.emit(GAME_EVENTS.SNAKE_UPDATED, { side, index, status });
                }
            }
        });

        // 🔥 EVENT 3 : VideoTriggered
        channel.bind('VideoTriggered', (data) => {
            console.log("🎬 [Pusher] VideoTriggered reçu:", data.videoId);
            gameEvents.emit(GAME_EVENTS.VIDEO_TRIGGERED, { videoId: data.videoId });
        });

        // 🔥 Événement de debug Pusher
        pusher.connection.bind('connected', () => {
            console.log("✅ [Pusher] État: CONNECTÉ");
        });

        pusher.connection.bind('disconnected', () => {
            console.warn("⚠️ [Pusher] État: DÉCONNECTÉ");
        });

        pusher.connection.bind('error', (err) => {
            console.error("❌ [Pusher] Erreur de connexion:", err);
        });

        // Cleanup à la destruction
        return () => {
            console.log("🔌 [Pusher] Nettoyage de la connexion...");
            if (channelRef.current) {
                channelRef.current.unbind_all();
                pusher.unsubscribe(`game.${gameCode}`);
            }
            pusher.disconnect();
            pusherRef.current = null;
            channelRef.current = null;
        };
    }, [gameCode]);
}

export default usePusherGlobal;