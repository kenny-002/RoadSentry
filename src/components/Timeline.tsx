'use client';

import React from 'react';
import { Calendar, FileText, CheckCircle2, ChevronRight, HardHat, Eye, Star } from 'lucide-react';

export default function Timeline() {
  const steps = [
    {
      title: 'Budget Approval',
      desc: 'Sanctioned funds allocated from the state road budget.',
      duration: 'Week 1-2',
      status: 'completed',
    },
    {
      title: 'Tender Bidding',
      desc: 'Contractors submit audit reports, quality pledges, and competitive bids.',
      duration: 'Week 3-4',
      status: 'completed',
    },
    {
      title: 'Road Milling & Prep',
      desc: 'Old asphalt layer is milled down and subgrade base is structurally reinforced.',
      duration: 'Week 5',
      status: 'active',
    },
    {
      title: 'Bituminous Laying',
      desc: 'Hot-mix asphalt is laid, compacted with dynamic rollers, and cured.',
      duration: 'Week 6',
      status: 'upcoming',
    },
    {
      title: 'Inspection & Painting',
      desc: 'Reflective lane marking, core quality testing, and sign installations.',
      duration: 'Week 7',
      status: 'upcoming',
    },
    {
      title: 'Citizen Verification',
      desc: 'Road is marked open on Road Sentry; citizens confirm relay quality.',
      duration: 'Ongoing',
      status: 'upcoming',
    },
  ];

  const recentWorks = [
    {
      road: 'Mount Road (Anna Salai)',
      activity: 'Full relaying completed, core test passed.',
      date: '2025-08-12',
      contractor: 'Apex Infrastructure Ltd',
      status: 'Verified'
    },
    {
      road: 'ECR Express Link',
      activity: 'Minor trench restoration & painting.',
      date: '2025-03-05',
      contractor: 'Apex Infrastructure Ltd',
      status: 'Verified'
    },
    {
      road: 'Thiruvalluvar Lane',
      activity: 'Pothole patch relaying.',
      date: '2025-02-28',
      contractor: 'Metro Tech Builders',
      status: 'Verified'
    }
  ];

  return (
    <div className="glass-panel p-5 sm:p-6 bg-opacity-50 dark:bg-opacity-25 border border-card-border w-full flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h3 className="font-extrabold text-lg text-slate-800 dark:text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-slate-500" />
          <span>Relaying Lifecycle & Activity</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Timeline standards for municipal road works and recent completions</p>
      </div>

      {/* Grid: Left - Stepper timeline, Right - Recent completions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Step List */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 block mb-1">Standard 7-Week Project Lifecycle</span>
          
          <div className="relative border-l border-slate-200 dark:border-navy-800/80 ml-3 pl-6 space-y-5">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                {/* Connector Dot */}
                <span className={`absolute -left-[31px] top-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                  step.status === 'completed' 
                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                    : step.status === 'active'
                    ? 'bg-slate-500 border-slate-500 text-white animate-pulse'
                    : 'bg-white dark:bg-navy-950 border-slate-300 dark:border-navy-700 text-slate-400'
                }`}>
                  {step.status === 'completed' && <span className="h-1.5 w-1.5 rounded-full bg-white"></span>}
                  {step.status === 'active' && <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>}
                </span>

                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                    <h4 className="font-extrabold text-slate-800 dark:text-slate-200">{step.title}</h4>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{step.duration}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Work list */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-start">
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 block mb-2">Recently Relayed Roads</span>
            
            <div className="space-y-3.5">
              {recentWorks.map((work, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 bg-slate-100/50 dark:bg-navy-900/30 rounded-xl border border-slate-200/50 dark:border-navy-800/80 text-xs flex flex-col gap-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-800 dark:text-white leading-tight">{work.road}</span>
                    <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {work.status}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-snug">{work.activity}</p>
                  
                  <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 pt-1.5 border-t border-slate-200/50 dark:border-navy-800/60 font-semibold">
                    <span className="flex items-center gap-1">
                      <HardHat className="h-3 w-3 text-amber-500" />
                      <span>{work.contractor.split(' ')[0]}</span>
                    </span>
                    <span>{work.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
