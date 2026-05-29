'use client';

import React, { useState, useCallback } from 'react';
import RoadMap from '../../components/RoadMap';
import RoadDetailsPanel from '../../components/RoadDetailsPanel';
import { Road } from '../../data/mockData';
import { useAppState } from '../../context/StateContext';
import { Compass, Sparkles, Map, Info } from 'lucide-react';

export default function DashboardPage() {
  const { roads } = useAppState();
  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);

  const selectedRoad = roads.find(r => r.id === selectedRoadId) || null;

  const handleSelectRoad = useCallback((road: Road) => {
    setSelectedRoadId(road.id);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedRoadId(null);
  }, []);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div>
          <span className="text-[10px] uppercase font-black tracking-wider text-blue-500 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-yellow-400" />
            <span>Interactive Audit Portal</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            City Road Map & Condition Grid
          </h1>
          <p className="text-xs text-slate-550 dark:text-slate-450 mt-0.5">
            Real-time status updates of National Highways (NH), State Highways (SH), and district corridors.
          </p>
        </div>
      </div>

      {/* Main Grid: Map & Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Map filters and Interactive SVG Map */}
        <div className="lg:col-span-8 flex flex-col">
          <RoadMap 
            onSelectRoad={handleSelectRoad}
            selectedRoadId={selectedRoadId || undefined}
          />
        </div>

        {/* Right: Drawer Details panel */}
        <div className="lg:col-span-4 flex flex-col min-h-[450px]">
          {selectedRoad ? (
            <RoadDetailsPanel 
              road={selectedRoad}
              onClose={handleClosePanel}
            />
          ) : (
            // Sidebar Placeholder
            <div className="glass-panel p-8 text-center flex flex-col items-center justify-center h-full bg-opacity-40 dark:bg-opacity-25 border border-card-border">
              <div className="p-4 bg-slate-100 dark:bg-navy-900 text-slate-400 dark:text-slate-600 rounded-2xl border border-slate-200/50 dark:border-navy-850 mb-4 animate-pulse">
                <Map className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Select Road Segment</h3>
              <p className="text-xs text-slate-550 dark:text-slate-400 max-w-xs mt-1.5 leading-relaxed font-medium">
                Click on any colored line coordinates inside the city map grid to reveal contractor scorecards, budgets, and open complaint tickets.
              </p>
              <div className="mt-5 p-3 bg-blue-600/5 border border-blue-500/10 rounded-lg text-[10px] text-slate-550 dark:text-slate-450 leading-relaxed font-medium max-w-xs flex gap-2">
                <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Road status is updated dynamically as citizens report damage and authority engineers log resolutions.</span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
