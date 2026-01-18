"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEnigma2State } from '@/hooks/API/useGameEvents';

export default function GamesLayout({ children }) {
    const pathname = usePathname();

    useEnigma2State();

    const isFleche = pathname.includes('/fleche');
    const topPosition = isFleche ? 'top-12' : 'top-6';

    return (
        <div className="relative min-h-screen w-full">
            <div
                className={`fixed ${topPosition} right-4`}
                style={{ zIndex: 9999 }}
            >
                <Link
                    href="/enigme-2"
                    className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-[#ff3333] text-[#ff3333] px-4 py-0.5 rounded-full font-mono text-sm hover:bg-[#ff3333] hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,51,51,0.3)]"
                >
                    <span className="text-lg">←</span>
                    <span className="hidden sm:inline">QUITTER LE TERMINAL</span>
                    <span className="sm:hidden">RETOUR</span>
                </Link>
            </div>
            <main className="h-full w-full">
                {children}
            </main>
        </div>
    );
}