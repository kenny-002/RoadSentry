'use client';

import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import { Search, Clock, UserCheck, ShieldCheck, CheckCircle2, ChevronRight, HelpCircle, Phone, Mail, AlertTriangle, History } from 'lucide-react';

interface StatusTrackerProps {
  initialSearchId?: string;
}

export default function StatusTracker({ initialSearchId = '' }: StatusTrackerProps) {
  const { complaints, authorities, roads, currentUser, userRole } = useAppState();
  const [searchId, setSearchId] = useState(initialSearchId);

  const myComplaints = React.useMemo(() => {
    if (!currentUser || userRole !== 'user') return [];
    return complaints.filter(c => {
      const emailMatch = c.reporterEmail && c.reporterEmail.toLowerCase() === currentUser.email.toLowerCase();
      const nameMatch = c.reporterName && c.reporterName.toLowerCase() === currentUser.name.toLowerCase();
      return emailMatch || nameMatch;
    });
  }, [complaints, currentUser, userRole]);
  const [activeComplaint, setActiveComplaint] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (id: string) => {
    setSearched(true);
    const cleanedId = id.trim().toUpperCase();
    const found = complaints.find(c => c.id === cleanedId);
    
    if (found) {
      const road = roads.find(r => r.id === found.roadId);
      const authority = authorities.find(a => a.id === found.assignedAuthorityId);
      setActiveComplaint({
        ...found,
        roadName: road ? road.name : 'Unknown Road segment',
        authorityName: authority ? authority.name : 'Unassigned Officer',
        authorityRole: authority ? authority.role : 'Division Engineer',
        authorityPhone: authority ? authority.phone : '+91 98450 XXXXX',
        authorityEmail: authority ? authority.email : 'support@roadwatch.gov'
      });
    } else {
      setActiveComplaint(null);
    }
  };

  // Sync initial search ID from query params or parent
  useEffect(() => {
    if (initialSearchId) {
      setSearchId(initialSearchId);
      handleSearch(initialSearchId);
    }
  }, [initialSearchId, complaints]);

  const steps = [
    { label: 'Pending', key: 'Pending', desc: 'AI parsed & registered' },
    { label: 'Assigned', key: 'Assigned', desc: 'Routed to Division head' },
    { label: 'In Progress', key: 'In Progress', desc: 'Repair crew active' },
    { label: 'Resolved', key: 'Resolved', desc: 'Verified & closed' }
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const statusOrder = ['Pending', 'Assigned', 'In Progress', 'Resolved'];
    const stepIdx = statusOrder.indexOf(stepKey);
    const currentIdx = statusOrder.indexOf(currentStatus);

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'upcoming';
  };

  return (
    <div className="glass-panel p-6 sm:p-8 bg-opacity-65 dark:bg-opacity-25 border border-card-border shadow-xl w-full flex flex-col gap-6 max-w-2xl mx-auto">
      
      {/* Search Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Track Ticket Progress</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Enter your 7-character complaint ticket ID to track repair operations</p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="e.g. RW-1001, RW-1002"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchId)}
              className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-navy-800 bg-white/70 dark:bg-navy-950/70 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-mono uppercase"
            />
          </div>
          <button
            onClick={() => handleSearch(searchId)}
            className="px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md"
          >
            Track
          </button>
        </div>
      </div>

      {searched ? (
        activeComplaint ? (
          // Found Ticket details
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Ticket General */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-navy-800/80 gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">MUNICIPAL ROAD TICKET</span>
                <div className="flex items-center space-x-2.5 mt-0.5">
                  <span className="font-black text-lg text-slate-800 dark:text-white font-mono">{activeComplaint.id}</span>
                  <span className="text-slate-400 dark:text-slate-600 font-bold">•</span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{activeComplaint.roadName}</span>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-left sm:text-right">
                <p>Logged: {activeComplaint.createdDate}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase mt-0.5 font-bold">Severity: {activeComplaint.severity}</p>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">Workflow Status</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2">
                {steps.map((step, idx) => {
                  const state = getStepStatus(step.label, activeComplaint.status);
                  return (
                    <div 
                      key={idx}
                      className={`p-3 rounded-xl border flex sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2.5 transition-all text-xs font-semibold ${
                        state === 'completed'
                          ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : state === 'active'
                          ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 glow-blue font-bold'
                          : 'bg-slate-100/40 dark:bg-navy-950/40 border-slate-200/50 dark:border-navy-850/50 text-slate-400 dark:text-slate-550'
                      }`}
                    >
                      <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-1 w-full">
                        <span className={`h-5 w-5 rounded-full flex items-center justify-center border text-[10px] font-bold ${
                          state === 'completed' 
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : state === 'active'
                            ? 'bg-blue-600 border-blue-600 text-white animate-pulse'
                            : 'bg-slate-200 dark:bg-navy-900 border-slate-300 dark:border-navy-800 text-slate-500'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-slate-700 dark:text-slate-200">{step.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 text-right sm:text-left block sm:mt-1">
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Officer details */}
            <div className="p-4 bg-slate-100/50 dark:bg-navy-900/30 rounded-xl border border-slate-200/50 dark:border-navy-800/80 space-y-3.5 text-xs">
              <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-blue-500" />
                <span>Assigned Officer Profiles</span>
              </h4>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-0.5">
                  <p className="font-extrabold text-sm text-slate-700 dark:text-white">{activeComplaint.authorityName}</p>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">{activeComplaint.authorityRole}</p>
                </div>
                
                <div className="flex gap-2 sm:gap-4 font-mono font-medium">
                  <a 
                    href={`tel:${activeComplaint.authorityPhone}`}
                    className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-blue-500"
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Call</span>
                  </a>
                  <a 
                    href={`mailto:${activeComplaint.authorityEmail}`}
                    className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-blue-500"
                  >
                    <Mail className="h-3.5 w-3.5 text-blue-500" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Maintenance Update Notes */}
            <div className="space-y-2.5 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">Department Resolution Notes</span>
              
              <div className="p-3.5 border border-slate-200 dark:border-navy-800 rounded-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {activeComplaint.notes ? (
                  <p>{activeComplaint.notes}</p>
                ) : (
                  <p className="italic text-slate-500 dark:text-slate-500">Ticket is currently queued. Preliminary site survey pending dispatch.</p>
                )}
              </div>
            </div>

          </div>
        ) : (
          // Error Search: Not Found
          <div className="text-center py-8 bg-red-500/5 border border-dashed border-red-500/10 rounded-xl animate-in zoom-in-95 duration-200">
            <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
            <h4 className="font-extrabold text-slate-800 dark:text-white text-base">Ticket ID Not Found</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1.5">
              Check spelling or credentials. Try standard mock tickets such as <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">RW-1001</span> or <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">RW-1002</span>.
            </p>
          </div>
        )
      ) : (
        // Prompt initial state
        <div className="text-center py-10 border border-dashed border-slate-200 dark:border-navy-800 rounded-xl">
          <HelpCircle className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-3 opacity-60" />
          <h4 className="font-extrabold text-slate-700 dark:text-slate-300 text-sm">Vigilance Database Online</h4>
          <p className="text-xs text-slate-500 dark:text-slate-500 max-w-xs mx-auto mt-1">
            Search for a registered complaint ticket ID to view progress logs, estimated resolution dates, and engineer assignees.
          </p>
          
          {/* Quick links */}
          <div className="flex justify-center gap-2 mt-4 text-[10px] font-bold">
            <button 
              onClick={() => { setSearchId('RW-1001'); handleSearch('RW-1001'); }}
              className="px-2.5 py-1 bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-850 hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-400 rounded"
            >
              Demo: RW-1001 (In Progress)
            </button>
            <button 
              onClick={() => { setSearchId('RW-1004'); handleSearch('RW-1004'); }}
              className="px-2.5 py-1 bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-850 hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-400 rounded"
            >
              Demo: RW-1004 (Resolved)
            </button>
          </div>
        </div>
      )}

      {/* User's Complaint History List */}
      {currentUser && userRole === 'user' && myComplaints.length > 0 && (
        <div className="border-t border-slate-200/60 dark:border-navy-800/80 pt-6 mt-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <History className="h-4 w-4 text-blue-500" />
              <span>Your Reported Complaints</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-full text-slate-500">
              {myComplaints.length} {myComplaints.length === 1 ? 'ticket' : 'tickets'}
            </span>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
            {myComplaints.map((c) => {
              const road = roads.find(r => r.id === c.roadId);
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSearchId(c.id);
                    handleSearch(c.id);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-semibold flex items-center justify-between gap-3 cursor-pointer ${
                    activeComplaint?.id === c.id
                      ? 'bg-blue-600/10 border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold shadow'
                      : 'bg-white/40 dark:bg-navy-950/40 border-slate-200/50 dark:border-navy-850/50 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-navy-900/60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-white font-mono">{c.id}</span>
                      <span className="text-slate-350 dark:text-slate-600 font-bold">•</span>
                      <span className="capitalize px-1.5 py-0.5 bg-slate-100 dark:bg-navy-900 text-[10px] rounded text-slate-500 dark:text-slate-400">
                        {c.issueType}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[280px] sm:max-w-md font-medium">
                      {road ? road.name : 'Unknown road'} — {c.description}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                      c.status === 'Resolved'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : c.status === 'In Progress'
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 animate-pulse'
                        : c.status === 'Assigned'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                        : 'bg-slate-100 dark:bg-navy-900 border-slate-200 dark:border-navy-800 text-slate-500 dark:text-slate-450'
                    }`}>
                      {c.status}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
