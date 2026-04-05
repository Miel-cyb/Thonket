'use client';

import React from "react";
import {
    CheckCircle, Info, AlertTriangle, XCircle,
    Users, ShoppingCart, ArrowUpRight
} from "lucide-react";

const activityConfig = {
    orderPlaced: { icon: ShoppingCart, color: "text-blue-600", dot: "bg-blue-600", border: "border-blue-200", label: "Transaction" },
    orderApproved: { icon: CheckCircle, color: "text-emerald-600", dot: "bg-emerald-600", border: "border-emerald-200", label: "Verification" },
    orderIssue: { icon: AlertTriangle, color: "text-amber-600", dot: "bg-amber-600", border: "border-amber-200", label: "Attention" },
    customerAdded: { icon: Users, color: "text-indigo-600", dot: "bg-indigo-600", border: "border-indigo-200", label: "Accession" },
    info: { icon: Info, color: "text-slate-500", dot: "bg-slate-500", border: "border-slate-200", label: "General" },
    error: { icon: XCircle, color: "text-red-600", dot: "bg-red-600", border: "border-red-200", label: "Critical" },
};

export default function ActivityItem({ activity }) {
    const { type, message, timestamp } = activity;
    const config = activityConfig[type] || activityConfig.info;
    const Icon = config.icon;

    return (
        <li className="group relative flex gap-10 pb-12 last:pb-0">
            {/* Timeline Node - Larger Target */}
            <div className="relative z-10 flex flex-col items-center">
                <div className={`w-[24px] h-[24px] rounded-full bg-white border-2 flex items-center justify-center transition-all duration-500 group-hover:scale-125 group-hover:shadow-lg ${config.border}`}>
                    <div className={`w-2 h-2 rounded-full ${config.dot} ${type === 'orderIssue' || type === 'error' ? 'animate-ping' : 'animate-pulse'}`} />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 -mt-1.5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-white border shadow-sm ${config.color} ${config.border}`}>
                            {config.label}
                        </span>
                        <span className="text-xs font-bold text-slate-400 tracking-wide">
                            — {timestamp || "Live Now"}
                        </span>
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                        <ArrowUpRight size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="bg-white group-hover:bg-slate-50 p-6 rounded-[2rem] border border-slate-100 group-hover:border-slate-200 transition-all shadow-sm group-hover:shadow-md">
                    <div className="flex items-start gap-5">
                        <div className={`p-3 rounded-2xl bg-white shadow-inner border border-slate-50 ${config.color}`}>
                            <Icon size={22} strokeWidth={2} />
                        </div>
                        <p className="text-base md:text-lg font-medium text-slate-700 leading-snug pt-1">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
        </li>
    );
}