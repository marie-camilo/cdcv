"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- GÉNÉRATEUR DE CHAOS MASSIF ---
const generateMassiveNoise = (depth = 0) => {
    if (depth > 3) return {};
    const node = {};
    const extensions = ['.bak', '.tmp', '.sys', '.dat', '.conf', '.log'];
    const prefixes = ['sys_config', 'module_x86', 'kernel_data', 'cache_temp', 'process_ref', 'stack_dump'];

    // 15 fichiers par dossier
    for (let i = 0; i < 15; i++) {
        const fileName = `${prefixes[Math.floor(Math.random() * prefixes.length)]}_v${depth}.${i}${extensions[Math.floor(Math.random() * extensions.length)]}`;
        node[fileName] = `MEMORY_OFFSET: 0x${Math.random().toString(16).toUpperCase().slice(2, 8)}\nSTATUS: ACTIVE`;
    }

    // 5 sous-dossiers par dossier
    if (depth < 2) {
        const folderNames = ['system32', 'drivers', 'cache', 'logs', 'backup', 'security', 'env', 'share'];
        for (let i = 0; i < 5; i++) {
            const folderName = `${folderNames[Math.floor(Math.random() * folderNames.length)]}_0${i}`;
            node[folderName] = generateMassiveNoise(depth + 1);
        }
    }
    return node;
};

// --- CONSTRUCTION DE L'OS AVEC CHEMINS CAMOUFLÉS ---
const FILE_SYSTEM = {
    "bin": generateMassiveNoise(1),
    "etc": generateMassiveNoise(1),
    "var": generateMassiveNoise(1),
    "usr": generateMassiveNoise(1),
    "Foyer": {
        ...generateMassiveNoise(1),
        "Radio": {
            ...generateMassiveNoise(1),
            "Communication": {
                ...generateMassiveNoise(1),
                "FabRom64": {
                    "Linux": {
                        ...generateMassiveNoise(2),
                        // Le fichier clé est noyé dans la liste
                        "sys_config_v2.0.bak": "--- SECURE CORE ---\nIDENTITY: VERT\nSECURITY_CODE: 7412\nSTATUS: VERIFIED"
                    }
                }
            },
            "Developpement": {
                ...generateMassiveNoise(1),
                "AliGog29": {
                    "Linux": {
                        ...generateMassiveNoise(2),
                        // Même nom de fichier que le chemin vert
                        "sys_config_v2.0.bak": "--- SECURE CORE ---\nIDENTITY: SABOTEUR\nSECURITY_CODE: 0305\nSTATUS: OVERRIDE"
                    }
                }
            }
        }
    }
};

export default function EnigmeFinalePage() {
    const router = useRouter();
    const [input, setInput] = useState("");
    const [currentPath, setCurrentPath] = useState([]);
    const [history, setHistory] = useState([
        { type: 'sys', content: "BASH v5.2.15(1)-release (x86_64-pc-linux-gnu)" },
        { type: 'sys', content: "RECOVERY_MODE: ACTIVE // THREAT_LEVEL: HIGH" },
        { type: 'sys', content: "Type 'help' for commands list." }
    ]);
    const terminalEndRef = useRef(null);

    useEffect(() => { terminalEndRef.current?.scrollIntoView(); }, [history]);

    const getDir = (path) => path.reduce((obj, key) => obj && obj[key], FILE_SYSTEM);

    const handleStopGame = (isSuccess) => {
        const message = isSuccess
            ? "\n[OK] CODE 7412 ACCEPTÉ.\n[OK] ARRÊT DU COMPTE À REBOURS.\n[INFO] REDIRECTION VERS LES CRÉDITS..."
            : "\n[!] PROTOCOLE 0000 DÉTECTÉ.\n[!] ALERTE SABOTAGE ACTIVÉE.\n[INFO] FERMETURE DE LA SESSION...";

        setHistory(prev => [...prev, { type: 'sys', content: message }]);

        // Redirection après 3 secondes pour laisser lire le message
        setTimeout(() => {
            router.push('/credits');
        }, 1500000);
    };

    const handleCmd = (e) => {
        e.preventDefault();
        const full = input.trim();
        if (!full) return;
        const [cmd, ...args] = full.split(/\s+/);
        const target = args.join(" ");
        const dir = getDir(currentPath);
        let res = "";

        switch (cmd.toLowerCase()) {
            case "help": res = "Available: ls, cd [dir], cd .., cat [file], clear"; break;
            case "ls":
                const items = Object.keys(dir || {});
                res = items.length ? items.map(i => typeof dir[i] === 'object' ? `[DIR] ${i}` : i).join("\n") : "Total 0";
                break;
            case "cd":
                if (target === "..") { if (currentPath.length) setCurrentPath(currentPath.slice(0, -1)); }
                else if (dir[target] && typeof dir[target] === 'object') setCurrentPath([...currentPath, target]);
                else res = `cd: ${target}: No such file or directory`;
                break;
            case "cat":
                if (typeof dir[target] === 'string') {
                    res = dir[target];
                    // Si le joueur lit le fichier de fin
                    if (target === "sys_config_v2.0.bak") {
                        setTimeout(() => handleStopGame(res.includes("7412")), 1000);
                    }
                } else res = `cat: ${target}: Is a directory or unreadable`;
                break;
            case "clear": setHistory([]); setInput(""); return;
            default: res = `${cmd}: command not found`;
        }
        setHistory([...history, { type: 'user', content: `guest@root:~/${currentPath.join('/')}$ ${full}` }, { type: 'sys', content: res }]);
        setInput("");
    };

    return (
        <main className="min-h-screen bg-[#020202] flex items-center justify-center p-2 sm:p-4">
            <div className="w-full max-w-4xl h-[650px] bg-black border border-green-900/40 rounded-sm flex flex-col font-mono text-[10px] leading-tight shadow-inner overflow-hidden">
                {/* OS Bar */}
                <div className="bg-green-900/10 px-3 py-1.5 text-[9px] flex justify-between text-green-500/70 border-b border-green-900/20">
                    <span>STATION_TERMINAL_ROOT</span>
                    <span className="animate-pulse">● SESSION_ACTIVE</span>
                </div>

                {/* History */}
                <div className="flex-1 overflow-y-auto p-4 text-green-400/90 scrollbar-hide">
                    {history.map((h, i) => (
                        <div key={i} className={`mb-1.5 ${h.type === 'user' ? 'text-white font-bold' : 'whitespace-pre-wrap opacity-80 border-l border-green-900/30 pl-2'}`}>
                            {h.content}
                        </div>
                    ))}
                    <div ref={terminalEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleCmd} className="p-4 bg-zinc-900/20 border-t border-green-900/20 flex gap-2">
                    <span className="text-green-700 font-bold shrink-0">guest@root:~/${currentPath.join('/')}$</span>
                    <input autoFocus value={input} onChange={e => setInput(e.target.value)} className="bg-transparent outline-none flex-1 text-white border-none focus:ring-0 p-0" spellCheck="false" autoComplete="off" />
                </form>
            </div>
        </main>
    );
}