"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Génère du bruit réaliste
const noise = (n = 5) => {
    const files = {};
    for (let i = 0; i < n; i++) {
        files[`data_${Math.random().toString(36).slice(2, 6)}.tmp`] = '[CORRUPTED]';
    }
    return files;
};

// Crée le système de fichiers basé sur les choix du jeu
const createFS = (labPath, boussPath, secretFolder) => {
    const isGoodPath = labPath === 'reactor_core_path' && boussPath === 'terminal_access_granted';
    const finalCode = isGoodPath ? '7412' : '0305';
    const endMessage = isGoodPath
        ? `[SYSTÈME]\n\nCode d'arrêt d'urgence: ${finalCode}\n\nEntrez ce code pour stopper le compte à rebours.`
        : `[ALERTE]\n\nProtocole compromis détecté.\nCode override: ${finalCode}\n\nLes imposteurs ont pris le contrôle.`;

    return {
        "mission_foyer_log": {
            ...noise(3),
            "readme.txt": "Secteur FOYER sécurisé.\nContinuez vers: [CORRUPTED]",
            "security_bypass_key": {
                ...noise(3),
                "status.log": "Puzzles validés.\nAccès radio débloqué.\nSuivant: [CORRUPTED]",
                "comm_relay_data": {
                    ...noise(3),
                    "transmission.txt": `Signal reçu du labyrinthe.\nDossier identifié: [CORRUPTED]`,
                    [labPath]: {
                        ...noise(3),
                        "coords.dat": `Coordonnées boussole validées.\nChemin: ${boussPath}/`,
                        [boussPath]: {
                            ...noise(4),
                            "hint.txt": `Dossier final à trouver.\nIndice: Le nom commence par '${secretFolder.slice(0, 3)}'...`,
                            // Vrai dossier secret
                            [secretFolder]: {
                                "code.txt": endMessage
                            },
                            // Faux dossiers pour brouiller
                            "archives": { ...noise(5), "empty.txt": "Rien ici." },
                            "backup": { ...noise(5), "old.txt": "Dossier obsolète." },
                            "temp": { ...noise(5), "null.txt": "Fichier vide." }
                        }
                    },
                    // Si mauvais chemin laby, l'autre existe aussi mais vide
                    ...(labPath === 'reactor_core_path' ? {
                        "shadow_ops_path": { "warning.txt": "⚠️ Chemin incorrect. Rebroussez." }
                    } : {
                        "reactor_core_path": { "warning.txt": "⚠️ Accès bloqué par sabotage." }
                    })
                }
            }
        },
        "help.txt": "Commandes: ls, cd, cat, pwd, clear\n\nCommencez par: cd mission_foyer_log"
    };
};

export default function EnigmeFinalePage() {
    const router = useRouter();
    const [input, setInput] = useState("");
    const [path, setPath] = useState([]);
    const [history, setHistory] = useState([]);
    const [ended, setEnded] = useState(false);
    const [fs, setFs] = useState(null);
    const endRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        // Récupérer les données du jeu
        const labCode = localStorage.getItem('final_folder_code') || 'REACTOR_CORE';
        const boussoleSabotaged = localStorage.getItem('boussole_sabotaged') === 'true';

        // Convertir en noms de dossiers
        const labPath = labCode === 'REACTOR_CORE' ? 'reactor_core_path' : 'shadow_ops_path';
        const boussPath = boussoleSabotaged ? 'terminal_compromised' : 'terminal_access_granted';

        // Dossier secret (les joueurs doivent le deviner via indices)
        const secretFolder = 'kernel_x64'; // Tu peux changer ce nom

        setFs(createFS(labPath, boussPath, secretFolder));

        setHistory([
            { t: 'sys', c: "╔═══════════════════════════════════════════════╗" },
            { t: 'sys', c: "║  TERMINAL v5.2 - MODE RÉCUPÉRATION            ║" },
            { t: 'sys', c: "╚═══════════════════════════════════════════════╝" },
            { t: 'sys', c: "" },
            { t: 'warn', c: "[!] Compte à rebours actif" },
            { t: 'warn', c: "[!] Trouvez code.txt pour l'arrêter" },
            { t: 'sys', c: "" },
            { t: 'sys', c: "Tapez: help" },
        ]);
    }, []);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);
    useEffect(() => { inputRef.current?.focus(); }, []);

    const getDir = (p) => p.reduce((o, k) => o?.[k], fs);

    const endGame = (win) => {
        setEnded(true);
        setHistory(h => [...h,
            { t: win ? 'success' : 'error', c: win
                    ? "\n✅ CODE 7412 ACCEPTÉ\nMISSION RÉUSSIE !"
                    : "\n❌ CODE 0305 DÉTECTÉ\nSABOTAGE CONFIRMÉ !"
            }
        ]);
        setTimeout(() => router.push(`/credits?status=${win ? 'success' : 'sabotage'}`), 3000);
    };

    const run = (e) => {
        e.preventDefault();
        if (ended || !fs) return;

        const cmd = input.trim();
        if (!cmd) return;

        const [c, ...a] = cmd.split(/\s+/);
        const arg = a.join(" ");
        const dir = getDir(path);
        const prompt = path.length ? `/${path.join('/')}` : '/';
        let out = [];

        switch (c) {
            case 'help':
                out = [{ t: 'sys', c: "ls, cd [dir], cd .., cat [file], pwd, clear" }];
                break;
            case 'pwd':
                out = [{ t: 'sys', c: prompt }];
                break;
            case 'ls':
                if (!dir) { out = [{ t: 'err', c: "Erreur" }]; break; }
                const items = Object.keys(dir).sort((a, b) => {
                    const ad = typeof dir[a] === 'object', bd = typeof dir[b] === 'object';
                    return ad === bd ? a.localeCompare(b) : ad ? -1 : 1;
                });
                out = [{ t: 'sys', c: items.map(i => typeof dir[i] === 'object' ? `📁 ${i}/` : `   ${i}`).join("\n") || "(vide)" }];
                break;
            case 'cd':
                if (!arg || arg === '~' || arg === '/') setPath([]);
                else if (arg === '..') { if (path.length) setPath(path.slice(0, -1)); }
                else if (arg.startsWith('/')) {
                    const p = arg.split('/').filter(Boolean);
                    if (p.reduce((o, k) => o?.[k], fs) && typeof p.reduce((o, k) => o?.[k], fs) === 'object') setPath(p);
                    else out = [{ t: 'err', c: `cd: ${arg}: introuvable` }];
                } else if (dir?.[arg] && typeof dir[arg] === 'object') setPath([...path, arg]);
                else out = [{ t: 'err', c: `cd: ${arg}: introuvable` }];
                break;
            case 'cat':
                if (!arg) out = [{ t: 'err', c: "cat: fichier manquant" }];
                else if (typeof dir?.[arg] === 'string') {
                    out = [{ t: 'file', c: dir[arg] }];
                    if (arg === 'code.txt') setTimeout(() => endGame(dir[arg].includes('7412')), 2000);
                } else out = [{ t: 'err', c: `cat: ${arg}: introuvable` }];
                break;
            case 'clear':
                setHistory([]); setInput(""); return;
            default:
                out = [{ t: 'err', c: `${c}: commande inconnue` }];
        }

        setHistory(h => [...h, { t: 'user', c: `$ ${cmd}` }, ...out]);
        setInput("");
    };

    const cls = t => ({ user: 'text-white font-bold', err: 'text-red-400', success: 'text-green-400 font-bold', warn: 'text-yellow-400', info: 'text-cyan-400', file: 'text-green-300 bg-green-900/30 p-2 rounded my-1' }[t] || 'text-green-400/80');

    if (!fs) return <main className="min-h-screen bg-black flex items-center justify-center"><span className="text-green-500 animate-pulse">Chargement...</span></main>;

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-2">
            <div className="w-full max-w-3xl h-[40vh] bg-zinc-950 border border-green-900/50 rounded flex flex-col font-mono text-xs">
                <div className="bg-green-900/20 px-3 py-1.5 flex justify-between border-b border-green-900/30">
                    <span className="text-green-500/60">terminal@station</span>
                    <span className={`w-2 h-2 rounded-full ${ended ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {history.map((h, i) => <div key={i} className={`whitespace-pre-wrap ${cls(h.t)}`}>{h.c}</div>)}
                    <div ref={endRef} />
                </div>
                <form onSubmit={run} className="p-3 bg-green-900/10 border-t border-green-900/30 flex gap-2">
                    <span className="text-green-600">$</span>
                    <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} disabled={ended} className="bg-transparent outline-none flex-1 text-white" autoFocus />
                </form>
            </div>
        </main>
    );
}