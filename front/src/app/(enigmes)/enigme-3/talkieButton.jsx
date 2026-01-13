import React, { useState, useRef } from "react";
import { uploadAudio } from "@/hooks/API/gameRequests";

const TalkieButton = ({ onLog, onUploadSuccess }) => {
    const [isRecording, setIsRecording] = useState(false);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const streamRef = useRef(null);

    // évite double déclenchement (touch + mouse)
    const isStartingRef = useRef(false);

    const startRecording = async (e) => {
        if (e?.cancelable) e.preventDefault();

        // déjà en enregistrement → on ignore
        if (isRecording || isStartingRef.current) return;
        isStartingRef.current = true;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mimeType = MediaRecorder.isTypeSupported("audio/webm")
                ? "audio/webm"
                : "audio/ogg";

            const recorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            recorder.onerror = (event) => {
                console.error("MediaRecorder error:", event?.error);
                onLog?.("ERREUR ENREGISTREMENT");
            };

            recorder.onstop = async () => {
                try {
                    const blob = new Blob(chunksRef.current, { type: mimeType });

                    console.log("AUDIO DEBUG", {
                        blobSize: blob.size,
                        blobType: blob.type,
                        chunks: chunksRef.current.length,
                    });

                    // stop si blob vide
                    if (!blob || blob.size === 0) {
                        onLog?.("AUDIO VIDE");
                        return;
                    }

                    onLog?.("📡 ENVOI...");

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

                    console.log("UPLOAD ERROR DEBUG", {
                        message: err?.message,
                        status: err?.status,
                        data: err?.data,
                    });

                    console.error("UPLOAD ERROR FULL:", err);
                } finally {
                    // coupe le micro
                    if (streamRef.current) {
                        streamRef.current.getTracks().forEach((t) => t.stop());
                        streamRef.current = null;
                    }
                }
            };

            // timeslice : force l’émission de dataavailable régulièrement
            recorder.start(250);

            setIsRecording(true);
            onLog?.("TRANSMISSION...");
        } catch (err) {
            console.error("getUserMedia error:", err);
            onLog?.("MICRO INTROUVABLE");
        } finally {
            isStartingRef.current = false;
        }
    };

    const stopRecording = (e) => {
        if (e?.cancelable) e.preventDefault();

        if (!mediaRecorderRef.current || !isRecording) return;

        try {
            onLog?.("SIGNAL COUPÉ. ENVOI...");
            mediaRecorderRef.current.stop();
        } catch (err) {
            console.error("stop recording error:", err);
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
            className={`w-32 h-32 rounded-full border-4 flex items-center justify-center text-center font-bold text-[10px] transition-all duration-200 shadow-lg ${
                isRecording
                    ? "bg-red-600 border-red-400 scale-95 shadow-red-500/50 text-white"
                    : "bg-cyan-900/40 border-cyan-500 text-cyan-400 hover:bg-cyan-800/60 shadow-cyan-500/20"
            }`}
        >
            {isRecording ? "RECHERCHE\nSIGNAL..." : "PUSH\nTO TALK"}
        </button>
    );
};

export default TalkieButton;
