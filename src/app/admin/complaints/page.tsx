'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/StateContext';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Eye, Edit3, Save, MapPin, CheckCircle, Search, Filter, Download } from 'lucide-react';

export default function AllComplaintsPage() {
  const { complaints, authorities, roads, updateComplaint } = useAppState();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<any>('Pending');
  const [editAuthority, setEditAuthority] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [activePhotoUrl, setActivePhotoUrl] = useState<string | null>(null);

  const filtered = complaints.filter(c => {
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    const auth = authorities.find(a => a.id === c.assignedAuthorityId);
    const matchZone = zoneFilter === 'All' || (auth ? auth.region === zoneFilter : false);
    const matchSearch = !search || 
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.reporterName.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchZone && matchSearch;
  });

  const getStatusStyle = (s: string) => {
    if (s === 'Resolved') return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
    if (s === 'In Progress') return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
    if (s === 'Assigned') return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
    return 'bg-red-500/10 text-red-500 border border-red-500/20';
  };

  const handleSave = (id: string) => {
    updateComplaint(id, { status: editStatus, assignedAuthorityId: editAuthority, notes: editNotes });
    setEditingId(null);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 rounded-lg bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-blue-500" />
            <h1 className="text-2xl font-black text-slate-800 dark:text-white">All Complaints</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Full citizen complaint dispatch queue — update status, assign engineers, add notes.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 border border-card-border flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-lg px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, reporter, description…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm text-slate-700 dark:text-slate-200 outline-none w-full placeholder:text-slate-400"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-200 outline-none">
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
        <select value={zoneFilter} onChange={e => setZoneFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-200 outline-none">
          <option value="All">All Zones</option>
          <option value="Zone 1 (North)">Zone 1 North</option>
          <option value="Zone 2 (Central)">Zone 2 Central</option>
          <option value="Zone 3 (South)">Zone 3 South</option>
          <option value="Zone 4 (East)">Zone 4 East</option>
        </select>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 px-3 py-2 rounded-lg">
          {filtered.length} records
        </span>
      </div>

      {/* Table */}
      <div className="glass-panel border border-card-border overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-navy-850 bg-slate-50 dark:bg-navy-950/60">
                  {['Ticket ID','Photo','Details & Road','Location','Assigned Officer','Status','Severity','Actions'].map(h => (
                    <th key={h} className="py-3 px-3 font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-850">
                {filtered.map(c => {
                  const road = roads.find(r => r.id === c.roadId);
                  const authority = authorities.find(a => a.id === c.assignedAuthorityId);
                  const isEditing = editingId === c.id;
                  return (
                    <tr key={c.id} className={`hover:bg-slate-50/60 dark:hover:bg-navy-900/20 transition-colors ${isEditing ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                      <td className="py-4 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">{c.id}</td>
                      <td className="py-4 px-3">
                        {c.imageUrl ? (
                          <div onClick={() => setActivePhotoUrl(c.imageUrl)} className="relative group h-12 w-16 overflow-hidden rounded-lg border border-slate-200 dark:border-navy-700 cursor-pointer hover:scale-105 transition-transform">
                            <img src={c.imageUrl} alt="report" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Eye className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="h-12 w-16 rounded-lg bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 flex items-center justify-center text-[10px] text-slate-400">No img</div>
                        )}
                      </td>
                      <td className="py-4 px-3 max-w-xs space-y-1">
                        <p className="font-extrabold text-slate-800 dark:text-slate-200">{road ? road.name : 'Unknown Road'}</p>
                        <p className="text-slate-500 dark:text-slate-400 line-clamp-2">{c.description}</p>
                        <p className="text-[10px] text-slate-400">By {c.reporterName} · {c.createdDate}</p>
                      </td>
                      <td className="py-4 px-3">
                        <a href={`https://www.google.com/maps?q=${c.gpsLocation.lat},${c.gpsLocation.lng}`} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-500 hover:text-blue-600 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-lg transition-all">
                          <MapPin className="h-3 w-3" />
                          {c.gpsLocation.lat.toFixed(4)}, {c.gpsLocation.lng.toFixed(4)}
                        </a>
                      </td>
                      <td className="py-4 px-3">
                        {isEditing ? (
                          <select value={editAuthority} onChange={e => setEditAuthority(e.target.value)}
                            className="px-2 py-1.5 border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 rounded text-slate-800 dark:text-white text-xs">
                            {authorities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                          </select>
                        ) : (
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{authority ? authority.name : 'Unassigned'}</p>
                            <p className="text-[10px] text-slate-400">{authority?.role?.split(' (')[0]}</p>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-3">
                        {isEditing ? (
                          <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                            className="px-2 py-1.5 border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 rounded text-slate-800 dark:text-white text-xs">
                            {['Pending','Assigned','In Progress','Resolved'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${getStatusStyle(c.status)}`}>{c.status}</span>
                        )}
                      </td>
                      <td className="py-4 px-3">
                        <span className={`font-extrabold uppercase text-[10px] ${c.severity === 'Critical' ? 'text-red-500' : c.severity === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {c.severity}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        {isEditing ? (
                          <div className="space-y-2 min-w-[160px]">
                            <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)}
                              placeholder="Resolution notes…" rows={2}
                              className="w-full px-2 py-1.5 border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 rounded text-[11px] text-slate-800 dark:text-white" />
                            <div className="flex gap-2">
                              <button onClick={() => handleSave(c.id)}
                                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform">
                                <Save className="h-3 w-3" /> Save
                              </button>
                              <button onClick={() => setEditingId(null)}
                                className="flex-1 py-1.5 bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-slate-300 rounded font-bold text-xs active:scale-95 transition-transform">
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => { setEditingId(c.id); setEditStatus(c.status); setEditAuthority(c.assignedAuthorityId); setEditNotes(c.notes || ''); }}
                            className="px-3 py-1.5 bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-navy-700 rounded text-xs inline-flex items-center gap-1 active:scale-95 transition-transform">
                            <Edit3 className="h-3 w-3" /> Update
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-3 opacity-70" />
            <h3 className="font-extrabold text-slate-700 dark:text-white">All Clear</h3>
            <p className="text-xs text-slate-500 mt-1">No complaints match this filter.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {activePhotoUrl && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setActivePhotoUrl(null)}>
          <div className="relative max-w-4xl max-h-[85vh] bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <button onClick={() => setActivePhotoUrl(null)} className="absolute top-4 right-4 z-10 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full p-2 transition-transform hover:scale-110">✕</button>
            <img src={activePhotoUrl} alt="defect" className="max-w-full max-h-[75vh] object-contain rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
