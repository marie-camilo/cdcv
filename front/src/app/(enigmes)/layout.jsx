import Navbar from "@/components/organisms/Navbar/Navbar";
import { TimerProvider } from "@/app/context/TimerContext";
import GameOverModal from "@/components/molecules/GameOverModal";

export default function EnigmeLayout({ children }) {
    return (
        <TimerProvider>
            <Navbar/>
            <div className="bg-dark text-light-green h-full flex flex-col overflow-hidden">
<<<<<<< HEAD
                <div className="pb-4 flex-1 overflow-auto">
=======
                <div className="p-2 flex-1 overflow-auto">
>>>>>>> billered
                    {children}
                </div>
                <GameOverModal />
            </div>
        </TimerProvider>
    );
}