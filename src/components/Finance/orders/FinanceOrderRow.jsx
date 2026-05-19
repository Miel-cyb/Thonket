'use client';

import React from "react";
import { AlertTriangle, ChevronRight, CreditCard, Wallet } from "lucide-react";

export default function FinanceOrderRow({ order, onClick }) {
    if (!order) return null;

    // Map stages to specific styles for a visual "status" feel
    const stageStyles = {
        pending: "bg-amber-50 text-amber-700 border-amber-100",
        approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
        delivery: "bg-blue-50 text-blue-700 border-blue-100",
        completed: "bg-slate-100 text-slate-600 border-slate-200",
        pending_ops_review: "bg-purple-50 text-purple-700 border-purple-100",
    };

    const riskBadge = {
        high: "text-red-600 bg-red-50 border-red-100",
        medium: "text-amber-600 bg-amber-50 border-amber-100",
        low: "text-emerald-600 bg-emerald-50 border-emerald-100",
    };

    return (
        <div
            onClick={onClick}
            className="group grid grid-cols-12 gap-4 items-center p-4 px-6 transition-all hover:bg-slate-50 cursor-pointer border-b border-transparent hover:border-slate-100"
        >
            {/* COLUMN 1: CUSTOMER & ID */}
            <div className="col-span-4 lg:col-span-5 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${order.paymentType === 'CREDIT' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                    {order.paymentType === 'CREDIT' ? <CreditCard size={16} /> : <Wallet size={16} />}
                </div>
                <div className="overflow-hidden">
                    <p className="font-bold text-slate-900 truncate tracking-tight group-hover:text-indigo-600 transition-colors">
                        {order.customerName}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                        {order._id} <span className="opacity-50">•</span> {order.paymentType}
                    </p>
                </div>
            </div>

            {/* COLUMN 2: AMOUNT */}
            <div className="col-span-3 lg:col-span-2 text-right">
                <p className="text-sm font-black text-slate-900">
                    ₵{order.totalAmount?.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-400 font-medium italic">GHS Total</p>
            </div>

            {/* COLUMN 3: RISK PROFILE */}
            <div className="col-span-2 lg:col-span-2 flex justify-center">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-tighter ${riskBadge[order.risk] || 'bg-slate-50'}`}>
                    {order.risk === "high" && <AlertTriangle size={10} strokeWidth={3} />}
                    {order.risk}
                </div>
            </div>

            {/* COLUMN 4: STATUS & CTA */}
            <div className="col-span-3 lg:col-span-3 flex items-center justify-end gap-4">
                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border shadow-sm whitespace-nowrap ${stageStyles[order.stage] || 'bg-slate-50'}`}>
                    {order.stage?.replace(/_/g, ' ')}
                </span>
                <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all"
                />
            </div>
        </div>
    );
}