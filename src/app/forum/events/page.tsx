"use client";
import React, { useEffect, useState } from 'react';
import TopHeader from '@/components/layout/TopHeader';
import PageContainer from '@/components/ui/PageContainer';
import NewsTicker from '@/components/forum/NewsTicker';
import CrisisRadarMap from '@/components/forum/CrisisRadarMap';
import { supabase } from '@/lib/supabaseClient';
import { AlertTriangle, MapPin, Clock, Shield, ChevronRight, Activity } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function EventsRadarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from('crisis_events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500/50 bg-red-500/5 text-red-500';
      case 'high': return 'border-warning/50 bg-warning/5 text-warning';
      case 'medium': return 'border-info/50 bg-info/5 text-info';
      default: return 'border-accent/50 bg-accent/5 text-accent';
    }
  };

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-black">
      <TopHeader title="GLOBAL RADAR" subtitle="LIVE CRISIS DETECTION NETWORK" />
      <NewsTicker />

      <PageContainer>
        <div className="grid grid-cols-12 gap-8 h-full">
          
          {/* Map Section */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
             <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                   <Activity className="w-4 h-4 text-accent" />
                   <h2 className="text-xs font-bold tracking-[0.2em] text-text-heading uppercase">Global Situational Map</h2>
                </div>
                <div className="text-[10px] font-mono text-accent/50 uppercase">DATA_FEED: CONNECTED</div>
             </div>
             
             <div className="h-[500px] border border-border/50 rounded-2xl overflow-hidden relative shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <CrisisRadarMap />
                <div className="absolute top-4 left-4 z-[1000] px-3 py-1 bg-black/80 border border-accent/30 rounded text-[9px] font-mono text-accent">
                   MAP_LAYERS: TOPOGRAPHIC + SPECTRAL
                </div>
             </div>
             
             <div className="flex flex-col gap-4">
               <div className="flex items-center gap-2">
                 <Shield className="w-4 h-4 text-accent" />
                 <h2 className="text-xs font-bold tracking-[0.2em] text-text-heading uppercase">Detection Protocols</h2>
               </div>
               <div className="grid grid-cols-3 gap-4">
                  <ProtocolCard label="USGS_SENTRY" status="ONLINE" uptime="99.9%" />
                  <ProtocolCard label="NOAA_TRACKER" status="ONLINE" uptime="98.4%" />
                  <ProtocolCard label="GDACS_PULSE" status="ONLINE" uptime="99.2%" />
               </div>
             </div>
          </div>

          {/* Event List Section */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
             <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <h2 className="text-xs font-bold tracking-[0.2em] text-text-heading uppercase">Detected Events</h2>
             </div>

             <div className="flex flex-col gap-4 overflow-y-auto max-h-[700px] pr-2 scrollbar-thin">
                {events.map((event) => (
                  <div 
                    key={event.id}
                    className={`p-4 border rounded-xl flex flex-col gap-3 transition-all hover:scale-[1.02] cursor-pointer ${getSeverityStyles(event.severity)}`}
                  >
                    <div className="flex justify-between items-start">
                       <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border rounded border-current/30">
                         {event.event_type}
                       </span>
                       <span className="text-[8px] font-mono opacity-60">
                         {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                       </span>
                    </div>
                    
                    <div>
                       <h4 className="text-xs font-bold uppercase mb-1">{event.title}</h4>
                       <p className="text-[9px] opacity-80 line-clamp-2 leading-relaxed">
                         {event.description}
                       </p>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                       <div className="flex items-center gap-1 opacity-70">
                          <MapPin size={10} />
                          <span className="text-[9px] font-mono uppercase">{event.location_name}</span>
                       </div>
                       <ChevronRight size={14} className="opacity-40" />
                    </div>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </PageContainer>
    </main>
  );
}

function ProtocolCard({ label, status, uptime }: any) {
  return (
    <div className="p-4 bg-surface/30 border border-border/30 rounded-xl">
       <div className="text-[8px] font-mono text-text-dim uppercase tracking-widest mb-2">{label}</div>
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
             <span className="text-[10px] font-bold text-text-heading">{status}</span>
          </div>
          <span className="text-[10px] font-mono text-accent">{uptime}</span>
       </div>
    </div>
  );
}
