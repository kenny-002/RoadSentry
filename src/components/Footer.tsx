import React from 'react';
import Link from 'next/link';
import { ShieldAlert, CheckCircle, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full glass-panel border-x-0 border-b-0 rounded-none bg-opacity-70 dark:bg-opacity-40 border-t border-card-border py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Status */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-tr from-slate-600 to-slate-400 rounded-md text-white font-bold flex items-center justify-center">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-700 via-slate-500 to-slate-400 bg-clip-text text-transparent">
                Road Sentry
              </span>
            </Link>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <div className="flex items-center space-x-1.5 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Platform Live & Connected</span>
            </div>
          </div>

          {/* Quick Info & Copyright */}
          <div className="flex flex-col items-center md:items-end gap-1.5">
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span>Smart-City Transparency Portal. Made with</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              <span>for Citizens.</span>
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} Corporation of Metropolitan Road Authorities. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
