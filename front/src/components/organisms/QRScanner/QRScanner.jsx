"use client";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import styles from "./QRScanner.module.css";
import clsx from "clsx";

export default function QRScanner({ onScanSuccess, label = "SCANNEZ LE CODE" }) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", {
            fps: 20,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
                const size = Math.min(viewfinderWidth, viewfinderHeight) * 0.7;
                return { width: size, height: size };
            },
            aspectRatio: 0.75
        });

        scanner.render(
            (decodedText) => {
                scanner.clear();
                onScanSuccess(decodedText);
            },
            (error) => { /* Scan continu */ }
        );

        const timer = setTimeout(() => {
            setIsReady(true);
        }, 800);

        return () => {
            clearTimeout(timer);
            scanner.clear().catch(err => console.error("Clean error", err));
        };
    }, [onScanSuccess]);

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <h1 className={styles.title}>{label}</h1>
            </div>

            <div className={styles.cameraContainer}>
                <div id="reader" className="w-full h-full"></div>

                {isReady && (
                    <>
                        <div className={clsx(styles.corner, styles.topLeft)} />
                        <div className={clsx(styles.corner, styles.topRight)} />
                        <div className={clsx(styles.corner, styles.bottomLeft)} />
                        <div className={clsx(styles.corner, styles.bottomRight)} />
                        <div className={styles.laser} />
                        <div className={styles.grid} />
                    </>
                )}
            </div>
        </div>
    );
}