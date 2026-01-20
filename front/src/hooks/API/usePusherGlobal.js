// hooks/API/usePusherGlobal.js modifié 19/01
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

            // 1️⃣ Mettre à jour unlockedApps
            const unlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');
            if (!unlocked.includes(data.appId)) {
                unlocked.push(data.appId);
                localStorage.setItem('unlockedApps', JSON.stringify(unlocked));
                console.log("💾 [Pusher] unlockedApps mis à jour:", unlocked);
            }

            // 2️⃣ Ajouter le nom de fichier dans game_codes (pour sidebar)
            if (data.fileName) {
                const currentCodes = JSON.parse(localStorage.getItem('game_codes') || '[]');

                // Vérifier si le fichier n'existe pas déjà
                if (!currentCodes.find(c => c.value === data.fileName)) {
                    currentCodes.push({
                        label: `APP: ${data.appId.toUpperCase()}`,
                        value: data.fileName
                    });
                    localStorage.setItem('game_codes', JSON.stringify(currentCodes));
                    console.log("✅ [Pusher] Nom de fichier ajouté:", data.fileName);
                }
            }

            // 3️⃣ Émettre l'événement sur le bus
            gameEvents.emit(GAME_EVENTS.APP_UNLOCKED, {
                appId: data.appId,
                fileName: data.fileName,
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
                    localStorage.setItem(`locker_${side}`, status);
                    gameEvents.emit(GAME_EVENTS.LOCKER_UPDATED, { side, status });
                } else {
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

        // 🔥 EVENT 4 : LabyrinthCompleted
        channel.bind('LabyrinthCompleted', (data) => {
            console.log("🎯 [Pusher] LabyrinthCompleted reçu:", data);

            // 1️⃣ Mettre à jour le timer
            if (data.new_ending_at_ms) {
                localStorage.setItem('game_ending_at_ms', data.new_ending_at_ms);
                console.log("⏱️ [Pusher] Timer mis à jour:", data.new_ending_at_ms);
            }

            // 2️⃣ Stocker le code final brut (pour l'énigme finale)
            if (data.final_code) {
                localStorage.setItem('final_folder_code', data.final_code);
                console.log("📁 [Pusher] Code dossier stocké:", data.final_code);
            }

            // 3️⃣ Ajouter à la liste des codes interceptés (sidebar)
            const currentCodes = JSON.parse(localStorage.getItem('game_codes') || '[]');
            if (data.final_code && !currentCodes.find(c => c.value === data.final_code)) {
                currentCodes.push({
                    label: "DOSSIER TERMINAL",
                    value: data.final_code
                });
                localStorage.setItem('game_codes', JSON.stringify(currentCodes));
                console.log("✅ [Pusher] Code ajouté à game_codes");
            }

            // 4️⃣ Débloquer l'app boussole pour tous
            const unlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');
            if (!unlocked.includes('boussole')) {
                unlocked.push('boussole');
                localStorage.setItem('unlockedApps', JSON.stringify(unlocked));
                console.log("🧭 [Pusher] App boussole débloquée !");
            }

            // 5️⃣ Émettre les événements sur le bus
            gameEvents.emit(GAME_EVENTS.LABYRINTH_COMPLETED, {
                newEndingAtMs: data.new_ending_at_ms,
                malusMinutes: data.malus_minutes,
                finalCode: data.final_code
            });

            gameEvents.emit(GAME_EVENTS.APP_UNLOCKED, {
                appId: 'boussole',
                fileName: data.final_code,
                unlockedApps: unlocked
            });
        });


        // 🔥 EVENT 5 : GameStarting
        channel.bind('GameStarting', (data) => {
            console.log("🎮 [Pusher] GameStarting reçu:", data);

            if (data.ending_at_ms) {
                localStorage.setItem('game_ending_at_ms', data.ending_at_ms);
                console.log("⏱️ [Pusher] Timer initialisé:", data.ending_at_ms);

                // Émettre l'événement pour que le TimerContext se mette à jour
                gameEvents.emit(GAME_EVENTS.GAME_STARTING, {
                    endingAtMs: data.ending_at_ms
                });
            }
        });

        // 🔥 Événements de debug Pusher
        pusher.connection.bind('connected', () => {
            console.log("✅ [Pusher] État: CONNECTÉ");
        });

        pusher.connection.bind('disconnected', () => {
            console.warn("⚠️ [Pusher] État: DÉCONNECTÉ");
        });

        pusher.connection.bind('error', (err) => {
            console.error("❌ [Pusher] Erreur de connexion:", err);
        });

        // Cleanup
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