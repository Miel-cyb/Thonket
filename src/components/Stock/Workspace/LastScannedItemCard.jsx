import React from "react";

/**
 * LastScannedItemCard
 * Real-time event monitor display reflecting hardware input registers.
 * Acts as immediate operational verification for warehouse scanner operators.
 */
const LastScannedItemCard = ({ item }) => {
    // EMPTY DATA STATE - WAITING FOR THE FIRST SCAN ENTRY
    if (!item) {
        return (
            <div className="flex flex-col items-center justify-center p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl select-none">
                {/* Standby Pulse Radar Waveform Graphic */}
                <div className="relative flex items-center justify-center w-8 h-8 mb-2 rounded-full bg-slate-100 text-slate-400">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-slate-200 opacity-60 animate-ping" />
                    <svg className="w-4 h-4 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h.01M16 20h2a2 2 0 002-2V6a2 2 0 00-2-2h-2M8 20H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                    </svg>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                    Scanner offline. Awaiting hardware registration...
                </span>
            </div>
        );
    }

    return (
        <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden select-none">

            {/* ==========================================
               LIVE ACTION EVENT LOG CARD HEADER
               ========================================== */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border-b border-slate-950">
                {/* Active Dynamic Pulse Laser Status Light */}
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <h3 className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider">
                    Live Scanner Capture
                </h3>
            </div>

            {/* ==========================================
               METADATA CONTENT ARRAY BOX
               ========================================== */}
            <div className="flex items-center justify-between p-4 gap-4">

                {/* PRODUCT IDENTIFIER FIELD GROUPS */}
                <div className="flex-1 min-w-0 space-y-1">
                    {/* Primary Product Name Mapping */}
                    <h4 className="text-sm font-bold text-slate-800 truncate leading-tight">
                        {item.product || "Unknown Inventory Item"}
                    </h4>

                    {/* Secondary Attributes Row Layout */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        {/* Monospace Code SKU Identifier Badge */}
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">SKU:</span>
                            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1 py-0.5 rounded border border-slate-200/50">
                                {item.sku}
                            </span>
                        </div>

                        {/* Variant Details Identifier String */}
                        {item.variant && (
                            <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">VAR:</span>
                                <span className="font-medium text-slate-600">{item.variant}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ==========================================
                   QUANTITY MASS COUNTER UNIT BADGE
                   ========================================== */}
                <div className="flex flex-col items-center justify-center shrink-0 min-w-[56px] px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600">
                        Count
                    </span>
                    <span className="font-mono text-lg font-black text-emerald-800 leading-none mt-0.5">
                        {item.qty || 1}
                    </span>
                </div>

            </div>

        </div>
    );
};

export default LastScannedItemCard;