'use client';

import { CheckCircle2, User, MapPin, Clock } from 'lucide-react';

export default function TaskHistoryItem({ task }) {
    return (
        <div className="group relative bg-white border border-slate-100 rounded-2xl p-4 transition-all duration-200 hover:border-emerald-200 hover:shadow-sm">

            {/* STATUS ICON & CUSTOMER */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-500">
                        <CheckCircle2 size={14} strokeWidth={3} />
                    </div>
                    <div>
                        <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
                            {task.customerName}
                        </h3>
                        <div className="flex items-center gap-1 text-slate-400">
                            <MapPin size={10} />
                            <p className="text-[10px] font-bold truncate max-w-[150px]">
                                {task.address}
                            </p>
                        </div>
                    </div>
                </div>

                {/* LOG ID / TIMESTAMP BUBBLE */}
                <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">
                        TXN_REF_{task.id?.toString().padStart(4, '0')}
                    </span>
                    <div className="flex items-center gap-1 text-emerald-600/60 bg-emerald-50/50 px-2 py-0.5 rounded-md border border-emerald-100/50">
                        <Clock size={10} />
                        <span className="text-[9px] font-bold uppercase">
                            {task.completedAt || 'Recent'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ASSIGNMENT FOOTER */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <User size={10} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {task.driverName || 'Auth_System'}
                    </span>
                </div>

                {/* VERIFIED TAG */}
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">
                    Log_Verified
                </span>
            </div>

            {/* SUBTLE HOVER DECORATION */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-emerald-500 transition-all duration-300 group-hover:w-full rounded-full" />
        </div>
    );
}