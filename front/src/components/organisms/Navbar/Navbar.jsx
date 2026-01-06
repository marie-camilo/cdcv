"use client";

import styles from "./Navbar.module.css";
import PixelBorder from "@/components/atoms/PixelBorder";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import {useTimer} from "@/app/context/TimerContext";

export default function Navbar() {
    const { seconds, simulateEnd } = useTimer();

    // formatage
    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        return `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <nav className={styles.root}>
            <PixelBorder>
                <div className={styles.container}>
                    <div className={styles.left}>
                        <span
                            className={styles.time}
                            style={{ color: "var(--color-light-green)" }}
                        >
                            {formatTime(seconds)}
                        </span>
                        {/* Cliquer sur Thomas permet de tester la fin du timer immédiatement */}
                        <span
                            className={styles.name}
                            onClick={simulateEnd}
                            style={{ cursor: "help" }}
                        >
                            Thomas
                        </span>
                    </div>
                    <button className={styles.menuButton}>
                        <HiOutlineMenuAlt3 size={32} color="var(--color-white)" />
                    </button>
                </div>
            </PixelBorder>
        </nav>
    );
}