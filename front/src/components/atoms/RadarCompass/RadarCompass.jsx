"use client";
import React, { useState, useEffect } from 'react';

export default function RadarCompass({ targets, foundIds }) {
    const [heading, setHeading] = useState(0);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [isSearching, setIsSearching] = useState(false); // État "Recherche en cours"
    const [showDots, setShowDots] = useState(false);       // Affichage des points

    const handleOrientation = (event) => {
        let compass = 0;
        if (event.webkitCompassHeading) {
            compass = event.webkitCompassHeading;
        }
        else if (event.alpha) {
            compass = Math.abs(event.alpha - 360);
        }
        setHeading(compass);
    };

    const requestAccess = async () => {
        setIsSearching(true); // Démarre l'animation de recherche

        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const response = await DeviceOrientationEvent.requestPermission();
                if (response === 'granted') {
                    setPermissionGranted(true);
                    window.addEventListener('deviceorientation', handleOrientation);
                    startSearchingSequence();
                } else {
                    alert("Permission refusée. Le radar ne peut pas fonctionner.");
                    setIsSearching(false);
                }
            } catch (error) {
                console.error(error);
                setIsSearching(false);
            }
        } else {
            setPermissionGranted(true);
            window.addEventListener('deviceorientation', handleOrientation);
            startSearchingSequence();
        }
    };

    const startSearchingSequence = () => {
        // Simulation de "Scan" pendant 3 secondes
        setTimeout(() => {
            setIsSearching(false);
            setShowDots(true);
        }, 3000);
    };

    useEffect(() => {
        const handleOrientation = (event) => {
            let compass = 0;
            if (event.webkitCompassHeading) {
                compass = event.webkitCompassHeading;
            }
            else if (event.absolute === true && event.alpha !== null) {
                compass = Math.abs(event.alpha - 360);
            }
            else if (event.alpha !== null) {
                compass = Math.abs(event.alpha - 360);
            }

            setHeading(compass);
        };

        if (permissionGranted) {
            // Pour iOS et Android standard
            window.addEventListener('deviceorientation', handleOrientation);
            if ('ondeviceorientationabsolute' in window) {
                window.addEventListener('deviceorientationabsolute', (e) => handleOrientation({...e, absolute: true}));
            }
        }

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            if ('ondeviceorientationabsolute' in window) {
                window.removeEventListener('deviceorientationabsolute', handleOrientation);
            }
        };
    }, [permissionGranted]);

    if (!permissionGranted) {
        return (
            <div className="flex flex-col items-center justify-center w-64 h-64 border-2 border-[var(--color-light-green)] rounded-full bg-black/80 backdrop-blur-sm p-4 text-center shadow-[0_0_15px_var(--color-light-green)]">
                <p className="text-[var(--color-light-green)] text-xs mb-4 font-mono">
                    CALIBRAGE REQUIS<br/>SUR MARQUAGE SOL
                </p>
                <button
                    onClick={requestAccess}
                    className="px-4 py-2 bg-[var(--color-light-green)] text-black font-bold text-sm rounded hover:bg-white transition-colors animate-pulse"
                >
                    INITIALISER RADAR
                </button>
            </div>
        );
    }

    // 2. Écran de recherche (Scan)
    if (isSearching) {
        return (
            <div className="relative w-64 h-64 rounded-full border-2 border-[var(--color-light-green)] bg-black/90 flex items-center justify-center overflow-hidden">
                {/* Effet de balayage radar */}
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,var(--color-light-green)_360deg)] opacity-20 animate-[spin_1s_linear_infinite]" />
                <div className="z-10 text-[var(--color-light-green)] font-mono text-sm animate-pulse text-center">
                    RECHERCHE<br/>SIGNAL...
                </div>
            </div>
        );
    }

    // 3. Le Vrai Radar Actif
    return (
        <div className="relative w-72 h-72 md:w-80 md:h-80 select-none">
            {/* Cercles concentriques décoratifs */}
            <div className="absolute inset-0 rounded-full border-2 border-[var(--color-light-green)] opacity-50 bg-black/60 shadow-[inset_0_0_20px_rgba(0,255,0,0.2)]"></div>
            <div className="absolute inset-[15%] rounded-full border border-[var(--color-light-green)] opacity-30"></div>
            <div className="absolute inset-[35%] rounded-full border border-[var(--color-light-green)] opacity-20"></div>
            <div className="absolute inset-[49%] top-0 bottom-0 w-[1px] bg-[var(--color-light-green)] opacity-30"></div>
            <div className="absolute inset-[49%] left-0 right-0 h-[1px] bg-[var(--color-light-green)] opacity-30"></div>

            {/* Indicateur de direction du téléphone (fixe vers le haut) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-[var(--color-light-green)]"></div>
            </div>

            {/* Conteneur rotatif (Tourne à l'opposé de la boussole pour stabiliser le Nord) */}
            <div
                className="absolute inset-0 w-full h-full transition-transform duration-200 ease-out"
                style={{ transform: `rotate(${-heading}deg)` }}
            >
                {/* Nord (Repère visuel) */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[var(--color-light-green)] font-bold text-xs">N</div>

                {/* Les Points (Cibles) */}
                {showDots && targets.map((target) => {
                    const isFound = foundIds.includes(target.id);
                    // On place le point : Rotation depuis le centre, puis translation vers l'extérieur
                    // Note: -90deg car le 0deg en CSS est à droite (Est), mais le 0deg boussole est en haut (Nord)
                    const transformStyle = {
                        transform: `rotate(${target.angle - 90}deg) translateX(${target.distance}px) rotate(${-(target.angle - 90)}deg)`
                    };
                    // Le second rotate annule la rotation du texte/point pour qu'il reste droit (optionnel)

                    return (
                        <div
                            key={target.id}
                            className="absolute top-1/2 left-1/2 w-0 h-0 flex items-center justify-center"
                            style={transformStyle}
                        >
                            <div className={`
                                w-4 h-4 rounded-full shadow-[0_0_10px_currentColor] transition-all duration-500
                                ${isFound ? 'bg-green-500 text-green-500' : 'bg-red-500 text-red-500 animate-pulse'}
                            `}>
                                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold opacity-80 whitespace-nowrap">
                                    {isFound ? `OK` : `?`}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Infos Cap */}
            <div className="absolute bottom-2 right-2 text-[var(--color-light-green)] font-mono text-[10px]">
                CAP: {Math.round(heading)}°
            </div>
        </div>
    );
}