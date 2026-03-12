"use client";
import React from 'react';
import { MapPin, Clock, ShieldCheck, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FieldReportProps {
  report: {
    id: string;
    report_content: string;
    location_name: string;
    is_verified: boolean;
    created_at: string;
  };
}

export default function FieldReportCard({ report }: FieldReportProps) {
  return (
    <div className="p-4 bg-surface/40 border border-border/50 rounded-xl relative group overflow-hidden">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
            <User size={10} className="text-accent" />
          </div>
          <span className="text-[10px] font-mono font-bold text-text-heading uppercase">REPORTER_NODE</span>
        </div>
        <div className="flex items-center gap-1.5 text-[8px] font-mono text-text-dim uppercase">
          <Clock size={10} />
          {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
        </div>
      </div>

      <div className="text-xs text-text-body mb-4 pl-7 border-l border-border/20 leading-relaxed italic">
        "{report.report_content}"
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/10">
        <div className="flex items-center gap-1.5 text-accent/70">
          <MapPin size={12} />
          <span className="text-[9px] font-bold uppercase tracking-wider">{report.location_name}</span>
        </div>
        
        {report.is_verified && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-accent/10 border border-accent/20 rounded text-[8px] font-bold text-accent uppercase tracking-widest">
            <ShieldCheck size={10} />
            VERIFIED
          </div>
        )}
      </div>

      {/* Decorative Scanner Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-accent/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </div>
  );
}
