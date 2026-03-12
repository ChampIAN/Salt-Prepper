"use client";
import React, { useEffect, useRef } from 'react';

interface SectionProps {
    children: React.ReactNode;
    className?: string;
    revealOnScroll?: boolean;
    delay?: number;
}

export default function Section({
    children,
    className = "",
    revealOnScroll = true,
    delay = 0
}: SectionProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!revealOnScroll || !ref.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            },
            { threshold: 0.15 }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [revealOnScroll]);

    return (
        <div
            ref={ref}
            className={`${revealOnScroll ? 'reveal-on-scroll' : ''} ${className}`}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}
