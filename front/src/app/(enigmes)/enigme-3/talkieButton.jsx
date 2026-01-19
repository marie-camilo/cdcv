import React, { useState, useRef } from "react";
import { uploadAudio } from "@/hooks/API/gameRequests";

const TalkieButton = ({ onLog, onUploadSuccess }) => {
    const [isRecording, setIsRecording] = useState(false);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const streamRef = useRef(null);
    const isStartingRef = useRef(false);

    const startRecording = async (e) => {
        if (e?.cancelable) e.preventDefault();
        if (isRecording || isStartingRef.current) return;
        isStartingRef.current = true;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";
            const recorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
            };

            recorder.onerror = () => onLog?.("ERREUR ENREGISTREMENT");

            recorder.onstop = async () => {
                try {
                    const blob = new Blob(chunksRef.current, { type: mimeType });
                    if (!blob || blob.size === 0) {
                        onLog?.("AUDIO VIDE");
                        return;
                    }

                    onLog?.("📡 ENVOI EN COURS...");
                    const data = await uploadAudio(blob);

                    onLog?.("TRANSMIS");
                    onUploadSuccess?.({
                        id: data.id,
                        url: data.url,
                        senderPlayerId: data.senderPlayerId,
                        createdAt: data.createdAt,
                        filename: data.filename,
                    });
                } catch (err) {
                    onLog("ÉCHEC D'ENVOI");
                    console.error("UPLOAD ERROR:", err);
                } finally {
                    if (streamRef.current) {
                        streamRef.current.getTracks().forEach((t) => t.stop());
                        streamRef.current = null;
                    }
                }
            };

            recorder.start(250);
            setIsRecording(true);
            onLog?.("● ENREGISTREMENT...");
        } catch (err) {
            console.error("Micro error:", err);
            onLog?.("MICRO NON DÉTECTÉ");
        } finally {
            isStartingRef.current = false;
        }
    };

    const stopRecording = (e) => {
        if (e?.cancelable) e.preventDefault();
        if (!mediaRecorderRef.current || !isRecording) return;

        try {
            onLog?.("SIGNAL COUPÉ. TRAITEMENT...");
            mediaRecorderRef.current.stop();
        } catch (err) {
            console.error("stop error:", err);
        } finally {
            setIsRecording(false);
        }
    };

    return (
        <button
            onPointerDown={startRecording}
            onPointerUp={stopRecording}
            onPointerCancel={stopRecording}
            onContextMenu={(e) => e.preventDefault()}
            className={`
                w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center text-center 
                font-bold text-xs transition-all duration-150 select-none touch-none
                shadow-[0_0_30px_rgba(0,0,0,0.5)]
                ${isRecording
                ? "bg-[var(--color-red)] border-[var(--color-sand)] scale-95 shadow-[0_0_30px_rgba(173,11,22,0.8)] text-white animate-pulse"
                : "bg-[var(--color-mid-red)] border-[var(--color-mat-red)] text-[var(--color-sand)] hover:bg-[var(--color-mid-red)]/80 hover:scale-105 active:scale-95"
            }
            `}
        >
            {isRecording ? (
                <>
                    <span className="text-2xl mb-1">●</span>
                    <span>RELÂCHER<br/>POUR ENVOYER</span>
                </>
            ) : (
                <>
                    <span className="text-2xl mb-1 opacity-80">🎙️</span>
                    <span>MAINTENIR<br/>POUR PARLER</span>
                </>
            )}
        </button>
    );
};

export default TalkieButton;