'use client';

import { Map as MapIcon, Navigation, Target, Flag, Compass, Maximize2 } from 'lucide-react';

export default function DriverMap({ tasks = [], vehicles = [] }) {
    // We assume the first task in the filtered list is the 'Active' destination
    const activeTask = tasks.find(t => t.status === 'in-progress') || tasks[0];

    return (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-6 h-[500px] flex flex-col overflow-hidden group">

            {/* DRIVER HUD HEADER */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 ring-4 ring-white">
                        <Navigation size={22} className="text-white fill-current" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">
                            Active Navigation
                        </h2>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                            Route Guidance
                        </h3>
                    </div>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                    <Maximize2 size={14} /> Full Screen
                </button>
            </div>

            {/* TACTICAL MAP TERMINAL */}
            <div className="relative flex-1 bg-slate-900 rounded-[2rem] overflow-hidden border-4 border-slate-100 shadow-inner">

                {/* SATELLITE / GRID OVERLAY */}
                <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}
                />

                {/* PLACEHOLDER CONTENT */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="relative">
                        <Compass size={64} className="text-slate-800 animate-[spin_10s_linear_infinite]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-2 w-2 bg-indigo-500 rounded-full animate-ping" />
                        </div>
                    </div>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
                        GPS Signal Locked
                    </p>
                </div>

                {/* FLOATING NAVIGATION HUD (Glassmorphism) */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                    <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl pointer-events-auto max-w-[240px]">
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Next Destination</p>
                        <h4 className="text-sm font-black text-white uppercase leading-tight mb-3">
                            {activeTask?.customerName || "Scanning for Tasks..."}
                        </h4>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-slate-500 uppercase">Distance</span>
                                <span className="text-xs font-black text-white">4.2 KM</span>
                            </div>
                            <div className="h-6 w-px bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-slate-500 uppercase">ETA</span>
                                <span className="text-xs font-black text-white">12 MIN</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-2 rounded-xl pointer-events-auto">
                        <div className="flex flex-col gap-2">
                            <button className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors">
                                <Target size={18} />
                            </button>
                            <div className="h-px bg-white/10 mx-1" />
                            <button className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors">
                                <Flag size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ACTIVE MARKERS (Example points) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                        <div className="h-12 w-12 bg-indigo-500/20 rounded-full animate-pulse flex items-center justify-center border border-indigo-500/30">
                            <div className="h-4 w-4 bg-indigo-500 rounded-full border-2 border-white shadow-xl" />
                        </div>
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white rounded-lg shadow-xl border border-slate-200">
                            <span className="text-[9px] font-black text-slate-900 uppercase whitespace-nowrap">Current Pos</span>
                            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-slate-200 rotate-45" />
                        </div>
                    </div>
                </div>

            </div>

            {/* FOOTER STATUS */}
            <div className="mt-4 flex justify-between items-center px-2">
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-black text-slate-500 uppercase">Traffic: Light</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        <span className="text-[9px] font-black text-slate-500 uppercase">Signal: High-Def</span>
                    </div>
                </div>
                <p className="text-[9px] font-mono text-slate-300">REF_ID: 99-XQ-22</p>
            </div>
        </div>
    );
}