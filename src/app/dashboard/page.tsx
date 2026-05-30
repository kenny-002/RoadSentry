'use client';

import React from 'react';
import { useAppState } from '../../context/StateContext';
import { 
  ChevronRight,
  Map,
  AlertTriangle,
  ClipboardList
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { currentUser } = useAppState();

  const featureCards = [
    {
      label: 'View Road Map',
      href: '/roads',
      desc: 'Browse city infrastructure',
      image: '/card_road_map.png',
      imageAlt: 'City road map illustration',
      icon: Map
    },
    {
      label: 'Report an Issue',
      href: '/report',
      desc: 'File a new road defect',
      image: '/card_report_issue.png',
      imageAlt: 'Reporting a road issue illustration',
      icon: AlertTriangle
    },
    {
      label: 'Track Complaint',
      href: '/tracker',
      desc: 'Check ticket status',
      image: '/card_track_complaint.png',
      imageAlt: 'Complaint tracking timeline illustration',
      icon: ClipboardList
    },
  ];

  return (
    <div className="flex-1 w-full bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">

        {/* ── Welcome Hero Section ── */}
        <div className="bg-white border border-slate-200 rounded-[16px] p-6 sm:p-8 flex flex-col sm:flex-row justify-between sm:items-center gap-6 shadow-sm transition-all hover:shadow-md">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[10px] uppercase font-black tracking-widest bg-[#EFF6FF] text-[#3B82F6] px-3 py-1 rounded-full border border-[#3B82F6]/30 animate-in fade-in duration-250">
                VIGILANCE CONSOLE
              </span>
              <span className="text-[9px] font-bold px-2.5 py-1 bg-[#EFF6FF] text-[#3B82F6] border border-[#3B82F6]/30 rounded-full flex items-center gap-1 animate-in fade-in duration-250">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] animate-pulse"></span>
                <span>Live GIS Connection</span>
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E3A5F] tracking-tight leading-tight">
              Welcome to Road Sentry,{' '}
              <span className="text-[#3B82F6] font-black">{currentUser?.name || 'Dinesh'}</span>
            </h1>
            
            <p className="text-sm text-slate-550 leading-relaxed font-medium">
              Monitor local contractors, check road relaying health, file defects, and query our AI companion to ensure transparent resource spending.
            </p>
          </div>

          {/* Decorative Logo */}
          <div className="hidden md:block shrink-0 animate-in fade-in duration-300">
            <img src="/logo.png" alt="Road Sentry Logo" className="h-16 w-auto object-contain transition-all duration-200 hover:scale-[1.03]" />
          </div>
        </div>

        {/* ── Feature Cards Section (3 Large Clickable Horizontal Cards) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {featureCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Link
                key={i}
                href={card.href}
                className="bg-white border border-slate-200 hover:border-[#3B82F6]/50 rounded-[16px] p-5 flex items-center gap-4 group shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300"
              >
                {/* Modern circular container */}
                <div className="h-12 w-12 rounded-[12px] bg-slate-50 text-slate-900 group-hover:bg-[#1E3A5F] group-hover:text-[#3B82F6] flex items-center justify-center border border-slate-200 shrink-0 transition-colors duration-300 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Info Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-800 group-hover:text-[#3B82F6] transition-colors duration-200">
                    {card.label}
                  </p>
                  <p className="text-[11px] text-slate-450 mt-0.5 font-semibold">
                    {card.desc}
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#3B82F6] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
