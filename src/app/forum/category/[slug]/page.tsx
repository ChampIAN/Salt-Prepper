"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import TopHeader from '@/components/layout/TopHeader';
import PageContainer from '@/components/ui/PageContainer';
import { supabase } from '@/lib/supabaseClient';
import { MessageSquare, Clock, ArrowLeft, ChevronRight, Plus, Radio } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState<any>(null);
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch category
      const { data: catData } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (catData) {
        setCategory(catData);
        // Fetch threads for this category
        const { data: threadData } = await supabase
          .from('forum_threads')
          .select('*')
          .eq('category_id', catData.id)
          .order('created_at', { ascending: false });
        
        if (threadData) setThreads(threadData);
      }
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  if (loading) return null;

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-black">
      <TopHeader title={category?.name?.toUpperCase() || 'FORUM'} subtitle="Intelligence Discussion Sector" />
      
      <PageContainer>
        <div className="flex flex-col gap-6">
          
          {/* Breadcrumbs & Actions */}
          <div className="flex items-center justify-between py-2">
            <Link href="/forum" className="flex items-center gap-2 text-[10px] font-bold text-accent hover:text-accent-bright transition-colors uppercase tracking-[0.2em]">
               <ArrowLeft size={14} />
               Return to Mission Control
            </Link>
            <button className="flex items-center gap-2 px-6 py-2 bg-accent/10 border border-accent/20 rounded-md text-[10px] font-bold text-accent hover:bg-accent/20 transition-all uppercase tracking-widest">
               <Plus size={14} />
               Initialize New Thread
            </button>
          </div>

          {/* Category Info Header */}
          <div className="p-8 bg-surface/40 border border-border/50 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
             <h2 className="text-xl font-bold text-text-heading mb-2 uppercase tracking-[0.2em]">{category?.name}</h2>
             <p className="text-xs text-text-dim max-w-2xl leading-relaxed uppercase tracking-widest">{category?.description}</p>
          </div>

          {/* Thread List */}
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-2 px-2">
               <MessageSquare className="w-4 h-4 text-accent" />
               <span className="text-[10px] font-bold tracking-[0.2em] text-text-heading uppercase">Active Transmissions</span>
             </div>

             <div className="flex flex-col border border-border/30 rounded-xl overflow-hidden divide-y divide-border/20">
                {threads.map((thread) => (
                  <Link 
                    key={thread.id} 
                    href={`/forum/thread/${thread.id}`}
                    className="p-5 bg-surface/20 hover:bg-surface/40 flex items-center justify-between transition-all group"
                  >
                    <div className="flex flex-col gap-1.5">
                       <h3 className="text-sm font-bold text-text-heading group-hover:text-accent transition-colors tracking-wide">
                         {thread.title}
                       </h3>
                       <div className="flex items-center gap-3 text-[9px] text-text-dim font-mono uppercase">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-border/50"></span>
                          <span className="flex items-center gap-1">
                            OP: ANONYMOUS_OPERATOR
                          </span>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                       <div className="text-right hidden sm:block">
                          <div className="text-[12px] font-mono text-accent">{thread.views_count || 0}</div>
                          <div className="text-[7px] text-text-dim uppercase font-bold tracking-widest">Signals</div>
                       </div>
                       <ChevronRight className="w-4 h-4 text-text-dim group-hover:text-accent transition-all group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}

                {threads.length === 0 && (
                  <div className="p-20 flex flex-col items-center justify-center text-center">
                     <Radio className="w-12 h-12 text-border/40 mb-4 animate-pulse" />
                     <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest">No active transmissions in this sector.</p>
                  </div>
                )}
             </div>
          </div>

        </div>
      </PageContainer>
    </main>
  );
}
