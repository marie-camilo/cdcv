"use client";

import styles from "./NextButton.module.css";
import clsx from "clsx";
import { GoArrowRight } from "react-icons/go";


export default function NextButton({
                                       variant = "primary",
                                       disabled = false,
                                       ...props
                                   }) {
    return (
        <button
            className={clsx(
                styles.root,
                styles[variant],
                disabled && styles.disabled
            )}
            disabled={disabled}
            {...props}
        >
            <GoArrowRight/>
        </button>
    );
}
