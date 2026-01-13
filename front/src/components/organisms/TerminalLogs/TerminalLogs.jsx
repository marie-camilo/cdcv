'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './TerminalLogs.module.css';

// Logs à afficher progressivement
const LOGS_DATA = [
  { time: "14:32:01", type: "SYSTEM", msg: "BOOT COMPLETE" },
  { time: "14:32:03", type: "INFO", msg: "Loading maze configuration..." },
  { time: "14:32:05", type: "WARNING", msg: "Unauthorized access detected from IP 192.168.1.42" },
  { time: "14:32:07", type: "ALERT", msg: "Intrusion signature identified - User: Jacquot" },
  { time: "14:32:10", type: "SYSTEM", msg: "Defensive protocols engaged" },
  { time: "14:32:12", type: "INFO", msg: "Creating decoy exit at EAST corridor" },
  { time: "14:32:15", type: "INFO", msg: "Emergency backup route initiated" },
  { time: "14:32:18", type: "DEBUG", msg: "Executing /usr/bin/create_exit --direction=NORTH" },
  { time: "14:32:21", type: "SUCCESS", msg: "NORTH exit path successfully created" },
  { time: "14:32:23", type: "INFO", msg: "Route integrity check: NORTH corridor OPERATIONAL" },
  { time: "14:32:26", type: "INFO", msg: "Tux_daemon monitoring NORTH exit - Status: ACTIVE" },
  { time: "14:32:29", type: "ERROR", msg: "EAST corridor access denied by Windows Firewall" },
  { time: "14:32:31", type: "WARNING", msg: "EAST route marked as COMPROMISED" },
  { time: "14:32:34", type: "INFO", msg: "Backup systems online - Primary: NORTH, Decoy: EAST" },
  { time: "14:32:37", type: "DEBUG", msg: "Maze state synchronized" },
  { time: "14:32:40", type: "INFO", msg: "All systems nominal - Safe passage available via NORTH" },
  { time: "14:32:43", type: "NOTICE", msg: "Remember: Read The Fucking Manual - J." },
  { time: "14:32:46", type: "SYSTEM", msg: "Process continues... monitoring active" },
  { time: "14:32:49", type: "DEBUG", msg: "Exit verification: NORTH=TRUE, EAST=FALSE" },
  { time: "14:32:52", type: "INFO", msg: "Countdown timer initialized - Time remaining: 15:00" }
];

export default function TerminalLogs({ 
  minimizable = true, 
  onMinimize,
  // Props pour la persistance du state
  displayedLogs: externalDisplayedLogs,
  setDisplayedLogs: externalSetDisplayedLogs,
  currentIndex: externalCurrentIndex,
  setCurrentIndex: externalSetCurrentIndex
}) {
  // Utiliser le state externe si fourni, sinon utiliser un state interne (fallback)
  const [internalDisplayedLogs, setInternalDisplayedLogs] = useState([]);
  const [internalCurrentIndex, setInternalCurrentIndex] = useState(0);

  // Choisir quel state utiliser
  const displayedLogs = externalDisplayedLogs !== undefined ? externalDisplayedLogs : internalDisplayedLogs;
  const setDisplayedLogs = externalSetDisplayedLogs || setInternalDisplayedLogs;
  const currentIndex = externalCurrentIndex !== undefined ? externalCurrentIndex : internalCurrentIndex;
  const setCurrentIndex = externalSetCurrentIndex || setInternalCurrentIndex;

  const containerRef = useRef(null);
  const logsEndRef = useRef(null);

  // Défilement progressif des logs (1 ligne par seconde)
  // Ce useEffect tourne EN CONTINU, même quand le composant n'est pas affiché
  useEffect(() => {
    if (currentIndex >= LOGS_DATA.length) return;

    const timer = setTimeout(() => {
      setDisplayedLogs(prev => [...prev, LOGS_DATA[currentIndex]]);
      setCurrentIndex(prev => prev + 1);
    }, 1000); // 1 seconde entre chaque ligne

    return () => clearTimeout(timer);
  }, [currentIndex, setDisplayedLogs, setCurrentIndex]);

  // Auto-scroll vers le bas UNIQUEMENT dans le container du terminal
  useEffect(() => {
    if (logsEndRef.current && containerRef.current) {
      // Utiliser scrollTop au lieu de scrollIntoView pour éviter le scroll de page
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedLogs]);

  // Handle minimize
  const handleMinimize = () => {
    if (onMinimize) onMinimize();
  };

  // Style selon le type de log
  const getLogStyle = (type) => {
    switch(type) {
      case 'ALERT': return styles.logAlert;
      case 'ERROR': return styles.logError;
      case 'WARNING': return styles.logWarning;
      case 'SUCCESS': return styles.logSuccess;
      case 'DEBUG': return styles.logDebug;
      case 'NOTICE': return styles.logNotice;
      default: return styles.logInfo;
    }
  };

  return (
      <div className={styles.terminalContainer}>
        {/* Header */}
        <div className={styles.terminalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.statusDot}></div>
            <span className={styles.headerTitle}>
            🖥️ TERMINAL - SYSTÈME LABYRINTHE
          </span>
          </div>
          {minimizable && (
              <button
                  onClick={handleMinimize}
                  className={styles.minimizeButton}
              >
                [−] Minimize
              </button>
          )}
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
                <span className={styles.logMessage}>{log.msg}</span>
              </div>
          ))}

          {currentIndex < LOGS_DATA.length && (
              <div className={styles.cursor}>▊</div>
          )}

          <div ref={logsEndRef} />
        </div>
      </div>
  );
}
