import Navbar from "@/components/organisms/Navbar/Navbar";
import { TimerProvider } from "@/app/context/TimerContext";
import GameOverModal from "@/components/molecules/GameOverModal";

export default function EnigmeLayout({ children }) {
    return (
        <TimerProvider>
            <div className="bg-dark text-light-green h-full w-full overflow-y-auto">
                {children}
            </div>
            <GameOverModal />
        </TimerProvider>
    );
}