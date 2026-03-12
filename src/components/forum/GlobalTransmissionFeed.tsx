"use client";
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Radio, Clock, User, Activity, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Signal {
  id: string;
  content: string;
  priority: number;
  created_at: string;
  link_url?: string;
}

export default function GlobalTransmissionFeed() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchInitialData() {
      // Fetch latest headlines
      const { data: headlines } = await supabase
        .from('forum_headlines')
        .select('id, content, priority, created_at, link_url')
        .order('created_at', { ascending: false })
        .limit(15);
      
      // Fetch latest threads
      const { data: threads } = await supabase
        .from('forum_threads')
        .select('id, title, content, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      // Unify data
      const unified: Signal[] = [
        ...(headlines || []),
        ...(threads || []).map(t => ({
          id: t.id,
          content: `COORDINATION_NODE: ${t.title.toUpperCase()}`,
          priority: 2,
          created_at: t.created_at
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
       .slice(0, 30);
      
      setSignals(unified);
    }

    fetchInitialData();

    // Subscribe to both tables
    const channel = supabase
      .channel('global-comms-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'forum_headlines' }, (payload) => {
        setSignals(current => [payload.new as Signal, ...current].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 30));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'forum_threads' }, (payload) => {
        const newCoord: Signal = {
          id: payload.new.id,
          content: `COORDINATION_NODE: ${payload.new.title.toUpperCase()}`,
          priority: 2,
          created_at: payload.new.created_at
        };
        setSignals(current => [newCoord, ...current].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 30));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="bg-surface/40 border border-border/30 rounded-2xl overflow-hidden flex flex-col h-[300px] xl:h-full min-h-[250px] shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]">
      {/* Header */}
      <div className="px-4 py-2 border-b border-border/20 bg-black/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-text-heading uppercase tracking-widest">Global Live Uplink</span>
        </div>
        <div className="text-[8px] font-mono text-accent/60 uppercase">Buffer: Active_30</div>
      </div>

      {/* Feed Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-none custom-scrollbar"
      >
        {signals.map((signal) => (
          <div key={signal.id} className="flex flex-col gap-1.5 border-l border-accent/20 pl-3 py-1 hover:bg-accent/[0.02] transition-colors group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio size={10} className={signal.priority >= 3 ? 'text-warning' : 'text-accent'} />
                <span className="text-[8px] font-mono text-text-dim uppercase">
                  {formatDistanceToNow(new Date(signal.created_at), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {signal.link_url && (
                    <a href={signal.link_url} target="_blank" rel="noopener noreferrer" className="text-text-dim hover:text-accent">
                        <ExternalLink size={10} />
                    </a>
                )}
                <div className="text-[7px] font-mono text-accent/40">NODE_VERIFIED</div>
              </div>
            </div>
            
            <p className={`text-[10px] font-mono leading-tight ${signal.priority >= 3 ? 'text-warning font-bold' : 'text-text-body'}`}>
              <span className="text-accent/40 mr-1.5"> {'>'} </span>
              {signal.content}
            </p>
          </div>
        ))}

        {signals.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30 gap-2">
            <Activity className="w-8 h-8 animate-pulse text-accent" />
            <span className="text-[9px] font-mono uppercase tracking-[0.3em]">Scanning frequencies...</span>
          </div>
        )}
      </div>

      {/* Footer / Decoder Effect */}
      <div className="p-2 bg-accent/5 border-t border-accent/10 flex justify-between px-4">
        <div className="text-[7px] font-mono text-accent uppercase tracking-widest overflow-hidden h-3">
          <div className="animate-vertical-scan">
            CRC_CHECK: OK | PACKET_TYPE: SIG_ALPHA | ENCRYPTION: NONE | PROTOCOL: VX_4
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
        }
        @keyframes vertical-scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        .animate-vertical-scan {
          animation: vertical-scan 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
