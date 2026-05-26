
// ===============================
// components/PurchaseForm/PurchaseCreateHeader.jsx
// ===============================

import React from "react";
import { ArrowLeft, FileText } from "lucide-react";

export default function PurchaseCreateHeader({
    step,
    totalSteps,
    onBackPage
}) {
    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4 shadow-xs backdrop-blur-md bg-white/95">

            <div className="max-w-[1660px] w-full mx-auto flex items-center justify-between gap-4">

                {/* LEFT SECTION */}
                <div className="flex items-center gap-4 min-w-0">

                    {/* BACK BUTTON */}
                    <button
                        onClick={onBackPage}
                        className="flex items-center justify-center h-11 w-11 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition shrink-0"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    {/* ICON */}
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                        <FileText size={20} className="stroke-[2.5]" />
                    </div>

                    {/* TITLE */}
                    <div className="min-w-0">
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight truncate">
                            Create Purchase Order
                        </h1>

                        <p className="text-sm text-slate-500 hidden sm:block">
                            Procurement Management System Dashboard
                        </p>
                    </div>

                </div>

                {/* STEP BADGE */}
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200/80 px-3.5 py-2 rounded-xl text-sm font-bold text-slate-700 shrink-0">

                    <span className="tracking-wide uppercase text-xs text-slate-500">
                        Step
                    </span>

                    <span className="bg-white text-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-200/60 shadow-3xs">
                        {step} / {totalSteps}
                    </span>

                </div>

            </div>

        </header>
    );
}