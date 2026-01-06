import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/organisms/Navbar/Navbar";
import { TimerProvider } from "@/app/context/TimerContext";
import GameOverModal from "@/components/molecules/GameOverModal";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Enigmes",
    description: "Interface Mobile Pixel Art",
};

export default function RootLayout({ children }) {
    return (
        <html lang="fr" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TimerProvider>
            <main className="bg-dark text-light-green min-h-screen flex flex-col">
                <Navbar />
                <div className="p-4 flex-1">
                    {children}
                </div>
                <GameOverModal />
            </main>
        </TimerProvider>
        </body>
        </html>
    );
}