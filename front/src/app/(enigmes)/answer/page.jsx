// app/answer/page.jsx
"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export default function AnswerPage() {
    const router = useRouter();
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");

    // Codes pour débloquer chaque app
    const codes = {
        'FOYER': 'scan',
        'BETA5678': 'phone',
        'GAMMA9012': 'puzzle',
        'OMEGA7890': 'folder',
        'DELTA3456': 'chat',
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const appId = codes[code.toUpperCase()];

        if (appId) {
            const unlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');

            if (unlocked.includes(appId)) {
                setMessage("⚠️ Cette application est déjà débloquée !");
            } else {
                unlocked.push(appId);
                localStorage.setItem('unlockedApps', JSON.stringify(unlocked));
                setMessage(`✅ APPLICATION DÉBLOQUÉE ! Retournez au menu principal.`);
                setTimeout(() => router.push('/'), 2000);
            }
        } else {
            setMessage("❌ CODE INVALIDE. Accès refusé.");
        }

        setCode("");
    };

    return (
        <main className="h-full text-green-400 font-mono flex items-center justify-center ">
            <div className="max-w-md w-full border-2 border-green-400 p-8 rounded-lg bg-black">
                <h1 className="text-2xl mb-6 text-center">🔓 CONSOLE DE DÉBLOCAGE</h1>
                <p className="text-sm text-gray-400 mb-6">Entrez le code pour déverrouiller une application</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="ENTREZ LE CODE..."
                        className="w-full bg-black border-2 border-green-400 p-3 text-green-400 text-center uppercase tracking-widest focus:outline-none focus:border-green-300"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-black font-bold py-3 rounded transition-colors"
                    >
                        VALIDER
                    </button>
                </form>

                {message && (
                    <div className="mt-4 p-3 bg-gray-900 border border-green-400 rounded text-center text-sm">
                        {message}
                    </div>
                )}

                <button
                    onClick={() => router.push('/')}
                    className="w-full mt-6 text-gray-500 hover:text-green-400 transition-colors text-sm"
                >
                    ← Retour au menu
                </button>
            </div>
        </main>
    );
}