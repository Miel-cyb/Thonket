import React from 'react';
import {
    PackageCheck,
    AlertTriangle,
    CheckCircle2,
    DollarSign,
    TrendingDown,
    TrendingUp,
    Check
} from 'lucide-react';

export default function MetricsSummary({ metrics = {} }) {
    // Safe extraction with default fallback values
    const totalOrdered = metrics.totalOrdered || 0;
    const totalReceived = metrics.totalReceived || 0;
    const totalDamaged = metrics.totalDamaged || 0;
    const totalAccepted = metrics.totalAccepted || 0;
    const variance = metrics.variance || 0;
    const valueEnteringInventory = metrics.valueEnteringInventory || 0;

    // Calculate percentage fulfilled for visual progress bar
    const fulfillmentPercent = totalOrdered > 0
        ? Math.min(100, Math.round((totalReceived / totalOrdered) * 100))
        : 0;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* --- CARD 1: ARRIVED / ORDERED --- */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 rounded-t-2xl" />
                <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Arrived vs Ordered
                        </span>
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
                            <PackageCheck className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                            {totalReceived.toLocaleString()}
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                            / {totalOrdered.toLocaleString()} units
                        </span>
                    </div>
                </div>

                {/* Fulfillment Bar & Variance Pill */}
                <div className="mt-4 space-y-2 pt-3 border-t border-slate-100">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${fulfillmentPercent}%` }}
                        />
                    </div>

                    <div className="text-[11px] font-semibold flex items-center justify-between">
                        {variance === 0 ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 inline-flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" /> Fully Accounted
                            </span>
                        ) : variance < 0 ? (
                            <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60 inline-flex items-center gap-1">
                                <TrendingDown className="w-3 h-3 text-rose-600" /> Shortage: {Math.abs(variance).toLocaleString()}
                            </span>
                        ) : (
                            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 inline-flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-amber-600" /> Overage: +{variance.toLocaleString()}
                            </span>
                        )}
                        <span className="text-slate-400 font-mono">{fulfillmentPercent}%</span>
                    </div>
                </div>
            </div>

            {/* --- CARD 2: DAMAGED / QUARANTINE --- */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${totalDamaged > 0 ? 'bg-rose-500' : 'bg-slate-200'}`} />
                <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Damaged / Quarantine
                        </span>
                        <div className={`p-2 rounded-xl group-hover:scale-105 transition-transform ${totalDamaged > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'}`}>
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                    </div>

                    <div className={`text-2xl font-bold font-mono tracking-tight ${totalDamaged > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                        {totalDamaged.toLocaleString()} <span className="text-xs font-normal text-slate-400 font-sans">units</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className={`text-[11px] font-semibold flex items-center gap-1.5 ${totalDamaged > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                        {totalDamaged > 0 ? (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                Logged for Vendor Credit / RMA
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                Zero physical damage reported
                            </>
                        )}
                    </p>
                </div>
            </div>

            {/* --- CARD 3: ACCEPTED STOCK --- */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-2xl" />
                <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Accepted Stock
                        </span>
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="text-2xl font-bold text-emerald-700 font-mono tracking-tight">
                        {totalAccepted.toLocaleString()} <span className="text-xs font-normal text-slate-400 font-sans">units</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        Passed Quality Control & Inspection
                    </p>
                </div>
            </div>

            {/* --- CARD 4: INVENTORY VALUE --- */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 rounded-t-2xl" />
                <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Net Stock Value
                        </span>
                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
                            <DollarSign className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="text-2xl font-bold text-indigo-950 font-mono tracking-tight">
                        ${valueEnteringInventory.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-semibold text-indigo-600">
                        Ready for Warehouse Bin Placement
                    </p>
                </div>
            </div>

        </div>
    );
}