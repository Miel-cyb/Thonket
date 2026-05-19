'use client';

import React from "react";
import {
    ShieldCheck,
    ShieldAlert,
    TrendingDown,
    CreditCard,
    Wallet,
    MoreHorizontal
} from "lucide-react";

export default function CustomerCreditProfile({ customer }) {
    if (!customer) return null;

    // Calculate utilization percentage
    const utilization = Math.round((customer.usedCredit / customer.creditLimit) * 100);

    // Determine status colors based on risk score (0-100)
    const isHighRisk = customer.riskScore < 40;
    const isMidRisk = customer.riskScore >= 40 && customer.riskScore < 70;

    const getScoreColor = () => {
        if (isHighRisk) return "text-red-600 bg-red-50 border-red-100";
        if (isMidRisk) return "text-amber-600 bg-amber-50 border-amber-100";
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
    };

    const getProgressBarColor = () => {
        if (utilization > 90) return "bg-red-500";
        if (utilization > 70) return "bg-amber-500";
        return "bg-indigo-600";
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group">
            {/* Header: Name and Quick Actions */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${getScoreColor()}`}>
                        {isHighRisk ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 leading-none tracking-tight">
                            {customer.name}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">
                            Account ID: {(customer.name?.substring(0, 3) + "-0042").toUpperCase()}
                        </p>
                    </div>
                </div>
                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Credit Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Wallet size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Total Limit</span>
                    </div>
                    <p className="text-lg font-black text-slate-900">
                        ₵{customer.creditLimit?.toLocaleString()}
                    </p>
                </div>
                <div className="space-y-1 text-right">
                    <div className="flex items-center gap-1.5 text-slate-400 justify-end">
                        <TrendingDown size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Utilized</span>
                    </div>
                    <p className="text-lg font-black text-slate-900">
                        ₵{customer.usedCredit?.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Utilization Visualizer */}
            <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Utilization</span>
                    <span className={`text-xs font-black ${utilization > 90 ? 'text-red-600' : 'text-slate-900'}`}>
                        {utilization}%
                    </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-700 ease-out rounded-full ${getProgressBarColor()}`}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                </div>
            </div>

            {/* Risk Score Footer */}
            <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${isHighRisk ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Reliability Score</span>
                </div>
                <div className={`px-3 py-1 rounded-lg border text-sm font-black ${getScoreColor()}`}>
                    {customer.riskScore}
                </div>
            </div>
        </div>
    );
}