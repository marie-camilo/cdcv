"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Pusher from "pusher-js";
import TypewriterTerminal from "@/components/molecules/TypewriterTerminal/TypewriterTerminal";
import AnswerTerminal from "@/components/organisms/AnswerTerminal/AnswerTerminal";
import BaseModal from "@/components/molecules/Modals/BaseModal";
import { validateGameStep } from "@/hooks/API/gameRequests";
import { apiFetch } from "@/hooks/API/fetchAPI";

export default function Enigme1Page() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [gameCode, setGameCode] = useState(null);
    const pusherRef = useRef(null);

    // 1) Récupération du code de partie
    useEffect(() => {
        document.title = "Énigme 1 | Infiltration";

        const fetchSession = async () => {
            try {
                let code = localStorage.getItem('currentGameCode');
                if (!code) {
                    const data = await apiFetch('/api/v1/games/log/session');
                    if (data?.game?.code) {
                        code = data.game.code;
                        localStorage.setItem('currentGameCode', code);
                    }
                }
                setGameCode(code);
            } catch (error) {
                console.error("Erreur récupération session:", error);
            }
        };

        fetchSession();
    }, []);

    // 2) ÉCOUTE PUSHER
    useEffect(() => {
        if (!gameCode || pusherRef.current) return;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
            cluster: "eu",
            forceTLS: true,
        });

        pusherRef.current = pusher;
        const channel = pusher.subscribe(`game.${gameCode}`);

        channel.bind('AppUnlocked', (data) => {
            const unlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');
            if (!unlocked.includes(data.appId)) {
                unlocked.push(data.appId);
                localStorage.setItem('unlockedApps', JSON.stringify(unlocked));
            }

            if (data.appId === 'scan') {
                setIsModalOpen(true);
            }
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe(`game.${gameCode}`);
            pusher.disconnect();
            pusherRef.current = null;
        };
    }, [gameCode]);

    const handleSuccess = async () => {
        try {
            const codeToUse = gameCode || localStorage.getItem('currentGameCode');
            if (!codeToUse) return;

            await validateGameStep(codeToUse);

            const currentCodes = JSON.parse(localStorage.getItem('game_codes') || '[]');
            if (!currentCodes.find(c => c.value === "FOYER")) {
                currentCodes.push({ label: "POSITION", value: "FOYER" });
                localStorage.setItem('game_codes', JSON.stringify(currentCodes));
            }
        } catch (error) {
            console.error("Erreur lors de la validation :", error.message);
        }
    };

    const terminalLines = [
        "> LIAISON ÉTABLIE. CANAL CHIFFRÉ.",
        "> M. JACQUOT :",
        "> Ça y est, j'ai réussi à forcer leur premier point d'entrée.",
        "> Je vous envoie les données brutes que j'ai pu intercepter.",
        "> Regardez l'écran, ces chiffres doivent vous aider à chercher un mot.",
        "> Une fois que vous l'avez, tapez-le dans la console juste en dessous.",
        "> Ne vous inquiétez pas pour le système de sécurité : le nombre de tentatives est illimité.",
        "> - Jacquot"
    ];

    const numbers = [
        { val: "6", color: "var(--color-mat-red)" },
        { val: "15", color: "var(--color-mat-red)" },
        { val: "25", color: "var(--color-mat-red)" },
        { val: "5", color: "var(--color-mat-red)" },
        { val: "18", color: "var(--color-mat-red)" }
    ];

    return (
        <main className="min-h-[100dvh] w-full flex flex-col bg-[var(--color-darker-red)] overflow-y-auto font-mono">
            <section className="flex flex-col min-h-[100dvh] md:max-w-md mx-auto p-4 gap-4">

                <article className="shrink-0 pt-4 pb-2 border-b border-[var(--color-mid-red)] min-h-[120px]">
                    <TypewriterTerminal textLines={terminalLines} speed={15} />
                </article>

                <article className="flex-1 flex items-center justify-center">
                    <div className="w-full grid grid-cols-2 gap-4 bg-[var(--color-mid-red)]/20 rounded-2xl p-6 border border-[var(--color-mat-red)]/40 shadow-2xl backdrop-blur-sm">
                        {numbers.map((n, index) => (
                            <div key={index} className="text-8xl font-black text-center" style={{ color: n.color }}>
                                {n.val}
                            </div>
                        ))}
                    </div>
                </article>

                <article className="shrink-0 pb-4">
                    <AnswerTerminal
                        expectedAnswer="FOYER"
                        onValidate={handleSuccess}
                        placeholder="ENTRER LE MOT..."
                    />
                </article>
            </section>

            <BaseModal
                isOpen={isModalOpen}
                title="< ACCÈS DÉBLOQUÉ />"
                message="Eh ben... C'était laborieux. Vous venez de débloquer le module de Scan QR-Code. Rendez-vous au Foyer pour la suite des énigmes, si vous y arrivez... - LES CHEMISES ROUGES"
                onConfirm={() => { setIsModalOpen(false); router.push('/'); }}
            />
        </main>
    );
}