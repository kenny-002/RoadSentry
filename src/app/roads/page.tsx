'use client';

import React, { useState, useCallback } from 'react';
import RoadMap from '../../components/RoadMap';
import RoadDetailsPanel from '../../components/RoadDetailsPanel';
import { Road } from '../../data/mockData';
import { useAppState } from '../../context/StateContext';
import { Map, Info, MousePointerClick } from 'lucide-react';

export default function RoadsPage() {
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
    <div className="flex-1 w-full bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 flex items-center gap-1.5">
              <Map className="h-3 w-3" />
              <span>Interactive Audit Portal</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              City Road Map &amp; Condition Grid
            </h1>
            <p className="text-xs text-slate-600 font-semibold">
              Real-time status of National Highways (NH), State Highways (SH), and district corridors.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {[
              { label: 'Good', color: 'bg-emerald-500' },
              { label: 'Moderate', color: 'bg-amber-400' },
              { label: 'Critical', color: 'bg-red-500' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${color}`} />
                <span className="text-[10px] font-black text-slate-700">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid: Map & Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* Left: Interactive SVG Map */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
              <RoadMap
                onSelectRoad={handleSelectRoad}
                selectedRoadId={selectedRoadId || undefined}
              />
            </div>
          </div>

          {/* Right: Details Panel */}
          <div className="lg:col-span-4">
            {selectedRoad ? (
              <RoadDetailsPanel
                road={selectedRoad}
                onClose={handleClosePanel}
              />
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[380px] shadow-sm">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-4 shadow-inner">
                  <MousePointerClick className="h-7 w-7 text-slate-600 animate-pulse" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-sm">Select a Road Segment</h3>
                <p className="text-xs text-slate-500 max-w-xs mt-2 leading-relaxed font-semibold">
                  Click on any colored line in the city map grid to reveal contractor scorecards, budgets, and open complaint tickets.
                </p>
                <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-500 leading-relaxed font-semibold max-w-xs flex gap-2 text-left">
                  <Info className="h-4 w-4 text-slate-550 shrink-0 mt-0.5" />
                  <span>Road status is updated dynamically as citizens report damage and engineers log resolutions.</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
