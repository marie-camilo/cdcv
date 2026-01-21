"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TypewriterTerminal from "@/components/molecules/TypewriterTerminal/TypewriterTerminal";
import BaseModal from "@/components/molecules/Modals/BaseModal";
import RadarCompass from "@/components/atoms/RadarCompass/RadarCompass";
import PuzzleGrid from "@/components/molecules/PuzzleGrid/PuzzleGrid";
import QRScanner from "@/components/organisms/QRScanner/QRScanner";
import { IoCheckmarkCircle } from "react-icons/io5";

const ALL_PIECES_IN_ROOM = [
    // --- SLOT 1 : Fragment Haut-Gauche (Nord-Ouest) ---
    { id: 1,   slotTarget: 'slot1', slotNumber: "N-O", code: "882", type: "normal",    angle: 0,   distance: 120 },

    // --- SLOT 2 : Fragment Haut-Droite (Nord-Est) ---
    { id: 2,   slotTarget: 'slot2', slotNumber: "N-E", code: "194", type: "normal",    angle: 45,  distance: 90 },
    { id: 102, slotTarget: 'slot2', slotNumber: "N-E", code: "937", type: "sabotaged", angle: 300, distance: 100 },

    // --- SLOT 3 : Fragment Bas-Gauche (Sud-Ouest) ---
    { id: 3,   slotTarget: 'slot3', slotNumber: "S-O", code: "771", type: "normal",    angle: 115, distance: 100 },
    { id: 101, slotTarget: 'slot3', slotNumber: "N-O", code: "124", type: "sabotaged", angle: 220, distance: 110 },

    // --- SLOT 4 : Fragment Bas-Droite (Sud-Est) ---
    { id: 4,   slotTarget: 'slot4', slotNumber: "S-E", code: "331", type: "normal",    angle: 150, distance: 100 },
];

const GRID_SLOTS = [
    { id: 'slot1', label: "Slot 1" },
    { id: 'slot2', label: "Slot 2" },
    { id: 'slot3', label: "Slot 3" },
    { id: 'slot4', label: "Slot 4" },
];

export default function Enigme4Page() {
    const router = useRouter();

    // Pré-remplissage du Slot 1 avec la pièce des casiers
    const [assignedPieces, setAssignedPieces] = useState({
        'slot1': ALL_PIECES_IN_ROOM.find(p => p.id === 1)
    });

    const [step, setStep] = useState('SEARCH');

    // Modales
    const [isEndModalOpen, setIsEndModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // Modale Slot 1

    // Mécanique Hack
    const [hackCharges, setHackCharges] = useState(3);
    const [isHackActive, setIsHackActive] = useState(false);

    const [finalStatus, setFinalStatus] = useState({ title: "", message: "", file: "" });

    const terminalMsgSearch = [
        "> CANAL AUDIO : ACTIF.",
        "> M. JACQUOT : Bon, on se réveille ! J'ai pas toute la journée.",
        "> Première chose : calez-vous sur la CROIX au sol et visez le repère NOIR pour caler le Nord.",
        "> Le fragment n°1 déjà rentré ? Touchez pas à ça. C'est celui que vous avez sorti des casiers, il est déjà déverrouillé.",
        "> Trouvez les 3 autres fragments indiqués sur le radar. Assemblez le tout, scannez le QR, et sortez-moi de là.",
        "> Ah... et si vous voyez des signaux bizarres... méfiez-vous. C'est sûrement un piratage des Chemises Rouges."
    ];

    useEffect(() => {
        if (Object.keys(assignedPieces).length === 4 && step === 'SEARCH') {
            setTimeout(() => setStep('SCAN'), 1500);
        }
    }, [assignedPieces, step]);

    const handleHack = () => {
        if (hackCharges > 0 && !isHackActive) {
            setHackCharges(prev => prev - 1);
            setIsHackActive(true);
            setTimeout(() => setIsHackActive(false), 4000);
        }
    };

    const handleSlotClick = (slotId) => {
        if (slotId === 'slot1') {
            setIsInfoModalOpen(true);
        }
    };

    const handleValidatePiece = (targetSlotId, inputCode) => {
        const pieceFound = ALL_PIECES_IN_ROOM.find(p => p.code === inputCode);

        if (!pieceFound) {
            alert("SIGNAL INCONNU. Ce code ne correspond à rien.");
            return;
        }

        if (pieceFound.slotTarget !== targetSlotId) {
            alert(`ERREUR : Mauvaise zone ! Ce fragment appartient à la ${pieceFound.slotTarget.replace('slot', 'Zone ')}.`);
            return;
        }

        setAssignedPieces(prev => ({
            ...prev,
            [targetSlotId]: pieceFound
        }));
        if (navigator.vibrate) navigator.vibrate(200);
    };

    const handleFinalScan = (decodedText) => {
        if (decodedText.includes("MISSION_FINALE") || decodedText === "SCAN_DEBUG") {
            const sabotagedCount = Object.values(assignedPieces).filter(p => p.type === 'sabotaged').length;
            const isSabotageSuccess = sabotagedCount >= 2;

            let result = isSabotageSuccess ? {
                title: "< PROTOCOLE CORROMPU >",
                message: "Alerte critique : Le QR Code reconstitué contient des segments viraux. Redirection du flux vers le serveur 'Chemises Rouges'.",
                file: "chemises-mardi"
            } : {
                title: "< INTÉGRITÉ VALIDÉE >",
                message: "Analyse terminée. QR Code authentifié. Déverrouillage des archives centrales autorisé.",
                file: "chemises-vendredi"
            };

            setFinalStatus(result);
            const currentCodes = JSON.parse(localStorage.getItem('game_codes') || '[]');
            currentCodes.push({ label: "RÉSULTAT ANALYSE", value: result.file });
            localStorage.setItem('game_codes', JSON.stringify(currentCodes));
            setIsEndModalOpen(true);
        }
    };

    return (
        <section className="min-h-screen flex flex-col items-center p-4 pb-20 relative bg-[#2A0C0C] text-white font-mono">

            {step === 'SEARCH' && (
                <div className="z-20 w-full max-w-[450px] mb-4 p-3 rounded bg-[var(--color-mat-blue)]/10 border border-[var(--color-mat-blue)] text-[var(--color-mat-blue)] text-xs font-mono relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] animate-in slide-in-from-top duration-700">
                    <div className="flex items-center gap-2 font-bold border-b border-[var(--color-mat-blue)]/30 pb-2 mb-2">
                        <span className="tracking-widest">INIDICATIONS SABOTEURS</span>
                    </div>
                    <p className="opacity-90 leading-relaxed">
                        OBJECTIF : Injectez au moins <span className="font-bold text-white bg-[var(--color-mat-blue)]/50 px-1 rounded">2 fragments sabotés</span> (Signaux Bleus) dans la grille pour détourner l'archive finale.
                    </p>
                </div>
            )}

            <div className="z-10 w-full max-w-[450px] mb-6 shrink-0">
                <TypewriterTerminal
                    textLines={step === 'SEARCH' ? terminalMsgSearch : ["> QR CODE RECONSTITUÉ.", "> PRÊT POUR SCAN FINAL."]}
                    speed={25}
                    key={step}
                />
            </div>

            <div className="z-10 flex-1 flex flex-col items-center w-full gap-8 max-w-[450px]">
                {step === 'SEARCH' && (
                    <>
                        <div className="relative w-full flex justify-center py-4">
                            <RadarCompass
                                targets={ALL_PIECES_IN_ROOM}
                                foundIds={Object.values(assignedPieces).map(p => p.id)}
                                isPirateVision={isHackActive}
                            />
                            <div className="absolute bottom-0 right-4 flex flex-col items-end">
                                <button
                                    onClick={handleHack}
                                    disabled={hackCharges === 0 || isHackActive}
                                    className={`
                                        w-16 h-16 rounded-full border-2 
                                        flex flex-col items-center justify-center z-50 transition-all active:scale-95
                                        ${isHackActive
                                        ? 'bg-[var(--color-mat-blue)] border-white text-white shadow-[0_0_20px_var(--color-mat-blue)]'
                                        : 'bg-black border-[var(--color-mat-blue)] text-[var(--color-mat-blue)]'
                                    }
                                        ${hackCharges === 0 ? 'opacity-30 grayscale cursor-not-allowed' : ''}
                                    `}
                                >
                                    <span className="text-[10px] font-bold">HACK</span>
                                    <span className="text-sm font-black">{hackCharges}/3</span>
                                </button>
                            </div>
                        </div>

                        <div className="w-full">
                            <PuzzleGrid
                                pieces={GRID_SLOTS}
                                foundIds={Object.keys(assignedPieces)}
                                onValidatePiece={handleValidatePiece}
                                onSlotClick={handleSlotClick}
                            />
                        </div>
                    </>
                )}

                {step === 'SCAN' && (
                    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
                        <div className="w-full aspect-square border-2 border-[var(--color-light-green)] rounded-xl overflow-hidden bg-black relative shadow-[0_0_30px_rgba(0,255,0,0.2)]">
                            <QRScanner onScanSuccess={handleFinalScan} label="SCAN DU QR CODE PHYSIQUE" />
                            <div className="absolute inset-0 pointer-events-none border-[20px] border-black/30">
                                <div className="w-full h-1 bg-[var(--color-light-green)] opacity-50 absolute top-1/2 animate-pulse shadow-[0_0_10px_#0f0]" />
                            </div>
                        </div>
                        <p className="mt-6 text-sm text-[var(--color-light-green)] animate-pulse text-center px-4">
                            Veuillez scanner le QR Code complet une fois les 4 fragments assemblés physiquement.
                        </p>
                    </div>
                )}
            </div>

            {isInfoModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-black border-2 border-[var(--color-light-green)] rounded-xl p-6 shadow-[0_0_50px_rgba(0,255,0,0.2)] relative">
                        <div className="flex flex-col items-center text-center">
                            <IoCheckmarkCircle className="text-[var(--color-light-green)] text-6xl mb-4 drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]" />
                            <h2 className="text-[var(--color-light-green)] font-black text-xl mb-2 tracking-wider">FRAGMENT SÉCURISÉ</h2>
                            <p className="text-white/80 font-mono text-sm leading-relaxed mb-6">
                                <span className="text-[var(--color-light-green)] font-bold">M. JACQUOT :</span> Eh ! Pas touche. Ce fragment-là c'est celui que vous avez sorti des casiers du foyer tout à l'heure. Il est déjà rentré et sécurisé.
                            </p>
                            <button
                                onClick={() => setIsInfoModalOpen(false)}
                                className="w-full py-3 bg-[var(--color-light-green)] text-black font-bold font-mono rounded hover:brightness-110 transition-all"
                            >
                                COMPRIS
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODALE DE FIN */}
            <BaseModal
                isOpen={isEndModalOpen}
                title={finalStatus.title}
                message={finalStatus.message}
                onConfirm={() => router.push('/enigme-finale')}
            />
        </section>
    );
}