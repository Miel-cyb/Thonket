'use client';
import { Eye, MessageCircle, ArrowUpRight } from 'lucide-react';

export default function OrderCard({ order, onView, onFollowUp }) {
    return (
        <div className="group bg-white rounded-[1.5rem] border border-slate-200 p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.02)] hover:shadow-[0_20px_40px_-12px_rgba(15,23,42,0.08)] hover:border-indigo-100 transition-all duration-300">

            {/* 1. TOP ROW: Designation & Reference */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-600 font-black text-[10px] group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                        {order.customer.charAt(0)}
                    </div>
                    <div>
                        <p className="font-black text-[11px] text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                            {order.customer}
                        </p>
                        <p className="text-[8px] font-bold text-slate-400 font-mono tracking-tighter">
                            REF: {order.id}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[12px] font-black text-slate-900 tracking-tighter italic">
                        {order.amount}
                    </p>
                    <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest mt-0.5">
                        Net Value
                    </p>
                </div>
            </div>

            {/* 2. MIDDLE ROW: Priority & Meta (Space Utilization) */}
            <div className="flex items-center gap-2 mb-5">
                <div className="h-[1px] flex-1 bg-slate-50" />
                <span className="text-[7px] font-black text-slate-300 uppercase tracking-[0.2em] whitespace-nowrap">
                    Operational Status
                </span>
                <div className="h-[1px] flex-1 bg-slate-50" />
            </div>

            {/* 3. BOTTOM ROW: Status & Interactive Tools */}
            <div className="flex justify-between items-center">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest text-white shadow-sm transition-transform group-hover:scale-105 ${order.statusColor}`}>
                    <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                    {order.status}
                </div>

                <div className="flex gap-1">
                    <button
                        onClick={() => onView(order)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="View Protocol"
                    >
                        <Eye size={14} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={() => onFollowUp(order)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="Init Follow-up"
                    >
                        <MessageCircle size={14} strokeWidth={2.5} />
                    </button>
                    <button
                        className="p-2 text-slate-300 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ArrowUpRight size={14} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
}