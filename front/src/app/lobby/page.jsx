"use client";

import {useEffect, useState, useRef} from "react";
import {useSearchParams} from "next/navigation";
import Pusher from "pusher-js";
import {getPlayersForGivenGame} from "@/hooks/API/gameRequests";
import SectionTitle from "@/components/molecules/SectionTitle";
import GameCodeCard from "../../components/molecules/Lobby/GameCodeCard";
import LobbyStatus from "../../components/molecules/Lobby/LobbyStatus";
import PlayerCard from "../../components/molecules/Lobby/PlayerCard";
import InfoBanner from "@/components/molecules/Lobby/InfoBanner";
import Text from "@/components/atoms/Text/Text";

export default function LobbyPage() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const pusherRef = useRef(null);

    const [players, setPlayers] = useState([]);
    const [error, setError] = useState(null);

    const MAX_PLAYERS = 6;

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

    useEffect(() => {
        if (!code || pusherRef.current) return;

        const pusher = new Pusher(
            process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
            {cluster: "eu", forceTLS: true}
        );

        pusherRef.current = pusher;
        const channel = pusher.subscribe(`game.${code}`);

        channel.bind("LobbyUpdated", async () => {
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
        <main className="min-h-screen flex flex-col p-8 md:max-w-md mx-auto py-16">

            {/* Header */}
            <SectionTitle
                variant={"lobby"}
                title={"Salle d'attente"}
                subtitle={"Les joueurs rejoignent la partie en temps réel"}
            />

            <GameCodeCard variant={"game-code"} label={"Code de la partie"} code={code} />

            {/* Statut */}
            <LobbyStatus label={"Joueurs connectés"} current={players.length} count={MAX_PLAYERS}/>


            {/* Liste joueurs */}
            <ul className="mt-6 space-y-3">
                {players.map((player) => (
                    <PlayerCard
                        key={`player-${player}`}
                        name={player}
                    />
                ))}


                {players.length < MAX_PLAYERS &&
                    Array.from({length: MAX_PLAYERS - players.length}).map((_, i) => (
                        <PlayerCard
                            key={`empty-${i}`}
                            variant="empty"
                        />

                    ))}
            </ul>

            {/* Attention */}
            <InfoBanner
                label="Information"
                text="La partie commencera lorsque tous les joueurs seront prêts."
            />


            {error && (
                <Text text={error} variant={"lobbyError"}/>
            )}
        </main>
    );
}
