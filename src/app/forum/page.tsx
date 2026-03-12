"use client";
import React from 'react';
import TopHeader from '@/components/layout/TopHeader';
import PageContainer from '@/components/ui/PageContainer';
import NewsTicker from '@/components/forum/NewsTicker';
import IntelligenceSidebar from '@/components/forum/IntelligenceSidebar';
import CrisisRadarMap from '@/components/forum/CrisisRadarMap';
import CrisisSummaryPanel from '@/components/forum/CrisisSummaryPanel';
import TrendingEvents from '@/components/forum/TrendingEvents';
import TransmissionTerminal from '@/components/forum/TransmissionTerminal';
import GlobalTransmissionFeed from '@/components/forum/GlobalTransmissionFeed';
import { Shield, Map, MessageSquare, TrendingUp, Users, Radio, Zap, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';

export default function ForumPage() {
  const [trendingThreads, setTrendingThreads] = React.useState<any[]>([]);
  const [activeSummary, setActiveSummary] = React.useState<any>(null);
  const [categoryFeeds, setCategoryFeeds] = React.useState<Record<string, any[]>>({});
  const [dbCategories, setDbCategories] = React.useState<any[]>([]);
  const [crisisTotal, setCrisisTotal] = React.useState(0);

  React.useEffect(() => {
    async function fetchData() {
        // Fetch Active Crises Count
        const { count } = await supabase
            .from('crisis_events')
            .select('*', { count: 'exact', head: true });
        
        if (count !== null) setCrisisTotal(count);

        // Fetch All Categories from DB
        const { data: catData } = await supabase
            .from('forum_categories')
            .select('*')
            .order('name');
        
        if (catData) setDbCategories(catData);

        // Fetch trending (just top 5 recent threads for now)
        const { data: threads } = await supabase
            .from('forum_threads')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
        
        if (threads) {
            setTrendingThreads(threads.map(t => ({
                id: t.id,
                title: t.title,
                count: Math.floor(Math.random() * 50) + 10, // Mock count for UI
                is_event: t.is_event_thread
            })));
        }

        // Fetch Latest Threads for each category to populate the "Live Feed"
        if (catData) {
            const feeds: Record<string, any[]> = {};
            for (const cat of catData) {
                const { data: catThreads } = await supabase
                    .from('forum_threads')
                    .select('*')
                    .eq('category_id', cat.id)
                    .order('created_at', { ascending: false })
                    .limit(3);
                feeds[cat.id] = catThreads || [];
            }
            setCategoryFeeds(feeds);
        }

        // Fetch latest AI summary
        const { data: summary } = await supabase
            .from('ai_event_summaries')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        
        if (summary) setActiveSummary(summary);
    }
    fetchData();

    // Subscribe to headlines for ticker/sidebar realtime
    const channel = supabase
      .channel('forum-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'forum_threads' }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const categories = [
    { title: 'Strategy', slug: 'strategy', icon: <TrendingUp size={16} />, color: 'text-accent' },
    { title: 'Skills', slug: 'skills', icon: <Zap size={16} />, color: 'text-warning' },
    { title: 'Planning', slug: 'planning', icon: <Map size={16} />, color: 'text-info' },
    { title: 'Gear', slug: 'gear', icon: <Shield size={16} />, color: 'text-text-heading' },
    { title: 'Community', slug: 'community', icon: <Users size={16} />, color: 'text-accent-bright' },
  ];

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-black overflow-hidden relative">
      <TopHeader title="MISSION CONTROL" subtitle="CRISIS INTELLIGENCE FORUM • SECTOR_01" />
      <NewsTicker />

      <PageContainer>
        <div className="grid grid-cols-12 gap-6 h-full pb-10">
          
          {/* Main Dashboard Section */}
          <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
            
            {/* Top Indicator Row */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
               <StatCard label="ACTIVE CRISES" value={crisisTotal.toString().padStart(2, '0')} sub="GLOBAL_DETECT" trend="UP" />
               <StatCard label="INTEL SIGNALS" value="28" sub="LAST_24_HOURS" />
               <StatCard label="FIELD REPORTS" value="12" sub="VERIFIED_NODE" />
               <StatCard label="COORDINATION" value="HIGH" sub="NETWORK_STATUS" color="text-accent" />
            </div>

            {/* Comms Center: Input & Live Feed */}
            <div className="grid grid-cols-12 gap-6">
               <div className="col-span-12 xl:col-span-7">
                  <TransmissionTerminal categories={dbCategories} />
               </div>
               <div className="col-span-12 xl:col-span-5">
                  <GlobalTransmissionFeed />
               </div>
            </div>

            {/* Crisis Radar Section */}
            <div className="flex-1 min-h-[400px] bg-surface/40 border border-border/50 rounded-2xl relative overflow-hidden group">
              <CrisisRadarMap />
              
              {/* Tactical Corners */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-accent/20 pointer-events-none z-[1000]"></div>
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-accent/20 pointer-events-none z-[1000]"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-accent/20 pointer-events-none z-[1000]"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-accent/20 pointer-events-none z-[1000]"></div>
            </div>

            {/* AI Summary and Trending Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
               <div className="xl:col-span-2">
                 <CrisisSummaryPanel summary={activeSummary} />
               </div>
               <div className="xl:col-span-1">
                 <TrendingEvents threads={trendingThreads} />
               </div>
            </div>

            {/* Discussion Sectors: LIVE FEEDS populated with relevant sector data */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-accent" />
                <h2 className="text-xs font-bold tracking-[0.2em] text-text-heading uppercase">Discussion Sectors • Live Feeds</h2>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {dbCategories.filter(d => d.slug !== 'events').map((dbCat) => {
                  const uiCat = categories.find(c => c.slug === dbCat.slug) || categories[0];
                  const threads = categoryFeeds[dbCat.id] || [];

                  return (
                    <div key={dbCat.id} className="flex flex-col bg-surface/40 border border-border/40 rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-300">
                      {/* Sector Header */}
                      <div className="px-5 py-4 bg-black/40 border-b border-border/30 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded bg-black/60 border border-border/20 ${uiCat.color}`}>
                               {uiCat.icon}
                            </div>
                            <div>
                               <h3 className="text-[11px] font-bold text-text-heading uppercase tracking-widest">{dbCat.name}</h3>
                               <p className="text-[8px] text-text-dim uppercase tracking-tighter">Sector Active Signals</p>
                            </div>
                         </div>
                         <Link href={`/forum/category/${dbCat.slug}`} className="text-[8px] font-bold text-accent hover:text-accent-bright transition-colors uppercase tracking-widest flex items-center gap-1 group">
                            Full Sector Access
                            <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                         </Link>
                      </div>

                      {/* Sector Threads (Feed) */}
                      <div className="flex flex-col divide-y divide-border/10">
                        {threads.length > 0 ? (
                          threads.map((thread) => (
                            <Link 
                              key={thread.id} 
                              href={`/forum/thread/${thread.id}`}
                              className="px-5 py-3.5 hover:bg-accent/5 transition-colors group flex items-start justify-between gap-4"
                            >
                               <div className="flex flex-col gap-1 overflow-hidden">
                                  <span className="text-[10px] font-medium text-text-body group-hover:text-text-heading transition-colors truncate">
                                    {thread.title}
                                  </span>
                                  <div className="flex items-center gap-2 text-[7px] font-mono text-text-dim uppercase">
                                     <Clock size={8} />
                                     {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                                  </div>
                               </div>
                               <MessageSquare size={12} className="text-border/40 group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
                            </Link>
                          ))
                        ) : (
                          <div className="px-5 py-8 text-center text-text-dim text-[9px] font-mono uppercase italic tracking-widest">
                            Awaiting Sector Coordination...
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
            <IntelligenceSidebar />
            
            <div className="flex flex-col gap-4 p-4 bg-warning/5 border border-warning/20 rounded-xl">
               <div className="flex items-center gap-2 text-warning">
                 <Radio className="w-4 h-4 animate-pulse" />
                 <h3 className="text-[10px] font-bold tracking-widest uppercase">Emergency Protocol</h3>
               </div>
               <p className="text-[9px] leading-relaxed text-text-dim uppercase">
                 In the event of network disruption, fallback to HF radio coordination (Channel 4.2.1) and established community extraction nodes.
               </p>
            </div>
          </div>

        </div>
      </PageContainer>
    </main>
  );
}

function StatCard({ label, value, sub, color = "text-text-heading", trend }: any) {
  return (
    <div className="p-4 bg-surface/30 border border-border/30 rounded-xl flex flex-col justify-between hover:bg-surface/50 transition-colors">
      <div>
        <div className="text-[8px] font-mono text-text-dim uppercase tracking-widest mb-1">{label}</div>
        <div className={`text-xl font-bold tracking-tighter ${color} flex items-baseline gap-2`}>
          {value}
          {trend === "UP" && <TrendingUp className="w-3 h-3 text-accent" />}
        </div>
      </div>
      <div className="text-[7px] font-mono text-accent/50 mt-2 uppercase">{sub}</div>
    </div>
  );
}
