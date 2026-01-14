"use client";
import React, { useState, useEffect, useRef } from 'react';
import MazeLayoutWithLabels from '@/components/layouts/MazeLayoutWithLabels';
import Maze from '@/components/organisms/Maze';
import styles from './page.module.css';
import {checkPlayerCookie, getCodeFromCookie} from "@/hooks/API/rules";
import {getAudioMessages, getPlayerRole} from "@/hooks/API/gameRequests";
import {useRouter} from "next/navigation";

// Logs à afficher progressivement
const LOGS_DATA = [
    { time: "14:32:01", type: "SYSTEM", msg: "BOOT COMPLETE", highlight: ["BOOT COMPLETE"] },
    { time: "14:32:03", type: "INFO", msg: "Loading maze configuration..." },
    { time: "14:32:05", type: "WARNING", msg: "Unauthorized access detected from IP 192.168.1.42", highlight: ["Unauthorized access", "192.168.1.42"] },
    { time: "14:32:07", type: "ALERT", msg: "Intrusion signature identified - User: Jacquot", highlight: ["Intrusion", "Jacquot"] },
    { time: "14:32:10", type: "SYSTEM", msg: "Defensive protocols engaged", highlight: ["Defensive protocols"] },
    { time: "14:32:12", type: "INFO", msg: "Creating decoy exit at EAST corridor", highlight: ["decoy exit", "EAST"] },
    { time: "14:32:15", type: "INFO", msg: "Emergency backup route initiated", highlight: ["Emergency backup route"] },
    { time: "14:32:18", type: "DEBUG", msg: "Executing /usr/bin/create_exit --direction=NORTH", highlight: ["NORTH"] },
    { time: "14:32:21", type: "SUCCESS", msg: "NORTH exit path successfully created", highlight: ["NORTH", "successfully"] },
    { time: "14:32:23", type: "INFO", msg: "Route integrity check: NORTH corridor OPERATIONAL", highlight: ["NORTH", "OPERATIONAL"] },
    { time: "14:32:26", type: "INFO", msg: "Tux_daemon monitoring NORTH exit - Status: ACTIVE", highlight: ["NORTH", "ACTIVE"] },
    { time: "14:32:29", type: "ERROR", msg: "EAST corridor access denied by Windows Firewall", highlight: ["EAST", "denied", "Windows"] },
    { time: "14:32:31", type: "WARNING", msg: "EAST route marked as COMPROMISED", highlight: ["EAST", "COMPROMISED"] },
    { time: "14:32:34", type: "INFO", msg: "Backup systems online - Primary: NORTH, Decoy: EAST", highlight: ["Primary: NORTH", "Decoy: EAST"] },
    { time: "14:32:37", type: "DEBUG", msg: "Maze state synchronized" },
    { time: "14:32:40", type: "INFO", msg: "All systems nominal - Safe passage available via NORTH", highlight: ["Safe passage", "NORTH"] },
    { time: "14:32:43", type: "NOTICE", msg: "Remember: Read The Fucking Manual - J.", highlight: ["Read The Fucking Manual"] },
    { time: "14:32:46", type: "SYSTEM", msg: "Process continues... monitoring active" },
    { time: "14:32:49", type: "DEBUG", msg: "Exit verification: NORTH=TRUE, EAST=FALSE", highlight: ["NORTH=TRUE", "EAST=FALSE"] },
    { time: "14:32:52", type: "INFO", msg: "Countdown timer initialized - Time remaining: 15:00" }
];

export default function TeamAPage() {
    const [lives, setLives] = useState(4);
    const [moveCount, setMoveCount] = useState(0);
    const [showLogs, setShowLogs] = useState(true); // Ouvert par défaut

    // State des logs persistant - reste même quand l'overlay est fermé
    const [displayedLogs, setDisplayedLogs] = useState([]);
    const [currentLogIndex, setCurrentLogIndex] = useState(0);

    const containerRef = useRef(null);
    const logsEndRef = useRef(null);

    const router = useRouter();

    useEffect(() => {

        const init = async () => {
            if (!localStorage.getItem("page459")) {
                localStorage.setItem('page459', 'guideur990');
            } else if (localStorage.getItem("page459") !== 'guideur990') {
                router.replace('/enigme-3/navigateur')
            }
        };

        init();
    }, []);

    useEffect(() => {
        document.title = "Énigme 3 - Équipe A | La Click";
    }, []);

    // Défilement des logs EN CONTINU (même quand overlay fermé)
    useEffect(() => {
        if (currentLogIndex >= LOGS_DATA.length) return;

        const timer = setTimeout(() => {
            setDisplayedLogs(prev => [...prev, LOGS_DATA[currentLogIndex]]);
            setCurrentLogIndex(prev => prev + 1);
        }, 600); // 600ms = plus rapide (au lieu de 1000ms)

        return () => clearTimeout(timer);
    }, [currentLogIndex]);

    // Auto-scroll quand l'overlay est ouvert
    useEffect(() => {
        if (showLogs && logsEndRef.current && containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [displayedLogs, showLogs]);

    const handleReset = () => {
        // Reset géré par le composant Maze
    };

    const toggleLogs = () => {
        setShowLogs(!showLogs);
    };

    // Fonction pour rendre le message avec highlights en bold
    const renderMessage = (msg, highlights = []) => {
        if (!highlights || highlights.length === 0) {
            return msg;
        }

        let parts = [msg];

        highlights.forEach(highlight => {
            const newParts = [];
            parts.forEach(part => {
                if (typeof part === 'string') {
                    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                    const splitParts = part.split(regex);
                    splitParts.forEach((p, i) => {
                        if (p.toLowerCase() === highlight.toLowerCase()) {
                            newParts.push(<strong key={`${highlight}-${i}`} className={styles.highlight}>{p}</strong>);
                        } else if (p) {
                            newParts.push(p);
                        }
                    });
                } else {
                    newParts.push(part);
                }
            });
            parts = newParts;
        });

        return parts;
    };

    // Style selon le type de log
    const getLogStyle = (type) => {
        const baseStyle = "inline-block px-2 py-1 font-mono text-sm";
        switch(type) {
            case 'ALERT': return `${baseStyle} text-orange-400 font-bold`;
            case 'ERROR': return `${baseStyle} text-red-500 font-bold`;
            case 'WARNING': return `${baseStyle} text-yellow-400`;
            case 'SUCCESS': return `${baseStyle} text-green-400 font-bold`;
            case 'DEBUG': return `${baseStyle} text-purple-400`;
            case 'NOTICE': return `${baseStyle} text-pink-400 font-bold`;
            default: return `${baseStyle} text-blue-400`;
        }
    };

    return (
        <section className={styles.pageContainer}>
            <div className={styles.mazeWrapper}>
                {/* Bouton Logs en haut à gauche */}
                <div className={styles.logsButtonContainer}>
                    <button onClick={toggleLogs} className={styles.logsButton}>
                        <span className={styles.logsIcon}></span>
                        <span>LOGS</span>
                    </button>
                </div>

                {/* Maze avec labels */}
                <MazeLayoutWithLabels>
                    <Maze
                        showSolution={false}
                        isPlayable={true}
                        minimalMode={false}
                        onLivesChange={setLives}
                        onMoveCountChange={setMoveCount}
                        onReset={handleReset}
                    />
                </MazeLayoutWithLabels>
            </div>

            {/* Overlay Terminal Logs - plein écran */}
            {showLogs && (
                <div className={styles.logsOverlay}>
                    <div className={styles.logsOverlayContent}>
                        <div className={styles.terminalContainer}>
                            {/* Header */}
                            <div className={styles.terminalHeader}>
                                <div className={styles.headerLeft}>
                                    <div className={styles.statusDot}></div>
                                    <span className={styles.headerTitle}>
                                        TERMINAL - SYSTÈME LABYRINTHE
                                    </span>
                                </div>
                                <button
                                    onClick={toggleLogs}
                                    className={styles.minimizeButton}
                                >
                                    [−] Minimize
                                </button>
                            </div>

                            {/* Logs container */}
                            <div
                                ref={containerRef}
                                className={styles.logsContainer}
                            >
                                {displayedLogs.map((log, idx) => (
                                    <div key={idx} className={styles.logLine}>
                                        <span className={styles.logTime}>[{log.time}]</span>
                                        <span className={getLogStyle(log.type)}>
                                            [{log.type}]
                                        </span>
                                        <span className={styles.logMessage}>
                                            {renderMessage(log.msg, log.highlight)}
                                        </span>
                                    </div>
                                ))}

                                {currentLogIndex < LOGS_DATA.length && (
                                    <div className={styles.cursor}>▊</div>
                                )}

                                <div ref={logsEndRef} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}