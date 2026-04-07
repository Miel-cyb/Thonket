'use client';

import { MapPin, CheckCircle2, AlertTriangle, ChevronRight, Package, Clock } from 'lucide-react';

export default function DriverTaskCard({ task, onComplete, onReportIssue }) {

    // Safety check: Convert ID to string before slicing
    const displayId = task.id ? String(task.id).slice(0, 5) : 'TX-88';

    return (
        <div className="group bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 relative overflow-hidden">

            {/* Status Accent Stripe */}
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 group-hover:w-3 transition-all" />

            <div className="flex flex-col gap-5">

                {/* Header: Customer & Priority */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-slate-900 rounded-lg">
                                <Package size={14} className="text-white" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                Delivery Unit: {displayId}
                            </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                            {task.customerName || 'Unknown Customer'}
                        </h3>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="px-3 py-1 bg-amber-50 border border-amber-100 rounded-full">
                            <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Priority</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                            <Clock size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">ETA: 14:30</span>
                        </div>
                    </div>
                </div>

                {/* Body: Location */}
                <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="mt-1">
                        <MapPin size={18} className="text-indigo-600" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">Drop-off Point</p>
                        <p className="text-sm font-bold text-slate-700 leading-snug">
                            {task.address || 'Location Data Not Synced'}
                        </p>
                    </div>
                </div>

                {/* Footer: Tactical Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={() => onComplete?.(task.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.15em] transition-all active:scale-95 shadow-lg shadow-emerald-100"
                    >
                        <CheckCircle2 size={16} />
                        Confirm Drop
                    </button>

                    <button
                        onClick={() => onReportIssue?.(task.id, 'Issue reported')}
                        className="px-6 flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-600 py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.15em] transition-all active:scale-95"
                    >
                        <AlertTriangle size={16} />
                        Report
                    </button>
                </div>

            </div>

            {/* Subtle Hover Decoration */}
            <div className="absolute -bottom-4 -right-4 opacity-0 group-hover:opacity-5 transition-opacity">
                <ChevronRight size={100} strokeWidth={4} />
            </div>
        </div>
    );
}