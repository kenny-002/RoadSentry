'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppState } from '../context/StateContext';
import { 
  Home, 
  ShieldAlert, 
  Search, 
  Map, 
  User, 
  Shield, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  LogOut, 
  RefreshCw
} from 'lucide-react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, currentUser, logout } = useAppState();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load theme preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('roadwatch_theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('roadwatch_theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  };

  const navLinks = [
    { name: 'Home Page', href: '/dashboard', icon: Home },
    { name: 'Report Issues', href: '/report', icon: ShieldAlert },
    { name: 'Track My Complaints', href: '/tracker', icon: Search },
    { name: 'Roads', href: '/roads', icon: Map },
    { name: 'My Profile', href: '/profile', icon: User },
  ];

  const filteredLinks = React.useMemo(() => {
    if (userRole === null) return [];
    const links = [...navLinks];
    if (userRole === 'admin') {
      links.push({ name: 'Authority Port', href: '/admin', icon: Shield });
    }
    return links;
  }, [userRole]);

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Render public navbar if NOT logged in
  if (userRole === null) {
    return (
      <div className="flex-1 flex flex-col min-h-screen">
        <nav 
          className="w-full bg-white border-b border-slate-200/90 shadow-[0_2px_15px_-3px_rgba(15,23,42,0.06)] sticky top-0 shrink-0"
          style={{ zIndex: 1010 }}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8 h-[76px] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center transition-all duration-200 hover:opacity-95 hover:scale-[1.015] active:scale-[0.985]">
                <img
                  src="/logo_cropped.png"
                  alt="Road Sentry Logo"
                  className="h-13 sm:h-15 w-auto object-contain"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                Sign In
              </Link>
            </div>
          </div>
        </nav>
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    );
  }

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-navy-900 text-slate-800 dark:text-slate-200">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200/85 dark:border-navy-850 flex items-center justify-center shrink-0">
        <img
          src="/logo_cropped.png"
          alt="Road Sentry Logo"
          className="h-15 w-auto object-contain"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all border ${
                isActive
                  ? 'shadow-sm border-[#3B82F6]/30'
                  : 'text-slate-655 hover:bg-slate-50 hover:text-[#1E3A5F] border-transparent'
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: '#EFF6FF',
                      color: '#1E3A5F'
                    }
                  : undefined
              }
            >
              <Icon 
                className="h-4.5 w-4.5 shrink-0" 
                style={{
                  color: isActive ? '#3B82F6' : '#64748B'
                }}
              />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile & Actions */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-3 shrink-0">
        {/* User Summary */}
        <div className="flex items-center space-x-2.5 px-1">
          <div className="h-9 w-9 bg-slate-100 text-slate-700 rounded-full border border-slate-200 flex items-center justify-center font-extrabold text-xs">
            {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'C'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">
              {currentUser?.name || 'Citizen User'}
            </p>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className={`h-1.5 w-1.5 rounded-full ${userRole === 'admin' ? 'bg-[#3B82F6] animate-pulse' : 'bg-[#3B82F6]/60'} inline-block`} />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                {userRole === 'admin' ? 'Admin' : 'Citizen'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-1.5 pt-1.5 text-slate-500 dark:text-slate-400">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg border border-slate-200 dark:border-navy-805 bg-white dark:bg-navy-900 hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={() => {
              const nextRole = userRole === 'admin' ? 'user' : 'admin';
              logout();
              window.location.href = `/login?switch=${nextRole}`;
            }}
            className="p-2.5 rounded-lg border border-slate-200 dark:border-navy-805 bg-white dark:bg-navy-900 hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="Switch User Role"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            className="col-span-2 p-2.5 rounded-lg border border-red-500/10 dark:border-red-500/5 bg-red-500/5 hover:bg-red-500 hover:text-white text-red-500 flex items-center justify-center gap-1.5 transition-all text-xs font-bold cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
            <span>Exit</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen relative bg-slate-50" suppressHydrationWarning>
      
      {/* ── Top Header Bar (Unified for PC & Mobile) ── */}
      <header 
        className="w-full h-[76px] bg-white border-b border-slate-200/90 shadow-[0_2px_15px_-3px_rgba(15,23,42,0.06)] flex items-center justify-between px-6 sm:px-8 relative shrink-0"
        style={{ zIndex: 1010 }}
      >
        <div className="flex items-center gap-4 animate-in fade-in duration-300">
          {/* Hamburger Menu Icon (3 lines option) */}
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-[#1E3A5F] cursor-pointer flex items-center justify-center transition-colors border border-slate-200 bg-slate-50/50"
            aria-label="Open Sidebar Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Dedicated Logo Container */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center transition-all duration-200 hover:opacity-95 hover:scale-[1.015] active:scale-[0.985]">
              <img
                src="/logo_cropped.png"
                alt="Road Sentry Logo"
                className="h-13 sm:h-15 w-auto object-contain"
              />
            </Link>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Active User Badge (PC/Tablet only) */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
            <span className={`h-1.5 w-1.5 rounded-full ${userRole === 'admin' ? 'bg-[#3B82F6] animate-pulse' : 'bg-[#3B82F6]/60'} inline-block`} />
            <span>{currentUser?.name || 'Citizen'}</span>
          </div>
        </div>
      </header>

      {/* ── Slide-out Left Sidebar Drawer (PC & Mobile) ── */}
      {isOpen && (
        <div 
          className="fixed inset-0 flex"
          style={{ zIndex: 1020 }}
        >
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
          />
          {/* Drawer Panel */}
          <div 
            className="relative flex flex-col w-72 max-w-[85vw] h-full shadow-2xl animate-slide-in-left bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-navy-800"
            style={{ zIndex: 1020 }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-350 rounded-full hover:bg-slate-200 z-10 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-4.5 w-4.5" />
            </button>
            <div className="h-full flex-1">
              {renderSidebarContent()}
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="w-full py-6 px-4 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-navy-850/50 text-center text-[10px] text-slate-400 dark:text-slate-500 font-medium bg-white/30 dark:bg-navy-900/10 mt-auto">
          <p>© {new Date().getFullYear()} Road Sentry • Guardian of the Roads • Municipal Quality Transparency</p>
        </footer>
      </div>

    </div>
  );
}
