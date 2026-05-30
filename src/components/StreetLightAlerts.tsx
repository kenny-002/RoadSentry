'use client';

import React, { useEffect, useState, useRef } from 'react';
import { db, fs } from '../lib/firebase';
import { ref, onValue, set as rtdbSet, push, update as rtdbUpdate } from 'firebase/database';
import { doc, collection, onSnapshot as fsOnSnapshot, setDoc as fsSetDoc, updateDoc as fsUpdateDoc } from 'firebase/firestore';
import { 
  Lightbulb, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Wifi, 
  WifiOff,
  Zap,
  ZapOff,
  Database,
  History,
  Clock,
  Wrench,
  CheckCircle
} from 'lucide-react';

interface StreetLightState {
  status: string;
  location: string;
  updated_at?: number;
}

interface FaultHistoryItem {
  id: string;
  title: string;
  location: string;
  status: 'Active' | 'In Progress' | 'Resolved';
  reported_at: number;
  db_source: 'RTDB' | 'Firestore';
}

export default function StreetLightAlerts() {
  const [lightState, setLightState] = useState<StreetLightState | null>(null);
  const [historyList, setHistoryList] = useState<FaultHistoryItem[]>([]);
  
  const [rtdbConnected, setRtdbConnected] = useState(false);
  const [fsConnected, setFsConnected] = useState(false);
  
  const [rtdbError, setRtdbError] = useState<string | null>(null);
  const [fsError, setFsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Keep a ref of history list to prevent closure issues in useEffect
  const historyListRef = useRef<FaultHistoryItem[]>([]);
  useEffect(() => {
    historyListRef.current = historyList;
  }, [historyList]);

  const prevStatusRef = useRef<string | null>(null);

  // 1. Listen to the single 'streetlight' status node in Realtime DB
  useEffect(() => {
    const lightRef = ref(db, 'streetlight');
    const unsubscribe = onValue(
      lightRef,
      (snapshot) => {
        setRtdbConnected(true);
        setRtdbError(null);
        setLoading(false);
        if (snapshot.exists()) {
          const val = snapshot.val();
          setLightState({
            status: val.status || 'on',
            location: val.location || 'Sample Location',
            updated_at: val.updated_at
          });
        } else {
          setLightState({ status: 'on', location: 'Sample Location' });
        }
      },
      (error) => {
        console.error('Realtime DB Read Error:', error);
        setRtdbConnected(false);
        setRtdbError(error.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // 2. Listen to Cloud Firestore status document
  useEffect(() => {
    const fsDocRef = doc(fs, 'streetlight', 'state');
    const unsubscribe = fsOnSnapshot(
      fsDocRef,
      (snapshot) => {
        setFsConnected(true);
        setFsError(null);
        setLoading(false);
        if (snapshot.exists()) {
          const val = snapshot.data();
          // Prefer Firestore status if it gets updated
          setLightState(prev => {
            if (val.updated_at && prev?.updated_at && val.updated_at < prev.updated_at) {
              return prev; // RTDB is newer
            }
            return {
              status: val.status || 'on',
              location: val.location || 'Sample Location',
              updated_at: val.updated_at
            };
          });
        }
      },
      (error) => {
        console.error('Firestore Read Error:', error);
        setFsConnected(false);
        setFsError(error.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // 3. Listen to Realtime Database Fault History List
  useEffect(() => {
    const historyRef = ref(db, 'streetlight_history');
    const unsubscribe = onValue(
      historyRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const items: FaultHistoryItem[] = Object.entries(data).map(([id, val]: any) => ({
            id,
            title: val.title || 'Street Light Fault',
            location: val.location || 'Sample Location',
            status: val.status || 'Active',
            reported_at: val.reported_at || Date.now(),
            db_source: 'RTDB'
          }));
          
          setHistoryList(prev => {
            // Merge with Firestore list, filter duplicate IDs, and sort descending
            const otherSource = prev.filter(x => x.db_source === 'Firestore');
            const merged = [...items, ...otherSource];
            return merged.sort((a, b) => b.reported_at - a.reported_at);
          });
        }
      },
      (error) => console.error('RTDB History Error:', error)
    );
    return () => unsubscribe();
  }, []);

  // 4. Listen to Firestore Fault History List
  useEffect(() => {
    const historyCol = collection(fs, 'streetlight_history');
    const unsubscribe = fsOnSnapshot(
      historyCol,
      (snapshot) => {
        const items: FaultHistoryItem[] = snapshot.docs.map(doc => {
          const val = doc.data();
          return {
            id: doc.id,
            title: val.title || 'Street Light Fault',
            location: val.location || 'Sample Location',
            status: val.status || 'Active',
            reported_at: val.reported_at || Date.now(),
            db_source: 'Firestore'
          };
        });
        
        setHistoryList(prev => {
          // Merge with RTDB list, filter duplicate IDs, and sort descending
          const otherSource = prev.filter(x => x.db_source === 'RTDB');
          // Deduplicate by reported_at timestamp to avoid duplicates if written in both
          const combined = [...otherSource, ...items];
          const unique: FaultHistoryItem[] = [];
          const seenTimestamps = new Set<number>();
          
          combined.forEach(item => {
            // Deduplicate matching timestamps within 1 second
            const approxTime = Math.floor(item.reported_at / 1000);
            if (!seenTimestamps.has(approxTime)) {
              seenTimestamps.add(approxTime);
              unique.push(item);
            }
          });

          return unique.sort((a, b) => b.reported_at - a.reported_at);
        });
      },
      (error) => console.error('Firestore History Error:', error)
    );
    return () => unsubscribe();
  }, []);

  // 5. Trigger new alert creation in History when Light status transitions to OFF
  useEffect(() => {
    if (!lightState) return;
    const statusLower = lightState.status?.toLowerCase() || '';
    const isOff = statusLower.includes('off') || statusLower.includes('fault');
    
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = lightState.status;

    // Trigger on transition from a non-off status to an off status
    if (isOff && prevStatus !== null) {
      const prevLower = prevStatus.toLowerCase();
      const prevWasOff = prevLower.includes('off') || prevLower.includes('fault');
      if (!prevWasOff) {
        logFaultEventToHistory();
      }
    }
  }, [lightState?.status]);

  // Log a new fault event to BOTH databases
  const logFaultEventToHistory = async () => {
    const timestamp = Date.now();
    const newFault = {
      title: 'Street Light Fault',
      location: 'Sample Location',
      status: 'Active' as const,
      reported_at: timestamp
    };

    // Write to RTDB History
    try {
      const historyRef = ref(db, 'streetlight_history');
      const newRef = push(historyRef);
      await rtdbSet(newRef, newFault);
    } catch (e) {
      console.error('Failed to log to RTDB History:', e);
    }

    // Write to Firestore History
    try {
      const docId = 'fault_' + timestamp;
      const fsDocRef = doc(fs, 'streetlight_history', docId);
      await fsSetDoc(fsDocRef, {
        id: docId,
        ...newFault
      });
    } catch (e) {
      console.error('Failed to log to Firestore History:', e);
    }
  };

  // Update light status on / off directly in Firebase
  const updateLightStatus = async (newStatus: 'on' | 'off') => {
    const timestamp = Date.now();
    const data = {
      status: newStatus,
      location: 'Sample Location',
      updated_at: timestamp
    };

    try {
      const rtdbRef = ref(db, 'streetlight');
      await rtdbSet(rtdbRef, data);
    } catch (e: any) {
      setRtdbError(e.message);
    }

    try {
      const fsDocRef = doc(fs, 'streetlight', 'state');
      await fsSetDoc(fsDocRef, data);
    } catch (e: any) {
      setFsError(e.message);
    }

    // Call history logger explicitly to allow multiple sequential alert logs on simulation clicks
    if (newStatus === 'off') {
      await logFaultEventToHistory();
    }
  };

  // Update Progress status of a history log
  const updateProgressStatus = async (item: FaultHistoryItem, newStatus: 'Active' | 'In Progress' | 'Resolved') => {
    // 1. Update in Realtime Database
    try {
      if (item.db_source === 'RTDB' || rtdbConnected) {
        const itemRef = ref(db, `streetlight_history/${item.id}`);
        await rtdbUpdate(itemRef, { status: newStatus });
      }
    } catch (e) {
      console.error('RTDB Progress update failed:', e);
    }

    // 2. Update in Firestore
    try {
      if (item.db_source === 'Firestore' || fsConnected) {
        // If document ID in firestore is fault_timestamp or matching ID
        const docId = item.id.startsWith('fault_') ? item.id : ('fault_' + item.reported_at);
        const fsDocRef = doc(fs, 'streetlight_history', docId);
        await fsSetDoc(fsDocRef, { status: newStatus }, { merge: true });
      }
    } catch (e) {
      console.error('Firestore Progress update failed:', e);
    }

    // Special behavior: If admin resolves the latest active history item, turn light back "on" in state!
    if (newStatus === 'Resolved') {
      const isLatest = historyList.length > 0 && historyList[0].id === item.id;
      if (isLatest) {
        updateLightStatus('on');
      }
    }
  };

  const statusLower = lightState?.status?.toLowerCase() || '';
  const isLightOff = statusLower.includes('off') || statusLower.includes('fault');

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-850 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-250';
      case 'In Progress':
        return 'bg-amber-100 text-amber-850 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-250';
      case 'Active':
      default:
        return 'bg-red-100 text-red-850 dark:bg-red-950/30 dark:text-red-400 border border-red-250';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto animate-in fade-in duration-300">
      
      {/* Diagnostics Panel */}
      <div className="bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-850 rounded-2xl p-4 space-y-3 shadow-sm">
        <h3 className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Database className="h-4 w-4 text-slate-500" />
          Firebase Database Connection Diagnostics
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
          <div className="p-3 bg-white dark:bg-navy-900 border border-slate-200/60 dark:border-navy-800 rounded-xl space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span>Realtime Database:</span>
              {rtdbConnected ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Wifi className="h-3 w-3" /> Connected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-500 font-bold animate-pulse">
                  <WifiOff className="h-3 w-3" /> Disconnected
                </span>
              )}
            </div>
            {lightState && (
              <p className="text-[10px] text-slate-400 font-mono">
                RTDB Light State: <span className="font-extrabold text-slate-500">{lightState.status}</span>
              </p>
            )}
            {rtdbError && (
              <p className="text-[10px] text-red-500 font-medium bg-red-50 dark:bg-red-950/20 p-1.5 rounded border border-red-100 dark:border-red-900/30">
                ⚠️ {rtdbError}
              </p>
            )}
          </div>

          <div className="p-3 bg-white dark:bg-navy-900 border border-slate-200/60 dark:border-navy-800 rounded-xl space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span>Cloud Firestore:</span>
              {fsConnected ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Wifi className="h-3 w-3" /> Connected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-500 font-bold animate-pulse">
                  <WifiOff className="h-3 w-3" /> Disconnected
                </span>
              )}
            </div>
            {lightState && (
              <p className="text-[10px] text-slate-400 font-mono">
                Firestore Light State: <span className="font-extrabold text-slate-500">{lightState.status}</span>
              </p>
            )}
            {fsError && (
              <p className="text-[10px] text-red-500 font-medium bg-red-50 dark:bg-red-950/20 p-1.5 rounded border border-red-100 dark:border-red-900/30">
                ⚠️ {fsError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Control Simulator Section */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="space-y-0.5">
          <h2 className="text-base font-black text-slate-800 dark:text-white">Street Light Monitor Panel</h2>
          <p className="text-[10px] text-slate-400 font-medium">Updates status directly in Firebase database for testing</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateLightStatus('off')}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-sm shadow-red-500/10 border border-red-550"
          >
            <ZapOff className="h-3.5 w-3.5" />
            Set status: OFF
          </button>
          <button
            onClick={() => updateLightStatus('on')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-sm shadow-emerald-500/10 border border-emerald-550"
          >
            <Zap className="h-3.5 w-3.5" />
            Set status: ON
          </button>
        </div>
      </div>

      {/* Current State Live Alert Banner */}
      {loading ? (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-10 flex flex-col items-center gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-slate-200 border-t-slate-500 animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Connecting to Firebase...</p>
        </div>
      ) : isLightOff ? (
        <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-500/80 rounded-2xl p-5 shadow-md animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500 text-white rounded-xl shadow shadow-red-500/20 animate-bounce shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            
            <div className="flex-1 space-y-3 min-w-0">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-500 text-white animate-pulse">
                  Live Alert Active
                </span>
                <h3 className="text-sm font-black text-red-800 dark:text-red-400">
                  Street Light is OFF! (Fault Event Logged)
                </h3>
              </div>

              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-350 bg-white dark:bg-navy-950/60 p-2.5 rounded-xl border border-red-200/50 dark:border-red-900/30">
                <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                <div className="text-[11px]">
                  <span className="font-bold block text-[9px] uppercase text-slate-400 dark:text-slate-550">Testing Location</span>
                  <span className="font-extrabold">{lightState?.location}</span>
                </div>
              </div>

              {lightState?.updated_at && (
                <p className="text-[10px] text-red-500/60 font-semibold">
                  Detected: {new Date(lightState.updated_at).toLocaleTimeString()} ({new Date(lightState.updated_at).toLocaleDateString()})
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl p-5 shadow-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500 text-white rounded-xl shrink-0 shadow-sm shadow-emerald-500/10">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            
            <div className="flex-1 space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-250/30">
                Operational
              </span>
              <h3 className="text-sm font-black text-slate-800 dark:text-white">
                All Systems Normal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                The street light at <strong className="text-slate-700 dark:text-slate-300">{lightState?.location}</strong> is currently active and functioning correctly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* History log & Progress tracker section */}
      <div className="space-y-3.5 mt-2">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-navy-800/80 pb-2">
          <History className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-black text-slate-800 dark:text-white">Fault Log History & Progress</h3>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-navy-950 px-2 py-0.5 rounded border border-slate-200 dark:border-navy-850">
            {historyList.length} logs
          </span>
        </div>

        {historyList.length === 0 ? (
          <div className="bg-white dark:bg-navy-900 border border-dashed border-slate-200 dark:border-navy-800 rounded-2xl p-10 flex flex-col items-center gap-2.5 text-center shadow-sm">
            <History className="h-6 w-6 text-slate-350" />
            <p className="text-xs font-bold text-slate-500">No fault history recorded yet</p>
            <p className="text-[10px] text-slate-400">Fault alerts will automatically log here when the Firebase status turns OFF.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {historyList.map((item) => (
              <div 
                key={item.id}
                className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800/90 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-navy-700"
              >
                {/* Fault Details */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                      {item.title}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <div className="space-y-0.5">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                      {item.location}
                    </p>
                    <p className="text-[9px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="h-2.5 w-2.5" />
                      {new Date(item.reported_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Progress Control Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'Active' && (
                    <button
                      onClick={() => updateProgressStatus(item, 'In Progress')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black rounded-lg transition-all active:scale-95 shadow-sm border border-amber-550"
                    >
                      <Wrench className="h-3 w-3" />
                      Start Repair
                    </button>
                  )}
                  
                  {item.status !== 'Resolved' && (
                    <button
                      onClick={() => updateProgressStatus(item, 'Resolved')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg transition-all active:scale-95 shadow-sm border border-emerald-550"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Resolve Fault
                    </button>
                  )}

                  {item.status === 'Resolved' && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-black bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
