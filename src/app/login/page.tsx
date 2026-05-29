'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '../../context/StateContext';
import { ShieldAlert, User, Shield, Key, Eye, EyeOff, Loader2, Info, ArrowRight, UserPlus, LogIn, CheckCircle } from 'lucide-react';

interface RegisteredUser {
  name: string;
  email: string;
  password?: string;
}

export default function LoginPage() {
  const { userRole, login } = useAppState();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  
  // View mode: 'login' or 'register'
  const [viewMode, setViewMode] = useState<'login' | 'register'>('login');

  // Login inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Status states
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to respective dashboard immediately
  useEffect(() => {
    if (userRole !== null) {
      if (userRole === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [userRole, router]);

  // Parse switch role query param on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const switchRole = params.get('switch');
      if (switchRole === 'user' || switchRole === 'admin') {
        setActiveTab(switchRole);
      }
    }
  }, []);

  // Clear inputs and error/success messages on tab switch
  useEffect(() => {
    setError('');
    setSuccessMsg('');
    setUsername('');
    setPassword('');
    setViewMode('login');
  }, [activeTab]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all credential fields.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (activeTab === 'user') {
        // Check registered credentials in localStorage
        if (typeof window !== 'undefined') {
          const storedUsersRaw = localStorage.getItem('roadwatch_registered_users');
          if (storedUsersRaw) {
            try {
              const usersList = JSON.parse(storedUsersRaw) as RegisteredUser[];
              const matched = usersList.find(
                u => u.email.toLowerCase() === username.trim().toLowerCase() && u.password === password
              );
              if (matched) {
                login('user', { name: matched.name, email: matched.email });
                router.replace('/dashboard');
                return;
              }
            } catch (err) {
              console.error('Failed to parse registered users:', err);
            }
          }
        }

        setError('Invalid credentials. If you are a new user, please register an account first.');
        setIsSubmitting(false);
      } else {
        // Admin credentials check (admin/adminpassword)
        if (username.trim() === 'admin' && password === 'adminpassword') {
          login('admin', { name: 'Administrator', email: 'admin@roadwatch.gov' });
          router.replace('/admin');
        } else {
          setError('Invalid administrator credentials. Hint: use admin / adminpassword');
          setIsSubmitting(false);
        }
      }
    }, 1200);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
      setError('All fields are required.');
      return;
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const storedUsersRaw = localStorage.getItem('roadwatch_registered_users') || '[]';
        try {
          const usersList = JSON.parse(storedUsersRaw) as RegisteredUser[];
          
          // Check if email already registered
          const alreadyExists = usersList.some(
            u => u.email.toLowerCase() === regEmail.trim().toLowerCase()
          );

          if (alreadyExists) {
            setError('This email address is already registered.');
            setIsSubmitting(false);
            return;
          }

          // Register new user
          const newUser: RegisteredUser = {
            name: regName.trim(),
            email: regEmail.trim(),
            password: regPassword
          };

          usersList.push(newUser);
          localStorage.setItem('roadwatch_registered_users', JSON.stringify(usersList));

          // Set success message, switch to login view, pre-fill credentials
          setSuccessMsg('Account registered successfully! You can now log in.');
          setUsername(regEmail.trim());
          setPassword(regPassword);
          setViewMode('login');

          // Reset register form fields
          setRegName('');
          setRegEmail('');
          setRegPassword('');
          setRegConfirmPassword('');
        } catch (err) {
          setError('Failed to process registration.');
          console.error(err);
        }
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex-1 w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 gradient-radial-glow smart-grid-bg min-h-[calc(100vh-8rem)]">
      <div className="max-w-md w-full space-y-6">
        
        {/* Page Logo & Header */}
        <div className="text-center space-y-2.5">
          <div className="h-12 w-12 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-xl text-white font-bold flex items-center justify-center mx-auto shadow-lg glow-blue">
            <ShieldAlert className="h-6 w-6 animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            {viewMode === 'login' ? 'Sign In to RoadWatch' : 'Register Citizen Account'}
          </h2>
          <p className="text-xs text-slate-555 dark:text-slate-400 max-w-xs mx-auto">
            {viewMode === 'login' 
              ? 'Track complaint tickets, file defects, and review contractor grading.'
              : 'Sign up to report potholes, view contractor metrics, and access quality transparency audits.'
            }
          </p>
        </div>

        {/* Login/Register Panel */}
        <div className="glass-panel p-6 bg-opacity-75 dark:bg-opacity-30 border border-card-border shadow-2xl relative">
          
          {/* Tabs - Only show when in Login mode */}
          {viewMode === 'login' && (
            <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-navy-950 p-1 rounded-xl border border-slate-200/60 dark:border-navy-900 text-xs font-bold mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('user')}
                className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'user'
                    ? 'bg-white dark:bg-navy-800 text-blue-600 dark:text-blue-400 shadow'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Citizen Portal</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-white dark:bg-navy-800 text-emerald-600 dark:text-emerald-400 shadow'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Department Portal</span>
              </button>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg flex items-center gap-1.5 animate-in fade-in duration-200">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 text-[10px] text-red-500 font-bold bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg flex items-center gap-1.5 animate-in fade-in duration-200">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {viewMode === 'login' ? (
            /* Sign In Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Username */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                  Email Address / Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-550">
                    {activeTab === 'user' ? <User className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={activeTab === 'user' ? "e.g. john@example.com" : "admin username"}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-navy-805 bg-white/70 dark:bg-navy-950/70 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                  Security Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-550">
                    <Key className="h-4 w-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 border border-slate-200 dark:border-navy-805 bg-white/70 dark:bg-navy-950/70 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 cursor-pointer ${
                  activeTab === 'user' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-emerald-600 hover:bg-emerald-700'
                } disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-1.5">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying Identity...</span>
                  </div>
                ) : (
                  <span>Sign In to Dashboard</span>
                )}
              </button>

              {activeTab === 'user' && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('register');
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="text-xs text-blue-500 hover:text-blue-600 font-bold flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>New user? Register here</span>
                  </button>
                </div>
              )}
            </form>
          ) : (
            /* Citizen Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-550">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-navy-805 bg-white/70 dark:bg-navy-950/70 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-550">
                    <Info className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-navy-805 bg-white/70 dark:bg-navy-950/70 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                  Choose Password (min. 6 chars)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-550">
                    <Key className="h-4 w-4" />
                  </span>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 border border-slate-200 dark:border-navy-805 bg-white/70 dark:bg-navy-950/70 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {showRegPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-550">
                    <Key className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-navy-805 bg-white/70 dark:bg-navy-950/70 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-1.5">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating Citizen Account...</span>
                  </div>
                ) : (
                  <span>Register Account</span>
                )}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('login');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-350 font-bold flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Already have an account? Sign In</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
