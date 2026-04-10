'use client';

import { Map as MapIcon, Navigation, Target, Flag, Compass, Maximize2 } from 'lucide-react';

export default function DriverMap({ tasks = [], vehicles = [] }) {
    // We assume the first task in the filtered list is the 'Active' destination
    const activeTask = tasks.find(t => t.status === 'in-progress') || tasks[0];

    return (
        <div className="bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-4 md:p-6 h-full min-h-[400px] md:h-[600px] flex flex-col overflow-hidden group">

            {/* DRIVER HUD HEADER */}
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 ring-2 md:ring-4 ring-white shrink-0">
                        <Navigation size={20} className="text-white fill-current md:w-[22px]" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1 truncate">
                            Active Navigation
                        </h2>
                        <h3 className="text-base md:text-xl font-black text-slate-900 tracking-tight uppercase truncate">
                            Route Guidance
                        </h3>
                    </div>
                </div>

                <button className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95 shrink-0">
                    <Maximize2 size={14} />
                    <span className="hidden sm:inline">Full Screen</span>
                </button>
            </div>

            {/* TACTICAL MAP TERMINAL */}
            <div className="relative flex-1 bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border-2 md:border-4 border-slate-100 shadow-inner">

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
                        <Compass size={48} className="text-slate-800 md:w-16 md:h-16 animate-[spin_10s_linear_infinite]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-2 w-2 bg-indigo-500 rounded-full animate-ping" />
                        </div>
                    </div>
                    <p className="mt-4 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
                        GPS Signal Locked
                    </p>
                </div>

                {/* FLOATING NAVIGATION HUD (Glassmorphism) */}
                <div className="absolute top-3 left-3 right-3 md:top-6 md:left-6 md:right-6 flex justify-between items-start pointer-events-none">
                    <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-2xl pointer-events-auto max-w-[180px] md:max-w-[240px]">
                        <p className="text-[8px] md:text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1 md:mb-2">Next Destination</p>
                        <h4 className="text-xs md:text-sm font-black text-white uppercase leading-tight mb-2 md:mb-3 truncate">
                            {activeTask?.customerName || "Scanning..."}
                        </h4>
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="flex flex-col">
                                <span className="text-[7px] md:text-[8px] font-bold text-slate-500 uppercase">Dist</span>
                                <span className="text-[10px] md:text-xs font-black text-white">4.2 KM</span>
                            </div>
                            <div className="h-4 md:h-6 w-px bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-[7px] md:text-[8px] font-bold text-slate-500 uppercase">ETA</span>
                                <span className="text-[10px] md:text-xs font-black text-white">12 MIN</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-1.5 md:p-2 rounded-xl pointer-events-auto">
                        <div className="flex flex-col gap-1 md:gap-2">
                            <button className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors active:bg-indigo-600">
                                <Target size={18} />
                            </button>
                            <div className="h-px bg-white/10 mx-1" />
                            <button className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors active:bg-indigo-600">
                                <Flag size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ACTIVE MARKERS */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                        <div className="h-10 w-10 md:h-12 md:w-12 bg-indigo-500/20 rounded-full animate-pulse flex items-center justify-center border border-indigo-500/30">
                            <div className="h-3 w-3 md:h-4 md:w-4 bg-indigo-500 rounded-full border-2 border-white shadow-xl" />
                        </div>
                        <div className="absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 px-2 md:px-3 py-1 bg-white rounded-lg shadow-xl border border-slate-200">
                            <span className="text-[8px] md:text-[9px] font-black text-slate-900 uppercase whitespace-nowrap">Current Pos</span>
                            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-slate-200 rotate-45" />
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER STATUS */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2 px-2">
                <div className="flex gap-4 md:gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase">Traffic: Light</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase">Signal: High-Def</span>
                    </div>
                </div>
                <p className="text-[8px] md:text-[9px] font-mono text-slate-300">REF_ID: 99-XQ-22</p>
            </div>
        </div>
    );
}