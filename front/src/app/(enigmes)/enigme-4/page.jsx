"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TypewriterTerminal from "@/components/molecules/TypewriterTerminal/TypewriterTerminal";
import BaseModal from "@/components/molecules/Modals/BaseModal";
import RadarCompass from "@/components/atoms/RadarCompass/RadarCompass";
import PuzzleGrid from "@/components/molecules/PuzzleGrid/PuzzleGrid";
import QRScanner from "@/components/organisms/QRScanner/QRScanner";

// config des pièces avec les codes à écrire au dos
const PUZZLE_DATA = [
    { id: 1, angle: 0,   distance: 100, code: "882" }, // NORD
    { id: 2, angle: 45,  distance: 85,  code: "194" }, // NE
    { id: 3, angle: 100, distance: 110, code: "771" }, // EST
    { id: 4, angle: 150, distance: 90,  code: "336" }, // SE
    { id: 5, angle: 180, distance: 105, code: "529" }, // SUD
    { id: 6, angle: 260, distance: 100, code: "404" }, // OUEST
    { id: 7, angle: 320, distance: 95,  code: "117" }, // NO
];

export default function Enigme4Page() {
    const router = useRouter();

    const [foundIds, setFoundIds] = useState([]);
    const [step, setStep] = useState('SEARCH');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const terminalMsgSearch = [
        "> RADAR ACTIVÉ.",
        "> PLACEZ-VOUS SUR LA CROIX AU SOL.",
        "> 7 FRAGMENTS DÉTECTÉS.",
        "> TROUVEZ-LES ET ENTREZ LEURS CODES."
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
        <section className="min-h-screen flex flex-col items-center p-6" style={{
            backgroundImage: "url('/background-computer.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100vw", position: "relative", left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw",
            overflowX: "hidden"
        }}>
            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(10, 20, 21, 0.7)", zIndex: 0 }} />

            <div className="z-10 w-full max-w-[450px] mb-6">
                <TypewriterTerminal
                    textLines={step === 'SEARCH' ? terminalMsgSearch : terminalMsgScan}
                    speed={30}
                    key={step}
                />
            </div>

            <div className="z-10 flex-1 flex flex-col items-center justify-start gap-4 w-full">

                {step === 'SEARCH' && (
                    <div className="flex flex-col items-center animate-in fade-in duration-500 w-full">
                        <RadarCompass targets={PUZZLE_DATA} foundIds={foundIds} />

                        <div className="font-mono text-[var(--color-light-green)] text-xs tracking-widest mt-4 mb-2">
                            FRAGMENTS : {foundIds.length} / {PUZZLE_DATA.length}
                        </div>

                        <PuzzleGrid
                            pieces={PUZZLE_DATA}
                            foundIds={foundIds}
                            onValidatePiece={handleValidatePiece}
                        />

                        {/* Bouton de debug pour tout trouver d'un coup (à retirer en prod) */}
                        <button
                            onClick={() => setFoundIds(PUZZLE_DATA.map(p => p.id))}
                            className="mt-8 text-[8px] uppercase text-white/20 hover:text-white"
                        >
                            [ Debug: Tout trouver ]
                        </button>
                    </div>
                )}

                {step === 'SCAN' && (
                    <div className="flex flex-col items-center w-full animate-in slide-in-from-bottom duration-700">
                        <div className="w-full max-w-md">
                            <QRScanner
                                onScanSuccess={handleFinalScan}
                                label="SCANNEZ LE PUZZLE"
                            />
                        </div>

                        <p className="mt-6 text-center text-white/60 italic text-sm max-w-xs">
                            Assemblez les 7 pièces sur une table pour reformer le QR Code, puis scannez-le.
                        </p>

                        <button
                            onClick={() => handleFinalScan("SCAN_DEBUG")}
                            className="mt-8 text-[8px] uppercase text-white/20 hover:text-white"
                        >
                            [ Debug: Simuler Scan Puzzle ]
                        </button>
                    </div>
                )}
            </div>

            <BaseModal
                isOpen={isModalOpen}
                title="< DÉCRYPTAGE RÉUSSI >"
                message="Tiens, tiens... les enquêteurs savent donc faire un puzzle ? C'est mignon. Le scan a révélé le fichier 'tux_secret.txt'. Il est caché dans le dossier 'mission_finale'. Allez donc au terminal central dans la salle 132 qu'on vous humilie une dernière fois."
                onConfirm={() => router.push('/enigme-finale')}
            />
        </section>
    );
}