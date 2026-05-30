'use client';

import React from 'react';
import ChatbotWidget from '../../components/ChatbotWidget';
import { Bot, Sparkles, MessageCircle, ShieldCheck } from 'lucide-react';

export default function ChatbotPage() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-yellow-400" />
          <span>Conversational assistant</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
          AI Chatbot Assistant
        </h1>
        <p className="text-xs text-slate-550 dark:text-slate-450 mt-0.5">
          Ask questions about road contractor responsibilities, relaying timelines, or supervising engineers.
        </p>
      </div>

      {/* Main Grid: Chatbot & Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Chatbot Widget */}
        <div className="lg:col-span-8 flex flex-col">
          <ChatbotWidget />
        </div>

        {/* Right: Usage Tips & QA lists */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="glass-panel p-5 bg-opacity-65 dark:bg-opacity-25 border border-card-border flex flex-col gap-5 h-full justify-between">
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-1.5 border-b border-slate-200 dark:border-navy-800/80 pb-3">
                <MessageCircle className="h-4.5 w-4.5 text-slate-500" />
                <span>Conversational Help</span>
              </h3>

              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-medium">
                Our AI Assistant scans the active municipal databases in real-time. You can talk or type to ask questions.
              </p>

              <div className="space-y-3.5 pt-2 text-xs font-semibold">
                <div className="p-3 bg-slate-100/50 dark:bg-navy-900/30 rounded-lg border border-slate-200/50 dark:border-navy-850">
                  <p className="text-slate-800 dark:text-slate-200 text-[11px] mb-1">Contractor Auditing</p>
                  <p className="text-[10px] text-slate-400 font-medium font-mono">"Who is responsible for OMR IT Expressway?"</p>
                </div>

                <div className="p-3 bg-slate-100/50 dark:bg-navy-900/30 rounded-lg border border-slate-200/50 dark:border-navy-850">
                  <p className="text-slate-800 dark:text-slate-200 text-[11px] mb-1">Repair Dates</p>
                  <p className="text-[10px] text-slate-400 font-medium font-mono">"When was Mount Road last repaired?"</p>
                </div>

                <div className="p-3 bg-slate-100/50 dark:bg-navy-900/30 rounded-lg border border-slate-200/50 dark:border-navy-850">
                  <p className="text-slate-800 dark:text-slate-200 text-[11px] mb-1">Expenditures</p>
                  <p className="text-[10px] text-slate-400 font-medium font-mono">"How much was spent on Outer Ring Road?"</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-600/5 border border-slate-500/10 rounded-lg text-[10px] text-slate-550 dark:text-slate-450 leading-relaxed font-medium flex gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-slate-500 shrink-0 mt-0.5" />
              <span>Multi-language translation supports English, Tamil, Hindi, and Spanish, aligning with municipal demographics.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
