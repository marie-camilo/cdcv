"use client";

import styles from "./SectionTitle.module.css";
import clsx from "clsx";
import Title from "@/components/atoms/Text/Title";
import Subtitle from "@/components/atoms/Text/Subtitle";

export default function SectionTitle({variant, title, subtitle}) {
    return (
        <section
            className={clsx(
                styles[variant]
            )}
        >
            <Title title={title} variant={"lobby"}/>
            <Subtitle subtitle={subtitle} variant={"lobby"}/>
        </section>
    );
}
