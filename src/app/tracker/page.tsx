'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import StatusTracker from '../../components/StatusTracker';
import { Compass, Sparkles, Loader2 } from 'lucide-react';

function TrackerPageContent() {
  const searchParams = useSearchParams();
  const ticketId = searchParams?.get('id') || '';

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase font-black tracking-wider text-blue-500 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-yellow-400" />
          <span>Vigilance Tracking</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
          Complaint Ticket Tracker
        </h1>
        <p className="text-xs text-slate-555 dark:text-slate-450 mt-0.5">
          Track public road defects, assigned engineers, estimated resolution dates, and logs.
        </p>
      </div>

      {/* Tracker Card */}
      <div className="max-w-2xl w-full mx-auto">
        <StatusTracker initialSearchId={ticketId} />
      </div>

    </div>
  );
}

export default function TrackerPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    }>
      <TrackerPageContent />
    </Suspense>
  );
}
