'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './TalkieWalkie.module.css';

export default function TalkieWalkie() {
  const [showPopup, setShowPopup] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isSomeoneSpeaking, setIsSomeoneSpeaking] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(360); // 6 minutes
  
  const mediaStreamRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Formater le temps MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialiser le microphone
  const initMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      mediaStreamRef.current = stream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = false;
      });
      return true;
    } catch (err) {
      console.error('Erreur micro:', err);
      return false;
    }
  };

  // Démarrer l'enregistrement (PTT)
  const startRecording = async () => {
    if (timeRemaining <= 0 || isRecording) return;
    
    if (!mediaStreamRef.current) {
      await initMicrophone();
    }
    
    setIsRecording(true);
    
    // Activer le micro
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = true;
      });
    }

    // Décrémenter le timer chaque seconde PENDANT qu'on maintient le bouton
    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = Math.max(0, prev - 1);
        if (newTime === 0) {
          stopRecording();
        }
        return newTime;
      });
    }, 1000);
  };

  // Arrêter l'enregistrement (relâcher le bouton)
  const stopRecording = () => {
    if (!isRecording) return;
    
    setIsRecording(false);
    
    // Arrêter le timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    // Désactiver le micro
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = false;
      });
    }
  };

  // Simuler quelqu'un qui parle (pour tester l'indicateur)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsSomeoneSpeaking(true);
        setTimeout(() => setIsSomeoneSpeaking(false), 2000);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Popup d'avertissement */}
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h2 className={styles.popupTitle}>ATTENTION</h2>
            <p className={styles.popupText}>
              Votre temps de discussion sera limité<br />
              <strong>soyez vigilant</strong>
            </p>
            <button 
              onClick={() => setShowPopup(false)}
              className={styles.popupButton}
            >
              Compris
            </button>
          </div>
        </div>
      )}

      <div className={styles.container}>
        {/* Indicateur rouge quand quelqu'un parle */}
        <div className={`${styles.speakingIndicator} ${(isSomeoneSpeaking || isRecording) ? styles.speaking : ''}`} />

        {/* Bouton principal */}
        <button 
          className={`${styles.pttButton} ${timeRemaining <= 0 ? styles.pttDisabled : ''}`}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          disabled={timeRemaining <= 0}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className={styles.micIcon}>
            <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </button>

        {/* Timer en bas */}
        <div className={styles.timer}>
          {formatTime(timeRemaining)}
        </div>
      </div>
    </>
  );
}
