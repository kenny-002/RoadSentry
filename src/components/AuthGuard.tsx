'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppState } from '../context/StateContext';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { userRole, authLoaded } = useAppState();
  const pathname = usePathname();
  const router = useRouter();

  // Public pages that don't require any login
  const isPublicPage = pathname === '/' || pathname === '/login';

  useEffect(() => {
    if (!authLoaded) return;

    if (userRole === null) {
      // If not logged in and trying to access a protected page, redirect to /login
      if (!isPublicPage) {
        router.replace('/login');
      }
    } else {
      // If logged in and trying to access login or home, redirect based on role
      if (pathname === '/' || pathname === '/login') {
        if (userRole === 'admin') {
          router.replace('/admin');
        } else {
          router.replace('/dashboard');
        }
      } else if (userRole === 'user' && pathname === '/admin') {
        // If logged in as citizen and trying to access admin panel, redirect to dashboard
        router.replace('/dashboard');
      }
    }
  }, [userRole, authLoaded, pathname, router]);

  // Show a premium loading spinner while reading auth state from localStorage
  if (!authLoaded) {
    return (
      <div className="flex-1 min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
        <div className="relative flex flex-col items-center gap-4 p-8 glass-panel border border-card-border bg-white/50 dark:bg-slate-900/40 glow-blue">
          <div className="relative">
            <Loader2 className="h-12 w-12 text-slate-500 animate-spin" />
            <ShieldCheck className="h-6 w-6 text-emerald-400 absolute top-3 left-3 animate-pulse" />
          </div>
          <div className="text-center">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200">Verifying Credentials</h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">Connecting to Corporation GIS Systems...</p>
          </div>
        </div>
      </div>
    );
  }

  // Determine if unauthorized access should block render before redirection completes
  const isUnauthorized = 
    (userRole === null && !isPublicPage) ||
    (userRole === 'user' && pathname === '/admin') ||
    (userRole !== null && (pathname === '/' || pathname === '/login'));

  if (isUnauthorized) {
    return (
      <div className="flex-1 min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
        <Loader2 className="h-8 w-8 text-slate-500 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
