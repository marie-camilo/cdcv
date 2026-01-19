"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import QRScanner from "@/components/organisms/QRScanner/QRScanner";
import { apiFetch } from "@/hooks/API/fetchAPI";
import { getCodeInfo } from "@/lib/gameCodes"; // ✅ Import

export default function ScanPage() {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [scannedValue, setScannedValue] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        document.title = "Scan QR Code | La Click";
        return () => { document.title = "La Click"; };
    }, []);

    const handleScanSuccess = async (decodedText) => {
        if (isProcessing) return;

        const cleanCode = decodedText.trim().toUpperCase();
        setScannedValue(cleanCode);
        setIsProcessing(true);

        const codeInfo = getCodeInfo(cleanCode);

        if (!codeInfo) {
            setMessage("❌ CODE INVALIDE. ACCÈS REFUSÉ.");
            setTimeout(() => {
                setMessage("");
                setScannedValue("");
                setIsProcessing(false);
            }, 3000);
            return;
        }

        const { appId, fileName, videoId } = codeInfo;
        const gameCode = localStorage.getItem('currentGameCode');

        try {
            const response = await apiFetch(`/api/v1/game/${gameCode}/unlock-app`, {
                method: 'POST',
                body: JSON.stringify({
                    app_id: appId,
                    file_name: fileName,
                    entered_code: cleanCode
                })
            });

            if (response.status === 'error') {
                if (response.code_status === 'already_used') {
                    setMessage("⚠️ CE CODE A DÉJÀ ÉTÉ UTILISÉ !");
                } else {
                    setMessage("❌ ERREUR : " + response.message);
                }

                setTimeout(() => {
                    setMessage("");
                    setScannedValue("");
                    setIsProcessing(false);
                }, 3000);
                return;
            }

            // ✅ MISE À JOUR LOCALE (car Pusher exclut l'émetteur)
            const unlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');
            if (!unlocked.includes(appId)) {
                unlocked.push(appId);
                localStorage.setItem('unlockedApps', JSON.stringify(unlocked));
            }

            // ✅ Ajouter à game_codes localement aussi
            if (fileName) {
                const currentCodes = JSON.parse(localStorage.getItem('game_codes') || '[]');
                if (!currentCodes.find(c => c.value === fileName)) {
                    currentCodes.push({
                        label: `APP: ${appId.toUpperCase()}`,
                        value: fileName
                    });
                    localStorage.setItem('game_codes', JSON.stringify(currentCodes));
                }
            }

            // ✅ Émettre l'événement localement pour mettre à jour l'UI
            gameEvents.emit(GAME_EVENTS.APP_UNLOCKED, {
                appId: appId,
                fileName: fileName,
                unlockedApps: unlocked
            });

            // Déclencher la vidéo SI présente
            if (videoId) {
                await apiFetch(`/api/v1/game/${gameCode}/trigger-video`, {
                    method: 'POST',
                    body: JSON.stringify({ video_id: videoId })
                });

                // ✅ Émettre localement aussi
                gameEvents.emit(GAME_EVENTS.VIDEO_TRIGGERED, { videoId: videoId });
                console.log("🎬 Vidéo déclenchée:", videoId);
            }

            setMessage(`✅ APPLICATION "${appId.toUpperCase()}" DÉBLOQUÉE !`);

            if (window.navigator.vibrate) window.navigator.vibrate(200);

            setTimeout(() => router.push('/'), 2000);

        } catch (error) {
            console.error("Erreur lors du déblocage:", error);
            setMessage("❌ ERREUR DE CONNEXION AU SERVEUR");

            setTimeout(() => {
                setMessage("");
                setScannedValue("");
                setIsProcessing(false);
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

            <div className="relative w-full max-w-md">
                <QRScanner onScanSuccess={handleScanSuccess} />
            </div>

            {message && (
                <div className={`mt-6 p-6 border-2 rounded max-w-md w-full animate-in fade-in zoom-in duration-300 ${
                    message.startsWith('✅')
                        ? "bg-green-900/40 border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.4)]"
                        : "bg-red-900/40 border-red-500"
                }`}>
                    <p className={`font-mono font-bold text-center whitespace-pre-line ${
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