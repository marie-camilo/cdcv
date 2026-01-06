"use client";
import NextButton from "@/components/atoms/Buttons/NextButton";
import TypewriterTerminal from "@/components/molecules/TypewriterTerminal/TypewriterTerminal";

export default function Enigme1Page() {
    const terminalLines = [
        "RECEPTION MESSAGE ENTRANT...",
        "PROVENANCE : LES CHEMISES ROUGES",
        "SUJET : LE DEFI COMMENCE",
        "DECHIFFREZ LE POINT DE RENDEZ-VOUS"
    ];

    const numbers = [
        { val: "6", color: "#347E84" },
        { val: "15", color: "var(--color-turquoise)" },
        { val: "25", color: "var(--color-light-green)" },
        { val: "5", color: "#FFACAC" },
        { val: "18", color: "var(--color-lavender)" }
    ];

    return (
        <section style={{
            backgroundImage: "url('/background-computer.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",

            width: "100vw",
            position: "relative",
            left: "50%",
            right: "50%",
            marginLeft: "-50vw",
            marginRight: "-50vw",

            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "80px 20px 40px",
            gap: "1.5rem",
            overflowX: "hidden"
        }}>

            <div style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(10, 20, 21, 0.4)",
                zIndex: 0
            }} />

            {/* Terminal en haut */}
            <div style={{ zIndex: 1, width: "100%", maxWidth: "450px" }}>
                <TypewriterTerminal textLines={terminalLines} speed={40} />
            </div>

            <div style={{
                zIndex: 1,
                width: "100%",
                maxWidth: "450px",
                background: "rgba(0, 0, 0, 0.40)",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "30px 20px",
                margin: "auto 0",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px 40px",
                justifyItems: "center"
            }}>
                {numbers.map((n, index) => (
                    <div key={index} style={{
                        fontSize: "4.5rem",
                        fontWeight: "900",
                        color: n.color,
                        textAlign: "center",
                        lineHeight: "1",
                        filter: `drop-shadow(0 0 10px ${n.color}44)`
                    }} >
                        {n.val}
                    </div>
                ))}
            </div>

            <div style={{ zIndex: 1, width: "100%", maxWidth: "450px", display: "flex", justifyContent: "center" }}>
                <NextButton variant="primary" />
            </div>
        </section>
    );
}