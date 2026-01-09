"use client";

import React, { useState, useEffect } from 'react';
import styles from "./Navbar.module.css";
import PixelBorder from "@/components/atoms/PixelBorder";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useTimer } from "@/app/context/TimerContext";
import TimerDisplay from "@/components/atoms/TimerDisplay/TimerDisplay";
import SidePanel from "@/components/molecules/SidePanel/SidePanel";

export default function Navbar() {
    const { simulateEnd } = useTimer();
    const [playerName, setPlayerName] = useState("Agent");
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    useEffect(() => {
        const storedName = localStorage.getItem('currentPlayerName');
        if (storedName) {
            setPlayerName(storedName);
        }
    }, []);

    return (
        <>
            <nav className={styles.root}>
                <PixelBorder>
                    <div className={styles.container}>
                        <div className={styles.left}>
                            <TimerDisplay className={styles.time} />
                            <span className={styles.name}>
                                {playerName}
                            </span>
                        </div>

                        <button
                            className={styles.menuButton}
                            onClick={() => setIsPanelOpen(true)}
                        >
                            <HiOutlineMenuAlt3 size={32} color="var(--color-white)" />
                        </button>
                    </div>
                </PixelBorder>
            </nav>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
            />
        </>
    );
}