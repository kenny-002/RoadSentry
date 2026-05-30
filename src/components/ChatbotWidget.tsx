'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../context/StateContext';
import { Bot, User, Send, Mic, Globe, RefreshCw, Volume2, Sparkles, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export default function ChatbotWidget() {
  const { roads, contractors, authorities } = useAppState();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [lang, setLang] = useState<'en' | 'ta' | 'hi' | 'es'>('en');
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Translations for welcome greetings
  const greetings = {
    en: "Hello! I am Road Sentry Assistant. Ask me about road contractor responsibilities, relaying timelines, or how to report an issue.",
    ta: "வணக்கம்! நான் ரோடு சென்ட்ரி உதவி மையம். சாலை ஒப்பந்ததாரர் பொறுப்புகள், பழுதுபார்த்தல் காலக்கெடு, அல்லது புகார் அளிப்பது எப்படி என்று என்னிடம் கேளுங்கள்.",
    hi: "नमस्ते! मैं रोड सेंट्री सहायक हूँ। मुझसे सड़क ठेकेदार की जिम्मेदारियों, मरम्मत की समयसीमा, या शिकायत दर्ज करने के बारे में पूछें।",
    es: "¡Hola! Soy el Asistente de Road Sentry. Pregúntame sobre contratistas o cómo reportar un problema."
  };

  useEffect(() => {
    // Set initial welcome message
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: greetings[lang],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [lang]);

  useEffect(() => {
    // Scroll to bottom
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Dynamic QA parsing logic matching road database
  const getBotResponse = (userText: string): string => {
    const text = userText.toLowerCase();

    // 1. "how to file a complaint"
    if (text.includes('how to file') || text.includes('report') || text.includes('complaint')) {
      return "To file a complaint: 1. Click 'Report Issue' in the top navigation. 2. Select the road, choose the type of damage (e.g. pothole), and add a description. 3. Click 'Get GPS' to attach the geo-coordinates. 4. Upload a photo and click 'Submit'. The system automatically routes it to the Executive Engineer of that division.";
    }

    // Match Road names from our database
    const matchedRoad = roads.find(r => 
      text.includes(r.name.toLowerCase()) || 
      text.includes(r.name.split(' (')[0].toLowerCase()) ||
      (r.type === 'NH' && text.includes('nh')) ||
      (r.type === 'SH' && text.includes('sh'))
    );

    if (matchedRoad) {
      const contractor = contractors.find(c => c.id === matchedRoad.contractorId);
      const authority = authorities.find(a => a.id === (matchedRoad.type === 'NH' ? 'authority-1' : matchedRoad.type === 'SH' ? 'authority-2' : 'authority-3'));

      // 2. Who is responsible
      if (text.includes('responsible') || text.includes('contractor') || text.includes('who') || text.includes('officer')) {
        let resp = `The contractor responsible for "${matchedRoad.name}" is ${contractor ? contractor.name : 'unknown'}. `;
        if (authority) {
          resp += `The supervising engineer is ${authority.name} (${authority.role}).`;
        }
        return resp;
      }

      // 3. When last repaired
      if (text.includes('repaired') || text.includes('relayed') || text.includes('date') || text.includes('last')) {
        return `"${matchedRoad.name}" was last fully relayed on ${matchedRoad.lastRelayingDate}. It is currently rated in "${matchedRoad.condition}" condition.`;
      }

      // 4. How much was spent
      if (text.includes('spent') || text.includes('budget') || text.includes('cost') || text.includes('amount') || text.includes('sanctioned')) {
        const diff = matchedRoad.spentAmount - matchedRoad.sanctionedAmount;
        const varianceText = diff > 0 
          ? `exceeding the sanctioned budget by ₹${diff} Lakhs (overrun)`
          : `under-budget by ₹${Math.abs(diff)} Lakhs`;
        
        return `The budget allocated for "${matchedRoad.name}" was ₹${matchedRoad.sanctionedAmount} Lakhs, and the final amount spent was ₹${matchedRoad.spentAmount} Lakhs, which is ${varianceText}.`;
      }
    }

    // Default responses
    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
      return "Hello! How can I help you monitor roads or check contractor details today?";
    }

    if (text.includes('budget') || text.includes('money') || text.includes('spent')) {
      return "Budget information is currently not displayed in this portal. Try asking about contractors or repair dates.";
    }

    if (text.includes('thank') || text.includes('thanks')) {
      return "You're welcome! Citizen vigilance is key to smart-city quality roads.";
    }

    return "I couldn't match a specific road or question. Try asking: \n- 'Who is responsible for Mount Road?' \n- 'When was OMR IT Expressway last repaired?' \n- 'How to file a complaint?'";
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate bot thinking
    setTimeout(() => {
      const botMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: getBotResponse(textToSend),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 800);
  };

  // Voice recording mock
  const handleVoiceInput = () => {
    setIsListening(true);
    // Simulate speaking after 2 seconds
    setTimeout(() => {
      const voicePrompts = [
        "Who is responsible for Mount Road?",
        "When was OMR IT Expressway last repaired?",
        "How to file a complaint?"
      ];
      const randomPrompt = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];
      setInput(randomPrompt);
      setIsListening(false);
    }, 2000);
  };

  const suggestedQueries = [
    "Who is responsible for Mount Road?",
    "When was OMR IT Expressway last repaired?",
    "How to file a complaint?"
  ];

  return (
    <div className="glass-panel p-4 bg-white border border-[#E5E7EB] shadow-xl h-[550px] flex flex-col w-full">
      {/* Bot Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-[#3B82F6]/15 text-[#3B82F6] rounded-lg border border-[#3B82F6]/30">
            <Bot className="h-5 w-5 animate-bounce" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[#1E3A5F] flex items-center gap-1.5">
              <span>Road Sentry AI Assistant</span>
              <Sparkles className="h-3.5 w-3.5 text-[#3B82F6]" />
            </h3>
            <p className="text-[10px] text-slate-550 font-semibold uppercase">Smart City Agent</p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center space-x-2">
          {/* Language selector */}
          <div className="flex items-center space-x-1 text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-200">
            <Globe className="h-3.5 w-3.5 text-[#3B82F6]" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
              className="bg-transparent border-none text-[10px] font-bold outline-none text-slate-600 focus:ring-0"
            >
              <option value="en">English (EN)</option>
              <option value="ta">தமிழ் (TA)</option>
              <option value="hi">हिंदी (HI)</option>
              <option value="es">Español (ES)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Message Scroll View */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1 p-2 bg-[#F8FAFC] rounded-xl border border-slate-200 mb-3">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex items-start gap-2.5 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* Sender Icon */}
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center border shrink-0 text-xs ${
              msg.sender === 'user' 
                ? 'bg-[#1E3A5F] border-[#1E3A5F] text-white shadow' 
                : 'bg-white border-[#E5E7EB] text-[#3B82F6]'
            }`}>
              {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            {/* Bubble */}
            <div className={`p-3 rounded-xl border text-xs leading-relaxed font-medium ${
              msg.sender === 'user'
                ? 'bg-[#EFF6FF] border-[#3B82F6]/30 text-[#1E3A5F] rounded-tr-none shadow-sm'
                : 'bg-white border-[#E5E7EB] text-[#111827] rounded-tl-none shadow-sm'
            }`}>
              <p className="whitespace-pre-line">{msg.text}</p>
              <span className="block text-[8px] text-slate-400 text-right mt-1.5 font-semibold">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Queries */}
      <div className="pb-3 flex flex-wrap gap-1.5 text-[10px] font-semibold">
        {suggestedQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 bg-slate-50 hover:bg-[#3B82F6]/10 hover:text-[#1E3A5F] hover:border-[#3B82F6]/20 text-slate-650 border border-slate-250 rounded-full transition-all active:scale-95 cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Row */}
      <div className="flex gap-2 items-center">
        {/* Voice Trigger */}
        <button
          onClick={handleVoiceInput}
          disabled={isListening}
          className={`p-3 border rounded-xl flex items-center justify-center transition-all ${
            isListening 
              ? 'bg-red-500/15 text-red-500 border-red-500/30 animate-pulse' 
              : 'bg-slate-550/5 text-slate-500 border-slate-200 hover:bg-slate-100'
          }`}
          title="Mic listening simulator"
        >
          <Mic className="h-4.5 w-4.5" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          placeholder={isListening ? "Listening speaking voice..." : "Ask: 'Who is responsible for Anna Salai?'"}
          className="flex-1 px-4 py-3 border border-slate-200 bg-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] text-slate-800"
        />

        {/* Send Action */}
        <button
          onClick={() => handleSend(input)}
          className="p-3 bg-[#1E3A5F] hover:bg-[#152A47] text-white rounded-xl flex items-center justify-center transition-all shadow hover:shadow-lg active:scale-95 cursor-pointer"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </div>

    </div>
  );
}
