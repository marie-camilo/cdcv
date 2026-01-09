"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SectionTitle from "@/components/molecules/SectionTitle";
import Text from "@/components/atoms/Text/Text";

const TOTAL_DURATION = 11_000; // 10 secondes

export default function StartingPage() {
    const router = useRouter();

    const code = localStorage.getItem("currentGameCode");
    const t = localStorage.getItem("currentGameStartingAt");

    const [remaining, setRemaining] = useState(0);

    useEffect(() => {
        if (!t || !code) return;

        const startAtMs = Number(t) * 1000;

        const update = () => {
            const now = Date.now();
            const diff = TOTAL_DURATION - (now - startAtMs);

            if (diff <= 0) {
                router.replace(`/role`);
                return;
            }

            setRemaining(Math.ceil(diff / 1000));
        };

        update();
        const interval = setInterval(update, 200);

        return () => clearInterval(interval);
    }, [t, code, router]);

    return (
        <main
            className="h-screen flex flex-col items-center justify-center px-8 text-white bg-[var(--color-dark)] overflow-hidden">

            {/* Titre narratif */}
            <div className="mb-16 text-center space-y-4">
                <h1 className="text-3xl font-bold tracking-wide">
                    La partie va commencer
                </h1>
                <p className="text-white/70 text-sm">
                    Soyez discrets, vos rôles vont être distribués
                </p>
            </div>

            {/* Décompte */}
            <div className="relative flex items-center justify-center mb-20">
                {/* halo */}
                <div className="absolute w-48 h-48 rounded-full bg-[var(--color-light-green)]/10 blur-2xl"/>

                <span
                    className="relative text-[6rem] font-extrabold tracking-tight text-[var(--color-light-green)]"
                    style={{lineHeight: 1}}
                >
                    {remaining}
                </span>
            </div>

        </main>
    );
}
