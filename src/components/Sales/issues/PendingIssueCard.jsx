'use client';

import React from "react";
import {
    CheckCircle, Info, AlertTriangle, XCircle,
    Users, ShoppingCart, ArrowUpRight
} from "lucide-react";

const activityConfig = {
    orderPlaced: { icon: ShoppingCart, color: "text-blue-600", dot: "bg-blue-600", border: "border-blue-100", label: "Transaction" },
    orderApproved: { icon: CheckCircle, color: "text-emerald-600", dot: "bg-emerald-600", border: "border-emerald-100", label: "Verification" },
    orderIssue: { icon: AlertTriangle, color: "text-amber-600", dot: "bg-amber-600", border: "border-amber-100", label: "Attention" },
    customerAdded: { icon: Users, color: "text-indigo-600", dot: "bg-indigo-600", border: "border-indigo-100", label: "Accession" },
    info: { icon: Info, color: "text-slate-500", dot: "bg-slate-500", border: "border-slate-100", label: "General" },
    error: { icon: XCircle, color: "text-red-600", dot: "bg-red-600", border: "border-red-100", label: "Critical" },
};

export default function ActivityItem({ activity, isLast }) {
    const { type, message, timestamp } = activity;
    const config = activityConfig[type] || activityConfig.info;
    const Icon = config.icon;

    return (
        <li className="group relative flex gap-8 pb-10 last:pb-0">
            {/* Timeline Thread Line */}
            {!isLast && (
                <div className="absolute left-[11px] top-[24px] bottom-0 w-[2px] bg-slate-100 group-hover:bg-slate-200 transition-colors" />
            )}

            {/* Timeline Node */}
            <div className="relative z-10 flex flex-col items-center mt-1">
                <div className={`w-[24px] h-[24px] rounded-full bg-white border-2 flex items-center justify-center transition-all duration-500 group-hover:scale-125 group-hover:border-slate-300 ${config.border}`}>
                    <div className={`w-2 h-2 rounded-full ${config.dot} ${type === 'orderIssue' || type === 'error' ? 'animate-ping' : ''}`} />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 -mt-1">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg bg-white border shadow-sm ${config.color} ${config.border}`}>
                            {config.label}
                        </span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.1em]">
                            // {timestamp || "Live Now"}
                        </span>
                    </div>
                    <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                        <ArrowUpRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all group-hover:text-slate-900" />
                    </button>
                </div>

                {/* Activity Card */}
                <div className="bg-white group-hover:bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100 group-hover:border-slate-200 group-hover:shadow-xl group-hover:shadow-slate-200/50 transition-all duration-500">
                    <div className="flex items-center gap-5">
                        <div className={`flex-shrink-0 p-3 rounded-2xl bg-white shadow-sm border border-slate-50 ${config.color} group-hover:scale-110 transition-transform`}>
                            <Icon size={20} strokeWidth={2.5} />
                        </div>
                        <p className="text-lg font-bold text-slate-700 leading-tight tracking-tight">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
        </li>
    );
}