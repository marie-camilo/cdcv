"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import QRScanner from "@/components/organisms/QRScanner/QRScanner";

export default function ScanPage() {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [scannedValue, setScannedValue] = useState(""); // Pour voir le code brut sur mobile

    useEffect(() => {
        document.title = "Scan QR Code | La Click";
        return () => { document.title = "La Click"; };
    }, []);

    const codes = {
        'FOYER': 'scan',
        'BETA5678': 'phone',
        'GAMMA9012': 'puzzle',
        'OMEGA7890': 'folder',
        'DELTA3456': 'chat',
    };

    const handleScanSuccess = (decodedText) => {
        // Nettoyage du texte (enlève les espaces et force majuscules)
        const cleanCode = decodedText.trim().toUpperCase();
        setScannedValue(cleanCode); // Affiche la valeur brute sur l'écran

        const appId = codes[cleanCode];

        if (appId) {
            const unlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');

            if (unlocked.includes(appId)) {
                setMessage("⚠️ CETTE APPLICATION EST DÉJÀ DÉBLOQUÉE !");
            } else {
                unlocked.push(appId);
                localStorage.setItem('unlockedApps', JSON.stringify(unlocked));
                setMessage(`✅ APPLICATION "${appId.toUpperCase()}" DÉBLOQUÉE !`);

                // Petit feedback haptique si le téléphone le supporte
                if (window.navigator.vibrate) window.navigator.vibrate(200);

                setTimeout(() => router.push('/'), 2000);
            }
        } else {
            setMessage("❌ CODE INVALIDE. ACCÈS REFUSÉ.");
            // On reset le message après 3 secondes pour permettre de scanner à nouveau
            setTimeout(() => {
                setMessage("");
                setScannedValue("");
            }, 3000);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
            <div className="w-full max-w-md text-center mb-6">
                <div className="border-2 border-green-400 p-6 bg-black/80 shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                    <p className="text-green-400 font-mono text-xs uppercase tracking-widest mb-3 animate-pulse">
                        [ SYSTÈME DE SCAN ACTIVÉ ]
                    </p>

                    {/* Zone de feedback en temps réel */}
                    {scannedValue && !message.startsWith('✅') && (
                        <p className="text-yellow-400 font-mono text-xs mb-2">
                            DERNIER CODE DÉTECTÉ : "{scannedValue}"
                        </p>
                    )}

                    <p className="text-green-300/70 font-mono text-sm leading-relaxed">
                        &gt; Positionnez le code QR devant la caméra
                        <br />
                        &gt; Analyse automatique en cours...
                    </p>
                </div>
            </div>

            {/* Le scanner (on garde ton composant actuel) */}
            <div className="relative w-full max-w-md">
                <QRScanner onScanSuccess={handleScanSuccess} />
            </div>

            {/* Message de succès ou d'erreur très marqué */}
            {message && (
                <div className={`mt-6 p-6 border-2 rounded max-w-md w-full animate-in fade-in zoom-in duration-300 ${
                    message.startsWith('✅')
                        ? "bg-green-900/40 border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.4)]"
                        : "bg-red-900/40 border-red-500"
                }`}>
                    <p className={`font-mono font-bold text-center ${
                        message.startsWith('✅') ? "text-green-400 text-lg" : "text-red-400"
                    }`}>
                        {message}
                    </p>
                    {message.startsWith('✅') && (
                        <p className="text-green-200 text-xs text-center mt-2 animate-bounce">
                            RETOUR AU MENU DANS 2 SECONDES...
                        </p>
                    )}
                </div>
            )}

            <button
                onClick={() => router.push('/')}
                className="mt-8 text-gray-500 hover:text-green-400 font-mono text-xs tracking-tighter transition-colors"
            >
                [ ANNULER LA SÉQUENCE ]
            </button>
        </main>
    );
}