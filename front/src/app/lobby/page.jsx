"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";


export default function LobbyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    const API_BASE_URL = "http://localhost:8000/api/v1";
    const SSE_KEY ="public_read_only_sse_key"

    const [players, setPlayers] = useState([]);
    const [count, setCount] = useState(0);
    const [max, setMax] = useState(6);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!code) return;

        const eventSource = new EventSource(
            `${API_BASE_URL}/games/${code}/stream?key=${SSE_KEY}`
        );

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);

            setPlayers(data.players);
            setCount(data.count);
            setMax(data.max);

            if (data.status !== "waiting") {
                eventSource.close();
                router.push("/game");
            }
        };

        eventSource.onerror = () => {
            setError("Connexion temps réel perdue.");
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [code, router]);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-2">Salle d’attente</h1>

            <p className="text-sm text-gray-500 mb-4">
                {count} / {max} joueurs
            </p>

            {error && (
                <p className="text-red-500 text-sm mb-4">
                    {error}
                </p>
            )}

            <ul className="space-y-2">
                {players.map((player, index) => (
                    <li
                        key={index}
                        className="border rounded px-3 py-2"
                    >
                        {player}
                    </li>
                ))}
            </ul>

            <p className="text-sm text-gray-500 mt-6">
                En attente du lancement de la partie…
            </p>
        </div>
    );
}
