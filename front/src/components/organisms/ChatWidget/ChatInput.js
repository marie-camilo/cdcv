import React, { useState } from 'react';
import { IoSend } from "react-icons/io5";

export default function ChatInput({ onSend, channel }) {
    const [value, setValue] = useState("");
    const isSaboteur = channel === 'saboteur';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onSend(value);
        setValue("");
    };

    return (
        <form onSubmit={handleSubmit} className={`p-3 bg-black/60 border-t flex gap-2 ${isSaboteur ? 'border-red-500/30' : 'border-[var(--color-light-green)]/30'}`}>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={isSaboteur ? "Message crypté aux saboteurs..." : "Écrire au QG..."}
                className="flex-1 bg-transparent text-white font-mono text-sm outline-none placeholder:text-white/20"
            />
            <button
                type="submit"
                disabled={!value.trim()}
                className={`${isSaboteur ? 'text-red-500' : 'text-[var(--color-light-green)]'} hover:text-white disabled:opacity-30 transition-colors`}
            >
                <IoSend size={18} />
            </button>
        </form>
    );
}