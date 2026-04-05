'use client';

import React from "react";
import { ShieldAlert, Clock, MessageSquare, ArrowRight, AlertCircle, Filter } from "lucide-react";

export default function PendingIssuesView({ issues = [] }) {
    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* 1. Header Area - Compacted */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-xl border border-red-100">
                        <ShieldAlert className="text-red-600" size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.15em]">
                            Resolution Queue
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {issues.length} Interceptions Requires Action
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                        <Filter size={12} />
                        Filter
                    </button>
                </div>
            </div>

            {/* 2. Issue Cards Grid - Removed large gaps */}
            <div className="space-y-4">
                {issues.length > 0 ? (
                    issues.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} />
                    ))
                ) : (
                    <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">System Clear // No Pending Interceptions</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function IssueCard({ issue }) {
    const { orderId, customer, status, reason, timeStalled, notes, priority } = issue;

    const priorityStyles = {
        high: "border-red-200 bg-red-50 text-red-700",
        medium: "border-amber-200 bg-amber-50 text-amber-700",
        low: "border-slate-200 bg-slate-50 text-slate-600"
    };

    return (
        <div className="group relative bg-white border border-slate-200 rounded-2xl transition-all duration-300 hover:border-slate-300 hover:shadow-md overflow-hidden">
            <div className="p-5 md:p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6">

                    {/* Left: Info Section */}
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${priorityStyles[priority]}`}>
                                {status}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                REF: {orderId}
                            </span>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold text-slate-900 tracking-tight leading-none uppercase">
                                {customer}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-2 text-red-600 font-bold text-[10px] uppercase tracking-wide">
                                <AlertCircle size={12} />
                                {reason}
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions/Stats - Tightened padding and font */}
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 text-center min-w-[100px]">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                                <Clock size={10} /> Stall
                            </p>
                            <p className="text-sm font-black text-slate-900">{timeStalled}</p>
                        </div>

                        <button className="flex items-center gap-3 px-5 py-4 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all group/btn active:scale-95 shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest">Resolve</span>
                            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Technical Notes - Scaled down */}
                <div className="mt-5 pt-4 border-t border-slate-50 flex gap-3 items-start">
                    <div className="p-1.5 rounded-md bg-slate-100 text-slate-400 mt-0.5">
                        <MessageSquare size={12} />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Protocol Memo</p>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                            "{notes}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Edge Indicator - More subtle */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${priority === 'high' ? 'bg-red-500' : 'bg-slate-200'
                }`} />
        </div>
    );
}