'use client';

import React from "react";
import { Inbox, Filter } from "lucide-react";
import FinanceOrderRow from "./FinanceOrderRow";

export default function FinanceOrderQueue({
    orders = [],
    onSelectOrder
}) {
    const hasOrders = orders.length > 0;

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* TABLE HEADER - Essential for scannability */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="col-span-4 lg:col-span-5 flex items-center gap-2">
                    <Filter size={12} />
                    Customer & Order ID
                </div>
                <div className="col-span-3 lg:col-span-2 text-right">Amount</div>
                <div className="col-span-2 lg:col-span-2 text-center">Risk Profile</div>
                <div className="col-span-3 lg:col-span-3 text-right">Actions</div>
            </div>

            {/* SCROLLABLE QUEUE BODY */}
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto custom-scrollbar">
                {hasOrders ? (
                    orders.map((order) => (
                        <div
                            key={order._id}
                            className="transition-colors hover:bg-slate-50/80 active:bg-slate-100 cursor-pointer"
                            onClick={() => onSelectOrder(order)}
                        >
                            <FinanceOrderRow
                                order={order}
                            // Internal onClick handled by parent div for better hit area
                            />
                        </div>
                    ))
                ) : (
                    /* EMPTY STATE - Prevents "dead" UI feel */
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Inbox className="text-slate-300" size={28} />
                        </div>
                        <h3 className="text-slate-900 font-bold text-lg">Queue Clear</h3>
                        <p className="text-slate-500 text-sm max-w-[280px] mx-auto">
                            No orders currently match this stage. New requests will appear here in real-time.
                        </p>
                    </div>
                )}
            </div>

            {/* QUEUE FOOTER / SUMMARY */}
            {hasOrders && (
                <div className="px-6 py-3 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[11px] font-medium text-slate-400">
                        Showing {orders.length} active {orders.length === 1 ? 'entry' : 'entries'}
                    </span>
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Live Connection</span>
                    </div>
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
}