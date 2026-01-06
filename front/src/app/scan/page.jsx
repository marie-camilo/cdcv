"use client";
import React, {useEffect, useState} from 'react';
import { useRouter } from "next/navigation";

export default function ScanPage() {
    const router = useRouter();
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        document.title = "Scan QR Code | La Click";
        return () => {
            document.title = "La Click";
        };
    }, []);

    // Fonction de simulation pour le test (Bouton de secours)
    const handleFakeScan = () => {
        // 1. On simule l'attribution d'un rôle (plus tard, ce sera ton Back qui donnera ça)
        const roles = ["Saboteur", "Civil"];
        const randomRole = roles[Math.floor(Math.random() * roles.length)];

        // 2. On stocke le rôle localement pour la page suivante
        localStorage.setItem('playerRole', randomRole);

        // 3. On navigue vers la page de rôle
        router.push('/role');
    };

    const registerPlayerToTeam = async (teamId) => {
        const playerName = localStorage.getItem('currentPlayerName');

        try {
            // appel API Backend
            /* const response = await fetch('http://ton-api.com/join-team', {
                method: 'POST',
                body: JSON.stringify({ playerName, teamId })
            });
            const data = await response.json();
            // data contient le rôle : { role: 'imposteur', team: 'Rouge' }
            */

            // Simulation de succès et redirection vers l'énigme
            console.log(`Joueur ${playerName} inscrit dans l'équipe ${teamId}`);
            router.push("/enigme-1");
        } catch (error) {
            console.error("Erreur d'inscription", error);
        }
    };

    return (
        <main className="min-h-screen bg-dark flex flex-col items-center justify-center p-8 text-white">
            <h1 className="text-2xl font-bold mb-8 text-lime">SCANNEZ LE QR CODE</h1>

            <div className="relative w-64 h-64 border-2 border-lime/50 rounded-3xl flex items-center justify-center overflow-hidden bg-black/40">
                <div id="reader" className="w-full h-full"></div>

                <div className="absolute inset-0 pointer-events-none border-[40px] border-dark/60"></div>
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-lime" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-lime" />
            </div>

            <p className="mt-8 text-mint/70 text-center text-sm">
                Scannez le code pour rejoindre votre équipe et recevoir votre rôle.
            </p>

            {/* BOUTON DE TEST (À supprimer plus tard) */}
            <button
                onClick={handleFakeScan}
                className="mt-12 px-6 py-2 border border-dashed border-white/20 text-white/40 text-xs hover:text-white transition-colors"
            >
                [ DEBUG : SIMULER SCAN QR ]
            </button>
        </main>
    );
}