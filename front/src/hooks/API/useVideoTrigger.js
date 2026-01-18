// hooks/useVideoTrigger.js
import { useEffect, useState } from 'react';
import { gameEvents, GAME_EVENTS } from '@/lib/gameEventBus';

export function useVideoTrigger() {
    const [activeVideo, setActiveVideo] = useState(null);

    useEffect(() => {
        const unsubscribe = gameEvents.on(GAME_EVENTS.VIDEO_TRIGGERED, (data) => {
            console.log("🎬 [useVideoTrigger] Vidéo reçue:", data.videoId);
            setActiveVideo(data.videoId);
        });

        return unsubscribe;
    }, []);

    const clearVideo = () => setActiveVideo(null);

    return { activeVideo, setActiveVideo, clearVideo };
}