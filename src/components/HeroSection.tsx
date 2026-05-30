'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Server } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-[#F8FAFC] smart-grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text and Actions */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 z-10 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center justify-center lg:justify-start">
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-slate-900 border border-[#3B82F6]/50 shadow-sm animate-in fade-in duration-200">
                <Sparkles className="h-3.5 w-3.5 text-[#3B82F6]" />
                <span>Next-Gen Smart City Platform</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-[#1E3A5F]">
              Monitor Roads.
              <br />
              <span className="text-[#3B82F6]">
                Track Spending.
              </span>
              <br />
              Report Issues.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-550 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              An AI-powered transparency platform connecting citizens and municipal engineers. Report road damage, track repair budgets, review contractor performance scores, and monitor public funding in real-time.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-[#1E3A5F] hover:bg-[#152A47] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01] active:scale-99 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5 text-white" />
              </Link>
              <Link
                href="/roads"
                className="w-full sm:w-auto px-8 py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01] active:scale-99 cursor-pointer"
              >
                <span>Browse Roads</span>
              </Link>
            </div>

            {/* Micro Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-black">92.4%</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Repairs Completed</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-black">₹84.2Cr</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Spent Transpar.</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-black">2.4 Hours</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">AI Routing Time</p>
              </div>
            </div>

          </div>

          {/* Right Visual (Animated SVG Smart Map) */}
          <div className="lg:col-span-6 flex justify-center items-center relative z-0">
            {/* SVG Visual */}
            <div className="w-full max-w-[480px] aspect-[4/3] glass-panel p-4 flex items-center justify-center border border-slate-200/80 shadow-lg relative overflow-hidden bg-white">
              
              {/* Scanning Laser Line */}
              <div className="absolute left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-slate-400/40 to-transparent top-0 animate-[scan_3s_linear_infinite]" style={{
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
                  50% { opacity: 1; transform: scale(1.2); }
                }
              `}</style>

              <svg viewBox="0 0 400 300" className="w-full h-full text-slate-300">
                {/* City Grid Background lines */}
                <g stroke="currentColor" strokeWidth="0.5" opacity="0.4" strokeDasharray="3,3">
                  <line x1="50" y1="0" x2="50" y2="300" />
                  <line x1="150" y1="0" x2="150" y2="300" />
                  <line x1="250" y1="0" x2="250" y2="300" />
                  <line x1="350" y1="0" x2="350" y2="300" />
                  <line x1="0" y1="50" x2="400" y2="50" />
                  <line x1="0" y1="150" x2="400" y2="150" />
                  <line x1="0" y1="250" x2="400" y2="250" />
                </g>

                {/* Road Paths */}
                {/* Road 1 - Main Highway */}
                <path 
                  d="M 50,150 L 350,150" 
                  fill="none" 
                  stroke="rgba(0, 0, 0, 0.05)" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M 50,150 L 350,150" 
                  fill="none" 
                  stroke="#111111" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeDasharray="8,6"
                  style={{ animation: 'dash 15s linear infinite' }}
                />

                {/* Road 2 - Outer Bypass */}
                <path 
                  d="M 50,50 Q 200,20 350,50" 
                  fill="none" 
                  stroke="rgba(0, 0, 0, 0.04)" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M 50,50 Q 200,20 350,50" 
                  fill="none" 
                  stroke="#4B5563" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeDasharray="6,4"
                  style={{ animation: 'dash 20s linear infinite' }}
                />

                {/* Road 3 - Damaged Highway */}
                <path 
                  d="M 120,50 L 120,250" 
                  fill="none" 
                  stroke="rgba(0, 0, 0, 0.03)" 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M 120,50 L 120,250" 
                  fill="none" 
                  stroke="#6B7280" 
                  strokeWidth="1" 
                  strokeLinecap="round" 
                  strokeDasharray="4,8"
                />

                {/* Road 4 - Cross Connector */}
                <path 
                  d="M 280,50 L 280,250" 
                  fill="none" 
                  stroke="rgba(0, 0, 0, 0.03)" 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M 280,50 L 280,250" 
                  fill="none" 
                  stroke="#9CA3AF" 
                  strokeWidth="1" 
                  strokeLinecap="round" 
                  strokeDasharray="6,6"
                  style={{ animation: 'dash 25s linear infinite' }}
                />

                {/* Smart Monitoring Nodes (Intersections) */}
                {/* Node 1 */}
                <circle cx="120" cy="150" r="6" fill="rgba(0, 0, 0, 0.1)" />
                <circle cx="120" cy="150" r="3" fill="#111111" />
                
                {/* Node 2 - Damaged Area Alert node */}
                <g style={{ transformOrigin: '120px 50px' }}>
                  <circle cx="120" cy="50" r="8" fill="rgba(0, 0, 0, 0.15)" style={{ animation: 'blink 2s infinite' }} />
                  <circle cx="120" cy="50" r="3" fill="#000000" />
                </g>

                {/* Node 3 */}
                <circle cx="280" cy="150" r="6" fill="rgba(0, 0, 0, 0.08)" />
                <circle cx="280" cy="150" r="3" fill="#4B5563" />

                {/* Simulated Traffic / AI Scan Dot */}
                <circle cx="200" cy="150" r="3" fill="#000000" className="animate-ping" style={{ animationDuration: '3s' }} />

                {/* Legend Labels on Hero visual */}
                <g fontSize="7" fontWeight="bold" fill="currentColor">
                  <rect x="15" y="270" width="80" height="20" rx="4" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.5" />
                  <circle cx="25" cy="280" r="2.5" fill="#111111" />
                  <text x="33" y="282" fill="#111111">Anna Salai - Good</text>

                  <rect x="305" y="270" width="80" height="20" rx="4" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.5" />
                  <circle cx="315" cy="280" r="2.5" fill="#6B7280" />
                  <text x="323" y="282" fill="#6B7280">ORR - Under Review</text>
                </g>
              </svg>

              {/* Float Cards inside the Hero visual container */}
              <div className="absolute top-4 right-4 bg-white/95 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] flex items-center space-x-1.5 shadow-sm backdrop-blur-md">
                <Server className="h-3 w-3 text-black animate-pulse" />
                <span className="font-bold tracking-wider uppercase">AI Live Analysis</span>
              </div>

              <div className="absolute bottom-4 left-4 bg-white/95 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] flex items-center space-x-1.5 shadow-sm backdrop-blur-md">
                <div className="h-2 w-2 rounded-full bg-slate-900"></div>
                <span className="font-bold">IoT Sensors: Connected</span>
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
    </section>
  );
}
