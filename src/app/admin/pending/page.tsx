'use client';
import React, { useState } from 'react';
import { useAppState } from '../../../context/StateContext';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Edit3, Save, MapPin, CheckCircle } from 'lucide-react';

export default function UnassignedQueuePage() {
  const { complaints, authorities, roads, updateComplaint } = useAppState();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAuthority, setEditAuthority] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const pending = complaints.filter(c => c.status === 'Pending');

  const handleAssign = (id: string) => {
    updateComplaint(id, { status: 'Assigned', assignedAuthorityId: editAuthority, notes: editNotes });
    setEditingId(null);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 rounded-lg bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-red-500" />
            <h1 className="text-2xl font-black text-slate-800 dark:text-white">Unassigned Queue</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Citizen complaints awaiting engineer assignment — {pending.length} pending</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {pending.length > 0 ? pending.map(c => {
          const road = roads.find(r => r.id === c.roadId);
          const isEditing = editingId === c.id;
          return (
            <div key={c.id} className="glass-panel border border-card-border p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">{c.id}</span>
                  <p className="font-extrabold text-slate-800 dark:text-white text-sm mt-0.5">{road?.name || 'Unknown Road'}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description}</p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${c.severity === 'Critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : c.severity === 'Medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                  {c.severity}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 space-y-1">
                <p>👤 {c.reporterName} · {c.createdDate}</p>
                <p>📍 {c.gpsLocation.lat.toFixed(4)}, {c.gpsLocation.lng.toFixed(4)}</p>
                <p>🔧 Issue: <span className="capitalize font-semibold text-slate-600 dark:text-slate-300">{c.issueType}</span></p>
              </div>
              {isEditing ? (
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-navy-800">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Assign Engineer</label>
                  <select value={editAuthority} onChange={e => setEditAuthority(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 rounded text-xs text-slate-800 dark:text-white">
                    <option value="">-- Select Officer --</option>
                    {authorities.map(a => <option key={a.id} value={a.id}>{a.name} · {a.region.split(' (')[0]}</option>)}
                  </select>
                  <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Dispatch notes…" rows={2}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 rounded text-xs text-slate-800 dark:text-white" />
                  <div className="flex gap-2">
                    <button onClick={() => handleAssign(c.id)} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform">
                      <Save className="h-3 w-3" /> Assign & Dispatch
                    </button>
                    <button onClick={() => setEditingId(null)} className="py-2 px-3 bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-slate-300 rounded font-bold text-xs active:scale-95 transition-transform">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setEditingId(c.id); setEditAuthority(c.assignedAuthorityId || ''); setEditNotes(c.notes || ''); }}
                  className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold border border-red-500/20 rounded text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform">
                  <Edit3 className="h-3.5 w-3.5" /> Assign Engineer
                </button>
              )}
            </div>
          );
        }) : (
          <div className="col-span-3 text-center py-16">
            <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-3 opacity-70" />
            <h3 className="font-extrabold text-slate-700 dark:text-white">Queue Empty</h3>
            <p className="text-xs text-slate-500 mt-1">All complaints have been assigned.</p>
          </div>
        )}
      </div>
    </div>
  );
}
