'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import StreetLightAlerts from '../../../components/StreetLightAlerts';

export default function StreetLightPage() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 rounded-lg bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h1 className="text-2xl font-black text-slate-800 dark:text-white">Street Light Faults</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Monitor and manage street light outage reports across all zones.</p>
        </div>
      </div>
      <div className="glass-panel border border-card-border p-5">
        <StreetLightAlerts />
      </div>
    </div>
  );
}
