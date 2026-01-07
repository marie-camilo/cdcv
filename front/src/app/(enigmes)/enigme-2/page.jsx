"use client";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import QRScanner from "@/components/organisms/QRScanner/QRScanner";
import BaseModal from "@/components/molecules/Modals/BaseModal";

export default function Enigme2Page() {
    const router = useRouter();
    const [step, setStep] = useState('SCAN');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lockerCode, setLockerCode] = useState("");
    const [error, setError] = useState(false);

    const handleScanSuccess = () => {
        setIsModalOpen(true);
    };

    const handleLockerSubmit = (e) => {
        e.preventDefault();
        if (lockerCode === "1991") {
            router.push('/enigme-3');
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <main className="min-h-screen bg-[var(--color-dark)] flex flex-col items-center p-6">

            {step === 'SCAN' ? (
                <div className="w-full flex flex-col items-center">
                    <div className="mt-8 px-8 text-center max-w-md">
                        <p className="text-[var(--color-light-green)] text-sm font-light italic leading-relaxed">
                            Levez un peu les yeux de vos écrans... La vérité se cache parfois derrière ce qui décore vos murs. Mais bon, à ce rythme, on aura fini avant vous.
                        </p>
                    </div>

                    <QRScanner onScanSuccess={handleScanSuccess} label="< LOCALISATION : FOYER />"/>

                    <button onClick={handleScanSuccess} className="mt-12 opacity-20 text-[8px] uppercase tracking-widest hover:opacity-100 transition-opacity">
                        [ Simulation : Scanner Affiche ]
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center mt-20 animate-in fade-in duration-700">
                    <h2 className="text-[var(--color-light-green)] text-2xl font-bold mb-2 uppercase tracking-tighter italic">{"//"} CASIERS SCELLÉS</h2>
                    <p className="text-[var(--color-white)]/40 text-[10px] uppercase mb-8 tracking-widest">
                        Entrez le code d'accès récupéré
                    </p>

                    <form onSubmit={handleLockerSubmit} className="flex flex-col items-center">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={lockerCode}
                            onChange={(e) => setLockerCode(e.target.value)}
                            className={`bg-black/50 border-2 ${error ? 'border-[var(--color-classic-red)]' : 'border-[var(--color-medium)]'} text-[var(--color-light-green)] text-4xl text-center w-48 p-4 rounded-xl font-mono mb-6 outline-none transition-colors`}
                            placeholder="0000"
                            maxLength={4}
                        />
                        <button type="submit" className="bg-[var(--color-light-green)] text-[var(--color-dark)] px-8 py-3 rounded-full font-bold uppercase text-xs hover:scale-105 transition-transform">
                            DÉVERROUILLER
                        </button>
                    </form>

                    <p className="mt-12 text-[var(--color-white)]/60 text-sm italic text-center max-w-xs leading-relaxed">
                        Ouvrez le casier, récupérez la pièce de puzzle n°1 et lisez la lettre de Jacquot. <br/>
                        <span className="text-[var(--color-classic-red)] font-bold not-italic">Suivez les instructions.</span>
                    </p>
                </div>
            )}

            <BaseModal
                isOpen={isModalOpen}
                title="< TRANSMISSION RÉUSSIE />"
                message="Bien. Le code du casier est '1991'. Allez-y, ouvrez-le. Il contient les derniers délires de Jacquot. Récupérez la pièce de puzzle et suivez les instructions de sa lettre... si vous comprenez son écriture."
                onConfirm={() => {
                    setIsModalOpen(false);
                    setStep('INPUT_CODE');
                }}
            />
        </main>
    );
}