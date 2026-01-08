"use client";

import styles from "./Text.module.css";
import clsx from "clsx";

export default function SectionTitle({variant, text}) {
    return (
        <p
            className={clsx(
                styles[variant]
            )}
        >
            {text}
        </p>
    );
}
