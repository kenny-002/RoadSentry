'use client';

import React from 'react';
import { useAppState } from '../context/StateContext';
import { AlertCircle, CheckCircle, Clock, Percent, ShieldAlert } from 'lucide-react';

export default function AnalyticsCards() {
  const { complaints } = useAppState();

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const assigned = complaints.filter(c => c.status === 'Assigned').length;
  
  const unresolved = total - resolved;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const cardConfig = [
    {
      title: 'Total Road Tickets',
      value: total,
      desc: 'Active & resolved items',
      icon: ShieldAlert,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Resolved Projects',
      value: resolved,
      desc: `${resolutionRate}% closure rate`,
      icon: CheckCircle,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Active Operations',
      value: inProgress + assigned,
      desc: `${inProgress} in progress, ${assigned} assigned`,
      icon: Clock,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Pending AI Sorting',
      value: pending,
      desc: 'Auto-routed to divisions',
      icon: AlertCircle,
      color: 'text-red-500 bg-red-500/10 border-red-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cardConfig.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx}
            className="glass-panel p-5 bg-opacity-65 dark:bg-opacity-25 border border-card-border flex items-center justify-between shadow-sm transition-all hover:scale-[1.01]"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <p className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
                {card.value}
              </p>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">
                {card.desc}
              </span>
            </div>
            
            <div className={`h-11 w-11 rounded-lg border flex items-center justify-center ${card.color}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
