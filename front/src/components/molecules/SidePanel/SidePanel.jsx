"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoClose, IoConstruct } from "react-icons/io5";

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
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            <aside
                className={`fixed top-0 right-0 h-full w-80 bg-[var(--color-dark)] border-l-2 border-[var(--color-light-green)] z-50 transform transition-transform duration-300 ease-out p-6 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 shrink-0">
                    <h2 className="text-[var(--color-light-green)] font-bold text-lg tracking-widest uppercase">
                        // Données Piratées
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-[var(--color-light-green)] transition-colors">
                        <IoClose size={28} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2 custom-scrollbar">
                    {codes.length === 0 ? (
                        <p className="text-white/30 italic text-sm text-center mt-10">
                            Aucune donnée interceptée...
                        </p>
                    ) : (
                        codes.map((item, index) => (
                            <div key={index} className="bg-black/40 p-4 rounded border border-[var(--color-medium)] shrink-0">
                                <p className="text-[10px] text-[var(--color-light-green)] uppercase tracking-widest mb-1">
                                    {item.label}
                                </p>
                                <p className="text-white font-mono text-xl font-bold break-all">
                                    {item.value}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 shrink-0 flex flex-col gap-4">
                    <Link
                        href="/"
                        onClick={onClose}
                        className="group flex items-center justify-center gap-3 w-full py-3 bg-white/5 hover:bg-[var(--color-light-green)]/10 border border-white/10 hover:border-[var(--color-light-green)] rounded transition-all duration-300"
                    >
                        <IoConstruct size={20} className="text-white group-hover:text-[var(--color-light-green)] transition-colors" />
                        <span className="text-white font-mono text-sm font-bold tracking-wide group-hover:text-[var(--color-light-green)] transition-colors">
                            BOÎTE À OUTILS
                        </span>
                    </Link>
                </div>
            </aside>
        </>
    );
}