'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldAlert, MapPin, Eye, Play, Sparkles, Server } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 grid-bg smart-grid-bg gradient-radial-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text and Actions */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 z-10 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center justify-center lg:justify-start">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 glow-blue">
                <Sparkles className="h-3 w-3 text-emerald-400" />
                <span>Next-Gen Smart City Platform</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Monitor Roads.
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                Track Spending.
              </span>
              <br />
              Report Issues.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0">
              An AI-powered transparency platform connecting citizens and municipal engineers. Report road damage, track repair budgets, review contractor performance scores, and monitor public funding in real-time.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-98"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Micro Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-navy-800/80 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">92.4%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Repairs Completed</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-500">₹84.2Cr</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Spent Transpar.</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-amber-500">2.4 Hours</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">AI Routing Time</p>
              </div>
            </div>

          </div>

          {/* Right Visual (Animated SVG Smart Map) */}
          <div className="lg:col-span-6 flex justify-center items-center relative z-0">
            {/* Backdrop glow */}
            <div className="absolute w-72 h-72 rounded-full bg-blue-600/10 dark:bg-blue-600/15 blur-3xl -z-10"></div>
            <div className="absolute w-60 h-60 rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 blur-3xl -z-10 translate-x-20 translate-y-20"></div>

            {/* SVG Visual */}
            <div className="w-full max-w-[480px] aspect-[4/3] glass-panel p-4 flex items-center justify-center border border-card-border shadow-2xl relative overflow-hidden bg-opacity-40 dark:bg-opacity-30">
              
              {/* Scanning Laser Line */}
              <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent top-0 animate-[scan_3s_linear_infinite]" style={{
                animation: 'scan 4s linear infinite'
              }}></div>
              
              <style jsx global>{`
                @keyframes scan {
                  0% { top: 0%; }
                  50% { top: 100%; }
                  100% { top: 0%; }
                }
                @keyframes dash {
                  to {
                    stroke-dashoffset: -40;
                  }
                }
                @keyframes blink {
                  0%, 100% { opacity: 0.3; transform: scale(1); }
                  50% { opacity: 1; transform: scale(1.3); }
                }
              `}</style>

              <svg viewBox="0 0 400 300" className="w-full h-full text-slate-400 dark:text-slate-600">
                {/* City Grid Background lines */}
                <g stroke="currentColor" strokeWidth="0.5" opacity="0.3" strokeDasharray="3,3">
                  <line x1="50" y1="0" x2="50" y2="300" />
                  <line x1="150" y1="0" x2="150" y2="300" />
                  <line x1="250" y1="0" x2="250" y2="300" />
                  <line x1="350" y1="0" x2="350" y2="300" />
                  <line x1="0" y1="50" x2="400" y2="50" />
                  <line x1="0" y1="150" x2="400" y2="150" />
                  <line x1="0" y1="250" x2="400" y2="250" />
                </g>

                {/* Road Paths */}
                {/* Road 1 - Main Highway (Electric Blue Glow) */}
                <path 
                  d="M 50,150 L 350,150" 
                  fill="none" 
                  stroke="rgba(59, 130, 246, 0.2)" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M 50,150 L 350,150" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeDasharray="8,6"
                  style={{ animation: 'dash 15s linear infinite' }}
                />

                {/* Road 2 - Outer Bypass (Emerald Green Glow) */}
                <path 
                  d="M 50,50 Q 200,20 350,50" 
                  fill="none" 
                  stroke="rgba(16, 185, 129, 0.2)" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M 50,50 Q 200,20 350,50" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeDasharray="6,4"
                  style={{ animation: 'dash 20s linear infinite' }}
                />

                {/* Road 3 - Damaged Highway (Rose/Amber Glow) */}
                <path 
                  d="M 120,50 L 120,250" 
                  fill="none" 
                  stroke="rgba(244, 63, 94, 0.15)" 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M 120,50 L 120,250" 
                  fill="none" 
                  stroke="#f43f5e" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeDasharray="4,8"
                />

                {/* Road 4 - Cross Connector */}
                <path 
                  d="M 280,50 L 280,250" 
                  fill="none" 
                  stroke="rgba(245, 158, 11, 0.2)" 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M 280,50 L 280,250" 
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeDasharray="6,6"
                  style={{ animation: 'dash 25s linear infinite' }}
                />

                {/* Smart Monitoring Nodes (Intersections) */}
                {/* Node 1 */}
                <circle cx="120" cy="150" r="7" fill="rgba(59, 130, 246, 0.3)" />
                <circle cx="120" cy="150" r="4" fill="#3b82f6" />
                
                {/* Node 2 - Damaged Area Alert node */}
                <g style={{ transformOrigin: '120px 50px' }}>
                  <circle cx="120" cy="50" r="9" fill="rgba(244, 63, 94, 0.4)" style={{ animation: 'blink 2s infinite' }} />
                  <circle cx="120" cy="50" r="4" fill="#f43f5e" />
                </g>

                {/* Node 3 */}
                <circle cx="280" cy="150" r="7" fill="rgba(16, 185, 129, 0.3)" />
                <circle cx="280" cy="150" r="4" fill="#10b981" />

                {/* Simulated Traffic / AI Scan Dot (animated overlay) */}
                <circle cx="200" cy="150" r="3" fill="#ffffff" className="animate-ping" style={{ animationDuration: '3s' }} />

                {/* Legend Labels on Hero visual */}
                <g fontSize="7" fontWeight="bold" fill="currentColor" opacity="0.8">
                  <rect x="15" y="270" width="80" height="20" rx="3" fill="rgba(11, 21, 40, 0.8)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                  <circle cx="25" cy="280" r="2.5" fill="#3b82f6" />
                  <text x="33" y="282" className="fill-slate-400">Anna Salai - Good</text>

                  <rect x="305" y="270" width="80" height="20" rx="3" fill="rgba(11, 21, 40, 0.8)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                  <circle cx="315" cy="280" r="2.5" fill="#f43f5e" />
                  <text x="323" y="282" className="fill-slate-400">ORR - Critical</text>
                </g>
              </svg>

              {/* Float Cards inside the Hero visual container */}
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] flex items-center space-x-1.5 shadow-lg backdrop-blur-md">
                <Server className="h-3 w-3 text-emerald-400 animate-pulse" />
                <span className="font-semibold tracking-wider uppercase">AI Live Analysis</span>
              </div>

              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] flex items-center space-x-1.5 shadow-lg backdrop-blur-md">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="font-semibold">IoT Sensors: Connected</span>
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
    </section>
  );
}
