import React from 'react';
import {
    PackageCheck,
    AlertTriangle,
    CheckCircle2,
    DollarSign,
    TrendingDown,
    TrendingUp,
    ArrowRight,
    ShieldCheck
} from 'lucide-react';

/**
 * MetricsSummary Component - Unified Ribbon Architecture
 * 
 * Replaced fragmented cards with a clean, unified enterprise data bar.
 * Uses micro-dividers, inline structural progress visualization, and 
 * consolidated telemetry to maximize data density and visual calm.
 */
export default function MetricsSummary({ metrics = {} }) {
    const totalOrdered = metrics.totalOrdered || 0;
    const totalReceived = metrics.totalReceived || 0;
    const totalDamaged = metrics.totalDamaged || 0;
    const totalAccepted = metrics.totalAccepted || 0;
    const variance = metrics.variance || (totalReceived - totalOrdered);
    const valueEnteringInventory = metrics.valueEnteringInventory || 0;

    const fulfillmentPercent = totalOrdered > 0
        ? Math.min(100, Math.round((totalReceived / totalOrdered) * 100))
        : 0;

    return (
        <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">

            {/* --- SECTION HEADER / CONTEXT --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-900 text-white">
                        <PackageCheck className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight">Inbound Receiving Telemetry</h2>
                        <p className="text-xs text-slate-500">Real-time reconciliation & inventory intake status</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-lg font-medium text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Session Active
                    </div>
                </div>
            </div>

            {/* --- UNIFIED METRICS DATA RIBBON --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">

                {/* 1. FULFILLMENT RATE */}
                <div className="py-3 md:py-0 md:px-4 first:pl-0 last:pr-0 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
                            <span>Fulfillment Rate</span>
                            <span className="font-mono font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                {fulfillmentPercent}%
                            </span>
                        </div>
                        <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
                            {totalReceived.toLocaleString()} <span className="text-xs font-normal text-slate-400 font-sans">/ {totalOrdered.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${fulfillmentPercent}%` }}
                            />
                        </div>
                        <div className="mt-2 text-xs">
                            {variance === 0 ? (
                                <span className="text-emerald-600 font-medium flex items-center gap-1">Fully Accounted</span>
                            ) : variance < 0 ? (
                                <span className="text-rose-600 font-medium flex items-center gap-1">
                                    <TrendingDown className="w-3 h-3" /> Shortage: {Math.abs(variance).toLocaleString()}
                                </span>
                            ) : (
                                <span className="text-amber-600 font-medium flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> Overage: +{variance.toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. DAMAGED / QUARANTINED */}
                <div className="py-3 md:py-0 md:px-4 first:pl-0 last:pr-0 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
                            <span>Damaged / Quarantined</span>
                            <AlertTriangle className={`w-3.5 h-3.5 ${totalDamaged > 0 ? 'text-rose-500' : 'text-slate-300'}`} />
                        </div>
                        <div className={`text-2xl font-bold font-mono tracking-tight ${totalDamaged > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                            {totalDamaged.toLocaleString()} <span className="text-xs font-normal text-slate-400 font-sans">units</span>
                        </div>
                    </div>

                    <div className="mt-3 pt-2 text-xs">
                        {totalDamaged > 0 ? (
                            <span className="text-rose-600 font-medium flex items-center gap-1">
                                Pending Vendor RMA Claim
                            </span>
                        ) : (
                            <span className="text-slate-400 font-medium">Zero defects flagged</span>
                        )}
                    </div>
                </div>

                {/* 3. ACCEPTED STOCK */}
                <div className="py-3 md:py-0 md:px-4 first:pl-0 last:pr-0 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
                            <span>Accepted QC Stock</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <div className="text-2xl font-bold font-mono text-emerald-700 tracking-tight">
                            {totalAccepted.toLocaleString()} <span className="text-xs font-normal text-slate-400 font-sans">units</span>
                        </div>
                    </div>

                    <div className="mt-3 pt-2 text-xs">
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Passed Inspection
                        </span>
                    </div>
                </div>

                {/* 4. RECONCILED VALUE */}
                <div className="py-3 md:py-0 md:px-4 first:pl-0 last:pr-0 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
                            <span>Inventory Valuation</span>
                            <DollarSign className="w-3.5 h-3.5 text-indigo-500" />
                        </div>
                        <div className="text-2xl font-bold font-mono text-indigo-950 tracking-tight">
                            ${valueEnteringInventory.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>

                    <div className="mt-3 pt-2 text-xs">
                        <span className="text-indigo-600 font-medium">
                            Ready for bin assignment
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}