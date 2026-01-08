import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

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
        <body className="bg-[var(--color-dark)] text-white">
        {children}
        </body>
        </html>
    );
}