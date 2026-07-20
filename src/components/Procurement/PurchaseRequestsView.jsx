import React from "react";
import {
    ClipboardList,
    AlertCircle,
    ArrowUpRight,
    MoreHorizontal,
    Clock,
    ShoppingBag,
} from "lucide-react";
// Import your detailed visualization component 
import PurchaseOrderDetailView from "../../pages/PurchaseOrderDetailView";

// PURCHASE REQUESTS VIEW - LIVE DATA STATE SYNCHRONIZED VERSION
export default function PurchaseRequestsView({ orders = [], selectedPO, setSelectedPO, onUpdateCycleState }) {

    // Helper formatter for pricing displays
    const formatCurrency = (amount, currencyCode = "GHS") => {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: currencyCode,
        }).format(amount);
    };

    // --- CONDITIONALLY RENDER DETAIL ROUTE IF AN ENTRY IS SELECTED ---
    if (selectedPO) {
        return (
            <PurchaseOrderDetailView
                selectedPO={selectedPO}
                onClose={() => setSelectedPO?.(null)}
                onUpdateCycleState={onUpdateCycleState}
            />
        );
    }

    return (
        <div className="flex h-full min-h-0 flex-col rounded-3xl border border-slate-200/70 bg-white shadow-xs">

            {/* HEADER */}
            <div className="shrink-0 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-white px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                            <ClipboardList size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold tracking-tight text-slate-900">
                                Purchase Requests
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-400 font-medium">
                                Incoming procurement intents requiring workflow validation.
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/70 px-3 py-1.5">
                        <Clock size={13} className="text-amber-600 animate-spin-slow" />
                        <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                            {orders.length} Awaiting Action
                        </span>
                    </div>
                </div>
            </div>

            {/* SCROLLABLE WORKSPACE CONTAINER */}
            <div className="flex-1 min-h-0 bg-slate-50/30">
                <div className="h-full overflow-y-auto px-6 py-5">

                    {orders.length === 0 ? (
                        /* EMPTY BACKEND PIPELINE COMPONENT STATE */
                        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-white my-4">
                            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
                                <ShoppingBag size={20} />
                            </div>
                            <h3 className="text-sm font-bold text-slate-800">No Pending Requests</h3>
                            <p className="text-xs text-slate-400 max-w-xs mt-1">
                                All submitted purchasing intents have been managed or advanced to validation pools.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3.5">
                            {orders.map((po) => {
                                const itemCount = po.items?.reduce((sum, item) => sum + (item.qtyOrdered || item.quantity || 0), 0) || 0;
                                const isCritical = po.intent?.priority === "critical";
                                const isSelected = selectedPO?._id === po._id;

                                // Safe supplier name evaluation parser to prevent rendering an Object node
                                const derivedSupplierName =
                                    po.supplier && typeof po.supplier === "string"
                                        ? po.supplier
                                        : (po.context?.title || po.supplier?.name || `PO Asset Line (ID: ${String(po._id).slice(-4)})`);

                                return (
                                    <div
                                        key={po._id}
                                        onClick={() => setSelectedPO?.(po)}
                                        className={`
                                            group rounded-2xl border p-4 transition-all duration-200 cursor-pointer
                                            ${isSelected
                                                ? "border-indigo-600 bg-indigo-50/30 shadow-xs ring-1 ring-indigo-600/20"
                                                : "border-slate-200 bg-white shadow-3xs hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                                            }
                                        `}
                                    >
                                        <div className="flex items-start justify-between gap-4">

                                            {/* LEFT TEXT CONTENT SUMMARY */}
                                            <div className="flex items-start gap-4 min-w-0">
                                                <div className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors ${isCritical
                                                    ? "bg-rose-50 text-rose-600 group-hover:bg-rose-100"
                                                    : "bg-slate-100 text-slate-600 group-hover:bg-slate-200/80"
                                                    }`}>
                                                    <ClipboardList size={18} />
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="text-sm font-bold text-slate-900 truncate">
                                                            {derivedSupplierName}
                                                        </h3>
                                                        <ArrowUpRight
                                                            size={14}
                                                            className="text-slate-300 transition-colors group-hover:text-slate-500 shrink-0"
                                                        />
                                                    </div>

                                                    <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">
                                                        Type: <span className="text-slate-600">{po.context?.type || "Standard"}</span> • ID: <span className="font-mono">{po._id?.slice(-6).toUpperCase()}</span>
                                                    </p>

                                                    <div className="mt-2.5 flex items-center gap-3 text-xs font-semibold text-slate-500">
                                                        <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">
                                                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                                        </span>
                                                        <span className="text-slate-900 font-bold">
                                                            {formatCurrency(po.pricing?.totalCost || 0, po.pricing?.currency)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* RIGHT INTERACTIVE STATUS CONTROLS */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className={`
                                                    flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider
                                                    ${isCritical
                                                        ? "bg-rose-100 text-rose-700 animate-pulse"
                                                        : "bg-slate-100 text-slate-600"
                                                    }
                                                `}>
                                                    {isCritical && <AlertCircle size={11} />}
                                                    {po.intent?.priority?.toUpperCase() || "ROUTINE"}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedPO?.(po);
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