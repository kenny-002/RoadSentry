'use client';

import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import AdminSidebar from '../../components/AdminSidebar';
import AnalyticsCards from '../../components/AnalyticsCards';
import StreetLightAlerts from '../../components/StreetLightAlerts';
import { ShieldAlert, CheckCircle, UserCheck, RefreshCw, Eye, Edit3, Save, Phone, MapPin, AlertCircle, Lightbulb } from 'lucide-react';

export default function AdminPage() {
  const { complaints, authorities, roads, updateComplaint } = useAppState();

  // Navigation / Filter states
  const [currentTab, setCurrentTab] = useState('All'); // All, Pending, In Progress, Resolved
  const [selectedZone, setSelectedZone] = useState('All'); // All, Zone 1, Zone 2, Zone 3, Zone 4

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<any>('Pending');
  const [editAuthority, setEditAuthority] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Lightbox Photo state
  const [activePhotoUrl, setActivePhotoUrl] = useState<string | null>(null);

  // Filter complaints based on selection
  const filteredComplaints = complaints.filter(c => {
    // Tab status / Category filter
    let matchesTab = false;
    if (currentTab === 'All') {
      matchesTab = true;
    } else if (currentTab === 'StreetLight') {
      matchesTab = c.issueType === 'street light';
    } else {
      matchesTab = c.status === currentTab;
    }

    // Region zone filter
    let matchesZone = true;
    if (selectedZone !== 'All') {
      const auth = authorities.find(a => a.id === c.assignedAuthorityId);
      matchesZone = auth ? auth.region === selectedZone : false;
    }

    return matchesTab && matchesZone;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'In Progress':
        return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
      case 'Assigned':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'Pending':
      default:
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
    }
  };

  const handleStartEdit = (c: any) => {
    setEditingId(c.id);
    setEditStatus(c.status);
    setEditAuthority(c.assignedAuthorityId);
    setEditNotes(c.notes || '');
  };

  const handleSaveEdit = (id: string) => {
    updateComplaint(id, {
      status: editStatus,
      assignedAuthorityId: editAuthority,
      notes: editNotes
    });
    setEditingId(null);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">MUNICIPAL PORTAL</span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
          Admin Operations Dashboard
        </h1>
        <p className="text-xs text-slate-555 dark:text-slate-450 mt-0.5">
          Review reported citizen issues, assign engineers, update resolution status, and view platform metrics.
        </p>
      </div>

      {/* Analytics Summary */}
      <AnalyticsCards />

      {/* Main Admin Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left: Sidebar selector */}
        <div className="lg:col-span-1">
          <AdminSidebar
            currentTab={currentTab}
            onChangeTab={(t) => { setCurrentTab(t); setEditingId(null); }}
            selectedZone={selectedZone}
            onChangeZone={(z) => { setSelectedZone(z); setEditingId(null); }}
          />
        </div>

        {/* Right: Complaints Management Table */}
        <div className="lg:col-span-3 glass-panel p-5 bg-opacity-65 dark:bg-opacity-25 border border-card-border overflow-hidden">
          
          {currentTab === 'StreetLight' ? (
            <StreetLightAlerts />
          ) : (
            <>
              <div className="pb-4 border-b border-slate-200 dark:border-navy-800/80 flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">
                  Complaint Dispatch Queue ({filteredComplaints.length})
                </h3>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-navy-950 px-2.5 py-1 rounded border border-slate-200 dark:border-navy-850">
                  Filter: {currentTab} | {selectedZone === 'All' ? 'All Zones' : selectedZone.split(' (')[0]}
                </span>
              </div>

              {filteredComplaints.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-navy-850 font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-2">Ticket ID</th>
                        <th className="py-3 px-2">Photo</th>
                        <th className="py-3 px-2">Details & Road</th>
                        <th className="py-3 px-2">Location</th>
                        <th className="py-3 px-2">Assigned Officer</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2">Severity</th>
                        <th className="py-3 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/50 dark:divide-navy-850/55 font-medium">
                      {filteredComplaints.map((c) => {
                        const road = roads.find(r => r.id === c.roadId);
                        const authority = authorities.find(a => a.id === c.assignedAuthorityId);
                        const isEditing = editingId === c.id;

                        return (
                          <tr 
                            key={c.id}
                            className={`hover:bg-slate-50/50 dark:hover:bg-navy-900/10 transition-colors ${
                              isEditing ? 'bg-slate-500/5 dark:bg-slate-500/5' : ''
                            }`}
                          >
                            {/* ID */}
                            <td className="py-4 px-2 font-mono font-bold text-slate-700 dark:text-slate-350">{c.id}</td>
                            
                             {/* Photo */}
                             <td className="py-4 px-2">
                               {c.imageUrl ? (
                                 <div 
                                   onClick={() => setActivePhotoUrl(c.imageUrl)}
                                   className="relative group h-12 w-16 overflow-hidden rounded-lg border border-slate-200 dark:border-navy-700 bg-slate-100 dark:bg-navy-800 shrink-0 shadow-sm transition-transform duration-300 hover:scale-105 cursor-pointer"
                                   title="Click to view full image"
                                 >
                                   {/* eslint-disable-next-line @next/next/no-img-element */}
                                   <img 
                                     src={c.imageUrl} 
                                     alt="defect report" 
                                     className="h-full w-full object-cover"
                                   />
                                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                     <Eye className="h-4 w-4 text-white drop-shadow" />
                                   </div>
                                 </div>
                               ) : (
                                 <div className="h-12 w-16 rounded-lg bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 flex items-center justify-center text-[10px] text-slate-400">
                                   No image
                                 </div>
                               )}
                             </td>

                            {/* Details */}
                            <td className="py-4 px-2 max-w-xs space-y-1">
                              <p className="font-extrabold text-slate-800 dark:text-slate-200">{road ? road.name : 'Unknown Road'}</p>
                              <p className="text-slate-550 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">{c.description}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500">Reported: {c.createdDate} by {c.reporterName}</p>
                            </td>

                            {/* Location */}
                            <td className="py-4 px-2">
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${c.gpsLocation.lat},${c.gpsLocation.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-600 bg-slate-500/5 hover:bg-slate-500/10 border border-slate-500/10 hover:border-slate-500/25 px-2 py-1 rounded-lg transition-all active:scale-95"
                                title="Open in Google Maps"
                              >
                                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                                <span>{c.gpsLocation.lat.toFixed(4)}, {c.gpsLocation.lng.toFixed(4)}</span>
                              </a>
                            </td>

                            {/* Assignee */}
                            <td className="py-4 px-2">
                              {isEditing ? (
                                <select
                                  value={editAuthority}
                                  onChange={(e) => setEditAuthority(e.target.value)}
                                  className="px-2 py-1.5 border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 rounded text-slate-800 dark:text-white"
                                >
                                  {authorities.map(a => (
                                    <option key={a.id} value={a.id}>
                                      {a.name} ({a.region.split(' ')[0]})
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <div className="space-y-0.5">
                                  <p className="text-slate-800 dark:text-slate-200 font-bold">{authority ? authority.name : 'Unassigned'}</p>
                                  <p className="text-[10px] text-slate-400 dark:text-slate-555">{authority ? authority.role.split(' (')[0] : ''}</p>
                                </div>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-4 px-2">
                              {isEditing ? (
                                <select
                                  value={editStatus}
                                  onChange={(e) => setEditStatus(e.target.value as any)}
                                  className="px-2 py-1.5 border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 rounded text-slate-800 dark:text-white"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Assigned">Assigned</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Resolved">Resolved</option>
                                </select>
                              ) : (
                                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${getStatusStyle(c.status)}`}>
                                  {c.status}
                                </span>
                              )}
                            </td>

                            {/* Severity */}
                            <td className="py-4 px-2">
                              <span className={`font-extrabold uppercase text-[10px] ${
                                c.severity === 'Critical' ? 'text-red-500' : c.severity === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                              }`}>
                                {c.severity}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-2 text-right">
                              {isEditing ? (
                                <div className="space-y-2">
                                  {/* Edit Resolution Notes input */}
                                  <textarea
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    placeholder="Add maintenance dispatch logs..."
                                    rows={2}
                                    className="w-48 px-2 py-1.5 border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 rounded text-[11px] text-slate-800 dark:text-white block ml-auto"
                                  />
                                  <button
                                    onClick={() => handleSaveEdit(c.id)}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold inline-flex items-center gap-1 active:scale-95 transition-transform"
                                  >
                                    <Save className="h-3.5 w-3.5" />
                                    <span>Save</span>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleStartEdit(c)}
                                  className="px-3 py-1.5 bg-slate-600/10 hover:bg-slate-600/20 text-slate-500 dark:text-slate-400 font-bold border border-slate-500/10 rounded inline-flex items-center gap-1 active:scale-95 transition-transform"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                  <span>Update</span>
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
                // Table Empty State
                <div className="text-center py-12 border border-dashed border-slate-200 dark:border-navy-800 rounded-xl">
                  <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2.5 opacity-80" />
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">All Clear in Queue</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">No active complaint logs match this filter permutation.</p>
                </div>
              )}
            </>
          )}

        </div>

      </div>

      {/* Premium Lightbox Modal */}
      {activePhotoUrl && (
        <div 
          className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setActivePhotoUrl(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[85vh] bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col items-center animate-in zoom-in-95 duration-200 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePhotoUrl(null)}
              className="absolute top-4 right-4 z-10 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full p-2 hover:scale-110 active:scale-95 transition-transform shadow-lg border border-white/10"
              title="Close Image"
            >
              ✕
            </button>
            
            {/* Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={activePhotoUrl} 
              alt="Full resolution defect report" 
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

    </div>
  );
}
