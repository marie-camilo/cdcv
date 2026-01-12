"use client";
import React, { useState, useEffect } from 'react';
import styles from './RadarCompass.module.css';

export default function RadarCompass({ targets = [], foundIds = [] }) {
    const [heading, setHeading] = useState(0);

    useEffect(() => {
        const handleOrientation = (e) => {
            const compass = e.webkitCompassHeading || (360 - e.alpha);
            setHeading(compass || 0);
        };

        if (typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(state => {
                    if (state === 'granted') window.addEventListener('deviceorientation', handleOrientation);
                });
        } else {
            window.addEventListener('deviceorientation', handleOrientation);
        }

        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, []);

    return (
        <div className={styles.radarContainer}>
            <div className={styles.compass} style={{ transform: `rotate(${-heading}deg)` }}>
                <div className={styles.gridLine} />
                <div className={styles.gridLineHorizontal} />
                <div className={styles.northMarker}>N</div>

                {targets.map((target) => {
                    const isFound = foundIds.includes(target.id);
                    return (
                        <div
                            key={target.id}
                            className={`${styles.targetPoint} ${isFound ? styles.found : styles.missing}`}
                            style={{
                                transform: `rotate(${target.angle}deg) translateY(-${target.distance}px)`
                            }}
                        >
                            {!isFound && <span className={styles.blipPing}></span>}
                        </div>
                    );
                })}
            </div>

            <div className={styles.indicator} />
            <div className={styles.headingText}>{Math.round(heading)}°</div>
        </div>
    );
}