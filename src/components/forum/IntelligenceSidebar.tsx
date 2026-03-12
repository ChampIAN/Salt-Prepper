"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ShieldAlert, Info, Clock, ExternalLink, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface IntelSignal {
  id: string;
  content: string;
  priority: number;
  created_at: string;
  link_url?: string;
}

export default function IntelligenceSidebar() {
  const [signals, setSignals] = useState<IntelSignal[]>([]);

  useEffect(() => {
    async function fetchSignals() {
      const { data, error } = await supabase
        .from('forum_headlines')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (data) setSignals(data);
    }

    fetchSignals();

    // Subscribe to changes
    const channel = supabase
      .channel('sidebar-intel-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'forum_headlines' },
        () => fetchSignals()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full bg-surface/40 border border-border/50 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-accent" />
          <h2 className="text-xs font-bold tracking-[0.2em] text-text-heading uppercase">Intelligence Feed</h2>
        </div>
        <div className="flex items-center gap-1 text-[8px] font-mono text-accent/50">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
          REALTIME_ACTIVE
        </div>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] pr-2">
        {signals.map((signal) => (
          <div 
            key={signal.id} 
            className={`group relative p-3 border rounded-lg transition-all duration-300 hover:bg-accent/5 ${
              signal.priority >= 3 ? 'border-warning/30 bg-warning/5' : 'border-border/50 bg-black/20'
            }`}
          >
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex items-center gap-1.5">
                {signal.priority >= 3 ? (
                  <ShieldAlert className="w-3 h-3 text-warning" />
                ) : (
                  <Info className="w-3 h-3 text-info" />
                )}
                <span className={`text-[9px] font-mono font-bold uppercase ${
                  signal.priority >= 3 ? 'text-warning' : 'text-info'
                }`}>
                  {signal.priority >= 3 ? 'Critical Alert' : 'Intel Signal'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[8px] text-text-dim font-mono">
                <Clock className="w-2.5 h-2.5" />
                {formatDistanceToNow(new Date(signal.created_at), { addSuffix: true })}
              </div>
            </div>

            <p className="text-[11px] leading-relaxed text-text-body mb-3 font-medium">
              {signal.content}
            </p>

            <div className="flex gap-3">
              <button 
                className="flex items-center gap-1.5 text-[9px] font-bold text-accent/70 hover:text-accent transition-colors"
              >
                <MessageSquare className="w-3 h-3" />
                FIXED_COMMS
              </button>
              {signal.link_url && (
                <a 
                  href={signal.link_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[9px] font-bold text-text-dim hover:text-text-body transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  DATA_SOURCE
                </a>
              )}
            </div>
            
            <div className="absolute top-0 right-0 w-8 h-8 rounded-tr-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute top-0 right-0 w-[1px] h-4 bg-accent/50 rotate-45 transform translate-x-2 -translate-y-2"></div>
            </div>
          </div>
        ))}
        
        {signals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-text-dim">
            <Clock className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-[10px] font-mono uppercase tracking-widest">Awaiting Intel...</p>
          </div>
        )}
      </div>
      
      <Link 
        href="/forum/events"
        className="mt-2 text-center py-2 border border-accent/20 rounded-md text-[9px] font-bold text-accent hover:bg-accent/10 transition-all uppercase tracking-widest bg-accent/5"
      >
        Access Complete Radar
      </Link>
    </div>
  );
}
