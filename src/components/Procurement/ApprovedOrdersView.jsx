import React from "react";
import {
    CheckCircle,
    Send,
    ArrowUpRight,
    MoreVertical,
    BadgeCheck,
    FileCheck,
    Inbox
} from "lucide-react";

// APPROVED ORDERS VIEW - SYNCHRONIZED REAL DATA LAYER
export default function ApprovedOrdersView({ orders = [], selectedPO, setSelectedPO }) {

    // Standardized localized pricing formatting engine
    const formatCurrency = (amount, currencyCode = "GHS") => {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: currencyCode,
        }).format(amount);
    };

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-xs">

            {/* HEADER */}
            <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50/60 via-white to-white px-5 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <CheckCircle size={20} />
                        </div>

                        <div>
                            <h2 className="text-base font-bold tracking-tight text-slate-900">
                                Approved Orders
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-400 font-medium">
                                Validated purchase profiles authorized for vendor dispatch.
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                            {orders.length} Ready Frameworks
                        </span>
                    </div>
                </div>
            </div>

            {/* CONTENT SLICE SCROLL LAYER */}
            <div className="flex-1 overflow-y-auto bg-slate-50/30 p-4">
                {orders.length === 0 ? (
                    /* EMPTY DOCUMENT PIPELINE COMPONENT STATE */
                    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-white my-2">
                        <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
                            <Inbox size={20} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">No Orders Approved</h3>
                        <p className="text-xs text-slate-400 max-w-xs mt-1">
                            Awaiting validation signatures on current open purchase intents to release operations here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => {
                            const isSelected = selectedPO?._id === order._id;
                            const isSubmitted = order.documentStatus === "submitted";
                            const isNotShipped = order.shipmentTracking?.status === "not_shipped";

                            return (
                                <div
                                    key={order._id}
                                    onClick={() => setSelectedPO?.(order)}
                                    className={`
                                        group rounded-2xl border p-4 transition-all duration-200 cursor-pointer
                                        ${isSelected
                                            ? "border-emerald-600 bg-emerald-50/20 shadow-3xs ring-1 ring-emerald-600/20"
                                            : "border-slate-200 bg-white shadow-3xs hover:-translate-y-0.5 hover:border-emerald-300/80 hover:shadow-sm"
                                        }
                                    `}
                                >
                                    <div className="flex items-start justify-between gap-4">

                                        {/* LEFT CONTENT */}
                                        <div className="flex items-start gap-4 min-w-0">
                                            {/* CONTEXT ACCENT BADGE */}
                                            <div className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors ${isSubmitted
                                                    ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
                                                    : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                                                }`}>
                                                {isNotShipped ? <BadgeCheck size={18} /> : <Send size={18} />}
                                            </div>

                                            {/* DESCRIPTION STRIPS */}
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-sm font-bold text-slate-900 truncate">
                                                        {order.context?.title || "Untitled Allocation Framework"}
                                                    </h3>
                                                    <ArrowUpRight
                                                        size={14}
                                                        className="text-slate-300 transition-colors group-hover:text-slate-600 shrink-0"
                                                    />
                                                </div>

                                                <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">
                                                    Logistics Tier: <span className="text-slate-600 font-semibold">{order.logistics?.deliveryType || "unassigned"}</span> • ID: <span className="font-mono">{order._id?.slice(-6).toUpperCase()}</span>
                                                </p>

                                                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-500 text-[10px] tracking-wide uppercase border border-slate-200/40">
                                                        {order.payment?.terms || "no terms"}
                                                    </span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="font-extrabold text-slate-900">
                                                        {formatCurrency(order.pricing?.totalCost || 0, order.pricing?.currency)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT CONFIGURATIONS */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`
                                                flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider
                                                ${isSubmitted
                                                    ? "bg-emerald-100/80 text-emerald-700"
                                                    : "bg-blue-100/80 text-blue-700"
                                                }
                                            `}>
                                                <FileCheck size={10} />
                                                {order.documentStatus?.toUpperCase() || "RELEASED"}
                                            </span>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-700">
                                                    <MoreVertical size={14} />
                                                </div>
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="h-2" />
            </div>
        </div>
    );
}