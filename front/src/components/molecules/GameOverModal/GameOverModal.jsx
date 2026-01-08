"use client";

import styles from "./GameOverModal.module.css";
import {useTimer} from "@/app/context/TimerContext";

export default function GameOverModal() {
    const { isFinished } = useTimer();

    // Si le timer n'est pas fini, on n'affiche rien
    if (!isFinished) return null;

    const handleRestart = () => {
        window.location.reload();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>TEMPS ÉCOULÉ</h2>
                <p className={styles.message}>
                    L'énigme s'est refermée. Vous avez été piégé dans le système.
                </p>

                <button
                    className={styles.pixelButton}
                    onClick={handleRestart}
                >
                    <span className={styles.buttonText}>RÉESSAYER</span>
                </button>
            </div>
        </div>
    );
}