"use client";

import styles from "./GameCodeCard.module.css";
import Text from "@/components/atoms/Text/Text";
import clsx from "clsx";

export default function GameCodeCard({variant, label, code}) {
    return (
        <section
            className={clsx(
                styles[variant]
            )}
        >
            <Text variant={"game-code__label"} text={label}/>
            <Text variant={"game-code__value"} text={code}/>
        </section>
    );
}
