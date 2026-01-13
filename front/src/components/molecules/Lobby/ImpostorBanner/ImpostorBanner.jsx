"use client";

import styles from "./ImpostorBanner.module.css";
import clsx from "clsx";
import Text from "@/components/atoms/Text/Text";

export default function ImpostorBanner({ label, text1, text2, ps }) {
    return (
        <section className={clsx(styles.root)}>
          <span className={styles.label}>
            <Text
                variant="imposter-banner__label"
                text={label}
            />
          </span>

            <Text
                variant="imposter-banner__text"
                text={text1}
            />

            <Text
                variant="imposter-banner__text"
                text={text2}
            />

            <Text
                variant="imposter-banner__text_ps"
                text={ps}
            />
        </section>
    );
}
