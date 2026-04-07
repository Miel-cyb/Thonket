'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, User, Radio, Paperclip } from 'lucide-react';

export default function DriverChat({ messages = [], onSendMessage }) {
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    // Auto-scroll to latest message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage?.({
            text: input,
            sender: 'driver',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        setInput('');
    };

    return (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-[500px]">

            {/* CHAT HEADER */}
            <div className="px-8 py-5 border-b border-slate-100 bg-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                        <MessageSquare size={18} />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">
                            Comm Link
                        </h2>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                            Fleet Dispatch
                        </h3>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
                    <Radio size={12} className="text-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Secure Uplink</span>
                </div>
            </div>

            {/* MESSAGE AREA */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 scroll-smooth"
            >
                {messages.map((msg, i) => {
                    const isDriver = msg.sender === 'driver';
                    return (
                        <div key={i} className={`flex flex-col ${isDriver ? 'items-end' : 'items-start'}`}>
                            <div className={`flex items-center gap-2 mb-1 ${isDriver ? 'flex-row-reverse' : ''}`}>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    {msg.sender}
                                </span>
                                <span className="text-[8px] font-bold text-slate-300">
                                    {msg.timestamp || '12:00 PM'}
                                </span>
                            </div>

                            <div className={`
                max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm
                ${isDriver
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}
              `}>
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* INPUT COMMAND AREA */}
            <div className="p-6 bg-white border-t border-slate-100">
                <div className="relative flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <Paperclip size={18} />
                    </button>

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Transmit message to dispatch..."
                        className="flex-1 bg-transparent border-none text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-black placeholder:uppercase placeholder:text-[10px] focus:ring-0"
                    />

                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="p-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-30 disabled:hover:bg-slate-900 transition-all shadow-lg active:scale-95"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}