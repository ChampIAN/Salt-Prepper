"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Send, Radio, MessageSquare, AlertTriangle, Terminal as TerminalIcon, ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function TransmissionTerminal({ categories }: { categories: Category[] }) {
  const [activeMode, setActiveMode] = useState<'signal' | 'coordination'>('signal');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  React.useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const handleTransmit = async () => {
    if (!content.trim()) return;
    setIsTransmitting(true);
    setStatus('ESTABLISHING_UPLINK...');

    try {
      if (activeMode === 'signal') {
        const { error } = await supabase
          .from('forum_headlines')
          .insert({
            content: content.toUpperCase(),
            priority: 1, // Default priority for user signals
            is_active: true
          });
        
        if (error) throw error;
        setStatus('SIGNAL_BROADCAST_COMPLETE');
      } else {
        if (!title.trim()) {
            setStatus('ERROR: TITLE_REQUIRED');
            setIsTransmitting(false);
            return;
        }
        const { error } = await supabase
          .from('forum_threads')
          .insert({
            category_id: selectedCategory,
            title: title,
            content: content,
            is_event_thread: false
          });

        if (error) throw error;
        setStatus('COORDINATION_INITIALIZED');
      }

      setContent('');
      setTitle('');
      
      // Reset status after a delay
      setTimeout(() => setStatus(null), 3000);
    } catch (err: any) {
      console.error(err);
      setStatus(`ERROR: ${err.message || 'TRANSMISSION_FAILED'}`);
    } finally {
      setIsTransmitting(false);
    }
  };

  return (
    <div className="bg-surface/60 border border-accent/20 rounded-2xl overflow-hidden backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.05)]">
      {/* Terminal Header */}
      <div className="bg-accent/10 border-b border-accent/20 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest">Global Transmission Terminal</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/40"></div>
          <div className="w-2 h-2 rounded-full bg-amber-500/20 border border-amber-500/40"></div>
          <div className="w-2 h-2 rounded-full bg-accent/20 border border-accent/40"></div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Mode Selector */}
        <div className="flex gap-2 p-1 bg-black/40 rounded-lg border border-border/30 w-fit">
          <button 
            onClick={() => setActiveMode('signal')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[9px] font-bold uppercase transition-all ${
              activeMode === 'signal' ? 'bg-accent text-black' : 'text-text-dim hover:text-text-body'
            }`}
          >
            <Radio size={12} strokeWidth={3} />
            Broadcast Signal
          </button>
          <button 
            onClick={() => setActiveMode('coordination')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[9px] font-bold uppercase transition-all ${
              activeMode === 'coordination' ? 'bg-accent text-black' : 'text-text-dim hover:text-text-body'
            }`}
          >
            <MessageSquare size={12} strokeWidth={3} />
            Initialize Coordination
          </button>
        </div>

        {/* Input Area */}
        <div className="flex flex-col gap-2">
          {activeMode === 'coordination' && (
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="TRANSMISSION_TITLE..."
                className="bg-black/60 border border-border/30 rounded-md px-3 py-2 text-[10px] font-mono text-accent placeholder:text-accent/20 focus:border-accent/50 outline-none w-full uppercase"
              />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-black/60 border border-border/30 rounded-md px-3 py-2 text-[10px] font-mono text-accent focus:border-accent/50 outline-none uppercase"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="relative">
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={activeMode === 'signal' ? "ENTER GLOBAL BROADCAST DATA..." : "ENTER COORDINATION DETAILS..."}
              className="w-full bg-black/60 border border-border/30 rounded-md p-3 text-[10px] font-mono text-text-body placeholder:text-text-dim/30 focus:border-accent/50 outline-none min-h-[80px] resize-none uppercase leading-relaxed"
            />
            <div className="absolute bottom-2 right-3 flex items-center gap-2">
                {status && (
                    <span className={`text-[8px] font-mono uppercase animate-pulse ${status.includes('ERROR') ? 'text-red-500' : 'text-accent'}`}>
                        {status}
                    </span>
                )}
                {isTransmitting && <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center gap-4 text-[8px] font-mono text-text-dim uppercase tracking-tighter">
             <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
                ENCRYPTION: AES_256
             </div>
             <div className="flex items-center gap-1">
                <ChevronRight size={10} className="text-accent" />
                UPLINK: STABLE
             </div>
          </div>
          
          <button 
            onClick={handleTransmit}
            disabled={isTransmitting || !content.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-accent/10 border border-accent/30 rounded-md text-[10px] font-bold text-accent hover:bg-accent hover:text-black transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Send size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            Initiate Transmission
          </button>
        </div>
      </div>
    </div>
  );
}
