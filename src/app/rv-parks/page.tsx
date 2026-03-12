"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import TopHeader from '@/components/layout/TopHeader';
import { BatteryCharging, Droplet, Waves, MapPin, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { supabase } from '@/lib/supabaseClient';

// Dynamic import for Leaflet so it doesn't break SSR
const TacticalMap = dynamic(() => import('@/components/ui/TacticalMap'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 flex items-center justify-center bg-bg"><span className="text-accent uppercase tracking-widest text-xs animate-pulse">Initializing Tactical Display...</span></div>
});

export default function RVParksTacticalDirectory() {
    const [rvParks, setRvParks] = useState<any[]>([]);
    const [selectedPark, setSelectedPark] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchParks() {
            const { data, error } = await supabase.from('rv_parks').select('*');
            if (data) {
                // Enrich data with tactical MVP mock fields since they aren't in the base schema
                const enriched = data.map((park, i) => ({
                    ...park,
                    lat: park.latitude || 34.05 + (Math.random() * 2 - 1),
                    lng: park.longitude || -118.24 + (Math.random() * 2 - 1),
                    capacity: 25 + (i % 5) * 10,
                    distance: (2.4 + (i * 1.3)).toFixed(1),
                    status: i % 4 === 0 ? "UNAVAILABLE" : "AVAILABLE",
                    features: {
                        power: i % 3 !== 0,
                        water: true,
                        sewage: i % 2 === 0
                    }
                }));
                setRvParks(enriched);
                setSelectedPark(enriched[0]);
            }
            setLoading(false);
        }
        fetchParks();
    }, []);

    return (
        <div className="flex flex-col h-screen overflow-hidden text-text-body bg-bg">
            <TopHeader title="RV PARKS" subtitle="TACTICAL DIRECTORY" />

            <div className="flex flex-1 overflow-hidden relative">
                <aside className="w-full md:w-[450px] border-r border-border bg-bg-secondary/60 backdrop-blur-md h-full overflow-y-auto px-6 py-6 z-10 flex flex-col space-y-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-[11px] font-black tracking-widest text-text-muted uppercase">IDENTIFIED LOCATIONS</h2>
                        <span className="text-accent text-[10px] font-bold border border-accent/50 px-2 py-0.5 rounded tracking-widest">{loading ? 'SCANNING...' : `${rvParks.length} FOUND`}</span>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <span className="text-accent text-xs uppercase tracking-widest animate-pulse">Establishing Uplink...</span>
                        </div>
                    ) : rvParks.map((park, i) => (
                        <motion.div
                            key={park.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setSelectedPark(park)}
                            className={clsx(
                                "shrink-0 glass-panel p-4 cursor-pointer transition-all duration-300 scanner-card",
                                selectedPark?.id === park.id ? "glass-panel-active scale-[1.02]" : "hover:border-accent/50 hover:bg-surface-elevated/60"
                            )}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-24 h-16 bg-bg border border-accent/30 rounded-md overflow-hidden relative tactical-grid">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full blur-[2px] opacity-60" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-accent rounded-full" />
                                </div>
                                <div className={clsx(
                                    "text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded border",
                                    park.status === "AVAILABLE" ? "text-accent border-accent bg-accent/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "text-warning border-warning bg-warning/10"
                                )}>
                                    STATUS: {park.status}
                                </div>
                            </div>

                            <h3 className="font-bold text-sm text-text-heading tracking-wider mb-2">{park.name}</h3>
                            <div className="text-[10px] text-text-muted uppercase tracking-widest space-y-1 mb-4">
                                <p>Capacity: <span className="text-text-body">{park.capacity} SPOTS</span></p>
                                <p>Location: <span className="text-text-body">{park.address}</span></p>
                                <p>Distance: <span className="text-accent">{park.distance} MILES</span></p>
                            </div>

                            <div className="flex space-x-2">
                                <FeatureFlag icon={<BatteryCharging size={14} />} label="Power" active={park.features.power} />
                                <FeatureFlag icon={<Droplet size={14} />} label="Water" active={park.features.water} />
                                <FeatureFlag icon={<Waves size={14} />} label="Sewage" active={park.features.sewage} />
                            </div>
                        </motion.div>
                    ))}
                </aside>

                <main className="flex-1 bg-bg relative">
                    {rvParks.length > 0 && selectedPark && (
                        <TacticalMap rvParks={rvParks} selectedPark={selectedPark} setSelectedPark={setSelectedPark} />
                    )}

                    {/* Tactical overlays */}
                    <div className="absolute bottom-4 right-12 z-[1000] pointer-events-none text-right">
                        <p className="text-[8px] text-accent/60 font-mono tracking-widest">SAT_UPLINK: ENCRYPTED_STG // 0xBF2_VALIDATED</p>
                        <p className="text-[8px] text-text-dim/60 font-mono tracking-widest">COORDS RETRIEVED / TACTICAL V4.2</p>
                    </div>
                </main>
            </div>

            <style jsx global>{`
        .leaflet-container {
          font-family: inherit;
        }
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background: transparent !important;
          box-shadow: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          padding: 0 !important;
        }
        .leaflet-popup-tip-container {
          display: none;
        }
      `}</style>
        </div>
    );
}

function FeatureFlag({ icon, label, active }: { icon: React.ReactNode; label: string; active: boolean }) {
    return (
        <div className={clsx(
            "flex flex-col items-center justify-center w-12 h-14 rounded-md border text-[8px]",
            active
                ? "bg-accent/10 text-accent border-accent shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                : "bg-bg/40 text-text-dim/50 border-border/30 relative overflow-hidden"
        )}>
            <div className="mb-1">{icon}</div>
            <span className="font-bold tracking-widest uppercase">{label}</span>
            {!active && (
                <div className="absolute w-[2px] h-14 bg-text-muted/30 transform rotate-45 -z-10" />
            )}
        </div>
    );
}
