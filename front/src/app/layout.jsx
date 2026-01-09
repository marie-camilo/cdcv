import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { TimerProvider } from "@/app/context/TimerContext";
import Navbar from "@/components/organisms/Navbar/Navbar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: {
        template: '%s | La Click',
        default: 'La Click des Chemises Vertes',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="fr" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <body className="bg-[var(--color-dark)] text-white h-screen overflow-hidden flex flex-col">
        <TimerProvider>
            <Navbar />
        </TimerProvider>
        <div className="flex-1 overflow-auto">
            {children}
        </div>
        </body>
        </html>
    );
}