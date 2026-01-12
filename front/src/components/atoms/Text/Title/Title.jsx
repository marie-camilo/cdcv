"use client";

import styles from "./Title.module.css";
import clsx from "clsx";

export default function Title({variant,title}) {
    return (
        <h1
            className={clsx(
                styles[variant],
            )}
        >
            {title}
        </h1>
    );
}
