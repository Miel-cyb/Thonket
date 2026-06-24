import React from "react";
import {
    Package,
    Truck,
    ClipboardCheck,
    Clock,
    TrendingUp,
    TrendingDown,
    AlertCircle
} from "lucide-react";

export default function ProcurementStatsBar({ orders = [], loading = false }) {

    // --- LIVE METRICS CALCULATOR ENGINE ---
    const totalCount = orders.length;

    const metrics = {
        requests: orders.filter(o => o.cycleState === "requested").length,
        approved: orders.filter(o => o.cycleState === "approved").length,
        inTransit: orders.filter(o => o.cycleState === "in_transit").length,
        receivingQueue: orders.filter(o => o.receiving?.status === "pending" || o.cycleState === "under_review").length
    };

    // --- TRUE STATE TREND CALCULATIONS ---
    // 1. Requests trend: Percentage of active items marked as 'critical' priority
    const criticalRequests = orders.filter(o => o.cycleState === "requested" && o.intent?.priority === "critical").length;
    const requestsTrendString = totalCount > 0 ? `${Math.round((criticalRequests / totalCount) * 100)}% Crit` : "0% Crit";

    // 2. Approved trend: Proportion of current workspace volume that has cleared review
    const approvalRateString = totalCount > 0 ? `${Math.round((metrics.approved / totalCount) * 100)}% Rate` : "0% Rate";

    // 3. In Transit trend: Outlines physical allocations moving through third-party logistics
    const thirdPartyLogisticsCount = orders.filter(o => o.logistics?.deliveryType === "third_party").length;
    const transitTrendString = metrics.inTransit > 0 ? `${Math.round((thirdPartyLogisticsCount / metrics.inTransit) * 100)}% 3PL` : "0% 3PL";

    // 4. Receiving Date Subtext Engine: Scans for the closest timeline target date
    const ordersWithDeliveryDates = orders.filter(o => o.logistics?.expectedDeliveryDate !== null);

    let receivingQueueSubtitle = "Awaiting dispatch scheduling";
    if (ordersWithDeliveryDates.length > 0) {
        // Sort to extract the nearest incoming shipment milestone
        const sortedDates = ordersWithDeliveryDates.map(o => new Date(o.logistics.expectedDeliveryDate)).sort((a, b) => a - b);
        receivingQueueSubtitle = `Next ETA: ${sortedDates[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
    } else if (metrics.receivingQueue > 0) {
        // Fallback context from the record payload variables
        const pendingWithItems = orders.find(o => (o.receiving?.status === "pending" || o.cycleState === "under_review") && o.items?.length > 0);
        if (pendingWithItems) {
            receivingQueueSubtitle = `Pending: ${pendingWithItems.items[0].productName || "Stock items"}`;
        }
    }

    const stats = [
        {
            label: "Purchase Requests",
            value: metrics.requests,
            icon: ClipboardCheck,
            trend: requestsTrendString,
            isAlertTrend: criticalRequests > 0,
            desc: `${criticalRequests} urgent items active`,
            color: "slate",
        },
        {
            label: "Approved Orders",
            value: metrics.approved,
            icon: Package,
            trend: approvalRateString,
            isAlertTrend: false,
            desc: "Cleared matching limits",
            color: "emerald",
        },
        {
            label: "In Transit",
            value: metrics.inTransit,
            icon: Truck,
            trend: transitTrendString,
            isAlertTrend: false,
            desc: "En route to central hubs",
            color: "blue",
        },
        {
            label: "Receiving Queue",
            value: metrics.receivingQueue,
            icon: Clock,
            trend: "Live",
            isAlertTrend: false,
            desc: receivingQueueSubtitle, // Dynamic calculated date/fallback context string
            color: "amber",
        },
    ];

    const colorMap = {
        slate: "bg-slate-50/50 text-slate-700 border-slate-200/60",
        emerald: "bg-emerald-50/50 text-emerald-700 border-emerald-200/60",
        blue: "bg-blue-50/50 text-blue-700 border-blue-200/60",
        amber: "bg-amber-50/50 text-amber-700 border-amber-200/60",
    };

    const iconBgMap = {
        slate: "bg-slate-100 text-slate-600",
        emerald: "bg-emerald-100 text-emerald-600",
        blue: "bg-blue-100 text-blue-600",
        amber: "bg-amber-100 text-amber-600",
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {[1, 2, 3, 4].map((index) => (
                    <div
                        key={index}
                        className="bg-white border border-slate-200/50 p-5 rounded-2xl flex items-center justify-between animate-pulse"
                    >
                        <div className="space-y-2">
                            <div className="h-3 w-24 bg-slate-200 rounded" />
                            <div className="h-7 w-12 bg-slate-200 rounded mt-1" />
                        </div>
                        <div className="h-11 w-11 rounded-2xl bg-slate-200" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {stats.map((s, i) => {
                const IconComponent = s.icon;
                return (
                    <div
                        key={i}
                        className={`
                            group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-3xs
                            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                            ${colorMap[s.color]}
                        `}
                    >
                        <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-black/2 blur-2xl opacity-0 transition group-hover:opacity-100" />

                        <div className="flex items-start justify-between relative z-10 h-full">
                            <div className="min-w-0 flex flex-col justify-between h-full">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
                                        {s.label}
                                    </p>

                                    <div className="mt-2 flex items-end gap-2 flex-wrap">
                                        <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
                                            {s.value}
                                        </h3>

                                        <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md mb-0.5 ${s.isAlertTrend
                                                ? "bg-rose-100 text-rose-700 animate-pulse"
                                                : "bg-slate-100 text-slate-600"
                                            }`}>
                                            {s.isAlertTrend ? <AlertCircle size={10} /> : <TrendingUp size={10} />}
                                            <span>{s.trend}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[11px] font-medium text-slate-400 mt-2 truncate">
                                    {s.desc}
                                </p>
                            </div>

                            <div
                                className={`
                                    flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl
                                    transition duration-200 group-hover:scale-105
                                    ${iconBgMap[s.color]}
                                `}
                            >
                                <IconComponent size={18} strokeWidth={2.5} />
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-slate-200/30 to-transparent" />
                    </div>
                );
            })}
        </div>
    );
}