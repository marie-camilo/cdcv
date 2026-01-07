import Navbar from "@/components/organisms/Navbar/Navbar";
import { TimerProvider } from "@/app/context/TimerContext";
import GameOverModal from "@/components/molecules/GameOverModal";

export default function EnigmeLayout({ children }) {
    return (
        <TimerProvider>
            <div className="bg-dark text-light-green min-h-screen flex flex-col">
                <Navbar />
                <div className="p-4 flex-1">
                    {children}
                </div>
                <GameOverModal />
            </div>
        </TimerProvider>
    );
}