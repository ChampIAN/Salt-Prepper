"use client";
import React from 'react';
import { clsx } from "clsx";
import { motion } from "framer-motion";

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';

export function TacticalButton({
    children,
    onClick,
    className,
    variant = 'primary',
    type = 'button'
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: ButtonVariant;
    type?: 'button' | 'submit';
}) {
    const variants: Record<ButtonVariant, string> = {
        primary: "bg-white hover:bg-zinc-200 text-black font-black shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]",
        secondary: "bg-accent hover:bg-accent-bright text-black font-bold",
        accent: "bg-accent/10 border border-accent text-accent hover:bg-accent hover:text-black font-bold",
        outline: "border border-border text-text-muted hover:border-accent/50 hover:text-accent font-bold",
        ghost: "text-text-muted hover:text-text-heading hover:bg-surface-elevated font-bold"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type={type}
            className={clsx(
                "uppercase tracking-[0.15em] px-8 py-4 rounded-sm transition-all flex items-center justify-center gap-2 text-sm",
                variants[variant],
                className
            )}
            onClick={onClick}
        >
            {children}
        </motion.button>
    );
}
