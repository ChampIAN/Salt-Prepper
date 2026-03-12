"use client";
import React from 'react';
import GridBackground from './GridBackground';

interface PageContainerProps {
    children: React.ReactNode;
    showScanline?: boolean;
    showEmbers?: boolean;
    className?: string;
}

export default function PageContainer({
    children,
    showScanline = true,
    showEmbers = false,
    className = ""
}: PageContainerProps) {
    return (
        <GridBackground showScanline={showScanline} showEmbers={showEmbers} className={`min-h-screen bg-bg ${className}`}>
            {children}
        </GridBackground>
    );
}
