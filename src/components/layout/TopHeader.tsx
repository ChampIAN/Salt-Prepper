"use client";
import React, { useState } from 'react';
import { Crosshair, Battery, Radio, ShieldAlert, Menu, X } from 'lucide-react';
import { clsx } from "clsx";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TopHeaderProps {
    title: string;
    subtitle?: string;
    onMobileMenuToggle?: () => void;
    isMobileMenuOpen?: boolean;
}

export default function TopHeader({ title, subtitle, onMobileMenuToggle, isMobileMenuOpen }: TopHeaderProps) {
    const pathname = usePathname();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const navItems = [
        { name: 'OVERVIEW', path: '/overview' },
        { name: 'CRISIS FORUM', path: '/forum' },
        { name: 'FAMILY PREPAREDNESS CIRCLE', path: '/circles' },
        { name: 'RV PARKS', path: '/rv-parks' },
        { name: 'SIMULATOR', path: '/simulator' },
        { name: 'OFFERS & STRATEGY', path: '/offers' },
    ];

    return (
        <header className="flex flex-col border-b border-border bg-bg-secondary/90 backdrop-blur-xl z-[1000] relative">
            <div className="flex justify-between items-center px-3 md:px-6 h-14 md:h-20">
                <div className="flex items-center gap-2 md:gap-6 min-w-0">
                    {/* Hamburger for sidebar toggle (only on pages with sidebar) */}
                    {onMobileMenuToggle && (
                        <button
                            onClick={onMobileMenuToggle}
                            className="md:hidden p-1.5 -ml-1 text-text-muted hover:text-accent transition-colors"
                            aria-label="Toggle sidebar"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    )}
                    <div className="flex items-center gap-2 min-w-0">
                        <Crosshair className="w-5 h-5 md:w-6 md:h-6 text-accent shrink-0" />
                        <h1 className="font-bold text-sm md:text-xl tracking-widest text-text-heading truncate">
                            S&P: <span className="text-accent">{title}</span>
                        </h1>
                    </div>
                    <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-accent/70 border border-accent/20 px-2 py-1 rounded bg-accent/5">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                        SYS.STATUS: SECURE
                    </div>
                </div>
                <div className="hidden md:flex gap-3">
                    <StatusBadge icon={<ShieldAlert size={12} strokeWidth={3} />} text="ALERT LEVEL: MEDIUM" type="warning" />
                    <StatusBadge icon={<Battery size={12} strokeWidth={3} />} text="84%" type="accent" />
                    <StatusBadge icon={<Radio size={12} strokeWidth={3} />} text="COMMS: OK" type="accent" />
                </div>
                {/* Mobile nav toggle */}
                <button
                    onClick={() => setMobileNavOpen(!mobileNavOpen)}
                    className="md:hidden p-1.5 text-text-muted hover:text-accent transition-colors"
                    aria-label="Toggle navigation"
                >
                    {!onMobileMenuToggle && (mobileNavOpen ? <X size={20} /> : <Menu size={20} />)}
                    {onMobileMenuToggle && (
                        <div className="flex items-center gap-1 text-[9px] font-mono text-accent/70 border border-accent/20 px-2 py-1 rounded bg-accent/5">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                            NAV
                        </div>
                    )}
                </button>
            </div>
            {subtitle && (
                <div className="px-3 md:px-6 pb-2">
                    <p className="text-[9px] md:text-[10px] text-text-dim uppercase tracking-[0.2em] font-mono truncate">{subtitle}</p>
                </div>
            )}
            {/* Desktop nav — always visible */}
            <nav className="hidden md:flex px-6 gap-6 border-t border-border-subtle mobile-nav-scroll overflow-x-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.path || (pathname?.startsWith(item.path) && item.path !== '/');
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={clsx(
                                "py-3 text-xs font-bold tracking-[0.2em] relative transition-colors duration-300 whitespace-nowrap",
                                isActive ? "text-accent" : "text-text-dim hover:text-text-body"
                            )}
                        >
                            {item.name}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>
            {/* Mobile nav — toggleable full-width dropdown */}
            {mobileNavOpen && (
                <nav className="md:hidden flex flex-col border-t border-border-subtle bg-bg-secondary/95 backdrop-blur-xl">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path || (pathname?.startsWith(item.path) && item.path !== '/');
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setMobileNavOpen(false)}
                                className={clsx(
                                    "px-4 py-3 text-[11px] font-bold tracking-[0.15em] border-b border-border-subtle/50 transition-colors",
                                    isActive ? "text-accent bg-accent/5" : "text-text-dim hover:text-text-body hover:bg-surface/50"
                                )}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            )}
        </header>
    );
}

function StatusBadge({ icon, text, type }: { icon: React.ReactNode; text: string; type: 'accent' | 'warning' }) {
    return (
        <div className={clsx(
            "flex items-center gap-2 px-4 py-1.5 border rounded-md text-[10px] font-bold uppercase tracking-widest",
            type === 'accent' ? "text-accent border-accent/50 bg-accent/10" : "text-warning border-warning/50 bg-warning/10"
        )}>
            {icon}
            <span>{text}</span>
        </div>
    );
}
