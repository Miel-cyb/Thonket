import React from "react";
import {
    Trophy,
    ArrowUpRight,
    MoreHorizontal,
    PackageCheck,
    CheckCircle2,
    History
} from "lucide-react";

// COMPLETED PROCUREMENT VIEW - LIVE DATA STATE SYNCHRONIZED VERSION
export default function CompletedView({ orders = [], selectedPO, setSelectedPO }) {

    // Helper formatter for pricing displays matching core view conventions
    const formatCurrency = (amount, currencyCode = "GHS") => {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: currencyCode,
        }).format(amount);
    };

    return (
        <div className="flex h-full min-h-0 flex-col rounded-3xl border border-slate-200/70 bg-white shadow-xs">

            {/* HEADER */}
            <div className="shrink-0 border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-white px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <Trophy size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold tracking-tight text-slate-900">
                                Completed Procurement
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-400 font-medium">
                                Successfully processed and archived purchase logs.
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/70 px-3 py-1.5">
                        <History size={13} className="text-emerald-600" />
                        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                            {Number(orders?.length || 0)} Finalized
                        </span>
                    </div>
                </div>
            </div>

            {/* SCROLLABLE WORKSPACE CONTAINER */}
            <div className="flex-1 min-h-0 bg-slate-50/30">
                <div className="h-full overflow-y-auto px-6 py-5">

                    {!orders || orders.length === 0 ? (
                        /* EMPTY BACKEND PIPELINE COMPONENT STATE */
                        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-white my-4">
                            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
                                <PackageCheck size={20} />
                            </div>
                            <h3 className="text-sm font-bold text-slate-800">No Completed Records</h3>
                            <p className="text-xs text-slate-400 max-w-xs mt-1">
                                Sourced records auto-archive here after the matching workflow has been verified and signed off.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3.5">
                            {orders.map((po) => {
                                if (!po || !po._id) return null;

                                const lineItems = po.items || [];
                                const totalTargetQty = lineItems.reduce((sum, item) => sum + (item.quantity || item.qtyOrdered || 0), 0);
                                const isSelected = selectedPO?._id === po._id;

                                return (
                                    <div
                                        key={String(po._id)}
                                        onClick={() => setSelectedPO?.(po)}
                                        className={`group rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${isSelected
                                            ? "border-emerald-600 bg-emerald-50/20 shadow-xs ring-1 ring-emerald-600/20"
                                            : "border-slate-200 bg-white shadow-3xs hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">

                                            {/* LEFT TEXT CONTENT SUMMARY */}
                                            <div className="flex items-start gap-4 min-w-0">
                                                <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                                                    <PackageCheck size={18} />
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="text-sm font-bold text-slate-900 truncate">
                                                            {String(po.supplier || po.context?.title || "Unknown Supplier")}
                                                        </h3>
                                                        <ArrowUpRight
                                                            size={14}
                                                            className="text-slate-300 transition-colors group-hover:text-slate-500 shrink-0"
                                                        />
                                                    </div>

                                                    <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">
                                                        Type: <span className="text-slate-600">{String(po.context?.type || "Standard")}</span> • ID: <span className="font-mono">{String(po._id).slice(-6).toUpperCase()}</span>
                                                    </p>

                                                    {/* QUANTITY & PRICING DISPLAY METRICS */}
                                                    <div className="mt-2.5 flex items-center gap-3 text-xs font-semibold text-slate-500">
                                                        <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">
                                                            {lineItems.length} {lineItems.length === 1 ? 'line item' : 'line items'} ({Number(totalTargetQty)} items)
                                                        </span>
                                                        <span className="text-emerald-700 font-bold">
                                                            {formatCurrency(po.pricing?.totalCost || 0, po.pricing?.currency)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* RIGHT INTERACTIVE STATUS CONTROLS */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-700">
                                                    <CheckCircle2 size={11} />
                                                    COMPLETED
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                    className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                                                >
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-700">
                                                        <MoreHorizontal size={14} />
                                                    </div>
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="h-4" />
                </div>
            </div>
        </div>
    );
}