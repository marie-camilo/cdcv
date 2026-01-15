"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TypewriterTerminal from "@/components/molecules/TypewriterTerminal/TypewriterTerminal";
import BaseModal from "@/components/molecules/Modals/BaseModal";
import RadarCompass from "@/components/atoms/RadarCompass/RadarCompass";
import PuzzleGrid from "@/components/molecules/PuzzleGrid/PuzzleGrid";
import QRScanner from "@/components/organisms/QRScanner/QRScanner";

const ALL_PIECES_IN_ROOM = [
    { id: 1, angle: 0,   distance: 120, code: "882", type: "normal" },
    { id: 2, angle: 45,  distance: 90,  code: "194", type: "normal" },
    { id: 3, angle: 100, distance: 130, code: "771", type: "normal" },
    { id: 4, angle: 150, distance: 100, code: "331", type: "normal" },
    { id: 5, angle: 180, distance: 120, code: "529", type: "normal" },
    { id: 6, angle: 260, distance: 110, code: "404", type: "normal" },
    { id: 7, angle: 320, distance: 100, code: "117", type: "normal" },
    { id: 7, angle: 320, distance: 100, code: "999", type: "normal" },
    { id: 101, angle: 25,  distance: 110, code: "124", type: "sabotaged" },
    { id: 102, angle: 130, distance: 80,  code: "937", type: "sabotaged" },
    { id: 103, angle: 210, distance: 135, code: "224", type: "sabotaged" },
    { id: 104, angle: 290, distance: 125, code: "638", type: "sabotaged" },
];

const GRID_SLOTS = [
    { id: 'slot1', label: "Fragment 1" }, { id: 'slot2', label: "Fragment 2" },
    { id: 'slot3', label: "Fragment 3" }, { id: 'slot4', label: "Fragment 4" },
    { id: 'slot5', label: "Fragment 5" }, { id: 'slot6', label: "Fragment 6" },
    { id: 'slot7', label: "Fragment 7" },
];

export default function Enigme4Page() {
    const router = useRouter();
    const [assignedPieces, setAssignedPieces] = useState({});
    const [step, setStep] = useState('SEARCH');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hackCharges, setHackCharges] = useState(3);
    const [isHackActive, setIsHackActive] = useState(false);
    const [finalStatus, setFinalStatus] = useState({ title: "", message: "", file: "" });

    const terminalMsgSearch = [
        "> RADAR INITIALISÉ. 11 SIGNAUX DÉTECTÉS.",
        "> REMPLISSEZ LES 7 SLOTS DE LA GRILLE.",
        "> [HACK] : UTILISATION LIMITÉE (3/3).",
        "> ATTENTION : LES PIÈCES SABOTÉES (LAVANDE) ALTÈRENT LE CODE FINAL."
    ];

    useEffect(() => {
        if (Object.keys(assignedPieces).length === 7 && step === 'SEARCH') {
            setTimeout(() => setStep('SCAN'), 1000);
        }
    }, [assignedPieces, step]);

    const handleHack = () => {
        if (hackCharges > 0 && !isHackActive) {
            setHackCharges(prev => prev - 1);
            setIsHackActive(true);
            setTimeout(() => setIsHackActive(false), 4000);
        }
    };

    const handleValidatePiece = (slotId, inputCode) => {
        const pieceFound = ALL_PIECES_IN_ROOM.find(p => p.code === inputCode);
        if (pieceFound) {
            if (Object.values(assignedPieces).includes(pieceFound.id)) {
                alert("ERREUR : CE FRAGMENT EST DÉJÀ ENREGISTRÉ.");
                return;
            }
            setAssignedPieces(prev => ({ ...prev, [slotId]: pieceFound.id }));
            if (navigator.vibrate) navigator.vibrate(200);
        } else {
            alert("CODE INCONNU. SIGNAL NON IDENTIFIÉ.");
        }
    };

    const handleFinalScan = (decodedText) => {
        if (decodedText.includes("MISSION_FINALE") || decodedText === "SCAN_DEBUG") {
            const pieceIdsInGrid = Object.values(assignedPieces);
            const sabotagedCount = ALL_PIECES_IN_ROOM.filter(p => pieceIdsInGrid.includes(p.id) && p.type === 'sabotaged').length;

            let result = sabotagedCount >= 4 ? {
                title: "< PROTOCOLE CORROMPU >",
                message: `Injection réussie (${sabotagedCount}/7 sabotés). Fichier généré : 'root_override.sh'.`,
                file: "root_override.sh"
            } : {
                title: "< INTÉGRITÉ VALIDÉE >",
                message: `Analyse saine (${7-sabotagedCount}/7 valides). Fichier généré : 'tux_secret.txt'.`,
                file: "tux_secret.txt"
            };

            setFinalStatus(result);
            const currentCodes = JSON.parse(localStorage.getItem('game_codes') || '[]');
            currentCodes.push({ label: "SORTIE ANALYSE", value: result.file });
            localStorage.setItem('game_codes', JSON.stringify(currentCodes));
            setIsModalOpen(true);
        }
    };

    return (
        <section className="min-h-screen flex flex-col items-center p-4 pb-20 relative bg-black">
            <div className="z-10 w-full max-w-[450px] mb-4 mt-2">
                <TypewriterTerminal textLines={step === 'SEARCH' ? terminalMsgSearch : ["Analyses terminées..."]} speed={30} key={step} />
            </div>

            <div className="z-10 flex-1 flex flex-col items-center w-full gap-6">
                {step === 'SEARCH' && (
                    <>
                        <div className="relative my-4">
                            <RadarCompass targets={ALL_PIECES_IN_ROOM} foundIds={Object.values(assignedPieces)} isPirateVision={isHackActive} />
                            <button onClick={handleHack} disabled={hackCharges === 0 || isHackActive} className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full border-2 border-[var(--color-lavender)] bg-black text-[var(--color-lavender)] z-50 flex flex-col items-center justify-center font-black active:scale-95 transition-transform disabled:opacity-20 shadow-[0_0_15px_rgba(143,147,255,0.4)]">
                                <span className="text-xs font-mono">{hackCharges}/3</span>
                            </button>
                        </div>
                        <PuzzleGrid pieces={GRID_SLOTS} foundIds={Object.keys(assignedPieces)} onValidatePiece={handleValidatePiece} />
                    </>
                )}
                {step === 'SCAN' && (
                    <div className="w-full max-w-md border-2 border-[var(--color-light-green)] rounded-lg overflow-hidden"><QRScanner onScanSuccess={handleFinalScan} label="SCAN FINAL" /></div>
                )}
            </div>
            <BaseModal isOpen={isModalOpen} title={finalStatus.title} message={finalStatus.message} onConfirm={() => router.push('/enigme-finale')} />
        </section>
    );
}