'use client';

import { LayoutDashboard, RefreshCw } from "lucide-react";

export default function FinanceHeader({ view, onRefresh, loading }) {
    return (
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200">

            <div>
                <div className="text-[11px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                    <LayoutDashboard size={14} />
                    Finance Control Center / {view}
                </div>
                <h1 className="text-2xl font-bold text-slate-900 capitalize">
                    {view}
                </h1>
            </div>

            <button
                onClick={onRefresh}
                className="p-3 rounded-xl border bg-white hover:bg-blue-50"
            >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
    );
}