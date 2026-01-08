"use client";
import React, { useState } from 'react';
import NextButton from "@/components/atoms/Buttons/NextButton";
import { useRouter, useSearchParams } from "next/navigation";
import {addPlayer} from "@/hooks/API/gameRequests";

export default function WelcomePage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  // Récupération du code dans l'URL
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  if (!code) {
    return (
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-red-500">
            Code de partie manquant dans l’URL.
          </p>
        </main>
    );
  }

  const handleNext = async () => {
    if (!code) {
      setErrorMessage("Code de partie invalide.");
      return;
    }

    if (playerName.trim() === "") {
      setErrorMessage("Nom requis");
      return;
    }

    try {
      await addPlayer(code, playerName);
      localStorage.setItem("currentPlayerName", playerName);
      router.push("/lobby?code=" + encodeURIComponent(code));

    } catch (error) {
      switch (error.error) {
        case "GAME_FULL":
          setErrorMessage("La partie est complète.");
          break;

        case "GAME_NOT_JOINABLE":
          setErrorMessage("La partie a déjà commencé.");
          break;

        default:
          setErrorMessage(
              error.message || "Une erreur inattendue est survenue."
          );
      }
    }
  };

  // On retire <html> et <body> ici
  return (
      <main className="min-h-screen flex flex-col p-8 md:max-w-md mx-auto py-16">
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
            <span style={{
              backgroundColor: "var(--color-dark)",
            }} className="absolute -top-3 left-6 px-2 text-lime font-bold uppercase text-sm tracking-wider">
              Attention
            </span>
            <p className="text-mint font-medium">Une fois validé, votre rôle est définitif.</p>
          </div>
        </section>

        {/* Formulaire */}
        <section style={{
            position: "relative",
        }} className="space-y-8 mt-12">

          <span style={{
            position: "absolute",
            top: "0",
            right: "0",
            fontSize: "12px",
            color: "var(--color-classic-red)",
          }}>{errorMessage}</span>

          <div className="space-y-3">
            <label className="mb-2 block text-lime font-bold italic underline decoration-lime underline-offset-4">
              Ton nom *
            </label>

            <input
                type="text"
                placeholder="Ex: John Doe"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-mint border rounded-xl p-4 text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-greenAccent"
            />
          </div>
        </section>

        <div
            style={{ zIndex: 1, width: "100%", maxWidth: "450px", display: "flex", justifyContent: "right", marginTop: "calc(var(--spacing) * 12)" }}
            onClick={handleNext}
        >
          <NextButton variant="primary" />
        </div>
      </main>
  );
}