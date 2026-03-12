"use client";
import React from 'react';
import { Brain, ListChecks, Activity, AlertTriangle } from 'lucide-react';

interface SummaryProps {
  summary?: {
    summary_text: string;
    key_developments: string[];
    recommendations: string[];
  };
}

export default function CrisisSummaryPanel({ summary }: SummaryProps) {
  if (!summary) {
    return (
      <div className="p-6 bg-surface/20 border border-border/30 rounded-2xl flex flex-col items-center justify-center text-center">
        <Brain className="w-10 h-10 text-border/40 mb-3 animate-pulse" />
        <h4 className="text-[10px] font-bold text-text-dim uppercase tracking-[0.2em]">Neural Engine Idle</h4>
        <p className="text-[8px] text-border/60 max-w-xs mt-2 uppercase tracking-widest leading-relaxed">
          Waiting for event triggers to initialize situational analysis and recommendation protocols.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-surface/40 border border-accent/20 rounded-2xl backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3">
        <div className="flex items-center gap-1.5 px-2 py-0.5 border border-accent/30 bg-accent/5 rounded text-[8px] font-mono text-accent uppercase">
          <Activity size={10} className="animate-pulse" />
          Live AI Analysis
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-2 bg-accent/10 rounded-lg">
          <Brain className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-heading uppercase tracking-widest">Situational Report</h3>
          <p className="text-[9px] text-text-dim uppercase tracking-tighter">AI_OSINT_SYNTHESIS_V4.2</p>
        </div>
      </div>

      <div className="text-xs leading-relaxed text-text-body font-medium">
        {summary.summary_text}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="flex flex-col gap-3 p-4 bg-black/40 border border-border/30 rounded-xl">
          <div className="flex items-center gap-2 text-info">
            <AlertTriangle size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Key Developments</span>
          </div>
          <ul className="flex flex-col gap-2">
            {summary.key_developments.map((dev, i) => (
              <li key={i} className="text-[10px] text-text-dim leading-tight flex items-start gap-2">
                <span className="text-info font-bold mt-0.5">•</span>
                {dev}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 p-4 bg-accent/5 border border-accent/20 rounded-xl">
          <div className="flex items-center gap-2 text-accent">
            <ListChecks size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Tactical Recommendations</span>
          </div>
          <ul className="flex flex-col gap-2">
            {summary.recommendations.map((rec, i) => (
              <li key={i} className="text-[10px] text-text-muted leading-tight flex items-start gap-2">
                <span className="text-accent font-bold mt-0.5">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Background Decorative Element */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
}
