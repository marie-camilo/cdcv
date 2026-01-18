'use client';

import { usePathname } from 'next/navigation';
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { TimerProvider } from "@/app/context/TimerContext";
import Navbar from "@/components/organisms/Navbar/Navbar";
import SplashScreen from "@/components/organisms/LoadingIndicator/SplashScreen";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const GAME_ROUTES = [
    "/lobby",
    "/log",
    "/start",
    "/starting",
    "/role",
    "/enigme-3/navigateur",
    "/enigme-3/guideur",
    "/enigme-2/motus",
    "/enigme-2/zip",
    "/enigme-2/simon",
    "/enigme-2/tuile",
    "/enigme-2/fleche",
    "/enigme-2/snake",
];

export default function RootLayout({ children }) {
    const pathname = usePathname();

    const isGamePage = GAME_ROUTES.some((route) => pathname?.startsWith(route));

    return (
        <html lang="fr" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
            <title>La Click des Chemises Vertes</title>
        </head>
        <body className="bg-[var(--color-dark)] text-white min-h-[100dvh] flex flex-col pb-[env(safe-area-inset-bottom)]">
        <TimerProvider>

            <SplashScreen key={pathname} />

            {!isGamePage && <Navbar />}

        </TimerProvider>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
        </div>
        </body>
        </html>
    );
}