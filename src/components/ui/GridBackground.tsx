"use client";
import React from 'react';

import { usePathname } from 'next/navigation';

interface GridBackgroundProps {
    children: React.ReactNode;
    showScanline?: boolean;
    showEmbers?: boolean;
    className?: string;
}

// Deterministic ember data to avoid hydration mismatch from Math.random()
const EMBER_DATA = (() => {
    let seed = 123;
    const seededRandom = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    return Array.from({ length: 12 }, () => ({
        left: `${(seededRandom() * 100).toFixed(4)}%`,
        animationDuration: `${(seededRandom() * 5 + 5).toFixed(4)}s`,
        animationDelay: `${(seededRandom() * 5).toFixed(4)}s`,
        width: `${(seededRandom() * 4 + 2).toFixed(4)}px`,
        height: `${(seededRandom() * 4 + 2).toFixed(4)}px`,
    }));
})();

export default function GridBackground({
    children,
    showScanline = true,
    showEmbers = false,
    className = ""
}: GridBackgroundProps) {
    const pathname = usePathname();
    const shouldShowEmbers = showEmbers && pathname === '/offers';

    return (
        <div className={`relative tactical-grid ${showScanline ? 'scanline-overlay' : ''} ${className}`}>
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-deep/20 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-accent-deep/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Ember Particles */}
            {shouldShowEmbers && (
                <>
                    {EMBER_DATA.map((ember, i) => (
                        <div
                            key={i}
                            className="ember"
                            style={{
                                left: ember.left,
                                animationDuration: ember.animationDuration,
                                animationDelay: ember.animationDelay,
                                width: ember.width,
                                height: ember.height
                            }}
                        />
                    ))}
                </>
            )}

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
