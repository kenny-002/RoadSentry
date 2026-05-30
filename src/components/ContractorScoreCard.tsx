'use client';

import React from 'react';
import { useAppState } from '../context/StateContext';
import { HardHat, Star, CheckCircle, Clock, AlertTriangle, Hammer } from 'lucide-react';

export default function ContractorScoreCard() {
  const { contractors } = useAppState();

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 tag-premier';
    if (score >= 75) return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20 tag-standard';
    if (score >= 60) return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 tag-warning';
    return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 animate-pulse tag-watchlist';
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 90) return 'Class-A (Premier)';
    if (score >= 75) return 'Class-B (Standard)';
    if (score >= 60) return 'Class-C (Conditional)';
    return 'Class-D (Watchlist)';
  };

  return (
    <div className="glass-panel p-5 sm:p-6 bg-opacity-50 dark:bg-opacity-25 border border-card-border w-full flex flex-col gap-5">
      <div>
        <h3 className="font-extrabold text-lg text-slate-800 dark:text-white flex items-center gap-2">
          <HardHat className="h-5 w-5 text-amber-500" />
          <span>Contractor Performance Matrix</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Municipal contractor scorecard based on project audit ratings, budgets, and schedules</p>
      </div>

      {/* Contractors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {contractors.map((contractor) => (
          <div 
            key={contractor.id}
            className="p-4 bg-slate-100/50 dark:bg-navy-900/30 rounded-xl border border-slate-200/50 dark:border-navy-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-slate-100 dark:hover:bg-navy-900/40"
          >
            {/* Left: Name and class */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2.5">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{contractor.name}</span>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${getPerformanceBadge(contractor.score)}`}>
                  {getPerformanceLabel(contractor.score)}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center text-yellow-500 font-bold">
                  <Star className="h-3.5 w-3.5 mr-0.5 fill-yellow-500 text-yellow-500" />
                  {contractor.rating}
                </span>
                <span>•</span>
                <span>Active projects: {contractor.activeProjects}</span>
              </div>
            </div>

            {/* Right: Metrics */}
            <div className="flex items-center space-x-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <div>
                  <p className="text-[10px] text-slate-400">Completed</p>
                  <p className="font-extrabold text-slate-700 dark:text-slate-200">{contractor.completedProjects}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-[10px] text-slate-400">Delayed</p>
                  <p className={`font-extrabold ${contractor.delayedProjects > 0 ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
                    {contractor.delayedProjects}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-navy-800 pl-4">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Audit Score</p>
                  <p className="text-base font-black text-slate-600 dark:text-slate-400">{contractor.score}%</p>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
