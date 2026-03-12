"use client";
import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    highlighted?: boolean;
    scanner?: boolean;
    onClick?: () => void;
    active?: boolean;
}

export default function Card({
    children,
    className = "",
    highlighted = false,
    scanner = false,
    onClick,
    active = false
}: CardProps) {
    return (
        <div
            onClick={onClick}
            className={clsx(
                "rounded-xl transition-all duration-300",
                scanner && "scanner-card",
                onClick && "cursor-pointer",
                active
                    ? "bg-surface/90 backdrop-blur-md border border-accent shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                    : highlighted
                        ? "bg-surface border border-accent/50 hover:border-accent hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                        : "bg-surface border border-border hover:border-accent/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]",
                className
            )}
        >
            {children}
        </div>
    );
}
