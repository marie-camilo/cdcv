"use client";
import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";

export default function SidePanel({ isOpen, onClose }) {
    const [codes, setCodes] = useState([]);
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && isOpen) {
            const storedCodes = JSON.parse(localStorage.getItem('game_codes') || '[]');
            setCodes(storedCodes);
        }
    }, [isMounted, isOpen]);

    if (!isMounted) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            {/* Panel */}
            <aside
                className={`fixed top-0 right-0 h-full w-80 bg-[var(--color-dark)] border-l-2 border-[var(--color-light-green)] z-50 transform transition-transform duration-300 ease-out p-6 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <h2 className="text-[var(--color-light-green)] font-bold text-lg tracking-widest uppercase">
                        // Données Piratées
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-[var(--color-light-green)] transition-colors">
                        <IoClose size={28} />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {codes.length === 0 ? (
                        <p className="text-white/30 italic text-sm text-center mt-10">
                            Aucune donnée interceptée...
                        </p>
                    ) : (
                        codes.map((item, index) => (
                            <div key={index} className="bg-black/40 p-4 rounded border border-[var(--color-medium)]">
                                <p className="text-[10px] text-[var(--color-light-green)] uppercase tracking-widest mb-1">
                                    {item.label}
                                </p>
                                <p className="text-white font-mono text-xl font-bold">
                                    {item.value}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-[10px] text-white/20 text-center font-mono">
                        SYSTÈME : INFILTRATION EN COURS
                    </p>
                </div>
            </aside>
        </>
    );
}