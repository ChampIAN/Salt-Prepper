import React from 'react';
import { clsx } from 'clsx';

export interface SidebarItem {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

interface SidebarProps {
    items: SidebarItem[];
    title?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ items, title, isOpen, onClose }: SidebarProps) {
    return (
        <>
            {/* Mobile overlay backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[900] mobile-drawer-overlay md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar — always visible on md+, drawer on mobile */}
            <aside className={clsx(
                "border-r border-border bg-bg-secondary/95 backdrop-blur-md overflow-y-auto px-4 py-6 flex flex-col shrink-0 z-[950]",
                // Mobile: fixed drawer with slide animation
                "fixed top-0 left-0 h-full w-64 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                // Desktop: static positioning, always visible
                "md:relative md:w-64 md:h-full md:translate-x-0",
                // Mobile open/close
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Mobile close area / title */}
                <div className="flex items-center justify-between mb-4 md:mb-0">
                    {title && <h2 className="text-[10px] text-accent uppercase tracking-[0.2em] font-bold ml-2">{title}</h2>}
                </div>
                <nav className="space-y-2 flex-1 mt-2">
                    {items.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                item.onClick?.();
                                onClose?.();
                            }}
                            className={clsx(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs md:text-sm font-bold tracking-wider transition-all duration-300 text-left",
                                item.active
                                    ? "bg-accent/10 text-accent border border-accent/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                                    : "text-text-muted hover:bg-surface-elevated hover:text-text-body border border-transparent"
                            )}
                        >
                            {item.icon}
                            <span className="truncate">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>
        </>
    );
}
