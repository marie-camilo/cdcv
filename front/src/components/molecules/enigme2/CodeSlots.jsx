"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoLockClosed } from "react-icons/io5";

export default function CodeSlots({ digits }) {
    const games = ['motus', 'simon', 'zip', 'tuile'];

    return (
        <article className="grid grid-cols-4 gap-4 px-2 mt-4">
            {games.map((game) => (
                <Link
                    key={game}
                    href={`/enigme-2/${game}`}
                    className="relative aspect-square flex items-center justify-center rounded-md transition-transform hover:scale-105 group"
                >
                    <Image
                        src="/casier.svg"
                        alt="Module Slot"
                        fill
                        className="object-contain bg-gray-800"
                    />

                    <div className="z-10 flex items-center justify-center w-full h-full pb-1">
                        {digits[game] !== null ? (
                            <span className="text-[var(--color-light-green)] font-mono text-3xl font-bold drop-shadow-[0_0_5px_rgba(0,255,0,0.8)]">
                                {digits[game]}
                            </span>
                        ) : (
                            <span className="text-white/30 group-hover:text-[var(--color-classic-red)] transition-colors drop-shadow-md">
                                <IoLockClosed size={22} />
                            </span>
                        )}
                    </div>
                </Link>
            ))}
        </article>
    );
}