"use client";
import React, { useEffect, useState } from "react";
import LoadingIndicator from "./LoadingIndicator";

export default function SplashScreen() {
    const [status, setStatus] = useState("visible");

    useEffect(() => {
        document.body.style.overflow = "hidden";

        const timerWait = setTimeout(() => {
            setStatus("exiting");
        }, 2000); // duréé affichage = 2s

        const timerRemove = setTimeout(() => {
            setStatus("hidden");
            document.body.style.overflow = "auto";
        }, 2800);

        return () => {
            clearTimeout(timerWait);
            clearTimeout(timerRemove);
            document.body.style.overflow = "auto";
        };
    }, []);

    if (status === "hidden") return null;

    return (
        <LoadingIndicator
            fullscreen
            isExiting={status === "exiting"}
        />
    );
}