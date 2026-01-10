"use client";
import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import styles from "./QRScanner.module.css";
import clsx from "clsx";

export default function QRScanner({ onScanSuccess, label = "SCANNEZ LE CODE" }) {
    const [isReady, setIsReady] = useState(false);
    const [cameras, setCameras] = useState([]);
    const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");
    const scannerRef = useRef(null);

    // 1. Récupération des caméras au montage
    useEffect(() => {
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                setCameras(devices);
                // Sélection automatique de la caméra arrière
                const backCameraIndex = devices.findIndex(device =>
                    device.label.toLowerCase().includes('back') ||
                    device.label.toLowerCase().includes('arrière') ||
                    device.label.toLowerCase().includes('environment')
                );
                setCurrentCameraIndex(backCameraIndex !== -1 ? backCameraIndex : 0);
            }
        }).catch(err => {
            console.error("Erreur caméras:", err);
            setErrorMsg("Impossible d'accéder aux caméras.");
        });
    }, []);

    // 2. Initialisation du scanner
    useEffect(() => {
        if (cameras.length === 0) return;

        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;

        const config = {
            fps: 15,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
                const size = Math.min(viewfinderWidth, viewfinderHeight) * 0.75;
                return { width: size, height: size };
            },
            aspectRatio: 1.0,
            experimentalFeatures: {
                useBarCodeDetectorIfSupported: true
            }
        };

        scanner.start(
            cameras[currentCameraIndex].id,
            config,
            (decodedText) => {
                // On envoie le résultat à la page parente (ScanPage)
                onScanSuccess(decodedText);

                // On arrête le scanner après un succès pour éviter les scans multiples
                if (scanner.isScanning) {
                    scanner.stop().catch(err => console.error(err));
                }
            },
            () => { /* Scan continu */ }
        ).then(() => {
            setTimeout(() => setIsReady(true), 800);
        }).catch(err => {
            setErrorMsg("Erreur lors du démarrage du flux vidéo.");
            console.error(err);
        });

        // Nettoyage à la fermeture de la page
        return () => {
            if (scanner.isScanning) {
                scanner.stop().catch(err => console.error(err));
            }
        };
    }, [cameras, currentCameraIndex, onScanSuccess]);

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <h1 className={styles.title}>{label}</h1>
                {errorMsg && (
                    <p className="text-red-500 text-xs font-mono mt-2">{errorMsg}</p>
                )}
            </div>

            <div className={styles.cameraContainer}>
                {/* L'élément où la vidéo s'affiche */}
                <div id="reader" className="w-full h-full"></div>

                {/* Interface visuelle (coins et laser) */}
                {isReady && (
                    <>
                        <div className={clsx(styles.corner, styles.topLeft)} />
                        <div className={clsx(styles.corner, styles.topRight)} />
                        <div className={clsx(styles.corner, styles.bottomLeft)} />
                        <div className={clsx(styles.corner, styles.bottomRight)} />
                        <div className={styles.laser} />
                    </>
                )}
            </div>

            {/* Petit bouton pour changer de caméra si nécessaire (utile sur certains Android) */}
            {cameras.length > 1 && (
                <button
                    onClick={() => setCurrentCameraIndex(prev => (prev + 1) % cameras.length)}
                    className="mt-4 text-green-400/50 text-[10px] font-mono border border-green-400/20 px-2 py-1 rounded"
                >
                    [ CHANGER DE CAMÉRA ]
                </button>
            )}
        </div>
    );
}