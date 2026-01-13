import Navbar from "@/components/organisms/Navbar/Navbar";
import { TimerProvider } from "@/app/context/TimerContext";
import GameOverModal from "@/components/molecules/GameOverModal";

export default function EnigmeLayout({ children }) {
    return (
        <div className="pb-4 flex-1 overflow-auto">
            {children}
        </div>
    );
}