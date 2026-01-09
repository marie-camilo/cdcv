"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import QRScanner from "@/components/organisms/QRScanner/QRScanner";
import BaseModal from "@/components/molecules/Modals/BaseModal";
import TypewriterTerminal from "@/components/molecules/TypewriterTerminal/TypewriterTerminal";
import Link from "next/link";
import {RiDoorLockBoxLine} from "react-icons/ri";

export default function Enigme2Page() {
    const router = useRouter();
    const [step, setStep] = useState('SCAN');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lockerCode, setLockerCode] = useState("");
    const [error, setError] = useState(false);

    return (
        <main className="h-full flex flex-col md:max-w-md mx-auto">
            <section className="flex flex-col h-full">
                {/* Zone de texte avec scroll */}
                <article className="text-(--color-turquoise) py-4 px-4 font-mono text-xs overflow-y-auto flex-1 max-h-[15vh] border-2 border-(--color-turquoise) flex justify-around items-center">
                    <div className="border-2 size-16"></div>
                    <div className="border-2 size-16"></div>
                    <div className="border-2 size-16"></div>
                    <div className="border-2 size-16"></div>
                </article>

                {/* Zone des applications - toujours visible */}
                <article className="flex flex-col gap-6 justify-center items-center py-8 text-white flex-1 overflow-hidden border-2">

                </article>
            </section>
        </main>
    );
}