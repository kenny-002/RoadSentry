'use client';
import React, { useState } from 'react';
import { useAppState } from '../../../context/StateContext';
import Link from 'next/link';
import { ArrowLeft, UserCheck, Edit3, Save, CheckCircle } from 'lucide-react';

export default function ActiveRepairsPage() {
  const { complaints, authorities, roads, updateComplaint } = useAppState();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<any>('In Progress');
  const [editNotes, setEditNotes] = useState('');

  const active = complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned');

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 rounded-lg bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-amber-500" />
            <h1 className="text-2xl font-black text-slate-800 dark:text-white">Active Repair Works</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{active.length} complaints currently assigned or in progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {active.length > 0 ? active.map(c => {
          const road = roads.find(r => r.id === c.roadId);
          const authority = authorities.find(a => a.id === c.assignedAuthorityId);
          const isEditing = editingId === c.id;
          return (
            <div key={c.id} className="glass-panel border border-card-border p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-slate-400">{c.id}</span>
                  <p className="font-black text-slate-800 dark:text-white text-sm">{road?.name || 'Unknown'}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase shrink-0 ${c.status === 'Assigned' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                  {c.status}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-navy-900/50 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs border border-blue-500/20">
                  {authority?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{authority?.name || 'Unassigned'}</p>
                  <p className="text-[10px] text-slate-400">{authority?.role?.split(' (')[0]}</p>
                </div>
              </div>
              {c.notes && <p className="text-xs text-slate-500 bg-slate-50 dark:bg-navy-900/50 rounded-lg px-3 py-2 italic">"{c.notes}"</p>}
              {isEditing ? (
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-navy-800">
                  <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 rounded text-xs text-slate-800 dark:text-white">
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Progress notes…" rows={2}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 rounded text-xs text-slate-800 dark:text-white" />
                  <div className="flex gap-2">
                    <button onClick={() => { updateComplaint(c.id, { status: editStatus, notes: editNotes }); setEditingId(null); }}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform">
                      <Save className="h-3 w-3" /> Save Progress
                    </button>
                    <button onClick={() => setEditingId(null)} className="py-2 px-3 bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-slate-300 rounded font-bold text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setEditingId(c.id); setEditStatus(c.status); setEditNotes(c.notes || ''); }}
                  className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20 rounded text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform">
                  <Edit3 className="h-3.5 w-3.5" /> Update Progress
                </button>
              )}
            </div>
          );
        }) : (
          <div className="col-span-2 text-center py-16">
            <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-3 opacity-70" />
            <h3 className="font-extrabold text-slate-700 dark:text-white">No Active Works</h3>
            <p className="text-xs text-slate-500 mt-1">No complaints are currently being repaired.</p>
          </div>
        )}
      </div>
    </div>
  );
}
