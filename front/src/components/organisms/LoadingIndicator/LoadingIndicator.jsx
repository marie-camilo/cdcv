"use client";

import styles from "./LoadingIndicator.module.css";
import clsx from "clsx";
import Image from "next/image";

export default function LoadingIndicator({ fullscreen = true, isExiting = false }) {
    return (
        <div
            className={clsx(
                styles.root,
                fullscreen && styles.fullscreen,
                isExiting && styles.exit
            )}
        >
            <div className={styles.shutterTop} />
            <div className={styles.shutterBottom} />

            <div className={styles.content}>
                <div className={styles.logoWrapper}>
                    <Image
                        src="/chemise rouge.svg"
                        alt="Loading..."
                        width={140}
                        height={140}
                        className={styles.redShirt}
                        unoptimized
                    />
                </div>
            </div>
        </div>
    );
}