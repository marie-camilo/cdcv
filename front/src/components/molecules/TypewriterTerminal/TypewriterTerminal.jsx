"use client";
import { useState, useEffect } from "react";
import styles from "./TypewriterTerminal.module.css";

export default function TypewriterTerminal({ textLines, speed = 50 }) {
    const [displayedLines, setDisplayedLines] = useState([]);
    const [currentLineIdx, setCurrentLineIdx] = useState(0);
    const [currentCharIdx, setCurrentCharIdx] = useState(0);

    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        if (isMinimized) return;

        if (currentLineIdx < textLines.length) {
            const currentLineText = textLines[currentLineIdx];
            if (currentCharIdx < currentLineText.length) {
                const timeout = setTimeout(() => {
                    setDisplayedLines((prev) => {
                        const newLines = [...prev];
                        if (!newLines[currentLineIdx]) newLines[currentLineIdx] = "";
                        newLines[currentLineIdx] = currentLineText.substring(0, currentCharIdx + 1);
                        return newLines;
                    });
                    setCurrentCharIdx((prev) => prev + 1);
                }, speed);
                return () => clearTimeout(timeout);
            } else {
                const lineTimeout = setTimeout(() => {
                    setCurrentLineIdx((prev) => prev + 1);
                    setCurrentCharIdx(0);
                }, 500);
                return () => clearTimeout(lineTimeout);
            }
        }
    }, [currentLineIdx, currentCharIdx, textLines, speed, isMinimized]);

    const toggleMinimize = () => setIsMinimized(!isMinimized);

    return (
        <div className={styles.container}>
            <div className={`${styles.terminal} ${isMinimized ? styles.minimized : ""}`}>
                <div className={styles.header} onClick={toggleMinimize} style={{ cursor: 'pointer' }}>
                    <div className={styles.buttons}>
                        <button className={`${styles.dot} ${styles.close}`} onClick={toggleMinimize}></button>
                        <button className={`${styles.dot} ${styles.minimize}`} onClick={toggleMinimize}></button>
                        <button className={`${styles.dot} ${styles.maximize}`}></button>
                    </div>
                    <div className={styles.title}>bash — root@jacquot</div>
                </div>

                <div className={styles.body}>
                    {displayedLines.map((line, index) => (
                        <p key={index} className={styles.line}>
                            <span className={styles.prompt}>$</span> {line}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}