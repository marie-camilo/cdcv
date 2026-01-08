"use client";

import styles from "./Navbar.module.css";
import PixelBorder from "@/components/atoms/PixelBorder";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import {useTimer} from "@/app/context/TimerContext";
import TimerDisplay from "@/components/atoms/TimerDisplay/TimerDisplay";

export default function Navbar() {
    const { simulateEnd } = useTimer();

    return (
        <nav className={styles.root}>
            <PixelBorder>
                <div className={styles.container}>
                    <div className={styles.left}>
                        <TimerDisplay className={styles.time} />
                        <span className={styles.name} onClick={simulateEnd}>Thomas</span>
                    </div>
                    <button className={styles.menuButton}>
                        <HiOutlineMenuAlt3 size={32} color="var(--color-white)" />
                    </button>
                </div>
            </PixelBorder>
        </nav>
    );
}