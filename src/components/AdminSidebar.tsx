'use client';

import React from 'react';
import { Eye, ShieldAlert, FileDown, ShieldCheck, Filter, UserCheck, RefreshCw, Lightbulb } from 'lucide-react';

interface AdminSidebarProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  selectedZone: string;
  onChangeZone: (zone: string) => void;
}

export default function AdminSidebar({
  currentTab,
  onChangeTab,
  selectedZone,
  onChangeZone
}: AdminSidebarProps) {
  
  const handleExport = (format: 'PDF' | 'CSV') => {
    alert(`Generating ${format} report for Zone: ${selectedZone}... \nDownload initiated successfully.`);
  };

  const tabs = [
    { name: 'All Complaints', key: 'All', icon: ShieldAlert },
    { name: 'Street Light Faults', key: 'StreetLight', icon: Lightbulb },
    { name: 'Unassigned Queue', key: 'Pending', icon: RefreshCw },
    { name: 'Active Repair Works', key: 'In Progress', icon: UserCheck },
    { name: 'Completed Audits', key: 'Resolved', icon: ShieldCheck }
  ];

  const zones = ['All Zones', 'Zone 1 (North)', 'Zone 2 (Central)', 'Zone 3 (South)', 'Zone 4 (East)'];

  return (
    <div className="glass-panel p-5 bg-opacity-65 dark:bg-opacity-25 border border-card-border flex flex-col gap-6 w-full h-full">
      
      {/* Admin credentials */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200 dark:border-navy-800/80">
        <div className="h-10 w-10 bg-blue-600/10 text-blue-500 rounded-full border border-blue-500/20 flex items-center justify-center font-extrabold text-sm shadow">
          AD
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-extrabold text-slate-800 dark:text-white leading-tight">Admin Console</p>
          <div className="flex items-center space-x-1.5 text-[9px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">
            <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SUPER-USER WRITE</span>
          </div>
        </div>
      </div>

      {/* Tab selection */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block mb-1">Queue Views</span>
        <div className="flex flex-col gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onChangeTab(tab.key)}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-500 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Zone selection */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block mb-1">Filter by Region</span>
        <div className="flex flex-col gap-1.5">
          {zones.map((zone) => {
            const isActive = selectedZone === zone || (zone === 'All Zones' && selectedZone === 'All');
            const zoneKey = zone === 'All Zones' ? 'All' : zone;
            return (
              <button
                key={zone}
                onClick={() => onChangeZone(zoneKey)}
                className={`w-full px-3 py-2 rounded-lg text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-slate-800 dark:hover:text-white border border-transparent'
                }`}
              >
                {zone}
              </button>
            );
          })}
        </div>
      </div>

      {/* Export Reports */}
      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-navy-800/80 space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block mb-1">Export Audits</span>
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            onClick={() => handleExport('CSV')}
            className="py-2.5 bg-slate-100 dark:bg-navy-850 hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-800 rounded-lg flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            <FileDown className="h-4 w-4" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="py-2.5 bg-slate-100 dark:bg-navy-850 hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-800 rounded-lg flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            <FileDown className="h-4 w-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>

    </div>
  );
}
