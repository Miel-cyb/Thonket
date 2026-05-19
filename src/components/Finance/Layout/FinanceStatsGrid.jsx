'use client';

import React, { useMemo } from "react";
import {
    Package,
    ShieldAlert,
    TrendingUp,
    Truck,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function FinanceStatsGrid({ orders }) {
    // Memoize calculations to prevent unnecessary re-runs on parent re-renders
    const stats = useMemo(() => {
        const pendingOrders = orders.filter(o => o.stage === "pending");
        const highRiskOrders = orders.filter(o => o.risk === "high");

        return {
            pending: pendingOrders.length,
            highRisk: highRiskOrders.length,
            delivery: orders.filter(o => o.stage === "delivery").length,
            completed: orders.filter(o => o.stage === "completed").length,
            // Added value-based metric for commercial context
            totalExposure: pendingOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)
        };
    }, [orders]);

    const Card = ({ label, value, subValue, icon: Icon, variant = "default" }) => {
        const variants = {
            default: "bg-white border-slate-200 text-slate-900 icon:text-slate-400",
            danger: "bg-white border-red-100 text-red-700 icon:text-red-500 shadow-sm shadow-red-50",
            success: "bg-white border-emerald-100 text-emerald-700 icon:text-emerald-500",
            warning: "bg-white border-amber-100 text-amber-700 icon:text-amber-500",
        };

        return (
            <div className={`p-5 rounded-3xl border transition-all duration-300 hover:shadow-md flex flex-col justify-between h-32 ${variants[variant]}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-wider opacity-60 mb-1">{label}</p>
                        <p className="text-3xl font-bold tracking-tight leading-none">{value}</p>
                    </div>
                    <div className={`p-2 rounded-xl ${variant !== 'default' ? 'bg-opacity-10 bg-current' : 'bg-slate-50'}`}>
                        <Icon size={20} strokeWidth={2.5} />
                    </div>
                </div>

                {subValue && (
                    <div className="flex items-center gap-1 mt-2">
                        <TrendingUp size={12} className="opacity-70" />
                        <span className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">
                            {subValue}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <Card
                label="Queue Backlog"
                value={stats.pending}
                subValue={`₵${stats.totalExposure.toLocaleString()} Volume`}
                icon={Package}
                variant={stats.pending > 10 ? "warning" : "default"}
            />

            <Card
                label="Critical Risk"
                value={stats.highRisk}
                subValue="Requires Manager Sign-off"
                icon={ShieldAlert}
                variant={stats.highRisk > 0 ? "danger" : "default"}
            />

            <Card
                label="In Transit"
                value={stats.delivery}
                subValue="Active Logistics"
                icon={Truck}
                variant="default"
            />

            <Card
                label="Settled"
                value={stats.completed}
                subValue="Closed This Session"
                icon={CheckCircle2}
                variant="success"
            />

            {/* Bonus Card: Exposure Context */}
            <div className="hidden xl:flex bg-slate-900 p-5 rounded-3xl border border-slate-800 flex-col justify-between h-32 text-white shadow-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Exposure</p>
                        <p className="text-xl font-bold tracking-tight">₵{stats.totalExposure.toLocaleString()}</p>
                    </div>
                    <AlertCircle size={20} className="text-indigo-400" />
                </div>
                <div className="bg-slate-800 h-1.5 w-full rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full w-[65%]" />
                </div>
                <p className="text-[9px] text-slate-400 font-medium">65% of monthly credit ceiling reached</p>
            </div>
        </div>
    );
}