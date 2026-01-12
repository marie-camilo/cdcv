"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TypewriterTerminal from "@/components/molecules/TypewriterTerminal/TypewriterTerminal";
import AnswerTerminal from "@/components/organisms/AnswerTerminal/AnswerTerminal";
import BaseModal from "@/components/molecules/Modals/BaseModal";
import TalkieButton from "@/components/atoms/TalkieButton/TalkieButton";

export default function Enigme3Page() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [logs, setLogs] = useState(["EN ATTENTE DE SIGNAL..."]);

    useEffect(() => {
        document.title = "Énigme 3 | Talkie-Walkie";
    }, []);

    const addLog = (msg) => {
        setLogs(prev => [...prev.slice(-4), msg]);
    };

    const handleSuccess = () => {
        setIsModalOpen(true);
    };

    const goToNextStep = () => {
        setIsModalOpen(false);
        router.push('/enigme-4');
    };

    const terminalLines = [
        "FREQUENCE DE TRAVAIL : 443.5 MHz",
        "CANAL : INFILTRATION",
        "INSTRUCTION : MAINTENEZ POUR COMMUNIQUER",
        "LE PILOTE VOUS ENTEND."
    ];

    return (
        <section style={{
            backgroundImage: "url('/background-computer.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
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
            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(10, 20, 21, 0.6)", zIndex: 0 }} />

            <div style={{ zIndex: 1, width: "100%", maxWidth: "450px" }}>
                <TypewriterTerminal textLines={terminalLines} speed={40} />
            </div>

            {/* ZONE TALKIE-WALKIE */}
            <div style={{
                zIndex: 1,
                width: "100%",
                maxWidth: "400px",
                margin: "auto 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2rem"
            }}>
                <TalkieButton onLog={addLog} />

                <div className="w-full bg-black/60 backdrop-blur-sm border border-[var(--color-medium)] p-4 rounded-lg font-mono text-[10px] text-[var(--color-light-green)] min-h-[100px]">
                    {logs.map((log, i) => (
                        <div key={i} className="mb-1 opacity-80">{`> ${log}`}</div>
                    ))}
                </div>
            </div>

            <div className="z-10 w-full max-w-[450px] mt-auto">
                <AnswerTerminal
                    expectedAnswer="LABYRINTHE"
                    onValidate={handleSuccess}
                    placeholder="CODE DE SORTIE DU PILOTE"
                />
            </div>

            <BaseModal
                isOpen={isModalOpen}
                title="< TRANSMISSION FINIE />"
                message="Jacquot : 'Vous avez réussi à les guider à travers le labyrinthe ! Mais l'ennemi approche. Récupérez la pièce de puzzle finale et rejoignez-moi pour l'ultime décodage.'"
                onConfirm={goToNextStep}
            />
        </section>
    );
}