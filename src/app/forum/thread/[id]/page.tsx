"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TopHeader from '@/components/layout/TopHeader';
import PageContainer from '@/components/ui/PageContainer';
import { supabase } from '@/lib/supabaseClient';
import { MessageSquare, Clock, ArrowLeft, Send, User, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function ThreadPage() {
  const { id } = useParams();
  const router = useRouter();
  const [thread, setThread] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');

  useEffect(() => {
    async function fetchData() {
      // Fetch thread
      const { data: threadData } = await supabase
        .from('forum_threads')
        .select(`
          *,
          forum_categories (name, slug)
        `)
        .eq('id', id)
        .single();
      
      if (threadData) {
        setThread(threadData);
        // Fetch posts
        const { data: postData } = await supabase
          .from('forum_posts')
          .select('*')
          .eq('thread_id', id)
          .order('created_at', { ascending: true });
        
        if (postData) setPosts(postData);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const handlePostReply = async () => {
    if (!newPostContent.trim()) return;

    const { data, error } = await supabase
      .from('forum_posts')
      .insert({
        thread_id: id,
        content: newPostContent,
      })
      .select()
      .single();

    if (data) {
      setPosts([...posts, data]);
      setNewPostContent('');
    }
  };

  if (loading) return null;

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-black overflow-x-hidden">
      <TopHeader title="COORDINATION" subtitle={thread ? `SUB_SECTOR: ${thread.forum_categories.name}` : 'THREAD'} />
      
      <PageContainer>
        <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
          
          {/* Header Actions */}
          <div className="flex items-center gap-4 py-2">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 text-[10px] font-bold text-accent hover:text-accent-bright transition-colors uppercase tracking-[0.2em]"
            >
               <ArrowLeft size={14} />
               Sector Return
            </button>
            <span className="text-border/40">|</span>
            <div className="text-[10px] font-mono text-text-dim uppercase tracking-widest">
               ID: {id?.toString().substring(0, 8)}_TRANS
            </div>
          </div>

          {/* Original Post */}
          <div className="p-8 bg-surface/30 border border-accent/20 rounded-2xl relative">
             <div className="absolute top-4 right-8 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span className="text-[8px] font-mono text-accent uppercase tracking-[0.2em]">VERIFIED_ORIGIN</span>
             </div>
             
             <h2 className="text-2xl font-bold text-text-heading mb-4 leading-tight tracking-tight uppercase border-b border-border/20 pb-4">
               {thread?.title}
             </h2>

             <div className="flex items-center gap-6 mb-8 py-2 border-y border-border/10 bg-black/20 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-accent/10 border border-accent/30 flex items-center justify-center">
                    <User size={12} className="text-accent" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-accent uppercase">ANON_OPERATOR</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-mono text-text-dim uppercase">
                   <Clock size={12} />
                   {thread?.created_at && formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                </div>
             </div>

             <div className="text-sm leading-relaxed text-text-body whitespace-pre-wrap font-medium">
               {thread?.content}
             </div>
             
             {/* Tactical Accents */}
             <div className="absolute -top-px left-10 w-20 h-px bg-accent/40"></div>
             <div className="absolute -bottom-px right-10 w-20 h-px bg-accent/40"></div>
          </div>

          {/* Replies Section */}
          <div className="flex flex-col gap-6 mt-4">
             <div className="flex items-center gap-2 px-2 border-l-2 border-accent">
               <MessageSquare className="w-4 h-4 text-accent" />
               <h3 className="text-xs font-bold tracking-[0.2em] text-text-heading uppercase">Comms Feed ({posts.length})</h3>
             </div>

             <div className="flex flex-col gap-4">
                {posts.map((post, idx) => (
                  <div 
                    key={post.id} 
                    className="p-6 bg-surface/20 border border-border/30 rounded-xl relative group hover:border-accent/20 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded bg-border/20 flex items-center justify-center">
                             <User size={10} className="text-text-dim" />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">
                            NODE_{idx + 1}
                          </span>
                       </div>
                       <div className="text-[8px] font-mono text-text-dim uppercase">
                         {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                       </div>
                    </div>
                    <div className="text-xs leading-relaxed text-text-body pl-8 border-l border-border/10">
                       {post.content}
                    </div>
                  </div>
                ))}
             </div>

             {/* Reply Area */}
             <div className="mt-6 flex flex-col gap-4">
                <div className="relative">
                  <textarea 
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="ENTER RESPONSE DATA..."
                    className="w-full bg-black border border-accent/20 rounded-xl p-6 text-xs text-text-body font-mono focus:border-accent/50 focus:ring-1 focus:ring-accent/50 outline-none min-h-[150px] transition-all resize-none"
                  />
                  <div className="absolute top-2 right-4 text-[8px] font-mono text-accent/30 tracking-[0.3em]">SECURE_INPUT_ACTIVE</div>
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={handlePostReply}
                    className="flex items-center gap-2 px-8 py-3 bg-accent border border-accent rounded-md text-[10px] font-bold text-black hover:bg-black hover:text-accent transition-all uppercase tracking-[0.3em] group shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Transmit Data
                  </button>
                </div>
             </div>
          </div>

        </div>
      </PageContainer>
    </main>
  );
}
