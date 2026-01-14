import React from 'react';

export default function ChatMessage({ message }) {
    const { sender, text, isUser, isSystem, channel } = message;

    // Définition des couleurs selon le canal
    const isSaboteurChannel = channel === 'saboteur';
    const themeColor = isSaboteurChannel ? 'text-red-500 border-red-500' : 'text-[var(--color-light-green)] border-[var(--color-light-green)]';
    const bgColor = isSaboteurChannel ? 'bg-red-500/20' : 'bg-[var(--color-light-green)]/20';

    if (isSystem) {
        return (
            <div className={`text-xs italic opacity-70 border-b pb-1 w-full text-left my-2 ${isSaboteurChannel ? 'text-red-400 border-red-500/20' : 'text-[var(--color-light-green)] border-[var(--color-light-green)]/20'}`}>
                {text}
            </div>
        );
    }

    return (
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-3`}>
            <span className={`text-[9px] uppercase mb-1 opacity-50 font-mono tracking-wider ${isUser ? 'text-right' : 'text-left'}`}>
                {sender}
            </span>
            <div className={`max-w-[85%] px-3 py-2 rounded text-sm break-words font-mono border
                ${isUser
                ? `${bgColor} text-white ${themeColor.split(' ')[1]}/30 rounded-tr-none`
                : 'bg-white/10 text-white border-white/10 rounded-tl-none'}
            `}>
                {text}
            </div>
        </div>
    );
}