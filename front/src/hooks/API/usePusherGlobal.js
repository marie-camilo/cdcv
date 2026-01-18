// hooks/API/usePusherGlobal.js
import { useEffect, useRef, useState } from 'react';
import Pusher from "pusher-js";
import { gameEvents, GAME_EVENTS } from '@/lib/gameEventBus';

export function usePusherGlobal() {
    const [gameCode, setGameCode] = useState(null);
    const pusherRef = useRef(null);

    useEffect(() => {
        const code = localStorage.getItem('currentGameCode');
        if (code) {
            setGameCode(code);
        }
    }, []);

    useEffect(() => {
        if (!gameCode || pusherRef.current) return;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
            cluster: "eu",
            forceTLS: true,
        });

        pusherRef.current = pusher;
        const channel = pusher.subscribe(`game.${gameCode}`);

        // 🔥 AppUnlocked
        channel.bind('AppUnlocked', (data) => {
            console.log("🔓 [PUSHER] App débloquée:", data.appId);

            const unlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');
            if (!unlocked.includes(data.appId)) {
                unlocked.push(data.appId);
                localStorage.setItem('unlockedApps', JSON.stringify(unlocked));
            }

            // ✅ ÉMETTRE L'ÉVÉNEMENT pour notifier les composants
            gameEvents.emit(GAME_EVENTS.APP_UNLOCKED, {
                appId: data.appId,
                unlockedApps: unlocked
            });
        });

        // 🔥 EnigmaUpdated
        channel.bind('EnigmaUpdated', (data) => {
            console.log("📡 [PUSHER] Énigme mise à jour:", data.payload);

            const { type, side, index, status } = data.payload;

            if (type === 'digit_update') {
                localStorage.setItem(side, status);
                // ✅ ÉMETTRE
                gameEvents.emit(GAME_EVENTS.DIGIT_UPDATED, { side, value: status });

            } else if (type === 'case_update') {
                if (index === -1) {
                    localStorage.setItem(`locker_${side}`, status);
                    // ✅ ÉMETTRE
                    gameEvents.emit(GAME_EVENTS.LOCKER_UPDATED, { side, status });
                } else {
                    localStorage.setItem(`snake_${side}_${index}`, status);
                    // ✅ ÉMETTRE
                    gameEvents.emit(GAME_EVENTS.SNAKE_UPDATED, { side, index, status });
                }
            }
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe(`game.${gameCode}`);
            pusher.disconnect();
            pusherRef.current = null;
        };
    }, [gameCode]);
}

export default usePusherGlobal;