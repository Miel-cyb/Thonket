import React from "react";
import {
    CheckCircle,
    Send,
    ArrowUpRight,
    MoreVertical,
    BadgeCheck,
} from "lucide-react";

// APPROVED ORDERS VIEW - MODERN PROCUREMENT CARD
export default function ApprovedOrdersView() {

    const mockOrders = [
        {
            id: "PO-101",
            supplier: "Accra Market Ltd",
            value: 12000,
            status: "approved",
        },
        {
            id: "PO-102",
            supplier: "Tema Retail Hub",
            value: 8200,
            status: "sent",
        },
    ];

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-lg">

            {/* HEADER */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-white px-5 py-4">

                <div className="flex items-center justify-between">

                    {/* LEFT */}
                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100">
                            <CheckCircle
                                size={20}
                                className="text-emerald-700"
                            />
                        </div>

                        <div>
                            <h2 className="text-base font-bold tracking-tight text-slate-900">
                                Approved Orders
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Purchase orders approved and ready for processing.
                            </p>
                        </div>
                    </div>

                    {/* STATUS */}
                    <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">

                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />

                        <span className="text-xs font-semibold text-emerald-700">
                            Live Updates
                        </span>
                    </div>
                </div>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-auto bg-slate-50/50 p-4">

                <div className="space-y-4">

                    {mockOrders.map((order) => (
                        <div
                            key={order.id}
                            className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg"
                        >

                            <div className="flex items-start justify-between">

                                {/* LEFT CONTENT */}
                                <div className="flex items-start gap-4">

                                    {/* ICON */}
                                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 transition group-hover:bg-emerald-100">

                                        {order.status === "approved" ? (
                                            <BadgeCheck
                                                size={18}
                                                className="text-emerald-600"
                                            />
                                        ) : (
                                            <Send
                                                size={18}
                                                className="text-blue-600"
                                            />
                                        )}
                                    </div>

                                    {/* DETAILS */}
                                    <div>

                                        <div className="flex items-center gap-2">

                                            <h3 className="text-sm font-bold text-slate-900">
                                                {order.supplier}
                                            </h3>

                                            <ArrowUpRight
                                                size={14}
                                                className="text-slate-300 transition group-hover:text-slate-600"
                                            />
                                        </div>

                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">

                                            <span className="rounded-lg bg-slate-100 px-2 py-1 font-medium text-slate-600">
                                                {order.id}
                                            </span>

                                            <span>•</span>

                                            <span className="font-semibold text-slate-700">
                                                GHS {order.value.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT */}
                                <div className="flex items-center gap-3">

                                    {/* STATUS BADGE */}
                                    <span
                                        className={`rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide ${order.status === "approved"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-blue-100 text-blue-700"
                                            }`}
                                    >
                                        {order.status.toUpperCase()}
                                    </span>

                                    {/* ACTION */}
                                    <button className="opacity-0 transition group-hover:opacity-100">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                                            <MoreVertical size={16} />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* EMPTY SPACING FIX */}
                <div className="h-2" />
            </div>
        </div>
    );
}