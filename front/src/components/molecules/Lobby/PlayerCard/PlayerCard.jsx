"use client";

import styles from "./PlayerCard.module.css";
import Text from "@/components/atoms/Text/Text";
import clsx from "clsx";

export default function PlayerCard({ name, variant = "default" }) {
    const isEmpty = variant === "empty";

    return (
        <li
            className={clsx(
                styles.root,
                isEmpty && styles.empty
            )}
        >
          <span
              className={clsx(
                  styles.playerCardDot,
                  isEmpty && styles.playerCardDotEmpty
              )}
          />

            {isEmpty ? (
                <Text
                    variant="player-card__empty"
                    text="En attente d’un joueur…"
                />
            ) : (
                <Text
                    variant="player-card__name"
                    text={name}
                />
            )}
        </li>
    );
}
