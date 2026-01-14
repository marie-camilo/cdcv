"use client";
import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from "react-icons/io5";
import ChannelTabs from "@/components/organisms/ChatWidget/ChannelTabs";
import ChatMessage from "@/components/organisms/ChatWidget/ChatMessage";
import ChatInput from "@/components/organisms/ChatWidget/ChatInput";

export default function ChatWidget({ isOpen, onClose, playerName, playerRole }) {
    // États
    const [activeChannel, setActiveChannel] = useState('general');
    const [messages, setMessages] = useState([
        { id: 1, sender: "System", text: "Connexion établie avec le QG des Chemises Vertes. Utilisez ce canal sécurisé pour solliciter une assistance tactique ou des indices en cas de blocage critique.", isSystem: true, channel: 'general' },
        { id: 2, sender: "Admin", text: "En attente de rapport, Agent.", isUser: false, channel: 'general' },
    ]);

    const messagesEndRef = useRef(null);

    // Vérifie si le joueur est un saboteur
    const isSaboteur = playerRole?.toLowerCase() === 'saboteur';

    // Auto-scroll
    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen, activeChannel]);

    // Reset du canal si le rôle change
    useEffect(() => {
        if (!isSaboteur) setActiveChannel('general');
    }, [isSaboteur]);

    // NOTE : On a retiré le "if (!isOpen) return null" pour permettre l'animation de fermeture

    // Filtrage des messages
    const currentMessages = messages.filter(m => m.channel === activeChannel);

    const handleSend = (text) => {
        const newMessage = {
            id: Date.now(),
            sender: playerName || "Agent",
            text: text,
            isUser: true,
            isSystem: false,
            channel: activeChannel
        };
        setMessages((prev) => [...prev, newMessage]);

        setTimeout(() => {
            const responseText = activeChannel === 'saboteur'
                ? "Reçu. Restez discret. La cible ne se doute de rien."
                : "Bien reçu Agent. Continuez.";

            setMessages((prev) => [...prev, {
                id: Date.now() + 1,
                sender: "Admin",
                text: responseText,
                isUser: false,
                isSystem: false,
                channel: activeChannel
            }]);
        }, 1000);
    };

    // Styles dynamiques
    const borderColor = activeChannel === 'saboteur' ? 'border-red-500' : 'border-[var(--color-light-green)]';
    const headerBg = activeChannel === 'saboteur' ? 'bg-red-500/10' : 'bg-[var(--color-light-green)]/10';
    const headerText = activeChannel === 'saboteur' ? 'text-red-500' : 'text-[var(--color-light-green)]';
    const dotColor = activeChannel === 'saboteur' ? 'bg-red-500' : 'bg-[var(--color-light-green)]';

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[1190] transition-opacity duration-300 
                ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            <div className={`fixed bottom-0 right-0 md:bottom-4 md:right-4 w-full md:w-96 h-[80vh] md:h-[600px] z-[1200] flex flex-col pointer-events-none transition-all duration-300 transform 
                ${isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>

                <div className={`flex-1 bg-[var(--color-dark)] border ${borderColor} shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col pointer-events-auto md:rounded-lg overflow-hidden backdrop-blur-md transition-colors duration-500`}>

                    {/* HEADER */}
                    <div className={`flex items-center justify-between p-3 border-b border-white/10 ${headerBg}`}>
                        <div className="flex items-center gap-2">
                            <span className={`font-mono font-bold text-sm tracking-widest uppercase ${headerText}`}>
                                {activeChannel === 'saboteur' ? 'MESSAGERIE SABOTEUR' : 'MESSAGERIE'}
                            </span>
                        </div>
                        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                            <IoClose size={20} />
                        </button>
                    </div>

                    {/* ONGLETS */}
                    {isSaboteur && (
                        <ChannelTabs activeChannel={activeChannel} onSwitch={setActiveChannel} />
                    )}

                    {/* MESSAGES */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-black/40">
                        {currentMessages.length === 0 ? (
                            <p className="text-white/20 text-center text-xs italic mt-4">Aucun message sur ce canal...</p>
                        ) : (
                            currentMessages.map((msg) => (
                                <ChatMessage key={msg.id} message={msg} />
                            ))
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