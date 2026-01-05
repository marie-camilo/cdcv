"use client";
import NextButton from "@/components/atoms/Buttons/NextButton";

export default function TestPage() {
    return (
        <main
            style={{
                backgroundColor: "var(--background-dark)",
                color: "white",
                minHeight: "100vh",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "3rem",
                maxWidth: "600px",
            }}
        >
            {/* BUTTON */}
            <section
                style={{
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <h1>Atoms – Button</h1>
                <div style={{ display: "flex", gap: "12px" }}>
                    <NextButton>Primary</NextButton>
                    <NextButton disabled>Disabled</NextButton>
                </div>
            </section>
        </main>
    );
}
