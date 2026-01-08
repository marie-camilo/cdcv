"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Pusher from "pusher-js";
import { getPlayersForGivenGame } from "@/hooks/API/gameRequests";

export default function LobbyPage() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    const pusherRef = useRef(null);

    const [players, setPlayers] = useState([]);
    const [error, setError] = useState(null);

    const MAX_PLAYERS = 6;

    // Initial fetch
    useEffect(() => {
        if (!code) return;

        const fetchPlayers = async () => {
            try {
                const gameData = await getPlayersForGivenGame(code);
                setPlayers(gameData.players ?? []);
            } catch {
                setError("Impossible de charger le lobby.");
            }
        };

        fetchPlayers();
    }, [code]);

    // Temps réel
    useEffect(() => {
        if (!code || pusherRef.current) return;

        console.log("PUSHER KEY =", process.env.NEXT_PUBLIC_PUSHER_APP_KEY);


        const pusher = new Pusher(
            process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
            { cluster: "eu", forceTLS: true }
        );

        pusher.connection.bind("connected", () => {
            console.log("✅ Pusher connecté");
        });

        pusher.connection.bind("error", err => {
            console.error("❌ Erreur Pusher", err);
        });

        pusherRef.current = pusher;
        const channel = pusher.subscribe(`game.${code}`);

        // channel.bind("PlayerJoined", async () => {
        //     try {
        //         const gameData = await getPlayersForGivenGame(code);
        //         setPlayers(gameData.players ?? []);
        //     } catch (e) {
        //         console.error("Lobby resync failed", e);
        //     }
        // });

        // après subscribe
        channel.bind("LobbyUpdated", async () => {
            console.log("📡 LobbyUpdated reçu");
            const gameData = await getPlayersForGivenGame(code);
            setPlayers(gameData.players ?? []);
        });



        return () => {
            channel.unbind_all();
            pusher.unsubscribe(`game.${code}`);
            pusher.disconnect();
            pusherRef.current = null;
        };
    }, [code]);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-2">Salle d’attente</h1>

            <p className="text-sm text-gray-500 mb-4">
                {players.length} / {MAX_PLAYERS} joueurs
            </p>

            {error && <p className="text-red-500">{error}</p>}

            <ul className="space-y-2">
                {players.map(player => (
                    <li key={player} className="border rounded px-3 py-2">
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
