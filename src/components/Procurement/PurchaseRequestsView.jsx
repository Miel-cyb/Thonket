import React from "react";
import {
    ClipboardList,
    AlertCircle,
    ArrowUpRight,
    MoreHorizontal,
    Clock,
    CheckCircle2,
} from "lucide-react";

// PURCHASE REQUESTS VIEW - FLUID WORKSPACE FRIENDLY VERSION
export default function PurchaseRequestsView() {

    const mockRequests = [
        { id: "PR-001", supplier: "Akosua Foods", items: 12, status: "pending" },
        { id: "PR-002", supplier: "Tema Wholesale", items: 8, status: "approved" },
        { id: "PR-003", supplier: "Makola Traders", items: 20, status: "pending" },
    ];

    return (
        <div className="flex h-full min-h-0 flex-col rounded-3xl border border-slate-200/70 bg-white shadow-lg">

            {/* HEADER (FIXED HEIGHT, NO SCROLL IMPACT) */}
            <div className="shrink-0 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-white px-6 py-4">

                <div className="flex items-center justify-between">

                    {/* LEFT */}
                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100">
                            <ClipboardList size={20} className="text-slate-700" />
                        </div>

                        <div>
                            <h2 className="text-base font-bold tracking-tight text-slate-900">
                                Purchase Requests
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Incoming procurement requests awaiting review.
                            </p>
                        </div>
                    </div>

                    {/* STATUS */}
                    <div className="hidden md:flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5">

                        <Clock size={14} className="text-yellow-600" />

                        <span className="text-xs font-semibold text-yellow-700">
                            Pending Review
                        </span>
                    </div>
                </div>
            </div>

            {/* BODY - THIS IS THE IMPORTANT FIX */}
            <div className="flex-1 min-h-0 bg-slate-50/40">

                {/* ONLY THIS AREA SCROLLS (NOT THE WHOLE CARD) */}
                <div className="h-full overflow-y-auto px-6 py-5">

                    <div className="space-y-4">

                        {mockRequests.map((req) => (
                            <div
                                key={req.id}
                                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
                            >

                                <div className="flex items-start justify-between">

                                    {/* LEFT */}
                                    <div className="flex items-start gap-4">

                                        <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 transition group-hover:bg-slate-200">
                                            <ClipboardList size={18} className="text-slate-600" />
                                        </div>

                                        <div>

                                            <div className="flex items-center gap-2">

                                                <h3 className="text-sm font-bold text-slate-900">
                                                    {req.supplier}
                                                </h3>

                                                <ArrowUpRight
                                                    size={14}
                                                    className="text-slate-300 transition group-hover:text-slate-600"
                                                />
                                            </div>

                                            <p className="mt-2 text-xs text-slate-500">
                                                {req.items} items • {req.id}
                                            </p>
                                        </div>
                                    </div>

                                    {/* RIGHT */}
                                    <div className="flex items-center gap-3">

                                        {/* STATUS BADGE */}
                                        <span
                                            className={`
                                                flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide
                                                ${req.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-emerald-100 text-emerald-700"
                                                }
                                            `}
                                        >
                                            {req.status === "pending" ? (
                                                <>
                                                    <AlertCircle size={12} />
                                                    PENDING
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 size={12} />
                                                    APPROVED
                                                </>
                                            )}
                                        </span>

                                        {/* ACTION */}
                                        <button className="opacity-0 transition group-hover:opacity-100">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                                                <MoreHorizontal size={16} />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* bottom breathing space */}
                    <div className="h-6" />
                </div>
            </div>
        </div>
    );
}