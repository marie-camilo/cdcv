"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import TypewriterTerminal from "@/components/molecules/TypewriterTerminal/TypewriterTerminal";
import TalkieButton from "@/app/(enigmes)/enigme-3/talkieButton";

export default function Enigme3Page() {
    const router = useRouter();
    const [logs, setLogs] = useState(["EN ATTENTE DE SIGNAL..."]);
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef(null);

    // Auto-scroll vers le bas pour voir le dernier message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const addLog = (msg) => {
        setLogs(prev => [...prev.slice(-4), msg]);
    };

    // Ajoute le message audio à la liste "WhatsApp"
    const handleNewVoiceMessage = (audioUrl) => {
        const newMsg = {
            id: Date.now(),
            url: audioUrl,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMsg]);
    };

    return (
        <section style={{
            backgroundImage: "url('/background-computer.png')",
            backgroundSize: "cover",
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px 20px"
        }}>
            <div className="z-10 w-full max-w-[450px] mb-6">
                <TypewriterTerminal textLines={["FREQUENCE : 443.5 MHz", "MAINTENEZ POUR COMMUNIQUER"]} speed={40} />
            </div>

            {/* ZONE DE CONVERSATION (STYLE WHATSAPP) */}
            <div
                ref={scrollRef}
                className="z-10 w-full max-w-[400px] flex-1 overflow-y-auto mb-6 p-4 rounded-lg border border-cyan-500/30 bg-black/40 backdrop-blur-md flex flex-col gap-4"
                style={{ scrollbarWidth: 'none' }}
            >
                {messages.length === 0 && (
                    <p className="text-cyan-500/40 text-center text-xs italic mt-10">
                        Aucun signal radio détecté...
                    </p>
                )}

                {messages.map((msg) => (
                    <div key={msg.id} className="self-end flex flex-col items-end max-w-[85%]">
                        <div className="bg-cyan-900/20 border border-cyan-500/50 p-2 rounded-l-2xl rounded-tr-2xl shadow-[0_0_10px_rgba(0,255,255,0.1)]">
                            <audio src={msg.url} controls className="h-9 w-44 invert grayscale brightness-200" />
                        </div>
                        <span className="text-[9px] text-cyan-400 mt-1 font-mono uppercase opacity-70">
                            {msg.time} • ENREGISTRÉ
                        </span>
                    </div>
                ))}
            </div>

            {/* ZONE BOUTON TALKIE */}
            <div className="z-10 w-full max-w-[400px] flex flex-col items-center gap-4">

                <TalkieButton
                    onLog={addLog}
                    onUploadSuccess={handleNewVoiceMessage}
                />

                <div className="font-mono text-[10px] text-cyan-400 uppercase tracking-[0.2em] h-4">
                    {logs[logs.length - 1]}
                </div>
            </div>
        </section>
    );
}