import React from 'react';
import { X, CheckCircle2, ShieldAlert, AlertTriangle, PackageCheck } from 'lucide-react';

// Modal for resolving discrepancies in received items, 
// displaying server-backed damaged and shortage values alongside the received quantity input on a horizontal grid,
// and providing separate input fields to type replacement items only when those discrepancies are greater than zero.
export default function ResolutionModal({
    isOpen,
    onClose,
    modalItems,
    onModalItemChange,
    onSaveModalResolution
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto font-sans">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto border border-slate-100">

                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
                    <div>
                        <h3 className="text-sm font-black text-slate-900 tracking-tight">Discrepancy Resolution & Replacements</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Review reported quantities, damages, and shortages, and specify replacements below.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-5 overflow-y-auto flex flex-col gap-4 flex-1 bg-slate-50/40">
                    {modalItems.map((item) => {
                        const ordered = item.tempOrderedQty || 0;
                        const damaged = Number(item.tempDamagedQty || 0);
                        const shortage = Number(item.tempShortageQty || 0);

                        // Calculated fallback if tempReceivedQty is not yet set
                        const defaultReceived = Math.max(0, ordered - shortage - damaged);
                        const receivedQty = item.tempReceivedQty !== undefined && item.tempReceivedQty !== ''
                            ? Number(item.tempReceivedQty)
                            : defaultReceived;

                        const isZeroReceived = receivedQty === 0;
                        const hasDamaged = damaged > 0;
                        const hasShortage = shortage > 0;
                        const hasIssues = hasDamaged || hasShortage || isZeroReceived;

                        return (
                            <div
                                key={item.id}
                                className={`p-4 rounded-xl border transition-all flex flex-col gap-3.5 shadow-xs ${hasIssues
                                    ? 'border-amber-200 bg-white ring-1 ring-amber-500/10'
                                    : 'border-slate-200/80 bg-white/70'
                                    }`}
                            >
                                {/* Item Header Row */}
                                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <span className="font-extrabold text-slate-900 text-sm tracking-tight">{item.name}</span>
                                        {hasIssues ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md">
                                                <AlertTriangle className="w-3 h-3 text-amber-600" /> Discrepancy Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> All Clear
                                            </span>
                                        )}
                                    </div>
                                    <div className="font-mono text-xs text-slate-700 bg-slate-100/80 px-2.5 py-1 rounded-lg font-bold border border-slate-200/60">
                                        Ordered: <span className="text-slate-900">{ordered}</span>
                                    </div>
                                </div>

                                {/* Received, Damaged & Shortage Horizontal Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                                    {/* 1. Received Quantity Field */}
                                    <div className={`p-3 rounded-lg border flex flex-col gap-2 ${isZeroReceived ? 'bg-amber-50/20 border-amber-200' : 'bg-slate-50/60 border-slate-200/60'}`}>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[11px] font-bold uppercase tracking-wide flex items-center gap-1 ${isZeroReceived ? 'text-amber-800' : 'text-slate-600'}`}>
                                                <PackageCheck className="w-3.5 h-3.5" /> Received Qty
                                            </span>
                                            {isZeroReceived && (
                                                <span className="text-[10px] text-amber-700 font-bold">Needs Input</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <input
                                                type="number"
                                                min="0"
                                                max={ordered}
                                                value={item.tempReceivedQty !== undefined ? item.tempReceivedQty : defaultReceived}
                                                onChange={(e) => onModalItemChange(item.id, 'tempReceivedQty', e.target.value)}
                                                placeholder="Enter qty..."
                                                className="w-full rounded-lg px-3 py-1.5 font-mono text-xs font-bold bg-white border border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* 2. Damaged Section */}
                                    <div className={`p-3 rounded-lg border flex flex-col gap-2.5 ${hasDamaged ? 'bg-rose-50/20 border-rose-200' : 'bg-slate-50/60 border-slate-200/60'}`}>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[11px] font-bold uppercase tracking-wide flex items-center gap-1 ${hasDamaged ? 'text-rose-700' : 'text-slate-400'}`}>
                                                <ShieldAlert className="w-3.5 h-3.5" /> Damaged
                                            </span>
                                            <span className={`font-mono text-xs font-black px-2 py-0.5 rounded-md ${hasDamaged ? 'bg-rose-100 text-rose-900' : 'bg-slate-200 text-slate-500'}`}>
                                                {damaged}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                                <label className={`text-[11px] font-bold uppercase tracking-wider ${hasDamaged ? 'text-slate-800' : 'text-slate-400'}`}>
                                                    Replace
                                                </label>
                                                {!hasDamaged && (
                                                    <span className="text-[10px] text-slate-400 font-medium">Locked (0)</span>
                                                )}
                                            </div>
                                            <input
                                                type="number"
                                                min="0"
                                                disabled={!hasDamaged}
                                                value={hasDamaged ? (item.tempDamagedReplacementQty || '') : 0}
                                                onChange={(e) => onModalItemChange(item.id, 'tempDamagedReplacementQty', e.target.value)}
                                                placeholder={hasDamaged ? "Qty..." : "None"}
                                                className={`w-full rounded-lg px-3 py-1.5 font-mono text-xs font-bold focus:outline-none transition-all ${hasDamaged
                                                    ? 'bg-white border border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10'
                                                    : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed select-none'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* 3. Shortage Section */}
                                    <div className={`p-3 rounded-lg border flex flex-col gap-2.5 ${hasShortage ? 'bg-amber-50/20 border-amber-200' : 'bg-slate-50/60 border-slate-200/60'}`}>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[11px] font-bold uppercase tracking-wide flex items-center gap-1 ${hasShortage ? 'text-amber-800' : 'text-slate-400'}`}>
                                                <AlertTriangle className="w-3.5 h-3.5" /> Shortage
                                            </span>
                                            <span className={`font-mono text-xs font-black px-2 py-0.5 rounded-md ${hasShortage ? 'bg-amber-100 text-amber-950' : 'bg-slate-200 text-slate-500'}`}>
                                                {shortage}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                                <label className={`text-[11px] font-bold uppercase tracking-wider ${hasShortage ? 'text-slate-800' : 'text-slate-400'}`}>
                                                    Replace
                                                </label>
                                                {!hasShortage && (
                                                    <span className="text-[10px] text-slate-400 font-medium">Locked (0)</span>
                                                )}
                                            </div>
                                            <input
                                                type="number"
                                                min="0"
                                                disabled={!hasShortage}
                                                value={hasShortage ? (item.tempShortageReplacementQty || '') : 0}
                                                onChange={(e) => onModalItemChange(item.id, 'tempShortageReplacementQty', e.target.value)}
                                                placeholder={hasShortage ? "Qty..." : "None"}
                                                className={`w-full rounded-lg px-3 py-1.5 font-mono text-xs font-bold focus:outline-none transition-all ${hasShortage
                                                    ? 'bg-white border border-amber-300 text-amber-950 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10'
                                                    : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed select-none'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Reason / Notes Field */}
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                                        Resolution Notes / Reason
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter details or notes regarding this discrepancy..."
                                        value={item.tempReason || ''}
                                        onChange={(e) => onModalItemChange(item.id, 'tempReason', e.target.value)}
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Buttons */}
                <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end gap-2.5 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSaveModalResolution}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer flex items-center gap-1.5"
                    >
                        <CheckCircle2 className="w-4 h-4" /> Save Adjustments
                    </button>
                </div>
            </div>
        </div>
    );
}