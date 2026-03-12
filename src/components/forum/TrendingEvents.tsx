"use client";
import React from 'react';
import { TrendingUp, MessageSquare, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface TrendingThread {
  id: string;
  title: string;
  count: number;
  is_event: boolean;
}

export default function TrendingEvents({ threads }: { threads: TrendingThread[] }) {
  return (
    <div className="flex flex-col gap-4 p-5 bg-surface/30 border border-border/40 rounded-2xl h-full">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="w-4 h-4 text-accent" />
        <h3 className="text-[10px] font-bold tracking-[0.2em] text-text-heading uppercase">Trending Intel</h3>
      </div>

      <div className="flex flex-col gap-3">
        {threads.map((thread) => (
          <Link 
            key={thread.id} 
            href={`/forum/thread/${thread.id}`}
            className="flex items-start justify-between group p-2 rounded-lg hover:bg-accent/5 transition-all"
          >
            <div className="flex gap-3">
               <div className="mt-0.5">
                  {thread.is_event ? (
                    <AlertCircle size={14} className="text-warning animate-pulse" />
                  ) : (
                    <MessageSquare size={14} className="text-accent/50 group-hover:text-accent transition-colors" />
                  )}
               </div>
               <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-medium text-text-body group-hover:text-text-heading transition-colors line-clamp-1 truncate max-w-[150px]">
                    {thread.title}
                  </span>
                  <span className="text-[8px] font-mono text-text-dim uppercase">Active Discussion</span>
               </div>
            </div>
            <div className="text-right">
               <div className="text-[10px] font-mono text-accent">+{thread.count}</div>
               <div className="text-[7px] text-text-dim uppercase font-bold">Signals</div>
            </div>
          </Link>
        ))}
        
        {threads.length === 0 && (
          <div className="py-8 text-center text-text-dim italic text-[10px]">
            No trending activity detected.
          </div>
        )}
      </div>
    </div>
  );
}
