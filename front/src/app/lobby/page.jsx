"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pusher from "pusher-js";

export default function LobbyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    const API_BASE_URL = "http://localhost:8000/api/v1";

    const API_HEADERS = {
        "Content-Type": "application/json",
        "Authorization": "Bearer testapikey12345",
    };

    const pusherRef = useRef(null);

    const [players, setPlayers] = useState([]);
    const [max] = useState(6);
    const [error, setError] = useState(null);

    /**
     * 1️⃣ État initial (source de vérité)
     */
    useEffect(() => {
        if (!code) return;

        fetch(`${API_BASE_URL}/games/${code}`, {
            headers: API_HEADERS,
        })
            .then(res => {
                if (!res.ok) throw new Error("HTTP error");
                return res.json();
            })
            .then(data => {
                setPlayers(data.players);
            })
            .catch(() => {
                setError("Impossible de charger le lobby.");
            });

    }, [code]);

    /**
     * 2️⃣ Temps réel (événements uniquement)
     */
    useEffect(() => {
        if (!code || pusherRef.current) return;

        const pusher = new Pusher(
            process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
            {
                cluster: "eu",
                forceTLS: true,
            }
        );

        pusherRef.current = pusher;

        const channel = pusher.subscribe(`game.${code}`);

        channel.bind("PlayerJoined", data => {
            console.log("EVENT PlayerJoined reçu", data);
            setPlayers(prev => [...prev, data.playerName]);
        });

        channel.bind("GameStarted", () => {
            router.push("/game");
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe(`game.${code}`);
            pusher.disconnect();
            pusherRef.current = null;
        };
    }, [code, router]);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-2">Salle d’attente</h1>

            <p className="text-sm text-gray-500 mb-4">
                {players.length} / {max} joueurs
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
