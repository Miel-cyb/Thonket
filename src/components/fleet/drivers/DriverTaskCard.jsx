'use client';

import React from 'react';
import {
    MapPin,
    CheckCircle2,
    Package,
    Clock,
    Navigation,
    ShieldAlert,
    Layers,
    ArrowUpRight
} from 'lucide-react';

export default function DriverTaskCard({ task, onComplete, onReportIssue }) {
    // Safety check: Convert ID to string before slicing
    const displayId = task.id ? String(task.id).slice(-6).toUpperCase() : 'TX-000';
    
    // Priority and Status Colors
    const isHighPriority = task.priority === 'high';
    const isCompleted = task.status === 'completed';

    return (
        <div className={`group relative bg-white border-2 rounded-[2.5rem] p-7 transition-all duration-500 overflow-hidden
            ${isCompleted ? 'opacity-60 grayscale-[0.5]' : 'hover:shadow-2xl hover:shadow-slate-200'}
            ${isHighPriority ? 'border-red-100' : 'border-slate-100'}
        `}>

            {/* Trip & Sequence Badge: Essential for Multi-Trip Logistics */}
            <div className="absolute top-0 right-12 flex">
                <div className="bg-slate-900 text-white px-4 py-2 rounded-b-2xl flex items-center gap-2 shadow-lg">
                    <Layers size={10} className="text-indigo-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                        Trip {task.tripNumber || '1'} // Stop {task.sequence || '0'}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-6">

                {/* HEADER: CLIENT INTEL */}
                <div className="flex justify-between items-start pt-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                INV-{displayId}
                            </span>
                            {isHighPriority && (
                                <span className="animate-pulse text-[9px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded">
                                    Priority Load
                                </span>
                            )}
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
                            {task.customerName || 'Retail Partner'}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-400">
                            <Package size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                {task.itemsCount || 0} Units in Manifest
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl border border-slate-200">
                            <Clock size={12} className="text-slate-400" />
                            <span className="text-[10px] font-black tracking-tighter uppercase">Win: 08:00 - 12:00</span>
                        </div>
                    </div>
                </div>

                {/* BODY: LOGISTICS DATA */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                    {/* Address Block */}
                    <div className="md:col-span-5 flex items-start gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-all duration-500">
                        <div className="h-10 w-10 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0 border border-slate-100">
                            <MapPin size={20} className="text-indigo-600" />
                        </div>
                        <div className="space-y-1 overflow-hidden">
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] leading-none">Drop-off Point</p>
                            <p className="text-[13px] font-bold text-slate-700 leading-relaxed uppercase truncate">
                                {task.address || 'Geo-Location Required'}
                            </p>
                        </div>
                    </div>

                    {/* Quick Nav Action */}
                    <button 
                        className="flex flex-col items-center justify-center bg-indigo-50 text-indigo-600 rounded-3xl border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all group/nav"
                        onClick={() => window.open(`https://maps.google.com/?q=${task.address}`, '_blank')}
                    >
                        <Navigation size={18} className="group-hover/nav:scale-110 transition-transform" />
                        <span className="text-[8px] font-black uppercase mt-1">Guide</span>
                    </button>
                </div>

                {/* FOOTER: TERMINAL ACTIONS */}
                {!isCompleted ? (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onComplete?.(task.id)}
                            className="flex-1 group/btn relative overflow-hidden flex items-center justify-center gap-3 bg-slate-900 hover:bg-emerald-600 text-white py-5 rounded-2xl transition-all duration-300 active:scale-[0.98] shadow-xl shadow-slate-200"
                        >
                            <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            <CheckCircle2 size={18} />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Confirm Unload</span>
                        </button>

                        <button
                            onClick={() => onReportIssue?.(task.id)}
                            className="h-16 px-6 flex items-center justify-center bg-white border-2 border-slate-100 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-2xl transition-all active:scale-95"
                        >
                            <ShieldAlert size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-4 bg-emerald-50 rounded-2xl border-2 border-emerald-100">
                        <span className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.3em] flex items-center gap-2">
                            <CheckCircle2 size={14} /> Sequence Completed
                        </span>
                    </div>
                )}
            </div>

            {/* Micro-Typography Background Decor */}
            <div className="absolute -bottom-2 -left-2 select-none pointer-events-none opacity-[0.03] rotate-12">
                <span className="text-6xl font-black italic text-slate-900">
                    {task.tripNumber ? `TRIP-${task.tripNumber}` : 'LOGISTICS'}
                </span>
            </div>
        </div>
    );
}