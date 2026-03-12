"use client";
import React, { useState } from 'react';
import TopHeader from '@/components/layout/TopHeader';
import Sidebar from '@/components/layout/Sidebar';
import CircularProgress from '@/components/ui/CircularProgress';
import HalfCircularProgress from '@/components/ui/HalfCircularProgress';
import { TacticalButton } from '@/components/ui/TacticalButton';
import { LayoutDashboard, Droplet, Zap, Shield, HeartPulse, CheckSquare, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import Input, { Select } from '@/components/ui/Input';

export default function PreparednessDashboard() {
  const [activeTab, setActiveTab] = useState("PREPAREDNESS SCORE & ACTION CHECKLIST");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { icon: <LayoutDashboard size={18} />, label: "PREPAREDNESS SCORE & ACTION CHECKLIST", active: activeTab === "PREPAREDNESS SCORE & ACTION CHECKLIST", onClick: () => setActiveTab("PREPAREDNESS SCORE & ACTION CHECKLIST") },
    { icon: <Droplet size={18} />, label: "FOOD & WATER", active: activeTab === "FOOD & WATER", onClick: () => setActiveTab("FOOD & WATER") },
    { icon: <Zap size={18} />, label: "POWER & COMM", active: activeTab === "POWER & COMM", onClick: () => setActiveTab("POWER & COMM") },
    { icon: <Shield size={18} />, label: "SECURITY", active: activeTab === "SECURITY", onClick: () => setActiveTab("SECURITY") },
    { icon: <HeartPulse size={18} />, label: "MEDICAL", active: activeTab === "MEDICAL", onClick: () => setActiveTab("MEDICAL") },
    { icon: <BookOpen size={18} />, label: "SALT & PREPPER BOOK", active: activeTab === "SALT & PREPPER BOOK", onClick: () => setActiveTab("SALT & PREPPER BOOK") },
  ];

  const overallScore = 68; // Mock calculated score

  const nextActions = [
    { id: 1, text: "Acquire 50W Solar Panel for comms backup", domain: "POWER & COMM", done: false },
    { id: 2, text: "Rotate stored water (6 months due)", domain: "FOOD & WATER", done: true },
    { id: 3, text: "Update Family Medical Kits", domain: "MEDICAL", done: false },
    { id: 4, text: "Establish secondary radio frequency plan", domain: "POWER & COMM", done: false },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden text-text-body bg-bg tactical-grid">
      <TopHeader title="PREPAREDNESS" subtitle="TACTICAL SIMULATION PROTOCOL V4.2" onMobileMenuToggle={() => setSidebarOpen(!sidebarOpen)} isMobileMenuOpen={sidebarOpen} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={sidebarItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full relative">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-deep/20 blur-[150px] rounded-full pointer-events-none" />

          <div className="max-w-[1200px] mx-auto relative z-10">
            {activeTab === "PREPAREDNESS SCORE & ACTION CHECKLIST" && (
              <div className="grid grid-cols-12 gap-6">
                {/* Main Score - Large Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                  className="col-span-12 lg:col-span-6 glass-panel p-6 md:p-10 flex flex-col items-center justify-center relative shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]"
                >
                  <h2 className="absolute top-4 left-4 md:top-6 md:left-8 text-[10px] md:text-[11px] text-text-heading uppercase tracking-[0.2em] font-bold opacity-80">READINESS SCORE (Across 7 Domains)</h2>

                  <div className="mt-8 mb-8 scale-110">
                    <CircularProgress percentage={overallScore} />
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-bold tracking-widest uppercase mb-1 text-text-body">
                      STATUS: <span className="text-warning">NEEDS IMPROVEMENT</span>
                    </p>
                    <p className="text-xs text-text-muted mt-2 tracking-widest">
                      Projected Duration: <span className="text-text-heading font-bold">14 Days</span>
                    </p>
                  </div>
                </motion.div>

                {/* Actions & Focus */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="col-span-12 lg:col-span-6 flex flex-col space-y-6">
                  <div className="glass-panel-active p-6 flex-1">
                    <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase text-accent mb-4 flex items-center space-x-2">
                      <CheckSquare size={16} />
                      <span>NEXT ACTIONS CHECKLIST</span>
                    </h3>
                    <div className="space-y-3">
                      {nextActions.map((action) => (
                        <div key={action.id} className="flex items-start space-x-3 text-sm tracking-wider bg-surface/50 p-3 rounded-md border border-border/50">
                          <div className="mt-0.5">
                            {action.done ? <CheckSquare size={16} className="text-accent" /> : <div className="w-4 h-4 border border-text-muted rounded-[2px]" />}
                          </div>
                          <div className="flex-1">
                            <p className={action.done ? "text-text-muted line-through" : "text-text-body"}>{action.text}</p>
                            <p className="text-[10px] text-accent mt-1 opacity-80 uppercase tracking-widest">{action.domain}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-panel border-warning/30 bg-warning-deep/20 p-5">
                    <h3 className="text-[10px] font-bold tracking-widest text-warning uppercase flex items-center mb-2">
                      <ArrowRight size={14} className="mr-2" />
                      30-DAY FOCUS RECOMMENDATION
                    </h3>
                    <p className="text-xs text-text-body leading-relaxed">
                      Based on your current Readiness Score of {overallScore}%, your weakest link is <strong className="text-text-heading">Power & Comm</strong>. Focus your resources on establishing a robust communication protocol and secondary power backups over the next 30 days to significantly elevate your overall survivability rating.
                    </p>
                  </div>
                </motion.div>

                {/* Minor Score Cards */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="col-span-12 md:col-span-4 glass-panel p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Droplet size={16} className="text-accent" />
                    <h3 className="text-[11px] font-bold tracking-widest uppercase text-text-heading">FOOD & WATER</h3>
                  </div>
                  <HalfCircularProgress percentage={70} size={150} strokeWidth={10} />
                  <div className="mt-8 text-xs tracking-wider space-y-2">
                    <p><span className="text-accent font-bold">14 Days</span> Supply</p>
                    <p className="text-text-muted">Water Purification: <span className="text-accent font-bold">OK</span></p>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="col-span-12 md:col-span-4 glass-panel border-warning/30 p-6">
                  <div className="flex items-center space-x-2 mb-6 text-warning">
                    <Zap size={16} />
                    <h3 className="text-[11px] font-bold tracking-widest uppercase">POWER & COMM</h3>
                  </div>
                  <div className="scale-105 origin-center">
                    <HalfCircularProgress percentage={45} size={160} strokeWidth={12} color="#f59e0b" />
                  </div>
                  <div className="mt-8 text-xs tracking-wider space-y-2">
                    <p className="text-text-muted">Solar/Battery: <span className="text-warning font-bold">LOW</span></p>
                    <p className="text-text-muted">Radio Net: <span className="text-warning font-bold">COMPROMISED</span></p>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="col-span-12 md:col-span-4 glass-panel p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Shield size={16} className="text-accent" />
                    <h3 className="text-[11px] font-bold tracking-widest uppercase text-text-heading">SECURITY</h3>
                  </div>
                  <HalfCircularProgress percentage={85} size={150} strokeWidth={10} />
                  <div className="mt-8 text-xs tracking-wider space-y-2">
                    <p className="text-text-muted">Perimeter: <span className="text-accent font-bold">SECURE</span></p>
                    <p className="text-text-muted">Threat Level: <span className="text-accent font-bold">LOW</span></p>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === "FOOD & WATER" && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-panel p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <Droplet size={24} className="text-accent" />
                      <h2 className="text-lg font-black tracking-widest uppercase text-text-heading">WATER SECURITY</h2>
                    </div>
                    <div className="space-y-4">
                      <Input label="Target" value="14 gallons per person (2-week supply)" readOnly disabled />
                      <Input label="Current Storage (Gallons)" type="number" placeholder="e.g. 56 gallons in WaterBricks" />
                      <Select label="Purification System" value="gravity" onChange={() => { }}>
                        <option value="gravity">Gravity Filter (Berkey/Propur)</option>
                        <option value="mobile">Mobile Filter (LifeStraw/Sawyer)</option>
                        <option value="chemical">Chemical (Bleach/Tablets)</option>
                      </Select>
                    </div>
                  </div>
                  <div className="glass-panel p-8 border-accent/20">
                    <div className="flex items-center space-x-3 mb-6">
                      <Droplet size={24} className="text-accent opacity-50" />
                      <h2 className="text-lg font-black tracking-widest uppercase text-text-heading">FOOD STORAGE</h2>
                    </div>
                    <div className="space-y-4">
                      <Input label="72-Hour Load (Go-Bags)" placeholder="High-calorie, no-cook rations (SOS bars, MREs)" />
                      <Input label="Deep Pantry (Working)" placeholder="90-day supply, FIFO rotation" />
                      <Input label="Long-Term Reserve" placeholder="Bulk staples in Mylar bags with O2 absorbers" />
                    </div>
                  </div>
                </div>
                <div className="glass-panel-active p-6">
                  <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase text-accent mb-4 flex items-center space-x-2">
                    <CheckSquare size={16} />
                    <span>ACTIONABLE CHECKLIST</span>
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Rotate stored water every 6 months",
                      "Complete the \"Powerless Kitchen Drill\" (cook a pantry meal without grid power)",
                      "Execute the \"72-Hour Water Shutoff Drill\" to test filtration and rationing"
                    ].map((text, i) => (
                      <div key={i} className="flex items-start space-x-3 text-sm tracking-wider bg-surface/50 p-3 rounded-md border border-border/50 cursor-pointer hover:border-accent/30 transition-colors">
                        <div className="mt-0.5"><div className="w-4 h-4 border border-text-muted rounded-[2px]" /></div>
                        <div className="flex-1"><p className="text-text-body">{text}</p></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <TacticalButton variant="primary">SAVE CONFIGURATION</TacticalButton>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "POWER & COMM" && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-panel p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <Zap size={24} className="text-warning" />
                      <h2 className="text-lg font-black tracking-widest uppercase text-warning">POWER GENERATION</h2>
                    </div>
                    <div className="space-y-4">
                      <Input label="Immediate Illumination" placeholder="Headlamps for every family member (hands-free)" />
                      <Select label="Sustained Power" value="solar" onChange={() => { }}>
                        <option value="solar">LiFePO4 Solar Generator</option>
                        <option value="gas">Gas Generator</option>
                        <option value="hybrid">Hybrid System</option>
                      </Select>
                      <Input label="Thermal Retention" placeholder="Indoor-safe propane heaters, thermal curtains, CO detectors" />
                    </div>
                  </div>
                  <div className="glass-panel p-8 border-warning/20">
                    <div className="flex items-center space-x-3 mb-6">
                      <Zap size={24} className="text-warning opacity-50" />
                      <h2 className="text-lg font-black tracking-widest uppercase text-warning">COMM/INTEL NETWORKS</h2>
                    </div>
                    <div className="space-y-4">
                      <Input label="OSINT Receiver" placeholder="NOAA Emergency Weather radio (hand-crank/battery)" />
                      <Input label="Mesh Network (Level 4/5 Advanced)" placeholder="LoRa devices (Meshtastic) for off-grid texting" />
                    </div>
                  </div>
                </div>
                <div className="glass-panel-active p-6">
                  <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase text-warning mb-4 flex items-center space-x-2">
                    <CheckSquare size={16} />
                    <span>ACTIONABLE CHECKLIST</span>
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Execute the \"Top-Off Routine\" (Charge all battery banks on the 1st of the month)",
                      "Test generator under load for 15 minutes quarterly",
                      "Complete the \"Main Breaker Drop Drill\" (kill power at 6 PM, navigate evening on backup)"
                    ].map((text, i) => (
                      <div key={i} className="flex items-start space-x-3 text-sm tracking-wider bg-surface/50 p-3 rounded-md border border-border/50 cursor-pointer hover:border-warning/30 transition-colors">
                        <div className="mt-0.5"><div className="w-4 h-4 border border-text-muted rounded-[2px]" /></div>
                        <div className="flex-1"><p className="text-text-body">{text}</p></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <TacticalButton variant="secondary" className="border-warning/50 text-warning hover:bg-warning/10">UPDATE PROTOCOLS</TacticalButton>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "SECURITY" && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="glass-panel p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Shield size={24} className="text-accent" />
                    <h2 className="text-lg font-black tracking-widest uppercase text-text-heading">PERIMETER SYSTEM (CPTED)</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <Input label="Outer Ring (Deterrence)" placeholder="Motion-sensor LED floodlights, thorny landscaping under windows" />
                    <Input label="Middle Ring (Hardening)" placeholder="3\u0022 or 4\u0022 screws in strike plates, shatter-film on glass" />
                    <Input label="Inner Ring (Safe Room)" placeholder="Solid-core door with deadbolt, staged defense tools, trauma kit" />
                  </div>
                  <div className="mt-8 flex justify-end">
                    <TacticalButton variant="primary">SECURE PERIMETER</TacticalButton>
                  </div>
                </div>
                <div className="glass-panel-active p-6">
                  <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase text-accent mb-4 flex items-center space-x-2">
                    <CheckSquare size={16} />
                    <span>ACTIONABLE CHECKLIST</span>
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Upgrade all exterior door strike plates with 3+ inch screws into the wall stud",
                      "Establish the \"9 PM Routine\" (Mechanically check all locks and lights nightly)",
                      "Complete the \"2 AM Intruder Walkthrough\" to identify property blind spots"
                    ].map((text, i) => (
                      <div key={i} className="flex items-start space-x-3 text-sm tracking-wider bg-surface/50 p-3 rounded-md border border-border/50 cursor-pointer hover:border-accent/30 transition-colors">
                        <div className="mt-0.5"><div className="w-4 h-4 border border-text-muted rounded-[2px]" /></div>
                        <div className="flex-1"><p className="text-text-body">{text}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "MEDICAL" && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="glass-panel p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <HeartPulse size={24} className="text-error" />
                    <h2 className="text-lg font-black tracking-widest uppercase text-error">AUSTERE MEDICINE & TCCC</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <Input label="Trauma (IFAK)" placeholder="CAT/SOF-T Tourniquets, hemostatic gauze, chest seals" />
                    <Input label="Austere Medicine Backup" placeholder="90-day daily prescriptions, broad-spectrum OTCs" />
                    <Input label="Hygiene/Sanitation" placeholder="Off-grid toilet kit (5-gal bucket, contractor bags, sawdust)" />
                  </div>
                  <div className="mt-8 flex justify-end">
                    <TacticalButton variant="secondary" className="border-error/50 text-error hover:bg-error/10">LOG RESOURCES</TacticalButton>
                  </div>
                </div>
                <div className="glass-panel-active p-6">
                  <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase text-error mb-4 flex items-center space-x-2">
                    <CheckSquare size={16} />
                    <span>ACTIONABLE CHECKLIST</span>
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Separate the Trauma Kit from the basic First-Aid kit and stage it in a highly accessible area",
                      "Check expiration dates on hemostatic gauze and medications bi-annually",
                      "Complete the \"Dark Room Trauma Drill\" (apply a tourniquet in under 30 seconds in the dark)"
                    ].map((text, i) => (
                      <div key={i} className="flex items-start space-x-3 text-sm tracking-wider bg-surface/50 p-3 rounded-md border border-border/50 cursor-pointer hover:border-error/30 transition-colors">
                        <div className="mt-0.5"><div className="w-4 h-4 border border-text-muted rounded-[2px]" /></div>
                        <div className="flex-1"><p className="text-text-body">{text}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "SALT & PREPPER BOOK" && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="w-full h-[calc(100vh-180px)] glass-panel overflow-hidden relative shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]"
              >
                <div className="absolute inset-0 bg-accent/5 pointer-events-none z-10" />
                <iframe 
                  src="/docs/Salt_and_Prepper_Book.pdf" 
                  className="w-full h-full border-none relative z-20"
                  title="Salt & Prepper Book"
                />
              </motion.div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
