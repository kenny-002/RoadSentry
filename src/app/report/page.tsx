'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ComplaintForm from '../../components/ComplaintForm';
import { AlertCircle, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

function ReportPageContent() {
  const searchParams = useSearchParams();
  const roadId = searchParams?.get('roadId') || '';

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase font-black tracking-wider text-blue-500 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-yellow-400" />
          <span>Vigilance reporting</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
          Report Road Defects
        </h1>
        <p className="text-xs text-slate-550 dark:text-slate-450 mt-0.5">
          Submit images of potholes, cracks, or drainage issues. AI routes cases instantly to supervisions.
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-3xl w-full mx-auto">
        <ComplaintForm preselectedRoadId={roadId} />
      </div>

    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    }>
      <ReportPageContent />
    </Suspense>
  );
}
