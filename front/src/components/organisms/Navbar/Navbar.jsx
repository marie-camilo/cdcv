"use client";

import React, { useState, useEffect } from 'react';
import styles from "./Navbar.module.css";
import PixelBorder from "@/components/atoms/PixelBorder";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoInformationCircle, IoClose, IoHardwareChip, IoMap, IoScan, IoRadio } from "react-icons/io5"; // Icônes pour le modal
import { useTimer } from "@/app/context/TimerContext";
import TimerDisplay from "@/components/atoms/TimerDisplay/TimerDisplay";
import SidePanel from "@/components/molecules/SidePanel/SidePanel";
import { checkPlayerCookie } from "@/hooks/API/rules";
import { getPlayerRole } from "@/hooks/API/gameRequests";

// --- CONSTANTES DES RÔLES ---
const ROLE_DESCRIPTIONS = {
    cadreur: {
        icon: <IoScan size={40} />,
        mission: "Vous êtes les yeux de l'équipe. Votre rôle est de numériser les différents QR Codes pour les déchiffrer et mener à bien votre mission.",
        equipement: "La caméra (scanner QR)",
        info: "Dès qu'un QR Code est trouvé, c'est à vous d'agir. Stabilisez l'image. Un scan flou est un scan inutile.",
    },
    communicant: {
        icon: <IoRadio size={40} />,
        mission: "Vous êtes le lien vital de l'équipe. L'information est votre arme principale. Vous assurez la coordination et la transmission.",
        equipement: "Le talkie-walkie",
        info: "Parlez clairement, sans saturer le canal. Une information mal transmise est une information perdue.",
    },
    navigateur: {
        icon: <IoMap size={40} />,
        mission: "Vous êtes le sens de l'orientation du groupe. Vous guidez l'équipe vers les objectifs physiques.",
        equipement: "La boussole et le radar",
        info: "Maîtrisez l'interface radar et guidez précisément l'équipe vers les coordonnées.",
    },
    developpeur: {
        icon: <IoHardwareChip size={40} />,
        mission: "Vous êtes le cerveau logique. Vous interagissez avec les systèmes pour décrypter et contourner les sécurités.",
        equipement: "Les terminaux et claviers",
        info: "Analysez les énigmes et les lignes de code. Chaque détail compte.",
    },
};

function RoleModal({ isOpen, onClose, roleName }) {
    if (!isOpen) return null;

    const roleKey = roleName?.toLowerCase();
    const roleData = ROLE_DESCRIPTIONS[roleKey] || {
        mission: "Rôle non identifié dans la base de données.",
        equipement: "Inconnu",
        info: "Aucune donnée disponible.",
        icon: <IoHardwareChip size={40} />
    };

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center px-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Content */}
            <div className="relative bg-[var(--color-dark)] border border-[var(--color-light-green)] w-full max-w-md p-6 shadow-[0_0_20px_rgba(0,255,0,0.1)]">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-[var(--color-light-green)] transition-colors"
                >
                    <IoClose size={24} />
                </button>

                {/* Header */}
                <div className="flex flex-col items-center text-center mb-6 border-b border-white/10 pb-6">
                    <div className="text-[var(--color-light-green)] mb-3 p-3 bg-[var(--color-light-green)]/10 rounded-full border border-[var(--color-light-green)]">
                        {roleData.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-widest font-mono">
                        {roleName || "AGENT"}
                    </h2>
                    <span className="text-[10px] text-[var(--color-light-green)] bg-[var(--color-light-green)]/10 px-2 py-1 mt-2 rounded uppercase tracking-widest">
                        Accréditation confirmée
                    </span>
                </div>

                {/* Details */}
                <div className="space-y-4 font-mono text-sm">
                    <div>
                        <h3 className="text-[var(--color-light-green)] text-xs uppercase tracking-wider mb-1">Mission Prioritaire</h3>
                        <p className="text-white/80 leading-relaxed">{roleData.mission}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 pt-2">
                        <div className="bg-white/5 p-3 border-l-2 border-[var(--color-light-green)]">
                            <h3 className="text-[var(--color-light-green)] text-xs uppercase tracking-wider mb-1">Équipement</h3>
                            <p className="text-white font-bold">{roleData.equipement}</p>
                        </div>
                    </div>

                    <div className="pt-2">
                        <h3 className="text-[var(--color-light-green)] text-xs uppercase tracking-wider mb-1">Instruction Tactique</h3>
                        <p className="text-white/60 italic text-xs border-t border-white/10 pt-2">
                            "{roleData.info}"
                        </p>
                    </div>
                </div>

                {/* Footer Action */}
                <button
                    onClick={onClose}
                    className="w-full mt-6 py-3 bg-[var(--color-light-green)] text-black font-bold uppercase tracking-widest hover:bg-white transition-colors"
                >
                    Compris
                </button>
            </div>
        </div>
    );
}

export default function Navbar() {
    const { simulateEnd } = useTimer();
    const [playerName, setPlayerName] = useState("Agent");
    const [playerRole, setPlayerRole] = useState(null);

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

    useEffect(() => {
        const initData = async () => {
            try {
                const data = await checkPlayerCookie();
                if (data?.player?.name) {
                    setPlayerName(data.player.name);
                }

                const roleData = await getPlayerRole();
                if (roleData?.role) {
                    setPlayerRole(roleData.role);
                }
            } catch (err) {
                console.error("Erreur chargement navbar:", err);
                setPlayerName("Agent");
            }
        }
        initData();
    }, []);

    return (
        <>
            <nav className={styles.root}>
                <PixelBorder>
                    <div className={styles.container}>
                        <div className={styles.left}>
                            <TimerDisplay className={styles.time} />

                            {/* Bloc Nom + Rôle */}
                            <div className="flex flex-col justify-center h-full ml-4 leading-tight">
                                <span className={`${styles.name} block`}>
                                    {playerName}
                                </span>

                                {/* Bouton Rôle Clickable */}
                                {playerRole ? (
                                    <button
                                        onClick={() => setIsRoleModalOpen(true)}
                                        className="text-left flex items-center gap-1 group"
                                    >
                                        <span className="text-[10px] md:text-xs font-mono font-bold text-[var(--color-light-green)] tracking-wider uppercase group-hover:underline decoration-[var(--color-light-green)] underline-offset-2">
                                            {playerRole}
                                        </span>
                                        <IoInformationCircle
                                            size={12}
                                            className="text-[var(--color-light-green)] opacity-50 group-hover:opacity-100 transition-opacity"
                                        />
                                    </button>
                                ) : (
                                    <span className="text-[10px] text-white/40 font-mono tracking-wider uppercase animate-pulse">
                                        User
                                    </span>
                                )}
                            </div>
                        </div>

                        <button
                            className={styles.menuButton}
                            onClick={() => setIsPanelOpen(true)}
                        >
                            <HiOutlineMenuAlt3 size={32} color="var(--color-white)" />
                        </button>
                    </div>
                </PixelBorder>
            </nav>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
            />

            <RoleModal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                roleName={playerRole}
            />
        </>
    );
}