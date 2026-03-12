"use client";
import React, { useState } from 'react';
import TopHeader from '@/components/layout/TopHeader';
import Sidebar from '@/components/layout/Sidebar';
import { TacticalButton } from '@/components/ui/TacticalButton';
import { Users, Contact, MessageSquareText, FileText, CheckCircle2, ShieldAlert, CircleDashed, Plus, Copy, Trash2, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from "clsx";
import Input, { Select } from '@/components/ui/Input';

type Status = 'safe' | 'unreachable' | 'checking';

interface FamilyMember {
    id: string;
    name: string;
    role: string;
    status: Status;
    group: 'immediate' | 'parents' | 'extended';
}

export default function CirclesTacticalView() {
    const [activeTab, setActiveTab] = useState("FAMILY CIRCLES");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const sidebarItems = [
        { icon: <Users size={18} />, label: "FAMILY CIRCLES", active: activeTab === "FAMILY CIRCLES", onClick: () => setActiveTab("FAMILY CIRCLES") },
        { icon: <Contact size={18} />, label: "CONTACT STATUS", active: activeTab === "CONTACT STATUS", onClick: () => setActiveTab("CONTACT STATUS") },
        { icon: <MessageSquareText size={18} />, label: "COMMUNICATION PLAN", active: activeTab === "COMMUNICATION PLAN", onClick: () => setActiveTab("COMMUNICATION PLAN") },
        { icon: <FileText size={18} />, label: "RESOURCE SHARING", active: activeTab === "RESOURCE SHARING", onClick: () => setActiveTab("RESOURCE SHARING") },
    ];

    const [members, setMembers] = useState<FamilyMember[]>([
        { id: '1', name: "John", role: "Dad", status: "safe", group: "immediate" },
        { id: '2', name: "Sarah", role: "Mom", status: "safe", group: "immediate" },
        { id: '3', name: "Leo", role: "Son", status: "safe", group: "immediate" },
        { id: '4', name: "Robert", role: "Grandpa", status: "unreachable", group: "parents" },
        { id: '5', name: "Mary", role: "Grandma", status: "unreachable", group: "parents" },
        { id: '6', name: "David", role: "Grandpa", status: "safe", group: "parents" },
        { id: '7', name: "Linda", role: "Grandma", status: "safe", group: "parents" },
        { id: '8', name: "Uncle Joe", role: "Uncle", status: "checking", group: "extended" },
        { id: '9', name: "Aunt Karen", role: "Aunt", status: "checking", group: "extended" },
        { id: '10', name: "Cousin Tim", role: "Cousin", status: "safe", group: "extended" },
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newRole, setNewRole] = useState("");
    const [newGroup, setNewGroup] = useState<'immediate' | 'parents' | 'extended'>('immediate');
    const [newStatus, setNewStatus] = useState<Status>('safe');

    const [linkCopied, setLinkCopied] = useState(false);

    const handleCopyLink = () => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const handleAddMember = () => {
        if (!newName.trim()) return;
        setMembers([...members, {
            id: Date.now().toString(),
            name: newName,
            role: newRole,
            group: newGroup,
            status: newStatus
        }]);
        setNewName("");
        setNewRole("");
        setIsAdding(false);
    };

    const removeMember = (id: string) => {
        setMembers(members.filter(m => m.id !== id));
    };

    const ItemContact = ({ member }: { member: FamilyMember }) => (
        <div className="flex items-center justify-between text-sm tracking-wider my-3 p-3 bg-surface/50 rounded-md border border-border/50 group hover:border-accent/30 transition-colors">
            <div className="flex items-center space-x-3">
                {member.status === 'safe' && <CheckCircle2 size={16} className="text-accent" />}
                {member.status === 'unreachable' && <ShieldAlert size={16} className="text-warning" />}
                {member.status === 'checking' && <CircleDashed size={16} className="text-text-muted animate-spin-slow" />}
                <span className={clsx(
                    "font-bold",
                    member.status === 'safe' ? "text-text-body" : member.status === 'unreachable' ? "text-warning opacity-80" : "text-text-muted"
                )}>
                    {member.name} {member.role && <span className="text-text-muted font-normal">({member.role})</span>}
                    <span className="mx-2">-</span>
                    <span className={clsx(
                        "uppercase tracking-widest text-xs",
                        member.status === 'safe' ? "text-accent" : member.status === 'unreachable' ? "text-warning" : "text-text-muted"
                    )}>{member.status}</span>
                </span>
            </div>
            <button onClick={() => removeMember(member.id)} className="text-text-muted hover:text-warning opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={14} />
            </button>
        </div>
    );

    const immediate = members.filter(m => m.group === 'immediate');
    const parents = members.filter(m => m.group === 'parents');
    const extended = members.filter(m => m.group === 'extended');

    return (
        <div className="flex flex-col h-screen overflow-hidden text-text-body bg-bg tactical-grid">
            <TopHeader title="GRID DOWN" subtitle="TACTICAL SIMULATION PROTOCOL V4.2" onMobileMenuToggle={() => setSidebarOpen(!sidebarOpen)} isMobileMenuOpen={sidebarOpen} />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar items={sidebarItems} title="TACTICAL NAVIGATION" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full relative">
                    <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-accent-deep/15 blur-[120px] rounded-full pointer-events-none" />

                    <div className="max-w-[1200px] mx-auto relative z-10">

                        {activeTab === "FAMILY CIRCLES" && (
                            <>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-[12px] font-black tracking-widest uppercase flex items-center space-x-2 text-text-heading">
                                        <Users size={18} className="text-accent" />
                                        <span>FAMILY CIRCLES TACTICAL VIEW</span>
                                    </motion.h2>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                                        <button onClick={handleCopyLink} className="flex items-center justify-center space-x-2 text-xs font-bold tracking-widest uppercase text-accent border border-accent/50 px-4 py-2 rounded shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:bg-accent/10 transition-colors">
                                            {linkCopied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                            <span>{linkCopied ? "INVITE LINK COPIED" : "GENERATE INVITE LINK"}</span>
                                        </button>
                                        <button onClick={() => setIsAdding(!isAdding)} className="flex items-center justify-center space-x-2 text-xs font-bold tracking-widest uppercase bg-accent text-black px-4 py-2 rounded shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:bg-accent-bright transition-colors">
                                            <Plus size={14} />
                                            <span>ADD FAMILY</span>
                                        </button>
                                    </div>
                                </div>

                                {isAdding && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 mb-8 flex flex-col md:flex-row gap-4 items-end border-accent/30">
                                        <Input value={newName} onChange={e => setNewName(e.target.value)} label="Name" placeholder="e.g. John Doe" />
                                        <Input value={newRole} onChange={e => setNewRole(e.target.value)} label="Role (Optional)" placeholder="e.g. Brother" />
                                        <Select label="Group" value={newGroup} onChange={e => setNewGroup(e.target.value as any)}>
                                            <option value="immediate">Immediate Family</option>
                                            <option value="parents">Parents & In-Laws</option>
                                            <option value="extended">Extended Circle</option>
                                        </Select>
                                        <Select label="Status" value={newStatus} onChange={e => setNewStatus(e.target.value as any)}>
                                            <option value="safe">Safe</option>
                                            <option value="unreachable">Unreachable</option>
                                            <option value="checking">Checking</option>
                                        </Select>
                                        <TacticalButton variant="secondary" onClick={handleAddMember} className="w-full md:w-auto !h-[38px] !px-8 !py-0">SAVE</TacticalButton>
                                    </motion.div>
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel-active p-6">
                                        <div className="flex justify-between items-center mb-4 border-b border-accent/30 pb-4">
                                            <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-text-heading">IMMEDIATE FAMILY <span className="text-accent">({immediate.filter(m => m.status === 'safe').length}/{immediate.length} SAFE)</span></h3>
                                            <FileText size={14} className="text-accent" />
                                        </div>
                                        <div className="space-y-1">
                                            {immediate.length === 0 && <p className="text-sm text-text-muted italic py-2">No members added.</p>}
                                            {immediate.map(member => <ItemContact key={member.id} member={member} />)}
                                        </div>
                                    </motion.div>

                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 border-warning/50 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]">
                                        <div className="flex justify-between items-center mb-4 border-b border-warning/30 pb-4">
                                            <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-text-heading">PARENTS & IN-LAWS <span className="text-warning">({parents.filter(m => m.status === 'unreachable').length}/{parents.length} UNREACHABLE)</span></h3>
                                            <FileText size={14} className="text-warning" />
                                        </div>
                                        <div className="space-y-1">
                                            {parents.length === 0 && <p className="text-sm text-text-muted italic py-2">No members added.</p>}
                                            {parents.map(member => <ItemContact key={member.id} member={member} />)}
                                        </div>
                                    </motion.div>

                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-6 lg:col-span-2">
                                        <div className="flex justify-between items-center mb-4 border-b border-border/50 pb-4">
                                            <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-text-heading">EXTENDED CIRCLE <span className="text-text-muted">({extended.filter(m => m.status === 'checking').length}/{extended.length} CHECKING)</span></h3>
                                            <FileText size={14} className="text-text-muted" />
                                        </div>
                                        <div className="space-y-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                                            {extended.length === 0 && <p className="text-sm text-text-muted italic py-2">No members added.</p>}
                                            {extended.map(member => <ItemContact key={member.id} member={member} />)}
                                        </div>
                                    </motion.div>

                                </div>
                            </>
                        )}


                        {activeTab === "CONTACT STATUS" && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                                <div className="glass-panel p-8">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <Contact size={24} className="text-accent" />
                                        <h2 className="text-lg font-black tracking-widest uppercase text-text-heading">CONTACT STATUS TRACKER</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input label="Member Name & Role" placeholder="e.g. John Doe (Immediate Neighbor)" />
                                        <Select label="Current Status" value="safe" onChange={() => { }}>
                                            <option value="safe">Secure</option>
                                            <option value="checking">Needs Assistance</option>
                                            <option value="transit">In Transit</option>
                                            <option value="unreachable">Unknown</option>
                                        </Select>
                                        <Input label="Last Known Location/Coords" placeholder="e.g. GPS Coords or Physical Address" />
                                        <Input label="Primary Contact" placeholder="Cell Phone Number" />
                                        <div className="md:col-span-2">
                                            <Input label="Out-of-State Emergency Contact" placeholder="Name and Phone Number (Liaison)" />
                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-end">
                                        <TacticalButton variant="primary">UPDATE STATUS</TacticalButton>
                                    </div>
                                </div>
                                <div className="glass-panel-active p-6">
                                    <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase text-accent mb-4 flex items-center space-x-2">
                                        <CheckSquare size={16} />
                                        <span>ACTIONABLE CHECKLIST</span>
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            "Assign Out-of-State Emergency Contact",
                                            "Print physical copies of the Pastoral/Community Contact Plan",
                                            "Add physical contact list to every family member's 72-Hour Go-Bag"
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

                        {activeTab === "COMMUNICATION PLAN" && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                                <div className="glass-panel p-8">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <MessageSquareText size={24} className="text-accent" />
                                        <h2 className="text-lg font-black tracking-widest uppercase text-text-heading">COMMUNICATION PROTOCOL</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <Input label="The Comm-Silence Protocol Trigger" placeholder="e.g. 'If cell service drops for > 1 hour'" />
                                        </div>
                                        <Input label="Primary Rally Point" placeholder="e.g. The house" />
                                        <Input label="Secondary Rally Point" placeholder="e.g. Grandma's house, 5 miles North" />
                                        <Input label="Local Tactical Comms" placeholder="e.g. FRS/GMRS Channel 4, Privacy Code 12" />
                                        <Select label="Scheduled Comms Window" value="hourly" onChange={() => { }}>
                                            <option value="hourly">Top of the hour</option>
                                            <option value="3hours">Every 3 hours</option>
                                            <option value="morning_evening">Morning/Evening only</option>
                                        </Select>
                                    </div>
                                    <div className="mt-8 flex justify-end">
                                        <TacticalButton variant="primary">SAVE PROTOCOL</TacticalButton>
                                    </div>
                                </div>
                                <div className="glass-panel-active p-6">
                                    <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase text-accent mb-4 flex items-center space-x-2">
                                        <CheckSquare size={16} />
                                        <span>ACTIONABLE CHECKLIST</span>
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            "Acquire FRS/GMRS walkie-talkies for local line-of-sight comms",
                                            "Tape designated radio channel and comms window schedule to the back of all radios",
                                            "Rehearse Primary and Secondary Rally Point driving/walking routes"
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

                        {activeTab === "RESOURCE SHARING" && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                                <div className="glass-panel p-8">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <FileText size={24} className="text-accent" />
                                        <h2 className="text-lg font-black tracking-widest uppercase text-text-heading">SOCIAL CAPITAL & ASSET MAP</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        <Input label="Member Skills (The Asset Map)" placeholder="e.g. First Aid/TCCC, Mechanical Repair, Ham Radio, Security, Plumbing" />
                                        <Input label="Shared Hardware Inventory" placeholder="e.g. Neighbor John has a chainsaw, Uncle Mark has a 6000W generator" />
                                        <Input label="The Charity Stockpile" placeholder="Percentage or amount designated for Neutral Zone distribution" />
                                    </div>
                                    <div className="mt-8 flex justify-end">
                                        <TacticalButton variant="primary">UPDATE ASSETS</TacticalButton>
                                    </div>
                                </div>
                                <div className="glass-panel-active p-6">
                                    <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase text-accent mb-4 flex items-center space-x-2">
                                        <CheckSquare size={16} />
                                        <span>ACTIONABLE CHECKLIST</span>
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            "Complete the \"Neighbor Asset Map\" (identify skills of 5 closest neighbors)",
                                            "Separate 10% of total preps into a clearly labeled \"Charity Stockpile\"",
                                            "Establish a physical \"Neutral Zone\" (e.g. end of driveway) for safe aid distribution"
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

                    </div>
                </main>
            </div>
        </div>
    );
}
