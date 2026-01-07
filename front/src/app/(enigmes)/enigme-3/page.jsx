"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TypewriterTerminal from "@/components/molecules/TypewriterTerminal/TypewriterTerminal";
import AnswerTerminal from "@/components/organisms/AnswerTerminal/AnswerTerminal";
import BaseModal from "@/components/molecules/Modals/BaseModal";

export default function Enigme3Page() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        document.title = "Énigme 3 | Le Labyrinthe";
    }, []);

    const handleSuccess = () => {
        setIsModalOpen(true);
    };

    const goToNextStep = () => {
        setIsModalOpen(false);
        router.push('/enigme-4');
    };

    const terminalLines = [
        "SYNCHRONISATION ÉQUIPE A (GUIDE) & B (PILOTE)...",
    ];

    return (
        <section style={{
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
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "80px 20px 40px",
            gap: "1.5rem",
            overflowX: "hidden"
        }}>
            <div style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(10, 20, 21, 0.6)",
                zIndex: 0
            }} />

            <div style={{ zIndex: 1, width: "100%", maxWidth: "450px" }}>
                <TypewriterTerminal textLines={terminalLines} speed={40} />
            </div>

            <div style={{
                zIndex: 1,
                width: "100%",
                maxWidth: "450px",
                height: "300px",
                background: "rgba(0, 0, 0, 0.70)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                border: "2px solid var(--color-light-green)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                margin: "auto 0",
                color: "var(--color-light-green)",
                textAlign: "center",
                padding: "20px"
            }}>
                <p className="font-mono text-sm">
                    [ INTERFACE DE NAVIGATION ]
                </p>
            </div>

            <div className="z-10 w-full max-w-[450px] mt-auto">
                <AnswerTerminal
                    expectedAnswer="SORTIE"
                    onValidate={handleSuccess}
                    placeholder="ENTREZ LE CODE DE SORTIE"
                />
            </div>

            <BaseModal
                isOpen={isModalOpen}
                title="< LABYRINTHE FRANCHI />"
                message="Jacquot : 'Bravo ! Vous avez réussi à communiquer malgré leurs interférences. Mais ils ont verrouillé le serveur central. Récupérez la pièce de puzzle n°2 dans la salle B. On se retrouve pour l'assemblage final. Ne traînez pas, les Chemises Rouges sont en train d'effacer les logs !'"
                onConfirm={goToNextStep}
            />
        </section>
    );
}