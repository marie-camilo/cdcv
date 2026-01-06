"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import QRScanner from "@/components/organisms/QRScanner/QRScanner";
import BaseModal from "@/components/molecules/Modals/BaseModal";

export default function Enigme2Page() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scanError, setScanError] = useState(false);

    const handleQRScanned = (decodedText) => {
        if (decodedText === "FOYER") {
            setIsModalOpen(true);
        } else {
            setScanError(true);
            setTimeout(() => setScanError(false), 3000);
        }
    };

    const goToNextStep = () => {
        setIsModalOpen(false);
        router.push('/enigme-3');
    };

    return (
        <main className="min-h-screen flex flex-col items-center bg-[var(--color-dark)] p-4">
            <div className="mt-6 px-8  text-center">
                <p className="text-[var(--color-white)]/60 text-sm font-light italic leading-relaxed">
                    <span className="block mt-2 text-[var(--color-light-green)]/80 not-italic font-medium"> Levez un peu les yeux. Parfois, la vérité se cache derrière ce qui décore vos murs. Mais bon, à ce rythme, on aura fini de démanteler le serveur avant que vous ne trouviez le mur du foyer.</span>
                </p>
            </div>
            <div className="w-full flex justify-center mt-10">
                <QRScanner
                    onScanSuccess={handleQRScanned}
                    label="< FOYER />"
                />
            </div>

            {scanError && (
                <div className="fixed bottom-10 left-0 right-0 text-center px-4">
                    <p className="text-[var(--color-classic-red)] font-bold animate-bounce uppercase text-xs bg-black/80 py-2 rounded-full inline-block px-6">
                        CODE INVALIDE
                    </p>
                </div>
            )}

            <BaseModal
                isOpen={isModalOpen}
                title="< TRANSMISSION RÉUSSIE />"
                message="Ah, vous avez fini par trouver le foyer. On espère que l'odeur du café ne vous a pas trop déconcentré. Maintenant, les choses sérieuses commencent. Jacquot a caché un dossier crypté sous une dalle... mais laquelle ?"
                onConfirm={goToNextStep}
            />

            {/* Bouton de secours pour le dev */}
            <button
                onClick={() => handleQRScanned("FOYER")}
                className="mt-20 opacity-20 text-[8px] uppercase tracking-widest"
            >
                [ Debug: Forcer Succès ]
            </button>
        </main>
    );
}