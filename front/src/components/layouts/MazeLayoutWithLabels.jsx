"use client";
import React from "react";
import styles from "./MazeLayoutWithLabels.module.css";

const MAZE_SIZE = 17;

const H_LABELS = Array.from(
    { length: MAZE_SIZE },
    (_, i) => String.fromCharCode(65 + i)
);

const V_LABELS = Array.from(
    { length: MAZE_SIZE },
    (_, i) => i + 1
);

export default function MazeLayoutWithLabels({ children }) {
    return (
        <div className={styles.container}>
            {/* Labels horizontaux */}
            <div className={styles.horizontalRow}>
                <div className={styles.corner} />
                {H_LABELS.map(label => (
                    <div key={label} className={styles.hLabel}>
                        {label}
                    </div>
                ))}
            </div>

            {/* Labels verticaux + maze */}
            <div className={styles.body}>
                <div className={styles.verticalColumn}>
                    {V_LABELS.map(label => (
                        <div key={label} className={styles.vLabel}>
                            {label}
                        </div>
                    ))}
                </div>

                {/* Maze injecté */}
                {children}
            </div>
        </div>
    );
}