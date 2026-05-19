'use client';

import React from "react";
import { 
    AlertCircle, 
    ArrowUpRight, 
    MessageSquare, 
    Clock, 
    History 
} from "lucide-react";

export default function EscalationQueue({ orders = [], onSelect }) {
    const hasEscalations = orders.length > 0;

    return (
        <div className="space-y-4">
            {/* Header / Summary */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                        <History size={16} strokeWidth={3} />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                        Ops Management Queue
                    </h3>
                </div>
                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-200">
                    {orders.length} Priority Review{orders.length !== 1 && 's'}
                </span>
            </div>

            {/* List Container */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-3 shadow-sm space-y-2">
                {hasEscalations ? (
                    orders.map((o) => (
                        <div
                            key={o._id}
                            onClick={() => onSelect(o)}
                            className="group relative flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-amber-200 hover:bg-amber-50/30 transition-all cursor-pointer overflow-hidden"
                        >
                            {/* Priority Indicator Line */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex items-start gap-4">
                                <div className="mt-1 p-2 bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-amber-600 rounded-xl transition-colors">
                                    <AlertCircle size={20} />
                                </div>
                                
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-slate-900 leading-none tracking-tight">
                                            {o.customerName}
                                        </p>
                                        <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 rounded">
                                            {o._id}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-[11px] font-medium text-amber-700">
                                            <MessageSquare size={12} />
                                            <span>Reason: {o.escalationReason || "Manual Over-limit Review"}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] text-slate-400 italic">
                                            <Clock size={12} />
                                            <span>2h ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-900">₵{o.totalAmount?.toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Pending Approval</p>
                                </div>
                                <div className="p-2 rounded-full bg-slate-50 text-slate-300 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                                    <ArrowUpRight size={16} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    /* Clean Empty State */
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                            <History className="text-slate-300" size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-400">No Escalations Pending</p>
                        <p className="text-[11px] text-slate-300">All high-risk orders have been settled.</p>
                    </div>
                )}
            </div>
        </div>
    );
}