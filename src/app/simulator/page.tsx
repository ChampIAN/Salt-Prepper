"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from "clsx";
import TopHeader from '@/components/layout/TopHeader';
import { ShieldAlert, Zap, Droplet, Wifi, Crosshair, ThermometerSnowflake, Activity } from 'lucide-react';

// Scenario Data Mock
const GRID_DOWN_SCENARIO = [
    {
        id: "step_1",
        title: "INITIAL ANOMALY",
        report: "04:00 HOURS. Massive voltage spike detected on regional substations. Cascading failure initiated. All primary and secondary power grids offline. Cell towers operating on backup batteries (estimated 4 hours remaining).",
        impact: { threat_level: "HIGH" },
        options: [
            { id: "1a", text: "INITIATE COMMS BLACKOUT & RALLY FAMILY", cost: { power: -5, comms: -10 }, outcome: "Family secured. Communication lines preserved for critical use." },
            { id: "1b", text: "ATTEMPT TO GATHER OSINT VIA CELLULAR", cost: { power: -20, comms: -30 }, outcome: "Cellular networks congested. Significant battery drained with minimal intel gained." },
        ]
    },
    {
        id: "step_2",
        title: "TEMPERATURE DROP",
        report: "18:00 HOURS. Ambient temperature dropping rapidly to 15°F (-9°C). Municipal gas lines have begun to lose pressure. Risk of hypothermia for unprepared circle members.",
        impact: { threat_level: "CRITICAL" },
        options: [
            { id: "2a", text: "DEPLOY INDOOR SAFE HEATER (BUDDY HEATER) & SEAL ROOM", cost: { security: -5, resources: -15 }, outcome: "Core body temperatures stabilized. Resources slightly depleted." },
            { id: "2b", text: "RELY ON BLANKETS & SHARED BODY HEAT", cost: { health: -20, morale: -15 }, outcome: "Sub-optimal thermal retention. Minor cold-weather injuries sustained." },
        ]
    },
    {
        id: "step_3",
        title: "WATER CONTAMINATION RUMOR",
        report: "DAY 3. Neighbor reports municipal water is dispensing brown sludge. Rumors of bacterial contamination spreading. Stores are completely empty.",
        impact: { threat_level: "CRITICAL" },
        options: [
            { id: "3a", text: "SWITCH TO AQUATAINER RESERVES & SECURE PERIMETER", cost: { security: -10, resources: -5 }, outcome: "Hydration maintained. Minimal exposure to outside panic." },
            { id: "3b", text: "DEPLOY GRAVITY FILTER ON MUNICIPAL TAP WATER", cost: { resources: -15, time: -20 }, outcome: "Filters clogged rapidly. Water secured but filtration equipment compromised." },
        ]
    }
];

export default function SimulatorPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [scenarioActive, setScenarioActive] = useState(false);
    const [resources, setResources] = useState({
        power: 100,
        comms: 100,
        security: 100,
        health: 100,
        resources: 100, // Food/Water
        morale: 100
    });
    const [logs, setLogs] = useState<string[]>([]);
    const [gameOver, setGameOver] = useState(false);

    const step = GRID_DOWN_SCENARIO[currentStep];

    const startScenario = () => {
        setScenarioActive(true);
        setLogs(["[SYSTEM] INITIALIZING SIMULATION CORE...", "[SYSTEM] LOADING GRID_DOWN SEQUENCE V1.4..."]);
    };

    const handleOptionSelect = (option: { text: string; cost: Record<string, number | undefined>; outcome: string }) => {
        // Apply costs
        const newResources = { ...resources };
        Object.keys(option.cost).forEach(key => {
            const costValue = option.cost[key];
            if (typeof costValue === 'number' && key in newResources) {
                newResources[key as keyof typeof resources] = Math.max(0, newResources[key as keyof typeof resources] + costValue);
            }
        });
        setResources(newResources);

        // Add log
        setLogs(prev => [...prev, `> ${option.text}`, `OUTCOME: ${option.outcome}`]);

        // Next step or end
        if (currentStep < GRID_DOWN_SCENARIO.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setGameOver(true);
            setLogs(prev => [...prev, "[SYSTEM] SIMULATION COMPLETE. CALCULATING SURVIVABILITY SCORE..."]);
        }
    };

    // Auto-scroll logs
    useEffect(() => {
        const logEnd = document.getElementById("log-end");
        if (logEnd) {
            logEnd.scrollIntoView({ behavior: "smooth" });
        }
    }, [logs]);

    const overallScore = Math.floor(
        Object.values(resources).reduce((a, b) => a + b, 0) / 6
    );

    return (
        <div className="flex flex-col h-screen overflow-hidden text-text-body bg-bg">
            <TopHeader title="SIMULATOR" subtitle="CRISIS ENGINE" />

            <div className="flex flex-1 overflow-hidden relative">
                {/* Background Grid */}
                <div className="absolute inset-0 tactical-grid z-0" />
                {/* Ambient Glow */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-deep/15 blur-[150px] rounded-full pointer-events-none z-0" />


                {/* Left Panel: Vitals */}
                <aside className="w-full md:w-[320px] border-r border-border bg-bg-secondary/80 backdrop-blur-md h-full overflow-y-auto p-6 z-10 flex flex-col space-y-6">
                    <h2 className="text-[11px] font-black tracking-widest text-accent uppercase mb-2 flex items-center">
                        <Activity size={14} className="mr-2" /> CIRCLE VITALS
                    </h2>

                    <div className="space-y-4">
                        <VitalBar label="POWER & ENERGY" icon={<Zap size={14} />} value={resources.power} />
                        <VitalBar label="COMMUNICATIONS" icon={<Wifi size={14} />} value={resources.comms} />
                        <VitalBar label="PERIMETER SECURITY" icon={<ShieldAlert size={14} />} value={resources.security} />
                        <VitalBar label="WATER & CALORIES" icon={<Droplet size={14} />} value={resources.resources} />
                        <VitalBar label="MEDICAL & HEALTH" icon={<Crosshair size={14} />} value={resources.health} />
                        <VitalBar label="MORALE" icon={<Activity size={14} />} value={resources.morale} />
                    </div>

                    <div className="mt-8 p-4 border border-accent/30 bg-accent/5 rounded-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-20"><ThermometerSnowflake size={40} /></div>
                        <h3 className="text-[10px] font-bold text-text-muted tracking-widest mb-1">PROJECTED SURVIVABILITY</h3>
                        <div className="text-3xl font-black text-accent">{overallScore}%</div>
                        {overallScore < 50 && <p className="text-[10px] text-warning tracking-widest mt-2 animate-pulse">CRITICAL FAILURE IMMINENT</p>}
                    </div>
                </aside>

                {/* Main Console */}
                <main className="flex-1 flex flex-col p-6 lg:p-12 z-10 relative overflow-hidden justify-center items-center">

                    {!scenarioActive ? (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="max-w-xl w-full glass-panel p-8 text-center flex flex-col items-center border-accent/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                        >
                            <ShieldAlert size={48} className="text-accent mb-6 opacity-80" />
                            <h2 className="text-2xl font-black tracking-widest text-text-heading uppercase mb-4">WINTER GRID DOWN</h2>
                            <p className="text-sm text-text-muted mb-8 leading-relaxed">
                                A cascading failure has knocked out the Northeast grid. Temperatures are plummeting. Municipal services are offline. Test your circle&apos;s preparedness in a simulated 7-day severe blackout.
                            </p>
                            <button
                                onClick={startScenario}
                                className="w-full bg-accent/10 border border-accent text-accent py-4 rounded font-bold uppercase tracking-widest hover:bg-accent hover:text-black transition-all duration-300"
                            >
                                INITIALIZE SIMULATION
                            </button>
                        </motion.div>
                    ) : (
                        <div className="w-full max-w-3xl flex flex-col h-full space-y-6 justify-center">

                            {/* Scenario Terminal Display */}
                            <AnimatePresence mode="wait">
                                {!gameOver && (
                                    <motion.div
                                        key={step.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="glass-panel p-8 border-accent/30 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-lg font-black tracking-widest text-accent uppercase">
                                                T+{currentStep * 24} HOURS: {step.title}
                                            </h2>
                                            <span className="text-[10px] font-bold bg-warning/20 text-warning border border-warning/50 px-2 py-1 rounded tracking-widest uppercase animate-pulse">
                                                THREAT: {step.impact.threat_level}
                                            </span>
                                        </div>

                                        <p className="text-[15px] font-mono leading-relaxed text-text-body mb-8">
                                            {step.report}
                                        </p>

                                        <div className="space-y-4">
                                            <h3 className="text-[10px] text-text-muted font-bold tracking-[0.2em] uppercase">AVAILABLE ACTIONS:</h3>
                                            {step.options.map((option, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleOptionSelect(option)}
                                                    className="w-full text-left p-4 border border-border rounded bg-surface/60 hover:bg-accent/10 hover:border-accent text-sm font-bold tracking-wider text-text-body hover:text-accent transition-all duration-300"
                                                >
                                                    {`[ OPTION ${i + 1} ] ${option.text}`}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {gameOver && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="glass-panel p-8 border-accent text-center"
                                    >
                                        <ShieldAlert size={48} className={clsx("mx-auto mb-6", overallScore > 75 ? "text-accent" : "text-warning")} />
                                        <h2 className="text-3xl font-black tracking-widest text-text-heading uppercase mb-4">SIMULATION TERMINATED</h2>
                                        <p className="text-lg text-text-muted mb-2">Final Survivability Score: <span className={clsx("font-bold", overallScore > 75 ? "text-accent" : "text-warning")}>{overallScore}%</span></p>
                                        <p className="text-sm font-mono text-text-muted mb-8 mt-4">
                                            {overallScore > 75
                                                ? "OUTCOME: Your circle successfully weathered the event with minimal casualties or permanent damage."
                                                : "OUTCOME: Critical failures in preparedness led to severe casualties or loss of primary shelter."}
                                        </p>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="bg-accent/10 border border-accent text-accent px-8 py-3 rounded font-bold uppercase tracking-widest hover:bg-accent hover:text-black transition-all duration-300"
                                        >
                                            RUN NEW SCENARIO
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Tactical Action Log */}
                            <div className="h-48 glass-panel border-border bg-surface/90 p-4 font-mono text-[10px] overflow-y-auto space-y-2 relative">
                                <div className="sticky top-0 bg-surface pb-2 text-accent border-b border-accent/20 mb-2">
                                    ACTION LOG TERMINAL
                                </div>
                                {logs.length === 0 && <span className="text-text-dim/50">Awaiting simulation start...</span>}
                                {logs.map((log, i) => (
                                    <p key={i} className={clsx(
                                        log.startsWith('[SYSTEM]') ? "text-accent" :
                                            log.startsWith('OUTCOME:') ? "text-text-muted" : "text-text-body"
                                    )}>
                                        {log}
                                    </p>
                                ))}
                                <div id="log-end" />
                            </div>

                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

function VitalBar({ label, icon, value }: { label: string; icon: React.ReactNode; value: number }) {
    const getColor = (val: number) => {
        if (val > 70) return 'bg-accent shadow-[0_0_10px_rgba(16,185,129,0.5)]';
        if (val > 30) return 'bg-warning shadow-[0_0_10px_rgba(245,158,11,0.5)]';
        return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse';
    };

    return (
        <div>
            <div className="flex justify-between text-[10px] font-bold tracking-widest text-text-muted mb-1">
                <span className="flex items-center uppercase">{icon} <span className="ml-1.5">{label}</span></span>
                <span>{value}%</span>
            </div>
            <div className="h-1.5 w-full bg-border-subtle rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.5 }}
                    className={clsx("h-full rounded-full", getColor(value))}
                />
            </div>
        </div>
    );
}
