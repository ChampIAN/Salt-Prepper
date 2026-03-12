"use client";
import React from 'react';

export default function GlowDivider({ className = "" }: { className?: string }) {
    return (
        <div className={`w-full h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent ${className}`} />
    );
}
