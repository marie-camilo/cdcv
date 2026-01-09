"use client";

import styles from "./Subtitle.module.css";
import clsx from "clsx";

export default function Subtitle({variant,subtitle}) {
    return (
        <p
            className={clsx(
                styles[variant],
            )}
        >
            {subtitle}
        </p>
    );
}
