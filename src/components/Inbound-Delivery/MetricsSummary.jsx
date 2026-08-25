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

/**
 * MetricsSummary Component
 * 
 * Purpose & Data Binding Intent based on provided JSON Ledger record:
 * 
 * 1. Arrived vs Ordered (Card 1):
 *    - Maps to: `totalReceivedQty` (0) vs `totalExpectedQty` (19,200).
 *    - Intent: Gives dock managers an immediate view of fulfillment rate (0%) and flags the total shortage (-19,200 units) before physical offloading begins.
 * 
 * 2. Damaged / Quarantine (Card 2):
 *    - Maps to: `totalDamagedQty` (0).
 *    - Intent: Tracks quarantined or damaged stock to trigger vendor claims / RMA workflows instantly.
 * 
 * 3. Accepted Stock (Card 3):
 *    - Maps to: Calculated sum of received minus damaged units across items (0 accepted so far).
 *    - Intent: Tracks clean inventory that successfully clears quality control inspection.
 * 
 * 4. Net Stock Value (Card 4):
 *    - Maps to: Sum of (`acceptedQty` * `unitCost`) across items ($0.00 current, with total expected order value at $418,080).
 *    - Intent: Quantifies the total capital value entering or pending entry into warehouse bin storage.
 */
export default function MetricsSummary({ metrics = {} }) {
    // Safe extraction mapping directly from actual ledger calculation or props
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">

            {/* --- CARD 1: ARRIVED / ORDERED --- */}
            <div className="bg-white px-4 py-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
                <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Arrived vs Ordered
                        </span>
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                            <PackageCheck className="w-3.5 h-3.5" />
                        </div>
                    </div>

                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-slate-900 tracking-tight font-mono">
                            {totalReceived.toLocaleString()}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                            / {totalOrdered.toLocaleString()} units
                        </span>
                    </div>
                </div>

                <div className="mt-2.5 space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${fulfillmentPercent}%` }}
                        />
                    </div>

                    <div className="text-[10px] font-semibold flex items-center justify-between">
                        {variance === 0 ? (
                            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 inline-flex items-center gap-1">
                                <Check className="w-2.5 h-2.5 text-emerald-600" /> Fully Accounted
                            </span>
                        ) : variance < 0 ? (
                            <span className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/60 inline-flex items-center gap-1">
                                <TrendingDown className="w-2.5 h-2.5 text-rose-600" /> Shortage: {Math.abs(variance).toLocaleString()}
                            </span>
                        ) : (
                            <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 inline-flex items-center gap-1">
                                <TrendingUp className="w-2.5 h-2.5 text-amber-600" /> Overage: +{variance.toLocaleString()}
                            </span>
                        )}
                        <span className="text-slate-400 font-mono">{fulfillmentPercent}%</span>
                    </div>
                </div>
            </div>

            {/* --- CARD 2: DAMAGED / QUARANTINE --- */}
            <div className="bg-white px-4 py-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden group">
                <div className={`absolute top-0 left-0 right-0 h-1 ${totalDamaged > 0 ? 'bg-rose-500' : 'bg-slate-200'}`} />
                <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Damaged / Quarantine
                        </span>
                        <div className={`p-1.5 rounded-lg ${totalDamaged > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'}`}>
                            <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                    </div>

                    <div className={`text-xl font-bold font-mono tracking-tight ${totalDamaged > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                        {totalDamaged.toLocaleString()} <span className="text-[11px] font-normal text-slate-400 font-sans">units</span>
                    </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100">
                    <p className={`text-[10px] font-semibold flex items-center gap-1 ${totalDamaged > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                        {totalDamaged > 0 ? (
                            <>
                                <span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
                                Logged for Vendor Credit / RMA
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                Zero physical damage reported
                            </>
                        )}
                    </p>
                </div>
            </div>

            {/* --- CARD 3: ACCEPTED STOCK --- */}
            <div className="bg-white px-4 py-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
                <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Accepted Stock
                        </span>
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                    </div>

                    <div className="text-xl font-bold text-emerald-700 font-mono tracking-tight">
                        {totalAccepted.toLocaleString()} <span className="text-[11px] font-normal text-slate-400 font-sans">units</span>
                    </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-semibold text-emerald-700">
                        Passed Quality Control & Inspection
                    </p>
                </div>
            </div>

            {/* --- CARD 4: INVENTORY VALUE --- */}
            <div className="bg-white px-4 py-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500" />
                <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Net Stock Value
                        </span>
                        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                            <DollarSign className="w-3.5 h-3.5" />
                        </div>
                    </div>

                    <div className="text-xl font-bold text-indigo-950 font-mono tracking-tight">
                        ${valueEnteringInventory.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-semibold text-indigo-600">
                        Ready for Warehouse Bin Placement
                    </p>
                </div>
            </div>

        </div>
    );
}