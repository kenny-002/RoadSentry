'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../context/StateContext';
import { Bot, User, Send, Mic, Globe, X, Sparkles, Lock } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export default function FloatingChatbot() {
  const { roads, contractors, authorities, userRole } = useAppState();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [lang, setLang] = useState<'en' | 'ta' | 'hi' | 'es'>('en');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const greetings: Record<string, string> = {
    en: "Hi! I'm RoadWatch AI 👋 Ask me about road contractors, repair dates, or how to file a complaint.",
    ta: "வணக்கம்! நான் ரோடுவாட்ச் AI. சாலை ஒப்பந்ததாரர்கள், பழுதுபார்க்கும் தேதிகள் பற்றி கேளுங்கள்.",
    hi: "नमस्ते! मैं RoadWatch AI हूँ। सड़क ठेगेदार, मरम्मत की तारीखें या शिकायत के बारे में पूछें।",
    es: "¡Hola! Soy RoadWatch AI. Pregúntame sobre contratistas o cómo reportar un problema."
  };

  // Set welcome message when language changes or user logs in
  useEffect(() => {
    if (userRole !== null) {
      setMessages([{
        id: 'msg-welcome',
        sender: 'bot',
        text: greetings[lang],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  }, [lang, userRole]);

  // Focus input when panel opens; clear unread
  useEffect(() => {
    if (!isOpen) return;
    setUnread(0);
    setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (userRole === null) return null;

  const getBotResponse = (userText: string): string => {
    const text = userText.toLowerCase();
    if (text.includes('how to file') || text.includes('report') || text.includes('complaint')) {
      return "To file a complaint: 1️⃣ Click 'Report Issue' in the navigation. 2️⃣ Select the road and damage type. 3️⃣ Click 'Get GPS' to attach coordinates. 4️⃣ Upload a photo and submit. The system auto-routes to the responsible engineer!";
    }
    const matchedRoad = roads.find(r =>
      text.includes(r.name.toLowerCase()) ||
      text.includes(r.name.split(' (')[0].toLowerCase()) ||
      (r.type === 'NH' && text.includes('nh')) ||
      (r.type === 'SH' && text.includes('sh'))
    );
    if (matchedRoad) {
      const contractor = contractors.find(c => c.id === matchedRoad.contractorId);
      const authority = authorities.find(a => a.id === (
        matchedRoad.type === 'NH' ? 'authority-1' :
        matchedRoad.type === 'SH' ? 'authority-2' : 'authority-3'
      ));
      if (text.includes('responsible') || text.includes('contractor') || text.includes('who') || text.includes('officer')) {
        return `The contractor for "${matchedRoad.name}" is ${contractor ? contractor.name : 'unknown'}. Supervising engineer: ${authority ? `${authority.name} (${authority.role})` : 'N/A'}.`;
      }
      if (text.includes('repaired') || text.includes('relayed') || text.includes('date') || text.includes('last')) {
        return `"${matchedRoad.name}" was last relayed on ${matchedRoad.lastRelayingDate}. Current condition: ${matchedRoad.condition}.`;
      }
      if (text.includes('spent') || text.includes('budget') || text.includes('cost') || text.includes('amount')) {
        const diff = matchedRoad.spentAmount - matchedRoad.sanctionedAmount;
        const varianceText = diff > 0 ? `exceeded by ₹${diff}L (overrun)` : `under-budget by ₹${Math.abs(diff)}L`;
        return `Budget for "${matchedRoad.name}": Sanctioned ₹${matchedRoad.sanctionedAmount}L, Spent ₹${matchedRoad.spentAmount}L — ${varianceText}.`;
      }
    }
    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) return "Hello! How can I help you with RoadWatch today?";
    if (text.includes('budget') || text.includes('money')) return "Budget information is currently not displayed in this portal. Try asking about contractors or repair dates.";
    if (text.includes('thank')) return "You're welcome! Citizen vigilance keeps our roads accountable. 🌟";
    return "Try asking:\n• 'Who is responsible for Mount Road?'\n• 'When was OMR last repaired?'\n• 'How do I file a complaint?'";
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { id: `msg-u-${Date.now()}`, sender: 'user', text: textToSend, timestamp: now };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const botMsg: Message = {
        id: `msg-b-${Date.now()}`,
        sender: 'bot',
        text: getBotResponse(textToSend),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      if (!isOpen) setUnread(n => n + 1);
    }, 900);
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      const prompts = [
        "Who is responsible for Mount Road?",
        "When was OMR IT Expressway last repaired?",
        "How do I file a complaint?"
      ];
      setInput(prompts[Math.floor(Math.random() * prompts.length)]);
      setIsListening(false);
    }, 2000);
  };

  const suggestedQueries = [
    "Who is responsible for Mount Road?",
    "When was OMR last repaired?",
    "How do I file a complaint?"
  ];

  return (
    <>
      {/* ── Floating Chat Panel ── */}
      <div
        className={`fixed bottom-5 right-5 z-[9999] w-[360px] max-w-[calc(100vw-2.5rem)] transition-all duration-300 origin-bottom-right ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
      >
        <div
          className="flex flex-col overflow-hidden rounded-2xl shadow-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900"
          style={{ height: '520px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold">RoadWatch AI</span>
                  <Sparkles className="h-3 w-3 text-yellow-300" />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-blue-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  <span>Smart City Agent • Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {userRole !== null && (
                <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-lg px-2 py-1">
                  <Globe className="h-3 w-3 text-blue-100" />
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as 'en' | 'ta' | 'hi' | 'es')}
                    className="bg-transparent border-none text-[10px] font-bold outline-none text-white focus:ring-0 cursor-pointer"
                  >
                    <option value="en" className="text-slate-900">EN</option>
                    <option value="ta" className="text-slate-900">TA</option>
                    <option value="hi" className="text-slate-900">HI</option>
                    <option value="es" className="text-slate-900">ES</option>
                  </select>
                </div>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/25 transition-colors active:scale-95 flex items-center justify-center cursor-pointer"
                title="Close AI Assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body — Not logged in */}
          {userRole === null ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center bg-slate-50 dark:bg-navy-950">
              <div className="h-16 w-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Lock className="h-7 w-7 text-blue-500" />
              </div>
              <div>
                <p className="font-extrabold text-slate-800 dark:text-white text-sm">Login Required</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                  Please sign in to chat with the RoadWatch AI Assistant.
                </p>
              </div>
              <a
                href="/login"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all active:scale-95 shadow"
              >
                Sign In
              </a>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50 dark:bg-navy-950/60"
                style={{ scrollbarWidth: 'none' }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 border ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-white dark:bg-navy-800 border-slate-200 dark:border-navy-700 text-slate-500'
                    }`}>
                      {msg.sender === 'user'
                        ? <User className="h-3.5 w-3.5" />
                        : <Bot className="h-3.5 w-3.5" />}
                    </div>
                    <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-xs leading-relaxed font-medium ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-navy-700 rounded-bl-none shadow-sm'
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <span className={`block text-[9px] mt-1 ${msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Typing dots */}
                {isTyping && (
                  <div className="flex items-end gap-2">
                    <div className="h-7 w-7 rounded-full bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 flex items-center justify-center">
                      <Bot className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                      {[0, 150, 300].map(d => (
                        <span key={d} className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick suggestions */}
              <div className="px-3 pt-2 pb-1 flex gap-1.5 overflow-x-auto bg-white dark:bg-navy-900 border-t border-slate-100 dark:border-navy-800 shrink-0"
                style={{ scrollbarWidth: 'none' }}>
                {suggestedQueries.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="shrink-0 px-2.5 py-1 bg-slate-100 dark:bg-navy-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-navy-700 rounded-full text-[10px] font-semibold transition-all whitespace-nowrap"
                  >
                    {q.length > 28 ? q.slice(0, 27) + '…' : q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2 items-center px-3 py-3 bg-white dark:bg-navy-900 border-t border-slate-100 dark:border-navy-800 shrink-0">
                <button
                  onClick={handleVoiceInput}
                  disabled={isListening}
                  className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                    isListening
                      ? 'bg-red-500/15 text-red-500 border-red-500/30 animate-pulse'
                      : 'bg-slate-100 dark:bg-navy-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-navy-700 hover:bg-slate-200 dark:hover:bg-navy-700'
                  }`}
                >
                  <Mic className="h-4 w-4" />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                  placeholder={isListening ? 'Listening...' : 'Ask anything about roads...'}
                  className="flex-1 px-3 py-2 border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim()}
                  className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-navy-800 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow hover:shadow-lg active:scale-95 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Fixed Round Trigger Button ── */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}
        className={`h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-95 hover:scale-110 border-2 cursor-pointer ${
          isOpen
            ? 'bg-slate-700 border-slate-600 text-white'
            : 'bg-gradient-to-tr from-blue-600 to-blue-400 border-blue-500 text-white'
        }`}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
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
