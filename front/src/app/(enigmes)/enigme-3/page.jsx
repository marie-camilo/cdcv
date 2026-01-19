"use client";

import React, { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";

import TypewriterTerminal from "@/components/molecules/TypewriterTerminal/TypewriterTerminal";
import TalkieButton from "@/app/(enigmes)/enigme-3/talkieButton";

import { checkPlayerCookie, getCodeFromCookie } from "@/hooks/API/rules";
import { getAudioMessages, getPlayerRole } from "@/hooks/API/gameRequests";
import LoadingIndicator from "@/components/organisms/LoadingIndicator";

export default function Enigme3Page() {
    const [logs, setLogs] = useState(["EN ATTENTE DE SIGNAL..."]);
    const [messages, setMessages] = useState([]);
    const [myPlayerId, setMyPlayerId] = useState(null);
    const [gameCode, setGameCode] = useState(null);
    const [playerRole, setPlayerRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const scrollRef = useRef(null);
    const pusherRef = useRef(null);
    const seenIdsRef = useRef(new Set());

    const addLog = (msg) => setLogs((prev) => [...prev.slice(-4), msg]);

    // Auto-scroll
    useEffect(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages.length]);

    // 1) Init
    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            try {
                const playerRes = await checkPlayerCookie();
                const gameRes = await getCodeFromCookie();
                const roleRes = await getPlayerRole();
                setPlayerRole(roleRes?.role ?? null);
                if (!playerRes?.authenticated || !playerRes?.player?.id || !gameRes?.game?.code) {
                    addLog("SESSION INVALIDE");
                    return;
                }

                const code = gameRes.game.code;

                if (cancelled) return;
                setMyPlayerId(playerRes.player.id);
                setGameCode(code);

                const history = await getAudioMessages();
                const list = history?.messages ?? [];

                const sorted = [...list].sort(
                    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );

                const ids = new Set(sorted.map((m) => m.id));
                seenIdsRef.current = ids;

                if (!cancelled) setMessages(sorted);
            } catch (e) {
                console.error("Init enigme-3 error:", e);
                addLog("ERREUR INITIALISATION");
            } finally {
                setIsLoading(false);
            }
        };

        init();
        return () => {
            cancelled = true;
        };
    }, []);

    // 2) Pusher
    useEffect(() => {
        if (!gameCode || pusherRef.current) return;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
            cluster: "eu",
            forceTLS: true,
        });

        pusherRef.current = pusher;

        const channelName = `game.${gameCode}`;
        const channel = pusher.subscribe(channelName);

        channel.bind("AudioMessageSent", (payload) => {
            if (!payload?.id) return;
            if (seenIdsRef.current.has(payload.id)) return;
            seenIdsRef.current.add(payload.id);

            setMessages((prev) => {
                const next = [...prev, payload];
                next.sort(
                    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
                return next;
            });
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe(channelName);
            pusher.disconnect();
            pusherRef.current = null;
        };
    }, [gameCode]);

    // 3) Upload local
    const handleUploadSuccess = (msgFromApi) => {
        if (!msgFromApi?.id) return;
        if (seenIdsRef.current.has(msgFromApi.id)) return;
        seenIdsRef.current.add(msgFromApi.id);

        setMessages((prev) => {
            const next = [...prev, msgFromApi];
            next.sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            return next;
        });
    };

    const formatTime = (iso) => {
        try {
            return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } catch {
            return "";
        }
    };

    return (
        <>
            {isLoading && <LoadingIndicator fullscreen={true} />}

            <section className="min-h-[100dvh] w-full flex flex-col bg-[var(--color-darker-red)] p-4 font-mono overflow-hidden relative">

                <div className="absolute inset-0 pointer-events-none opacity-10"
                     style={{
                         backgroundImage: `linear-gradient(var(--color-mat-red) 1px, transparent 1px), linear-gradient(90deg, var(--color-mat-red) 1px, transparent 1px)`,
                         backgroundSize: '40px 40px'
                     }}
                />

                <div className="z-10 w-full max-w-[450px] mx-auto flex flex-col gap-6 h-full">

                    <div className="w-full shrink-0">
                        <TypewriterTerminal
                            textLines={[
                                "Ici P.A. Jacquot. J'ai réussi à déployer ce canal radio de secours.",
                                "Vos coéquipiers sont piégés dans un labyrinthe et doivent trouver leur sortie.",
                                "Des logs système sont inscrits sur l'interface du labyrinthe.",
                                "Il est primoridal que vous analysiez ces données brutes pour leur dicter la route de sortie.",
                                "Utilisez vos talkies-walkies pour communiquer, mais attention! Seuls les agents ayant le rôle de communiquant peuvent y accéder.",
                            ]}
                            speed={30}
                        />
                    </div>

                    <div
                        ref={scrollRef}
                        className="flex-1 min-h-0 overflow-y-auto p-4 rounded-lg border border-[var(--color-mat-red)] bg-black/40 backdrop-blur-md flex flex-col gap-4 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                    >
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full opacity-60">
                                <span className="text-[var(--color-mat-red)] text-xs italic animate-pulse">
                                    -- CANAL DÉSACTIVÉ --
                                </span>
                            </div>
                        )}

                        {messages.map((msg) => {
                            const isMine = myPlayerId != null && msg.senderPlayerId === myPlayerId;

                            return (
                                <div
                                    key={msg.id}
                                    className={`${
                                        isMine ? "self-end items-end" : "self-start items-start"
                                    } flex flex-col max-w-[85%]`}
                                >
                                    <div
                                        className={`p-2 border backdrop-blur-sm ${
                                            isMine
                                                ? "bg-[var(--color-mid-red)] border-[var(--color-mat-red)] rounded-l-xl rounded-tr-xl shadow-[0_0_10px_rgba(195,118,112,0.2)]"
                                                : "bg-[var(--color-sand)]/10 border-[var(--color-sand)]/30 rounded-r-xl rounded-tl-xl"
                                        }`}
                                    >
                                        {/* Player audio style personnalisé */}
                                        <audio
                                            src={msg.url}
                                            controls
                                            className="h-8 w-40 opacity-80 mix-blend-screen"
                                            style={{ filter: "sepia(1) hue-rotate(-50deg) saturate(3)" }}
                                        />
                                    </div>

                                    <span className="text-[9px] text-[var(--color-sand)] mt-1 font-bold uppercase opacity-60 tracking-wider">
                                        {formatTime(msg.createdAt)} • {isMine ? "TX" : "RX"}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="w-full shrink-0 flex flex-col items-center justify-center gap-4 pb-6">

                        {playerRole === "communicant" ? (
                            <>
                                <TalkieButton onLog={addLog} onUploadSuccess={handleUploadSuccess} />

                                <div className="font-mono text-[10px] text-[var(--color-sand)] uppercase tracking-[0.2em] h-4 animate-pulse">
                                    {logs[logs.length - 1]}
                                </div>
                            </>
                        ) : (
                            <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">

                                {/* Faux bouton désactivé */}
                                <div className="w-24 h-24 rounded-full border-2 border-dashed border-[var(--color-mid-red)] flex items-center justify-center bg-black/50 opacity-50 mb-4 grayscale">
                                    <span className="text-[10px] text-[var(--color-mat-red)] font-bold text-center leading-tight">
                                        SIGNAL<br/>OFF
                                    </span>
                                </div>

                                {/* Message d'alerte bien visible */}
                                <div className="w-full rounded border-l-4 border-[var(--color-red)] bg-[var(--color-mid-red)] p-4 shadow-[0_0_20px_rgba(0,0,0,0.6)] relative overflow-hidden group">
                                    {/* Effet scanline */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="text-[var(--color-sand)] font-black text-sm uppercase tracking-widest mb-1">
                                                ACCÈS REFUSÉ
                                            </p>
                                            <p className="text-[13px] text-white/80 leading-tight">
                                                Votre terminal n'est pas équipé pour l'émission radio.
                                                Seul le rôle <strong className="text-[var(--color-red)] bg-black/30 px-1 rounded">COMMUNICANT</strong> peut parler.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}