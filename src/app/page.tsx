'use client';

import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import Link from 'next/link';
import { Users, Building2, Globe, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-navy-950">

      {/* Hero Banner */}
      <HeroSection />

      {/* Feature Section */}
      <section className="py-16 sm:py-20 bg-white dark:bg-navy-900 border-b border-slate-100 dark:border-navy-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-450">Engineered Transparency</span>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white leading-tight">
              Powered by AI. Verified by Citizens.
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Integrating automated smart systems with civic feedback to establish total accountability in infrastructure relaying.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
      <section className="py-14 bg-slate-50 dark:bg-navy-950 border-b border-slate-100 dark:border-navy-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10 items-start text-center">

          <div className="space-y-3">
            <div className="h-11 w-11 bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-350 rounded-xl border border-slate-200 dark:border-navy-750 flex items-center justify-center mx-auto shadow-sm">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">Citizen Action</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto mt-1.5">
                Over 24,000 complaints submitted and resolved, bringing local municipal performance to direct view.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-11 w-11 bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-350 rounded-xl border border-slate-200 dark:border-navy-750 flex items-center justify-center mx-auto shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">Contractor Matrix</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto mt-1.5">
                We score construction firms on project delivery, budget overruns, and material durability.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-11 w-11 bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-350 rounded-xl border border-slate-200 dark:border-navy-750 flex items-center justify-center mx-auto shadow-sm">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">Open API Standard</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto mt-1.5">
                Our codebases publish PostGIS locations, enabling third-party developers to query road quality datasets.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Landing Bottom Action */}
      <section className="py-16 sm:py-20 text-center bg-white dark:bg-navy-900 border-b border-slate-100 dark:border-navy-800/50">
        <div className="max-w-lg mx-auto px-4 space-y-6">
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">Ready to get started?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Help make our municipal road networks safer. Sign up today to submit road defect reports, track complaints in real-time, and view contractor grades.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-98"
          >
            <span>Get Started Now</span>
            <ArrowRight className="h-4 w-4 text-white" />
          </Link>
        </div>
      </section>

    </div>
  );
}
