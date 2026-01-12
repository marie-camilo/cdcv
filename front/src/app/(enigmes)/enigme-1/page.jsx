"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TypewriterTerminal from "@/components/molecules/TypewriterTerminal/TypewriterTerminal";
import AnswerTerminal from "@/components/organisms/AnswerTerminal/AnswerTerminal";
import BaseModal from "@/components/molecules/Modals/BaseModal";

export default function Enigme1Page() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        document.title = "Énigme 1 | Infiltration";
    }, []);

    const handleSuccess = () => {
        const unlocked = JSON.parse(localStorage.getItem('unlockedApps') || '[]');
        if (!unlocked.includes('scan')) {
            unlocked.push('scan');
            localStorage.setItem('unlockedApps', JSON.stringify(unlocked));
        }

        const currentCodes = JSON.parse(localStorage.getItem('game_codes') || '[]');
        if (!currentCodes.find(c => c.value === "FOYER")) {
            currentCodes.push({ label: "POSITION", value: "FOYER" });
            localStorage.setItem('game_codes', JSON.stringify(currentCodes));
        }
        setIsModalOpen(true);
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
        /* On utilise h-full car le parent (RootLayout) gère déjà le 100dvh et la Navbar */
        <main className="h-full w-full relative flex flex-col" style={{
            backgroundImage: "url('/background-computer.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}>
            <div className="absolute inset-0 bg-black/60 z-0" />

            {/* Conteneur compact : pas de justify-between, juste le strict nécessaire */}
            <section className="relative z-10 h-full flex flex-col md:max-w-md mx-auto p-4 overflow-hidden">

                {/* Zone 1 : Terminal - Hauteur réduite au minimum */}
                <article className="flex-shrink-0 pt-2 pb-1 border-b-2 border-white/20 max-h-[20dvh] overflow-y-auto">
                    <TypewriterTerminal textLines={terminalLines} speed={10} />
                </article>

                {/* Zone 2 : Chiffres - flex-1 pour boucher le trou sans pousser l'input */}
                <article className="flex-1 flex items-center justify-center min-h-0">
                    <div className="w-full grid grid-cols-2 gap-2 bg-black/40 rounded-xl p-3 border border-white/10 shadow-2xl">
                        {numbers.map((n, index) => (
                            <div
                                key={index}
                                className="text-6xl font-bold text-center"
                                style={{ color: n.color }}
                            >
                                {n.val}
                            </div>
                        ))}
                    </div>
                </article>

                {/* Zone 3 : Input - Collé en bas, pas de pb-20 ou autre */}
                <article className="flex-shrink-0 pt-2">
                    <AnswerTerminal
                        expectedAnswer="FOYER"
                        onValidate={handleSuccess}
                        placeholder="ENTREZ LE MOT DE PASSE..."
                    />
                </article>
            </section>

            <BaseModal
                isOpen={isModalOpen}
                title="< ACCÈS DÉBLOQUÉ />"
                message="Eh ben... C'était laborieux. Rendez-vous au Foyer pour la suite des énigmes, si vous y arrivez... - LES CHEMISES ROUGES"
<<<<<<< HEAD
                onConfirm={() => { setIsModalOpen(false); router.push('/'); }}
=======
                onConfirm={goToNextStep}
>>>>>>> 75854d4bf0738f640668bdccc16eca011bbb2f8f
            />
        </main>
    );
}