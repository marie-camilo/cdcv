"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TypewriterTerminal from "@/components/molecules/TypewriterTerminal/TypewriterTerminal";
import BaseModal from "@/components/molecules/Modals/BaseModal";
import RadarCompass from "@/components/atoms/RadarCompass/RadarCompass"; // Assurez-vous du chemin
import PuzzleGrid from "@/components/molecules/PuzzleGrid/PuzzleGrid";
import QRScanner from "@/components/organisms/QRScanner/QRScanner";

const PUZZLE_DATA = [
    { id: 1, angle: 0,   distance: 120, code: "882" }, // NORD
    { id: 2, angle: 45,  distance: 90,  code: "194" }, // NE
    { id: 3, angle: 100, distance: 130, code: "771" }, // EST
    { id: 4, angle: 150, distance: 100, code: "336" }, // SE
    { id: 5, angle: 180, distance: 120, code: "529" }, // SUD
    { id: 6, angle: 260, distance: 110, code: "404" }, // OUEST
    { id: 7, angle: 320, distance: 100, code: "117" }, // NO
];

export default function Enigme4Page() {
    const router = useRouter();

    const [foundIds, setFoundIds] = useState([]);
    const [step, setStep] = useState('SEARCH');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const terminalMsgSearch = [
        "> INITIALISATION REQUISE...",
        "> 1. PLACEZ-VOUS SUR LE MARQUAGE.",
        "> 2. ACTIVEZ LE RADAR.",
        "> 3. SUIVEZ LES SIGNAUX ROUGES."
    ];

    const terminalMsgScan = [
        "> TOUS LES FRAGMENTS RÉCUPÉRÉS.",
        "> ASSEMBLAGE DU PUZZLE REQUIS.",
        "> SCANNEZ LE QR CODE RÉSULTANT."
    ];

    useEffect(() => {
        document.title = "Énigme 4 | Radar & Puzzle";
        if (foundIds.length === PUZZLE_DATA.length && step === 'SEARCH') {
            setTimeout(() => {
                setStep('SCAN');
            }, 1500);
        }
    }, [foundIds, step]);

    const handleValidatePiece = (id, code) => {
        const piece = PUZZLE_DATA.find(p => p.id === id);
        if (piece && piece.code === code) {
            setFoundIds(prev => [...prev, id]);
            if (navigator.vibrate) navigator.vibrate(200);
        } else {
            alert("CODE INCORRECT. Vérifiez le dos de la pièce.");
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        }
    };

    const handleFinalScan = (decodedText) => {
        if (decodedText.includes("MISSION_FINALE") || decodedText === "SCAN_DEBUG") {
            const currentCodes = JSON.parse(localStorage.getItem('game_codes') || '[]');
            const secretFile = "tux_secret.txt";

            if (!currentCodes.find(c => c.value === secretFile)) {
                currentCodes.push({
                    label: "FICHIER SECRET",
                    value: secretFile
                });
                localStorage.setItem('game_codes', JSON.stringify(currentCodes));
            }
            setIsModalOpen(true);
        }
    };

    return (
        <section className="min-h-screen flex flex-col items-center p-4 pb-20" style={{
            backgroundImage: "url('/background-computer.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100vw", position: "relative", left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw",
            overflowX: "hidden"
        }}>
            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(10, 20, 21, 0.85)", zIndex: 0 }} />

            <div className="z-10 w-full max-w-[450px] mb-4 mt-2">
                <TypewriterTerminal
                    textLines={step === 'SEARCH' ? terminalMsgSearch : terminalMsgScan}
                    speed={30}
                    key={step}
                />
            </div>

            <div className="z-10 flex-1 flex flex-col items-center w-full gap-6">

                {step === 'SEARCH' && (
                    <>
                        <div className="my-4">
                            <RadarCompass targets={PUZZLE_DATA} foundIds={foundIds} />
                        </div>

                        <div className="font-mono text-[var(--color-light-green)] text-xs tracking-widest bg-black/50 px-3 py-1 rounded border border-[var(--color-light-green)]/30">
                            FRAGMENTS : {foundIds.length} / {PUZZLE_DATA.length}
                        </div>

                        <PuzzleGrid
                            pieces={PUZZLE_DATA}
                            foundIds={foundIds}
                            onValidatePiece={handleValidatePiece}
                        />
                    </>
                )}

                {step === 'SCAN' && (
                    <div className="flex flex-col items-center w-full animate-in slide-in-from-bottom duration-700">
                        <div className="w-full max-w-md border-2 border-[var(--color-light-green)] rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,255,0,0.2)]">
                            <QRScanner
                                onScanSuccess={handleFinalScan}
                                label="SCANNEZ LE PUZZLE"
                            />
                        </div>

                        <p className="mt-6 text-center text-white/80 font-mono text-sm max-w-xs border-l-2 border-[var(--color-light-green)] pl-4">
                            Assemblez les pièces physiques.<br/>
                            Scannez le QR Code formé.
                        </p>

                        <button
                            onClick={() => handleFinalScan("SCAN_DEBUG")}
                            className="mt-12 text-[9px] uppercase text-white/10 hover:text-white"
                        >
                            [ Debug: Bypass Scan ]
                        </button>
                    </div>
                )}
            </div>

            <BaseModal
                isOpen={isModalOpen}
                title="< DÉCRYPTAGE RÉUSSI >"
                message="Le scan a révélé le fichier 'tux_secret.txt'. Il est caché dans le dossier 'mission_finale'. Allez au terminal central."
                onConfirm={() => router.push('/enigme-finale')}
            />
        </section>
    );
}