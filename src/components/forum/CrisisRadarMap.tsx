"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/lib/supabaseClient';

// Dynamic import for Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

interface CrisisEvent {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  latitude: number;
  longitude: number;
  event_type: string;
  created_at: string;
}

export default function CrisisRadarMap() {
  const [events, setEvents] = useState<CrisisEvent[]>([]);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Import Leaflet on client side
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });

    async function fetchEvents() {
      const { data, error } = await supabase
        .from('crisis_events')
        .select('*')
        .eq('status', 'active');
      
      if (data) setEvents(data);
    }

    fetchEvents();

    const channel = supabase
      .channel('crisis-map-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'crisis_events' }, fetchEvents)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!L) return (
    <div className="w-full h-full flex items-center justify-center bg-black/20 animate-pulse">
      <span className="text-[10px] font-mono text-accent">LOADING_MAP_DRIVERS...</span>
    </div>
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444'; // Red
      case 'high': return '#f59e0b';     // Amber
      case 'medium': return '#3b82f6';   // Blue
      default: return '#10b981';         // Emerald
    }
  };

  const createEventIcon = (severity: string) => L.divIcon({
    className: 'custom-crisis-icon',
    html: `
      <div style="position: relative; width: 24px; height: 24px;">
        <div style="position: absolute; inset: 0; background: ${getSeverityColor(severity)}; opacity: 0.3; border-radius: 50%; animation: pulse-radar 2s infinite;"></div>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: ${getSeverityColor(severity)}; border-radius: 50%; border: 1px solid white;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%', background: '#050505' }}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        
        {events.map((event) => (
          <React.Fragment key={event.id}>
            <Circle
              center={[event.latitude, event.longitude]}
              pathOptions={{
                fillColor: getSeverityColor(event.severity),
                fillOpacity: 0.1,
                color: getSeverityColor(event.severity),
                weight: 1,
              }}
              radius={200000} // Visual "hot zone"
            />
            <Marker
              position={[event.latitude, event.longitude]}
              icon={createEventIcon(event.severity)}
            >
              <Popup className="tactical-popup">
                <div className="bg-surface border border-border/50 p-3 rounded-lg min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: getSeverityColor(event.severity) }}></div>
                    <span className="text-[10px] font-mono text-accent uppercase">{event.event_type}</span>
                  </div>
                  <h4 className="text-xs font-bold text-text-heading mb-1 uppercase tracking-wider">{event.title}</h4>
                  <div className="text-[9px] text-text-dim mb-3 font-mono">
                    COORDINATES: {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                  </div>
                  <button className="w-full py-1.5 bg-accent/10 border border-accent/20 rounded text-[9px] font-bold text-accent hover:bg-accent/20 transition-all uppercase tracking-widest">
                    Open Discussion
                  </button>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>

      {/* Map Legend/Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] p-3 bg-black/60 backdrop-blur-md border border-border/40 rounded-lg">
         <h5 className="text-[8px] font-mono text-text-dim uppercase tracking-widest mb-2">Severity Index</h5>
         <div className="flex flex-col gap-1.5">
            <LegendItem color="#ef4444" label="CRITICAL" />
            <LegendItem color="#f59e0b" label="HIGH" />
            <LegendItem color="#3b82f6" label="MEDIUM" />
            <LegendItem color="#10b981" label="LOW" />
         </div>
      </div>
      
      <style jsx global>{`
        @keyframes pulse-radar {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(3); opacity: 0; }
        }
        .tactical-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          color: white !important;
          padding: 0 !important;
          border-radius: 8px !important;
          overflow: hidden !important;
          box-shadow: none !important;
        }
        .tactical-popup .leaflet-popup-tip {
          background: #0a0a0a !important;
          border: 1px solid #27272a !important;
        }
      `}</style>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
      <span className="text-[8px] font-mono text-text-muted tracking-tighter">{label}</span>
    </div>
  );
}
