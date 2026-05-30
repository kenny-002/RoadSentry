'use client';

import React from 'react';
import { useAppState } from '../../context/StateContext';
import Link from 'next/link';
import AnalyticsCards from '../../components/AnalyticsCards';
import {
  ShieldAlert, RefreshCw, UserCheck, ShieldCheck, Lightbulb,
  ArrowRight, Users, TrendingUp, AlertTriangle, CheckCircle2, Clock, Activity
} from 'lucide-react';

export default function AdminPage() {
  const { complaints, authorities, roads } = useAppState();

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const active = complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const streetlights = complaints.filter(c => c.issueType === 'street light').length;
  const critical = complaints.filter(c => c.severity === 'Critical').length;

  const sections = [
    {
      href: '/admin/complaints',
      icon: ShieldAlert,
      label: 'All Complaints',
      description: 'Full dispatch queue — view, filter, assign engineers and update status for every complaint.',
      count: total,
      countLabel: 'Total Reports',
      accent: 'from-blue-500 to-blue-700',
      bg: 'bg-blue-500/8 hover:bg-blue-500/12 border-blue-500/15 hover:border-blue-500/30',
      iconBg: 'bg-blue-500/10 text-blue-500',
      badge: critical > 0 ? { text: `${critical} Critical`, color: 'bg-red-500/10 text-red-500 border-red-500/20' } : null,
    },
    {
      href: '/admin/streetlights',
      icon: Lightbulb,
      label: 'Street Light Faults',
      description: 'Monitor all street lighting outages reported by citizens across all municipal zones.',
      count: streetlights,
      countLabel: 'Fault Reports',
      accent: 'from-yellow-500 to-orange-500',
      bg: 'bg-yellow-500/8 hover:bg-yellow-500/12 border-yellow-500/15 hover:border-yellow-500/30',
      iconBg: 'bg-yellow-500/10 text-yellow-500',
      badge: null,
    },
    {
      href: '/admin/pending',
      icon: RefreshCw,
      label: 'Unassigned Queue',
      description: 'Complaints waiting for an engineer to be assigned. Requires immediate action.',
      count: pending,
      countLabel: 'Awaiting Assignment',
      accent: 'from-red-500 to-red-700',
      bg: 'bg-red-500/8 hover:bg-red-500/12 border-red-500/15 hover:border-red-500/30',
      iconBg: 'bg-red-500/10 text-red-500',
      badge: pending > 0 ? { text: 'Needs Action', color: 'bg-red-500/10 text-red-500 border-red-500/20' } : null,
    },
    {
      href: '/admin/active',
      icon: UserCheck,
      label: 'Active Repair Works',
      description: 'Track ongoing field operations — complaints currently assigned or being repaired.',
      count: active,
      countLabel: 'In Progress',
      accent: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-500/8 hover:bg-amber-500/12 border-amber-500/15 hover:border-amber-500/30',
      iconBg: 'bg-amber-500/10 text-amber-500',
      badge: null,
    },
    {
      href: '/admin/resolved',
      icon: ShieldCheck,
      label: 'Completed Audits',
      description: 'Archive of all successfully resolved complaints with engineer notes and close details.',
      count: resolved,
      countLabel: 'Resolved',
      accent: 'from-emerald-500 to-emerald-700',
      bg: 'bg-emerald-500/8 hover:bg-emerald-500/12 border-emerald-500/15 hover:border-emerald-500/30',
      iconBg: 'bg-emerald-500/10 text-emerald-500',
      badge: null,
    },
  ];

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">Municipal Portal · Live</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Admin Operations Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Select any section below to open it in full view.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-500">Resolution Rate</p>
            <p className="text-2xl font-black text-emerald-500">{resolutionRate}%</p>
          </div>
          <div className="h-12 w-12 rounded-full border-4 border-emerald-500/30 flex items-center justify-center bg-emerald-500/10">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <AnalyticsCards />

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Reports', value: total, icon: Activity, color: 'text-blue-500' },
          { label: 'Unassigned', value: pending, icon: Clock, color: 'text-red-500' },
          { label: 'In Progress', value: active, icon: UserCheck, color: 'text-amber-500' },
          { label: 'Resolved', value: resolved, icon: CheckCircle2, color: 'text-emerald-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-panel border border-card-border p-4 flex items-center gap-3">
            <Icon className={`h-8 w-8 ${color} opacity-80`} />
            <div>
              <p className="text-xl font-black text-slate-800 dark:text-white">{value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Section Cards — click to open full page */}
      <div>
        <h2 className="text-xs uppercase font-black tracking-widest text-slate-400 mb-4">Open Full Section ↓</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map(({ href, icon: Icon, label, description, count, countLabel, bg, iconBg, badge }) => (
            <Link key={href} href={href}
              className={`group glass-panel border ${bg} p-6 flex flex-col gap-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer`}>
              <div className="flex items-start justify-between">
                <div className={`h-11 w-11 rounded-xl ${iconBg} flex items-center justify-center border border-white/10 shadow-sm`}>
                  <Icon className="h-5 w-5" />
                </div>
                {badge && (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${badge.color}`}>
                    {badge.text}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-black text-slate-800 dark:text-white text-base leading-tight">{label}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{description}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-white/5">
                <div>
                  <span className="text-2xl font-black text-slate-800 dark:text-white">{count}</span>
                  <span className="text-xs text-slate-400 ml-1.5">{countLabel}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-500 group-hover:text-blue-500 transition-colors">
                  Open <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Officers Overview */}
      <div>
        <h2 className="text-xs uppercase font-black tracking-widest text-slate-400 mb-4">Assigned Officers</h2>
        <div className="glass-panel border border-card-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-navy-850 bg-slate-50 dark:bg-navy-950/60">
                  {['Officer','Role','Region','Assigned Cases','Contact'].map(h => (
                    <th key={h} className="py-3 px-4 font-extrabold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-850">
                {authorities.map(a => {
                  const cases = complaints.filter(c => c.assignedAuthorityId === a.id);
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/60 dark:hover:bg-navy-900/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs border border-blue-500/20">
                            {a.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{a.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{a.role?.split(' (')[0]}</td>
                      <td className="py-3 px-4 text-slate-500">{a.region}</td>
                      <td className="py-3 px-4">
                        <span className="font-extrabold text-slate-800 dark:text-white">{cases.length}</span>
                        <span className="text-slate-400 ml-1">({cases.filter(c => c.status === 'Resolved').length} resolved)</span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{a.phone || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
