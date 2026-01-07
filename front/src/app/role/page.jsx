"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NextButton from "@/components/atoms/Buttons/NextButton";

export default function RolePage() {
    const router = useRouter();
    const [role, setRole] = useState("Chargement...");

    useEffect(() => {
        const savedRole = localStorage.getItem('playerRole');
        if (savedRole) {
            setRole(savedRole);
        } else {
            setRole("Civil");
        }
    }, []);

    useEffect(() => {
        if (role) {
            document.title = `${role} | La Click`;
        }
    }, [role]);

    const handleNext = () => {
        router.push('/enigme-1');
    };

    return (
        <main className="min-h-screen bg-[var(--color-dark)] flex flex-col p-8 text-[var(--color-white)] font-[family-name:var(--font-source)]">
            <div className="w-full max-w-md self-start mb-10">
                <h1 className="text-4xl font-bold leading-tight mt-6 text-left">
                    Ton rôle
                </h1>
            </div>

            <div className="relative border border-[var(--color-white)]/40 rounded-2xl p-8 pt-10 mt-10">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[var(--color-dark)] px-4">
                    <h2 className="text-[var(--color-light-green)] text-3xl font-bold uppercase tracking-widest italic">
                        {role}
                    </h2>
                </div>

                <div className="space-y-6 text-lg leading-relaxed font-light">
                    <p>
                        Tu es un agent des chemises rouges. Tu es le seul infiltré dans cette équipe.
                    </p>
                    <p>
                        Mission : orienter dans la mauvaise direction... mais toujours sans te faire repérer.
                    </p>
                    <p>
                        Ton but est d'amener ton équipe sur la chemise rouge.
                    </p>
                </div>

                <p className="mt-8 italic text-[var(--color-light-green)] font-medium underline underline-offset-8 decoration-1">
                    Bonne mission !
                </p>

                <div className="w-full flex justify-end mt-8" onClick={handleNext}>
                    <NextButton variant="primary" />
                </div>
            </div>
        </main>
    );
}