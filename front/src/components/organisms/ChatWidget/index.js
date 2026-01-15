"use client";

import React, { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { IoClose } from "react-icons/io5";

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

export default function ChatWidget({ isOpen, onClose, playerName }) {
    const pusherRef = useRef(null);
    const channelRef = useRef(null);

    const [shouldRender, setShouldRender] = useState(false);

    const [authorized, setAuthorized] = useState(false);
    const [gameId, setGameId] = useState(null);
    const [isImpostor, setIsImpostor] = useState(false);

    const [activeChannel, setActiveChannel] = useState("general");
    const [messages, setMessages] = useState([]);

    const messagesEndRef = useRef(null);

    // 0) animation open/close
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
        } else {
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // 1) init session : cookie + role
    useEffect(() => {
        if (!isOpen) return;

        let cancelled = false;

        const init = async () => {
            try {
                const session = await checkPlayerCookie();
                if (cancelled) return;

                const gid = session?.player?.game_id;

                if (!session?.authenticated || !gid) {
                    setAuthorized(false);
                    return;
                }

                const roleData = await getPlayerRole();
                if (cancelled) return;

                setGameId(gid);
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
    }, [isOpen]);

    // 2) si pas impostor => force general
    useEffect(() => {
        if (!isImpostor) setActiveChannel("general");
    }, [isImpostor]);

    // 3) load history (API) - PAR CHANNEL (general / impostor)
    useEffect(() => {
        if (!isOpen || !authorized || !gameId) return;

        let cancelled = false;

        const loadHistory = async () => {
            try {
                // ✅ on charge seulement le channel actif
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

        loadHistory();

        return () => {
            cancelled = true;
        };
    }, [isOpen, authorized, gameId, activeChannel]);

    // 4) realtime Pusher
    useEffect(() => {
        if (!isOpen || !authorized || !gameId) return;
        if (pusherRef.current) return;

        const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || process.env.NEXT_PUBLIC_PUSHER_KEY;
        if (!key) {
            console.error("Missing Pusher key: NEXT_PUBLIC_PUSHER_APP_KEY (ou NEXT_PUBLIC_PUSHER_KEY)");
            return;
        }

        const pusher = new Pusher(key, { cluster: "eu", forceTLS: true });
        pusherRef.current = pusher;

        const channelName = `chat.game.${gameId}`;
        const channel = pusher.subscribe(channelName);
        channelRef.current = channel;

        channel.bind("message.sent", (data) => {
            if (!data?.id) return;

            // ✅ si message pas du channel affiché => on ignore
            // (ça évite que le canal general pollue impostor, et inversement)
            if (data.channel !== activeChannel) return;

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
        });

        return () => {
            try {
                channel.unbind_all();
                pusher.unsubscribe(channelName);
                pusher.disconnect();
            } finally {
                channelRef.current = null;
                pusherRef.current = null;
            }
        };
    }, [isOpen, authorized, gameId, activeChannel]);

    // 5) auto scroll
    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    // 6) send message (API)
    const handleSend = async (text) => {
        const clean = text.trim();
        if (!clean || !authorized || !gameId) return;

        console.log(activeChannel)

        try {
            if (activeChannel === "impostor") {
                if (!isImpostor) return;
                await sendImpostorChatMessage(gameId, clean);
            } else {
                await sendChatMessage(gameId, clean);
            }

            // ✅ on ne push pas localement -> Pusher + reload API font le job
        } catch (e) {
            console.error("Chat send error:", e);
        }
    };

    // Styles dynamiques
    const borderColor = activeChannel === "impostor" ? "border-red-500" : "border-[var(--color-light-green)]";
    const headerBg = activeChannel === "impostor" ? "bg-red-500/10" : "bg-[var(--color-light-green)]/10";
    const headerText = activeChannel === "impostor" ? "text-red-500" : "text-[var(--color-light-green)]";
    const dotColor = activeChannel === "impostor" ? "bg-red-500" : "bg-[var(--color-light-green)]";

    if (!shouldRender) return null;

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[1190] transition-opacity duration-300 
                ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            <div
                className={`fixed bottom-0 right-0 md:bottom-4 md:right-4 w-full md:w-96 h-[80vh] md:h-[600px] z-[1200] flex flex-col pointer-events-none transition-all duration-300 transform 
                ${isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            >
                <div
                    className={`flex-1 bg-[var(--color-dark)] border ${borderColor} shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col pointer-events-auto md:rounded-lg overflow-hidden backdrop-blur-md transition-colors duration-500`}
                >
                    {/* HEADER */}
                    <div className={`flex items-center justify-between p-3 border-b border-white/10 ${headerBg}`}>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${dotColor}`} />
                            <span className={`font-mono font-bold text-sm tracking-widest uppercase ${headerText}`}>
                                {activeChannel === "impostor" ? "CANAL ROUGE // RESTRICTED" : "UPLINK // ADMIN"}
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
