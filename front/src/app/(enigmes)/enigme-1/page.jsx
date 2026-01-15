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

    // ✅ 1) Récupération du code de partie
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

    // ✅ 2) ÉCOUTE PUSHER pour synchroniser les apps débloquées
    useEffect(() => {
        if (!gameCode || pusherRef.current) return;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
            cluster: "eu",
            forceTLS: true,
        });

        pusherRef.current = pusher;
        const channel = pusher.subscribe(`game.${gameCode}`);

        // 🔥 Écoute du déblocage d'app
        channel.bind('AppUnlocked', (data) => {
            console.log("🔓 NOUVELLE APP DÉBLOQUÉE :", data.appId);

            // Met à jour le localStorage pour tous les joueurs
            const unlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');
            if (!unlocked.includes(data.appId)) {
                unlocked.push(data.appId);
                localStorage.setItem('unlockedApps', JSON.stringify(unlocked));
                console.log("✅ localStorage mis à jour:", unlocked);
            }

            // Si c'est l'app "scan" (celle débloquée par cette énigme)
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

            if (!codeToUse) {
                alert("Erreur : Code de partie introuvable. Veuillez vous reconnecter.");
                return;
            }

            console.log("📡 Envoi de la validation au serveur...");

            // ✅ APPEL API : le backend enverra l'événement Pusher à TOUT LE GROUPE
            await validateGameStep(codeToUse);

            // ✅ Ajout du code de position (spécifique à cette énigme)
            const currentCodes = JSON.parse(localStorage.getItem('game_codes') || '[]');
            if (!currentCodes.find(c => c.value === "FOYER")) {
                currentCodes.push({ label: "POSITION", value: "FOYER" });
                localStorage.setItem('game_codes', JSON.stringify(currentCodes));
            }

            console.log("✅ Validation envoyée avec succès");

        } catch (error) {
            console.error("❌ Erreur lors de la validation :", error.message);
            // En cas d'erreur réseau, on peut quand même ouvrir la modal localement
            // mais les autres joueurs ne seront pas notifiés
            alert("Erreur de connexion. Vérifiez votre réseau.");
        }
    };

    const terminalLines = [
        "> CONNEXION SÉCURISÉE ÉTABLIE...",
        "> IDENTITÉ : M. JACQUOT",
        "> Équipe, je suis à l'intérieur de leur réseau.",
        "> Voici leur premier verrou numérique.",
        "> — M. JACQUOT"
    ];

    const numbers = [
        { val: "6", color: "#347E84" },
        { val: "15", color: "#4FD1C5" },
        { val: "25", color: "#9AE6B4" },
        { val: "5", color: "#FFACAC" },
        { val: "18", color: "#D6BCFA" }
    ];

    return (
        <main className="h-full w-full relative flex flex-col" style={{
            backgroundImage: "url('/background-computer.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}>
            <div className="absolute inset-0 bg-black/60 z-0" />
            <section className="relative z-10 h-full flex flex-col md:max-w-md mx-auto p-4 overflow-hidden">
                <article className="flex-shrink-0 pt-2 pb-1 border-b-2 border-white/20 max-h-[20dvh] overflow-y-auto">
                    <TypewriterTerminal textLines={terminalLines} speed={10} />
                </article>
                <article className="flex-1 flex items-center justify-center min-h-0">
                    <div className="w-full grid grid-cols-2 gap-2 bg-black/40 rounded-xl p-3 border border-white/10 shadow-2xl">
                        {numbers.map((n, index) => (
                            <div key={index} className="text-6xl font-bold text-center" style={{ color: n.color }}>{n.val}</div>
                        ))}
                    </div>
                </article>
                <article className="flex-shrink-0 pt-2">
                    <AnswerTerminal expectedAnswer="FOYER" onValidate={handleSuccess} placeholder="ENTREZ LE MOT DE PASSE..." />
                </article>
            </section>
            <BaseModal
                isOpen={isModalOpen}
                title="< ACCÈS DÉBLOQUÉ />"
                message="Eh ben... C'était laborieux. Rendez-vous au Foyer pour la suite des énigmes, si vous y arrivez... - LES CHEMISES ROUGES"
                onConfirm={() => { setIsModalOpen(false); router.push('/'); }}
            />
        </main>
    );
}