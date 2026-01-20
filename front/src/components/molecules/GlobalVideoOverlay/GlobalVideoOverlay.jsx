// components/GlobalVideoOverlay.jsx
"use client";
import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useVideoTrigger } from '@/hooks/API/useVideoTrigger';

const VIDEO_MAP = {
    'foyer': '/video-foyer.mov',
};

export default function GlobalVideoOverlay() {
    const router = useRouter();
    const videoRef = useRef(null);
    const { activeVideo, clearVideo } = useVideoTrigger();

    if (!activeVideo) return null;

    const videoSrc = VIDEO_MAP[activeVideo];

    const handleVideoEnd = () => {
        clearVideo();
        if (activeVideo === 'foyer') {
            router.push('/');
        }
    };

    const handleSkip = () => {
        clearVideo();
        if (activeVideo === 'foyer') {
            router.push('/');
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center p-4">
                <video
                    ref={videoRef}
                    src={videoSrc}
                    className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
                    controls
                    autoPlay
                    onEnded={handleVideoEnd}
                    playsInline
                />
                <button
                    onClick={handleSkip}
                    className="absolute bottom-4 right-4 text-[10px] text-white/30 border border-white/10 px-2 py-1 rounded hover:text-white/60 hover:border-white/30 transition-all"
                >
                    Passer la séquence
                </button>
            </div>
        </div>
    );
}