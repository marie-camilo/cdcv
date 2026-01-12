'use client';

import { useState, useEffect, useRef } from 'react';
import { echo } from '@/services/echo';
import { talkieApi } from '@/services/talkieApi';
import styles from './TalkieWalkie.module.css';

export default function TalkieWalkie({ roomCode }) {
  const [showPopup, setShowPopup] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isSomeoneSpeaking, setIsSomeoneSpeaking] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(roomCode || null);

  const mediaStreamRef = useRef(null);

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

  // Rejoindre la room
  useEffect(() => {
    if (!currentRoom) return;

    // Rejoindre via l'API
    talkieApi.joinRoom(currentRoom).then(response => {
      console.log('✓ Connecté à la room:', response);
    });

    // Écouter les events WebSocket
    echo.channel(`talkie-room.${currentRoom}`)
        .listen('.user-speaking', (e) => {
          console.log('Event reçu:', e);
          setIsSomeoneSpeaking(e.data.is_speaking);
        });

    return () => {
      echo.leaveChannel(`talkie-room.${currentRoom}`);
    };
  }, [currentRoom]);

  // Démarrer l'enregistrement (PTT)
  const startRecording = async () => {
    if (isRecording) return;

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

    // Notifier les autres via l'API
    if (currentRoom) {
      talkieApi.notifySpeaking(currentRoom, true);
    }
  };

  // Arrêter l'enregistrement (relâcher le bouton)
  const stopRecording = () => {
    if (!isRecording) return;

    setIsRecording(false);

    // Désactiver le micro
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = false;
      });
    }

    // Notifier les autres via l'API
    if (currentRoom) {
      talkieApi.notifySpeaking(currentRoom, false);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
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
                  Utilisez le talkie-walkie pour communiquer<br />
                  <strong>Maintenez le bouton pour parler</strong>
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
              className={styles.pttButton}
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className={styles.micIcon}>
              <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>
        </div>
      </>
  );
}