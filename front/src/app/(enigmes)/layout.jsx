import Navbar from "@/components/organisms/Navbar/Navbar";
import { TimerProvider } from "@/app/context/TimerContext";
import GameOverModal from "@/components/molecules/GameOverModal";

export default function EnigmeLayout({ children }) {
    return (
        <TimerProvider>
            <div className="bg-dark text-light-green h-full flex flex-col overflow-hidden">
                <div className="p-4 flex-1 overflow-auto">
                    {children}
                </div>
                <GameOverModal />
            </div>
        </TimerProvider>
    );
}