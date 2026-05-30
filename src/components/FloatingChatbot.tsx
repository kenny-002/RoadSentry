'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../context/StateContext';
import { Bot, User, Send, Mic, X, Sparkles, Lock, RefreshCw, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: string;
  isError?: boolean;
}

// Suggested questions shown as quick chips
const SUGGESTED_QUESTIONS = [
  "What is the road type of OMR IT Expressway?",
  "Who is the contractor for Mount Road?",
  "What is the sanctioned amount for NH 44?",
  "When was ECR last relaid?",
  "How can I report a pothole?",
  "Which authority handles GST Road?",
  "How do I track my complaint?",
  "What are road safety emergency numbers?",
];

export default function FloatingChatbot() {
  const { userRole } = useAppState();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');

  // Chat history for multi-turn context (sent to backend)
  const chatHistoryRef = useRef<{ role: string; text: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const getTimestamp = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Welcome message on open
  useEffect(() => {
    if (userRole !== null && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'bot',
        text: "👋 Hi! I'm **Road Sentry AI** — your smart road infrastructure assistant.\n\nI can help you with:\n• Road details, contractor info, budgets\n• Pothole & complaint reporting\n• Road safety & emergency contacts\n• Track complaint status\n\nAsk me anything about roads! 🛣️",
        timestamp: getTimestamp(),
      }]);
    }
  }, [userRole]);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  if (userRole === null) return null;

  // ── Send message to backend API ──────────────────────────────────────────
  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setError('');
    setInput('');

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: getTimestamp(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Add to history for context
    chatHistoryRef.current.push({ role: 'user', text: trimmed });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: chatHistoryRef.current.slice(-10), // last 10 turns for context
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Server error');
      }

      const botText = data.reply || "I'm having trouble responding. Please try again.";

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: 'bot',
        text: botText,
        timestamp: getTimestamp(),
      };
      setMessages(prev => [...prev, botMsg]);
      chatHistoryRef.current.push({ role: 'bot', text: botText });

      if (!isOpen) setUnread(n => n + 1);
    } catch (err: any) {
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'bot',
        text: "⚠️ Connection error. Please check your internet and try again.",
        timestamp: getTimestamp(),
        isError: true,
      };
      setMessages(prev => [...prev, errMsg]);
      chatHistoryRef.current.push({ role: 'bot', text: errMsg.text });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Voice Input (Web Speech API) ─────────────────────────────────────────
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setError('Voice input not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;
    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleClear = () => {
    setMessages([{
      id: 'welcome-reset',
      role: 'bot',
      text: "Chat cleared! Ask me anything about roads, contractors, complaints or road safety. 🛣️",
      timestamp: getTimestamp(),
    }]);
    chatHistoryRef.current = [];
    setError('');
  };

  // Render message text with basic markdown-like formatting
  const renderText = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        // Bold: **text**
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <span key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
            )}
            {i < text.split('\n').length - 1 && <br />}
          </span>
        );
      });
  };

  return (
    <>
      {/* ── Floating Chat Panel ── */}
      <div
        className={`fixed bottom-5 right-5 z-[9999] w-[370px] max-w-[calc(100vw-1.5rem)] transition-all duration-300 origin-bottom-right ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
      >
        <div
          className="flex flex-col overflow-hidden rounded-2xl shadow-2xl border border-slate-200 bg-white"
          style={{ height: '560px' }}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#1E3A5F] border-b border-blue-400/20 text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center border border-blue-400/30">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold text-white">Road Sentry AI</span>
                  <Sparkles className="h-3 w-3 text-blue-400" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                  <span className={`h-1.5 w-1.5 rounded-full inline-block ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                  <span>{isLoading ? 'Thinking...' : 'Road Infrastructure Expert • Online'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleClear}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-slate-300 hover:text-white"
                title="Clear chat"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/25 transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          {userRole === null ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center bg-slate-50">
              <div className="h-16 w-16 rounded-full bg-[#1E3A5F]/10 border border-[#1E3A5F]/20 flex items-center justify-center">
                <Lock className="h-7 w-7 text-[#1E3A5F]" />
              </div>
              <div>
                <p className="font-extrabold text-slate-800 text-sm">Login Required</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                  Sign in to chat with the Road Sentry AI Assistant.
                </p>
              </div>
              <a
                href="/login"
                className="px-5 py-2.5 bg-[#1E3A5F] hover:bg-[#152A47] text-white text-xs font-bold rounded-xl transition-all shadow"
              >
                Sign In
              </a>
            </div>
          ) : (
            <>
              {/* ── Messages ── */}
              <div
                className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#F8FAFC]"
                style={{ scrollbarWidth: 'none' }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 border ${
                      msg.role === 'user'
                        ? 'bg-[#1E3A5F] border-[#1E3A5F] text-white'
                        : msg.isError
                        ? 'bg-red-50 border-red-200 text-red-400'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}>
                      {msg.role === 'user'
                        ? <User className="h-3.5 w-3.5" />
                        : msg.isError
                        ? <AlertCircle className="h-3.5 w-3.5" />
                        : <Bot className="h-3.5 w-3.5" />}
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[82%] px-3 py-2.5 rounded-2xl text-xs leading-relaxed font-medium ${
                      msg.role === 'user'
                        ? 'bg-[#EFF6FF] border border-blue-200 text-[#1E3A5F] rounded-br-none shadow-sm'
                        : msg.isError
                        ? 'bg-red-50 border border-red-200 text-red-700 rounded-bl-none shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
                    }`}>
                      <div className="whitespace-pre-line">{renderText(msg.text)}</div>
                      <span className={`block text-[9px] mt-1.5 ${
                        msg.role === 'user' ? 'text-blue-400 text-right' : 'text-slate-400'
                      }`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Typing / Loading indicator */}
                {isLoading && (
                  <div className="flex items-end gap-2">
                    <div className="h-7 w-7 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                      <Bot className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold mr-1">Road Sentry AI is thinking</span>
                      {[0, 150, 300].map(d => (
                        <span key={d} className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* ── Suggested Questions ── */}
              <div
                className="px-3 pt-2 pb-1.5 flex gap-1.5 overflow-x-auto bg-white border-t border-slate-100 shrink-0"
                style={{ scrollbarWidth: 'none' }}
              >
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    disabled={isLoading}
                    className="shrink-0 px-2.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 disabled:opacity-50 text-slate-600 border border-slate-200 rounded-full text-[10px] font-semibold transition-all whitespace-nowrap cursor-pointer"
                  >
                    {q.length > 30 ? q.slice(0, 29) + '…' : q}
                  </button>
                ))}
              </div>

              {/* ── Input Bar ── */}
              <div className="flex gap-2 items-center px-3 py-3 bg-white border-t border-slate-100 shrink-0">
                {/* Voice button */}
                <button
                  onClick={handleVoiceInput}
                  disabled={isListening || isLoading}
                  title="Voice input"
                  className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                    isListening
                      ? 'bg-red-500/15 text-red-500 border-red-300 animate-pulse'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Mic className="h-4 w-4" />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                  placeholder={isListening ? '🎙 Listening...' : 'Ask about any road, contractor, complaint…'}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30 text-slate-800 placeholder:text-slate-400 transition-colors disabled:opacity-60"
                />

                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 bg-[#1E3A5F] hover:bg-[#152A47] disabled:bg-slate-200 disabled:cursor-not-allowed text-white disabled:text-slate-400 rounded-xl transition-all shadow hover:shadow-md active:scale-95 shrink-0"
                >
                  {isLoading
                    ? <RefreshCw className="h-4 w-4 animate-spin" />
                    : <Send className="h-4 w-4" />
                  }
                </button>
              </div>

              {/* ── Gemini badge ── */}
              <div className="text-center pb-2 text-[9px] text-slate-400 font-semibold bg-white">
                ⚡ Powered by Gemini AI · Road topics only
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Floating Trigger Button ── */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}
        className={`h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-95 hover:scale-110 border-2 cursor-pointer ${
          isOpen
            ? 'bg-slate-800 border-slate-700 text-white'
            : 'bg-[#1E3A5F] border-blue-400/30 text-blue-400'
        }`}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <div className="relative flex items-center justify-center">
            <Bot className="h-6 w-6" />
            {unread > 0 && (
              <span
                style={{ position: 'absolute', top: '-14px', right: '-14px' }}
                className="h-5 w-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white"
              >
                {unread}
              </span>
            )}
          </div>
        )}
      </button>
    </>
  );
}
