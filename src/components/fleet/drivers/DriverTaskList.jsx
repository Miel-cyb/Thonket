'use client';

import React from 'react';
import {
    MapPin,
    CheckCircle2,
    Package,
    ChevronRight,
    Navigation2,
    Clock,
    AlertCircle
} from 'lucide-react';

export default function DriverTaskList({ tasks = [], onCompleteTask }) {
    return (
        <div className="w-full">
            {tasks.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                        <Package className="text-slate-300" size={32} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Queue Empty // No Active Drops</p>
                </div>
            ) : (
                /* 🚀 FIXED: Added space-y-4 for clear vertical separation between cards */
                <div className="flex flex-col gap-5 p-2"> 
                    {tasks.map((task, index) => (
                        <div
                            key={task.id || index}
                            className={`group relative flex flex-col md:flex-row md:items-center justify-between p-6 transition-all duration-300 rounded-[2.5rem] border-2 
                                ${task.status === 'completed' 
                                    ? 'bg-slate-50/50 border-transparent opacity-60 grayscale' 
                                    : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/5'}`}
                        >
                            {/* LEFT: SEQUENCE & IDENTITY */}
                            <div className="flex items-center gap-6">
                                <div className="relative shrink-0">
                                    <div className={`h-16 w-16 rounded-[1.5rem] flex flex-col items-center justify-center shadow-lg transition-all duration-500
                                        ${task.status === 'completed' 
                                            ? 'bg-emerald-500 shadow-emerald-100' 
                                            : 'bg-slate-900 group-hover:bg-blue-600 shadow-slate-200'}`}>
                                        
                                        <span className={`text-[8px] font-black uppercase tracking-tighter ${task.status === 'completed' ? 'text-emerald-100' : 'text-white/40'}`}>
                                            Stop
                                        </span>
                                        <span className="text-2xl font-black text-white leading-none">
                                            {task.sequence || index + 1}
                                        </span>
                                    </div>
                                    
                                    {task.status === 'completed' && (
                                        <div className="absolute -top-2 -right-2 bg-white text-emerald-500 rounded-full p-1 shadow-sm border-2 border-emerald-50">
                                            <CheckCircle2 size={16} />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                            {task.customerName || "Retail Partner"}
                                        </h4>
                                        <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-md uppercase border border-slate-200">
                                            ID: {task.orderNumber || '0000'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <MapPin size={14} className="text-blue-500 shrink-0" />
                                        <p className="text-xs font-bold text-slate-500 leading-tight uppercase">
                                            {task.address || "Geo-Location Pending"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: ACTIONS & STATUS */}
                            <div className="flex items-center gap-6 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-slate-50 md:border-0">
                                {/* Distribution Metadata */}
                                <div className="hidden lg:flex flex-col items-end shrink-0">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Load Detail</span>
                                    <div className="flex items-center gap-1.5">
                                        <Package size={12} className="text-slate-400" />
                                        <span className="text-sm font-black text-slate-900">{task.itemsCount || 1} Units</span>
                                    </div>
                                </div>

                                {onCompleteTask && task.status !== 'completed' ? (
                                    <button
                                        onClick={() => onCompleteTask(task.id)}
                                        className="flex-1 md:flex-none h-14 px-8 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-blue-600 active:scale-95 group/btn shadow-xl shadow-slate-200"
                                    >
                                        <span className="text-[11px] font-black uppercase tracking-widest">Mark Arrived</span>
                                        <Navigation2 size={18} fill="currentColor" className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </button>
                                ) : (
                                    <div className="h-14 w-full md:w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100">
                                        <CheckCircle2 size={24} className={task.status === 'completed' ? 'text-emerald-500' : ''} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}