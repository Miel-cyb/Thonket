'use client';

import React, { useEffect } from "react";
import {
    X,
    ArrowLeftRight,
    AlertCircle,
    MessageSquare,
    CheckCircle2,
    UserCheck,
    Truck
} from "lucide-react";

export default function OpsHandoffDrawer({ order, onClose }) {
    // Prevent scrolling of the background when drawer is open
    useEffect(() => {
        if (order) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [order]);

    if (!order) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-in-out">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-200">
                            <ArrowLeftRight size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 leading-none">Ops Review</h2>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Resolution Desk
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Handoff Context Card */}
                    <section className="space-y-3">
                        <div className="flex items-center gap-2 text-amber-600">
                            <AlertCircle size={16} />
                            <h3 className="text-xs font-black uppercase tracking-wider">Escalation Audit</h3>
                        </div>
                        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 relative overflow-hidden">
                            <MessageSquare className="absolute -right-2 -bottom-2 text-amber-200/50" size={64} />
                            <p className="relative z-10 text-sm text-amber-900 font-medium leading-relaxed italic">
                                "{order.escalationReason || "Finance team flagged this for manual capacity verification."}"
                            </p>
                            <div className="mt-4 flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-amber-200 flex items-center justify-center text-[10px] font-bold text-amber-700">FC</div>
                                <span className="text-[10px] font-bold text-amber-700/60 uppercase">Finance Controller • 14:20 PM</span>
                            </div>
                        </div>
                    </section>

                    {/* Order Details High-Density View */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Order Specifications</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Customer</p>
                                <p className="text-sm font-bold text-slate-900 truncate">{order.customerName}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Exposure</p>
                                <p className="text-sm font-bold text-slate-900">₵{order.totalAmount?.toLocaleString()}</p>
                            </div>
                        </div>
                    </section>

                    {/* Ops Verification Checklist */}
                    <section className="space-y-3">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Ops Verification</h3>
                        <div className="space-y-2">
                            {[
                                { label: "Inventory Availability", status: "Verified", icon: <CheckCircle2 size={14} className="text-emerald-500" /> },
                                { label: "Logistics Routing", status: "Assigned", icon: <Truck size={14} className="text-blue-500" /> },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 border border-dashed border-slate-200 rounded-xl">
                                    <span className="text-xs font-medium text-slate-600">{item.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{item.status}</span>
                                        {item.icon}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sticky Actions */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md">
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onClose}
                            className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-slate-200"
                        >
                            <UserCheck size={18} />
                            <span>Resolve & Release to Logistics</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 py-3 rounded-2xl font-bold text-sm transition-all"
                        >
                            Return to Finance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}