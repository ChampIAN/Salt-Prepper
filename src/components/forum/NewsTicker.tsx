"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { AlertTriangle, Info, Zap } from 'lucide-react';

interface Headline {
  id: string;
  content: string;
  priority: number;
}

export default function NewsTicker() {
  const [headlines, setHeadlines] = useState<Headline[]>([]);

  useEffect(() => {
    async function fetchHeadlines() {
      const { data, error } = await supabase
        .from('forum_headlines')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (data) setHeadlines(data);
    }

    fetchHeadlines();

    // Subscribe to changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'forum_headlines' },
        () => fetchHeadlines()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (headlines.length === 0) return null;

  return (
    <div className="w-full bg-black/80 border-y border-accent/20 h-10 flex items-center overflow-hidden backdrop-blur-md relative z-50">
      <div className="flex items-center bg-accent/10 border-r border-accent/30 h-full px-4 z-10 relative">
        <Zap className="w-4 h-4 text-accent animate-pulse mr-2" />
        <span className="text-[10px] font-bold tracking-[0.2em] text-accent whitespace-nowrap">LIVE INTEL</span>
      </div>
      
      <div className="flex-1 relative overflow-hidden h-full">
        <div className="absolute flex whitespace-nowrap h-full items-center animate-ticker-scroll">
          {/* Repeat headlines for infinite loop */}
          {[...headlines, ...headlines, ...headlines].map((headline, index) => (
            <div key={`${headline.id}-${index}`} className="flex items-center px-8 border-r border-border-subtle h-full">
              {headline.priority >= 3 ? (
                <AlertTriangle className="w-3 h-3 text-warning mr-2" />
              ) : (
                <Info className="w-3 h-3 text-info mr-2" />
              )}
              <span className={`text-[11px] font-mono tracking-wider ${headline.priority >= 3 ? 'text-warning' : 'text-text-body'}`}>
                {headline.content}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
