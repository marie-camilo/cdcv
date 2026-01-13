import React, { useState, useRef } from 'react';
import { uploadAudio } from "@/hooks/API/gameRequests"; // Vérifie bien le chemin relatif

const TalkieButton = ({ onLog, onUploadSuccess }) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = async (e) => {
        if (e.cancelable) e.preventDefault();

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';

            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) chunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: mimeType });

                // --- UTILISATION DE LA LOGIQUE DU GROUPE ---
                try {
                    const data = await uploadAudio(blob);
                    onLog("✅ TRANSMIS");
                    if (onUploadSuccess) onUploadSuccess(data.url);
                } catch (err) {
                    onLog("❌ ÉCHEC D'ENVOI");
                    console.error("Erreur Upload:", err);
                }
                // --------------------------------------------

                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            onLog("🎤 TRANSMISSION...");
        } catch (err) {
            onLog("❌ MICRO INTROUVABLE");
        }
    };

    const stopRecording = (e) => {
        if (e.cancelable) e.preventDefault();
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            onLog("🛑 SIGNAL COUPÉ. ENVOI...");
        }
    };

    return (
        <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            onContextMenu={(e) => e.preventDefault()}
            className={`w-32 h-32 rounded-full border-4 flex items-center justify-center text-center font-bold text-[10px] transition-all duration-200 shadow-lg ${
                isRecording
                    ? 'bg-red-600 border-red-400 scale-95 shadow-red-500/50 text-white'
                    : 'bg-cyan-900/40 border-cyan-500 text-cyan-400 hover:bg-cyan-800/60 shadow-cyan-500/20'
            }`}
        >
            {isRecording ? "RECHERCHE\nSIGNAL..." : "PUSH\nTO TALK"}
        </button>
    );
};

export default TalkieButton;