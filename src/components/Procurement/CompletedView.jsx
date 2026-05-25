import React from "react";
import {
    CheckCircle2,
    Trophy,
    ArrowUpRight,
    MoreHorizontal,
    PackageCheck,
} from "lucide-react";

// COMPLETED PROCUREMENT VIEW - PREMIUM UI CARD
export default function CompletedView() {

    const mockCompleted = [
        { id: "PO-201", supplier: "Tema Hub", status: "completed" },
        { id: "PO-202", supplier: "Accra Market", status: "completed" },
    ];

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-lg">

            {/* HEADER */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-white px-5 py-4">

                <div className="flex items-center justify-between">

                    {/* LEFT */}
                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100">
                            <Trophy size={20} className="text-emerald-700" />
                        </div>

                        <div>
                            <h2 className="text-base font-bold tracking-tight text-slate-900">
                                Completed Procurement
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Successfully processed and closed purchase orders.
                            </p>
                        </div>
                    </div>

                    {/* STATUS INDICATOR */}
                    <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">

                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />

                        <span className="text-xs font-semibold text-emerald-700">
                            Finalized
                        </span>
                    </div>
                </div>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-auto bg-slate-50/40 p-4">

                <div className="space-y-4">

                    {mockCompleted.map((item) => (
                        <div
                            key={item.id}
                            className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg"
                        >

                            <div className="flex items-start justify-between">

                                {/* LEFT SIDE */}
                                <div className="flex items-start gap-4">

                                    {/* ICON */}
                                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 transition group-hover:bg-emerald-100">
                                        <PackageCheck size={18} className="text-emerald-600" />
                                    </div>

                                    {/* DETAILS */}
                                    <div>

                                        <div className="flex items-center gap-2">

                                            <h3 className="text-sm font-bold text-slate-900">
                                                {item.supplier}
                                            </h3>

                                            <ArrowUpRight
                                                size={14}
                                                className="text-slate-300 transition group-hover:text-slate-600"
                                            />
                                        </div>

                                        <p className="mt-2 text-xs text-slate-500">
                                            {item.id}
                                        </p>
                                    </div>
                                </div>

                                {/* RIGHT SIDE */}
                                <div className="flex items-center gap-3">

                                    {/* STATUS BADGE */}
                                    <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-bold tracking-wide text-emerald-700">
                                        COMPLETED
                                    </span>

                                    {/* ACTION MENU */}
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

                {/* spacing fix */}
                <div className="h-2" />
            </div>
        </div>
    );
}