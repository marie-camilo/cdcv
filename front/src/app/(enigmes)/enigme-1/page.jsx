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
        document.title = "Énigme 1 | La Click";
    }, []);

    const handleSuccess = () => {
        setIsModalOpen(true);
    };

    const goToNextStep = () => {
        setIsModalOpen(false);
        router.push('/enigme-2');
    };

    const terminalLines = [
        "RECEPTION MESSAGE ENTRANT...",
        "PROVENANCE : LES CHEMISES ROUGES",
        "SUJET : LE DEFI COMMENCE",
        "DECHIFFREZ LE POINT DE RENDEZ-VOUS"
    ];

    const numbers = [
        { val: "6", color: "#347E84" },
        { val: "15", color: "var(--color-turquoise)" },
        { val: "25", color: "var(--color-light-green)" },
        { val: "5", color: "#FFACAC" },
        { val: "18", color: "var(--color-lavender)" }
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
                backgroundColor: "rgba(10, 20, 21, 0.4)",
                zIndex: 0
            }} />

            <div style={{ zIndex: 1, width: "100%", maxWidth: "450px" }}>
                <TypewriterTerminal textLines={terminalLines} speed={40} />
            </div>

            <div style={{
                zIndex: 1,
                width: "100%",
                maxWidth: "450px",
                background: "rgba(0, 0, 0, 0.40)",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "30px 20px",
                margin: "auto 0",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px 40px",
                justifyItems: "center"
            }}>
                {numbers.map((n, index) => (
                    <div key={index} style={{
                        fontSize: "6.5rem",
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

            <div className="z-10 w-full max-w-[450px] mt-auto">
                <AnswerTerminal
                    expectedAnswer="FOYER"
                    onValidate={handleSuccess}
                />
            </div>

            <BaseModal
                isOpen={isModalOpen}
                title="< ACCÈS FORCÉ />"
                message="Pff... Vous avez trouvé ? Jacquot a vraiment engagé des amateurs chanceux. Profitez-en, ça ne durera pas. Allez traîner vos pauvres carcasses au FOYER (RDC). On vous observe, et votre précieux 'Royaume Linux' commence déjà à s'effriter. Dépêchez-vous, si vous ne voulez pas qu'on brûle le reste de sa garde-robe."
                onConfirm={goToNextStep}
            />
        </section>
    );
}