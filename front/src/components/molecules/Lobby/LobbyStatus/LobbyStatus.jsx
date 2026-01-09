"use client";

import styles from "./LobbyStatus.module.css";
import Text from "@/components/atoms/Text/Text";
import clsx from "clsx";
import LobbyStatusSpanGroup from "@/components/molecules/Lobby/LobbyStatusSpanGroup";

export default function LobbyStatus({label, current, count}) {
    return (
        <section
            className={clsx(
                styles.root
            )}
        >
            <div className={
                clsx(
                    styles.lobbyStatusHeader
                )}
            >
                <Text variant={"lobby-status__label"} text={label}/>
                <LobbyStatusSpanGroup current={current} count={count}/>
            </div>
        </section>
    );
}
