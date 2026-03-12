"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CircularProgress({
    percentage,
    size = 220,
    strokeWidth = 14,
    color = "#10b981"
}: {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
}) {
    const [current, setCurrent] = useState(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    useEffect(() => {
        setTimeout(() => setCurrent(percentage), 300);
    }, [percentage]);

    const offset = circumference - (current / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(16, 185, 129, 0.1)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center inset-0">
                <span className="text-[72px] font-black text-accent tracking-tighter drop-shadow-md leading-[1.1]">{percentage}<span className="text-4xl ml-1">%</span></span>
            </div>
        </div>
    );
}
