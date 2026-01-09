"use client";
import React, { useState } from 'react';
import NextButton from "@/components/atoms/Buttons/NextButton";
import { useRouter } from "next/navigation";

export default function StartPage() {
    const router = useRouter();
    const [playerName, setPlayerName] = useState("");
    const [teamName, setTeamName] = useState([]);

    const handleNext = () => {
        localStorage.setItem('currentPlayerName', playerName);
        localStorage.setItem('currentTeamName', teamName);
        router.push('/');
    };

    // On retire <html> et <body> ici
    return (
        <main className="min-h-[80dvh] flex flex-col p-8 md:max-w-md mx-auto justify-between py-8">
            <h1>Membre du groupe :</h1>
        </main>
    );
}