"use client";
import styles from "./PixelBorder.module.css";

export default function PixelBorder({ children }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                {children}
            </div>

            <div className={styles.pixelEdge}>
                <svg
                    width="100%"
                    height="140"
                    viewBox="0 0 380 140"
                    preserveAspectRatio="none"
                    fill="currentColor"
                    shapeRendering="crispEdges"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g clipPath="url(#clip0_146_3)">
                        <rect width="10" height="10" fill="#096067"/>
                        <rect y="80" width="10" height="10" fill="#096067"/>
                        <rect y="40" width="10" height="10" fill="#096067"/>
                        <rect y="60" width="10" height="10" fill="#096067"/>
                        <rect y="20" width="10" height="10" fill="#096067"/>
                        <rect y="100" width="10" height="10" fill="#217077"/>
                        <rect y="10" width="10" height="10" fill="#096067"/>
                        <rect y="90" width="10" height="10" fill="#096067"/>
                        <rect y="50" width="10" height="10" fill="#096067"/>
                        <rect y="70" width="10" height="10" fill="#096067"/>
                        <rect y="30" width="10" height="10" fill="#096067"/>
                        <rect y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="180" width="10" height="10" fill="#217077"/>
                        <rect x="180" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="180" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="180" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="180" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="180" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="180" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="180" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="180" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="180" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="180" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="90" width="10" height="10" fill="#347E84"/>
                        <rect x="90" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="90" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="90" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="90" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="90" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="90" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="90" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="90" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="90" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="90" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="90" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="270" width="10" height="10" fill="#217077"/>
                        <rect x="270" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="270" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="270" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="270" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="270" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="270" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="270" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="270" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="270" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="270" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="10" width="10" height="10" fill="#096067"/>
                        <rect x="10" y="80" width="10" height="10" fill="#217077"/>
                        <rect x="10" y="40" width="10" height="10" fill="#217077"/>
                        <rect x="10" y="60" width="10" height="10" fill="#217077"/>
                        <rect x="10" y="20" width="10" height="10" fill="#096067"/>
                        <rect x="10" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="10" y="10" width="10" height="10" fill="#096067"/>
                        <rect x="10" y="90" width="10" height="10" fill="#217077"/>
                        <rect x="10" y="50" width="10" height="10" fill="#217077"/>
                        <rect x="10" y="70" width="10" height="10" fill="#217077"/>
                        <rect x="10" y="30" width="10" height="10" fill="#096067"/>
                        <rect x="10" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="190" width="10" height="10" fill="#217077"/>
                        <rect x="190" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="190" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="190" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="190" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="190" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="190" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="190" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="190" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="190" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="190" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="190" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="190" y="120" width="10" height="10" fill="#54A3A9"/>
                        <rect x="100" width="10" height="10" fill="#347E84"/>
                        <rect x="100" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="100" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="100" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="100" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="100" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="100" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="100" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="100" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="100" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="100" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="100" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="280" width="10" height="10" fill="#347E84"/>
                        <rect x="280" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="280" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="280" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="280" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="280" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="280" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="280" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="280" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="280" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="280" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="20" width="10" height="10" fill="#096067"/>
                        <rect x="20" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="20" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="20" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="20" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="20" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="20" y="10" width="10" height="10" fill="#096067"/>
                        <rect x="20" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="20" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="20" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="20" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="200" width="10" height="10" fill="#217077"/>
                        <rect x="200" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="200" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="200" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="200" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="200" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="200" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="200" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="200" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="200" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="200" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="200" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="200" y="120" width="10" height="10" fill="#347E84"/>
                        <rect x="110" width="10" height="10" fill="#347E84"/>
                        <rect x="110" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="110" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="110" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="110" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="110" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="110" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="110" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="110" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="110" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="110" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="110" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="110" y="120" width="10" height="10" fill="#347E84"/>
                        <rect x="90" y="130" width="10" height="10" fill="#54A3A9"/>
                        <rect x="290" width="10" height="10" fill="#217077"/>
                        <rect x="290" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="290" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="290" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="290" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="290" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="290" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="290" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="290" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="290" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="290" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="290" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="290" y="120" width="10" height="10" fill="#347E84"/>
                        <rect x="30" width="10" height="10" fill="#096067"/>
                        <rect x="30" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="30" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="30" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="30" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="30" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="30" y="10" width="10" height="10" fill="#217077"/>
                        <rect x="30" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="30" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="30" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="30" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="30" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="30" y="120" width="10" height="10" fill="#54A3A9"/>
                        <rect x="210" width="10" height="10" fill="#217077"/>
                        <rect x="210" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="210" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="210" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="210" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="210" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="210" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="210" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="210" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="210" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="210" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="210" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="120" width="10" height="10" fill="#347E84"/>
                        <rect x="120" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="120" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="120" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="120" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="120" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="120" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="120" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="120" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="120" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="120" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="120" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="120" y="120" width="10" height="10" fill="#347E84"/>
                        <rect x="120" y="130" width="10" height="10" fill="#347E84"/>
                        <rect x="300" width="10" height="10" fill="#217077"/>
                        <rect x="300" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="300" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="300" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="300" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="300" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="300" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="300" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="300" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="300" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="300" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="300" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="300" y="120" width="10" height="10" fill="#54A3A9"/>
                        <rect x="310" y="130" width="10" height="10" fill="#54A3A9"/>
                        <rect x="40" width="10" height="10" fill="#096067"/>
                        <rect x="40" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="40" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="40" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="40" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="40" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="40" y="10" width="10" height="10" fill="#217077"/>
                        <rect x="40" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="40" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="40" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="40" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="40" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="40" y="120" width="10" height="10" fill="#347E84"/>
                        <rect x="40" y="130" width="10" height="10" fill="#54A3A9"/>
                        <rect x="220" width="10" height="10" fill="#217077"/>
                        <rect x="220" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="220" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="220" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="220" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="220" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="220" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="220" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="220" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="220" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="220" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="220" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="130" width="10" height="10" fill="#347E84"/>
                        <rect x="130" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="130" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="130" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="130" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="130" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="130" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="130" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="130" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="130" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="130" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="310" width="10" height="10" fill="#217077"/>
                        <rect x="310" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="310" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="310" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="310" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="310" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="310" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="310" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="310" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="310" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="310" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="310" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="50" width="10" height="10" fill="#096067"/>
                        <rect x="50" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="50" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="50" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="50" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="50" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="50" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="50" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="50" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="50" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="50" y="30" width="10" height="10" fill="#217077"/>
                        <rect x="50" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="50" y="120" width="10" height="10" fill="#347E84"/>
                        <rect x="230" width="10" height="10" fill="#217077"/>
                        <rect x="230" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="230" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="230" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="230" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="230" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="230" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="230" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="230" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="230" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="230" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="230" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="230" y="120" width="10" height="10" fill="#347E84"/>
                        <rect x="140" width="10" height="10" fill="#347E84"/>
                        <rect x="140" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="140" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="140" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="140" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="140" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="140" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="140" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="140" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="140" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="140" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="320" width="10" height="10" fill="#096067"/>
                        <rect x="320" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="320" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="320" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="320" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="320" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="320" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="320" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="320" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="320" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="320" y="30" width="10" height="10" fill="#217077"/>
                        <rect x="320" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="60" width="10" height="10" fill="#096067"/>
                        <rect x="60" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="60" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="60" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="60" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="60" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="60" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="60" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="60" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="60" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="60" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="60" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="240" width="10" height="10" fill="#217077"/>
                        <rect x="240" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="240" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="240" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="240" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="240" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="240" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="240" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="240" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="240" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="240" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="240" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="240" y="120" width="10" height="10" fill="#347E84"/>
                        <rect x="260" y="130" width="10" height="10" fill="#54A3A9"/>
                        <rect x="150" width="10" height="10" fill="#347E84"/>
                        <rect x="150" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="150" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="150" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="150" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="150" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="150" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="150" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="150" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="150" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="150" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="150" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="330" width="10" height="10" fill="#096067"/>
                        <rect x="330" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="330" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="330" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="330" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="330" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="330" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="330" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="330" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="330" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="330" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="330" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="330" y="120" width="10" height="10" fill="#54A3A9"/>
                        <rect x="70" width="10" height="10" fill="#217077"/>
                        <rect x="70" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="70" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="70" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="70" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="70" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="70" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="70" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="70" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="70" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="70" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="250" width="10" height="10" fill="#217077"/>
                        <rect x="250" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="250" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="250" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="250" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="250" y="100" width="10" height="10" fill="#54A3A9"/>
                        <rect x="250" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="250" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="250" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="250" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="250" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="250" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="160" width="10" height="10" fill="#347E84"/>
                        <rect x="160" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="160" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="160" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="160" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="160" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="160" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="160" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="160" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="160" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="160" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="160" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="160" y="120" width="10" height="10" fill="#347E84"/>
                        <rect x="150" y="130" width="10" height="10" fill="#54A3A9"/>
                        <rect x="340" width="10" height="10" fill="#096067"/>
                        <rect x="340" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="340" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="340" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="340" y="20" width="10" height="10" fill="#217077"/>
                        <rect x="340" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="340" y="10" width="10" height="10" fill="#096067"/>
                        <rect x="340" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="340" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="340" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="340" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="340" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="360" width="10" height="10" fill="#096067"/>
                        <rect x="360" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="360" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="360" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="360" y="20" width="10" height="10" fill="#096067"/>
                        <rect x="360" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="360" y="10" width="10" height="10" fill="#096067"/>
                        <rect x="360" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="360" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="360" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="360" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="360" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="80" width="10" height="10" fill="#347E84"/>
                        <rect x="80" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="80" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="80" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="80" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="80" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="80" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="80" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="80" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="80" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="80" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="80" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="80" y="120" width="10" height="10" fill="#54A3A9"/>
                        <rect x="260" width="10" height="10" fill="#217077"/>
                        <rect x="260" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="260" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="260" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="260" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="260" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="260" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="260" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="260" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="260" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="260" y="110" width="10" height="10" fill="#54A3A9"/>
                        <rect x="170" width="10" height="10" fill="#347E84"/>
                        <rect x="170" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="170" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="170" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="170" y="20" width="10" height="10" fill="#347E84"/>
                        <rect x="170" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="170" y="10" width="10" height="10" fill="#347E84"/>
                        <rect x="170" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="170" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="170" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="170" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="170" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="180" y="130" width="10" height="10" fill="#54A3A9"/>
                        <rect x="350" width="10" height="10" fill="#096067"/>
                        <rect x="350" y="80" width="10" height="10" fill="#347E84"/>
                        <rect x="350" y="40" width="10" height="10" fill="#347E84"/>
                        <rect x="350" y="60" width="10" height="10" fill="#347E84"/>
                        <rect x="350" y="20" width="10" height="10" fill="#217077"/>
                        <rect x="350" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="350" y="10" width="10" height="10" fill="#096067"/>
                        <rect x="350" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="350" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="350" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="350" y="30" width="10" height="10" fill="#347E84"/>
                        <rect x="350" y="110" width="10" height="10" fill="#347E84"/>
                        <rect x="350" y="120" width="10" height="10" fill="#347E84"/>
                        <rect x="340" y="130" width="10" height="10" fill="#54A3A9"/>
                        <rect x="370" width="10" height="10" fill="#096067"/>
                        <rect x="370" y="80" width="10" height="10" fill="#217077"/>
                        <rect x="370" y="40" width="10" height="10" fill="#217077"/>
                        <rect x="370" y="60" width="10" height="10" fill="#217077"/>
                        <rect x="370" y="20" width="10" height="10" fill="#096067"/>
                        <rect x="370" y="100" width="10" height="10" fill="#347E84"/>
                        <rect x="370" y="10" width="10" height="10" fill="#096067"/>
                        <rect x="370" y="90" width="10" height="10" fill="#347E84"/>
                        <rect x="370" y="50" width="10" height="10" fill="#347E84"/>
                        <rect x="370" y="70" width="10" height="10" fill="#347E84"/>
                        <rect x="370" y="30" width="10" height="10" fill="#096067"/>
                        <rect x="370" y="110" width="10" height="10" fill="#54A3A9"/>
                        <rect x="370" y="120" width="10" height="10" fill="#54A3A9"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_146_3">
                            <rect width="380" height="140" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
            </div>
        </div>
    );
}