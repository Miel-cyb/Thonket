import React from "react";
import {
    Package,
    Truck,
    ClipboardCheck,
    Clock,
    TrendingUp,
} from "lucide-react";

// PROCUREMENT STATS BAR - PREMIUM KPI DASHBOARD STRIP
export default function ProcurementStatsBar() {
    const stats = [
        {
            label: "Purchase Requests",
            value: 24,
            icon: ClipboardCheck,
            trend: "+12%",
            color: "slate",
        },
        {
            label: "Approved Orders",
            value: 18,
            icon: Package,
            trend: "+8%",
            color: "emerald",
        },
        {
            label: "In Transit",
            value: 9,
            icon: Truck,
            trend: "+3%",
            color: "blue",
        },
        {
            label: "Receiving Queue",
            value: 5,
            icon: Clock,
            trend: "-2%",
            color: "amber",
        },
    ];

    const colorMap = {
        slate: "bg-slate-50 text-slate-700 border-slate-200",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
        blue: "bg-blue-50 text-blue-700 border-blue-200",
        amber: "bg-amber-50 text-amber-700 border-amber-200",
    };

    const iconBgMap = {
        slate: "bg-slate-100 text-slate-600",
        emerald: "bg-emerald-100 text-emerald-600",
        blue: "bg-blue-100 text-blue-600",
        amber: "bg-amber-100 text-amber-600",
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {stats.map((s, i) => (
                <div
                    key={i}
                    className={`
                        group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm
                        transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg
                        ${colorMap[s.color]}
                    `}
                >

                    {/* subtle background glow */}
                    <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-black/5 blur-2xl opacity-0 transition group-hover:opacity-100" />

                    <div className="flex items-start justify-between">

                        {/* LEFT CONTENT */}
                        <div>

                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                {s.label}
                            </p>

                            <div className="mt-2 flex items-end gap-2">

                                <p className="text-2xl font-bold text-slate-900">
                                    {s.value}
                                </p>

                                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                                    <TrendingUp size={12} />
                                    {s.trend}
                                </div>
                            </div>
                        </div>

                        {/* ICON */}
                        <div
                            className={`
                                flex h-11 w-11 items-center justify-center rounded-2xl
                                transition group-hover:scale-105
                                ${iconBgMap[s.color]}
                            `}
                        >
                            <s.icon size={18} />
                        </div>
                    </div>

                    {/* bottom accent line */}
                    <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-slate-200/40 to-transparent opacity-60" />
                </div>
            ))}
        </div>
    );
}