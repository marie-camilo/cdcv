"use client";
import React, { useState, useRef } from 'react';

export default function TalkieButton({ onLog }) {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mimeType = MediaRecorder.isTypeSupported('audio/wav') ? 'audio/wav' : 'audio/webm';

            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);

            mediaRecorderRef.current.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: mimeType });
                const formData = new FormData();
                formData.append("audio", blob, "talkie.wav");

                onLog("ENVOI DU SIGNAL...");

                try {
                    const res = await fetch("https://clic.pro/sae501/groupe3/tw/recepteur.php", {
                        method: "POST",
                        body: formData
                    });
                    const filename = await res.text();
                    onLog(`TRANSMISSION REÇUE : ${filename}`);
                } catch (err) {
                    onLog("ERREUR DE TRANSMISSION");
                }
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            onLog("TRANSMISSION EN COURS...");
        } catch (err) {
            onLog("MICRO INTROUVABLE");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                isRecording
                    ? "bg-[var(--color-classic-red)] border-white scale-90 shadow-[0_0_20px_var(--color-classic-red)]"
                    : "bg-transparent border-[var(--color-light-green)] shadow-[0_0_10px_var(--color-light-green)]"
            }`}
        >
            <div className={`text-3xl ${isRecording ? "animate-pulse" : ""}`}>
                🎙️
            </div>
        </button>
    );
}