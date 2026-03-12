"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, BookOpen, Clock, Gift, Download, Star, Target, Users, 
  ShoppingCart, Mail, Quote, Crosshair, Terminal, Radio, FileSignature, 
  ChevronRight, Activity, Database, Lock, Zap, CheckCircle2, ChevronDown, Flame
} from 'lucide-react';

export default function App() {
  const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 8, minutes: 45, seconds: 0 });
  const [downloadState, setDownloadState] = useState('idle');
  const [email, setEmail] = useState('');
  const [activeChapter, setActiveChapter] = useState(0);
  const [copiesLeft, setCopiesLeft] = useState(412);
  const [scrolled, setScrolled] = useState(false);

  const chapters = [
    { id: "01", title: "The Theology of the Watchman", desc: "Dismantle the guilt and fear complex. Learn why preparation is an act of biblical stewardship, not a lack of faith." },
    { id: "02", title: "The Fortress Mindset", desc: "You do not rise to the level of your goals; you fall to the level of your systems. Master the OODA loop under stress." },
    { id: "03", title: "The Well System (Water)", desc: "A robust, multi-layered approach to water procurement, filtration, and long-term storage when municipal lines fail." },
    { id: "04", title: "The Storehouse (Food)", desc: "Build a 90-day deep pantry using Mylar, oxygen absorbers, and FIFO rotation to prevent appetite fatigue." },
    { id: "05", title: "The Infirmary (Medical)", desc: "Transition from a basic first-aid kit to austere medicine, TCCC trauma response, and off-grid sanitation." },
    { id: "06", title: "The Perimeter (Security)", desc: "Home hardening using CPTED (Crime Prevention Through Environmental Design) to naturally deter threats." }
  ];

  // Scroll Observer for Cinematic Reveals
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.15 });
    
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Countdown & Inventory Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    const inventoryTimer = setInterval(() => {
      setCopiesLeft(prev => prev > 124 ? prev - Math.floor(Math.random() * 3) : prev);
    }, 8500);

    return () => { clearInterval(timer); clearInterval(inventoryTimer); };
  }, []);

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDownloadState('loading');
    setTimeout(() => setDownloadState('success'), 2500);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        /* Cinematic Animations */
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.05); } }
        @keyframes scanline { 0% { transform: translateY(-100vh); } 100% { transform: translateY(100vh); } }
        @keyframes ember-rise { 
          0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; } 
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-10vh) translateX(50px) rotate(360deg); opacity: 0; } 
        }
        @keyframes isometric-pulse {
          0%, 100% { transform: translateY(0) rotateX(60deg) rotateZ(-45deg); box-shadow: -20px 20px 30px rgba(0,0,0,0.8); }
          50% { transform: translateY(-10px) rotateX(60deg) rotateZ(-45deg); box-shadow: -30px 30px 40px rgba(16, 185, 129, 0.2); }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
        
        /* Reveal Mechanics */
        .reveal-on-scroll { opacity: 0; transform: translateY(40px); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }

        /* Environmental Backgrounds */
        .cinematic-bg {
          background: radial-gradient(circle at 50% 0%, #1a0f05 0%, #000000 70%);
        }
        .tactical-grid {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
        }
        .scanline-overlay::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent, rgba(16,185,129,0.05), transparent);
          height: 150px; animation: scanline 10s linear infinite; pointer-events: none; z-index: 40;
        }

        /* Particles / Embers */
        .ember {
          position: absolute; width: 4px; height: 4px; background: #f59e0b; border-radius: 50%;
          box-shadow: 0 0 10px 2px rgba(245, 158, 11, 0.6); animation: ember-rise linear infinite;
          opacity: 0; pointer-events: none; z-index: 1;
        }

        /* 3D Book CSS */
        .book-perspective { perspective: 1500px; }
        .book-container {
          position: relative; transform-style: preserve-3d;
          transform: rotateY(-25deg) rotateX(10deg); transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .book-container:hover { transform: rotateY(-15deg) rotateX(5deg) scale(1.05); }
        .book-front {
          position: absolute; width: 100%; height: 100%; transform: translateZ(25px); backface-visibility: hidden;
          border-radius: 2px 8px 8px 2px; box-shadow: inset 4px 0 10px rgba(0,0,0,0.8), 0 0 40px rgba(16, 185, 129, 0.2);
          background-color: #09090b; border: 1px solid rgba(255,255,255,0.1);
        }
        .book-back {
          position: absolute; width: 100%; height: 100%; transform: rotateY(180deg) translateZ(25px);
          background: #050505; border-radius: 8px 2px 2px 8px;
        }
        .book-spine {
          position: absolute; width: 50px; height: 100%; transform: rotateY(-90deg) translateZ(25px);
          transform-origin: center left; background: linear-gradient(to right, #000, #111, #000);
          border-radius: 4px 0 0 4px; box-shadow: inset 0 0 10px rgba(0,0,0,0.9);
        }
        .book-pages-right {
          position: absolute; width: 48px; height: 98%; right: 0; top: 1%;
          transform: rotateY(90deg) translateZ(calc(100% - 25px));
          background: repeating-linear-gradient(to bottom, #e4e4e7 0px, #a1a1aa 3px);
        }
        .book-pages-top {
          position: absolute; width: 98%; height: 48px; top: 0; left: 1%;
          transform: rotateX(90deg) translateZ(25px);
          background: repeating-linear-gradient(to right, #e4e4e7 0px, #a1a1aa 3px);
        }

        /* Isometric Layer Diagram */
        .iso-layer {
          width: 300px; height: 300px; background: rgba(9, 9, 11, 0.9);
          border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 20px;
          position: absolute; transform: rotateX(60deg) rotateZ(-45deg);
          box-shadow: -20px 20px 30px rgba(0,0,0,0.8);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.5s ease;
        }
        .iso-container:hover .iso-layer-1 { transform: translateY(-40px) rotateX(60deg) rotateZ(-45deg); border-color: #10b981; background: rgba(16, 185, 129, 0.1); }
        .iso-container:hover .iso-layer-2 { transform: translateY(-80px) rotateX(60deg) rotateZ(-45deg); border-color: #f59e0b; background: rgba(245, 158, 11, 0.1); }
        .iso-container:hover .iso-layer-3 { transform: translateY(-120px) rotateX(60deg) rotateZ(-45deg); border-color: #3b82f6; background: rgba(59, 130, 246, 0.1); }

        /* Scanner Bonus Card */
        .bonus-card { position: relative; overflow: hidden; }
        .bonus-card::before {
          content: ''; position: absolute; top: -100%; left: -100%; width: 300%; height: 10px;
          background: rgba(16, 185, 129, 0.8); box-shadow: 0 0 20px 5px rgba(16, 185, 129, 0.4);
          transform: rotate(45deg); transition: all 0.7s ease; opacity: 0; pointer-events: none;
        }
        .bonus-card:hover::before { top: 200%; left: 200%; opacity: 1; }

      `}} />

      {/* Sticky Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#050505]/90 backdrop-blur-xl border-b border-zinc-800' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="font-bold text-xl tracking-widest flex items-center gap-2 text-white">
              <Crosshair className="w-6 h-6 text-emerald-500" />
              <span>S&P</span>
            </div>
            {scrolled && (
              <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-emerald-500/70 border border-emerald-500/20 px-2 py-1 rounded bg-emerald-500/5 animate-in fade-in">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                SYS.STATUS: SECURE
              </div>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <div className="text-[10px] font-mono text-amber-500 tracking-widest">{copiesLeft} ALPHA COPIES LEFT</div>
              <div className="w-32 h-1 bg-zinc-800 mt-1 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${(copiesLeft/500)*100}%` }}></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-white hover:bg-zinc-200 text-black px-6 py-3 font-bold text-xs tracking-[0.15em] transition-all transform hover:scale-105 rounded-sm">
                PREORDER NOW
              </button>
              <Link href="/overview" className="border border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-500 px-6 py-3 font-bold text-xs tracking-[0.15em] transition-all transform hover:scale-105 rounded-sm">
                ACCESS PLATFORM
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION (Cinematic Disaster Environment) */}
      <section className="relative min-h-[95vh] flex items-center pt-20 overflow-hidden cinematic-bg tactical-grid scanline-overlay">
        {/* Generated Particles/Embers */}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="ember" style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 5 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`
          }}></div>
        ))}
        
        {/* Core Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-900/20 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[500px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          
          {/* Left: Typography & CTA */}
          <div className="lg:col-span-7 space-y-8 relative">
            <div className="inline-flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/5 px-4 py-1.5 text-emerald-400 text-xs font-mono tracking-[0.2em] uppercase rounded-sm backdrop-blur-sm">
              <Terminal className="w-3.5 h-3.5" />
              The Guide to Faith-Centered Resilience
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black leading-[1.05] tracking-tighter text-white drop-shadow-2xl">
              BUILD YOUR<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">LIFE'S </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-700 filter drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">STRONGHOLD.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-xl font-light">
              Preparation is an act of stewardship, not fear. Install the <strong className="text-zinc-100 font-medium">Fortress OS</strong>&mdash;a comprehensive mechanical system to protect your family and preserve your community when the grid fails.
            </p>
            
            {/* High-Conversion Preorder Block */}
            <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-zinc-800 p-6 max-w-lg rounded-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              
              <div className="flex justify-between items-end mb-6">
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 tracking-widest mb-1">LAUNCH PROMO ENDS IN</div>
                  <div className="flex gap-4 font-mono">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                      <div key={unit} className="flex flex-col">
                        <span className="text-2xl font-light text-white leading-none">{value.toString().padStart(2, '0')}</span>
                        <span className="text-[9px] text-zinc-600 uppercase mt-1">{unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-amber-500 tracking-widest animate-pulse">SUPPLY WARNING</div>
                  <div className="text-sm text-zinc-300"><strong>{copiesLeft}</strong> copies left</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <button className="w-full bg-white hover:bg-zinc-200 text-black font-black text-sm tracking-[0.15em] py-4 rounded transition-all transform hover:scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.1)] flex justify-center items-center gap-3">
                  SECURE HARDCOVER + BONUSES <ChevronRight className="w-5 h-5" />
                </button>
                <Link href="/overview" className="w-full border border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-500 font-black text-sm tracking-[0.15em] py-4 rounded transition-all transform hover:scale-[1.02] flex justify-center items-center gap-3">
                  ACCESS PLATFORM <Activity className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Elite 3D Book Mockup */}
          <div className="lg:col-span-5 book-perspective flex justify-center items-center h-[500px] lg:h-[700px] relative">
            {/* Book Pedestal / Glow */}
            <div className="absolute bottom-10 w-64 h-10 bg-emerald-500/20 blur-[30px] rounded-[100%] animate-pulse-glow"></div>
            
            <div className="book-container animate-float w-[280px] h-[410px] lg:w-[360px] lg:h-[530px]">
              <div className="book-spine flex items-center justify-center">
                <span className="transform -rotate-90 text-zinc-500 text-xs font-bold tracking-[0.4em] whitespace-nowrap">SALT & PREPPER</span>
              </div>
              <div className="book-pages-right"></div>
              <div className="book-pages-top"></div>
              <div className="book-back border border-zinc-800"></div>
              
              {/* Front Cover Design */}
              <div className="book-front bg-[#09090b] overflow-hidden flex flex-col justify-between p-8 relative">
                <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')]"></div>
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/15 blur-[60px]"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/10 blur-[60px]"></div>
                
                <div className="relative z-10 text-center mt-8">
                  <div className="text-emerald-400 tracking-[0.3em] text-[10px] font-mono mb-6 border border-emerald-500/30 inline-block px-3 py-1 bg-emerald-500/10 backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">THE FORTRESS OS</div>
                  <h2 className="text-5xl lg:text-7xl font-black text-white leading-[0.85] tracking-tighter">SALT<br/><span className="text-5xl text-zinc-600 font-light my-2 block">&</span>PREPPER</h2>
                </div>
                
                <div className="relative z-10 text-center pb-4">
                  <div className="w-12 h-1 bg-amber-500 mx-auto mb-6 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                  <p className="text-zinc-300 text-xs uppercase tracking-[0.25em] font-medium mb-2">A Faith-Centered Guide to</p>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-mono mb-8">Building Your Life&apos;s Stronghold</p>
                  <p className="text-white font-bold tracking-[0.4em] text-xs border-t border-zinc-800/80 pt-6">AUTHOR NAME</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. APPLE-STYLE SCROLLING STORY */}
      <section className="bg-[#000] relative border-t border-zinc-900 py-32">
        <div className="max-w-5xl mx-auto px-6 space-y-40 text-center">
          <div className="reveal-on-scroll">
            <Flame className="w-12 h-12 text-amber-500 mx-auto mb-8 opacity-50" />
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">The grid drops.</h2>
            <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto">Supply chains snap. The neighborhood goes dark. The news cycle screams panic.</p>
          </div>
          
          <div className="reveal-on-scroll">
            <Users className="w-12 h-12 text-zinc-700 mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-600 mb-6">The panic sets in.</h2>
            <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto">Fear paralyzes the unprepared. Desperation turns neighbors into liabilities. The secular survivalist locks the door and hoards the beans.</p>
          </div>

          <div className="reveal-on-scroll">
            <Terminal className="w-12 h-12 text-emerald-500 mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">You check your OS.</h2>
            <p className="text-xl text-zinc-400 font-light max-w-2xl mx-auto">Your water is secured. Your deep pantry is rotated. Your perimeter is hardened. Your mindset is anchored in faith, not fear.</p>
          </div>

          <div className="reveal-on-scroll">
            <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto mb-8 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-emerald-200 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-6">You are ready.</h2>
            <p className="text-2xl text-emerald-100/70 font-light max-w-2xl mx-auto">You step outside. You become the salt of the earth. You are the Watchman.</p>
          </div>
        </div>
      </section>

      {/* 3. ANIMATED PREPAREDNESS DIAGRAM (The Fortress OS) */}
      <section className="py-32 bg-[#050505] tactical-grid border-y border-zinc-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative h-[400px] md:h-[500px] flex justify-center items-center iso-container reveal-on-scroll">
            {/* Isometric Layers */}
            <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full"></div>
            
            <div className="iso-layer iso-layer-3 z-10">
              <div className="text-center font-mono opacity-50">
                <Database className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-xs tracking-widest text-blue-400">LAYER 3: OUTPUT</div>
                <div className="text-[9px] text-zinc-500">COMMUNITY TRIAGE</div>
              </div>
            </div>
            
            <div className="iso-layer iso-layer-2 z-20" style={{ transform: 'translateY(-20px) rotateX(60deg) rotateZ(-45deg)' }}>
              <div className="text-center font-mono opacity-70">
                <Activity className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                <div className="text-xs tracking-widest text-amber-400">LAYER 2: PROTOCOLS</div>
                <div className="text-[9px] text-zinc-500">BUG-IN / EVACUATION</div>
              </div>
            </div>
            
            <div className="iso-layer iso-layer-1 z-30" style={{ transform: 'translateY(-40px) rotateX(60deg) rotateZ(-45deg)' }}>
              <div className="text-center font-mono">
                <Lock className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                <div className="text-xs tracking-widest text-emerald-400 font-bold">LAYER 1: CORE DOMAINS</div>
                <div className="text-[9px] text-zinc-400">WATER • FOOD • MED • GRID</div>
              </div>
            </div>
            
            <div className="absolute -bottom-10 right-0 font-mono text-[10px] text-zinc-600 tracking-widest hidden md:block">
              *HOVER TO EXPAND SYSTEM ARCHITECTURE
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8 reveal-on-scroll delay-200">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">The Operating System for Survival.</h2>
            <p className="text-zinc-400 leading-relaxed font-light text-lg">
              Most books give you a chaotic list of expensive gear to buy. <em className="text-white">Salt & Prepper</em> gives you an installable <strong>System</strong>. We map preparedness to the logic of an Operating System, making readiness debuggable, trackable, and deeply practical.
            </p>
            <ul className="space-y-4 font-mono text-sm text-zinc-300">
              {['Establish spiritual & mental Source Code', 'Install physical Hardware (Water, Food, Power)', 'Execute emergency Protocols (Bug-In, Evac)', 'Deploy Output (Community Service & Triage)'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 bg-[#0a0a0a] p-4 border border-zinc-800 rounded">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE CHAPTER EXPLORER */}
      <section className="py-32 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 reveal-on-scroll">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Inside The Playbook</h2>
            <p className="text-zinc-500 font-mono text-sm tracking-widest">SELECT A SECTOR TO PREVIEW INTELLIGENCE</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 reveal-on-scroll delay-100">
            {/* Left Nav */}
            <div className="lg:col-span-5 space-y-2">
              {chapters.map((chap, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveChapter(idx)}
                  className={`w-full text-left px-6 py-5 rounded-lg flex items-center justify-between font-mono text-sm transition-all duration-300 ${
                    activeChapter === idx 
                      ? 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                      : 'bg-[#0a0a0a] border border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  <span className="flex gap-4">
                    <span className="opacity-50">{chap.id}.</span> 
                    <span className="font-bold tracking-wide">{chap.title.split('(')[0]}</span>
                  </span>
                  {activeChapter === idx && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>

            {/* Right Content */}
            <div className="lg:col-span-7">
              <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-8 md:p-12 h-full flex flex-col justify-center relative overflow-hidden transition-all duration-500">
                <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none"></div>
                <div className="font-mono text-emerald-500 text-5xl font-black opacity-20 mb-6 absolute top-8 left-8">
                  {chapters[activeChapter].id}
                </div>
                
                <div className="relative z-10 mt-12">
                  <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">{chapters[activeChapter].title}</h3>
                  <p className="text-xl text-zinc-400 font-light leading-relaxed mb-8">
                    {chapters[activeChapter].desc}
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-500 bg-amber-500/10 px-3 py-2 border border-amber-500/20">
                    <Lock className="w-3 h-3" /> INTEL LOCKED UNTIL PURCHASE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AMAZON-STYLE REVIEW COMPONENT */}
      <section className="py-24 bg-[#050505] border-y border-zinc-900">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-12 reveal-on-scroll">
            
            {/* Review Breakdown */}
            <div className="md:col-span-4 space-y-6">
              <h2 className="text-2xl font-bold text-white">Advance Reader Response</h2>
              <div className="flex items-end gap-3">
                <div className="text-6xl font-black text-white leading-none">4.9</div>
                <div className="pb-1">
                  <div className="flex text-emerald-500 mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <div className="text-xs text-zinc-500 font-mono">142 VERIFIED READERS</div>
                </div>
              </div>
              
              <div className="space-y-2 mt-8">
                {[
                  { stars: 5, pct: 92 }, { stars: 4, pct: 6 }, { stars: 3, pct: 2 }, { stars: 2, pct: 0 }, { stars: 1, pct: 0 }
                ].map(row => (
                  <div key={row.stars} className="flex items-center gap-3 text-xs font-mono text-zinc-500">
                    <div className="w-8">{row.stars} <Star className="w-2.5 h-2.5 inline -mt-0.5" /></div>
                    <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500/80" style={{ width: `${row.pct}%` }}></div>
                    </div>
                    <div className="w-8 text-right">{row.pct}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Reviews */}
            <div className="md:col-span-8 grid sm:grid-cols-2 gap-6">
              {[
                { author: "SARAH M.", title: "MOTHER OF 3", text: "Finally, a preparedness book that doesn't make me feel crazy. It replaced my anxiety with a calm, executable plan for my family." },
                { author: "DAVID R.", title: "FORMER LEO", text: "The 'Fortress OS' framework is brilliant. It takes complex tactical and logistical concepts and translates them into plain English." },
                { author: "PASTOR T.", title: "COMMUNITY LEADER", text: "This reminded me that being ready isn't about isolation; it's about being positioned to be the hands and feet of Christ in a crisis." },
                { author: "JOHN C.", title: "OUTDOORSMAN", text: "Ditched the 'lone wolf' paranoia. This book actually focuses on what matters: water, medicine, and community." }
              ].map((rev, i) => (
                <div key={i} className="bg-[#0a0a0a] p-6 border border-zinc-800 rounded flex flex-col justify-between">
                  <div>
                    <div className="flex text-emerald-500 mb-3 gap-0.5">
                      {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-current" />)}
                    </div>
                    <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6">&quot;{rev.text}&quot;</p>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white tracking-widest">{rev.author}</div>
                    <div className="text-[9px] font-mono text-emerald-500 mt-1 uppercase">VERIFIED: {rev.title}</div>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE CHAPTER DOWNLOAD (Lead Gen) */}
      <section className="relative py-32 bg-[#000] overflow-hidden scanline-overlay">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-black to-black"></div>
        
        <div className="max-w-3xl mx-auto px-6 relative z-10 text-center reveal-on-scroll">
          <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">DECRYPT CHAPTER 1</h2>
          <p className="text-zinc-400 font-light mb-10 max-w-xl mx-auto">Enter your comm-link below to instantly receive the foundational chapter: &quot;The Theology of the Watchman&quot;.</p>

          <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-zinc-800 p-8 rounded-xl relative shadow-2xl">
            {downloadState === 'idle' && (
              <form onSubmit={handleDownload} className="space-y-4">
                <div className="relative">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/50" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#050505] border border-zinc-700 rounded pl-12 pr-4 py-4 text-emerald-400 font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-600"
                    placeholder="Enter email to begin transfer..."
                  />
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-sm tracking-[0.2em] py-4 rounded transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  INITIATE SECURE DOWNLOAD
                </button>
              </form>
            )}

            {downloadState === 'loading' && (
              <div className="py-8 flex flex-col items-center justify-center space-y-6">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 border-2 border-zinc-800 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                  <Radio className="w-6 h-6 text-emerald-500 animate-pulse" />
                </div>
                <div className="text-center font-mono">
                  <p className="text-emerald-400 text-sm mb-1">ENCRYPTING PAYLOAD...</p>
                  <p className="text-zinc-600 text-xs">BYPASSING FIREWALL</p>
                </div>
              </div>
            )}

            {downloadState === 'success' && (
              <div className="py-8 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-widest">TRANSMISSION SECURE</h3>
                <p className="text-zinc-400 text-sm text-center">Chapter 1 delivered to inbox. Verify spam protocols if not received.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. HIGH-CONVERSION LAUNCH BONUSES */}
      <section className="py-32 bg-[#050505] tactical-grid border-t border-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">PREORDER ASSETS</h2>
            <p className="text-amber-500 font-mono text-sm tracking-widest animate-pulse">WARNING: THESE ASSETS DISAPPEAR AT LAUNCH</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 reveal-on-scroll delay-100">
            {[
              { id: "01", icon: ShieldCheck, title: "THE 72-HOUR BLUEPRINT", val: "$47 VALUE", desc: "A printable, step-by-step physical action plan to secure your home's water and power baseline this exact weekend." },
              { id: "02", icon: Zap, title: "FORTRESS OS MASTERCLASS", val: "$97 VALUE", desc: "A 45-minute behind-the-scenes video showing exactly how a real 'Deep Pantry' and Comms system is organized." },
              { id: "03", icon: Users, title: "PRIVATE Q&A BRIEFING", val: "INVITE ONLY", desc: "An exclusive ticket to a live, closed-door preparedness workshop with the author prior to the book launch." }
            ].map((bonus) => (
              <div key={bonus.id} className="bonus-card bg-[#0a0a0a] border border-zinc-800 p-8 rounded hover:border-emerald-500/50 transition-all">
                <div className="flex justify-between items-start mb-8">
                  <bonus.icon className="w-10 h-10 text-emerald-500" />
                  <div className="text-3xl font-black text-zinc-800 font-mono">{bonus.id}</div>
                </div>
                <div className="text-[10px] font-mono text-amber-500 tracking-widest mb-2">{bonus.val}</div>
                <h3 className="font-bold text-white text-xl mb-4 tracking-tight">{bonus.title}</h3>
                <p className="text-zinc-400 text-sm font-light leading-relaxed">{bonus.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL PURCHASE BAR & FOOTER */}
      <section className="py-24 bg-[#0a0a0a] relative border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 text-center reveal-on-scroll">
          <h2 className="text-4xl md:text-6xl font-black mb-8 text-white tracking-tighter">SECURE YOUR HARDWARE</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {['Amazon', 'Barnes & Noble', 'Books-A-Million', 'Direct (Signed)'].map((retailer) => (
              <button key={retailer} className="bg-[#050505] hover:bg-zinc-900 border border-zinc-800 rounded p-6 flex flex-col items-center justify-center gap-3 transition-all transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)] group">
                <ShoppingCart className="w-6 h-6 text-zinc-600 group-hover:text-amber-500 transition-colors" />
                <span className="font-bold text-xs tracking-widest text-zinc-300 group-hover:text-white transition-colors">{retailer}</span>
              </button>
            ))}
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-4 text-left max-w-2xl mx-auto rounded flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-emerald-400 tracking-wider mb-1">CLAIM YOUR ASSETS</div>
              <div className="text-xs font-mono text-zinc-400">Forward your receipt to <span className="text-white">bonuses@saltandprepper.com</span> to instantly unlock your $150 digital deployment kit.</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#000] py-12 border-t border-zinc-900 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="font-bold text-xl tracking-widest flex items-center justify-center gap-2 mb-6 text-zinc-600">
            <Crosshair className="w-5 h-5 text-zinc-700" />
            <span>SALT & PREPPER</span>
          </div>
          <div className="text-[10px] font-mono text-zinc-700 tracking-widest uppercase space-y-2">
            <div>© {new Date().getFullYear()} Salt & Prepper. All rights reserved.</div>
            <div>Equipping the Watchmen • Systems Over Stress</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
