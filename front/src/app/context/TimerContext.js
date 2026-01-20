// "use client";
// import { createContext, useContext, useState, useEffect } from "react";
//
// const TimerContext = createContext();
//
// export function TimerProvider({ children }) {
//     const INITIAL_TIME = 3600; // 1 heure
//     const [seconds, setSeconds] = useState(INITIAL_TIME);
//     const [isActive, setIsActive] = useState(true);
//     const [isFinished, setIsFinished] = useState(false);
//
//     useEffect(() => {
//         let interval = null;
//         if (isActive && seconds > 0) {
//             interval = setInterval(() => {
//                 setSeconds((prev) => prev - 1);
//             }, 1000);
//         } else if (seconds <= 0 && !isFinished) {
//             setIsFinished(true);
//             setIsActive(false);
//             clearInterval(interval);
//         }
//         return () => clearInterval(interval);
//     }, [isActive, seconds, isFinished]);
//
//     // Fonction pour simuler la fin (pour tes tests)
//     const simulateEnd = () => setSeconds(0);
//
//     return (
//         <TimerContext.Provider value={{ seconds, isFinished, simulateEnd }}>
//             {children}
//         </TimerContext.Provider>
//     );
// }
//
// export const useTimer = () => useContext(TimerContext);