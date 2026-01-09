"use client";
import React, { useEffect } from 'react';
import { useRouter } from "next/navigation";
import QRScanner from "@/components/organisms/QRScanner/QRScanner";

export default function ScanPage() {
    const router = useRouter();

    useEffect(() => {
        document.title = "Scan QR Code | La Click";
        return () => {
            document.title = "La Click";
        };
    }, []);

    const handleScanSuccess = async (decodedText) => {
        console.log("Code détecté :", decodedText);

        // decodedText serait l'ID de l'équipe ou l'URL scannée
        // inscription du joueur
        await registerPlayerToTeam(decodedText);
    };

    const registerPlayerToTeam = async (teamId) => {
        const playerName = localStorage.getItem('currentPlayerName');

        try {
            // Simulation : Attribution d'un rôle
            const roles = ["Saboteur", "Civil"];
            const randomRole = roles[Math.floor(Math.random() * roles.length)];
            localStorage.setItem('playerRole', randomRole);

            console.log(`Joueur ${playerName} inscrit avec le code ${teamId}`);

            router.push("/role");
        } catch (error) {
            console.error("Erreur d'inscription", error);
        }
    };

    const handleFakeScan = () => {
        handleScanSuccess("DEBUG_CODE_123");
    };

    return (
        <main className="min-h-screen bg-[var(--color-dark)] flex flex-col items-center p-6">
            <div className="w-full max-w-md self-start">
                <h1 className="text-4xl font-bold leading-tight mt-6 text-left">
                    Identification <br /> requise !
                </h1>
            </div>
            <div className="mt-8 px-8 max-w-md text-center">
                <p className="text-[var(--color-classic-red)] font-bold text-xs uppercase tracking-widest mb-2 animate-pulse">
                    -- Signal Intercepté --
                </p>
                <p className="text-[var(--color-white)]/70 text-sm font-light italic leading-relaxed">
                    Alors, on joue aux enquêteurs ? Scannez ce code si vous tenez tant à voir le royaume de Jacquot s'effondrer. On vous a déjà assigné une équipe...
                </p>
            </div>
            <QRScanner
                onScanSuccess={handleScanSuccess}
            />

            {/* BOUTON DE TEST (À supprimer pour la prod) */}
            <button
                onClick={handleFakeScan}
                className="px-6 py-2 border border-dashed border-white/20 text-white/20 text-[10px] hover:text-white transition-colors tracking-widest uppercase font-mono"
            >
                [ Simulation Faux Scan ]
            </button>
        </main>
    );
}