"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTimer } from "@/app/context/TimerContext";
import BaseModal from "@/components/molecules/Modals/BaseModal";
import Navbar from "@/components/organisms/Navbar/Navbar";

export default function EnigmeFinalePage() {
    const router = useRouter();
    const { simulateEnd } = useTimer();

    const [inputCode, setInputCode] = useState("");
    const [modalData, setModalData] = useState({ open: false, type: 'neutral', title: '', msg: '' });

    useEffect(() => {
        document.title = "Terminal Central | Validation";
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputCode === "7412") {
            handleStopGame('success');
        }
        else if (inputCode === "0000") {
            handleStopGame('trap');
        }
        else {
            alert("ERREUR : Code non reconnu par le système.");
            setInputCode("");
        }
    };

    const handleStopGame = (scenario) => {
        localStorage.removeItem("game_end_time");
        if (scenario === 'success') {
            setModalData({
                open: true,
                type: 'success',
                title: "< ACCÈS AUTORISÉ >",
                msg: "Code validé. Le chrono est arrêté.\n\nRendez-vous immédiatement dans le BUREAU DE MONSIEUR JACQUOT.\n\nLe coffre est prêt à être ouvert, vous pourrez y récupérer la sainte chemise."
            });
        } else {
            setModalData({
                open: true,
                type: 'trap',
                title: "< COMMANDE EXÉCUTÉE >",
                msg: "Code administrateur accepté. Réécriture du système en cours...\n\nLe chrono est arrêté.\n\nRendez-vous dans le BUREAU DE MONSIEUR JACQUOT pour l'ouverture du coffre et la récupération de la chemise."
            });
        }
    };

    return (
        <main className="bg-[var(--color-dark)] flex flex-col items-center justify-center p-6 relative">
            <div className="flex flex-col items-center gap-10 max-w-md w-full animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold text-[var(--color-light-green)] uppercase tracking-widest font-mono">
                        VERROUILLAGE<br/>CENTRAL
                    </h1>
                    <p className="text-white/60 text-sm font-light leading-relaxed font-mono">
                        EN ATTENTE DE SYNCHRONISATION
                        <br/><br/>
                        Entrez le code de sécurité final trouvé sur le terminal pour stopper le compte à rebours et déverrouiller le coffre physique.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 items-center">
                    <div className="relative w-full">
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={4}
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            placeholder="0000"
                            className="w-full bg-[#121212] border border-[#333] text-[var(--color-light-green)] text-5xl text-center py-5 rounded-lg font-mono tracking-[1.5rem] outline-none focus:border-[var(--color-light-green)] transition-colors placeholder-white/5"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[var(--color-light-green)] text-black font-bold text-lg py-4 rounded-lg uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                        EXÉCUTER
                    </button>
                </form>

            </div>

            <BaseModal
                isOpen={modalData.open}
                title={modalData.title}
                message={modalData.msg}
                titleColor={modalData.type === 'trap' ? 'var(--color-classic-red)' : 'var(--color-light-green)'}
                onConfirm={() => router.push('/credits')}
            />
        </main>
    );
}