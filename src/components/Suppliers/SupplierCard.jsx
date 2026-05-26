import React from "react";
import {
    Building2,
    MapPin,
    Phone,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Truck,
    Package,
    ShieldAlert,
    TrendingUp
} from "lucide-react";

/**
 * SupplierCard Component - Optimally packaged dashboard item summary
 * @param {Object} supplier - Structured data tracking vendor identity and performance metrics.
 */
export default function SupplierCard({ supplier }) {
    if (!supplier) return null;

    // Cross-mapping schema validations
    const name = supplier.businessName || supplier.name || "Unnamed Supplier";
    const type = supplier.businessType || supplier.type || "General Category";
    const status = supplier.status || "pending_review";

    // Standardized Risk styling rules engine
    const riskLevel = (supplier.risk || "medium").toLowerCase();
    const getRiskStyles = (level) => {
        switch (level) {
            case "low":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "high":
            case "critical":
                return "bg-rose-50 text-rose-700 border-rose-200 animate-pulse";
            default:
                return "bg-amber-50 text-amber-700 border-amber-200";
        }
    };

    // Standardized Status styling rules engine
    const getStatusStyles = (currStatus) => {
        if (currStatus === "verified") {
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        }
        if (currStatus === "pending_review") {
            return "bg-slate-50 text-slate-600 border-slate-200";
        }
        return "bg-amber-50 text-amber-700 border-amber-200";
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group h-full">

            {/* CORE BODY INFO BLOCK */}
            <div className="space-y-4">

                {/* IDENTITY HEADER WRAPPER */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest text-indigo-600 uppercase">
                            <Building2 size={12} className="text-indigo-500 shrink-0" />
                            {type}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors duration-150 truncate">
                            {name}
                        </h4>
                    </div>

                    {/* CONTEXT-DRIVEN STATUS BADGE */}
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg border shrink-0 ${getStatusStyles(status)}`}>
                        {status === "verified" ? (
                            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        ) : status === "pending_review" ? (
                            <Clock size={13} className="text-slate-500 shrink-0" />
                        ) : (
                            <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                        )}
                        <span className="capitalize">{status.replace("_", " ")}</span>
                    </span>
                </div>

                {/* LOGISTICS & FIRMOGRAPHIC ATTRIBUTE DATA FIELDS */}
                <div className="space-y-2.5 border-y border-slate-100 py-4 text-sm text-slate-600 font-medium">

                    <div className="flex items-center gap-2.5 min-w-0">
                        <MapPin size={14} className="text-slate-400 shrink-0" />
                        <span className="text-slate-600 truncate">{supplier.location || "No location set"}</span>
                    </div>

                    <div className="flex items-center gap-2.5 min-w-0">
                        <Phone size={14} className="text-slate-400 shrink-0" />
                        <span className="font-mono text-xs text-slate-700 tracking-tight">
                            {supplier.phone || "No primary phone linked"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5 min-w-0">
                        <Package size={14} className="text-slate-400 shrink-0" />
                        <span className="text-slate-600 truncate">
                            {supplier.categories && supplier.categories.length > 0
                                ? supplier.categories.join(", ")
                                : "General Inventory Assets"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5 min-w-0">
                        <Truck size={14} className="text-slate-400 shrink-0" />
                        <span className="text-slate-500 truncate">
                            Logistics: <span className="text-slate-800 font-semibold">{supplier.deliveryType || "Standard Freight"}</span>
                        </span>
                    </div>

                </div>
            </div>

            {/* PERFORMANCE & RISK MATRIX FOOTER */}
            <div className="mt-5 pt-3 flex items-center justify-between border-t border-slate-50">
                <div className="space-y-0.5">
                    <span className="text-slate-400 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                        <TrendingUp size={11} className="text-slate-400" />
                        Reliability Score
                    </span>
                    <span className="text-sm font-bold text-slate-900 font-mono block">
                        {supplier.reliabilityScore || "—"}
                    </span>
                </div>

                <div className="text-right space-y-0.5">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Risk Profile</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize font-mono ${getRiskStyles(riskLevel)}`}>
                        {riskLevel === "high" || riskLevel === "critical" ? (
                            <ShieldAlert size={11} className="shrink-0 stroke-[2.5]" />
                        ) : null}
                        {riskLevel}
                    </span>
                </div>
            </div>

        </div>
    );
}