"use client";
import React, { useState, useEffect, useRef } from 'react';

const PuzzleIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20.5 10.5c-.83 0-1.5-.67-1.5-1.5 0-1.93-1.57-3.5-3.5-3.5h-2V3.5c0-.83-.67-1.5-1.5-1.5S10.5 2.67 10.5 3.5v2h-2c-1.93 0-3.5 1.57-3.5 3.5v2h-2c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h2v2c0 1.93 1.57 3.5 3.5 3.5h2v2c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-2h2c1.93 0 3.5-1.57 3.5-3.5v-2h2c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-2v-2z" />
    </svg>
);

export default function RadarCompass({ targets, foundIds }) {
    const [headingRender, setHeadingRender] = useState(0);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [showDots, setShowDots] = useState(false);
    const targetHeading = useRef(0);
    const currentHeading = useRef(0);
    const rafId = useRef(null);
    const SMOOTHING_FACTOR = 0.1;

    const updatePhysics = () => {
        let diff = targetHeading.current - currentHeading.current;
        while (diff < -180) diff += 360;
        while (diff > 180) diff -= 360;
        currentHeading.current += diff * SMOOTHING_FACTOR;
        setHeadingRender(currentHeading.current);
        rafId.current = requestAnimationFrame(updatePhysics);
    };

    const handleOrientation = (event) => {
        let compass = 0;

        if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
            compass = event.webkitCompassHeading;
        }
        else if (event.alpha !== null) {
            compass = 360 - event.alpha;
        }

        if (compass < 0) compass += 360;
        if (compass >= 360) compass -= 360;

        targetHeading.current = compass;
    };

    const requestAccess = async () => {
        setIsSearching(true);
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const response = await DeviceOrientationEvent.requestPermission();
                if (response === 'granted') {
                    setPermissionGranted(true);
                    startCompass();
                    startSearchingSequence();
                } else {
                    alert("Permission refusée.");
                    setIsSearching(false);
                }
            } catch (error) {
                console.error(error);
                setIsSearching(false);
            }
        } else {
            setPermissionGranted(true);
            startCompass();
            startSearchingSequence();
        }
    };

    const startCompass = () => {
        window.addEventListener('deviceorientation', handleOrientation);

        if ('ondeviceorientationabsolute' in window) {
            window.addEventListener('deviceorientationabsolute', handleOrientation);
        }

        updatePhysics();
    };

    const startSearchingSequence = () => {
        setTimeout(() => {
            setIsSearching(false);
            setShowDots(true);
        }, 3000);
    };

    useEffect(() => {
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            if ('ondeviceorientationabsolute' in window) {
                window.removeEventListener('deviceorientationabsolute', handleOrientation);
            }
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, []);

    if (!permissionGranted) {
        return (
            <div className="flex flex-col items-center justify-center w-64 h-64 border border-[var(--color-light-green)] rounded-full bg-black/90 p-4 text-center shadow-[0_0_30px_rgba(0,255,0,0.1)] z-50">
                <p className="text-[var(--color-light-green)] text-[10px] mb-4 font-mono tracking-widest">
                    SYSTEM OFF
                </p>
                <button
                    onClick={requestAccess}
                    className="px-6 py-2 border border-[var(--color-light-green)] text-[var(--color-light-green)] font-mono text-xs hover:bg-[var(--color-light-green)] hover:text-black transition-all duration-300"
                >
                    INITIALISER
                </button>
            </div>
        );
    }

    if (isSearching) {
        return (
            <div className="relative w-64 h-64 rounded-full border border-[var(--color-light-green)] bg-black/90 flex items-center justify-center overflow-hidden z-20">
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,var(--color-light-green)_360deg)] opacity-30 animate-[spin_1.5s_linear_infinite]" />
                <div className="z-10 text-[var(--color-light-green)] font-mono text-xs animate-pulse text-center tracking-widest">
                    CALIBRATION...
                </div>
            </div>
        );
    }

    const counterRotateStyle = {
        transform: `rotate(${headingRender}deg)`
    };

    return (
        <div className="relative w-72 h-72 select-none z-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-white/10 shadow-2xl bg-black/80 backdrop-blur-sm"></div>

            <div className="absolute top-0 left-1/2 w-[1px] h-3 bg-[var(--color-light-green)] -translate-x-1/2"></div>
            <div className="absolute bottom-0 left-1/2 w-[1px] h-3 bg-[var(--color-light-green)] -translate-x-1/2"></div>
            <div className="absolute left-0 top-1/2 w-3 h-[1px] bg-[var(--color-light-green)] -translate-y-1/2"></div>
            <div className="absolute right-0 top-1/2 w-3 h-[1px] bg-[var(--color-light-green)] -translate-y-1/2"></div>

            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-40 drop-shadow-[0_0_8px_rgba(0,255,0,0.6)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 22H22L12 2Z" fill="var(--color-light-green)"/>
                    <path d="M12 6L6 20H18L12 6Z" fill="black"/>
                </svg>
            </div>

            <div
                className="absolute inset-2 rounded-full will-change-transform overflow-hidden"
                style={{
                    transform: `rotate(${-headingRender}deg)`,
                    background: "radial-gradient(circle, rgba(20, 40, 30, 0.4) 0%, rgba(0, 0, 0, 0) 70%)"
                }}
            >
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] border-r border-dashed border-[var(--color-light-green)] opacity-20 -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-0 right-0 h-[1px] border-b border-dashed border-[var(--color-light-green)] opacity-20 -translate-y-1/2"></div>

                <div className="absolute inset-[25%] rounded-full border border-[var(--color-light-green)] opacity-10"></div>
                <div className="absolute inset-[50%] rounded-full border border-[var(--color-light-green)] opacity-10"></div>

                {/* NORD */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="text-[var(--color-classic-red)] font-black text-sm tracking-wider drop-shadow-md" style={counterRotateStyle}>N</div>
                </div>

                {/* EST */}
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    <div className="text-[var(--color-light-green)] font-bold text-xs opacity-70" style={counterRotateStyle}>E</div>
                </div>

                {/* SUD */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                    <div className="text-[var(--color-light-green)] font-bold text-xs opacity-70" style={counterRotateStyle}>S</div>
                </div>

                {/* OUEST */}
                <div className="absolute left-5 top-1/2 -translate-y-1/2">
                    <div className="text-[var(--color-light-green)] font-bold text-xs opacity-70" style={counterRotateStyle}>O</div>
                </div>

                {showDots && targets.map((target) => {
                    const isFound = foundIds.includes(target.id);
                    const transformStyle = {
                        transform: `rotate(${target.angle - 90}deg) translateX(${target.distance}px) rotate(${-(target.angle - 90)}deg)`
                    };

                    return (
                        <div
                            key={target.id}
                            className="absolute top-1/2 left-1/2 w-0 h-0 flex items-center justify-center"
                            style={transformStyle}
                        >
                            <div style={counterRotateStyle} className="relative flex items-center justify-center">

                                {isFound ? (
                                    <div className="w-6 h-6 rounded-full bg-[var(--color-light-green)]/20 border border-[var(--color-light-green)] flex items-center justify-center shadow-[0_0_10px_var(--color-light-green)]">
                                        <PuzzleIcon className="w-3 h-3 text-[var(--color-light-green)]" />
                                        <div className="absolute -bottom-3 text-[8px] font-mono text-[var(--color-light-green)] font-bold">OK</div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-[var(--color-classic-red)] rounded-full animate-ping opacity-50"></div>

                                        <div className="w-6 h-6 rounded-full bg-red-900/80 border border-[var(--color-classic-red)] flex items-center justify-center shadow-[0_0_8px_rgba(255,0,0,0.6)]">
                                            <PuzzleIcon className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Infos Cap en bas */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <div className="h-[1px] w-8 bg-[var(--color-light-green)] opacity-30"></div>
                <div className="text-[var(--color-light-green)] font-mono text-xs font-bold tracking-[2px] opacity-80">
                    {Math.round(headingRender).toString().padStart(3, '0')}°
                </div>
                <div className="h-[1px] w-8 bg-[var(--color-light-green)] opacity-30"></div>
            </div>
        </div>
    );
}