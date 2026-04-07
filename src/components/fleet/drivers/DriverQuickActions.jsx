'use client';

import { Play, Pause, AlertOctagon, Navigation, CheckCircle } from 'lucide-react';

export default function DriverQuickActions({ onAction }) {
    return (
        <div className="bg-white border border-slate-200 p-3 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] flex flex-wrap md:flex-nowrap gap-3 w-full">

            {/* START / RESUME ACTION */}
            <button
                onClick={() => onAction?.('start')}
                className="flex-1 min-w-[140px] group relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-[2rem] transition-all active:scale-95 shadow-lg shadow-indigo-200"
            >
                <div className="relative z-10 flex flex-col items-center gap-1">
                    <Play size={20} fill="currentColor" className="mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Initiate</span>
                    <span className="text-sm font-black uppercase tracking-tight">Start Route</span>
                </div>
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
            </button>

            {/* PAUSE / STANDBY */}
            <button
                onClick={() => onAction?.('pause')}
                className="flex-1 min-w-[140px] group bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 p-5 rounded-[2rem] transition-all active:scale-95"
            >
                <div className="flex flex-col items-center gap-1">
                    <Pause size={20} className="text-slate-400 group-hover:text-amber-600 mb-1 transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-amber-500">Standby</span>
                    <span className="text-sm font-black uppercase tracking-tight text-slate-900">Pause Trip</span>
                </div>
            </button>

            {/* REPORT / EMERGENCY */}
            <button
                onClick={() => onAction?.('report')}
                className="flex-1 min-w-[140px] group bg-red-50 hover:bg-red-600 border border-red-100 hover:border-red-700 p-5 rounded-[2rem] transition-all active:scale-95"
            >
                <div className="flex flex-col items-center gap-1">
                    <AlertOctagon size={20} className="text-red-600 group-hover:text-white mb-1 transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 group-hover:text-red-200">Incident</span>
                    <span className="text-sm font-black uppercase tracking-tight text-red-900 group-hover:text-white">Report Issue</span>
                </div>
            </button>

            {/* QUICK STATUS INDICATOR (Visual Only) */}
            <div className="hidden lg:flex items-center px-6 border-l border-slate-100 ml-2">
                <div className="text-right mr-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Protocol</p>
                    <p className="text-[11px] font-black text-emerald-600 uppercase tracking-tight">Active_Duty.sys</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle size={24} />
                </div>
            </div>

        </div>
    );
}