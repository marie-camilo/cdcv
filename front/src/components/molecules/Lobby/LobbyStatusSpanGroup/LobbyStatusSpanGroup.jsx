"use client";

import styles from "./LobbyStatusSpanGroup.module.css";
import Text from "@/components/atoms/Text/Text";
import clsx from "clsx";

export default function LobbyStatusSpanGroup({current, count}) {
    return (
        <span
            className={clsx(
                styles.root
            )}>
            <Text
                variant={"lobby-status__count"}
                text={current}
            />
            <Text variant={"lobby-status__max"} text={"/"}/>
            <Text
                variant={"lobby-status__max"}
                text={count}
            />
        </span>
    );
}
