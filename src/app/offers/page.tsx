"use client";

import React, { useState } from 'react';
import { ShoppingCart, Check, ShieldCheck, Zap, BookOpen, Layers, Target, Video, Users } from 'lucide-react';
import TopHeader from '@/components/layout/TopHeader';
import GridBackground from '@/components/ui/GridBackground';

export default function OffersPage() {
    return (
        <GridBackground showEmbers={true} className="min-h-screen text-text-muted font-mono flex flex-col selection:bg-accent/30">
            <TopHeader title="STRATEGY & UPGRADES" subtitle="MONETIZATION LADDER & OFFER MATRIX" />

            <main className="flex-1 p-8 max-w-7xl mx-auto w-full relative">
                {/* Ambient Glow */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-accent-deep/15 blur-[150px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-warning-deep/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="mb-12 border-l-4 border-accent pl-4 py-1">
                        <h2 className="text-3xl font-black tracking-widest uppercase text-text-heading mb-2">
                            FORTRESS OS <span className="text-accent">OFFERS</span>
                        </h2>
                        <p className="text-sm uppercase tracking-widest">
                            Acquire the knowledge, tools, and systems required for unshakeable resilience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Free Tier */}
                        <OfferCard
                            title="Free Tier"
                            price="FREE"
                            subtitle="Preparedness Checklist"
                            icon={<Check size={24} />}
                            features={[
                                "Access to the baseline Preparedness Checklist",
                                "Basic readiness assessment",
                                "Community forum read access"
                            ]}
                        />

                        {/* App Subscription */}
                        <div className="md:col-span-2 lg:col-span-2">
                            <OfferCard
                                title="Premium App & Community"
                                price="$10/mo"
                                billing="or $97/yr"
                                subtitle="Full Platform Access"
                                icon={<Users size={24} />}
                                highlighted={true}
                                features={[
                                    "Access to the Preparedness App & Gamified 'Preparedness Score'",
                                    "AI Coach & Family Planner Systems",
                                    "Localized community network feature access",
                                    "Full access to dynamic Scenario Simulations"
                                ]}
                            />
                        </div>

                        {/* $37 Quickstart */}
                        <OfferCard
                            title="Quickstart Offer"
                            price="$37"
                            subtitle="72-Hour Family Go-Bag System"
                            icon={<Target size={24} />}
                            features={[
                                "Book + 1-page Action Checklist",
                                "30-Minute Video: Pack a 72-hour family Go-Bag in one afternoon",
                                "Solves a highly specific, annoying problem quickly"
                            ]}
                        />

                        {/* $67 Food Prep */}
                        <OfferCard
                            title="Food Prep Course"
                            price="$67"
                            subtitle="Mylar & Deep Pantry Mini-course"
                            icon={<Layers size={24} />}
                            features={[
                                "Everything in the $37 Quickstart Offer",
                                "Highly tactical video guide on sealing bulk grains in Mylar bags with oxygen absorbers",
                                "Deep pantry rotation strategies"
                            ]}
                        />

                        {/* $147 Crime Prevention */}
                        <OfferCard
                            title="Crime Prevention"
                            price="$147"
                            subtitle="The 2-Hour Home Perimeter Audit"
                            icon={<ShieldCheck size={24} />}
                            features={[
                                "Workbook and tactical video guide",
                                "Apply CPTED (Crime Prevention Through Environmental Design)",
                                "Harden a suburban home in one weekend",
                                "Vulnerability assessment matrix"
                            ]}
                        />

                        {/* $297 Comms Workshop */}
                        <OfferCard
                            title="Grid-Down Comms Setup"
                            price="$297"
                            subtitle="Communications Masterclass"
                            icon={<Zap size={24} />}
                            features={[
                                "Crucial Rule: Once you have food and security, you need comms",
                                "Step-by-step masterclass on setting up GMRS",
                                "HAM radio listening protocols & best practices",
                                "Deploying Meshtastic nodes for family communication blackouts"
                            ]}
                        />

                        {/* $500 Complete Course */}
                        <div className="md:col-span-2 lg:col-span-2">
                            <OfferCard
                                title="The Complete Fortress OS"
                                price="$500"
                                subtitle="Full System Video Program"
                                icon={<Video size={24} />}
                                highlighted={true}
                                features={[
                                    "Comprehensive digital course expanding on the book",
                                    "Covers all 7 domains in-depth (Well, Storehouse, Infirmary, Grid, Comms, Perimeter, Protocols)",
                                    "The entire resilience system laid out visually and interactively",
                                    "Unlimited lifetime access to future protocol updates"
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </GridBackground>
    );
}

function OfferCard({
    title, price, billing, subtitle, icon, features, highlighted = false
}: {
    title: string; price: string; billing?: string; subtitle: string; icon: React.ReactNode; features: string[]; highlighted?: boolean;
}) {
    return (
        <div className={`flex flex-col border p-6 relative transition-all duration-300 rounded-xl scanner-card group ${highlighted
            ? 'bg-surface border-accent/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]'
            : 'bg-surface border-border hover:border-accent/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]'
            }`}>
            {highlighted && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-accent text-black text-[10px] font-black tracking-widest uppercase rounded-bl-lg rounded-tr-xl">
                    RECOMMENDED
                </div>
            )}

            <div className={`mb-4 inline-flex p-3 rounded-lg ${highlighted ? 'bg-accent/10 text-accent' : 'bg-surface-elevated text-text-muted group-hover:text-accent group-hover:bg-accent/10'} transition-colors`}>
                {icon}
            </div>

            <div className="flex items-end gap-2 mb-2">
                <span className={`text-4xl font-black tracking-tighter ${highlighted ? 'text-accent' : 'text-text-heading'}`}>
                    {price}
                </span>
                {billing && <span className="text-xs uppercase tracking-widest text-text-muted pb-1">{billing}</span>}
            </div>

            <h3 className="text-lg font-bold tracking-widest uppercase text-text-heading mt-2">{title}</h3>
            <p className="text-xs uppercase tracking-[0.1em] text-accent mb-6 border-b border-border pb-4">{subtitle}</p>

            <ul className="space-y-4 mb-8 flex-1">
                {features.map((feature, idx) => (
                    <li key={idx} className="flex gap-3 text-sm leading-relaxed">
                        <Check size={16} className={`shrink-0 mt-0.5 ${highlighted ? 'text-accent' : 'text-text-muted'}`} />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <button className={`w-full py-3 px-4 font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 rounded-sm ${highlighted
                ? 'bg-accent text-black hover:bg-accent-bright'
                : 'border border-accent/50 text-accent hover:bg-accent/10'
                }`}>
                <ShoppingCart size={14} />
                <span>SELECT TIER</span>
            </button>
        </div>
    );
}
