"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GamesLayout({ children }) {
    const pathname = usePathname();

    // On vérifie si l'URL contient '/fleche'
    const isFleche = pathname.includes('/fleche');

    // top-12 (48px) pour la flèche, top-8 (32px) pour tous les autres (y compris snake)
    const topPosition = isFleche ? 'top-12' : 'top-6';

    return (
        <div className="relative min-h-screen w-full">
            {/* Bouton de retour */}
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

            {/* Conteneur du jeu */}
            <main className="h-full w-full">
                {children}
            </main>
        </div>
    );
}