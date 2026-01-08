"use client";

import styles from "./LoadingIndicator.module.css";
import clsx from "clsx";

export default function LoadingIndicator({ fullscreen = false }) {
    return (
        <div
            className={clsx(
                styles.root,
                fullscreen && styles.fullscreen
            )}
        >
            <div className={styles.spinner} />
        </div>
    );
}
