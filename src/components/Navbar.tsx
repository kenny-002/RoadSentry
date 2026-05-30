'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppState } from '../context/StateContext';
import { Eye, Menu, X, Sun, Moon, ShieldAlert, MapPin, Search, LogIn, LogOut, Shield, User, RefreshCw } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { userRole, logout } = useAppState();

  // Load theme preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('roadwatch_theme') as 'light' | 'dark' | null;
      const resolvedTheme = savedTheme || 'light';
      setTheme(resolvedTheme);
      if (resolvedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      if (!savedTheme) {
        localStorage.setItem('roadwatch_theme', 'light');
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('roadwatch_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navLinks = [
    { name: 'Road Map', href: '/dashboard', icon: MapPin },
    { name: 'Report Issue', href: '/report', icon: ShieldAlert },
    { name: 'Track Complaint', href: '/tracker', icon: Search },
    { name: 'Authority Port', href: '/admin', icon: Eye },
  ];

  const filteredLinks = React.useMemo(() => {
    // Hide all nav links when not logged in
    if (userRole === null) return [];
    // Citizen: hide admin panel
    if (userRole === 'user') {
      return navLinks.filter(link => link.href !== '/admin');
    }
    // Admin: show all
    return navLinks;
  }, [userRole]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-[#E5E7EB] shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center h-15">
              <img
                src="/logo_cropped.png"
                alt="Road Sentry"
                className="h-14 sm:h-15 w-[160px] sm:w-[190px] object-contain transition-opacity hover:opacity-90"
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {filteredLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all border ${
                    isActive
                      ? 'bg-[#3B82F6]/10 text-[#1E3A5F] border-[#3B82F6]/25 font-bold shadow-sm'
                      : 'text-slate-655 hover:bg-slate-50 hover:text-[#1E3A5F] border-transparent'
                  }`}
                >
                  <Icon className="h-4 w-4" style={{ color: isActive ? '#3B82F6' : undefined }} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-550 hover:bg-slate-100 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {/* Session CTA */}
            {userRole !== null ? (
              <div className="flex items-center space-x-2">
                {/* Active Role Badge */}
                {userRole === 'admin' ? (
                  <div className="flex items-center space-x-1 px-2.5 py-1 bg-[#1E3A5F] border border-[#1E3A5F]/20 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm animate-in fade-in duration-200">
                    <Shield className="h-3 w-3 text-[#3B82F6]" />
                    <span>Admin</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 px-2.5 py-1 bg-[#EFF6FF] text-[#3B82F6] border border-[#3B82F6]/25 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm animate-in fade-in duration-200">
                    <User className="h-3 w-3" />
                    <span>Citizen</span>
                  </div>
                )}

                {/* Switch Account Option */}
                <button
                  onClick={() => {
                    const nextRole = userRole === 'admin' ? 'user' : 'admin';
                    logout();
                    window.location.href = `/login?switch=${nextRole}`;
                  }}
                  className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-[#1E3A5F] border border-[#E5E7EB] rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer shadow-sm"
                  title="Switch profile role"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-[#3B82F6]" />
                  <span>Switch Account</span>
                </button>

                {/* Log Out Option */}
                <button
                  onClick={() => {
                    logout();
                    window.location.href = '/login';
                  }}
                  className="px-3.5 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 hover:border-transparent rounded-lg text-xs font-semibold transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center space-x-1.5"
              >
                <LogIn className="h-4 w-4 text-white" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu and Theme toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile Menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden px-2 pt-2 pb-4 space-y-1 glass-panel border-x-0 border-t-0 rounded-none bg-opacity-95 dark:bg-opacity-95 border-b border-card-border backdrop-blur-lg animate-in fade-in slide-in-from-top-2 duration-200">
          {filteredLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-semibold transition-all border ${
                  isActive
                    ? 'bg-[#3B82F6]/10 text-[#1E3A5F] border-[#3B82F6]/25 font-bold shadow-sm'
                    : 'text-slate-655 hover:bg-slate-50 hover:text-[#1E3A5F] border-transparent'
                }`}
              >
                <Icon className="h-5 w-5" style={{ color: isActive ? '#3B82F6' : undefined }} />
                <span>{link.name}</span>
              </Link>
            );
          })}
          
          {userRole !== null ? (
            <div className="pt-4 pb-2 px-3 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Signed in as:</span>
                {userRole === 'admin' ? (
                  <div className="flex items-center space-x-1 px-2.5 py-1 bg-[#1E3A5F] border border-[#1E3A5F]/20 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm animate-in fade-in duration-200">
                    <Shield className="h-3 w-3 text-[#3B82F6]" />
                    <span>Admin</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 px-2.5 py-1 bg-[#EFF6FF] text-[#3B82F6] border border-[#3B82F6]/25 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm animate-in fade-in duration-200">
                    <User className="h-3 w-3" />
                    <span>Citizen</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  const nextRole = userRole === 'admin' ? 'user' : 'admin';
                  logout();
                  window.location.href = `/login?switch=${nextRole}`;
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-55/5 text-[#1E3A5F] border border-[#E5E7EB] rounded-lg text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-sm animate-in fade-in duration-200"
              >
                <RefreshCw className="h-4 w-4 text-[#3B82F6]" />
                <span>Switch Account</span>
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                  window.location.href = '/login';
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 hover:border-transparent rounded-lg text-sm font-semibold transition-all active:scale-95 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 pb-2 px-3 border-t border-slate-200 dark:border-navy-800">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg text-base font-semibold shadow-md hover:shadow-lg active:scale-95"
              >
                <LogIn className="h-5 w-5 text-white" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
