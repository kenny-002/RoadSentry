'use client';

import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import Link from 'next/link';
import { Eye, ShieldAlert, BarChart3, Users, Building2, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Banner */}
      <HeroSection />

      {/* Feature Section */}
      <section className="py-16 sm:py-20 bg-white dark:bg-navy-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-500">Engineered Transparency</span>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white leading-tight">
              Powered by AI. Verified by Citizens.
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Integrating automated smart systems with civic feedback to establish total accountability in infrastructure relaying.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              title="Computer Vision AI"
              description="Upload photo evidence of damage. Our neural nets automatically detect potholes, estimate severity, and reject invalid mock pictures."
              iconName="Camera"
              color="blue"
            />
            <FeatureCard
              title="Real-time Tracking"
              description="Monitor complaint tickets from submission to resolution. Audit assigned engineers, status logs, and estimated completion times."
              iconName="Search"
              color="emerald"
            />
            <FeatureCard
              title="Automated Routing"
              description="No manual bureaucracy. Complaints auto-route to the matching division engineer based on GPS and highway classification."
              iconName="Bot"
              color="purple"
            />
            <FeatureCard
              title="IoT Monitoring"
              description="Main highways feature municipal vibration sensors to dynamically log degradation rates and trigger maintenance alarms."
              iconName="Road"
              color="amber"
            />
          </div>

        </div>
      </section>

      {/* Info Callouts & Stats banner */}
      <section className="py-12 bg-slate-100/50 dark:bg-navy-900/40 border-y border-slate-200 dark:border-navy-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center">
          
          <div className="space-y-2">
            <div className="h-10 w-10 bg-blue-600/10 text-blue-500 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-5 w-5" />
            </div>
            <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">Citizen Action</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-xs mx-auto">
              Over 24,000 complaints submitted and resolved, bringing local municipal performance to direct view.
            </p>
          </div>

          <div className="space-y-2">
            <div className="h-10 w-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <Building2 className="h-5 w-5" />
            </div>
            <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">Contractor Matrix</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-xs mx-auto">
              We score construction firms on project delivery, budget overruns, and material durability.
            </p>
          </div>

          <div className="space-y-2">
            <div className="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto">
              <Globe className="h-5 w-5" />
            </div>
            <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">Open API Standard</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-xs mx-auto">
              Our codebases publish PostGIS locations, enabling third-party developers to query road quality datasets.
            </p>
          </div>

        </div>
      </section>

      {/* Landing Bottom Action */}
      <section className="py-16 sm:py-20 text-center space-y-6 bg-slate-50/50 dark:bg-navy-950/10">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">Ready to get started?</h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Help make our municipal road networks safer. Sign up today to submit road defect reports, track complaints in real-time, and view contractor grades.
        </p>
        <div className="flex justify-center items-center">
          <Link
            href="/login"
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md transition-all hover:scale-[1.02] active:scale-98"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
