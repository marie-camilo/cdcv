"use client";
import React, { useState } from 'react';
import NextButton from "@/components/atoms/Buttons/NextButton";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [teamName, setTeamName] = useState("");

  const handleNext = () => {
    if (playerName.trim() === "") {
      return alert("Nom requis");
    }

    localStorage.setItem('currentPlayerName', playerName);
    localStorage.setItem('currentTeamName', teamName);
    router.push('/scan');
  };

  // On retire <html> et <body> ici
  return (
      <main className="min-h-screen flex flex-col p-8 md:max-w-md mx-auto justify-between py-16">
        {/* Header & Textes */}
        <section className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Bienvenue <br /> dans la Click
          </h1>

          <div className="space-y-4 text-color-mint/80 font-light">
            <p>Avant d'accéder à votre rôle, vous devez enregistrer votre équipe.</p>
            <p>Chaque participant doit renseigner le nom de son équipe et son nom.</p>
          </div>

          <div className="relative border border-white/40 rounded-xl p-6 mt-8">
            <span className="absolute -top-3 left-6 bg-dark px-2 text-lime font-bold uppercase text-sm tracking-wider">
              Attention
            </span>
            <p className="text-mint font-medium">Une fois validé, votre rôle est définitif.</p>
          </div>
        </section>

        {/* Formulaire */}
        <section className="space-y-8 mt-12">
          <div className="space-y-3">
            <label className="text-lime font-bold italic underline decoration-lime underline-offset-4">
              Nom de votre équipe *
            </label>
            <input
                type="text"
                placeholder="Ex: Ma super équipe"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-mint rounded-xl p-4 text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-greenAccent"
            />
          </div>

          <div className="space-y-3">
            <label className="text-lime font-bold italic underline decoration-lime underline-offset-4">
              Ton nom *
            </label>
            <input
                type="text"
                placeholder="Ex: John Doe"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-mint rounded-xl p-4 text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-greenAccent"
            />
          </div>
        </section>

        <div
            style={{ zIndex: 1, width: "100%", maxWidth: "450px", display: "flex", justifyContent: "right" }}
            onClick={handleNext}
        >
          <NextButton variant="primary" />
        </div>
      </main>
  );
}