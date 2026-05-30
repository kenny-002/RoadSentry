'use client';
import React from 'react';
import { useAppState } from '../../../context/StateContext';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, MapPin, Star } from 'lucide-react';

export default function CompletedAuditsPage() {
  const { complaints, authorities, roads } = useAppState();
  const resolved = complaints.filter(c => c.status === 'Resolved');

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 rounded-lg bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <h1 className="text-2xl font-black text-slate-800 dark:text-white">Completed Audits</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{resolved.length} complaints successfully resolved and closed.</p>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel border border-emerald-500/20 p-4 text-center">
          <p className="text-3xl font-black text-emerald-500">{resolved.length}</p>
          <p className="text-xs font-bold text-slate-500 mt-1">Total Resolved</p>
        </div>
        <div className="glass-panel border border-card-border p-4 text-center">
          <p className="text-3xl font-black text-slate-800 dark:text-white">
            {resolved.filter(c => c.severity === 'Critical').length}
          </p>
          <p className="text-xs font-bold text-slate-500 mt-1">Critical Closed</p>
        </div>
        <div className="glass-panel border border-card-border p-4 text-center">
          <p className="text-3xl font-black text-blue-500">
            {new Set(resolved.map(c => c.assignedAuthorityId)).size}
          </p>
          <p className="text-xs font-bold text-slate-500 mt-1">Officers Involved</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {resolved.length > 0 ? resolved.map(c => {
          const road = roads.find(r => r.id === c.roadId);
          const authority = authorities.find(a => a.id === c.assignedAuthorityId);
          return (
            <div key={c.id} className="glass-panel border border-emerald-500/10 p-5 flex flex-col gap-3 hover:border-emerald-500/30 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-slate-400">{c.id}</span>
                  <p className="font-black text-slate-800 dark:text-white text-sm">{road?.name || 'Unknown'}</p>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <Star className="h-3 w-3 text-emerald-500 fill-emerald-500" />
                  <span className="text-[10px] font-extrabold text-emerald-500">RESOLVED</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
              <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-200 dark:border-navy-800">
                <p>👷 {authority?.name || 'Unknown Officer'}</p>
                <p>📅 Reported: {c.createdDate}</p>
                <p>🔧 Type: <span className="capitalize font-semibold text-slate-600 dark:text-slate-300">{c.issueType}</span></p>
                <a href={`https://www.google.com/maps?q=${c.gpsLocation.lat},${c.gpsLocation.lng}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-500 hover:underline font-bold">
                  <MapPin className="h-3 w-3" /> View on Maps
                </a>
              </div>
              {c.notes && <p className="text-xs italic text-slate-500 bg-slate-50 dark:bg-navy-900/50 px-3 py-2 rounded-lg">"{c.notes}"</p>}
            </div>
          );
        }) : (
          <div className="col-span-3 text-center py-16">
            <ShieldCheck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-700 dark:text-white">No Resolved Complaints Yet</h3>
            <p className="text-xs text-slate-500 mt-1">Resolved complaints will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
