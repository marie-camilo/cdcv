"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Pusher from "pusher-js";

import TypewriterTerminal from "@/components/molecules/TypewriterTerminal/TypewriterTerminal";
import TalkieButton from "@/app/(enigmes)/enigme-3/talkieButton";

import { checkPlayerCookie, getCodeFromCookie } from "@/hooks/API/rules";
import { getAudioMessages } from "@/hooks/API/gameRequests";

export default function Enigme3Page() {
    const [logs, setLogs] = useState(["EN ATTENTE DE SIGNAL..."]);
    const [messages, setMessages] = useState([]);
    const [myPlayerId, setMyPlayerId] = useState(null);
    const [gameCode, setGameCode] = useState(null);

    const scrollRef = useRef(null);
    const pusherRef = useRef(null);
    const seenIdsRef = useRef(new Set());

    const addLog = (msg) => setLogs((prev) => [...prev.slice(-4), msg]);

    // Auto-scroll (uniquement quand un nouveau message arrive)
    useEffect(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages.length]);

    // 1) Init : récupérer myPlayerId + gameCode + historique
    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            try {
                const playerRes = await checkPlayerCookie();
                const gameRes = await getCodeFromCookie();

                if (!playerRes?.authenticated || !playerRes?.player?.id || !gameRes?.game?.code) {
                    // tu peux router ailleurs si tu veux
                    addLog("❌ SESSION INVALIDE");
                    return;
                }

                const code = gameRes.game.code;

                if (cancelled) return;
                setMyPlayerId(playerRes.player.id);
                setGameCode(code);

                // historique
                const history = await getAudioMessages();
                const list = history?.messages ?? [];

                // dédoublonnage + tri
                const sorted = [...list].sort(
                    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );

                const ids = new Set(sorted.map((m) => m.id));
                seenIdsRef.current = ids;

                if (!cancelled) setMessages(sorted);
            } catch (e) {
                console.error("Init enigme-3 error:", e);
                addLog("❌ ERREUR INITIALISATION");
            }
        };

        init();
        return () => {
            cancelled = true;
        };
    }, []);

    // 2) Pusher : temps réel
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
            // payload attendu: { id, url, senderPlayerId, createdAt, filename? }
            if (!payload?.id) return;

            // anti-doublon
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

    // 3) Quand *moi* j’upload : on injecte aussi dans la liste (sans attendre Pusher)
    const handleUploadSuccess = (msgFromApi) => {
        // msgFromApi doit être { id, url, senderPlayerId, createdAt }
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
        <section
            className="min-h-[100dvh] w-full"
            style={{
                backgroundImage: "url('/background-computer.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: "40px 20px",
            }}
        >
            <div className="absolute inset-0 bg-black/60 z-0"/>
            <div
                className="z-10 w-full max-w-[450px] grid gap-6 z-100"
            >
                {/* ✅ TERMINAL : fixe */}
                <div className="w-full">
                    <TypewriterTerminal
                        textLines={["FREQUENCE : 443.5 MHz", "MAINTENEZ POUR COMMUNIQUER"]}
                        speed={40}
                    />
                </div>

                {/* ✅ CONVERSATION : prend le reste + scroll */}
                <div
                    ref={scrollRef}
                    className="w-full h-[45dvh] max-h-[45dvh] overflow-y-auto p-4 rounded-lg border border-cyan-500/30 bg-black/40 backdrop-blur-md flex flex-col gap-4"
                    style={{scrollbarWidth: "none"}}
                >
                    {messages.length === 0 && (
                        <p className="text-cyan-500/40 text-center text-xs italic mt-10">
                            Aucun signal radio détecté...
                        </p>
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
                                    className={`p-2 border shadow-[0_0_10px_rgba(0,255,255,0.1)] ${
                                        isMine
                                            ? "bg-cyan-900/20 border-cyan-500/50 rounded-l-2xl rounded-tr-2xl"
                                            : "bg-white/10 border-white/20 rounded-r-2xl rounded-tl-2xl"
                                    }`}
                                >
                                    <audio
                                        src={msg.url}
                                        controls
                                        className="h-9 w-44 invert grayscale brightness-200"
                                    />
                                </div>

                                <span className="text-[9px] text-cyan-400 mt-1 font-mono uppercase opacity-70">
              {formatTime(msg.createdAt)} • {isMine ? "ENVOYÉ" : "REÇU"}
            </span>
                            </div>
                        );
                    })}
                </div>

                {/* ✅ CONTROLS : fixe */}
                <div className="w-full flex flex-col items-center justify-center gap-4 z-100">
                    <TalkieButton onLog={addLog} onUploadSuccess={handleUploadSuccess}/>

                    <div className="font-mono text-[10px] text-cyan-400 uppercase tracking-[0.2em] h-4">
                        {logs[logs.length - 1]}
                    </div>
                </div>
            </div>
        </section>
    );
}
