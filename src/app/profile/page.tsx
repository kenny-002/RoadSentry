'use client';

import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/StateContext';
import { 
  User, Mail, ShieldCheck, Shield, Activity, Key, FileText, 
  CheckCircle2, Clock, Languages, Moon, Sun, Edit3, Save, X,
  LogOut, RefreshCw
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, userRole, complaints, login, logout } = useAppState();

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [emailInput, setEmailInput] = useState(currentUser?.email || '');

  // Keep edit state in sync with context
  useEffect(() => {
    if (currentUser) {
      setNameInput(currentUser.name);
      setEmailInput(currentUser.email);
    }
  }, [currentUser]);

  // Language state
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('roadwatch_language') || 'English';
    }
    return 'English';
  });

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('roadwatch_language', lang);
    }
  };

  // Dark Mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleTheme = (dark: boolean) => {
    setIsDarkMode(dark);
    if (typeof window !== 'undefined') {
      if (dark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  };

  const handleSaveProfile = () => {
    if (!nameInput.trim() || !emailInput.trim()) return;
    login(userRole || 'user', {
      name: nameInput,
      email: emailInput
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setNameInput(currentUser?.name || '');
    setEmailInput(currentUser?.email || '');
    setIsEditing(false);
  };

  const userStats = React.useMemo(() => {
    if (!currentUser) return { total: 0, active: 0, resolved: 0 };
    const myComplaints = complaints.filter(c => {
      const emailMatch = c.reporterEmail && currentUser.email && c.reporterEmail.trim().toLowerCase() === currentUser.email.trim().toLowerCase();
      const nameMatch = c.reporterName && currentUser.name && c.reporterName.trim().toLowerCase() === currentUser.name.trim().toLowerCase();
      return emailMatch || nameMatch;
    });
    const total = myComplaints.length;
    const resolved = myComplaints.filter(c => c.status === 'Resolved').length;
    const active = total - resolved;
    return { total, active, resolved };
  }, [complaints, currentUser]);

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'C';

  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Page Header */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-black tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
            <User className="h-3 w-3" />
            <span>User Hub</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Account Profile
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
            Manage your citizen credentials and review your civic contribution statistics
          </p>
        </div>

        {/* 1-by-1 Vertical Column Grid Alignment */}
        <div className="flex flex-col gap-6 w-full">

          {/* 1. Identity & Credentials Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
            {/* Subtle top stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500" />

            <div className="p-6 flex flex-col items-center">
              {/* Avatar */}
              <div className="h-20 w-20 bg-blue-50/50 dark:bg-slate-950 text-blue-600 dark:text-blue-400 rounded-full border-2 border-blue-100 dark:border-slate-800 flex items-center justify-center font-black text-2xl mb-4 shadow-inner">
                {initials}
              </div>

              {!isEditing ? (
                // View Mode
                <div className="w-full flex flex-col items-center text-center animate-in fade-in duration-250">
                  <h3 className="font-extrabold text-slate-800 dark:text-white text-base leading-tight">
                    {currentUser?.name || 'Citizen'}
                  </h3>

                  <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30 rounded-full uppercase tracking-wider">
                    <Shield className="h-3 w-3" />
                    {userRole === 'admin' ? 'System Administrator' : 'Citizen Reporter'}
                  </span>

                  <div className="w-full border-t border-slate-200 dark:border-slate-800 mt-5 pt-5 space-y-4 text-left">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Registered Email</span>
                      <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-xs">
                        <Mail className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{currentUser?.email || 'not provided'}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Verification Status</span>
                      <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-xs">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Verified Citizen Role</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase transition-all duration-200 active:scale-98"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              ) : (
                // Edit Mode
                <div className="w-full flex flex-col space-y-4 text-left animate-in fade-in duration-250">
                  <h4 className="text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Edit Credentials</h4>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your email address"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={!nameInput.trim() || !emailInput.trim()}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase transition-all duration-200 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-750 rounded-xl text-xs font-black uppercase transition-all duration-200 active:scale-98 flex items-center justify-center gap-1.5"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Theme Preferences (Dark / Light Switcher) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center gap-2">
              {isDarkMode ? (
                <Moon className="h-4.5 w-4.5 text-blue-500" />
              ) : (
                <Sun className="h-4.5 w-4.5 text-amber-500" />
              )}
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">Theme Preference</h4>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl w-full max-w-xs border border-slate-200/40 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => toggleTheme(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-black uppercase transition-all duration-200 ${
                  !isDarkMode
                    ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-md'
                    : 'text-slate-550 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Sun className="h-4 w-4" />
                <span>Light Mode</span>
              </button>
              <button
                type="button"
                onClick={() => toggleTheme(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-black uppercase transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-md'
                    : 'text-slate-555 dark:text-slate-450 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Moon className="h-4 w-4" />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>

          {/* 3. Language Selection (5 Languages) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center gap-2">
              <Languages className="h-4.5 w-4.5 text-blue-500" />
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">System Language</h4>
            </div>

            <div className="relative max-w-xs">
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer uppercase select-custom"
                style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
              >
                <option value="English">English (US)</option>
                <option value="Español">Español (Spanish)</option>
                <option value="Français">Français (French)</option>
                <option value="Deutsch">Deutsch (German)</option>
                <option value="हिन्दी">हिन्दी (Hindi)</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 text-[10px]">
                ▼
              </div>
            </div>
          </div>

          {/* 4. Contribution Statistics */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
            <div className="flex items-center gap-2 mb-5">
              <Activity className="h-4.5 w-4.5 text-slate-700 dark:text-slate-300" />
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">Your Contribution Summary</h4>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Reported', value: userStats.total, icon: FileText },
                { label: 'Active', value: userStats.active, icon: Clock },
                { label: 'Resolved', value: userStats.resolved, icon: CheckCircle2 },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 rounded-xl p-4 text-center">
                  <Icon className="h-4 w-4 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-black text-slate-800 dark:text-white">{value}</p>
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Privacy & Data Security */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <Key className="h-4.5 w-4.5 text-blue-600 dark:text-blue-450" />
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">Data Protection &amp; Privacy</h4>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
              <div className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                <div className="w-1 bg-blue-500 rounded-full shrink-0" />
                <p>
                  <span className="font-extrabold text-slate-800 dark:text-white">Local Security Standard:</span> Road Sentry operates on decentralized, client-side session encryption. All citizen credentials, reported defect drafts, and authentication states are saved directly inside your browser's private localStorage.
                </p>
              </div>
              <div className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                <div className="w-1 bg-blue-500 rounded-full shrink-0" />
                <p>
                  No third-party cookies or telemetry cookies are generated during your sessions. Audits are submitted directly to matching ward engineers on-demand, maximizing anonymity and security.
                </p>
              </div>
            </div>
          </div>

          {/* 6. Account Actions (Switch Account & Logout) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-slate-700 dark:text-slate-350" />
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">Account Actions</h4>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Switch Account */}
              <button
                type="button"
                onClick={() => {
                  const nextRole = userRole === 'user' ? 'admin' : 'user';
                  window.location.href = `/login?switch=${nextRole}`;
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase transition-all duration-200 active:scale-98"
              >
                <RefreshCw className="h-3.5 w-3.5 animate-none" />
                <span>Switch to {userRole === 'user' ? 'Admin Portal' : 'Citizen View'}</span>
              </button>

              {/* Log Out */}
              <button
                type="button"
                onClick={() => {
                  logout();
                  window.location.href = '/login';
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xl text-xs font-black uppercase transition-all duration-200 active:scale-98"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out Account</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
