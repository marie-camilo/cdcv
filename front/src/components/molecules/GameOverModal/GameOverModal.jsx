"use client";

import { useRouter } from "next/navigation";
import { useTimer } from "@/app/context/TimerContext";
import { RiArrowRightLine } from "react-icons/ri";

export default function GameOverModal() {
    const { isFinished } = useTimer();
    const router = useRouter();

    if (!isFinished) return null;

    const handleGoToCredits = () => {
        router.push("/credits");
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-500 p-4">

            {/* Carte Modale : Fond mis à jour en #7d3a2c */}
            <div className="relative w-full max-w-sm bg-[#7d3a2c] rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col border border-white/5">

                <div className="pt-10 pb-6 text-center">
                    <h1 className="text-7xl font-black text-white tracking-tighter leading-[0.8] drop-shadow-2xl">
                        GAME<br/>OVER
                    </h1>
                </div>

                {/* Section Vidéo (Remplace le GIF) */}
                <div className="w-full bg-black flex items-center justify-center overflow-hidden min-h-[250px] relative">
                    <video
                        src="/chemise-brulée.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover relative z-10"
                    />
                </div>

                <div className="p-8 flex flex-col items-center gap-6">
                    <div className="space-y-4 text-center">
                        <div className="space-y-2">
                            <p className="text-white text-base font-bold leading-tight">
                                Oups... Trop lents.
                            </p>
                            <p className="text-[var(--color-sand)] text-xs font-mono leading-relaxed opacity-90">
                                La Chemise Verte ? Elle finit en cendres.
                                <br/>C'est dommage, vous auriez pourtant pu la sauver...
                                <br/><br/>
                                <span className="text-white uppercase font-black">Mission ratée.</span>
                                <br/>Les Chemises Rouges vous remercient pour ce moment de divertissement.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleGoToCredits}
                        className="group flex items-center gap-2 px-8 py-3 bg-white text-[#7d3a2c] rounded-full text-[10px] font-black font-mono tracking-widest uppercase hover:bg-orange-100 hover:scale-105 transition-all duration-300 shadow-2xl"
                    >
                        <span>Crédits !</span>
                        <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}