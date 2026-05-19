'use client';

import React, { useState, useEffect } from "react";
import { LayoutDashboard, RefreshCw, ChevronRight, Clock } from "lucide-react";

export default function FinanceHeader({ view, onRefresh, loading }) {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    // Update the visual clock for the "as of" timestamp
    useEffect(() => {
        if (!loading) {
            setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
    }, [loading]);

    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-all duration-300">

            <div className="space-y-1">
                {/* Breadcrumbs / Sub-header */}
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    <div className="p-1 bg-blue-50 text-blue-600 rounded-md">
                        <LayoutDashboard size={12} strokeWidth={3} />
                    </div>
                    <span>Finance Hub</span>
                    <ChevronRight size={10} className="text-slate-300" />
                    <span className="text-blue-600">{view}</span>
                </div>

                {/* Main Title & Context */}
                <div className="flex items-baseline gap-3">
                    <h1 className="text-2xl font-extrabold text-slate-900 capitalize tracking-tight">
                        {view === 'orders' ? 'Order Pipeline' : view}
                    </h1>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <div className={`h-1.5 w-1.5 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                        <span>Live System</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
                {/* Status Indicator */}
                <div className="hidden xl:flex flex-col items-end mr-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Data as of</span>
                    <span className="text-xs font-mono font-semibold text-slate-600">{currentTime}</span>
                </div>

                {/* Refresh Action */}
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm transition-all active:scale-95
                        ${loading
                            ? "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-100"
                            : "bg-white text-slate-700 border-slate-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 shadow-sm"
                        }
                    `}
                >
                    <RefreshCw
                        size={16}
                        className={`${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
                    />
                    <span>{loading ? "Syncing..." : "Sync Data"}</span>
                </button>
            </div>
        </header>
    );
}