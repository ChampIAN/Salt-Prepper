"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function HalfCircularProgress({
    percentage,
    size = 180,
    strokeWidth = 12,
    color = "#10b981"
}: {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
}) {
    const [current, setCurrent] = useState(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = Math.PI * radius;

    useEffect(() => {
        setTimeout(() => setCurrent(percentage), 400);
    }, [percentage]);

    const offset = circumference - (current / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center" style={{ height: (size / 2) + 15 }}>
            <svg width={size} height={(size / 2) + strokeWidth} className="drop-shadow-[0_0_10px_rgba(16,185,129,0.4)] overflow-visible">
                <path
                    d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                    stroke="rgba(16, 185, 129, 0.1)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                />
                <motion.path
                    d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
                />
            </svg>
            <div className="absolute bottom-0 w-full flex justify-center translate-y-2">
                <span className="text-4xl font-black tracking-tighter leading-none" style={{ color }}>{percentage}<span className="text-2xl ml-1">%</span></span>
            </div>
        </div>
    );
}
