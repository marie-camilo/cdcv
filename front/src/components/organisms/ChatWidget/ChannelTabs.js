import React from 'react';

export default function ChannelTabs({ activeChannel, onSwitch }) {
    return (
        <div className="flex w-full border-b border-white/10">
            <button
                onClick={() => onSwitch('general')}
                className={`flex-1 py-2 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors
                    ${activeChannel === 'general'
                    ? 'bg-[var(--color-light-green)]/20 text-[var(--color-light-green)] border-b-2 border-[var(--color-light-green)]'
                    : 'text-white/30 hover:text-white hover:bg-white/5'}
                `}
            >
                Général
            </button>
            <button
                onClick={() => onSwitch('impostor')}
                className={`flex-1 py-2 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors
                    ${activeChannel === 'impostor'
                    ? 'bg-red-500/20 text-red-500 border-b-2 border-red-500'
                    : 'text-white/30 hover:text-red-400 hover:bg-red-500/5'}
                `}
            >
                /// Canal Rouge
            </button>
        </div>
    );
}