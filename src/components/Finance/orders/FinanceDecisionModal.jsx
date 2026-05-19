'use client';

import React, { useState } from "react";
import { X, Check, XCircle, Send, AlertTriangle, ShieldCheck, Landmark } from "lucide-react";

export default function FinanceDecisionModal({
    order,
    onClose,
    onApprove,
    onReject,
    onForward
}) {
    const [isConfirming, setIsConfirming] = useState(false);

    if (!order) return null;

    const riskColors = {
        low: "bg-emerald-100 text-emerald-700 border-emerald-200",
        medium: "bg-amber-100 text-amber-700 border-amber-200",
        high: "bg-red-100 text-red-700 border-red-200",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with Blur */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-600 rounded-lg text-white">
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-900 leading-none">Finance Review</h2>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Vetting Stage: Credit Control</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Customer Summary Card */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Entity</p>
                            <p className="font-bold text-slate-900">{order.customerName}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-1">{order._id}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Order Value</p>
                            <p className="text-xl font-black text-slate-900">₵{order.totalAmount?.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Risk & Credit Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className={`border rounded-xl p-3 flex items-center gap-3 ${riskColors[order.risk] || riskColors.medium}`}>
                            <AlertTriangle size={20} />
                            <div>
                                <p className="text-[10px] font-bold uppercase opacity-70">Risk Level</p>
                                <p className="text-sm font-black capitalize">{order.risk}</p>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                            <Landmark size={20} className="text-indigo-500" />
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Credit Score</p>
                                <p className="text-sm font-black text-slate-900">{order.creditScore}/100</p>
                            </div>
                        </div>
                    </div>

                    {/* Guidelines Note */}
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                        <div className="text-amber-600 mt-0.5"><AlertTriangle size={16} /></div>
                        <p className="text-xs text-amber-800 leading-relaxed font-medium">
                            Reviewing this order will update the ledger and notify the logistics department. Ensure the <strong>Customer Credit Limit</strong> is not exceeded.
                        </p>
                    </div>

                    {/* Action Grid */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            onClick={() => onApprove(order)}
                            className="group flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-200"
                        >
                            <Check size={18} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                            <span>Approve</span>
                        </button>

                        <button
                            onClick={() => onForward(order)}
                            className="group flex-1 bg-white border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-slate-600 py-3.5 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                        >
                            <Send size={16} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                            <span>Escalate</span>
                        </button>

                        <button
                            onClick={() => onReject(order)}
                            className="group w-full sm:w-14 bg-red-50 hover:bg-red-100 text-red-600 py-3.5 rounded-2xl font-bold flex items-center justify-center transition-all border border-red-100"
                            title="Reject Order"
                        >
                            <XCircle size={20} />
                        </button>
                    </div>
                </div>

                {/* Footer Insight */}
                <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Standard Review Protocol v4.2
                    </p>
                </div>
            </div>
        </div>
    );
}