"use client";

import React from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiTShirtLine, RiCodeSSlashLine, RiGamepadLine, RiMovieLine } from "react-icons/ri";
export default function CreditsPage() {
    const credits = [
        {
            role: "Développement Back-End",
            icon: <RiCodeSSlashLine />,
            names: ["Devann BILLEREAU", "Alexis BONNET"],
            color: "text-[var(--color-lavender)]"
        },
        {
            role: "Développement Web Front-End",
            icon: <RiCodeSSlashLine />,
            names: ["Marie CAMILO-MARCHAL", "Cloé CHAROTTE"],
            color: "text-[var(--color-turquoise)]"
        },
        {
            role: "Game Mastery & Mini-Jeux",
            icon: <RiGamepadLine />,
            names: ["Charlotte DUVERGER"],
            color: "text-[var(--color-light-green)]"
        },
        {
            role: "Animations Vidéos",
            icon: <RiMovieLine />,
            names: ["Elinor MONNET"],
            color: "text-[var(--color-medium)]"
        }
    ];

    return (
        <main className="min-h-screen w-full bg-[#193133] text-[#EBFFF6] font-mono p-6 flex flex-col items-center overflow-x-hidden">

            {/* Header cinématique */}
            <header className="w-full max-w-2xl mt-12 mb-16 text-center">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase border-b-4 border-[var(--color-light-green)] inline-block mb-4">
                    Crédits
                </h1>
            </header>

            {/* Liste des contributeurs */}
            <div className="w-full max-w-xl space-y-12 mb-20">
                {credits.map((item, index) => (
                    <section key={index} className="flex flex-col items-center text-center space-y-3">
                        <div className={`flex items-center gap-2 ${item.color} text-xl`}>
                            {item.icon}
                            <h2 className="text-xs font-black tracking-widest uppercase opacity-80">
                                {item.role}
                            </h2>
                        </div>
                        <div className="space-y-1">
                            {item.names.map((name, i) => (
                                <p key={i} className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                                    {name}
                                </p>
                            ))}
                        </div>
                    </section>
                ))}

                {/* Section Spéciale Inspiration */}
                <section className="mt-20 pt-12 border-t border-white/10 flex flex-col items-center text-center">
                    {/* On utilise le S majuscule ici aussi */}
                    <h2 className="text-[var(--color-light-green)] text-[25px] font-black uppercase mb-6">
                        Mention Spéciale
                    </h2>
                    <p className="text-lg max-w-md italic opacity-90 text-[#EBFFF6]">
                        Un immense merci à <span className="text-white font-bold">Monsieur Jacquot</span> et sa légendaire <span className="text-[var(--color-light-green)] font-bold">Chemise Verte</span>.
                        Sans votre style unique, cette aventure n'aurait jamais vu le jour.
                    </p>
                </section>
            </div>

            <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%]" />
        </main>
    );
}