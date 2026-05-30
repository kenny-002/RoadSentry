'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Road, Contractor, Authority, Complaint, roads as initialRoads, contractors as initialContractors, authorities as initialAuthorities, complaints as initialComplaints } from '../data/mockData';

export interface UserProfile {
  name: string;
  email: string;
}

interface StateContextType {
  roads: Road[];
  contractors: Contractor[];
  authorities: Authority[];
  complaints: Complaint[];
  addComplaint: (complaintData: Omit<Complaint, 'id' | 'status' | 'assignedAuthorityId' | 'createdDate'>) => Complaint;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
  updateRoadCondition: (id: string, condition: Road['condition']) => void;
  draftComplaint: Partial<Complaint> | null;
  saveDraftComplaint: (draft: Partial<Complaint> | null) => void;
  addRoad: (roadData: Omit<Road, 'id' | 'svgPath' | 'textCoords'>) => Road;
  addMultipleRoads: (newRoads: Road[]) => void;
  userRole: 'admin' | 'user' | null;
  currentUser: UserProfile | null;
  login: (role: 'admin' | 'user', profile?: UserProfile) => void;
  logout: () => void;
  authLoaded: boolean;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read auth state SYNCHRONOUSLY at init time so there is zero loading delay on any device
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const r = localStorage.getItem('roadwatch_user_role');
      return r === 'admin' || r === 'user' ? r : null;
    } catch { return null; }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const u = localStorage.getItem('roadwatch_current_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  });

  // authLoaded is always true — auth is read synchronously above, no async wait needed
  const authLoaded = true;

  const [roads, setRoads] = useState<Road[]>(initialRoads);
  const [contractors, setContractors] = useState<Contractor[]>(initialContractors);
  const [authorities] = useState<Authority[]>(initialAuthorities);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [draftComplaint, setDraftComplaint] = useState<Partial<Complaint> | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const addRoad = (roadData: Omit<Road, 'id' | 'svgPath' | 'textCoords'>) => {
    const nextIdNumber = roads.length > 0
      ? Math.max(...roads.map(r => {
          const num = parseInt(r.id.replace('road-', ''), 10);
          return isNaN(num) ? 0 : num;
        })) + 1
      : 11;
    const newId = `road-${nextIdNumber}`;
    const newRoad: Road = {
      ...roadData,
      id: newId,
      svgPath: '',
      textCoords: { x: 0, y: 0 }
    };
    setRoads(prev => [...prev, newRoad]);
    return newRoad;
  };

  const addMultipleRoads = (newRoads: Road[]) => {
    setRoads(prev => {
      const existingIds = new Set(prev.map(r => r.id));
      const filtered = newRoads.filter(r => !existingIds.has(r.id));
      if (filtered.length === 0) return prev;
      return [...prev, ...filtered];
    });
  };

  // Load remaining data from localStorage on mount (non-blocking)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedRoads = localStorage.getItem('roadwatch_roads');
        const storedComplaints = localStorage.getItem('roadwatch_complaints');
        const storedDraft = localStorage.getItem('roadwatch_draft');

        if (storedRoads) {
          try {
            const parsed = JSON.parse(storedRoads) as Road[];
            const healed = parsed.map(pr => {
              const initial = initialRoads.find(ir => ir.id === pr.id);
              return {
                ...pr,
                coordinates: pr.coordinates || (initial ? initial.coordinates : [])
              };
            });
            setRoads(healed);
          } catch (e) {
            console.error(e);
          }
        }
        if (storedComplaints) {
          try { setComplaints(JSON.parse(storedComplaints)); } catch (e) { console.error(e); }
        }
        if (storedDraft) {
          try { setDraftComplaint(JSON.parse(storedDraft)); } catch (e) { console.error(e); }
        }
        setIsLoaded(true);
      }
    } catch (err) {
      console.warn('localStorage read failed or blocked:', err);
    }
  }, []);

  const login = (role: 'admin' | 'user', profile?: UserProfile) => {
    setUserRole(role);
    if (profile) {
      setCurrentUser(profile);
    } else {
      setCurrentUser(null);
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('roadwatch_user_role', role);
        if (profile) {
          localStorage.setItem('roadwatch_current_user', JSON.stringify(profile));
        } else {
          localStorage.removeItem('roadwatch_current_user');
        }
      } catch (err) {
        console.warn('localStorage write failed or blocked:', err);
      }
    }
  };

  const logout = () => {
    setUserRole(null);
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('roadwatch_user_role');
        localStorage.removeItem('roadwatch_current_user');
      } catch (err) {
        console.warn('localStorage remove failed or blocked:', err);
      }
    }
  };

  // Save to localStorage when state changes (only save user-created or default roads, exclude dynamic OSM ones)
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        const userRoads = roads.filter(r => !r.id.startsWith('osm-'));
        localStorage.setItem('roadwatch_roads', JSON.stringify(userRoads));
      } catch (err) {
        console.warn('localStorage write failed or blocked:', err);
      }
    }
  }, [roads, isLoaded]);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem('roadwatch_complaints', JSON.stringify(complaints));
      } catch (err) {
        console.warn('localStorage write failed or blocked:', err);
      }
    }
  }, [complaints, isLoaded]);

  const saveDraftComplaint = (draft: Partial<Complaint> | null) => {
    setDraftComplaint(draft);
    if (typeof window !== 'undefined') {
      try {
        if (draft) {
          localStorage.setItem('roadwatch_draft', JSON.stringify(draft));
        } else {
          localStorage.removeItem('roadwatch_draft');
        }
      } catch (err) {
        console.warn('localStorage write/remove failed or blocked:', err);
      }
    }
  };

  // Helper to auto-route authority based on road type
  const getAuthorityForRoadType = (roadType: Road['type']): string => {
    switch (roadType) {
      case 'NH':
        return 'authority-1'; // Executive Engineer (NH Division)
      case 'SH':
        return 'authority-2'; // Assistant Executive Engineer (SH Division)
      case 'MDR':
        return 'authority-3'; // Divisional Engineer (MDR Division)
      case 'Local Road':
      default:
        return 'authority-4'; // Ward Officer (Local Roads Division)
    }
  };

  const addComplaint = (complaintData: Omit<Complaint, 'id' | 'status' | 'assignedAuthorityId' | 'createdDate'>) => {
    const nextIdNumber = complaints.length > 0 
      ? Math.max(...complaints.map(c => parseInt(c.id.replace('RW-', ''), 10))) + 1 
      : 1009;
    const newId = `RW-${nextIdNumber}`;

    const road = roads.find(r => r.id === complaintData.roadId);
    const assignedAuthorityId = road ? getAuthorityForRoadType(road.type) : 'authority-4';

    const newComplaint: Complaint = {
      ...complaintData,
      reporterEmail: complaintData.reporterEmail || (currentUser ? currentUser.email : undefined),
      id: newId,
      status: 'Pending',
      assignedAuthorityId,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setComplaints(prev => [newComplaint, ...prev]);

    // Also, if complaint is Critical/Damaged, check if road condition needs worsening
    if (road && (newComplaint.severity === 'Critical' || newComplaint.severity === 'Medium')) {
      const roadConditionMap: Record<string, Road['condition']> = {
        Good: newComplaint.severity === 'Critical' ? 'Damaged' : 'Moderate',
        Moderate: newComplaint.severity === 'Critical' ? 'Critical' : 'Damaged',
        Damaged: newComplaint.severity === 'Critical' ? 'Critical' : 'Damaged',
        Critical: 'Critical'
      };
      const newCondition = roadConditionMap[road.condition] || road.condition;
      updateRoadCondition(road.id, newCondition);
    }

    // Clear draft
    saveDraftComplaint(null);

    return newComplaint;
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );

    // If complaint is set to Resolved, we can dynamically assess if the road can be marked as Good or Moderate
    if (updates.status === 'Resolved') {
      const comp = complaints.find(c => c.id === id);
      if (comp) {
        const road = roads.find(r => r.id === comp.roadId);
        if (road) {
          // See if there are other open complaints for this road
          const otherOpen = complaints.filter(
            c => c.id !== id && c.roadId === road.id && c.status !== 'Resolved'
          );
          if (otherOpen.length === 0) {
            // All complaints resolved! Upgrade road condition
            updateRoadCondition(road.id, 'Good');
          } else {
            // Some complaints still open, check their severity
            const criticalLeft = otherOpen.some(c => c.severity === 'Critical');
            updateRoadCondition(road.id, criticalLeft ? 'Critical' : 'Moderate');
          }
        }
      }
    }
  };

  const updateRoadCondition = (id: string, condition: Road['condition']) => {
    setRoads(prev =>
      prev.map(r => (r.id === id ? { ...r, condition } : r))
    );
  };

  return (
    <StateContext.Provider
      value={{
        roads,
        contractors,
        authorities,
        complaints,
        addComplaint,
        updateComplaint,
        updateRoadCondition,
        draftComplaint,
        saveDraftComplaint,
        addRoad,
        addMultipleRoads,
        userRole,
        currentUser,
        login,
        logout,
        authLoaded,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
};
