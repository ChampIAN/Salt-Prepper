import React from 'react';
import { clsx } from 'clsx';

export interface SidebarItem {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

export default function Sidebar({ items, title }: { items: SidebarItem[], title?: string }) {
    return (
        <aside className="w-64 border-r border-border bg-bg-secondary/60 backdrop-blur-md h-full overflow-y-auto px-4 py-6 flex flex-col shrink-0">
            {title && <h2 className="text-[10px] text-accent uppercase tracking-[0.2em] font-bold mb-4 ml-2">{title}</h2>}
            <nav className="space-y-2 flex-1">
                {items.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={item.onClick}
                        className={clsx(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold tracking-wider transition-all duration-300 text-left",
                            item.active
                                ? "bg-accent/10 text-accent border border-accent/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                                : "text-text-muted hover:bg-surface-elevated hover:text-text-body border border-transparent"
                        )}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
}
