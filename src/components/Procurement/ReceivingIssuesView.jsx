
import React from "react";
import {
    AlertTriangle,
    ArrowUpRight,
    MoreHorizontal,
    PackageX,
    ShieldAlert,
    Info
} from "lucide-react";

// RECEIVING ISSUES VIEW - LIVE DISCREPANCY STATE SYNCHRONIZED VERSION
export default function ReceivingIssuesView({ orders = [], selectedPO, setSelectedPO }) {

    // Helper formatter for premium currency rendering
    const formatCurrency = (amount, currencyCode = "GHS") => {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: currencyCode,
        }).format(amount);
    };

    return (
        <div className="flex h-full min-h-0 flex-col rounded-3xl border border-rose-100 bg-white shadow-xs">

            {/* HEADER */}
            <div className="shrink-0 border-b border-rose-100 bg-gradient-to-r from-rose-50 via-white to-white px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold tracking-tight text-slate-900">
                                Receiving Issues
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-400 font-medium">
                                Active shipment discrepancies, shortfalls, and item exceptions.
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/70 px-3 py-1.5">
                        <ShieldAlert size={13} className="text-rose-600 animate-pulse" />
                        <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wide">
                            {Number(orders?.length || 0)} Needs Attention
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
                                <PackageX size={20} />
                            </div>
                            <h3 className="text-sm font-bold text-slate-800">No Discrepancies Found</h3>
                            <p className="text-xs text-slate-400 max-w-xs mt-1">
                                Excellent! All recent freight gate arrivals match their purchase order parameters completely.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3.5">
                            {orders.map((po) => {
                                if (!po || !po._id) return null;

                                // Dynamically tally up items to highlight the magnitude of the receiving shortfall
                                const lineItems = po.items || [];
                                const totalOrdered = lineItems.reduce((sum, item) => sum + (item.quantity || item.qtyOrdered || 0), 0);
                                const totalAccepted = lineItems.reduce((sum, item) => sum + (item.qtyAccepted ?? item.quantity ?? item.qtyOrdered ?? 0), 0);
                                const missingCount = Math.max(0, totalOrdered - totalAccepted);

                                const isHighPriority = po.intent?.priority === "critical" || missingCount > 5;
                                const isSelected = selectedPO?._id === po._id;

                                return (
                                    <div
                                        key={String(po._id)}
                                        onClick={() => setSelectedPO?.(po)}
                                        className={`group rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${isSelected
                                            ? "border-rose-600 bg-rose-50/20 shadow-xs ring-1 ring-rose-600/20"
                                            : "border-slate-200 bg-white shadow-3xs hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">

                                            {/* LEFT TEXT CONTENT SUMMARY */}
                                            <div className="flex items-start gap-4 min-w-0">
                                                <div className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors ${isHighPriority
                                                    ? "bg-rose-100 text-rose-600 group-hover:bg-rose-200"
                                                    : "bg-amber-50 text-amber-600 group-hover:bg-amber-100"
                                                    }`}>
                                                    <AlertTriangle size={18} />
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
                                                        PO Source: <span className="text-slate-600 font-mono">{String(po._id).slice(-6).toUpperCase()}</span> • Handler: <span className="text-slate-600">{String(po.context?.type || "Standard")}</span>
                                                    </p>

                                                    {/* SHORTFALL COUNTERS */}
                                                    <div className="mt-2.5 flex items-center gap-2 flex-wrap text-xs font-semibold">
                                                        <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">
                                                            Received {totalAccepted}/{totalOrdered} Items
                                                        </span>
                                                        {missingCount > 0 ? (
                                                            <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                                <Info size={10} /> Shortfallage (-{missingCount})
                                                            </span>
                                                        ) : (
                                                            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">
                                                                Damaged Variant Exception
                                                            </span>
                                                        )}
                                                        <span className="text-slate-900 font-bold ml-1">
                                                            {formatCurrency(po.pricing?.totalCost || 0, po.pricing?.currency)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* RIGHT INTERACTIVE STATUS CONTROLS */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider ${isHighPriority
                                                    ? "bg-rose-100 text-rose-700 animate-pulse"
                                                    : "bg-amber-100 text-amber-800"
                                                    }`}>
                                                    {isHighPriority ? "CRITICAL DISCREPANCY" : "UNDER REVIEW"}
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