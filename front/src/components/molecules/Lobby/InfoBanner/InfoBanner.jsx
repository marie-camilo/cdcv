"use client";

import styles from "./InfoBanner.module.css";
import clsx from "clsx";
import Text from "@/components/atoms/Text/Text";

export default function InfoBanner({ label, text }) {
    return (
        <section className={clsx(styles.root)}>
          <span className={styles.label}>
            <Text
                variant="info-banner__label"
                text={label}
            />
          </span>

            <Text
                variant="info-banner__text"
                text={text}
            />
        </section>
    );
}
