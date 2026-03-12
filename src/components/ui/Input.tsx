"use client";
import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    label?: string;
}

export default function Input({ icon, label, className, ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="text-[10px] text-text-dim tracking-widest uppercase font-bold mb-1 block">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/50">
                        {icon}
                    </div>
                )}
                <input
                    className={clsx(
                        "w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text-body",
                        "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all",
                        "placeholder:text-text-dim",
                        icon && "pl-12",
                        className
                    )}
                    {...props}
                />
            </div>
        </div>
    );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
}

export function Select({ label, className, children, ...props }: SelectProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="text-[10px] text-text-dim tracking-widest uppercase font-bold mb-1 block">
                    {label}
                </label>
            )}
            <select
                className={clsx(
                    "w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text-body",
                    "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none",
                    className
                )}
                {...props}
            >
                {children}
            </select>
        </div>
    );
}
