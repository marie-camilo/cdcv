"use client";
import React, {useEffect, useState} from 'react';
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
            currentCodes.push({
                label: "POSITION",
                value: "FOYER"
            });
            localStorage.setItem('game_codes', JSON.stringify(currentCodes));
        }

        setIsModalOpen(true);
    };

    const goToNextStep = () => {
        setIsModalOpen(false);
        router.push('/'); // Retour au menu principal
    };

    const terminalLines = [
        "> CONNEXION SÉCURISÉE ÉTABLIE...",
        "> IDENTITÉ : M. JACQUOT",
        "> STATUT : INFILTRATION EN COURS",
        "> Équipe, je suis à l'intérieur de leur réseau.",
        "> Les Chemises Rouges ont sécurisé leur système avec un pare-feu complexe.",
        "> J'ai besoin de votre aide pour forcer l'accès.",
        "> Devant vous, une séquence de chiffres. C'est leur premier verrou.",
        "> Une fois déchiffré, entrez le mot de passe.",
        "> Cela nous donnera accès à leur SCANNER de documents.",
        "> Le temps presse. Bonne chance.",
        "> — M. JACQUOT"
    ];

    const numbers = [
        { val: "6", color: "#347E84" },
        { val: "15", color: "var(--color-turquoise)" },
        { val: "25", color: "var(--color-light-green)" },
        { val: "5", color: "#FFACAC" },
        { val: "18", color: "var(--color-lavender)" }
    ];

    return (
        <section className="h-full flex flex-col overflow-hidden" style={{
            backgroundImage: "url('/background-computer.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100vw",
            position: "relative",
            left: "50%",
            right: "50%",
            marginLeft: "-50vw",
            marginRight: "-50vw",
        }}>

            <div style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(10, 20, 21, 0.4)",
                zIndex: 0
            }} />

            {/* Zone de texte avec scroll - PLUS GRANDE */}
            <div className="overflow-y-auto max-h-[45vh] p-4" style={{ zIndex: 1 }}>
                <div style={{ width: "100%", maxWidth: "450px", margin: "0 auto" }}>
                    <TypewriterTerminal textLines={terminalLines} speed={40} />
                </div>
            </div>

            {/* Zone des chiffres - toujours visible - PLUS PETITE */}
            <div className="flex-1 flex items-center justify-center p-4" style={{ zIndex: 1 }}>
                <div style={{
                    width: "100%",
                    maxWidth: "400px",
                    background: "rgba(0, 0, 0, 0.40)",
                    backdropFilter: "blur(5px)",
                    WebkitBackdropFilter: "blur(5px)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    padding: "20px 15px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px 30px",
                    justifyItems: "center"
                }}>
                    {numbers.map((n, index) => (
                        <div key={index} style={{
                            fontSize: "4rem",
                            fontWeight: "700",
                            color: n.color,
                            textAlign: "center",
                            lineHeight: "1",
                            filter: `drop-shadow(0 0 10px ${n.color}44)`
                        }} >
                            {n.val}
                        </div>
                    ))}
                </div>
            </div>

            {/* Zone de réponse - toujours visible en bas */}
            <div className="p-4 flex justify-center" style={{ zIndex: 10 }}>
                <div className="w-full max-w-[450px]">
                    <AnswerTerminal
                        expectedAnswer="FOYER"
                        onValidate={handleSuccess}
                        placeholder="ENTREZ LE MOT DE PASSE..."
                    />
                </div>
            </div>

            <BaseModal
                isOpen={isModalOpen}
                title="< ACCÈS DÉBLOQUÉ />"
                message="Excellent travail ! Nous avons forcé la première couche de sécurité. Le SCANNER est maintenant accessible depuis le menu principal. Vous pouvez désormais numériser leurs documents secrets. Retournez au menu et commencez l'infiltration. Chaque application débloquée nous rapproche de la vérité. — M. JACQUOT"
                onConfirm={goToNextStep}
            />
        </section>
    );
}