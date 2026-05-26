import React from "react";
import { ShoppingBag, CreditCard, Truck, AlertTriangle } from "lucide-react";

/**
 * Utility functions for clean data presentation
 */
const formatCurrency = (num) => {
    if (!num) return "₵0.00";
    if (num >= 1_000_000) return `₵${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `₵${(num / 1_000).toFixed(1)}K`;
    return `₵${num.toLocaleString()}`;
};

const formatNumber = (num) => {
    return num ? num.toLocaleString() : "0";
};

export default function SupplierKpiPanel({ supplier }) {
    // Extract properties using the exact keys defined in your root page component
    const stats = supplier?.stats || {};

    const totalOrders = stats.totalOrders || 0;
    const totalSpend = stats.totalSpend || 0;
    const deliveryRate = stats.deliveryRate || 0;
    const returnRate = stats.returnRate || 0;

    return (
        <section
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            aria-label="Supplier Performance Metrics"
        >
            <KpiCard
                label="Total Orders"
                value={formatNumber(totalOrders)}
                icon={<ShoppingBag className="text-blue-600" size={18} />}
                iconBg="bg-blue-50 border-blue-100"
                subtext={`Active: ${stats.activeOrders || 0} processing`}
            />

            <KpiCard
                label="Total Spend"
                value={formatCurrency(totalSpend)}
                icon={<CreditCard className="text-indigo-600" size={18} />}
                iconBg="bg-indigo-50 border-indigo-100"
                subtext={`Avg. Value: ₵${stats.avgOrderValue || 0}`}
            />

            <KpiCard
                label="Delivery Rate"
                value={`${deliveryRate}%`}
                icon={<Truck className="text-emerald-600" size={18} />}
                iconBg="bg-emerald-50 border-emerald-100"
                subtext="Target: >95%"
                statusVariant={deliveryRate >= 95 ? "success" : "warning"}
            />

            <KpiCard
                label="Return Rate"
                value={`${returnRate}%`}
                icon={<AlertTriangle className="text-amber-600" size={18} />}
                iconBg="bg-amber-50 border-amber-100"
                subtext="Keep below 3%"
                statusVariant={returnRate <= 3 ? "success" : "danger"}
            />
        </section>
    );
}

function KpiCard({ label, value, icon, iconBg, subtext, statusVariant }) {
    // Determine title typography coloring based on operational thresholds
    let valueColor = "text-slate-900";
    if (statusVariant === "success") valueColor = "text-emerald-700 lg:text-slate-900";
    if (statusVariant === "danger") valueColor = "text-rose-600";

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {label}
                    </p>
                    <h3 className={`text-2xl font-bold tracking-tight ${valueColor}`}>
                        {value}
                    </h3>
                </div>
                <div className={`p-2.5 rounded-xl border ${iconBg} shrink-0`} aria-hidden="true">
                    {icon}
                </div>
            </div>

            {subtext && (
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                        {subtext}
                    </span>
                </div>
            )}
        </div>
    );
}