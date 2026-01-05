"use client";
import NextButton from "@/components/atoms/Buttons/NextButton";

export default function TestPage() {
    return (
        <main
            style={{
                backgroundColor: "var(--background-dark)",
                color: "var(--color-light-green)",
                minHeight: "100vh",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "3rem",
                maxWidth: "600px",
            }}
        >
            <h1>Enigme 1</h1>
        </main>
    );
}
