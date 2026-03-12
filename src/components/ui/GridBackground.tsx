"use client";
import React from 'react';

import { usePathname } from 'next/navigation';

interface GridBackgroundProps {
    children: React.ReactNode;
    showScanline?: boolean;
    showEmbers?: boolean;
    className?: string;
}

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
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="ember"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${Math.random() * 5 + 5}s`,
                                animationDelay: `${Math.random() * 5}s`,
                                width: `${Math.random() * 4 + 2}px`,
                                height: `${Math.random() * 4 + 2}px`
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
