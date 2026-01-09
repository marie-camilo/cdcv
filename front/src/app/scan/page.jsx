"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import QRScanner from "@/components/organisms/QRScanner/QRScanner";

export default function ScanPage() {
    const router = useRouter();
    const [message, setMessage] = useState("");

    useEffect(() => {
        document.title = "Scan QR Code | La Click";
        return () => {
            document.title = "La Click";
        };
    }, []);

    // Codes pour débloquer chaque app
    const codes = {
        'FOYER': 'scan',
        'BETA5678': 'phone',
        'GAMMA9012': 'puzzle',
        'OMEGA7890': 'folder',
        'DELTA3456': 'chat',
    };

    const handleScanSuccess = (decodedText) => {
        console.log("Code détecté :", decodedText);

        const appId = codes[decodedText.toUpperCase()];

        if (appId) {
            const unlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');

            if (unlocked.includes(appId)) {
                setMessage("⚠️ Cette application est déjà débloquée !");
            } else {
                unlocked.push(appId);
                localStorage.setItem('unlockedApps', JSON.stringify(unlocked));
                setMessage(`✅ APPLICATION "${appId.toUpperCase()}" DÉBLOQUÉE !`);
                setTimeout(() => router.push('/'), 2000);
            }
        } else {
            setMessage("❌ CODE INVALIDE. Accès refusé.");
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md text-center mb-8">
                <div className="border-2 border-green-400 p-6 bg-black/80">
                    <p className="text-green-400 font-mono text-xs uppercase tracking-widest mb-3 animate-pulse">
                        [ SYSTÈME DE SCAN ACTIVÉ ]
                    </p>
                    <p className="text-green-300/70 font-mono text-sm leading-relaxed">
                        &gt; Positionnez le code QR devant la caméra
                        <br />
                        &gt; Analyse automatique en cours...
                    </p>
                </div>
            </div>

            <QRScanner onScanSuccess={handleScanSuccess} />

            {message && (
                <div className="mt-6 p-4 bg-black border-2 border-green-400 rounded max-w-md w-full">
                    <p className="text-green-400 font-mono text-sm text-center">{message}</p>
                </div>
            )}
        </main>
    );
}