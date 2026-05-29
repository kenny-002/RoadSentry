'use client';

import React from 'react';
import { Road } from '../data/mockData';
import { useAppState } from '../context/StateContext';
import { FileSpreadsheet, HardHat, TrendingUp, Calendar, AlertTriangle, ShieldCheck, Plus, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';

interface RoadDetailsPanelProps {
  road: Road;
  onClose: () => void;
}

export default function RoadDetailsPanel({ road, onClose }: RoadDetailsPanelProps) {
  const { contractors, complaints, authorities } = useAppState();

  const contractor = contractors.find(c => c.id === road.contractorId);
  const roadComplaints = complaints.filter(c => c.roadId === road.id);

  // Condition styling helpers
  const getConditionStyle = (condition: Road['condition']) => {
    switch (condition) {
      case 'Good':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Moderate':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      case 'Damaged':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'Critical':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 animate-pulse';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  // Budget calculations
  const budgetOverrun = road.spentAmount - road.sanctionedAmount;
  const isOverrun = budgetOverrun > 0;
  const percentVariance = Math.abs((budgetOverrun / road.sanctionedAmount) * 100).toFixed(1);

  return (
    <div className="glass-panel p-6 flex flex-col h-full bg-opacity-65 dark:bg-opacity-35 border border-card-border overflow-y-auto no-scrollbar max-w-full">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-navy-800/80">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-500">{road.type} Highway System</span>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">{road.name}</h2>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getConditionStyle(road.condition)}`}>
              {road.condition}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Length: {road.lengthKm} KM</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors text-xs font-bold"
        >
          ✕
        </button>
      </div>

      {/* Main Stats Segment */}
      <div className="grid grid-cols-2 gap-4 py-5 border-b border-slate-200 dark:border-navy-800/80">
        <div className="bg-slate-100/50 dark:bg-navy-900/40 p-3 rounded-lg border border-slate-200/50 dark:border-navy-800/50">
          <div className="flex items-center text-slate-400 dark:text-slate-500 mb-1">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Last Relayed</span>
          </div>
          <span className="text-sm font-bold text-slate-800 dark:text-white">{road.lastRelayingDate}</span>
        </div>
        
        <div className="bg-slate-100/50 dark:bg-navy-900/40 p-3 rounded-lg border border-slate-200/50 dark:border-navy-800/50">
          <div className="flex items-center text-slate-400 dark:text-slate-500 mb-1">
            <TrendingUp className="h-3.5 w-3.5 mr-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Relay Health</span>
          </div>
          <span className="text-sm font-bold text-slate-800 dark:text-white">
            {road.condition === 'Good' ? 'Optimal' : road.condition === 'Moderate' ? 'Fair' : 'Requires Work'}
          </span>
        </div>
      </div>

      {/* Contractor Details */}
      <div className="py-5 border-b border-slate-200 dark:border-navy-800/80">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
          <HardHat className="h-4 w-4 text-amber-500" />
          <span>Assigned Contractor</span>
        </h3>
        
        {contractor ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-extrabold text-slate-700 dark:text-white">{contractor.name}</span>
              <div className="bg-blue-600/10 px-2 py-0.5 rounded border border-blue-500/20 text-blue-500 text-[10px] font-bold">
                SCORE: {contractor.score}/100
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-100/40 dark:bg-navy-950/40 py-2 rounded border border-slate-200/40 dark:border-navy-800/40">
                <p className="text-[10px] text-slate-400">Rating</p>
                <p className="font-bold text-slate-700 dark:text-slate-300">{contractor.rating} ★</p>
              </div>
              <div className="bg-slate-100/40 dark:bg-navy-950/40 py-2 rounded border border-slate-200/40 dark:border-navy-800/40">
                <p className="text-[10px] text-slate-400">Completed</p>
                <p className="font-bold text-emerald-500">{contractor.completedProjects}</p>
              </div>
              <div className="bg-slate-100/40 dark:bg-navy-950/40 py-2 rounded border border-slate-200/40 dark:border-navy-800/40">
                <p className="text-[10px] text-slate-400">Delayed</p>
                <p className="font-bold text-red-500">{contractor.delayedProjects}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">No contractor assigned.</p>
        )}
      </div>

      {/* Budget Breakdown */}
      <div className="py-5 border-b border-slate-200 dark:border-navy-800/80">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
          <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
          <span>Budget & Funding</span>
        </h3>
        
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Sanctioned Amount:</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">₹{road.sanctionedAmount} Lakhs</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Spent Amount:</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">₹{road.spentAmount} Lakhs</span>
          </div>
          <div className="flex justify-between items-center pt-1.5 border-t border-dashed border-slate-200 dark:border-navy-800">
            <span className="text-slate-600 dark:text-slate-400 font-bold">Budget Variance:</span>
            <span className={`font-black ${isOverrun ? 'text-red-500' : 'text-emerald-500'}`}>
              {isOverrun ? `+₹${budgetOverrun} Lakhs (${percentVariance}% Over)` : `-₹${Math.abs(budgetOverrun)} Lakhs (Under)`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Public Fund Source:</span>
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              {road.type === 'NH' ? 'Central Road Fund' : road.type === 'SH' ? 'State Infra Bond' : 'Municipal Levy'}
            </span>
          </div>
        </div>
      </div>

      {/* Citizen Complaint List */}
      <div className="py-5 flex-1">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-rose-500 animate-pulse" />
            <span>Active Citizen Complaints ({roadComplaints.length})</span>
          </h3>
          <Link
            href={{ pathname: '/report', query: { roadId: road.id } }}
            className="text-[10px] bg-blue-600/10 text-blue-500 dark:text-blue-400 font-bold px-2 py-1 rounded hover:bg-blue-600/25 flex items-center gap-0.5 active:scale-95 transition-transform"
          >
            <Plus className="h-3 w-3" />
            <span>Report</span>
          </Link>
        </div>

        {roadComplaints.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {roadComplaints.map(complaint => (
              <div 
                key={complaint.id}
                className="p-3 bg-slate-100/50 dark:bg-navy-900/40 rounded border border-slate-200/50 dark:border-navy-800/80 text-xs flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-center">
                  <span className="font-black text-slate-700 dark:text-white">{complaint.id}</span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                    complaint.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    complaint.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                    complaint.status === 'Assigned' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-snug font-medium line-clamp-2">
                  {complaint.description}
                </p>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-200/50 dark:border-navy-800/50">
                  <span className="capitalize">{complaint.issueType} • {complaint.severity}</span>
                  <Link 
                    href={`/tracker?id=${complaint.id}`}
                    className="text-blue-500 hover:underline flex items-center gap-0.5 font-bold"
                  >
                    <span>Track</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center border border-dashed border-slate-200 dark:border-navy-800/50 rounded-lg">
            <ShieldCheck className="h-8 w-8 text-emerald-500 mx-auto mb-1 opacity-70" />
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">No Active Issues Reported</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-0.5">This segment is currently clear.</p>
          </div>
        )}
      </div>

    </div>
  );
}
