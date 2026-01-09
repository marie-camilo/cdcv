"use client";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import QRScanner from "@/components/organisms/QRScanner/QRScanner";
import BaseModal from "@/components/molecules/Modals/BaseModal";

export default function Enigme2Page() {
    const router = useRouter();
    const [step, setStep] = useState('SCAN');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lockerCode, setLockerCode] = useState("");
    const [error, setError] = useState(false);

    return (
        <main className="min-h-screen bg-[var(--color-dark)] flex flex-col items-center p-6">

        </main>
    );
}