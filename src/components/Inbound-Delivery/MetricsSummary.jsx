import React from 'react';
import {
    PackageCheck,
    AlertTriangle,
    CheckCircle2,
    DollarSign,
    TrendingDown,
    TrendingUp,
    ShieldCheck,
    Layers,
    Truck,
    AlertOctagon,
    RefreshCw
} from 'lucide-react';

/**
 * MetricsSummary Component - Balanced Medium Architecture
 * * Perfectly sized layout combining optimal readability with a compact 
 * 4x2 grid format. Removes excessive padding and bulky subtext while 
 * preserving clear, prominent figures and distinct color cues.
 */
export default function MetricsSummary({ metrics = {} }) {
    // --- Operational Counts ---
    const totalShipments = metrics.totalShipments || 0;
    const activeCount = metrics.activeCount || 0;
    const issueCount = metrics.issueCount || 0;
    const pendingSyncCount = metrics.pendingSyncCount || 0;

    // --- Physical & Financial Telemetry ---
    const totalOrdered = metrics.totalOrdered || 0;
    const totalReceived = metrics.totalReceived || 0;
    const totalDamaged = metrics.totalDamaged || 0;
    const totalAccepted = metrics.totalAccepted || 0;
    const variance = metrics.variance || (totalReceived - totalOrdered);
    const valueEnteringInventory = metrics.valueEnteringInventory || 0;

    const fulfillmentPercent = totalOrdered > 0
        ? Math.min(100, Math.round((totalReceived / totalOrdered) * 100))
        : totalAccepted > 0 ? 100 : 0;

    return (
        <div className="w-full bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4 flex flex-col gap-3.5">

            {/* --- HEADER --- */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-900 text-white shadow-2xs">
                        <PackageCheck className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Inbound Telemetry & Operations</h2>
                        <p className="text-[11px] text-slate-500">Live dock reconciliation and inventory status</p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs bg-emerald-50/80 border border-emerald-200/60 px-2.5 py-1 rounded-md font-medium text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Sync
                </div>
            </div>

            {/* --- BALANCED 4x2 GRID LAYOUT --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                {/* 1. Total Shipments */}
                <div className="bg-slate-50/80 border border-slate-200/70 rounded-lg p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
                        <span>Shipments</span>
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="text-base font-bold font-mono text-slate-900">
                        {totalShipments.toLocaleString()}
                    </div>
                </div>

                {/* 2. Active Receiving */}
                <div className="bg-indigo-50/40 border border-indigo-100 rounded-lg p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-medium text-indigo-700 mb-1">
                        <span>Active</span>
                        <Truck className="w-3.5 h-3.5 text-indigo-500" />
                    </div>
                    <div className="text-base font-bold font-mono text-indigo-950">
                        {activeCount.toLocaleString()}
                    </div>
                </div>

                {/* 3. Reconciliation Issues */}
                <div className="bg-rose-50/40 border border-rose-100 rounded-lg p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-medium text-rose-700 mb-1">
                        <span>Issues</span>
                        <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
                    </div>
                    <div className="text-base font-bold font-mono text-rose-950">
                        {issueCount.toLocaleString()}
                    </div>
                </div>

                {/* 4. Pending Sync */}
                <div className="bg-amber-50/40 border border-amber-100 rounded-lg p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-medium text-amber-700 mb-1">
                        <span>Sync</span>
                        <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div className="text-base font-bold font-mono text-amber-950">
                        {pendingSyncCount.toLocaleString()}
                    </div>
                </div>

                {/* 5. Fulfillment Rate */}
                <div className="bg-blue-50/40 border border-blue-100 rounded-lg p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-medium text-blue-700 mb-1">
                        <span>Fulfillment</span>
                        <span className="font-mono text-[10px] bg-blue-100 px-1.5 py-0.5 rounded text-blue-800 font-semibold">{fulfillmentPercent}%</span>
                    </div>
                    <div className="text-base font-bold font-mono text-blue-950">
                        {totalReceived.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ {totalOrdered.toLocaleString()}</span>
                    </div>
                </div>

                {/* 6. Damaged Units */}
                <div className="bg-rose-50/40 border border-rose-100 rounded-lg p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-medium text-rose-700 mb-1">
                        <span>Damaged</span>
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    </div>
                    <div className="text-base font-bold font-mono text-rose-950">
                        {totalDamaged.toLocaleString()} <span className="text-xs text-slate-400 font-normal">units</span>
                    </div>
                </div>

                {/* 7. Accepted QC Stock */}
                <div className="bg-emerald-50/40 border border-emerald-100 rounded-lg p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-medium text-emerald-700 mb-1">
                        <span>Accepted</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div className="text-base font-bold font-mono text-emerald-950">
                        {totalAccepted.toLocaleString()} <span className="text-xs text-slate-400 font-normal">units</span>
                    </div>
                </div>

                {/* 8. Reconciled Value */}
                <div className="bg-indigo-50/40 border border-indigo-100 rounded-lg p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-medium text-indigo-700 mb-1">
                        <span>Valuation</span>
                        <DollarSign className="w-3.5 h-3.5 text-indigo-500" />
                    </div>
                    <div className="text-base font-bold font-mono text-indigo-950 truncate" title={`$${valueEnteringInventory.toLocaleString()}`}>
                        ${valueEnteringInventory.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                </div>

            </div>

            {/* --- STATUS FOOTER BAR --- */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1.5 border-t border-slate-100">
                <div className="flex items-center gap-1.5 font-medium">
                    {variance === 0 ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Fully Accounted Stock (Variance: 0)
                        </span>
                    ) : variance < 0 ? (
                        <span className="text-rose-600 flex items-center gap-1">
                            <TrendingDown className="w-3.5 h-3.5" /> Shortage: {Math.abs(variance).toLocaleString()} units
                        </span>
                    ) : (
                        <span className="text-amber-600 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> Overage: +{variance.toLocaleString()} units
                        </span>
                    )}
                </div>
                <div className="text-slate-400 font-medium">
                    {totalDamaged > 0 ? '⚠️ RMA Claim pending review' : '✓ QC passed with 0 major defects'}
                </div>
            </div>

        </div>
    );
}