"use client";

import React, { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { IoClose, IoChatbubbleEllipsesOutline } from "react-icons/io5"; // Ajout icone notif

import ChannelTabs from "@/components/organisms/ChatWidget/ChannelTabs";
import ChatMessage from "@/components/organisms/ChatWidget/ChatMessage";
import ChatInput from "@/components/organisms/ChatWidget/ChatInput";

import { checkPlayerCookie } from "@/hooks/API/rules";
import {
    getPlayerRole,
    getChatMessages,
    sendChatMessage,
    sendImpostorChatMessage,
} from "@/hooks/API/gameRequests";

const NOTIF_SOUND = "/sounds/notification.mp3";

export default function ChatWidget({ isOpen, onClose, onOpen, playerName }) {
    const pusherRef = useRef(null);
    const channelRef = useRef(null);
    const audioRef = useRef(null); // Pour le son
    const [authorized, setAuthorized] = useState(false);
    const [gameId, setGameId] = useState(null);
    const [playerId, setPlayerId] = useState(null);
    const [isImpostor, setIsImpostor] = useState(false);
    const [activeChannel, setActiveChannel] = useState("general");
    const [messages, setMessages] = useState([]);
    const [notification, setNotification] = useState(null);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            try {
                const session = await checkPlayerCookie();
                if (cancelled) return;

                const gid = session?.player?.game_id;
                const pid = session?.player?.id;

                if (!session?.authenticated || !gid) {
                    setAuthorized(false);
                    return;
                }

                const roleData = await getPlayerRole();
                if (cancelled) return;

                setGameId(gid);
                setPlayerId(pid);
                setIsImpostor(!!roleData?.impostor);
                setAuthorized(true);
            } catch (e) {
                console.error("Chat init error:", e);
                setAuthorized(false);
            }
        };

        init();

        return () => {
            cancelled = true;
        };
    }, []);

    // si pas impostor => force general
    useEffect(() => {
        if (!isImpostor) setActiveChannel("general");
    }, [isImpostor]);

    // load history (API)
    useEffect(() => {
        if (!authorized || !gameId) return;

        let cancelled = false;

        const loadHistory = async () => {
            try {
                const data = await getChatMessages(gameId, activeChannel);
                if (cancelled) return;

                setMessages(
                    (data ?? []).map((m) => ({
                        id: m.id,
                        sender: m.sender,
                        text: m.content,
                        channel: m.channel ?? "general",
                        time: m.time,
                        isUser: m.sender === "player",
                        isSystem: m.sender === "system",
                    }))
                );
            } catch (e) {
                console.error("Chat history error:", e);
            }
        };

        // charge l'historique seulement si on ouvre le chat (pour économiser des requêtes) ou si on change d'onglet (imposteur)
        if (isOpen) {
            loadHistory();
        }

        return () => {
            cancelled = true;
        };
    }, [isOpen, authorized, gameId, activeChannel]);

    // REALTIME PUSHER (Toujours actif même si chat fermé)
    useEffect(() => {
        if (!authorized || !gameId) return;
        if (pusherRef.current) return;

        const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || process.env.NEXT_PUBLIC_PUSHER_KEY;
        if (!key) return;

        const pusher = new Pusher(key, { cluster: "eu", forceTLS: true });
        pusherRef.current = pusher;

        const channelName = `chat.game.${gameId}`;
        const channel = pusher.subscribe(channelName);
        channelRef.current = channel;

        channel.bind("message.sent", (data) => {
            if (!data?.id) return;

            // ajouter le message à la liste si on est sur le bon channel
            if (data.channel === activeChannel) {
                setMessages((prev) => {
                    if (prev.some((m) => m.id === data.id)) return prev;
                    return [
                        ...prev,
                        {
                            id: data.id,
                            sender: data.sender,
                            text: data.content,
                            channel: data.channel ?? "general",
                            time: data.time,
                            isUser: data.sender === "player",
                            isSystem: data.sender === "system",
                        },
                    ];
                });
            }

            if (!isOpen) {
                triggerNotification(data);
            }
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe(channelName);
            pusher.disconnect();
            pusherRef.current = null;
        };
    }, [authorized, gameId, activeChannel, isOpen]);

    const triggerNotification = (data) => {
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(e => console.log("Audio block", e));

        setNotification({
            sender: data.sender,
            text: data.content,
            channel: data.channel
        });

        // La notif disparait après 4 secondes
        setTimeout(() => setNotification(null), 4000);
    };

    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    // send message (API)
    const handleSend = async (text) => {
        const clean = text.trim();
        if (!clean || !authorized || !gameId) return;

        try {
            if (activeChannel === "impostor") {
                if (!isImpostor) return;
                await sendImpostorChatMessage(gameId, clean);
            } else {
                await sendChatMessage(gameId, clean);
            }
        } catch (e) {
            console.error("Chat send error:", e);
        }
    };

    const borderColor = activeChannel === "impostor" ? "border-red-500" : "border-[var(--color-light-green)]";
    const headerBg = activeChannel === "impostor" ? "bg-red-500/10" : "bg-[var(--color-light-green)]/10";
    const headerText = activeChannel === "impostor" ? "text-red-500" : "text-[var(--color-light-green)]";
    const dotColor = activeChannel === "impostor" ? "bg-red-500" : "bg-[var(--color-light-green)]";

    return (
        <>
            {/* COMPOSANT NOTIFICATION (TOAST) */}
            <div
                className={`fixed bottom-24 right-4 z-[1300] max-w-xs w-full transition-all duration-500 transform 
                ${notification ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
            >
                {notification && (
                    <div
                        onClick={() => {
                            if (onOpen) onOpen();
                            setNotification(null);
                        }}
                        className={`p-3 rounded-lg border backdrop-blur-md cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.5)] 
                        ${notification.channel === 'impostor'
                            ? 'bg-red-900/80 border-red-500 text-red-100'
                            : 'bg-green-900/80 border-[var(--color-light-green)] text-[var(--color-light-green)]'}`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <IoChatbubbleEllipsesOutline />
                            <span className="text-xs font-bold uppercase tracking-widest">
                                {notification.sender}
                            </span>
                        </div>
                        <p className="text-sm truncate font-mono opacity-90">
                            {notification.text}
                        </p>
                        <div className="text-[9px] mt-1 text-right opacity-70 italic">
                            Cliquez pour ouvrir
                        </div>
                    </div>
                )}
            </div>

            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[1190] transition-opacity duration-300 
                ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            {/* FENÊTRE DE CHAT */}
            <div
                className={`fixed bottom-0 right-0 md:bottom-4 md:right-4 w-full md:w-96 h-[80vh] md:h-[600px] z-[1200] flex flex-col transition-all duration-300 transform 
                ${isOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-4 opacity-0 pointer-events-none"}`}
            >
                <div
                    className={`flex-1 bg-[var(--color-dark)] border ${borderColor} shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col md:rounded-lg overflow-hidden backdrop-blur-md transition-colors duration-500`}
                >
                    {/* HEADER */}
                    <div className={`flex items-center justify-between p-3 border-b border-white/10 ${headerBg}`}>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${dotColor}`} />
                            <span className={`font-mono font-bold text-sm tracking-widest uppercase ${headerText}`}>
                                {activeChannel === "impostor" ? "MESSAGERIE IMPOSTEURS" : "MESSAGERIE"}
                            </span>
                        </div>

                        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                            <IoClose size={20} />
                        </button>
                    </div>

                    {/* ONGLETS */}
                    {isImpostor && (
                        <ChannelTabs activeChannel={activeChannel} onSwitch={setActiveChannel} />
                    )}

                    {/* MESSAGES */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-black/40">
                        {!authorized ? (
                            <p className="text-white/20 text-center text-xs italic mt-4">Connexion...</p>
                        ) : messages.length === 0 ? (
                            <p className="text-white/20 text-center text-xs italic mt-4">
                                Aucun message sur ce canal...
                            </p>
                        ) : (
                            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* INPUT */}
                    <ChatInput onSend={handleSend} channel={activeChannel} />
                </div>
            </div>
        </>
    );
}